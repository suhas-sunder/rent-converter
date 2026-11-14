import assert from 'node:assert/strict';
import test from 'node:test';
import {calculateMoveInWorksheet,moveInWorksheetCsv} from '../app/client/utils/moveInWorksheet.js';
const input={monthlyRent:'1500',firstRent:'full',chargedDays:'',periodDays:'',lastRent:'0',deposit:'0',fees:'0',utilities:'0',moving:'0'};
test('only first rent is included by default; deposit can be zero',()=>{
 const r=calculateMoveInWorksheet(input);assert.equal(r.ok,true);assert.equal(r.totalCents,150000n);assert.equal(r.recurringRentCents,150000n);assert.equal(r.rows.find(r=>r.key==='deposit').cents,0n);
});
test('partial month replaces full first rent and reconciles every item',()=>{
 const r=calculateMoveInWorksheet({...input,firstRent:'partial',chargedDays:'22',periodDays:'31',lastRent:'1500',deposit:'500',fees:'40.25',utilities:'60.75',moving:'100'});
 assert.equal(r.rows[0].cents,106452n);assert.equal(r.totalCents,326552n);assert.equal(r.rows.reduce((s,r)=>s+r.cents,0n),r.totalCents);assert.equal(r.recurringRentCents,150000n);
});
test('zero rent and no first rent are intentional valid scenarios',()=>{
 assert.equal(calculateMoveInWorksheet({...input,monthlyRent:'0'}).totalCents,0n);
 assert.equal(calculateMoveInWorksheet({...input,firstRent:'none',deposit:'100'}).totalCents,10000n);
});
test('February leap month and full-day partial period',()=>{
 assert.equal(calculateMoveInWorksheet({...input,firstRent:'partial',chargedDays:'1',periodDays:'29'}).rows[0].cents,5172n);
 assert.equal(calculateMoveInWorksheet({...input,firstRent:'partial',chargedDays:'29',periodDays:'29'}).rows[0].cents,150000n);
});
test('precision retained through partial-rent calculation, then category cents summed',()=>{
 const r=calculateMoveInWorksheet({...input,monthlyRent:'100.005',firstRent:'partial',chargedDays:'1',periodDays:'30',fees:'0.005',deposit:'.5'});
 assert.equal(r.rows[0].cents,333n);assert.equal(r.rows.find(r=>r.key==='fees').cents,1n);assert.equal(r.totalCents,384n);
});
test('large values remain exact and do not pass through Number',()=>{
 const r=calculateMoveInWorksheet({...input,monthlyRent:'9000000000000',deposit:'9000000000000',lastRent:'9000000000000'});
 assert.equal(r.totalCents,2700000000000000n);
});
test('reject malformed, negative, empty and over-limit money',()=>{
 for(const v of ['','-1','1e3','2+3','12.3.4','9000000000001']) assert.equal(calculateMoveInWorksheet({...input,deposit:v}).ok,false,v);
});
test('reject impossible day counts only when partial mode is selected',()=>{
 for(const patch of [{chargedDays:'0'},{chargedDays:'32'},{chargedDays:'29',periodDays:'28'},{chargedDays:'1.5'},{periodDays:'27'},{periodDays:'32'},{chargedDays:'1e1'}]) assert.equal(calculateMoveInWorksheet({...input,firstRent:'partial',chargedDays:'1',periodDays:'30',...patch}).ok,false);
 assert.equal(calculateMoveInWorksheet({...input,chargedDays:'bad',periodDays:'bad'}).ok,true);
 assert.equal(calculateMoveInWorksheet({...input,firstRent:'anything'}).ok,false);
});
test('CSV preserves cents, method and separate recurring rent',()=>{
 const r=calculateMoveInWorksheet({...input,monthlyRent:'1500.25',deposit:'100.01'});const csv=moveInWorksheetCsv(r,'CAD');
 assert.match(csv,/"Total one-time cash","CAD","1600.26"/);assert.match(csv,/"Recurring monthly rent \(separate\)","CAD","1500.25"/);assert.ok(csv.endsWith('\r\n'));
 assert.throws(()=>moveInWorksheetCsv(r,'=BAD'));
});
