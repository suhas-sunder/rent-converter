import { chromium } from '../../scripts/browser-qa/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import { setup } from '../../scripts/browser-qa/rc030-fixtures.mjs';
const root = new URL('./', import.meta.url);
const source = JSON.parse(await fs.readFile(new URL('../rc030-final/axe-review.json', root), 'utf8'));
const candidates = JSON.parse(await fs.readFile(new URL('../../scripts/browser-qa/rc030-candidates.json', root), 'utf8'));
if (source.length !== 8) throw new Error('Await all eight final axe candidates');
const browser = await chromium.launch();
const reviews = [];
for (const entry of source) {
  const candidate = candidates.find(c => c.id === entry.id);
  if (entry.sha !== candidate.sha) throw new Error('Stale axe source');
  const context = await browser.newContext({viewport:{width:390,height:900}});
  const page = await context.newPage();
  await page.goto(candidate.origin + candidate.path, {waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Reject optional analytics',exact:true}).click();
  await setup(page, entry.id);
  const nodes=[];
  for (const [index,node] of entry.nodes.entries()) {
    const target=page.locator(node.target);
    const measured=await target.evaluate(e=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
      const composite=(front,back)=>{const a=front[3]/255;return front.slice(0,3).map((v,i)=>v*a+back[i]*(1-a)).concat(255);};
      const chain=[];for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);chain.unshift({tag:n.tagName,id:n.id,color:s.backgroundColor,rgba:rgba(s.backgroundColor),image:s.backgroundImage,opacity:s.opacity});}
      let bg=[255,255,255,255];for(const n of chain)bg=composite(n.rgba,bg);
      const s=getComputedStyle(e);const foreground=rgba(s.color);const rendered=composite(foreground,bg);
      const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
      const a=lum(rendered),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      return {text:e.textContent,cssForeground:s.color,foregroundRGBA:foreground,effectiveBackgroundRGBA:bg,renderedForegroundRGBA:rendered,ratio,fontSize:s.fontSize,fontWeight:s.fontWeight,backgroundChain:chain,requiresComplexCompositing:chain.some(n=>n.image!=='none'||n.opacity!=='1')};
    });
    const file=`${entry.id}-${index+1}.png`;
    await target.locator('..').screenshot({path:new URL(file,root).pathname.replace(/^\/(?:([A-Z]:))/i,'$1')});
    await target.evaluate(e=>e.scrollIntoView({block:'center',inline:'center'}));
    const exposed=`${entry.id}-${index+1}-exposed.png`;
    await target.screenshot({path:new URL(exposed,root).pathname.replace(/^\/(?:([A-Z]:))/i,'$1')});
    nodes.push({...node,measured,screenshot:file,exposedScreenshot:exposed});
  }
  reviews.push({id:entry.id,sha:entry.sha,violations:entry.violations.length,nodes});
  await context.close();
}
await browser.close();
await fs.writeFile(new URL('review.json',root),JSON.stringify({recorded:new Date().toISOString(),method:'Canvas resolves CSS color to sRGB; alpha composite ancestor solid backgrounds over white; WCAG relative luminance. Complex backgrounds require separate visual review.',reviews},null,2));
console.log(JSON.stringify(reviews.map(r=>({id:r.id,sha:r.sha,violations:r.violations,nodes:r.nodes.map(n=>({text:n.measured.text,fg:n.measured.foregroundRGBA,bg:n.measured.effectiveBackgroundRGBA,ratio:n.measured.ratio,complex:n.measured.requiresComplexCompositing,screenshot:n.screenshot}))})),null,2));
