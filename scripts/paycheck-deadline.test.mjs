import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { calculatePaycheckDeadline } from "../app/client/utils/paycheckDeadline.js";

const input = {
  rentCents: 200000n, savedCents: 50000n,
  nextPayday: "2027-01-08", dueDate: "2027-02-01", frequency: "biweekly",
};
const dates = (result) => result.rows.map((row) => row.date);


test("deadline plan reserves actual shortfall over paydays before rent is due", () => {
  const plan = calculatePaycheckDeadline(input);
  assert.equal(plan.ok, true);
  assert.deepEqual(dates(plan), ["2027-01-08", "2027-01-22"]);
  assert.equal(plan.remainingCents, 150000n);
  assert.deepEqual(plan.rows.map((row) => row.reserveCents), [75000n, 75000n]);
  assert.equal(plan.rows.at(-1).balanceCents, 200000n);
});

test("same-day pay is excluded unless explicitly allowed", () => {
  const base = { ...input, nextPayday: "2027-02-01" };
  const excluded = calculatePaycheckDeadline(base);
  assert.equal(excluded.ok, true);
  assert.equal(excluded.rows.length, 0);
  assert.equal(excluded.unfundedCents, 150000n);
  const included = calculatePaycheckDeadline({ ...base, includeDueDay: true });
  assert.equal(included.rows.length, 1);
  assert.equal(included.rows[0].reserveCents, 150000n);
});

test("cent allocation reconciles exactly and gives earlier paydays the remainder", () => {
  const plan = calculatePaycheckDeadline({ ...input, rentCents: 10000n, savedCents: 0n, nextPayday: "2027-01-10", frequency: "weekly" });
  assert.deepEqual(plan.rows.map((row) => row.reserveCents), [2500n, 2500n, 2500n, 2500n]);
  const thirds = calculatePaycheckDeadline({ ...input, rentCents: 10000n, savedCents: 0n, nextPayday: "2027-01-11", frequency: "weekly" });
  assert.deepEqual(thirds.rows.map((row) => row.reserveCents), [3334n, 3333n, 3333n]);
  assert.equal(thirds.rows.reduce((sum, row) => sum + row.reserveCents, 0n), 10000n);
});

test("monthly dates clamp independently then restore original anchor day", () => {
  const plan = calculatePaycheckDeadline({ ...input, frequency: "monthly", nextPayday: "2028-01-31", dueDate: "2028-04-01" });
  assert.deepEqual(dates(plan), ["2028-01-31", "2028-02-29", "2028-03-31"]);
  const ordinary = calculatePaycheckDeadline({ ...input, frequency: "monthly", nextPayday: "2027-01-31", dueDate: "2027-04-01" });
  assert.deepEqual(dates(ordinary), ["2027-01-31", "2027-02-28", "2027-03-31"]);
});

test("semimonthly schedules use two calendar days, including month-end", () => {
  const plan = calculatePaycheckDeadline({ ...input, frequency: "semimonthly", firstPayDay: 15, secondPayDay: 31, nextPayday: "2028-02-15", dueDate: "2028-04-01" });
  assert.deepEqual(dates(plan), ["2028-02-15", "2028-02-29", "2028-03-15", "2028-03-31"]);
  const shortMonth = calculatePaycheckDeadline({ ...input, frequency: "semimonthly", firstPayDay: 29, secondPayDay: 31, nextPayday: "2027-02-28", dueDate: "2027-04-01" });
  assert.deepEqual(dates(shortMonth), ["2027-02-28", "2027-03-29", "2027-03-31"]);
});

test("weekly schedule crosses DST and year-end as calendar dates", () => {
  assert.deepEqual(dates(calculatePaycheckDeadline({ ...input, frequency: "weekly", nextPayday: "2027-03-07", dueDate: "2027-03-29" })), ["2027-03-07", "2027-03-14", "2027-03-21", "2027-03-28"]);
  assert.deepEqual(dates(calculatePaycheckDeadline({ ...input, nextPayday: "2027-12-24", dueDate: "2028-01-15" })), ["2027-12-24", "2028-01-07"]);
});

test("already funded rent never creates a negative reserve or spends excess", () => {
  const plan = calculatePaycheckDeadline({ ...input, savedCents: 250000n });
  assert.equal(plan.remainingCents, 0n);
  assert.equal(plan.excessCents, 50000n);
  assert.equal(plan.unfundedCents, 0n);
  assert.ok(plan.rows.every((row) => row.reserveCents === 0n && row.balanceCents === 250000n));
});

test("a payday after the deadline reports the full shortfall", () => {
  const plan = calculatePaycheckDeadline({ ...input, nextPayday: "2027-02-05" });
  assert.equal(plan.ok, true);
  assert.equal(plan.rows.length, 0);
  assert.equal(plan.unfundedCents, 150000n);
});

test("invalid dates, money, schedule and overlong horizons are rejected", () => {
  for (const invalid of [
    { nextPayday: "" }, { dueDate: "2027-02-29" }, { nextPayday: "2027-2-01" },
    { rentCents: -1n }, { savedCents: -1n }, { frequency: "quarterly" },
    { dueDate: "2029-02-01" },
    { frequency: "semimonthly", firstPayDay: 0, secondPayDay: 15 },
    { frequency: "semimonthly", firstPayDay: 15, secondPayDay: 15 },
    { frequency: "semimonthly", firstPayDay: 1, secondPayDay: 15 },
  ]) {
    assert.equal(calculatePaycheckDeadline({ ...input, ...invalid }).ok, false, JSON.stringify(invalid, (_, value) => typeof value === "bigint" ? String(value) : value));
  }
});

test("large cent amounts remain exact", () => {
  const rentCents = 99999999999999999999999999n;
  const plan = calculatePaycheckDeadline({ ...input, rentCents, savedCents: 1n });
  assert.equal(plan.rows.reduce((sum, row) => sum + row.reserveCents, 1n), rentCents);
});

test("four-week summary uses the exact 28/365 route conversion, not annual rent divided by 13", () => {
  const source = readFileSync("app/routes/rent-per-paycheck-calculator.tsx", "utf8");
  const pure = source.slice(source.indexOf("function annualizeFromScaled"), source.indexOf("function safeParseBoolean"));
  const compiled = ts.transpileModule(pure, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const { convertScaled } = vm.runInNewContext(`${compiled}\n({ convertScaled })`);
  const scale = 1000000000000n;
  const actual = convertScaled(2000n * scale, "monthly", "every_4_weeks");
  const expected = (24000n * scale * 28n + 365n / 2n) / 365n;
  assert.equal(actual, expected);
  assert.equal((actual * 100n + scale / 2n) / scale, 184110n);
  assert.notEqual(actual, 24000n * scale / 13n);
  const summary = source.slice(source.indexOf("4-week rent amount"), source.indexOf("4-week rent amount") + 350);
  assert.match(summary, /fmtMoney\(computed\.rentBreakdown\.every_4_weeks\)/);
});
