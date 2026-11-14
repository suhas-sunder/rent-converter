import { parseHousingMoney } from "./housingBudget.js";
import { parseWholeNumber } from "./calendarDate.js";

export const MOVE_IN_ITEMS = [
  { key: "lastRent", label: "Last month prepaid" },
  { key: "deposit", label: "Refundable deposit or bond" },
  { key: "fees", label: "Optional one-time fees" },
  { key: "utilities", label: "Utility setup costs" },
  { key: "moving", label: "Moving and other setup costs" },
];
/** @typedef {"full" | "partial" | "none"} FirstRentMode */
/** @typedef {{monthlyRent:string,firstRent:FirstRentMode,chargedDays:string,periodDays:string,lastRent:string,deposit:string,fees:string,utilities:string,moving:string}} MoveInInput */
/** @typedef {{key:string,label:string,cents:bigint}} MoveInRow */
/** @typedef {{ok:false,errors:Record<string,string>}|{ok:true,rows:MoveInRow[],totalCents:bigint,recurringRentCents:bigint,firstRentExplanation:string}} MoveInResult */
const SCALE = 1_000_000_000_000n;
/** @param {bigint} units @param {bigint} [numerator] @param {bigint} [denominator] */
function cents(units, numerator = 1n, denominator = 1n) {
  return (units * numerator * 100n + SCALE * denominator / 2n) / (SCALE * denominator);
}

/** One-time cash required; no refund, legal obligation or due date is inferred.
 * @param {MoveInInput} input @returns {MoveInResult}
 */
export function calculateMoveInWorksheet(input) {
  /** @type {Record<string,string>} */
  const errors = {};
  const rent = parseHousingMoney(input.monthlyRent, "Monthly rent");
  if (!rent.ok) errors.monthlyRent = rent.error;
  /** @type {MoveInRow[]} */
  const otherRows = [];
  for (const item of MOVE_IN_ITEMS) {
    const parsed = parseHousingMoney(input[/** @type {keyof MoveInInput} */(item.key)], item.label);
    if (!parsed.ok) errors[item.key] = parsed.error;
    else otherRows.push({ ...item, cents: cents(parsed.units) });
  }
  if (!["full", "partial", "none"].includes(input.firstRent)) errors.firstRent = "Choose how to include the first rent payment.";
  let numerator = 1n, denominator = 1n;
  let firstRentExplanation = input.firstRent === "none" ? "First rent excluded from this worksheet." : "One full monthly rent included.";
  if (input.firstRent === "partial") {
    const charged = parseWholeNumber(input.chargedDays, "Days charged", 1, 31);
    const period = parseWholeNumber(input.periodDays, "Days in the rent month", 28, 31);
    if (!charged.ok) errors.chargedDays = charged.error;
    if (!period.ok) errors.periodDays = period.error;
    if (charged.ok && period.ok) {
      if (charged.value > period.value) errors.chargedDays = "Days charged cannot exceed the days in the rent month.";
      numerator = BigInt(charged.value); denominator = BigInt(period.value);
      firstRentExplanation = `Monthly rent × ${charged.value} days charged ÷ ${period.value} days in the rent month. The partial payment replaces the full first month.`;
    }
  }
  if (!rent.ok || Object.keys(errors).length) return { ok: false, errors };
  const firstCents = input.firstRent === "none" ? 0n : cents(rent.units, numerator, denominator);
  const rows = [{ key: "firstRent", label: input.firstRent === "partial" ? "First rent — partial month" : "First rent payment", cents: firstCents }, ...otherRows];
  return { ok: true, rows, totalCents: rows.reduce((sum, row) => sum + row.cents, 0n), recurringRentCents: cents(rent.units), firstRentExplanation };
}

/** @param {Extract<MoveInResult,{ok:true}>} result @param {string} currency */
export function moveInWorksheetCsv(result, currency) {
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Choose a currency code.");
  /** @param {bigint} amount */
  const amount = (amount) => `${amount / 100n}.${String(amount % 100n).padStart(2, "0")}`;
  const rows = [["Category", "Currency", "Amount", "Basis"], ...result.rows.map(row => [row.label, currency, amount(row.cents), "One-time worksheet item"]), ["Total one-time cash", currency, amount(result.totalCents), "Sum of itemized rows"], ["Recurring monthly rent (separate)", currency, amount(result.recurringRentCents), "Excluded from one-time total except first/last rent entered"], ["First rent method", "", "", result.firstRentExplanation]];
  return rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n") + "\r\n";
}
