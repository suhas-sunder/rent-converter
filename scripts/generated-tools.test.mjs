import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { parseIncomeMoney } from "../app/client/utils/generatedIncome.js";
import {
  calculateCompoundIncrease,
  calculateEqualCentAllocation,
  calculateEqualSplit,
  calculateIncomeSplit,
  calculateOneStepIncrease,
  calculatePercentageSplit,
  calculateProration,
  parsePercentage,
  parseStrictScalar,
  parseWholeNumberInRange,
  parseYears,
} from "../app/client/utils/generatedTools.js";

test("strict scalar parsing accepts whole numbers and decimal percentages", () => {
  assert.deepEqual(parseWholeNumberInRange("12", "Years", 1, 100), { ok: true, value: 12 });
  assert.deepEqual(parsePercentage("2.5"), { ok: true, value: 2.5 });
});

test("strict scalar parsing rejects malformed values without fallback", () => {
  for (const raw of ["", "abc", "1e2", "12abc", "1.2.3", "3,5", ".", "--"]) {
    assert.equal(parseStrictScalar(raw, "Value", { min: 0, max: 100 }).ok, false, raw);
  }
  assert.equal(parsePercentage("-1").ok, false);
  assert.equal(parsePercentage("100.01").ok, false);
  assert.equal(parseWholeNumberInRange("1.5", "Years", 1, 100).ok, false);
});

test("one-step increase supports 0%, decimals, normal rates, and 100%", () => {
  assert.deepEqual(calculateOneStepIncrease(200_000n, 0), { currentRent: 200_000n, percentage: 0, increase: 0n, newRent: 200_000n });
  assert.equal(calculateOneStepIncrease(200_000n, 5).newRent, 210_000n);
  assert.equal(calculateOneStepIncrease(200_000n, 2.5).newRent, 205_000n);
  assert.equal(calculateOneStepIncrease(200_000n, 100).newRent, 400_000n);
  assert.equal(parsePercentage("bad").ok, false);
});

test("compound and escalation math uses strict whole-year terms", () => {
  assert.equal(calculateCompoundIncrease(200_000n, 10, 1).finalRent, 220_000n);
  const multi = calculateCompoundIncrease(200_000n, 10, 2);
  assert.equal(multi.finalRent, 242_000n);
  assert.equal(multi.totalIncrease, 42_000n);
  assert.equal(multi.totalPercentage, 21);
  assert.equal(calculateCompoundIncrease(200_000n, 2.5, 2).finalRent, 210_125n);
  assert.equal("cumulativeTotalPaid" in multi, false);
  for (const raw of ["", "abc", "1.5", "0", "-1", "101"]) assert.equal(parseYears(raw).ok, false, raw);
});

test("retired regional configs and their generated one-step renderer are removed", () => {
  const renderer = readFileSync(new URL("../app/client/components/generated/GeneratedPages.tsx", import.meta.url), "utf8");
  const config = readFileSync(new URL("../app/client/data/generatedRouteConfigs.ts", import.meta.url), "utf8");
  assert.doesNotMatch(renderer, /function OneStepIncreaseTool/);
  assert.doesNotMatch(renderer, /May 7, 2026/);
  for (const path of ["ontario", "bc", "quebec", "california"]) {
    assert.doesNotMatch(config, new RegExp(`/${path}-rent-increase-calculator`));
  }
  assert.doesNotMatch(config, /mode:\s*"regional"|regionNote:/);
});

test("income split handles normal, equal, and zero-income cases and reconciles cents", () => {
  const normal = calculateIncomeSplit(240_000n, 400_000n, 600_000n);
  assert.equal(normal.ok, true);
  if (normal.ok) {
    assert.equal(normal.shareA, 96_000n);
    assert.equal(normal.shareB, 144_000n);
    assert.equal(normal.shareA + normal.shareB, 240_000n);
  }
  const equal = calculateIncomeSplit(240_001n, 500_000n, 500_000n);
  assert.equal(equal.ok, true);
  if (equal.ok) assert.equal(equal.shareA + equal.shareB, 240_001n);
  const oneZero = calculateIncomeSplit(240_000n, 0n, 600_000n);
  assert.equal(oneZero.ok, true);
  if (oneZero.ok) assert.deepEqual([oneZero.shareA, oneZero.shareB], [0n, 240_000n]);
  assert.equal(calculateIncomeSplit(240_000n, 0n, 0n).ok, false);
  assert.equal(parseIncomeMoney("bad", "Person A monthly income", { allowZero: true }).ok, false);
});

test("split utilities default behavior and entered costs are explicit in the total", () => {
  const rentOnly = calculateIncomeSplit(240_000n + 0n, 400_000n, 600_000n);
  const withCosts = calculateIncomeSplit(240_000n + 30_000n, 400_000n, 600_000n);
  assert.equal(rentOnly.ok, true);
  assert.equal(withCosts.ok, true);
  if (rentOnly.ok && withCosts.ok) {
    assert.equal(rentOnly.shareA + rentOnly.shareB, 240_000n);
    assert.equal(withCosts.shareA + withCosts.shareB, 270_000n);
  }
});

test("percentage split supports boundaries and decimals and always reconciles", () => {
  for (const percent of [0, 50, 33.33, 100]) {
    const result = calculatePercentageSplit(240_001n, percent);
    assert.equal(result.shareA + result.shareB, 240_001n);
  }
  assert.deepEqual(calculatePercentageSplit(240_000n, 50), { percentA: 50, percentB: 50, shareA: 120_000n, shareB: 120_000n });
  assert.equal(parsePercentage("abc").ok, false);
  assert.equal(parsePercentage("101").ok, false);
  assert.deepEqual(calculateEqualSplit(240_001n), { shareA: 120_001n, shareB: 120_000n });
});

test("equal multi-person cent allocation reconciles rent and shared costs exactly", () => {
  assert.deepEqual(calculateEqualCentAllocation(255_000n, 3), {
    totalCents: 255_000n,
    participants: 3,
    baseShare: 85_000n,
    higherShare: 85_000n,
    remainderCount: 0,
    baseShareCount: 3,
  });

  const remainder = calculateEqualCentAllocation(10_000n, 3);
  assert.equal(remainder.baseShare, 3_333n);
  assert.equal(remainder.higherShare, 3_334n);
  assert.equal(remainder.remainderCount, 1);
  assert.equal(remainder.baseShareCount, 2);
  assert.equal(
    remainder.higherShare * BigInt(remainder.remainderCount) +
      remainder.baseShare * BigInt(remainder.baseShareCount),
    remainder.totalCents,
  );
  assert.throws(() => calculateEqualCentAllocation(100n, 0), RangeError);
});

test("proration calculates zero, partial, and full periods without fallback", () => {
  assert.equal(calculateProration(180_000n, 10, 30).proratedRent, 60_000n);
  assert.equal(calculateProration(180_000n, 0, 30).proratedRent, 0n);
  assert.equal(calculateProration(180_000n, 30, 30).proratedRent, 180_000n);
  for (const raw of ["", "abc", "1.5", "-1"]) assert.equal(parseWholeNumberInRange(raw, "Charged days", 0, 366).ok, false, raw);
  assert.equal(parseWholeNumberInRange("0", "Days in rent period", 1, 366).ok, false);
  assert.equal(parseWholeNumberInRange("367", "Days in rent period", 1, 366).ok, false);
  const charged = parseWholeNumberInRange("31", "Charged days", 0, 366);
  const period = parseWholeNumberInRange("30", "Days in rent period", 1, 366);
  assert.equal(charged.ok && period.ok && charged.value > period.value, true);
});
