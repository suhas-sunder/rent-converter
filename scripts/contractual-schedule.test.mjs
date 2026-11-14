import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { projectContractualDates } from '../app/client/utils/contractualSchedule.js';
import { buildRentCalendar } from '../app/client/utils/rentCalendarExport.js';
const input = {paymentDates:['2028-01-31','2028-02-29','2028-03-31'],leaseStart:'2028-01-31',leaseEnd:'2028-04-30',frequency:'monthly',rentCents:180025n,currency:'USD',generatedAt:'2026-11-13T00:00:00Z'};
const unfold = text => text.replace(/\r\n[ \t]/g, '');
test('explicit monthly due anchor retains original day through leap and short months', () => {
  assert.deepEqual(projectContractualDates({firstDueDate:'2028-01-30',count:4,frequency:'monthly'}).dates,['2028-01-30','2028-02-29','2028-03-30','2028-04-30']);
  assert.deepEqual(projectContractualDates({firstDueDate:'2027-12-31',count:4,frequency:'monthly'}).dates,['2027-12-31','2028-01-31','2028-02-29','2028-03-31']);
});
test('weekly, fortnightly, and four-week frequencies count actual days without holiday shifts', () => {
  for(const [frequency, dates] of [['weekly',['2028-02-26','2028-03-04']],['fortnightly',['2028-02-26','2028-03-11']],['every-4-weeks',['2028-02-26','2028-03-25']]]) assert.deepEqual(projectContractualDates({firstDueDate:'2028-02-26',count:2,frequency}).dates,dates);
});
test('invalid anchors, range overflow and unsupported schedules are rejected', () => {
  for(const firstDueDate of ['', '2027-02-29', '10000-01-01', '9999-12-31']) assert.equal(projectContractualDates({firstDueDate,count:1,frequency:'monthly'}).ok,false);
  assert.equal(projectContractualDates({firstDueDate:'9999-11-30',count:3,frequency:'monthly'}).ok,false);
  for(const count of [0,5001,1.5]) assert.equal(projectContractualDates({firstDueDate:'2028-01-01',count,frequency:'weekly'}).ok,false);
  assert.equal(projectContractualDates({firstDueDate:'2028-01-01',count:2,frequency:'bogus'}).ok,false);
});
test('entered due dates before lease start or after lease end export without filtering or inference', () => {
  const dueDates=['2028-01-20','2028-02-20','2028-05-20'];
  const result=buildRentCalendar({...input,dueDates});assert.equal(result.ok,true);
  const text=unfold(result.contents);
  assert.deepEqual([...text.matchAll(/DTSTART;VALUE=DATE:(\d+)/g)].map(m=>m[1]),['20280120','20280220','20280520']);
  assert.match(text,/SUMMARY:Rent due \(entered schedule\): USD 1800.25/);
  assert.match(text,/Period start: 2028-01-31/);
  assert.match(text,/projections.*not independently verified legal deadlines/);
  assert.match(text,/DTEND;VALUE=DATE:20280521/);
  assert.equal(result.filename,'rent-due-dates-2028-01-31.ics');
  assert.doesNotMatch(text,/VALARM|RRULE|TZID|ATTENDEE/);
  for(const line of result.contents.split('\r\n')) assert.ok(Buffer.byteLength(line)<=75);
});
test('default W04 identities remain unchanged and due-date identities are distinct and stable', () => {
  const uids=result=>[...unfold(result.contents).matchAll(/^UID:(.+)$/gm)].map(m=>m[1]);
  const plain=buildRentCalendar(input);const dueDates=['2028-01-31','2028-02-29','2028-03-31'];const due=buildRentCalendar({...input,dueDates});
  assert.match(unfold(plain.contents),/UID:rent-2028-01-31-2028-04-30-monthly-USD-180025-20280131@rentconverter.com/);
  assert.notDeepEqual(uids(plain),uids(due));
  assert.deepEqual(uids(due),uids(buildRentCalendar({...input,dueDates,generatedAt:'2026-11-14T00:00:00Z'})));
});
test('calendar validation rejects bad due-date counts, duplicates, order and property injection', () => {
  for(const dueDates of [[],['2028-01-01'],['2028-01-01','2028-01-01','2028-01-02'],['2028-01-02','2028-01-01','2028-01-03'],['2028-01-01\r\nVALARM','2028-01-02','2028-01-03'],['2028-01-01','2028-01-02','9999-12-31']]) assert.equal(buildRentCalendar({...input,dueDates}).ok,false);
});
test('large amounts keep exact cents in due-date exports', () => {
  assert.match(unfold(buildRentCalendar({...input,dueDates:input.paymentDates,rentCents:900719925474099199n}).contents),/USD 9007199254740991.99/);
});
test('anchored dates do not vary with machine time zone or daylight saving', () => {
  const code=`import { projectContractualDates } from './app/client/utils/contractualSchedule.js'; console.log(JSON.stringify(projectContractualDates({firstDueDate:'2028-03-11',count:3,frequency:'weekly'})));`;
  assert.equal(new Set(['UTC','America/New_York','Pacific/Kiritimati'].map(TZ=>execFileSync(process.execPath,['--input-type=module','-e',code],{env:{...process.env,TZ},encoding:'utf8'}))).size,1);
});
