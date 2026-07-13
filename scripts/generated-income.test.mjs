import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateFixedRentRule,
  calculateHourlyIncome,
  calculateIncomeReferences,
  calculateRentBudget,
  calculateRentToIncomeRatio,
  calculateSalaryComparison,
  parseHoursPerWeek,
  parseIncomeMoney,
} from "../app/client/utils/generatedIncome.js";

function money(raw, label = "Annual gross income", options) {
  const parsed = parseIncomeMoney(raw, label, options);
  assert.equal(parsed.ok, true, parsed.ok ? undefined : parsed.error);
  return parsed.cents;
}

test("salary mode calculates 30%, 40%, and 3x references without expenses", () => {
  const salary = money("60000", "Annual gross salary");
  const result = calculateSalaryComparison(salary, money("1500", "Planned monthly rent", { allowZero: true }));
  assert.deepEqual(result, {
    monthlyGrossIncome: 500_000n,
    monthlyRentAt30: 150_000n,
    monthlyRentAt40: 200_000n,
    monthlyRentAt3x: 166_667n,
    plannedRentPercent: 30,
  });
  assert.equal("remainingAfterExpenses" in result, false);
});

test("salary parser accepts decimal and formatted salary values", () => {
  assert.equal(money("60000.50"), 6_000_050n);
  assert.equal(money("$60,000.50"), 6_000_050n);
  assert.equal(money("60.000,50"), 6_000_050n);
});

test("salary parser reports empty, malformed, and negative values", () => {
  for (const [raw, code] of [["", "empty"], ["abc", "format"], ["-1", "range"], ["1e2", "format"], ["12abc", "format"], ["1.2.3", "format"]]) {
    const parsed = parseIncomeMoney(raw, "Annual gross salary");
    assert.equal(parsed.ok, false);
    assert.equal(parsed.code, code);
  }
});

test("ratio mode uses only visible monthly income and rent", () => {
  const result = calculateRentToIncomeRatio(money("5000", "Monthly income"), money("1500", "Monthly rent", { allowZero: true }));
  assert.equal(result.rentPercent, 30);
  assert.equal(result.remainingAfterRent, 350_000n);
  assert.equal("expenses" in result, false);
});

test("ratio mode rejects zero income and malformed income or rent", () => {
  for (const parsed of [
    parseIncomeMoney("0", "Monthly income"),
    parseIncomeMoney("income", "Monthly income"),
    parseIncomeMoney("12abc", "Monthly rent", { allowZero: true }),
  ]) assert.equal(parsed.ok, false);
});

test("hourly mode uses hourly pay times hours times 52 with no expense input", () => {
  const hours = parseHoursPerWeek("40");
  assert.equal(hours.ok, true);
  if (!hours.ok) return;
  const result = calculateHourlyIncome(money("20", "Hourly pay"), hours.hundredths, money("1200", "Planned monthly rent", { allowZero: true }));
  assert.equal(result.annualGrossIncome, 4_160_000n);
  assert.equal(result.monthlyGrossIncome, 346_667n);
  assert.equal(result.monthlyRentAt30, 104_000n);
  assert.equal(result.monthlyRentAt40, 138_667n);
  assert.equal(result.monthlyRentAt3x, 115_556n);
  assert.equal("remainingAfterExpenses" in result, false);
});

test("hour parser accepts reasonable decimals and rejects invalid ranges and formats", () => {
  const decimal = parseHoursPerWeek("37.5");
  assert.equal(decimal.ok, true);
  if (decimal.ok) assert.equal(decimal.hundredths, 3750);
  for (const [raw, code] of [["", "empty"], ["0", "range"], ["-1", "range"], ["168.01", "range"], ["abc", "format"], ["1e2", "format"]]) {
    const parsed = parseHoursPerWeek(raw);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.code, code);
  }
});

test("fixed 30% and 40% modes use only annual gross income", () => {
  const income = money("60000");
  assert.deepEqual(calculateFixedRentRule(income, 30), { annualRent: 1_800_000n, monthlyRent: 150_000n });
  assert.deepEqual(calculateFixedRentRule(income, 40), { annualRent: 2_400_000n, monthlyRent: 200_000n });
  assert.equal(parseIncomeMoney("bad", "Annual gross income").ok, false);
});

test("budget expenses affect remaining amount but not income reference amounts", () => {
  const income = money("60000");
  const rent = money("1500", "Planned monthly rent", { allowZero: true });
  const noExpenses = calculateRentBudget(income, rent, money("0", "Monthly non-rent expenses", { allowZero: true }));
  const withExpenses = calculateRentBudget(income, rent, money("900", "Monthly non-rent expenses", { allowZero: true }));
  assert.equal(noExpenses.remainingAfterRentAndExpenses, 350_000n);
  assert.equal(withExpenses.remainingAfterRentAndExpenses, 260_000n);
  assert.equal(withExpenses.plannedRentPercent, 30);
  assert.equal(withExpenses.monthlyRentAt30, noExpenses.monthlyRentAt30);
  assert.equal(withExpenses.monthlyRentAt40, noExpenses.monthlyRentAt40);
  assert.equal(withExpenses.monthlyRentAt3x, noExpenses.monthlyRentAt3x);
});

test("budget expenses reject malformed and negative input", () => {
  for (const raw of ["abc", "-100", "1e2", "1.2.3"]) {
    assert.equal(parseIncomeMoney(raw, "Monthly non-rent expenses", { allowZero: true }).ok, false);
  }
});

test("income and max modes expose only gross-income reference calculations", () => {
  const result = calculateIncomeReferences(money("60000"));
  assert.deepEqual(result, {
    monthlyGrossIncome: 500_000n,
    monthlyRentAt30: 150_000n,
    monthlyRentAt40: 200_000n,
    monthlyRentAt3x: 166_667n,
  });
  assert.equal("expenses" in result, false);
  assert.equal("plannedRent" in result, false);
});
