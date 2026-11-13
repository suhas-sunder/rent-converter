import test from "node:test";
import assert from "node:assert/strict";
import { calculateHousingBudget, parseHousingMoney, restoreHousingBudget } from "../app/client/utils/housingBudget.js";

const input = (overrides = {}) => ({
  income: "4000", commitments: "1000", savings: "500",
  items: [
    { key: "rent", label: "Rent", amount: "500", frequency: "weekly" },
    { key: "utilities", label: "Utilities", amount: "300", frequency: "quarterly" },
    { key: "parking", label: "Parking", amount: "0", frequency: "monthly" },
    { key: "insurance", label: "Insurance", amount: "120", frequency: "annual" },
    { key: "other", label: "Other housing costs", amount: "0", frequency: "monthly" },
  ], ...overrides,
});

test("normalizes each bill's period using 365 days without inferring taxes", () => {
  const result = calculateHousingBudget(input());
  assert.equal(result.ok, true);
  // 500 * 365 / 7 / 12 + 300 / 3 + 120 / 12 = 2282.619047...
  assert.equal(result.monthlyHousingCents, 228262n);
  assert.equal(result.remainingCents, 21738n);
  assert.equal(result.housingPercent, "57.07");
  assert.equal(result.items[0].monthlyCents, 217262n);
});

test("fortnightly and weekly match; monthly, quarterly and annual agree", () => {
  const item = input().items[0];
  const calculate = (amount, frequency) => calculateHousingBudget(input({ items: [{ ...item, amount, frequency }] }));
  assert.equal(calculate("1000", "fortnightly").monthlyHousingCents, calculate("500", "weekly").monthlyHousingCents);
  assert.equal(calculate("1200", "annual").monthlyHousingCents, 10000n);
  assert.equal(calculate("300", "quarterly").monthlyHousingCents, 10000n);
  assert.equal(calculate("100", "monthly").monthlyHousingCents, 10000n);
});

test("adds exact bill values before display rounding, including sub-cent inputs", () => {
  const result = calculateHousingBudget(input({ items: [
    { key: "a", label: "A", amount: "0.005", frequency: "monthly" },
    { key: "b", label: "B", amount: "0.005", frequency: "monthly" },
  ] }));
  assert.equal(result.ok, true);
  assert.equal(result.monthlyHousingCents, 1n);
  assert.equal(result.remainingCents, 249999n);
  assert.equal(result.items[0].monthlyCents, 1n);
});

test("reports a shortfall without clamping or inventing affordability verdicts", () => {
  const result = calculateHousingBudget(input({ income: "1000" }));
  assert.equal(result.ok, true);
  assert.equal(result.remainingCents, -278262n);
  assert.equal(result.housingPercent, "228.26");
  const zeroIncome = calculateHousingBudget(input({ income: "0" }));
  assert.equal(zeroIncome.ok, true);
  assert.equal(zeroIncome.housingPercent, null);
});

test("supports familiar currency formats without removing arbitrary text", () => {
  for (const [raw, expected] of [["$1,250.50", "1250.50"], ["1.250,50", "1250.50"], ["1250,50", "1250.50"], [".5", "0.5"], ["12.", "12.0"], ["12.345", "12.3450"]]) {
    const parsed = parseHousingMoney(raw, "Amount");
    assert.equal(parsed.ok, true, raw);
    assert.equal(parsed.normalized, expected, raw);
  }
  for (const raw of ["", "-1", "abc", "1e2", "12abc", "1,2,3", "1.2.3", "Infinity", "999999999999999999999"]) {
    assert.equal(parseHousingMoney(raw, "Amount").ok, false, raw);
  }
});

test("invalid or missing fields hide totals, with field-specific errors", () => {
  const result = calculateHousingBudget(input({ income: "bad", savings: "-1", items: [
    { key: "rent", label: "Rent", amount: "", frequency: "weekly" },
  ] }));
  assert.equal(result.ok, false);
  assert.ok(result.errors.income);
  assert.ok(result.errors.savings);
  assert.ok(result.errors.rent);
  assert.equal("monthlyHousingCents" in result, false);
  assert.equal(calculateHousingBudget(input({ items: [{ key: "rent", label: "Rent", amount: "10", frequency: "daily" }] })).ok, false);
});

test("large supported inputs retain exact cents and zero cost is valid", () => {
  const result = calculateHousingBudget(input({ income: "9000000000000", commitments: "0", savings: "0", items: [
    { key: "rent", label: "Rent", amount: "8999999999999.99", frequency: "monthly" },
  ] }));
  assert.equal(result.ok, true);
  assert.equal(result.remainingCents, 1n);
  const free = calculateHousingBudget(input({ items: [{ key: "rent", label: "Rent", amount: "0", frequency: "monthly" }] }));
  assert.equal(free.ok, true);
  assert.equal(free.monthlyHousingCents, 0n);
});

test("saved state rejects malformed JSON, mismatched items, unsupported periods and invalid money", () => {
  const state = { ...input(), currency: "GBP" };
  assert.deepEqual(restoreHousingBudget(JSON.stringify(state)), state);
  for (const value of [null, "bad", "null", "[]", JSON.stringify({ ...state, items: [] }), JSON.stringify({ ...state, income: "bad" }), JSON.stringify({ ...state, currency: 4 }), JSON.stringify({ ...state, items: state.items.map(item => ({ ...item, frequency: "daily" })) })]) {
    assert.equal(restoreHousingBudget(value), null);
  }
});
