import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-percentage-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-increase-percentage-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-increase-percentage-calculator/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Increase Percentage Calculator | Before and After Rent";
  const description =
    "Calculate the percentage increase between old rent and new rent. See the rent change, annual impact, and common billing-period breakdowns.";

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
        "rent increase percentage, rent increase percent calculator, calculate rent raise percentage, old rent vs new rent percent increase, rent increase rate",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

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
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
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
): string {
  const digits = 2;
  const scaledForDisplay = roundScaledToDecimals(scaled, digits);

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const parts = fmt.formatToParts(0);
  const currencyPart = parts.find((p) => p.type === "currency");
  const symbol = currencyPart?.value ?? "";
  const minus = negative ? "-" : "";

  return minus + symbol + groupedInt + (digits > 0 ? decimal + fracStr.padEnd(digits, "0") : "");
}

function formatPercentFromScaled(
  percentScaled: bigint,
  decimals: number,
): string {
  const d = Math.max(0, Math.min(12, decimals));
  const rounded = roundScaledToDecimals(percentScaled, d);

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    rounded,
    d,
    false,
  );

  const groupedInt = groupInt(intStr, group);
  if (d === 0) return `${negative ? "-" : ""}${groupedInt}`;
  return `${negative ? "-" : ""}${groupedInt}${decimal}${fracStr.padEnd(
    d,
    "0",
  )}`;
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
  if (period === "weekly") return mulDivRound(valueScaled, 365n, 7n);
  if (period === "biweekly") return mulDivRound(valueScaled, 365n, 14n);
  if (period === "every_4_weeks") return mulDivRound(valueScaled, 365n, 28n);
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
  // IMPORTANT: use rounded division (not truncation) to preserve cents and higher precision
  if (to === "hourly") return mulDivRound(annualScaled, 1n, 365n * 24n);
  if (to === "daily") return mulDivRound(annualScaled, 1n, 365n);
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return mulDivRound(annualScaled, 1n, 12n);
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
    } catch {
      // ignore
    }
  }, [oldRent, newRent, period, currency]);

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
    formatCurrencyFromScaled(scaled, currency);

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

    // Percent calculation in bigint fixed-point to avoid float precision and NaN.
    let pctScaled: bigint | null = null;
    let pctDisplay: string | null = null;
    let pctNote: string | null = null;

    if (annualOldScaled > 0n) {
      // pct = (annualDelta / annualOld) * 100
      pctScaled = mulDivRound(annualDeltaScaled, 100n * SCALE, annualOldScaled);
      pctDisplay = `${formatPercentFromScaled(pctScaled, 2)}%`;
    } else if (annualNewScaled > 0n) {
      pctScaled = null;
      pctDisplay = null;
      pctNote =
        "Percent increase is not meaningful when the starting rent is 0.";
    } else {
      pctScaled = 0n;
      pctDisplay = `${formatPercentFromScaled(0n, 2)}%`;
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

    // Keep these numbers for any future use, but do not rely on them for percent.
    const _annualOld = toNumberSafe(annualOldScaled);
    const _annualNew = toNumberSafe(annualNewScaled);
    const _annualDelta = toNumberSafe(annualDeltaScaled);
    void _annualOld;
    void _annualNew;
    void _annualDelta;

    return {
      ok: true as const,
      warnings,

      annualOldScaled,
      annualNewScaled,
      annualDeltaScaled,

      pctScaled,
      pctDisplay,
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
      q: "How do I calculate a rent increase percentage?",
      a: "Subtract the old rent from the new rent, divide that difference by the old rent, then multiply by 100. For example, if rent rises from 2,000 to 2,100, the increase is 5%.",
    },
    {
      q: "What does this rent increase percentage calculator compare?",
      a: "It compares your old rent and new rent for the billing period you select. It also annualizes both amounts so the yearly impact and other period breakdowns are shown consistently.",
    },
    {
      q: "What if the old rent is 0?",
      a: "A percentage increase is not meaningful when the starting rent is 0. In that case, the page shows absolute rent differences instead of a percentage result.",
    },
    {
      q: "Why are monthly and every 4 weeks shown separately?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days based on 365 days divided by 12. They are not the same billing cycle.",
    },
    {
      q: "Does this include utilities, fees, taxes, or parking?",
      a: "No. The calculator compares the rent amounts you enter. If your rent includes utilities, fees, taxes, or parking, enter the total amount you want to compare.",
    },
    {
      q: "Does this handle prorated rent changes?",
      a: "No. This is a full-period comparison. If a rent increase starts partway through a billing period, the first payment may need a separate prorated calculation.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "The calculator uses 365 days per year, 7 days per week, 14 days for biweekly rent, 28 days for every 4 weeks, and 365 ÷ 12 days for an average month.",
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
      "Calculate the percentage increase between old rent and new rent. See the rent change, annual impact, and common billing-period breakdowns.",
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth text-[15px] sm:text-lg leading-relaxed">
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

      <section id="converter" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Rent increase tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Increase Percentage Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate the percentage increase between your old rent and
                  new rent. The calculator also shows the yearly impact and
                  common period breakdowns.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-old"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className={`w-full rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  oldParsed.ok
                    ? "focus:bg-white"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!oldParsed.ok}
                aria-describedby={
                  oldParsed.ok ? oldHelpId : `${oldHelpId} ${oldErrorId}`
                }
              />
              <p id={oldHelpId} className="sr-only">
                Enter the old rent amount for the selected billing period.
              </p>

              {!oldParsed.ok ? (
                <p
                  id={oldErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {oldParsed.error}
                </p>
              ) : oldParsed.warnings.length ? (
                <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {oldParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-new"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className={`w-full rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  newParsed.ok
                    ? "focus:bg-white"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!newParsed.ok}
                aria-describedby={
                  newParsed.ok ? newHelpId : `${newHelpId} ${newErrorId}`
                }
              />
              <p id={newHelpId} className="sr-only">
                Enter the new rent amount for the selected billing period.
              </p>

              {!newParsed.ok ? (
                <p
                  id={newErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {newParsed.error}
                </p>
              ) : newParsed.warnings.length ? (
                <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {newParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-period"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Billing period
              </label>
              <select
                id="rc-rip-period"
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                aria-label="Billing period"
              >
                {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-700">
                Applies to both rent amounts.
              </p>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rc-rip-currency"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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
            className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:px-6">
              {!computed.ok ? (
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
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
                    <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Rent increase percentage
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums">
                      {computed.pctDisplay ?? "N/A"}
                    </div>
                    {computed.pctNote ? (
                      <p className="text-sm font-semibold text-slate-700">
                        {computed.pctNote}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-700">
                        Based on the old rent and new rent entered above.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                      <div className="text-xs text-slate-700">
                        Change per selected period
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums">
                        {fmtMoney(computed.deltaPerSelectedPeriodScaled)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                      <div className="text-xs text-slate-700">
                        Annual rent before
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums">
                        {fmtMoney(computed.annualOldScaled)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                      <div className="text-xs text-slate-700">
                        Annual rent after
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums">
                        {fmtMoney(computed.annualNewScaled)}
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="text-sm text-slate-700">
                          Annual difference:{" "}
                          <strong className="text-slate-950 tabular-nums">
                            {fmtMoney(computed.annualDeltaScaled)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Monthly difference:{" "}
                          <strong className="text-slate-950 tabular-nums">
                            {fmtMoney(
                              computed.newMonthlyAvgScaled -
                                computed.oldMonthlyAvgScaled,
                            )}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Weekly difference:{" "}
                          <strong className="text-slate-950 tabular-nums">
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

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Monthly vs 4-week comparison
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-700">
                            Old monthly
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.oldMonthlyAvgScaled)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-700">
                            Old 4-week
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.old4wScaled)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-700">
                            New monthly
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.newMonthlyAvgScaled)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-700">
                            New 4-week
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.new4wScaled)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-slate-700">
                        4 weeks = 28 days. Average month ={" "}
                        <span className="tabular-nums">
                          {safeToFixed(computed.avgMonthDays, 2)}
                        </span>{" "}
                        days. Difference between monthly and 4-week amounts: old{" "}
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

                  <div className="mt-5 rounded-[1.5rem] bg-white p-5 sm:px-6 rc-print-block">
                    <h3 className="text-lg font-bold text-sky-800 mb-2">
                      Breakdown across common periods
                    </h3>
                    <p className="text-sm text-slate-700 mb-4">
                      Both rent amounts are annualized first, then shown across
                      common billing periods.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-700 border-b border-slate-200">
                            <th className="py-2.5 pr-4 font-semibold">
                              Period
                            </th>
                            <th className="py-2.5 pr-4 font-semibold text-right">
                              Old
                            </th>
                            <th className="py-2.5 pr-4 font-semibold text-right">
                              New
                            </th>
                            <th className="py-2.5 pr-4 font-semibold text-right">
                              Difference
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.breakdown.map((row, idx) => (
                            <tr
                              key={row.p}
                              className={`border-b border-slate-100 ${
                                idx % 2 === 1 ? "bg-slate-50/50" : ""
                              }`}
                            >
                              <td className="py-2.5 pr-4 font-semibold text-slate-950">
                                {PERIOD_LABEL[row.p]}
                              </td>
                              <td className="py-2.5 pr-4 text-slate-950 tabular-nums whitespace-nowrap text-right">
                                {fmtMoney(row.oldValScaled)}
                              </td>
                              <td className="py-2.5 pr-4 text-slate-950 tabular-nums whitespace-nowrap text-right">
                                {fmtMoney(row.newValScaled)}
                              </td>
                              <td className="py-2.5 pr-4 text-slate-950 tabular-nums whitespace-nowrap text-right">
                                {fmtMoney(row.deltaScaled)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {computed.warnings.length ? (
                    <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
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
          </div>

          <Assumptions />

        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>
      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
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
