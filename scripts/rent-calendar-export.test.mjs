import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { buildRentCalendar, escapeCalendarText, foldCalendarLine } from "../app/client/utils/rentCalendarExport.js";
import { calculateLeaseEnd, formatCalendarDate, generateLeasePaymentSchedule, parseCalendarDate } from "../app/client/utils/calendarDate.js";

const stamp = "2026-11-12T17:00:00.000Z";
const input = {
  paymentDates: ["2028-01-31", "2028-02-29", "2028-03-31"],
  leaseStart: "2028-01-31", leaseEnd: "2028-04-30", frequency: "monthly",
  rentCents: 123456n, currency: "USD", generatedAt: stamp,
};
const unfold = (value) => value.replace(/\r\n[ \t]/g, "");

test("all-day events preserve leap and month-end dates with exclusive next-day end", () => {
  const result = buildRentCalendar(input);
  assert.equal(result.ok, true);
  const text = unfold(result.contents);
  assert.equal((text.match(/BEGIN:VEVENT/g) ?? []).length, 3);
  assert.match(text, /DTSTART;VALUE=DATE:20280229\r\nDTEND;VALUE=DATE:20280301/);
  assert.match(text, /DTSTART;VALUE=DATE:20280131\r\nDTEND;VALUE=DATE:20280201/);
  assert.match(text, /SUMMARY:Rent payment period starts: USD 1234\.56/);
  assert.match(text, /DTSTAMP:20261112T170000Z/);
  assert.doesNotMatch(text, /TZID|VALARM|ATTENDEE|ORGANIZER|RRULE/);
  assert.ok(result.contents.endsWith("END:VCALENDAR\r\n"));
});

test("event titles describe period starts without changing identities, dates or exact amounts", () => {
  for (const [rentCents, amount] of [[180025n, "1800.25"], [900719925474099199n, "9007199254740991.99"]]) {
    const result = buildRentCalendar({ ...input, rentCents });
    assert.equal(result.ok, true);
    const text = unfold(result.contents);
    const properties = (name) => [...text.matchAll(new RegExp(`^${name}:(.*)\\r$`, "gm"))].map((match) => match[1]);
    assert.deepEqual(properties("SUMMARY"), Array(3).fill(`Rent payment period starts: USD ${amount}`));
    assert.doesNotMatch(text, /SUMMARY:Rent due:/);
    assert.deepEqual(properties("UID"), ["20280131", "20280229", "20280331"].map((date) => `rent-2028-01-31-2028-04-30-monthly-USD-${rentCents}-${date}@rentconverter.com`));
    assert.deepEqual(properties("DTSTART;VALUE=DATE"), ["20280131", "20280229", "20280331"]);
    assert.deepEqual(properties("DTEND;VALUE=DATE"), ["20280201", "20280301", "20280401"]);
    for (const description of properties("DESCRIPTION")) {
      assert.ok(description.includes(`Rent payment: USD ${amount}.`));
      assert.ok(description.includes(escapeCalendarText("Payment dates are period starts, not legal due-date determinations.")));
    }
  }
});

test("export consumes exactly the calculated lease-bounded dates, without new recurrence rules", () => {
  const start = parseCalendarDate("2027-02-01").date;
  const schedule = generateLeasePaymentSchedule(start, 1, "weekly");
  const result = buildRentCalendar({ ...input, leaseStart: formatCalendarDate(start), leaseEnd: formatCalendarDate(schedule.leaseEnd.date), frequency: "weekly", paymentDates: schedule.payments.map(formatCalendarDate) });
  assert.equal(result.ok, true);
  assert.deepEqual([...unfold(result.contents).matchAll(/DTSTART;VALUE=DATE:(\d+)/g)].map((match) => match[1]), ["20270201", "20270208", "20270215", "20270222"]);
  assert.match(unfold(result.contents), /excludes dates on or after 2027-02-28/);
});

test("same input and timestamp are deterministic and UID is stable across download times", () => {
  const first = buildRentCalendar(input);
  assert.deepEqual(first, buildRentCalendar(input));
  const later = buildRentCalendar({ ...input, generatedAt: "2026-11-13T17:00:00Z" });
  const uids = (result) => [...unfold(result.contents).matchAll(/^UID:(.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(uids(first), uids(later));
  assert.equal(new Set(uids(first)).size, 3);
});

test("text escaping cannot inject calendar properties and preserves text punctuation", () => {
  const value = "Rent, fees; notes\\path\r\nBEGIN:VEVENT\n租金 🏠";
  assert.equal(escapeCalendarText(value), "Rent\\, fees\\; notes\\\\path\\nBEGIN:VEVENT\\n租金 🏠");
  assert.doesNotMatch(escapeCalendarText(value), /[\r\n]/);
});

test("folding respects 75 UTF-8 octets including continuation spaces and preserves Unicode", () => {
  const source = "DESCRIPTION:" + "租金 🏠, café; ".repeat(30);
  const folded = foldCalendarLine(source);
  assert.equal(unfold(folded), source);
  for (const line of folded.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75);
  assert.ok(!folded.includes("�"));
});

test("invalid, duplicate, unsorted, out-of-bounds and empty schedules cannot export", () => {
  for (const invalid of [
    { paymentDates: [] }, { paymentDates: ["2027-02-29"] },
    { paymentDates: ["2028-01-30"] }, { paymentDates: ["2028-04-30"] },
    { paymentDates: ["2028-02-29", "2028-02-29"] },
    { paymentDates: ["2028-03-31", "2028-02-29"] },
    { paymentDates: ["2028-02-29\r\nBEGIN:VEVENT"] },
    { leaseEnd: "10000-01-01" }, { rentCents: -1n },
    { currency: "USD\nBEGIN:VEVENT" }, { frequency: "monthly\nATTENDEE:x" },
    { generatedAt: "not-a-date" },
  ]) assert.equal(buildRentCalendar({ ...input, ...invalid }).ok, false);
});

test("money stays exact without Number conversion for large and tiny amounts", () => {
  const huge = buildRentCalendar({ ...input, rentCents: 99999999999999999999999999n });
  assert.match(unfold(huge.contents), /USD 999999999999999999999999\.99/);
  assert.match(unfold(buildRentCalendar({ ...input, rentCents: 1n, currency: "JPY" }).contents), /JPY 0\.01/);
});

test("year 9999 boundary blocks an out-of-range result and export while retaining the last valid schedule", () => {
  // Execute the actual route's validation with real date arithmetic, so removing
  // its upper-year guard fails this regression instead of testing a duplicate.
  const source = readFileSync("app/client/components/generated/GeneratedPages.tsx", "utf8");
  const route = source.slice(source.indexOf("export function DateToolPage"));
  const validation = route.slice(route.indexOf("const errors ="), route.indexOf("const schemas ="));
  const compiled = ts.transpileModule(validation, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const [start, months, valid] of [["9999-11-01", 1, true], ["9999-12-01", 1, true], ["9999-12-31", 1, false], ["9990-01-01", 120, true], ["9990-02-01", 120, false]]) {
    const startParsed = parseCalendarDate(start);
    const calculation = calculateLeaseEnd(startParsed.date, months);
    const errors = vm.runInNewContext(`${compiled}\nerrors`, {
      startParsed, termParsed: { ok: true, value: months }, dateCalculation: calculation,
      config: { mode: "schedule" }, rentParsed: { ok: true, cents: 10000n },
    });
    assert.equal(errors.length === 0, valid, `${start} + ${months} months`);
    const schedule = generateLeasePaymentSchedule(startParsed.date, months, "monthly");
    const result = buildRentCalendar({ ...input, leaseStart: start, leaseEnd: formatCalendarDate(schedule.leaseEnd.date), paymentDates: schedule.payments.map(formatCalendarDate) });
    assert.equal(result.ok, valid, `${start} export`);
  }
  const last = buildRentCalendar({ ...input, leaseStart: "9999-12-01", leaseEnd: "9999-12-31", paymentDates: ["9999-12-30"] });
  assert.equal(last.ok, true);
  assert.match(unfold(last.contents), /DTSTART;VALUE=DATE:99991230\r\nDTEND;VALUE=DATE:99991231/);
  assert.equal(buildRentCalendar({ ...input, leaseStart: "9999-12-01", leaseEnd: "10000-01-01", paymentDates: ["9999-12-31"] }).ok, false);
});
