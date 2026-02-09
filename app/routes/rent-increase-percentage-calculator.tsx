import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-percentage-calculator";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Increase Percentage Calculator (Old vs New Rent)";
  const description =
    "Instantly calculate the percentage increase between your old rent and new rent. See the annual impact and per-period equivalents, including monthly vs 4-week (28-day) comparisons. Clear math, exact decimals. Free and private.";

  const canonicalUrl =
    "https://www.rentconverter.com/rent-increase-percentage-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent increase percentage, rent increase percent calculator, percentage increase in rent, calculate rent raise percentage, old rent vs new rent percent increase",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },
  ];
};

type Period =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

const SUPPORTED_CURRENCIES = [
  "USD",
  "CAD",
  "EUR",
  "GBP",
  "AUD",
  "NZD",
  "JPY",
  "CNY",
  "HKD",
  "SGD",
  "INR",
  "KRW",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "MXN",
  "BRL",
] as const;

type Currency = (typeof SUPPORTED_CURRENCIES)[number];

function isCurrency(x: string): x is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(x);
}
function isPeriod(x: string): x is Period {
  return (
    x === "hourly" ||
    x === "daily" ||
    x === "weekly" ||
    x === "biweekly" ||
    x === "every_4_weeks" ||
    x === "monthly" ||
    x === "annual"
  );
}

/**
 * Only include routes you are sure exist.
 * If you do not have a whitelist, remove safeHref and use plain hrefs.
 */
const ROUTE_WHITELIST = new Set<string>([
  // Home
  "/",

  // Rent converter hub
  "/rent-converter",

  // Frequency converters
  "/monthly-to-weekly-rent-converter",
  "/weekly-to-monthly-rent-converter",
  "/weekly-to-annual-rent-converter",
  "/weekly-to-biweekly-rent-converter",

  "/biweekly-to-weekly-rent-converter",
  "/biweekly-to-monthly-rent-converter",
  "/biweekly-to-annual-rent-converter",

  "/monthly-to-annual-rent-converter",
  "/annual-to-monthly-rent-converter",

  "/monthly-to-daily-rent-converter",
  "/daily-to-monthly-rent-converter",

  "/monthly-to-hourly-rent-converter",
  "/hourly-to-monthly-rent-converter",

  "/hourly-to-annual-rent-converter",
  "/annual-to-hourly-rent-converter",

  "/annual-to-weekly-rent-converter",
  "/annual-to-biweekly-rent-converter",
  "/monthly-to-biweekly-rent-converter",

  // Rent calculators
  "/rent-calculator",
  "/rent-per-day-calculator",
  "/rent-per-week-calculator",
  "/rent-paid-every-4-weeks-calculator",
  "/rent-per-paycheck-calculator",
  "/rent-split-calculator",
  "/rent-due-date-calculator",

  // Affordability and income
  "/rent-as-percentage-of-income-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",

  // Rent increases
  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

/** Fixed-point decimals preserved end-to-end (up to 12 decimals). */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
  normalized?: string;
  warnings: string[];
  error?: string;
};

function clampScaled(v: bigint, min: bigint, max: bigint): bigint {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n; // ~9e15, JS Number integer precision limit

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
}

function toNumberSafe(scaled: bigint): number {
  const a = absBigInt(scaled);
  if (a > MAX_SAFE_INT_FOR_NUMBER) return Number.NaN;
  return Number(scaled) / Number(SCALE);
}

function groupInt(intStr: string, groupSep: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
}

function getNumberSeparators(): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(undefined, {
    useGrouping: true,
  }).formatToParts(1000.1);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  return { group, decimal };
}

function roundScaledToDecimals(scaled: bigint, decimals: number): bigint {
  const d = Math.max(0, Math.min(12, decimals));
  if (d === 12) return scaled;
  const factor = 10n ** BigInt(12 - d);
  const sign = scaled < 0n ? -1n : 1n;
  const a = absBigInt(scaled);
  const q = a / factor;
  const r = a % factor;
  const half = factor / 2n;
  const qRounded = r >= half ? q + 1n : q;
  return sign * qRounded * factor;
}

function scaledToDecimalStrings(
  scaled: bigint,
  decimals: number,
  trimTrailingZeros: boolean,
): { negative: boolean; intStr: string; fracStr: string } {
  const d = Math.max(0, Math.min(12, decimals));
  const negative = scaled < 0n;
  const a = absBigInt(scaled);
  const intPart = a / SCALE;
  const fracPart = a % SCALE;

  let fracStr = "";
  if (d > 0) {
    fracStr = fracPart.toString().padStart(12, "0").slice(0, d);
    if (trimTrailingZeros) {
      fracStr = fracStr.replace(/0+$/g, "");
    }
  }
  return { negative, intStr: intPart.toString(), fracStr };
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  let digits = 12;

  if (roundDisplay) {
    digits = Math.max(0, Math.min(12, displayDecimals));
  } else {
    // Show up to 12 decimals but trim trailing zeros for display.
    const a = absBigInt(scaled);
    const fracPart = a % SCALE;
    if (fracPart === 0n) {
      digits = 0;
    } else {
      const fracFull = fracPart.toString().padStart(12, "0");
      const trimmed = fracFull.replace(/0+$/g, "");
      digits = Math.min(12, Math.max(0, trimmed.length));
    }
  }

  const scaledForDisplay = roundDisplay
    ? roundScaledToDecimals(scaled, digits)
    : scaled;

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    !roundDisplay, // trim only when not rounding to fixed digits
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  // Build by parts so we keep locale currency placement and symbols without using floats for the value.
  const parts = fmt.formatToParts(-1);
  let out = "";
  for (const p of parts) {
    if (p.type === "minusSign") {
      if (negative) out += p.value;
      continue;
    }
    if (p.type === "integer") {
      out += groupedInt;
      continue;
    }
    if (p.type === "group") {
      // We already grouped ourselves.
      continue;
    }
    if (p.type === "decimal") {
      if (digits > 0 && fracStr.length > 0) out += decimal;
      continue;
    }
    if (p.type === "fraction") {
      if (digits > 0 && fracStr.length > 0) out += fracStr;
      continue;
    }
    out += p.value;
  }

  return out || "-";
}

function groupIntEnUS(intStr: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPreviewFromParsed(parsed: ParsedScaled): string {
  if (!parsed.ok || parsed.scaled === undefined) return "";
  const scaled = parsed.scaled;

  let decimals = 0;
  if (parsed.normalized && parsed.normalized.includes(".")) {
    const parts = parsed.normalized.split(".");
    const frac = parts[1] ?? "";
    decimals = clampNum(frac.length, 0, Number(MAX_DECIMALS));
  }

  const intPart = scaled / SCALE;
  const fracPart = scaled % SCALE;

  const intStr = groupIntEnUS(intPart.toString());

  if (decimals <= 0) return intStr;

  const fracFull = fracPart
    .toString()
    .padStart(Number(MAX_DECIMALS), "0")
    .slice(0, decimals);

  return `${intStr}.${fracFull}`;
}

/**
 * Accepts: $2,000, 2000.00, .5, 12., 2000,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3" etc.
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 2000 or 2000.00).",
      warnings,
    };
  }

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: "Enter a valid number (misplaced minus sign).",
        warnings,
      };
    }
    return { ok: false, error: "Amount must be 0 or greater.", warnings };
  }

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let decimalSep: "." | "," | null = null;

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSep = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1) {
    decimalSep = ".";
  } else if (lastComma !== -1) {
    const parts = s.split(",");
    if (parts.length === 2) {
      const before = parts[0] ?? "";
      const after = parts[1] ?? "";
      if (/^\d{1,2}$/.test(after)) {
        decimalSep = ",";
      } else if (/^\d{3}$/.test(after) && /^\d{1,3}$/.test(before)) {
        decimalSep = null;
        warnings.push(
          `Interpreted "${s0}" as thousands grouping. If you meant a decimal, use a dot like "1234.56".`,
        );
      } else {
        return {
          ok: false,
          error:
            'That format is ambiguous. Try "1234.56" or "1,234.56" or "1234,56".',
          warnings,
        };
      }
    } else {
      decimalSep = null;
    }
  }

  let intPart = s;
  let fracPart = "";

  if (decimalSep) {
    const split = s.split(decimalSep);
    if (split.length > 2) {
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    }
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
    // Important: allow trailing separators like "12." or "12," (treat as 12)
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxVal = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxVal);
  if (clamped !== scaled)
    warnings.push("Value was clamped to the supported maximum.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function annualizeFromScaled(valueScaled: bigint, period: Period): bigint {
  if (period === "hourly") return valueScaled * 24n * 365n;
  if (period === "daily") return valueScaled * 365n;
  if (period === "weekly") return valueScaled * 52n;
  if (period === "biweekly") return valueScaled * 26n;
  if (period === "every_4_weeks") return valueScaled * 13n;
  if (period === "monthly") return valueScaled * 12n;
  return valueScaled;
}

function mulDivRound(a: bigint, num: bigint, den: bigint): bigint {
  if (den === 0n) return 0n;
  const sign =
    (a < 0n ? -1n : 1n) * (num < 0n ? -1n : 1n) * (den < 0n ? -1n : 1n);
  const aa = a < 0n ? -a : a;
  const nn = num < 0n ? -num : num;
  const dd = den < 0n ? -den : den;

  const prod = aa * nn;
  const half = dd / 2n;
  const q = (prod + half) / dd;
  return sign < 0n ? -q : q;
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
}

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
}

function safeParseDisplayDecimals(
  raw: string | null,
  fallback: number,
): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
}

export default function RentIncreasePercentage() {
  const pageName = "Rent Increase Percentage Calculator";
  const canonicalUrl =
    "https://www.rentconverter.com/rent-increase-percentage-calculator";

  const [oldRent, setOldRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rc_rip_old") ?? "2000";
  });

  const [newRent, setNewRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2100";
    return localStorage.getItem("rc_rip_new") ?? "2100";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rip_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rip_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rip_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_rip_display_decimals"),
      2,
    );
  });

  const [oldFocused, setOldFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);

  const oldParsed = useMemo(() => parseMoneyInputToScaled(oldRent), [oldRent]);
  const newParsed = useMemo(() => parseMoneyInputToScaled(newRent), [newRent]);

  const [oldDisplay, setOldDisplay] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const initial = localStorage.getItem("rc_rip_old") ?? "2000";
    const p = parseMoneyInputToScaled(initial);
    return p.ok ? formatPreviewFromParsed(p) : initial;
  });

  const [newDisplay, setNewDisplay] = useState<string>(() => {
    if (typeof window === "undefined") return "2100";
    const initial = localStorage.getItem("rc_rip_new") ?? "2100";
    const p = parseMoneyInputToScaled(initial);
    return p.ok ? formatPreviewFromParsed(p) : initial;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rip_old", oldRent);
      localStorage.setItem("rc_rip_new", newRent);
      localStorage.setItem("rc_rip_period", period);
      localStorage.setItem("rc_rip_currency", currency);
      localStorage.setItem(
        "rc_rip_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rip_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [oldRent, newRent, period, currency, roundDisplay, displayDecimals]);

  useEffect(() => {
    if (oldFocused) return;
    setOldDisplay(oldParsed.ok ? formatPreviewFromParsed(oldParsed) : oldRent);
  }, [
    oldRent,
    oldParsed.ok,
    oldParsed.scaled,
    oldParsed.normalized,
    oldFocused,
  ]);

  useEffect(() => {
    if (newFocused) return;
    setNewDisplay(newParsed.ok ? formatPreviewFromParsed(newParsed) : newRent);
  }, [
    newRent,
    newParsed.ok,
    newParsed.scaled,
    newParsed.normalized,
    newFocused,
  ]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!oldParsed.ok)
      errors.push(oldParsed.error ?? "Enter a valid old rent.");
    if (!newParsed.ok)
      errors.push(newParsed.error ?? "Enter a valid new rent.");

    if (oldParsed.warnings.length) warnings.push(...oldParsed.warnings);
    if (newParsed.warnings.length) warnings.push(...newParsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const oldScaled = oldParsed.scaled as bigint;
    const newScaled = newParsed.scaled as bigint;

    const annualOldScaled = annualizeFromScaled(oldScaled, period);
    const annualNewScaled = annualizeFromScaled(newScaled, period);
    const annualDeltaScaled = annualNewScaled - annualOldScaled;

    const annualOld = toNumberSafe(annualOldScaled);
    const annualNew = toNumberSafe(annualNewScaled);
    const annualDelta = toNumberSafe(annualDeltaScaled);

    let pct: number | null = null;
    let pctNote: string | null = null;

    if (annualOld > 0) {
      pct = (annualDelta / annualOld) * 100;
    } else if (annualNew > 0) {
      pct = null;
      pctNote =
        "Percent increase is not meaningful when the starting rent is 0.";
    } else {
      pct = 0;
    }

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => {
      const oldValScaled = fromAnnualScaled(annualOldScaled, p);
      const newValScaled = fromAnnualScaled(annualNewScaled, p);
      const deltaScaled = newValScaled - oldValScaled;
      return { p, oldValScaled, newValScaled, deltaScaled };
    });

    const avgMonthDays = 365 / 12;

    const oldMonthlyAvgScaled = fromAnnualScaled(annualOldScaled, "monthly");
    const old4wScaled = fromAnnualScaled(annualOldScaled, "every_4_weeks");
    const newMonthlyAvgScaled = fromAnnualScaled(annualNewScaled, "monthly");
    const new4wScaled = fromAnnualScaled(annualNewScaled, "every_4_weeks");

    const oldMonthMinus4wScaled = oldMonthlyAvgScaled - old4wScaled;
    const newMonthMinus4wScaled = newMonthlyAvgScaled - new4wScaled;

    const deltaPerSelectedPeriodScaled = newScaled - oldScaled;

    return {
      ok: true as const,
      warnings,

      annualOldScaled,
      annualNewScaled,
      annualDeltaScaled,

      pct,
      pctNote,

      breakdown,
      avgMonthDays,

      oldMonthlyAvgScaled,
      old4wScaled,
      newMonthlyAvgScaled,
      new4wScaled,
      oldMonthMinus4wScaled,
      newMonthMinus4wScaled,

      deltaPerSelectedPeriodScaled,
    };
  }, [oldParsed, newParsed, period]);

  const faqData = [
    {
      q: "What does “rent increase percentage” mean on this page?",
      a: "It is the percent change between the old rent and the new rent, calculated using annual totals so the result stays consistent across pay cycles.",
    },
    {
      q: "Why does this calculator use annual equivalence instead of a simple percent formula?",
      a: "If both values are entered in the same period, the percent change matches a simple formula. Annualizing is used so the page can also show comparable equivalents across monthly, weekly, and 4-week cycles without mixing assumptions.",
    },
    {
      q: "What if the old rent is zero or blank?",
      a: "A percent increase is not meaningful when the starting value is zero. In that case the page still shows the absolute differences and annual totals.",
    },
    {
      q: "Why are “monthly” and “every 4 weeks” shown separately?",
      a: "A 4-week period is always 28 days. An average month is about 30.42 days (365 ÷ 12). The page shows both so the difference is visible when comparing payment schedules.",
    },
    {
      q: "Does the output include fees, utilities, or taxes?",
      a: "No. It compares rent amounts only. If one option includes bundled costs, treat the result as a baseline comparison.",
    },
    {
      q: "Does this reflect proration or mid-month effective dates?",
      a: "No. The calculation is a full-period comparison. Proration rules and effective dates can change the first payment after a change.",
    },
    {
      q: "What time assumptions are used for conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
    },
  ];
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Instantly calculate the percentage increase between your old rent and new rent. See the annual impact and per-period equivalents, including monthly vs 4-week (28-day) comparisons.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl,
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const oldHelpId = "rc-rip-old-help";
  const oldErrorId = "rc-rip-old-error";
  const newHelpId = "rc-rip-new-help";
  const newErrorId = "rc-rip-new-error";

  return (
    <main className="bg-white text-slate-700 scroll-smooth text-[15px] sm:text-lg leading-relaxed">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .rc-no-print { display: none !important; }
              .rc-print-block { break-inside: avoid; }
              main { background: #fff !important; }
              a { text-decoration: none !important; color: #000 !important; }
            }
          `,
        }}
      />

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Calculate the percentage increase in rent
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-old"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Old rent
              </label>
              <input
                id="rc-rip-old"
                inputMode="decimal"
                value={oldFocused ? oldRent : oldDisplay}
                onChange={(e) => setOldRent(e.target.value)}
                onFocus={() => {
                  setOldFocused(true);
                  setOldDisplay(oldRent);
                }}
                onBlur={() => {
                  setOldFocused(false);
                  setOldDisplay(
                    oldParsed.ok ? formatPreviewFromParsed(oldParsed) : oldRent,
                  );
                }}
                placeholder="e.g. 2000 or 2000.00"
                className={`cursor-pointer w-full rounded-xl border px-4 py-2.5 text-lg outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  oldParsed.ok
                    ? "border-slate-300 focus:border-sky-600"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!oldParsed.ok}
                aria-describedby={
                  oldParsed.ok ? oldHelpId : `${oldHelpId} ${oldErrorId}`
                }
              />

              {!oldParsed.ok ? (
                <p
                  id={oldErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {oldParsed.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-new"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                New rent
              </label>
              <input
                id="rc-rip-new"
                inputMode="decimal"
                value={newFocused ? newRent : newDisplay}
                onChange={(e) => setNewRent(e.target.value)}
                onFocus={() => {
                  setNewFocused(true);
                  setNewDisplay(newRent);
                }}
                onBlur={() => {
                  setNewFocused(false);
                  setNewDisplay(
                    newParsed.ok ? formatPreviewFromParsed(newParsed) : newRent,
                  );
                }}
                placeholder="e.g. 2100 or 2100.00"
                className={`cursor-pointer w-full rounded-xl border px-4 py-2.5 text-lg outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  newParsed.ok
                    ? "border-slate-300 focus:border-sky-600"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!newParsed.ok}
                aria-describedby={
                  newParsed.ok ? newHelpId : `${newHelpId} ${newErrorId}`
                }
              />
              {!newParsed.ok ? (
                <p
                  id={newErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {newParsed.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-period"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Billing period (Applies to both amounts)
              </label>
              <select
                id="rc-rip-period"
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                aria-label="Billing period"
              >
                {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-currency"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Currency
              </label>
              <select
                id="rc-rip-currency"
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value) ? e.target.value : "USD",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 border-l-4 border-l-sky-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
          >
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-900">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Fix the inputs to calculate the percent change.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">Notes</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {computed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Rent increase percentage
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums ">
                    {computed.pct === null
                      ? "N/A"
                      : `${safeToFixed(computed.pct, 2)}%`}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 border-t-2 border-t-sky-100 bg-white px-4 py-2.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Change per selected period
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                      {fmtMoney(computed.deltaPerSelectedPeriodScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 border-t-2 border-t-sky-100 bg-white px-4 py-2.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Annual rent (old, annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                      {fmtMoney(computed.annualOldScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 border-t-2 border-t-sky-100 bg-white px-4 py-2.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Annual rent (new, annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                      {fmtMoney(computed.annualNewScaled)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                    <div className=" grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-800">
                        Annual difference:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(computed.annualDeltaScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800">
                        Monthly (avg) difference:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(
                            computed.newMonthlyAvgScaled -
                              computed.oldMonthlyAvgScaled,
                          )}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800">
                        Weekly difference:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(
                            fromAnnualScaled(
                              computed.annualNewScaled,
                              "weekly",
                            ) -
                              fromAnnualScaled(
                                computed.annualOldScaled,
                                "weekly",
                              ),
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Monthly vs every 4 weeks (old and new)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-800">
                        Old (monthly avg):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(computed.oldMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800">
                        Old (4 weeks):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(computed.old4wScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800">
                        New (monthly avg):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(computed.newMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800">
                        New (4 weeks):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmtMoney(computed.new4wScaled)}
                        </strong>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-600">
                      A 4-week period is 28 days. An average month is{" "}
                      <span className="tabular-nums">
                        {safeToFixed(computed.avgMonthDays, 2)}
                      </span>{" "}
                      days (365 ÷ 12). The difference here is shown explicitly:
                      old{" "}
                      <span className="tabular-nums">
                        {fmtMoney(computed.oldMonthMinus4wScaled)}
                      </span>
                      , new{" "}
                      <span className="tabular-nums">
                        {fmtMoney(computed.newMonthMinus4wScaled)}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Full breakdown across periods (annual-equivalent)
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    This table converts both rents into annual totals first,
                    then expresses those totals across common cycles. Useful
                    when you track budgets in different periods.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-600 border-b border-slate-200">
                          <th className="py-2.5 pr-4 font-semibold">Period</th>
                          <th className="py-2.5 pr-4 font-semibold">Old</th>
                          <th className="py-2.5 pr-4 font-semibold">New</th>
                          <th className="py-2.5 pr-4 font-semibold">
                            Difference
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.breakdown.map((row, idx) => (
                          <tr
                            key={row.p}
                            className={`border-b border-slate-100 ${
                              idx % 2 === 1 ? "bg-slate-50/40" : ""
                            }`}
                          >
                            <td className="py-2.5 pr-4 font-semibold text-slate-900">
                              {PERIOD_LABEL[row.p]}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-900 tabular-nums whitespace-nowrap text-right">
                              {fmtMoney(row.oldValScaled)}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-900 tabular-nums whitespace-nowrap text-right">
                              {fmtMoney(row.newValScaled)}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-900 tabular-nums whitespace-nowrap text-right">
                              {fmtMoney(row.deltaScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
                    <div className="font-semibold">Notes</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {computed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <div className="font-semibold">Assumptions used on this page</div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>Biweekly = 14 days</li>
              <li>4-week rent = 28 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” (fees,
                utilities, taxes). Enter the total you want to budget with.
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-12 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="cursor-pointer h-4 w-4 rounded border-slate-300 text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">
                  Displayed decimals
                </span>
                <select
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(
                      safeParseDisplayDecimals(e.target.value, 2),
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Calculations preserve decimals internally (up to 12). Only the
              displayed values are rounded.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
              How the rent increase percentage calculator works
            </h2>

            <p className="text-slate-600 leading-7">
              This page computes the percentage change between an old rent
              amount and a new rent amount. You enter both values in the same
              billing period, then the calculator converts each rent into a
              consistent annual total (using explicit time assumptions) and
              computes the percent change from those annual totals. The output
              includes the percentage, the difference in the selected period, an
              annual difference figure, and a cross-period breakdown so the
              result stays coherent when you view weekly, 28-day, and monthly
              equivalents.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Old rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  New rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  PERIOD
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  One period applies
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Percent + impact
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Card 1 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    1) Old and new rents use the same billing period
                  </h3>

                  <p className="mt-4">
                    The period dropdown applies to both numbers. That means
                    “old” and “new” must represent the same type of amount: both
                    monthly, both weekly, both every 4 weeks, and so on. This
                    prevents a hidden mismatch where the two inputs are
                    different time lengths before the percent change is even
                    computed.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Input scope
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Old rent and new rent are treated as amounts per the
                        selected period.
                      </li>
                      <li>
                        The calculator does not infer add-ons such as utilities,
                        fees, taxes, or deposits.
                      </li>
                      <li>
                        If you want those included, they need to be included in
                        the numbers you enter.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    2) Both rents are normalized to annual totals
                  </h3>

                  <p className="mt-4">
                    To keep the percent change stable across the breakdown, the
                    calculator converts both old and new rents into annual
                    totals using a single set of time assumptions. The
                    annualization step is the shared reference that keeps
                    weekly, monthly, and 28-day views aligned rather than mixing
                    definitions.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Time assumptions
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours per day</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      These assumptions are used for equivalence math and
                      breakdown consistency. Payment-count illustrations, if
                      shown, are separate from the equivalence basis.
                    </p>
                  </div>

                  <p className="mt-4">
                    This annual basis is also what makes “weekly and 4-week
                    equivalents” comparable on the same page. Weekly is always a
                    7-day equivalent. Every 4 weeks is always a 28-day
                    equivalent. Monthly is an average month length. The
                    calculator keeps those definitions explicit rather than
                    using shortcuts like treating 28 days as “a month.”
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    3) Percent change is computed from annual totals
                  </h3>

                  <p className="mt-4">
                    The percentage result is computed from the annual totals
                    derived from your two inputs. This keeps the percentage
                    consistent with the annual impact and with any derived
                    period views shown in the breakdown.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Percent change formula
                    </div>
                    <p className="mt-2 text-slate-700">
                      <strong>Percent increase</strong> = ((annual new − annual
                      old) ÷ annual old) × 100
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      If the old rent annualizes to 0, the percent change is
                      undefined and results should be suppressed.
                    </p>
                  </div>

                  <p className="mt-4">
                    The “change per selected period” output is then derived from
                    the same basis so the percent result, the per-period change,
                    and the annual difference reconcile cleanly.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    4) Outputs: percentage, period difference, annual impact,
                    and breakdown
                  </h3>

                  <p className="mt-4">
                    The page provides multiple outputs so the percentage is not
                    isolated from practical comparisons. The percentage
                    describes the relative change. The per-period difference
                    shows the raw change in the period you selected. The annual
                    difference shows the implied year-over-year delta under the
                    page’s time assumptions. The breakdown then expresses old
                    and new across common periods derived from the same annual
                    basis.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What you can expect to see
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Rent increase percentage based on annualized values
                      </li>
                      <li>
                        Change in the selected period (old vs new for that
                        period)
                      </li>
                      <li>Annual difference derived from the annual totals</li>
                      <li>
                        A breakdown across common cycles derived from the same
                        assumptions
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    None of these outputs apply proration rules, partial-month
                    handling, or mid-cycle effective dates. The tool treats the
                    two rents as steady-state values for comparison and
                    documentation.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    5) Decimals and rounding
                  </h3>

                  <p className="mt-4">
                    Decimals are preserved end-to-end. Internally, calculations
                    keep precision (up to 12 decimals). If rounding is enabled,
                    it is applied only to what’s displayed. This prevents
                    rounding preferences from changing the computed percent or
                    the annual difference.
                  </p>

                  <p className="mt-4">
                    Inputs support commas and currency symbols. Formats like{" "}
                    <strong>.5</strong> and <strong>12.</strong> are treated as
                    valid decimals. If a value is ambiguous, the page should
                    avoid producing a “close enough” output.
                  </p>
                </div>
              </div>

              {/* Dark callout */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
                </div>

                <div className="relative">
                  <div className="text-sm font-semibold text-sky-300">
                    Scope note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                    What this calculator does and does not do
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This tool computes a percentage change and related
                    equivalence outputs from two rent amounts under explicit
                    time assumptions. It does not include fees, utilities,
                    deposits, taxes, proration, or effective-date logic. It is a
                    numeric comparison tool for old vs new rent values expressed
                    on the same period.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related pages:{" "}
                <a
                  href={safeHref("/rent-increase-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent increase calculator
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent converter
                </a>
                , and{" "}
                <a
                  href={safeHref("/how-much-rent-can-i-afford-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent affordability calculator
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>
      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}
