import test from 'node:test';
import assert from 'node:assert/strict';
import {compareRentConventions} from '../app/client/utils/rentConventions.js';
const money = n => `${n / 100n}.${String(n % 100n).padStart(2,'0')}`;
test('GBP500 PW and PCW compare matched conventions and distinct 28-day amount',()=>{
 assert.deepEqual(compareRentConventions('500','weekly'),{ok:true,budget:216667n,daily:217262n,difference:595n,fourWeeks:200000n});
});
test('reverse PCM conversions preserve each convention within a penny after display rounding',()=>{
 for(const raw of ['0','0.01','0.123456789012','500','9999999999.99']){
  const r=compareRentConventions(raw,'weekly');assert.equal(r.ok,true);
  for(const key of ['budget','daily']){const reverse=compareRentConventions(money(r[key]),'monthly');const expected=BigInt(Math.round(Number(raw)*100));assert.ok(reverse[key]>=expected-1n && reverse[key]<=expected+1n);}
 }
 assert.equal(compareRentConventions('2172.62','monthly').daily,50000n);
});
test('preserves fractional input and large exact cents, rejecting invalid amounts and direction',()=>{
 assert.equal(compareRentConventions('0.123456789012','weekly').daily,54n);
 assert.equal(compareRentConventions('9000000000000','weekly').budget,3900000000000000n);
 for(const raw of ['-1','1e3','500+2','', '9000000000001'])assert.equal(compareRentConventions(raw,'weekly').ok,false);
 assert.equal(compareRentConventions('500','fortnightly').ok,false);
});
