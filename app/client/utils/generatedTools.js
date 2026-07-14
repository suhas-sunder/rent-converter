/**
 * Strict scalar parsing and pure calculations for generated increase, split,
 * and proration tools. User-entered values are never cleaned, clamped, or
 * replaced with configured defaults after editing.
 */

/** @typedef {"empty" | "format" | "range" | "integer"} ScalarErrorCode */
/** @typedef {{ ok: true, value: number } | { ok: false, code: ScalarErrorCode, error: string }} ScalarParseResult */
/** @typedef {{ ok: true, combinedIncome: bigint, percentA: number, percentB: number, shareA: bigint, shareB: bigint } | { ok: false, error: string }} IncomeSplitResult */

/**
 * @param {string} raw
 * @param {string} label
 * @param {{ min: number, max: number, integer?: boolean, maxDecimalPlaces?: number }} options
 * @returns {ScalarParseResult}
 */
export function parseStrictScalar(raw, label, options) {
  const source = String(raw ?? "").trim();
  if (!source) {
    return { ok: false, code: "empty", error: `Enter ${label.toLowerCase()}.` };
  }
  if (source.startsWith("-")) {
    return { ok: false, code: "range", error: `${label} must be between ${options.min} and ${options.max}.` };
  }
  if (!/^\d+(?:\.\d+)?$/.test(source)) {
    return { ok: false, code: "format", error: `Enter ${label.toLowerCase()} as a number without letters or unsupported separators.` };
  }
  if (options.integer && source.includes(".")) {
    return { ok: false, code: "integer", error: `${label} must be a whole number.` };
  }
  const decimalPlaces = source.includes(".") ? (source.split(".")[1] ?? "").length : 0;
  if (!options.integer && decimalPlaces > (options.maxDecimalPlaces ?? 6)) {
    return { ok: false, code: "format", error: `${label} has too many decimal places.` };
  }
  const value = Number(source);
  if (!Number.isFinite(value)) {
    return { ok: false, code: "format", error: `Enter a valid ${label.toLowerCase()}.` };
  }
  if (value < options.min || value > options.max) {
    return { ok: false, code: "range", error: `${label} must be between ${options.min} and ${options.max}.` };
  }
  return { ok: true, value };
}

/** @param {string} raw @param {string} [label] */
export function parsePercentage(raw, label = "Percentage") {
  return parseStrictScalar(raw, label, { min: 0, max: 100, maxDecimalPlaces: 4 });
}

/** @param {string} raw @param {string} [label] */
export function parseYears(raw, label = "Years") {
  return parseStrictScalar(raw, label, { min: 1, max: 100, integer: true });
}

/** @param {string} raw @param {string} label @param {number} min @param {number} max */
export function parseWholeNumberInRange(raw, label, min, max) {
  return parseStrictScalar(raw, label, { min, max, integer: true });
}

/** @param {bigint} numerator @param {bigint} denominator */
function divideAndRound(numerator, denominator) {
  if (denominator === 0n) return 0n;
  const sign = numerator < 0n ? -1n : 1n;
  const absolute = numerator < 0n ? -numerator : numerator;
  return sign * ((absolute + denominator / 2n) / denominator);
}

/** @param {number} percentage */
function percentageUnits(percentage) {
  return BigInt(Math.round(percentage * 10_000));
}

/** @param {bigint} rent @param {number} percentage */
export function calculateOneStepIncrease(rent, percentage) {
  const increase = divideAndRound(rent * percentageUnits(percentage), 1_000_000n);
  return { currentRent: rent, percentage, increase, newRent: rent + increase };
}

/** @param {bigint} startingRent @param {number} percentage @param {number} years */
export function calculateCompoundIncrease(startingRent, percentage, years) {
  const rows = [{ year: 0, rent: startingRent }];
  let current = startingRent;
  for (let year = 1; year <= years; year += 1) {
    current = calculateOneStepIncrease(current, percentage).newRent;
    rows.push({ year, rent: current });
  }
  const totalIncrease = current - startingRent;
  const totalPercentage = startingRent === 0n
    ? 0
    : Number(divideAndRound(totalIncrease * 1_000_000n, startingRent)) / 10_000;
  return { startingRent, percentage, years, finalRent: current, totalIncrease, totalPercentage, rows };
}

/** @param {bigint} total @param {bigint} incomeA @param {bigint} incomeB @returns {IncomeSplitResult} */
export function calculateIncomeSplit(total, incomeA, incomeB) {
  const combinedIncome = incomeA + incomeB;
  if (combinedIncome <= 0n) {
    return { ok: false, error: "Combined monthly income must be greater than zero." };
  }
  const shareA = divideAndRound(total * incomeA, combinedIncome);
  const shareB = total - shareA;
  return {
    ok: true,
    combinedIncome,
    percentA: Number(divideAndRound(incomeA * 1_000_000n, combinedIncome)) / 10_000,
    percentB: Number(divideAndRound(incomeB * 1_000_000n, combinedIncome)) / 10_000,
    shareA,
    shareB,
  };
}

/** @param {bigint} total @param {number} percentA */
export function calculatePercentageSplit(total, percentA) {
  const shareA = divideAndRound(total * percentageUnits(percentA), 1_000_000n);
  return { percentA, percentB: 100 - percentA, shareA, shareB: total - shareA };
}

/** @param {bigint} total */
export function calculateEqualSplit(total) {
  const shareA = divideAndRound(total, 2n);
  return { shareA, shareB: total - shareA };
}

/**
 * Divide an already rounded cent total across a whole number of participants.
 * The first `remainderCount` participants pay one cent above the base share.
 * @param {bigint} totalCents
 * @param {number} participants
 */
export function calculateEqualCentAllocation(totalCents, participants) {
  if (!Number.isInteger(participants) || participants < 1) {
    throw new RangeError("Participants must be a positive whole number.");
  }
  const participantCount = BigInt(participants);
  const baseShare = totalCents / participantCount;
  const remainderCount = Number(totalCents % participantCount);
  return {
    totalCents,
    participants,
    baseShare,
    higherShare: baseShare + (remainderCount > 0 ? 1n : 0n),
    remainderCount,
    baseShareCount: participants - remainderCount,
  };
}

/** @param {bigint} rent @param {number} chargedDays @param {number} periodDays */
export function calculateProration(rent, chargedDays, periodDays) {
  return {
    rent,
    chargedDays,
    periodDays,
    dailyRate: divideAndRound(rent, BigInt(periodDays)),
    proratedRent: divideAndRound(rent * BigInt(chargedDays), BigInt(periodDays)),
  };
}

/**
 * Calculate Australian move-in arithmetic from user-entered amounts.
 * Advance weeks are represented to four decimal places so the rent-in-advance
 * result can be rounded once to cents before adding the entered bond.
 * @param {bigint} weeklyRent
 * @param {number} advanceWeeks
 * @param {bigint} bond
 */
export function calculateAustraliaMoveInCost(weeklyRent, advanceWeeks, bond) {
  const advanceWeekUnits = BigInt(Math.round(advanceWeeks * 10_000));
  const rentInAdvance = divideAndRound(weeklyRent * advanceWeekUnits, 10_000n);
  return {
    weeklyRent,
    advanceWeeks,
    rentInAdvance,
    bond,
    total: rentInAdvance + bond,
  };
}
