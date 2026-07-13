import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  addCalendarDays,
  addCalendarMonths,
  calculateLeaseEnd,
  formatCalendarDate,
  generateLeasePaymentSchedule,
  generateRecurrenceDates,
  generateRentDueDates,
  nextMonthlyDueDate,
  parseCalendarDate,
  parseWholeNumber,
} from "../app/client/utils/calendarDate.js";

const date = (value) => {
  const parsed = parseCalendarDate(value);
  assert.equal(parsed.ok, true, `Expected ${value} to parse`);
  return parsed.date;
};
const strings = (dates) => dates.map(formatCalendarDate);

test("strict calendar parsing accepts real ISO dates and leap day", () => {
  assert.deepEqual(parseCalendarDate("2025-02-01"), { ok: true, date: { year: 2025, month: 2, day: 1 } });
  assert.equal(parseCalendarDate("2024-02-29").ok, true);
});

test("strict calendar parsing rejects blank, malformed, and nonexistent dates without fallback", () => {
  for (const value of ["", "2025-2-1", "02/01/2025", "abc"]) {
    const parsed = parseCalendarDate(value);
    assert.equal(parsed.ok, false);
    assert.ok(parsed.kind === "empty" || parsed.kind === "format");
  }
  for (const value of ["2025-02-29", "2025-02-30", "2025-00-10", "2025-13-01"]) {
    const parsed = parseCalendarDate(value);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.kind, "nonexistent");
  }
});

test("lease month terms require a whole number from 1 through 120", () => {
  assert.deepEqual(parseWholeNumber("12", "Lease term", 1, 120), { ok: true, value: 12 });
  for (const value of ["", "1.5", "abc", "0", "-1", "121"]) assert.equal(parseWholeNumber(value, "Lease term", 1, 120).ok, false);
});

test("lease-end convention handles ordinary, month-end, and leap-day starts", () => {
  const vectors = [
    ["2025-01-01", 12, "2025-12-31"],
    ["2025-01-15", 1, "2025-02-14"],
    ["2025-01-31", 1, "2025-02-28"],
    ["2024-01-31", 1, "2024-02-29"],
    ["2024-02-29", 12, "2025-02-28"],
    ["2025-08-31", 6, "2026-02-28"],
  ];
  for (const [start, months, expected] of vectors) {
    assert.equal(formatCalendarDate(calculateLeaseEnd(date(start), months).date), expected);
  }
});

test("monthly recurrence clamps temporarily and restores the original anchor day", () => {
  assert.deepEqual(
    strings(generateRecurrenceDates(date("2025-01-31"), date("2025-05-01"), "monthly")),
    ["2025-01-31", "2025-02-28", "2025-03-31", "2025-04-30"],
  );
  assert.deepEqual(
    strings(generateRecurrenceDates(date("2024-01-31"), date("2024-04-01"), "monthly")),
    ["2024-01-31", "2024-02-29", "2024-03-31"],
  );
});

test("fixed-day recurrences remain calendar-stable across DST, year end, and leap day", () => {
  assert.deepEqual(strings(generateRecurrenceDates(date("2025-03-02"), date("2025-03-24"), "weekly")), ["2025-03-02", "2025-03-09", "2025-03-16", "2025-03-23"]);
  assert.deepEqual(strings(generateRecurrenceDates(date("2025-10-26"), date("2025-11-17"), "weekly")), ["2025-10-26", "2025-11-02", "2025-11-09", "2025-11-16"]);
  assert.deepEqual(strings(generateRecurrenceDates(date("2025-12-21"), date("2026-01-20"), "biweekly")), ["2025-12-21", "2026-01-04", "2026-01-18"]);
  assert.deepEqual(strings(generateRecurrenceDates(date("2024-02-01"), date("2024-04-01"), "every-4-weeks")), ["2024-02-01", "2024-02-29", "2024-03-28"]);
});

test("February weekly lease schedule excludes the lease end and March 1", () => {
  const result = generateLeasePaymentSchedule(date("2025-02-01"), 1, "weekly");
  assert.equal(formatCalendarDate(result.leaseEnd.date), "2025-02-28");
  assert.deepEqual(strings(result.payments), ["2025-02-01", "2025-02-08", "2025-02-15", "2025-02-22"]);
});

test("twelve-month monthly schedule has exactly twelve rows and no boundary payment", () => {
  const result = generateLeasePaymentSchedule(date("2025-01-01"), 12, "monthly");
  assert.equal(result.payments.length, 12);
  assert.equal(formatCalendarDate(result.payments.at(0)), "2025-01-01");
  assert.equal(formatCalendarDate(result.payments.at(-1)), "2025-12-01");
  assert.ok(result.payments.every((payment) => formatCalendarDate(payment) < formatCalendarDate(result.leaseEnd.date)));
});

test("monthly due date is inclusive today and moves an earlier due day forward", () => {
  assert.equal(formatCalendarDate(nextMonthlyDueDate(date("2025-07-12"), 11)), "2025-08-11");
  assert.equal(formatCalendarDate(nextMonthlyDueDate(date("2025-07-11"), 11)), "2025-07-11");
});

test("day 31 due dates clamp independently and restore after shorter months", () => {
  const boundary = date("2025-06-01");
  assert.deepEqual(strings(generateRentDueDates({ cycle: "monthly", asOf: date("2025-01-01"), boundary, dueDay: 31 })), [
    "2025-01-31", "2025-02-28", "2025-03-31", "2025-04-30", "2025-05-31",
  ]);
});

test("a twelve-month monthly horizon does not include a thirteenth payment", () => {
  const asOf = date("2025-01-01");
  const boundary = addCalendarMonths(asOf, 12).date;
  const dueDates = generateRentDueDates({ cycle: "monthly", asOf, boundary, dueDay: 1 });
  assert.equal(dueDates.length, 12);
  assert.equal(formatCalendarDate(dueDates.at(-1)), "2025-12-01");
});

test("February 29 annual recurrence clamps in non-leap years and returns in leap years", () => {
  const dates = generateRentDueDates({ cycle: "annual", asOf: date("2025-01-01"), boundary: date("2029-03-01"), anchor: date("2024-02-29") });
  assert.deepEqual(strings(dates), ["2025-02-28", "2026-02-28", "2027-02-28", "2028-02-29", "2029-02-28"]);
});

test("core date vectors are identical across supported timezones", () => {
  const moduleUrl = new URL("../app/client/utils/calendarDate.js", import.meta.url).href;
  const script = `
    const m = await import(${JSON.stringify(moduleUrl)});
    const d = (s) => m.parseCalendarDate(s).date;
    const output = {
      leap: m.formatCalendarDate(m.addCalendarDays(d("2024-02-28"), 1)),
      dstStart: m.formatCalendarDate(m.addCalendarDays(d("2025-03-09"), 7)),
      dstEnd: m.formatCalendarDate(m.addCalendarDays(d("2025-11-02"), 7)),
      monthEnd: m.formatCalendarDate(m.calculateLeaseEnd(d("2025-01-31"), 1).date),
      yearEnd: m.formatCalendarDate(m.addCalendarDays(d("2025-12-31"), 1)),
      schedule: m.generateLeasePaymentSchedule(d("2025-02-01"), 1, "weekly").payments.map(m.formatCalendarDate),
    };
    console.log(JSON.stringify(output));
  `;
  const zones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Pacific/Auckland"];
  const outputs = zones.map((TZ) => {
    const child = spawnSync(process.execPath, ["--input-type=module", "--eval", script], { encoding: "utf8", env: { ...process.env, TZ } });
    assert.equal(child.status, 0, child.stderr);
    return child.stdout.trim();
  });
  assert.equal(new Set(outputs).size, 1);
});

