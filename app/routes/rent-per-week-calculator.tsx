import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-per-week-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-per-week-calculator/HowItWorks";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Free Rent Per Week Calculator";
  const description =
    "Calculate rent per week from monthly, biweekly, 4-week, daily, hourly, or annual rent. See the weekly rent formula, instant result, and export options.";

  const canonicalUrl = "https://www.rentconverter.com/rent-per-week-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent per week calculator, weekly rent calculator, true weekly rent, rent per week from monthly, weekly equivalent rent, rent per week from 4 week rent, prorated weekly rent",
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
 * Route whitelist. Only include routes you know exist in your app.
 * Add routes only when confirmed.
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

  // Rent vs buy
  "/rent-vs-buy-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
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

/**
 * Accepts: $650, 650, 650.00, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a rent amount.", warnings };

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
    return { ok: false, error: "Rent must be 0 or greater.", warnings };
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
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: "Enter a valid number.", warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: "Enter a valid number.", warnings };

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

type ParsedInt = { ok: boolean; value?: number; error?: string };

function parseNonNegInt(raw: string, label: string, max: number): ParsedInt {
  const s = (raw ?? "").trim();
  if (!s) return { ok: false, error: `Enter ${label}.` };
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned)
    return { ok: false, error: `Enter a whole number for ${label}.` };
  const n = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(n))
    return { ok: false, error: `Enter a valid ${label}.` };
  if (n < 0) return { ok: false, error: `${label} must be 0 or more.` };
  if (n > max) return { ok: false, error: `${label} must be ${max} or less.` };
  return { ok: true, value: n };
}

/**
 * Annual equivalence (365-day year), fixed counts for:
 * - Week = 7 days
 * - Biweekly = 14 days
 * - Every 4 weeks = 28 days
 * - Month = 365/12 days (average month)
 * - Hour = 1/24 day
 */
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

function safeParseDisplayDecimals(raw: string | null): number {
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
}

function formatPreviewFromNormalized(normalized: string): string {
  const [intStr, fracStr] = normalized.split(".");
  const intNum = Number(intStr);
  const grouped = Number.isFinite(intNum)
    ? new Intl.NumberFormat("en-US", {
        useGrouping: true,
        maximumFractionDigits: 0,
      }).format(intNum)
    : intStr;
  if (typeof fracStr === "string" && fracStr.length > 0) {
    return `${grouped}.${fracStr}`;
  }
  return grouped;
}

export default function RentPerWeekCalculator() {
  const pageName = "Rent Per Week Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-per-week-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpwc_amount") ?? "2000";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const parsedRent = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const amountPreviewValue = useMemo(() => {
    if (!parsedRent.ok) return amount;
    const normalized = parsedRent.normalized ?? "";
    if (!normalized) return amount;
    return formatPreviewFromNormalized(normalized);
  }, [parsedRent, amount]);

  const amountDisplayValue = isAmountFocused
    ? amount
    : parsedRent.ok
      ? amountPreviewValue
      : amount;

  const [from, setFrom] = useState<Exclude<Period, "weekly">>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rpwc_from") ?? "monthly";
    // allow "weekly" in storage if it ever existed, but we treat it as valid Period
    const p = isPeriod(saved) ? saved : "monthly";
    return (p === "weekly" ? "monthly" : p) as Exclude<Period, "weekly">;
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rpwc_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (do not affect computation)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rpwc_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rpwc_display_decimals"),
    );
  });

  const [weeksCount, setWeeksCount] = useState<string>(() => {
    if (typeof window === "undefined") return "4";
    return localStorage.getItem("rpwc_weeksCount") ?? "4";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpwc_amount", amount);
    localStorage.setItem("rpwc_from", from);
    localStorage.setItem("rpwc_currency", currency);
    localStorage.setItem("rpwc_round_display", JSON.stringify(roundDisplay));
    localStorage.setItem("rpwc_display_decimals", String(displayDecimals));
    localStorage.setItem("rpwc_weeksCount", weeksCount);
  }, [amount, from, currency, roundDisplay, displayDecimals, weeksCount]);

  const parsedWeeks = useMemo(
    () => parseNonNegInt(weeksCount, "number of weeks", 520),
    [weeksCount],
  );

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedRent.ok)
      errors.push(parsedRent.error ?? "Enter a valid rent amount.");
    if (parsedRent.warnings.length) warnings.push(...parsedRent.warnings);

    if (!parsedWeeks.ok)
      errors.push(parsedWeeks.error ?? "Enter a valid number of weeks.");

    if (errors.length) return { ok: false as const, errors, warnings };

    const rentScaled = parsedRent.scaled as bigint;

    const annualScaled = annualizeFromScaled(rentScaled, from);
    const weeklyScaled = fromAnnualScaled(annualScaled, "weekly");

    const hourlyScaled = fromAnnualScaled(annualScaled, "hourly");
    const dailyScaled = fromAnnualScaled(annualScaled, "daily");
    const biweeklyScaled = fromAnnualScaled(annualScaled, "biweekly");
    const fourWeeksScaled = fromAnnualScaled(annualScaled, "every_4_weeks");
    const monthlyScaled = fromAnnualScaled(annualScaled, "monthly");

    const monthlyMinus4w = monthlyScaled - fourWeeksScaled;

    // % difference vs 4-week: (monthly - 4w)/4w
    const num = toNumberSafe(monthlyMinus4w);
    const den = toNumberSafe(fourWeeksScaled);
    const pct =
      den === 0 || !Number.isFinite(num) || !Number.isFinite(den)
        ? 0
        : num / den;

    const weeksN = parsedWeeks.value as number;
    const totalForWeeksScaled = weeklyScaled * BigInt(weeksN);

    return {
      ok: true as const,
      warnings,
      rentScaled,
      annualScaled,
      weeklyScaled,
      breakdown: {
        hourlyScaled,
        dailyScaled,
        weeklyScaled,
        biweeklyScaled,
        fourWeeksScaled,
        monthlyScaled,
        annualScaled,
        monthlyMinus4w,
        monthlyMinus4wPct: pct,
      },
      weeksN,
      totalForWeeksScaled,
    };
  }, [parsedRent, parsedWeeks, from]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does “rent per week” mean on this calculator?",
      a: "It is your rent expressed as a weekly equivalent using a 365-day annual basis. This makes listings priced on different billing cycles comparable on the same weekly scale.",
    },
    {
      q: "Why isn’t monthly rent divided by 4 the same as weekly rent?",
      a: "A month is not exactly 4 weeks. This calculator uses an average month of 365 ÷ 12 days, converts to an annual total, then derives a weekly equivalent from that annual total.",
    },
    {
      q: "How does every 4 weeks (28 days) compare to weekly rent?",
      a: "Four weeks is exactly 28 days, which equals 4 weeks. Many 4-week billing schedules imply about 13 payments per year, which can differ from monthly (typically 12 payments per year).",
    },
    {
      q: "Is this the same as prorated rent for a partial month?",
      a: "No. This tool shows equivalences for comparison. Lease proration depends on the lease terms, billing months, and due dates.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "Assumptions: year = 365 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average).",
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
      "Convert rent to a weekly equivalent from monthly, 4-week, biweekly, daily, hourly, or annual amounts using annual equivalence (365-day basis).",
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

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6"
      >
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              Weekly Rent Equivalent Calculator
            </h1>

            <div
              id="export-controls"
              className="hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p className="hidden md:flex w-full py-2 text-base text-slate-600">
            See the weekly equivalent of your rent based on any period. Clear
            calculations, no sign-up required.
          </p>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 2000"
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedRent.ok}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period for that amount
              </label>
              <select
                value={from}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!isPeriod(v)) return;
                  // This page is "per week", so we exclude selecting "weekly" as input to keep UI consistent,
                  // but conversion code supports it.
                  setFrom(
                    (v === "weekly" ? "monthly" : v) as Exclude<
                      Period,
                      "weekly"
                    >,
                  );
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "annual",
                    "daily",
                    "hourly",
                  ] as const
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!computed.ok ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:px-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate weekly rent.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {computed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {computed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {computed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <>
              {computed.warnings.length ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Rent per week
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(computed.weeklyScaled)}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["Hourly", computed.breakdown.hourlyScaled, "hourly"],
                          ["Daily", computed.breakdown.dailyScaled, "daily"],
                          ["Weekly", computed.breakdown.weeklyScaled, "weekly"],
                          [
                            "2 weeks",
                            computed.breakdown.biweeklyScaled,
                            "biweekly",
                          ],
                          [
                            "4 weeks (28 days)",
                            computed.breakdown.fourWeeksScaled,
                            "every_4_weeks",
                          ],
                          [
                            "Monthly (average)",
                            computed.breakdown.monthlyScaled,
                            "monthly",
                          ],
                          ["Annual", computed.breakdown.annualScaled, "annual"],
                        ] as const
                      ).map(([label, val, key]) => (
                        <div
                          key={key}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                        >
                          <div className="text-xs text-slate-500">{label}</div>
                          <div className="mt-1 text-lg font-bold text-slate-800">
                            {fmt(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Total for a chosen number of weeks
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        This multiplies the weekly equivalent by a week count
                        for quick comparisons. Lease proration rules can differ
                        from this estimate.
                      </p>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of weeks
                      </label>
                      <input
                        inputMode="numeric"
                        value={weeksCount}
                        onChange={(e) => setWeeksCount(e.target.value)}
                        placeholder="e.g. 4"
                        className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        aria-invalid={!parsedWeeks.ok}
                      />

                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <div className="text-xs text-slate-500">
                          Estimated total
                        </div>
                        <div className="mt-1 text-2xl font-extrabold text-slate-800">
                          {fmt(computed.totalForWeeksScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {fmt(computed.weeklyScaled)} per week ×{" "}
                          {computed.weeksN} weeks
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <div className="text-xs text-slate-500">
                          Annual total (source of truth)
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-800">
                          {fmt(computed.annualScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          365-day basis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                <div className="text-xs text-slate-500">
                  4-week vs monthly comparison
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week ={" "}
                    <strong className="text-slate-900">
                      {fmt(computed.breakdown.monthlyMinus4w)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference ≈{" "}
                    <strong className="text-slate-900">
                      {safeToFixed(
                        computed.breakdown.monthlyMinus4wPct * 100,
                        2,
                      )}
                      %
                    </strong>
                  </div>
                </div>
              </div>
              <section className="mt-2 rc-no-print">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                  Payment counts per year (for comparison)
                </h3>
                <ul className="list-disc ml-6 text-slate-700 mb-4">
                  <li>
                    Weekly: <strong>52</strong> payments per year
                  </li>
                  <li>
                    Every 2 weeks: <strong>26</strong> payments per year
                  </li>
                  <li>
                    Every 4 weeks (28 days): <strong>13</strong> payments per
                    year
                  </li>
                  <li>
                    Monthly: <strong>12</strong> payments per year
                  </li>
                </ul>
              </section>
            </>
          )}

          <Assumptions />
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
            <Rounding
              roundDisplay={roundDisplay}
              setRoundDisplay={setRoundDisplay}
              displayDecimals={displayDecimals}
              setDisplayDecimals={setDisplayDecimals as any}
            />
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="max-w-6xl mx-auto px-6 rc-no-print mt-4 sm:block hidden">
        <nav className="text-sm text-slate-500 mb-4">
          <a href={safeHref("/")} className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
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
