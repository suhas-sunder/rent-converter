import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { setup } from './rc030-fixtures.mjs';
const cs=JSON.parse(await fs.readFile(new URL('./rc030-candidates.json',import.meta.url),'utf8'));
const browser=await chromium.launch();const report=[];
for(const c of cs){
 const context=await browser.newContext({viewport:{width:390,height:900}});const page=await context.newPage();await page.goto(c.origin+c.path,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Reject optional analytics',exact:true}).click();await setup(page,c.id);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 const nodes=[];
 for(const issue of axe.incomplete) for(const node of issue.nodes){
  const target=node.target[0];const style=await page.locator(target).evaluate(e=>{const s=getComputedStyle(e);return {text:e.textContent,foreground:s.color,background:s.backgroundColor,fontSize:s.fontSize,parentBackground:getComputedStyle(e.parentElement).backgroundColor,backgroundAncestors:(()=>{const a=[];for(let n=e;n;n=n.parentElement){const v=getComputedStyle(n).backgroundColor;if(v!=='rgba(0, 0, 0, 0)')a.push(v);}return a;})()};});
  nodes.push({id:issue.id,target,summary:node.failureSummary,style});
 }
 report.push({id:c.id,sha:c.sha,violations:axe.violations,nodes});await context.close();
}
await browser.close();await fs.writeFile('artifacts/rc030-final/axe-review.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(r=>({id:r.id,violations:r.violations.length,incomplete:r.nodes.length}))));process.exitCode=report.some(r=>r.violations.length)?1:0;
