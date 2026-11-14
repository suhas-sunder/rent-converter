import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { checkLeaseBoundary } from '../app/client/utils/leaseBoundary.js';
import { calculateLeaseEnd, parseCalendarDate, formatCalendarDate } from '../app/client/utils/calendarDate.js';

const check = (start, lastDay, monthlyRentCents = 180000n, months = 1) => checkLeaseBoundary({ start, lastDay, monthlyRentCents, calculatedEnd: formatCalendarDate(calculateLeaseEnd(parseCalendarDate(start).date, months).date) });
test('month-end clamp and agreement comparison retain distinct inclusive day counts', () => {
  const result = check('2028-01-31', '2028-02-20');
  assert.equal(result.ok, true);
  assert.equal(result.occupiedDays, 21);
  assert.equal(result.differenceDays, -9);
  assert.equal(result.chargedStart, '2028-02-01');
  assert.equal(result.chargedDays, 20);
  assert.equal(result.monthDays, 29);
  assert.equal(result.finalMonthCents, 124138n);
  assert.equal(check('2028-01-31', '2028-02-29').finalMonthCents, 180000n);
});
test('single day and partial month use actual denominator and only round the final amount', () => {
  assert.equal(check('2028-02-29', '2028-02-29').finalMonthCents, 6207n);
  assert.equal(check('2027-12-31', '2028-01-01').occupiedDays, 2);
  assert.equal(check('2028-02-01', '2028-02-20', 1n).finalMonthCents, 1n);
  assert.equal(check('2028-02-01', '2028-02-20', 0n).finalMonthCents, 0n);
});
test('annual and longer terms do not assume 365 days or impose a 366-day cap', () => {
  assert.equal(check('2028-02-29', '2029-02-28', 180000n, 12).occupiedDays, 366);
  assert.equal(check('2028-01-01', '2030-01-01', 180000n, 24).occupiedDays, 732);
  assert.equal(check('2028-01-01', '2030-01-01', 180000n, 24).differenceDays, 1);
});
test('invalid dates, reversed dates, negative money and non-money values are rejected', () => {
  for (const end of ['', '2027-02-29', '2027-01-30', '10000-01-01']) assert.equal(check('2027-01-31', end).ok, false);
  assert.equal(check('2027-01-31', '2027-02-28', -1n).ok, false);
  assert.equal(check('2027-01-31', '2027-02-28', 1800).ok, false);
});
test('large cents remain exact and supported maximum date does not require a next day', () => {
  assert.equal(check('9999-11-30', '9999-12-31', 90071992547409931n).finalMonthCents, 90071992547409931n);
});
test('date-only result is identical across DST and opposite time zones', () => {
  const code = `import { checkLeaseBoundary } from './app/client/utils/leaseBoundary.js'; console.log(JSON.stringify(checkLeaseBoundary({start:'2028-03-11',calculatedEnd:'2028-04-10',lastDay:'2028-03-13',monthlyRentCents:180000n}),(_,v)=>typeof v==='bigint'?String(v):v));`;
  const outputs = ['UTC', 'America/New_York', 'Pacific/Kiritimati', 'Pacific/Honolulu'].map(TZ => execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: {...process.env, TZ}, encoding:'utf8' }));
  assert.equal(new Set(outputs).size, 1);
  assert.equal(JSON.parse(outputs[0]).occupiedDays, 3);
});
