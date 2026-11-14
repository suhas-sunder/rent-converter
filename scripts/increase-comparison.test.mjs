import test from 'node:test';
import assert from 'node:assert/strict';
import { compareIncreaseCosts, increaseComparisonCsv } from '../app/client/utils/increaseComparison.js';

test('two years of payments exclude the increase at the end of year two',()=>{
  const result=compareIncreaseCosts(200000n,10,0,2);
  assert.equal(result.total,5040000n); // 12 × 2000 + 12 × 2200
  assert.equal(result.alternativeTotal,4800000n);
  assert.equal(result.difference,240000n);
  assert.equal(result.finalMonthly,242000n);
  assert.equal(result.rows[0].difference,0n);
  assert.equal(result.rows[1].difference,240000n);
});
test('comparison rates can exceed primary rate without reversing labels',()=>{
  const result=compareIncreaseCosts(200000n,0,10,2);
  assert.equal(result.difference,-240000n);
  assert.equal(result.total-result.alternativeTotal,result.rows.reduce((a,r)=>a+r.difference,0n));
});
test('first-year costs unchanged, zero rate/rent and exact cent rounding',()=>{
  assert.equal(compareIncreaseCosts(200001n,100,0,1).total,2400012n);
  assert.equal(compareIncreaseCosts(0n,100,100,100).total,0n);
  const rounded=compareIncreaseCosts(1n,50,0,3);
  assert.deepEqual(rounded.rows.map(r=>r.monthly),[1n,2n,3n]);
  assert.equal(rounded.total,72n);
  assert.equal(rounded.finalMonthly,5n);
});
test('large cents remain exact through a long horizon',()=>{
  const start=9007199254740993n;
  const result=compareIncreaseCosts(start,100,0,100);
  assert.equal(result.finalMonthly,start*2n**100n);
  assert.equal(result.total,12n*start*(2n**100n-1n));
  assert.equal(result.alternativeTotal,start*1200n);
});
test('invalid percentages and horizons rejected rather than silently replaced',()=>{
  for(const rate of [-1,101,Infinity,NaN]) assert.throws(()=>compareIncreaseCosts(100n,rate,0,2),RangeError);
  for(const years of [0,-1,1.5,101,NaN]) assert.throws(()=>compareIncreaseCosts(100n,5,0,years),RangeError);
  assert.throws(()=>compareIncreaseCosts(-1n,5,0,2),RangeError);
});
test('real CSV layout reconciles columns and retains assumption and currency',()=>{
  const csv=increaseComparisonCsv(compareIncreaseCosts(200000n,10,0,2),'CAD',10,0);
  const rows=csv.trim().split('\r\n').map(r=>r.split(','));
  assert.match(rows[0][0],/first increase after 12 payments/);
  assert.equal(rows[1][1],'CAD');
  assert.deepEqual(rows[3],['1','2000.00','2000.00','24000.00','24000.00','0.00']);
  assert.deepEqual(rows.at(-1),['Total','','','50400.00','48000.00','2400.00']);
  assert.throws(()=>increaseComparisonCsv(compareIncreaseCosts(100n,0,0,1),'=BAD',0,0),RangeError);
});
