import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setup} from './rc030-fixtures.mjs';
const candidates=JSON.parse(await fs.readFile(process.env.QA_CANDIDATES ?? new URL('./candidates.json',import.meta.url),'utf8')).filter(c=>!process.env.QA_ONLY || process.env.QA_ONLY.split(',').includes(c.id));
const output=path.resolve(process.env.QA_ZOOM_OUTPUT ?? 'artifacts/zoom-final');
await fs.mkdir(output,{recursive:true});
const extension=fileURLToPath(new URL('./zoom-extension',import.meta.url));
const report={started:new Date().toISOString(),method:'Actual chrome.tabs.setZoom(2) in a fresh, disposable Chromium profile with a local QA-only extension',candidates:[]};
for(const c of candidates){
  const origin=process.env.QA_ORIGIN ?? c.origin;
  assert.ok(/^https:\/\/[a-f0-9]{24}--rent-converter\.netlify\.app$/.test(origin)||/^http:\/\/(localhost|127\.0\.0\.1):[0-9]+$/.test(origin),'Preview/local only');
  const context=await chromium.launchPersistentContext('',{channel:'chromium',headless:true,viewport:{width:1440,height:900},args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  const worker=context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const page=await context.newPage();
  const result={...c,origin,sha:process.env.QA_ORIGIN?(process.env.QA_SOURCE_SHA??null):c.sha,views:[]};
  report.candidates.push(result);
  try{
    await page.goto(origin+c.path,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Reject optional analytics',exact:true}).click();
    await setup(page,c.id);
    const id=await worker.evaluate(async url=>(await chrome.tabs.query({})).find(t=>t.url===url).id,page.url());
    await worker.evaluate(async id=>{await chrome.tabs.setZoomSettings(id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(id,2);},id);
    assert.equal(await worker.evaluate(id=>chrome.tabs.getZoom(id),id),2);
    for(const width of [1440,720]){
      await page.setViewportSize({width,height:900});
      await page.evaluate(()=>window.scrollTo(0,0));
      const state=await page.evaluate(()=>({innerWidth,devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,sm:matchMedia('(min-width:640px)').matches,cssZoom:getComputedStyle(document.documentElement).zoom,clippedMoney:[...document.querySelectorAll('[class*=truncate]')].filter(e=>e.getClientRects().length&&/[$£€]\s*[0-9]/.test(e.textContent)&&e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)}));
      const cdp=await context.newCDPSession(page);
      const metrics=await cdp.send('Page.getLayoutMetrics');
      const bitmap=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true,clip:{x:0,y:0,width:metrics.contentSize.width,height:metrics.contentSize.height,scale:1}});
      await fs.writeFile(path.join(output,c.id+'-native-zoom200-'+width+'.png'),Buffer.from(bitmap.data,'base64'));
      await page.screenshot({path:path.join(output,c.id+'-native-zoom200-'+width+'-viewport.png'),fullPage:false});
      state.captureMetrics={content:metrics.contentSize,cssContent:metrics.cssContentSize};
      await cdp.detach();
      result.views.push({physicalViewport:width,...state});
      assert.equal(state.innerWidth,width/2,'Real browser zoom must change the CSS viewport');
      assert.equal(state.devicePixelRatio,2);
      assert.ok(state.scrollWidth<=state.innerWidth+1,'Page overflow at native200%');
      assert.equal(state.clippedMoney.length,0,'Visible money ellipsized at native200%');
    }
    result.pass=true;
  }catch(e){result.pass=false;result.error=e.message;console.log(c.id+': '+e.message);}
  await context.close();
  await fs.writeFile(path.join(output,'zoom-report.json'),JSON.stringify(report,null,2));
}
report.finished=new Date().toISOString();
await fs.writeFile(path.join(output,'zoom-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report.candidates.map(c=>({id:c.id,pass:c.pass,error:c.error}))));
process.exitCode=report.candidates.some(c=>!c.pass)?1:0;
