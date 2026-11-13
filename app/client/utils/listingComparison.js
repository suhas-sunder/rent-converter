import { isCurrency, parseMoneyToCents } from "./rentMath";

/** @typedef {"weekly" | "fortnightly" | "four_weekly" | "monthly" | "annual"} ListingFrequency */
/** @typedef {{ id: string, name: string, rent: string, frequency: ListingFrequency, extras: string }} ListingDraft */
/** @typedef {{ n: bigint, d: bigint }} Ratio */
/** @typedef {{ id: string, name: string, rent: string, frequency: ListingFrequency, extras: string, monthlyRentCents: bigint, monthlyExtrasCents: bigint, monthlyCents: bigint, annualCents: bigint, monthlyDifferenceCents: bigint, annualDifferenceCents: bigint }} ListingResult */
/** @typedef {{ ok: true, rows: ListingResult[], cheapestIds: string[] } | { ok: false, errors: string[] }} ComparisonResult */

export const LISTING_STORAGE_KEY = "rc_listing_comparison_v1";
export const LISTING_FREQUENCIES = /** @type {const} */ (["weekly", "fortnightly", "four_weekly", "monthly", "annual"]);
export const LISTING_FREQUENCY_LABELS = { weekly: "Weekly", fortnightly: "Every 2 weeks", four_weekly: "Every 4 weeks (28 days)", monthly: "Monthly", annual: "Annual" };
const SCALE = 1_000_000n;

/** Choose a small free identifier without interpreting untrusted saved suffixes.
 * @param {ListingDraft[]} listings */
export function nextListingId(listings) {
  let number = 1;
  while (listings.some((listing) => listing.id === `listing-${number}`)) number += 1;
  return `listing-${number}`;
}

/** @param {string} raw @param {string} label
 * @returns {{ ok: true, units: bigint, normalized: string } | { ok: false, error: string }} */
export function parseListingMoney(raw, label) {
  if (typeof raw !== "string" || raw.length > 64) return { ok: false, error: `${label} is too large.` };
  const parsed = parseMoneyToCents(raw, `Enter ${label.toLowerCase()}.`);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  const [whole, fraction = ""] = parsed.normalized.split(".");
  if (fraction.length > 6) return { ok: false, error: `${label} supports up to six decimal places.` };
  const units = BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, "0"));
  if (units > 1_000_000_000n * SCALE) return { ok: false, error: `${label} must be no more than 1,000,000,000.` };
  return { ok: true, units, normalized: parsed.normalized };
}

/** @param {bigint} units @param {ListingFrequency} frequency @returns {Ratio} */
function annualRent(units, frequency) {
  if (frequency === "monthly") return { n: units * 12n, d: SCALE };
  if (frequency === "annual") return { n: units, d: SCALE };
  const days = frequency === "weekly" ? 7n : frequency === "fortnightly" ? 14n : 28n;
  return { n: units * 365n, d: SCALE * days };
}

/** @param {Ratio} ratio */
function cents(ratio) { return (ratio.n * 100n + ratio.d / 2n) / ratio.d; }

/** @param {ListingDraft[]} listings @returns {ComparisonResult} */
export function compareListings(listings) {
  if (listings.length < 2 || listings.length > 3) return { ok: false, errors: ["Add two or three listings to compare."] };
  /** @type {string[]} */
  const errors = [];
  const seenNames = new Set();
  const values = listings.map((listing, index) => {
    const name = listing.name.trim();
    const caption = name || `Listing ${index + 1}`;
    if (!name || name.length > 60 || /[\r\n\t]/u.test(name)) errors.push(`Listing ${index + 1}: enter a name of 1–60 characters.`);
    if (seenNames.has(name.toLowerCase())) errors.push(`${caption}: use a different name for each listing.`);
    seenNames.add(name.toLowerCase());
    const rent = parseListingMoney(listing.rent, "Rent");
    const extras = parseListingMoney(listing.extras, "Monthly extras");
    if (!rent.ok) errors.push(`${caption} rent: ${rent.error}`);
    if (!extras.ok) errors.push(`${caption} extras: ${extras.error}`);
    if (!LISTING_FREQUENCIES.includes(listing.frequency)) errors.push(`${caption}: choose a supported rent period.`);
    if (!rent.ok || !extras.ok) return null;
    const annual = annualRent(rent.units, listing.frequency);
    const total = { n: annual.n * SCALE + extras.units * 12n * annual.d, d: annual.d * SCALE };
    return { listing, name, annual, total, extras: extras.units };
  });
  if (errors.length) return { ok: false, errors };
  const valid = values.filter((value) => value !== null);
  const cheapest = valid.reduce((best, value) => value.total.n * best.total.d < best.total.n * value.total.d ? value : best);
  const cheapestMonthly = cents({ n: cheapest.total.n, d: cheapest.total.d * 12n });
  const cheapestAnnual = cents(cheapest.total);
  return {
    ok: true,
    cheapestIds: valid.filter((v) => v.total.n * cheapest.total.d === cheapest.total.n * v.total.d).map((v) => v.listing.id),
    rows: valid.map((v) => {
      const monthlyCents = cents({ n: v.total.n, d: v.total.d * 12n });
      const annualCents = cents(v.total);
      return { ...v.listing, name: v.name, monthlyRentCents: cents({ n: v.annual.n, d: v.annual.d * 12n }), monthlyExtrasCents: cents({ n: v.extras, d: SCALE }), monthlyCents, annualCents, monthlyDifferenceCents: monthlyCents - cheapestMonthly, annualDifferenceCents: annualCents - cheapestAnnual };
    }),
  };
}

/** @param {unknown} value @returns {value is ListingDraft} */
function isSavedListing(value) {
  if (!value || typeof value !== "object") return false;
  const v = /** @type {Record<string, unknown>} */ (value);
  return typeof v.id === "string" && /^[a-zA-Z0-9-]{1,40}$/u.test(v.id)
    && typeof v.name === "string" && v.name.trim().length > 0 && v.name.length <= 60 && !/[\r\n\t]/u.test(v.name)
    && typeof v.frequency === "string" && LISTING_FREQUENCIES.some((frequency) => frequency === v.frequency)
    && typeof v.rent === "string" && parseListingMoney(v.rent, "Rent").ok
    && typeof v.extras === "string" && parseListingMoney(v.extras, "Monthly extras").ok;
}

/** @param {string | null} raw
 * @returns {{ version: 1, currency: import("./rentMath").Currency, listings: ListingDraft[] } | null} */
export function parseSavedListings(raw) {
  if (!raw || raw.length > 10_000) return null;
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || typeof saved.currency !== "string" || !isCurrency(saved.currency) || !Array.isArray(saved.listings) || saved.listings.length < 1 || saved.listings.length > 3 || !saved.listings.every(isSavedListing)) return null;
    if (new Set(saved.listings.map((/** @type {ListingDraft} */ v) => v.id)).size !== saved.listings.length) return null;
    if (new Set(saved.listings.map((/** @type {ListingDraft} */ v) => v.name.trim().toLowerCase())).size !== saved.listings.length) return null;
    return { version: 1, currency: saved.currency, listings: saved.listings.map((/** @type {ListingDraft} */ v) => ({ id: v.id, name: v.name, rent: v.rent, frequency: v.frequency, extras: v.extras })) };
  } catch { return null; }
}

/** @param {ListingDraft[]} listings @param {string} currency */
export function serializeListings(listings, currency) {
  const raw = JSON.stringify({ version: 1, currency, listings });
  if (!parseSavedListings(raw)) throw new Error("Check the listing names, amounts and currency before saving.");
  return raw;
}

/** @param {bigint} value */
function decimalCents(value) { return `${value / 100n}.${(value % 100n).toString().padStart(2, "0")}`; }

/** @param {unknown} value */
function csvCell(value) {
  let text = String(value);
  if (/^[=+@\-\t\r\n]/u.test(text.trimStart())) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** @param {ComparisonResult} result @param {string} currency */
export function listingComparisonCsv(result, currency) {
  if (!result.ok || !isCurrency(currency)) return "";
  const rows = [
    ["Listing", "Currency", "Entered rent", "Rent period", "Entered monthly extras", "Monthly total", "Annual total", "Monthly difference from lowest", "Annual difference from lowest"],
    ...result.rows.map((row) => [row.name, currency, row.rent, LISTING_FREQUENCY_LABELS[row.frequency], row.extras, decimalCents(row.monthlyCents), decimalCents(row.annualCents), decimalCents(row.monthlyDifferenceCents), decimalCents(row.annualDifferenceCents)]),
    ["Assumptions", "365-day daily-rate equivalents; 12 calendar months; extras recur monthly; no currency exchange; deposits and one-off costs excluded unless manually annualized. Differences use displayed rounded totals."],
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
