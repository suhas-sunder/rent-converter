import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {setup} from './fixtures.mjs';

// Isolated synthetic contexts only. Never attach to a user's browser or log
// headers, bodies, cookies, storage contents, query strings or URL fragments.
const candidates = JSON.parse(await fs.readFile(process.env.QA_CANDIDATES ?? new URL('./candidates.json', import.meta.url), 'utf8'));
const selected = candidates.filter(c => !process.env.QA_ONLY || process.env.QA_ONLY.split(',').includes(c.id));
const output = path.resolve(process.env.QA_OUTPUT ?? 'artifacts');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { started: new Date().toISOString(), node: process.version, browser: browser.version(), candidates: [] };
const widths = [360, 390, 768, 1280, 1440];
const forbidden = /(^|\.)(posthog\.com|posthog\.io|google-analytics\.com|googletagmanager\.com|googlesyndication\.com|doubleclick\.net|googleadservices\.com)$/i;
const cleanUrl = raw => { const u = new URL(raw); return u.origin + u.pathname; };
const text = page => page.locator('body').innerText();
async function capture(page, file) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, file), fullPage: true, animations: 'disabled' });
}
async function gate(result, name, fn) {
  try { const evidence = await fn(); result.gates.push({name,pass:true,evidence}); }
  catch(error) { result.gates.push({name,pass:false,error:String(error.message)}); console.log(result.id + ': FAIL ' + name + ' — ' + error.message); }
}
for (const candidate of selected) {
  const origin = process.env.QA_ORIGIN ?? candidate.origin;
  const url = origin + candidate.path;
  const host = new URL(origin).hostname;
  if (!['localhost','127.0.0.1'].includes(host) && !/^[a-f0-9]{24}--rent-converter\.netlify\.app$/.test(host)) throw new Error('Only local or immutable RentConverter preview origins are allowed; never production');
  const result = {...candidate, origin, ...(process.env.QA_ORIGIN ? {sha:process.env.QA_SOURCE_SHA ?? null, referenceCandidateSha:candidate.sha} : {}), gates:[]};
  report.candidates.push(result);
  console.log('Checking ' + candidate.id + ' ' + url);
  const nojs = await browser.newContext({javaScriptEnabled:false, viewport:{width:390,height:844}});
  const nojsPage = await nojs.newPage();
  const nojsRequests = [];
  nojsPage.on('request',r=>nojsRequests.push({url:cleanUrl(r.url()),type:r.resourceType()}));
  await gate(result,'javascript-disabled',async()=>{
    await nojsPage.goto(url,{waitUntil:'networkidle'});
    assert.match(await text(nojsPage), /JavaScript is off/);
    if(candidate.id==='w02') await nojsPage.getByText('Check your take-home housing budget',{exact:true}).click();
    if(candidate.id==='w03') await nojsPage.getByText('Plan for your next rent due date',{exact:true}).click();
    const controls = await nojsPage.locator('main input, main select, main button, main textarea').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,id:e.id,text:e.getAttribute('aria-label') ?? e.textContent?.trim().slice(0,70),disabled:e.matches(':disabled')})));
    for(const width of widths){await nojsPage.setViewportSize({width,height:900}); await capture(nojsPage,candidate.id+'-nojs-'+width+'.png');}
    const navigation = nojsPage.getByRole('navigation',{name:'Footer'}).getByRole('link',{name:'About',exact:true});
    await navigation.click(); assert.match(nojsPage.url(),/\/about$/);
    result.nojs = {controls,requests:nojsRequests};
    assert.equal(controls.filter(c=>!c.disabled && ['INPUT','SELECT','TEXTAREA'].includes(c.tag)).length,0,'JS-off calculator inputs must not invite edits that cannot update results');
    return {navigation:'About reached',controls:controls.length,hosts:[...new Set(nojsRequests.map(r=>new URL(r.url).hostname))]};
  });
  await nojs.close();
  for(const consent of ['accepted','rejected']){
    const context=await browser.newContext({viewport:{width:1280,height:900}});
    const page=await context.newPage();
    const requests=[], failures=[], responses=[], errors=[];
    page.on('request',r=>requests.push({url:cleanUrl(r.url()),type:r.resourceType(),method:r.method()}));
    page.on('response',r=>responses.push({url:cleanUrl(r.url()),status:r.status()}));
    page.on('requestfailed',r=>failures.push({url:cleanUrl(r.url()),error:r.failure()?.errorText}));
    page.on('pageerror',e=>errors.push(e.message));
    await gate(result,'network-'+consent,async()=>{
      await page.goto(url,{waitUntil:'networkidle'});
      await page.getByRole('button',{name:consent==='accepted'?'Accept analytics':'Reject optional analytics',exact:true}).click();
      await setup(page,candidate.id);
      // Explicit bounded observation window catches deferred analytics startup.
      await page.waitForTimeout(2500);
      await page.reload({waitUntil:'networkidle'});
      await page.waitForTimeout(1000);
      const prohibited=requests.filter(r=>forbidden.test(new URL(r.url).hostname));
      result['network_'+consent]={requests,responses,failures,errors,prohibited,windowMs:3500};
      assert.equal(prohibited.length,0,'Preview sent analytics/ad requests');
      assert.equal(errors.length,0,'Browser page errors');
      return {requests:requests.length,hosts:[...new Set(requests.map(r=>new URL(r.url).hostname))],failures};
    });
    if(consent==='rejected'){
      await gate(result,'interactive-and-responsive',async()=>{
        // Fresh page state after reload; saved values may exist, so use a clean context page origin storage for fixtures.
        await page.evaluate(()=>{for(const key of Object.keys(localStorage)) if(key!=='rc_analytics_consent_v1') localStorage.removeItem(key);});
        await page.reload({waitUntil:'networkidle'});
        await setup(page,candidate.id);
        result.responsive=[];
        for(const width of widths){
          await page.setViewportSize({width,height:900});
          await capture(page,candidate.id+'-screen-'+width+'.png');
          const geometry=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth}));
          result.responsive.push(geometry);
          assert.ok(geometry.page<=geometry.viewport+1,'Page overflows at '+width);
        }
        await page.setViewportSize({width:720,height:900});
        // Historical CSS-only stress probe, NOT native browser zoom. See zoom.mjs for actual tabs.setZoom acceptance.
        await page.evaluate(()=>document.documentElement.style.zoom='2');
        await capture(page,candidate.id+'-css-zoom-stress.png');
        result.zoom=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth}));
        await page.evaluate(()=>document.documentElement.style.zoom='');
        assert.ok(result.zoom.page<=result.zoom.viewport+1, 'Page overflows at 200% CSS zoom');
        return result.responsive;
      });
      await gate(result,'live-result-semantics',async()=>{
        const live=await page.locator('main [aria-live], main [role=status]').allTextContents();
        result.liveRegions=live.map(s=>s.trim()).filter(Boolean);
        const expected={urgent:'2,172.62',w01:'2,272.62',w02:'2,282.62',w03:'750.00',w04:'3 payments'}[candidate.id];
        assert.ok(live.some(s=>s.includes(expected)), 'Updated result absent from live-region accessibility semantics');
        return {regions:live.length,expected,note:'DOM announcement semantics verified; no screen-reader speech certification'};
      });
      await gate(result,'axe',async()=>{
        await page.setViewportSize({width:1280,height:900});
        const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
        result.axe={violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:axe.passes.length};
        assert.equal(axe.violations.length,0,'Axe violations: '+axe.violations.map(v=>v.id).join(', '));
        return {passes:axe.passes.length};
      });
      await gate(result,'keyboard',async()=>{
        await page.keyboard.press('Control+Home');
        await page.locator('body').click({position:{x:2,y:2}});
        result.focus=[];
        for(let i=0;i<70;i++){
          await page.keyboard.press('Tab');
          const current=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,type:e.getAttribute('type'),focus:e.matches(':focus'),focusWithin:e.matches(':focus-within'),id:e.id,inMain:!!e.closest('main'),text:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,75),outline:s.outlineStyle,outlineColor:s.outlineColor,outlineWidth:s.outlineWidth,shadow:s.boxShadow};});
          current.nativeDatePicker = current.type==='date' && !current.focus && current.focusWithin;
          if(current.nativeDatePicker){
            current.focusEvidence = candidate.id+'-'+current.id+'-native-picker-focus.png';
            await page.locator('#'+current.id).screenshot({path:path.join(output,current.focusEvidence)});
          }
          result.focus.push(current);
          if(current.text==='Analytics preferences')break;
        }
        assert.ok(result.focus.some(e=>e.tag==='INPUT'),'Keyboard must reach calculator inputs');
        const inputFocus=result.focus.filter(e=>e.inMain && ['INPUT','SELECT','TEXTAREA'].includes(e.tag));
        assert.ok(inputFocus.every(e=>e.outline!=='none' || e.shadow!=='none' || e.nativeDatePicker),'Calculator field keyboard focus needs a visible outline or ring');
        return {steps:result.focus.length,fieldFocusIndicators:inputFocus.length,nativeDatePickerStops:inputFocus.filter(e=>e.nativeDatePicker).length,note:'Native Chromium date picker button focus uses a UA shadow-control indicator; inspect captured picker images, not only host styles'};
      });
      await gate(result,'print-pdf',async()=>{
        await page.setViewportSize({width:1280,height:900});
        await page.emulateMedia({media:'print'});
        await page.pdf({path:path.join(output,candidate.id+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
        result.printText=await text(page);
        result.printAds=await page.getByText('Advertisement',{exact:true}).evaluateAll(es=>es.filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').length);
        await page.emulateMedia({media:'screen'});
        assert.equal(result.printAds,0,'Advertisement placeholders visible in print');
        return {pdf:candidate.id+'.pdf',note:'PDF rendering/text extraction required separately; not native OS print-dialog certification'};
      });
      await gate(result,'errors-and-export',async()=>{
        if(candidate.id==='urgent'){
          await page.getByRole('textbox',{name:'Rent amount',exact:true}).fill('1e3');
          assert.match(await page.getByRole('alert').innerText(),/without letters/);
          assert.doesNotMatch(await page.getByRole('region',{name:'Converted rent'}).innerText(),/\$\s*\d/);
          await page.emulateMedia({media:'print'});await page.pdf({path:path.join(output,'urgent-invalid.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
        } else if(candidate.id==='w01'){
          const download=page.waitForEvent('download'); await page.getByRole('button',{name:'Download comparison CSV',exact:true}).click();await(await download).saveAs(path.join(output,'w01.csv'));
          await page.locator('#listing-1-rent').fill('1e3');assert.ok(await page.getByRole('alert').count());
        } else if(candidate.id==='w02'){
          await page.getByLabel('Rent',{exact:true}).fill('-1');assert.equal(await page.getByText('Average monthly housing cost',{exact:true}).count(),0);
          assert.equal(await page.getByLabel('Rent',{exact:true}).getAttribute('aria-invalid'),'true');
        } else if(candidate.id==='w03'){
          await page.getByLabel('Actual rent payment due (USD)',{exact:true}).fill('9007199254740991.99');
          await page.getByLabel('Already saved for this payment (USD)',{exact:true}).fill('0');
          await page.getByRole('button',{name:'Calculate deadline plan',exact:true}).click();
          await page.setViewportSize({width:360,height:900});await capture(page,'w03-large-360.png');
          result.large=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth}));
          assert.ok(result.large.page<=361,'Large amount causes page overflow');
        } else if(candidate.id==='w04'){
          const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download calendar (.ics)',exact:true}).click();await(await download).saveAs(path.join(output,'w04.ics'));
          const ics=(await fs.readFile(path.join(output,'w04.ics'),'utf8')).replace(/\r\n[ \t]/g,'');
          assert.match(ics,/SUMMARY:Rent payment period starts: USD 1800\.25/);
          assert.doesNotMatch(ics,/SUMMARY:Rent due:/);
          assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,3);
        }
        return 'Recorded assertion and download checks passed';
      });
    }
    await context.close();
  }
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
}
await browser.close();
report.finished=new Date().toISOString();
await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
const failures=report.candidates.flatMap(c=>c.gates.filter(g=>!g.pass).map(g=>c.id+': '+g.name));
console.log(JSON.stringify({candidates:report.candidates.length,failures,report:path.join(output,'report.json')}));
process.exitCode=failures.length?1:0;
