import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setup} from '../../../scripts/browser-qa/fixtures.mjs';
const require=createRequire(new URL('../../../scripts/browser-qa/package.json',import.meta.url));
const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const output=path.dirname(fileURLToPath(import.meta.url));
const candidates=JSON.parse(await fs.readFile(new URL('../../../scripts/browser-qa/candidates.json',import.meta.url),'utf8'));
for(const c of candidates)if(!/^https:\/\/[a-f0-9]{24}--rent-converter\.netlify\.app$/.test(c.origin))throw Error('Exact immutable previews only');
const browser=await chromium.launch({headless:true});
const luminance=rgb=>rgb.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const report={started:new Date().toISOString(),browser:browser.version(),fixture:'scripts/browser-qa/fixtures.mjs setup; rejected consent; 1280x900; actual rendered styles',candidates:[]};
try{
 for(const c of candidates){
  const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
  const page=await context.newPage();
  await page.goto(c.origin+c.path,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Reject optional analytics',exact:true}).click();
  await setup(page,c.id);
  await page.evaluate(()=>document.fonts.ready);
  let exploratory=null;
  if(['urgent','w01'].includes(c.id)){
   const first=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   exploratory={scrollY:await page.evaluate(()=>scrollY),incomplete:first.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,checks:n.any}))}))};
   exploratory.headerStyles=[];
   for(const issue of first.incomplete)for(const n of issue.nodes){if(!n.any.some(a=>a.data?.messageKey==='elmPartiallyObscured'))continue;
    const style=await page.locator(n.target[0]).evaluate(e=>{const s=getComputedStyle(e);const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d');cx.fillStyle=s.color;cx.fillRect(0,0,1,1);return {text:e.textContent.trim(),color:s.color,foreground:Array.from(cx.getImageData(0,0,1,1).data).slice(0,3),headerBackground:getComputedStyle(e.closest('header')).backgroundColor};});
    exploratory.headerStyles.push({target:n.target,...style,conservativeBackground:[242,242,242],conservativeRatio:contrast(style.foreground,[242,242,242]),note:'95% white header over worst-case black; integer 242 rounds background down conservatively. Visual header screenshot checked separately.'});
   }
   await page.locator('header').screenshot({path:path.join(output,`${c.id}-scrolled-header.png`)});
  }
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.mouse.move(0,0);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const result={...c,exploratory,violations:axe.violations,incomplete:axe.incomplete,rendered:[]};
  for(const issue of axe.incomplete){for(let i=0;i<issue.nodes.length;i++){
   const n=issue.nodes[i];
   const el=page.locator(n.target[0]);
   const styles=await el.evaluate(e=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data);};
    const chain=[];
    for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);chain.push({tag:a.tagName,id:a.id,class:a.className,color:s.color,colorRGBA:rgba(s.color),backgroundRGBA:rgba(s.backgroundColor),backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,opacity:s.opacity,fontSize:s.fontSize,fontWeight:s.fontWeight,textShadow:s.textShadow,filter:s.filter,mixBlendMode:s.mixBlendMode});}
    return {text:e.textContent.trim(),chain};
   });
   const screenshot=`${c.id}-${issue.id}-${i+1}.png`;
   await el.locator('xpath=..').screenshot({path:path.join(output,screenshot)});
   let bg=[255,255,255];
   for(const a of [...styles.chain].reverse()){const alpha=a.backgroundRGBA[3]/255;bg=bg.map((v,i)=>a.backgroundRGBA[i]*alpha+v*(1-alpha));}
   const ratio=contrast(styles.chain[0].colorRGBA,bg);
   result.rendered.push({rule:issue.id,target:n.target,...styles,screenshot,calculation:{foreground:styles.chain[0].colorRGBA.slice(0,3),background:bg,ratio,conservativeTextThreshold:4.5,pass:ratio>=4.5,method:'Chromium canvas sRGB conversion of computed CSS; ancestor alpha compositing over white. Flat backgrounds only; no image/filter/blend effects in these node chains.'}});
  }}
  report.candidates.push(result);
  console.log(c.id,JSON.stringify({violations:axe.violations.length,incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))}));
  await context.close();
 }
}finally{await browser.close();await fs.writeFile(path.join(output,'contrast-review.json'),JSON.stringify(report,null,2)+'\n');}
