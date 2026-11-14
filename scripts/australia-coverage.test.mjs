import test from 'node:test';import assert from 'node:assert/strict';
import {calculateAustraliaCoverage as calculate} from '../app/client/utils/australiaCoverage.js';
const input={weeklyRent:'500',firstDay:'2028-02-28',lastDay:'2028-03-02',payment:'285.71'};
test('actual leap days and partial weekly amounts reconcile a payment once',()=>{
 const r=calculate(input);assert.equal(r.ok,true);assert.equal(r.days,4);assert.equal(r.expectedCents,28571n);assert.equal(r.differenceCents,0n);assert.equal(r.fortnightCents,100000n);assert.equal(r.monthlyCents,217262n);
 assert.equal(calculate({...input,firstDay:'2027-02-28',lastDay:'2027-03-02'}).days,3);
});
test('fortnight and calendar month differ and zero payment is deliberate',()=>{
 const r=calculate({...input,firstDay:'2027-01-01',lastDay:'2027-01-31',payment:'1000'});assert.equal(r.days,31);assert.equal(r.expectedCents,221429n);assert.equal(r.differenceCents,-121429n);
 const f=calculate({...input,firstDay:'2027-12-25',lastDay:'2028-01-07',payment:'0'});assert.equal(f.days,14);assert.equal(f.expectedCents,100000n);assert.equal(f.differenceCents,-100000n);
});
test('rejects invalid date, backward span, over366 days, expressions and negative money',()=>{
 for(const patch of [{firstDay:'2027-02-29'},{lastDay:'2028-02-27'},{lastDay:'2029-03-02'},{weeklyRent:'1e3'},{payment:'-1'},{payment:''}])assert.equal(calculate({...input,...patch}).ok,false);
 assert.equal(calculate({...input,firstDay:'2028-01-01',lastDay:'2028-12-31'}).days,366);
});
test('large amounts and fractional rates keep exact cents without daily rounding',()=>{
 assert.equal(calculate({...input,weeklyRent:'9000000000000.00'}).expectedCents,514285714285714n);
 assert.equal(calculate({...input,weeklyRent:'0.012345678901'}).expectedCents,1n);
 assert.equal(calculate({...input,weeklyRent:'0',payment:'0'}).ok,false);
});
test('calendar math does not depend on host time zone',()=>{
 const old=process.env.TZ;try{const results=['UTC','Australia/Sydney','America/Los_Angeles'].map(tz=>{process.env.TZ=tz;return calculate(input)});assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);}finally{if(old===undefined)delete process.env.TZ;else process.env.TZ=old;}
});
test('shared weekly input matches the existing advance estimator grouping and cent rounding',()=>{
 assert.equal(calculate({...input,weeklyRent:'1.234',firstDay:'2027-01-01',lastDay:'2027-01-07',payment:'1234'}).differenceCents,0n);
 assert.equal(calculate({...input,weeklyRent:'1.2345',firstDay:'2027-01-01',lastDay:'2027-01-07',payment:'1.23'}).differenceCents,0n);
});
