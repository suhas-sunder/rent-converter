import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createSavedStateController,
  validSavedBoolean,
  validSavedCurrency,
  validSavedDecimal,
  validSavedEnum,
  validSavedMoney,
  validSavedPercentage,
  validSavedWholeNumber,
} from "../app/client/utils/savedState.js";

class MemoryStorage {
  constructor(entries = {}) {
    this.values = new Map(Object.entries(entries));
  }

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  key(index) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key) {
    this.values.delete(key);
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }
}

test("saved money accepts supported formats and rejects malformed values", () => {
  assert.equal(validSavedMoney("1200", "Rent", { allowZero: false }), "1200");
  assert.equal(validSavedMoney("$1,200.50", "Rent", { allowZero: false }), "1200.50");
  assert.equal(validSavedMoney("1.200,50", "Rent", { allowZero: false }), "1200.50");
  for (const raw of ["", "abc", "1e2", "12abc", "1.2.3", "--", "-1"]) {
    assert.equal(validSavedMoney(raw, "Rent", { allowZero: false }), undefined, raw);
  }
  assert.equal(validSavedMoney("0", "Income", { allowZero: false }), undefined);
  assert.equal(validSavedMoney("0", "Costs", { allowZero: true }), "0");
});

test("saved enum, currency, participant, percentage, decimal, and boolean validation is strict", () => {
  assert.equal(validSavedCurrency("AUD"), "AUD");
  assert.equal(validSavedCurrency("BTC"), undefined);
  assert.equal(validSavedEnum("weekly", ["weekly", "monthly"]), "weekly");
  assert.equal(validSavedEnum("quarterly", ["weekly", "monthly"]), undefined);
  assert.equal(validSavedWholeNumber("4", { min: 1, max: 100 }), "4");
  for (const raw of ["", "1.5", "0", "101", "1e2", "abc"]) {
    assert.equal(validSavedWholeNumber(raw, { min: 1, max: 100 }), undefined, raw);
  }
  assert.equal(validSavedPercentage("25.5"), "25.5");
  assert.equal(validSavedPercentage("101"), undefined);
  assert.equal(validSavedPercentage("3,5"), undefined);
  assert.equal(validSavedDecimal("2.5", { min: 0, max: 100 }), "2.5");
  assert.equal(validSavedDecimal("1e2", { min: 0, max: 100 }), undefined);
  assert.equal(validSavedBoolean("true"), true);
  assert.equal(validSavedBoolean("false"), false);
  assert.equal(validSavedBoolean("1"), undefined);
});

test("controller restores once and does not write before restoration completes", () => {
  const storage = new MemoryStorage({ amount: "2500", unrelated: "preserve-me" });
  const controller = createSavedStateController();
  let restored = 0;
  let writes = 0;

  assert.equal(controller.getStatus(), "not-mounted");
  assert.equal(controller.canWrite(), false);
  assert.equal(controller.write(storage, () => writes++), false);

  const first = controller.restore(storage, (saved) => {
    restored += 1;
    return validSavedMoney(saved.getItem("amount"), "Amount", { allowZero: false }) === "2500";
  });
  assert.deepEqual(first, { status: "saved-state-applied", applied: true });
  assert.equal(controller.canWrite(), true);

  const second = controller.restore(storage, () => {
    restored += 1;
    return false;
  });
  assert.deepEqual(second, { status: "saved-state-applied", applied: true });
  assert.equal(restored, 1);
  assert.equal(controller.write(storage, (saved) => {
    writes += 1;
    saved.setItem("amount", "2600");
  }), true);
  assert.equal(writes, 1);
  assert.equal(storage.getItem("amount"), "2600");
  assert.equal(storage.getItem("unrelated"), "preserve-me");
});

test("grouped restoration rejects incomplete or contradictory saved state", () => {
  const restoreIncomeRequiredGroup = (storage) => {
    const mode = validSavedBoolean(storage.getItem("mode"));
    const preset = validSavedEnum(storage.getItem("preset"), ["2", "2.5", "3", "custom"]);
    const custom = validSavedDecimal(storage.getItem("custom"), { min: 0.01, max: 100 });
    const rent = validSavedMoney(storage.getItem("rent"), "Rent", { allowZero: true });
    const income = validSavedMoney(storage.getItem("income"), "Income", { allowZero: true });
    return mode !== undefined && preset !== undefined && custom !== undefined && rent !== undefined && income !== undefined;
  };

  const coherent = new MemoryStorage({ mode: "true", preset: "custom", custom: "3.5", rent: "1800", income: "6300" });
  assert.equal(restoreIncomeRequiredGroup(coherent), true);
  assert.equal(restoreIncomeRequiredGroup(new MemoryStorage({ mode: "true", preset: "custom", rent: "1800", income: "6300" })), false);
  assert.equal(restoreIncomeRequiredGroup(new MemoryStorage({ mode: "true", preset: "custom", custom: "abc", rent: "1800", income: "6300" })), false);
});

test("unavailable or throwing storage fails safely and enables no write", () => {
  const unavailable = createSavedStateController();
  assert.deepEqual(unavailable.restore(null, () => true), { status: "storage-unavailable", applied: false });
  assert.equal(unavailable.write(null, () => assert.fail("must not write")), false);

  const throwing = {
    getItem() {
      throw new Error("storage blocked");
    },
  };
  const blocked = createSavedStateController();
  assert.deepEqual(blocked.restore(throwing, (storage) => Boolean(storage.getItem("value"))), {
    status: "storage-unavailable",
    applied: false,
  });
  assert.equal(blocked.write(throwing, () => assert.fail("must not write")), false);
});

test("all scoped routes use deterministic defaults plus the shared post-mount lifecycle", () => {
  const routes = [
    "home.tsx",
    "weekly-to-monthly-rent-converter.tsx",
    "monthly-to-weekly-rent-converter.tsx",
    "daily-to-monthly-rent-converter.tsx",
    "rent-paid-every-4-weeks-calculator.tsx",
    "weekly-to-monthly-rent-australia.tsx",
    "rent-per-paycheck-calculator.tsx",
    "how-much-rent-can-i-afford-calculator.tsx",
    "income-required-for-rent-calculator.tsx",
    "rent-as-percentage-of-income-calculator.tsx",
    "rent-after-tax-income-calculator.tsx",
    "rent-vs-take-home-pay-calculator.tsx",
    "rent-increase-calculator.tsx",
    "rent-increase-percentage-calculator.tsx",
    "rent-split-calculator.tsx",
  ];

  for (const route of routes) {
    const source = readFileSync(new URL(`../app/routes/${route}`, import.meta.url), "utf8");
    assert.match(source, /useHydrationSafeSavedState\s*\(/, route);
    assert.doesNotMatch(source, /window\.localStorage|(?<![\w.])localStorage\.(?:getItem|setItem)/, route);
    assert.doesNotMatch(source, /suppressHydrationWarning/, route);
  }
});
