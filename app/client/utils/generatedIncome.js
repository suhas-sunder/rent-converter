const MAX_MONEY_CENTS = 900_000_000_000_000n;

/**
 * @typedef {"empty" | "format" | "range"} IncomeFieldErrorCode
 * @typedef {{ ok: false, code: IncomeFieldErrorCode, error: string }} IncomeFieldError
 * @typedef {{ ok: true, cents: bigint, normalized: string, warnings: string[] }} ParsedMoneyField
 * @typedef {{ ok: true, value: number, hundredths: number }} ParsedHoursField
 * @typedef {ParsedMoneyField | IncomeFieldError} MoneyFieldResult
 * @typedef {ParsedHoursField | IncomeFieldError} HoursFieldResult
 */

/**
 * Parse a generated-income money field without deleting unsupported characters.
 * Currency is selected separately in the UI, but a single leading currency symbol
 * remains accepted for familiar inputs such as "$1,200.50".
 *
 * @param {string} raw
 * @param {string} label
 * @param {{ allowZero?: boolean }} [options]
 * @returns {MoneyFieldResult}
 */
export function parseIncomeMoney(raw, label, options = {}) {
  const source = String(raw ?? "").trim();
  if (!source) {
    return { ok: false, code: "empty", error: `Enter ${label.toLowerCase()}.` };
  }

  let value = source.replace(/^[£$€¥₹₩]\s*/u, "").trim();
  if (!value || /[^\d.,\s-]/u.test(value)) {
    return {
      ok: false,
      code: "format",
      error: `Enter ${label.toLowerCase()} as a number, such as 1200 or 1,200.50.`,
    };
  }
  if (value.includes("-")) {
    return { ok: false, code: "range", error: `${label} cannot be negative.` };
  }

  if (/\s/u.test(value)) {
    const spacedFormat = /^\d{1,3}(?:\s+\d{3})+(?:[.,]\d+)?$/u;
    if (!spacedFormat.test(value)) {
      return {
        ok: false,
        code: "format",
        error: `Enter ${label.toLowerCase()} with valid digit grouping.`,
      };
    }
    value = value.replace(/\s+/gu, "");
  }

  const normalizedParts = normalizeMoneyParts(value);
  if (!normalizedParts.ok) {
    return { ok: false, code: "format", error: normalizedParts.error };
  }

  const { wholePart, fractionPart, warnings } = normalizedParts;
  const paddedFraction = fractionPart.padEnd(3, "0").slice(0, 3);
  const centsPart = BigInt(paddedFraction.slice(0, 2) || "0");
  const roundedCent = Number(paddedFraction[2] ?? "0") >= 5 ? 1n : 0n;
  const cents = BigInt(wholePart) * 100n + centsPart + roundedCent;

  if (!options.allowZero && cents === 0n) {
    return { ok: false, code: "range", error: `${label} must be greater than zero.` };
  }
  if (cents > MAX_MONEY_CENTS) {
    return { ok: false, code: "range", error: `${label} is too large to calculate safely.` };
  }

  return {
    ok: true,
    cents,
    normalized: fractionPart ? `${wholePart}.${fractionPart.slice(0, 12)}` : wholePart,
    warnings,
  };
}

/**
 * @param {string} value
 * @returns {{ ok: true, wholePart: string, fractionPart: string, warnings: string[] } | { ok: false, error: string }}
 */
function normalizeMoneyParts(value) {
  const dotCount = (value.match(/\./g) ?? []).length;
  const commaCount = (value.match(/,/g) ?? []).length;
  /** @type {string[]} */
  const warnings = [];
  let wholePart = value;
  let fractionPart = "";

  if (dotCount && commaCount) {
    const decimalSeparator = value.lastIndexOf(".") > value.lastIndexOf(",") ? "." : ",";
    const groupingSeparator = decimalSeparator === "." ? "," : ".";
    if ((decimalSeparator === "." ? dotCount : commaCount) !== 1) {
      return { ok: false, error: "Enter a valid number with one decimal separator." };
    }
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const groupedWhole = value.slice(0, decimalIndex);
    fractionPart = value.slice(decimalIndex + 1);
    if (!validGroupedWhole(groupedWhole, groupingSeparator) || !/^\d{1,12}$/.test(fractionPart)) {
      return { ok: false, error: "Enter a valid number, such as 1,200.50 or 1.200,50." };
    }
    wholePart = groupedWhole.split(groupingSeparator).join("");
  } else if (dotCount || commaCount) {
    const separator = dotCount ? "." : ",";
    const count = dotCount || commaCount;
    const parts = value.split(separator);
    if (count > 1) {
      if (!validGroupedWhole(value, separator)) {
        return { ok: false, error: "Enter a valid number with correctly grouped digits." };
      }
      wholePart = parts.join("");
      warnings.push(`Interpreted "${value}" as thousands grouping.`);
    } else {
      const before = parts[0] ?? "";
      const after = parts[1] ?? "";
      if (!/^\d+$/.test(before) || !/^\d+$/.test(after)) {
        return { ok: false, error: "Enter a valid number with digits on both sides of the separator." };
      }
      if (after.length === 3 && before.length <= 3) {
        wholePart = `${before}${after}`;
        warnings.push(`Interpreted "${value}" as thousands grouping.`);
      } else if (after.length <= 12) {
        wholePart = before;
        fractionPart = after;
      } else {
        return { ok: false, error: "Enter no more than 12 decimal places." };
      }
    }
  }

  if (!/^\d+$/.test(wholePart) || (fractionPart && !/^\d+$/.test(fractionPart))) {
    return { ok: false, error: "Enter a valid number." };
  }

  return {
    ok: true,
    wholePart: wholePart.replace(/^0+(?=\d)/, "") || "0",
    fractionPart,
    warnings,
  };
}

/** @param {string} value @param {string} separator */
function validGroupedWhole(value, separator) {
  const escaped = separator === "." ? "\\." : separator;
  return new RegExp(`^\\d{1,3}(?:${escaped}\\d{3})+$`).test(value);
}

/**
 * @param {string} raw
 * @returns {HoursFieldResult}
 */
export function parseHoursPerWeek(raw) {
  const source = String(raw ?? "").trim();
  if (!source) {
    return { ok: false, code: "empty", error: "Enter hours per week." };
  }
  if (source.startsWith("-")) {
    return { ok: false, code: "range", error: "Hours per week must be greater than zero." };
  }
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(source)) {
    return {
      ok: false,
      code: "format",
      error: "Enter hours per week as a number with up to two decimal places.",
    };
  }

  const value = Number(source.replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, code: "range", error: "Hours per week must be greater than zero." };
  }
  if (value > 168) {
    return { ok: false, code: "range", error: "Hours per week cannot exceed 168." };
  }
  return { ok: true, value, hundredths: Math.round(value * 100) };
}

/** @param {bigint} numerator @param {bigint} denominator */
function divideAndRound(numerator, denominator) {
  if (denominator === 0n) return 0n;
  const sign = numerator < 0n ? -1n : 1n;
  const absolute = numerator < 0n ? -numerator : numerator;
  return sign * ((absolute + denominator / 2n) / denominator);
}

/** @param {bigint} annualGrossIncome */
export function calculateIncomeReferences(annualGrossIncome) {
  return {
    monthlyGrossIncome: divideAndRound(annualGrossIncome, 12n),
    monthlyRentAt30: divideAndRound(annualGrossIncome * 30n, 1200n),
    monthlyRentAt40: divideAndRound(annualGrossIncome * 40n, 1200n),
    monthlyRentAt3x: divideAndRound(annualGrossIncome, 36n),
  };
}

/** @param {bigint} annualGrossIncome @param {bigint} plannedMonthlyRent */
export function calculateSalaryComparison(annualGrossIncome, plannedMonthlyRent) {
  const references = calculateIncomeReferences(annualGrossIncome);
  return {
    ...references,
    plannedRentPercent: percentageOf(plannedMonthlyRent, references.monthlyGrossIncome),
  };
}

/** @param {bigint} monthlyIncome @param {bigint} monthlyRent */
export function calculateRentToIncomeRatio(monthlyIncome, monthlyRent) {
  return {
    monthlyIncome,
    monthlyRent,
    rentPercent: percentageOf(monthlyRent, monthlyIncome),
    remainingAfterRent: monthlyIncome - monthlyRent,
  };
}

/** @param {bigint} hourlyPay @param {number} hoursHundredths @param {bigint} plannedMonthlyRent */
export function calculateHourlyIncome(hourlyPay, hoursHundredths, plannedMonthlyRent) {
  const annualGrossIncome = divideAndRound(hourlyPay * BigInt(hoursHundredths) * 52n, 100n);
  const references = calculateIncomeReferences(annualGrossIncome);
  return {
    annualGrossIncome,
    ...references,
    plannedRentPercent: percentageOf(plannedMonthlyRent, references.monthlyGrossIncome),
  };
}

/** @param {bigint} annualGrossIncome @param {30 | 40} percent */
export function calculateFixedRentRule(annualGrossIncome, percent) {
  const annualRent = divideAndRound(annualGrossIncome * BigInt(percent), 100n);
  return { annualRent, monthlyRent: divideAndRound(annualRent, 12n) };
}

/**
 * @param {bigint} annualGrossIncome
 * @param {bigint} plannedMonthlyRent
 * @param {bigint} monthlyNonRentExpenses
 */
export function calculateRentBudget(annualGrossIncome, plannedMonthlyRent, monthlyNonRentExpenses) {
  const references = calculateIncomeReferences(annualGrossIncome);
  return {
    ...references,
    plannedRentPercent: percentageOf(plannedMonthlyRent, references.monthlyGrossIncome),
    remainingAfterRentAndExpenses:
      references.monthlyGrossIncome - plannedMonthlyRent - monthlyNonRentExpenses,
  };
}

/** @param {bigint} monthlyRent @param {number} multiplier */
export function calculateRequiredIncome(monthlyRent, multiplier) {
  const multiplierHundredths = Math.round(multiplier * 100);
  const requiredMonthlyIncome = divideAndRound(monthlyRent * BigInt(multiplierHundredths), 100n);
  return { monthlyRent, requiredMonthlyIncome, requiredAnnualIncome: requiredMonthlyIncome * 12n };
}

/** @param {bigint} part @param {bigint} whole */
function percentageOf(part, whole) {
  return Number(divideAndRound(part * 10_000n, whole)) / 100;
}
