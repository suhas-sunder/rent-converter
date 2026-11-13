import { parseIncomeMoney } from "./generatedIncome.js";

/** @typedef {"monthly" | "weekly" | "fortnightly" | "quarterly" | "annual"} HousingFrequency */
/** @typedef {{ key: string, label: string, amount: string, frequency: HousingFrequency }} HousingItem */
/** @typedef {{ income: string, commitments: string, savings: string, items: HousingItem[] }} HousingBudgetInput */
/** @typedef {HousingBudgetInput & { currency: string }} HousingBudgetSavedState */
/** @typedef {{ ok: true, units: bigint, normalized: string, warnings: string[] } | { ok: false, error: string }} HousingMoneyResult */
/** @typedef {{key: string, label: string, amount: string, frequency: HousingFrequency, monthlyCents: bigint}} HousingBudgetRow */
/** @typedef {{ok: false, errors: Record<string, string>} | {ok: true, monthlyHousingCents: bigint, remainingCents: bigint, incomeCents: bigint, commitmentsCents: bigint, savingsCents: bigint, housingPercent: string | null, items: HousingBudgetRow[]}} HousingBudgetResult */

export const HOUSING_ITEMS = [
  { key: "rent", label: "Rent" },
  { key: "utilities", label: "Utilities" },
  { key: "parking", label: "Parking" },
  { key: "insurance", label: "Insurance" },
  { key: "other", label: "Other housing costs" },
];

export const HOUSING_FREQUENCIES = /** @type {const} */ (["monthly", "weekly", "fortnightly", "quarterly", "annual"]);

const SCALE = 1_000_000_000_000n;
// All supported monthly conversion fractions share denominator 168.
// Keep that denominator through addition and subtraction: round only output.
/** @type {Record<HousingFrequency, bigint>} */
const MONTHLY_NUMERATORS = { monthly: 168n, weekly: 730n, fortnightly: 365n, quarterly: 56n, annual: 14n };
const MONTHLY_DENOMINATOR = 168n;

/** @param {string} raw @param {string} label @returns {HousingMoneyResult} */
export function parseHousingMoney(raw, label) {
  let value = String(raw ?? "").trim().replace(/^[£$€¥₹₩]\s*/u, "");
  // Extend the existing strict parser for familiar partial decimal entry.
  // A lone dot is not a value. A single dot is explicitly a decimal here,
  // including three decimal places; grouping still uses commas or spaces.
  if (/^\.\d+$/.test(value)) value = `0${value}`;
  if (/^\d+\.$/.test(value)) value += "0";
  if (/^\d+\.\d{3}$/.test(value)) value += "0";
  const parsed = parseIncomeMoney(value, label, { allowZero: true });
  if (!parsed.ok) return parsed;
  const [whole, fraction = ""] = parsed.normalized.split(".");
  const units = BigInt(whole) * SCALE + BigInt(fraction.padEnd(12, "0"));
  if (units > 9_000_000_000_000n * SCALE) {
    return { ok: false, error: `${label} is too large to calculate safely.` };
  }
  return { ...parsed, units };
}

/** @param {bigint} numerator @param {bigint} denominator */
function roundRatio(numerator, denominator) {
  const sign = numerator < 0n ? -1n : 1n;
  const absolute = numerator < 0n ? -numerator : numerator;
  return sign * ((absolute + denominator / 2n) / denominator);
}

/** @param {bigint} numerator */
function toCents(numerator) {
  return roundRatio(numerator * 100n, MONTHLY_DENOMINATOR * SCALE);
}

/**
 * Recurring spending comparison, not a tax calculation or eligibility rule.
 * Input money keeps up to 12 decimal places. Periods are annualized using a
 * 365-day year, then divided by 12, independently for every housing bill.
 * @param {HousingBudgetInput} input
 * @returns {HousingBudgetResult}
 */
export function calculateHousingBudget(input) {
  /** @type {Record<string, string>} */
  const errors = {};
  const income = parseHousingMoney(input.income, "Monthly take-home income");
  const commitments = parseHousingMoney(input.commitments, "Monthly non-housing commitments");
  const savings = parseHousingMoney(input.savings, "Monthly savings target");
  if (!income.ok) errors.income = income.error;
  if (!commitments.ok) errors.commitments = commitments.error;
  if (!savings.ok) errors.savings = savings.error;
  let monthlyNumerator = 0n;
  /** @type {HousingBudgetRow[]} */
  const items = [];
  if (input.items.length < 1 || input.items.length > 20) errors.items = "Enter between 1 and 20 housing costs.";
  for (const item of input.items) {
    const amount = parseHousingMoney(item.amount, item.label);
    if (!amount.ok) {
      errors[item.key] = amount.error;
      continue;
    }
    if (!HOUSING_FREQUENCIES.includes(item.frequency)) {
      errors[item.key] = `Choose a supported billing period for ${item.label.toLowerCase()}.`;
      continue;
    }
    const numerator = amount.units * MONTHLY_NUMERATORS[item.frequency];
    monthlyNumerator += numerator;
    items.push({ ...item, monthlyCents: toCents(numerator) });
  }
  if (!income.ok || !commitments.ok || !savings.ok || Object.keys(errors).length) {
    return { ok: false, errors };
  }
  const remainingNumerator = (income.units - commitments.units - savings.units) * MONTHLY_DENOMINATOR - monthlyNumerator;
  const percentHundredths = income.units === 0n ? null : roundRatio(monthlyNumerator * 10_000n, income.units * MONTHLY_DENOMINATOR);
  return {
    ok: true,
    monthlyHousingCents: toCents(monthlyNumerator),
    remainingCents: toCents(remainingNumerator),
    incomeCents: toCents(income.units * MONTHLY_DENOMINATOR),
    commitmentsCents: toCents(commitments.units * MONTHLY_DENOMINATOR),
    savingsCents: toCents(savings.units * MONTHLY_DENOMINATOR),
    housingPercent: percentHundredths === null ? null : `${percentHundredths / 100n}.${String(percentHundredths % 100n).padStart(2, "0")}`,
    items,
  };
}

/**
 * Reject corrupt or obsolete saved shapes; the UI additionally checks currency
 * against its shared supported-currency list before restoring this state.
 * @param {string | null} raw
 * @returns {HousingBudgetSavedState | null}
 */
export function restoreHousingBudget(raw) {
  if (!raw || raw.length > 10_000) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || typeof value.currency !== "string" ||
      typeof value.income !== "string" || typeof value.commitments !== "string" || typeof value.savings !== "string" ||
      !Array.isArray(value.items) || value.items.length !== HOUSING_ITEMS.length) return null;
    for (let index = 0; index < HOUSING_ITEMS.length; index += 1) {
      const item = value.items[index];
      if (!item || item.key !== HOUSING_ITEMS[index].key || item.label !== HOUSING_ITEMS[index].label ||
        typeof item.amount !== "string" || !HOUSING_FREQUENCIES.includes(item.frequency)) return null;
    }
    return calculateHousingBudget(value).ok ? value : null;
  } catch {
    return null;
  }
}
