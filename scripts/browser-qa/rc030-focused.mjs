import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {setup,openOptional} from './rc030-fixtures.mjs';
const candidates=JSON.parse(await fs.readFile(process.env.QA_CANDIDATES??new URL('./rc030-candidates.json',import.meta.url),'utf8'));
const out=path.resolve(process.env.QA_FOCUSED_OUTPUT??'artifacts/rc030-focused');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();const report={checks:[],sourceSha:candidates[0].sha};
for(const c of candidates){
  assert.match(c.origin,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/);
  const context=await browser.newContext({viewport:{width:360,height:900}});const page=await context.newPage();
  let release;const pending=new Promise(resolve=>{release=resolve;});
  await context.route('**/*.js',async route=>{await pending;await route.continue();});
  try{
    await page.goto(c.origin+c.path,{waitUntil:'commit'});
    await page.locator('main').waitFor();await openOptional(page,c.id);
    assert.equal(await page.locator('main input:not(:disabled),main select:not(:disabled)').count(),0,c.id+' before hydration');
    release();await page.waitForLoadState('networkidle');await setup(page,c.id);
    assert.ok(await page.locator('main input:enabled').count());
    report.checks.push({id:c.id+'-delayed-hydration',pass:true});
  }catch(e){release();report.checks.push({id:c.id+'-delayed-hydration',pass:false,error:e.message});}
  await context.close();
}
async function check(id,fn){const c=candidates.find(c=>c.id===id);const context=await browser.newContext({viewport:{width:360,height:900}});const page=await context.newPage();try{await page.goto(c.origin+c.path);await setup(page,id);await fn(page);report.checks.push({id:id+'-edge',pass:true});}catch(e){report.checks.push({id:id+'-edge',pass:false,error:e.message});}await context.close();}
await check('w10',async page=>{
  for(const [raw,payment,display] of [['1.234','1234','1,234.00'],['1.2345','1.23','1.23']]){
    await page.locator('#australia-weekly-rent').fill(raw);await page.locator('#coverage-last').fill('2028-03-05');await page.locator('#coverage-payment').fill(payment);await page.getByRole('button',{name:'Check payment coverage',exact:true}).click();
    const text=await page.locator('#australia-coverage').innerText();assert.ok(text.includes(display));assert.match(text,/matches/i);
  }
});
await check('w12',async page=>{
  const table=page.getByRole('region',{name:'Rent schedule comparison',exact:true});await table.focus();
  assert.equal(await table.evaluate(e=>e===document.activeElement),true);await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);
  assert.ok(await table.evaluate(e=>e.scrollLeft)>0);await page.keyboard.press('Tab');assert.equal(await table.evaluate(e=>e===document.activeElement),false);
});
await check('w16',async page=>{
  const table=page.getByRole('region',{name:'Annual payment comparison',exact:true});await table.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);assert.ok(await table.evaluate(e=>e.scrollLeft)>0);await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Download scenario CSV',exact:true}).evaluate(e=>e===document.activeElement),true);
  await page.locator('#comparison-increase-rate').fill('20');assert.match(await page.locator('#increase-cost-comparison').innerText(),/-\$2,400\.00/);
  await page.locator('#compound-starting-rent').fill('9000000000000');await page.locator('#compound-rate').fill('100');await page.locator('#compound-years').fill('100');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'w16-extreme-360.png'),fullPage:true});
});
// Fresh storage-denied contexts ensure new workflows do not depend on saving.
for(const id of ['w11','w15']){
  const c=candidates.find(c=>c.id===id);const context=await browser.newContext();await context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Storage unavailable','QuotaExceededError');};});const page=await context.newPage();try{await page.goto(c.origin+c.path);await setup(page,id);report.checks.push({id:id+'-storage-denied',pass:true});}catch(e){report.checks.push({id:id+'-storage-denied',pass:false,error:e.message});}await context.close();
}
await browser.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));process.exitCode=report.checks.some(c=>!c.pass)?1:0;
