import assert from 'node:assert/strict';
import test from 'node:test';
import { checkPaycheckAverage } from '../app/client/utils/paycheckAverageCheck.js';
import { calculatePaycheckDeadline } from '../app/client/utils/paycheckDeadline.js';

test('two biweekly average reserves leave a timing gap for a monthly bill', () => {
  const plan = calculatePaycheckDeadline({rentCents:200000n,savedCents:0n,nextPayday:'2027-01-08',dueDate:'2027-02-01',frequency:'biweekly'});
  const result = checkPaycheckAverage({rentCents:200000n,savedCents:0n,reserveCents:92308n,paydayCount:plan.rows.length});
  assert.equal(result.availableCents,184616n); assert.equal(result.shortfallCents,15384n);
});
test('semimonthly 24-payment reserve covers two deposits exactly', () => {
  const plan = calculatePaycheckDeadline({rentCents:200000n,savedCents:0n,nextPayday:'2028-02-15',dueDate:'2028-03-01',frequency:'semimonthly',firstPayDay:15,secondPayDay:31});
  assert.deepEqual(plan.rows.map(r=>r.date),['2028-02-15','2028-02-29']);
  assert.equal(checkPaycheckAverage({rentCents:200000n,savedCents:0n,reserveCents:100000n,paydayCount:plan.rows.length}).shortfallCents,0n);
});
test('no payday does not credit an annual-average phantom payment',()=>{
  const r=checkPaycheckAverage({rentCents:10000n,savedCents:1200n,reserveCents:5000n,paydayCount:0});
  assert.equal(r.shortfallCents,8800n);assert.equal(r.newSavingsCents,0n);
});
test('actual year occurrences can include 27 biweekly paydays',()=>{
  const plan=calculatePaycheckDeadline({rentCents:1n,savedCents:0n,nextPayday:'2027-01-01',dueDate:'2028-01-01',frequency:'biweekly'});
  assert.equal(plan.rows.length,27);
});
test('large cents, existing savings and surplus remain exact',()=>{
  const amount=99999999999999999999999n;
  const r=checkPaycheckAverage({rentCents:amount,savedCents:amount,reserveCents:amount,paydayCount:2});
  assert.equal(r.availableCents,amount*3n);assert.equal(r.surplusCents,amount*2n);assert.equal(r.shortfallCents,0n);
});
test('reject invalid count or negative money',()=>{
  for(const patch of [{paydayCount:-1},{paydayCount:1.5},{paydayCount:55},{reserveCents:-1n},{rentCents:-1n},{savedCents:-1n}]) assert.equal(checkPaycheckAverage({rentCents:1n,savedCents:0n,reserveCents:1n,paydayCount:1,...patch}).ok,false);
});
