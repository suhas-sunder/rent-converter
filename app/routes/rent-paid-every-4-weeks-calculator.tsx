import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-paid-every-4-weeks-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-paid-every-4-weeks-calculator/HowItWorks";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent Paid Every 4 Weeks Calculator (True Monthly Cost)";
  const description =
    "See the true monthly and yearly cost of rent paid every 28 days. Understand why there are 13 payments per year and compare 4-week vs monthly billing with exact decimals. Free, private, no signup.";

  const canonicalUrl =
    "https://www.rentconverter.com/rent-paid-every-4-weeks-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent paid every 4 weeks, 28 day rent, 4 week rent calculator, true monthly cost of 4 week rent, 13 payments per year rent, 4 week rent vs monthly, convert 4 week rent to annual",
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

/**
 * Only include routes you are sure exist.
 * If you do not have a whitelist here, replace safeHref() usage with plain hrefs.
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
  const limit = MAX_SAFE_INT_FOR_NUMBER * SCALE;
  if (a > limit) return Number.NaN;
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

/**
 * Preview formatting WITHOUT converting to Number (prevents "disappearing" values on blur).
 * Uses the user-entered decimal precision inferred from parsed.normalized.
 */
function formatNumberPreviewFromParsed(parsed: ParsedScaled): string | null {
  if (!parsed.ok || typeof parsed.scaled === "undefined") return null;

  const normalized = parsed.normalized ?? "";
  const dot = normalized.indexOf(".");
  const decimals =
    dot >= 0 ? Math.max(0, Math.min(12, normalized.length - dot - 1)) : 0;

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    parsed.scaled,
    decimals,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  if (decimals === 0) return `${negative ? "-" : ""}${groupedInt}`;
  return `${negative ? "-" : ""}${groupedInt}${decimal}${fracStr.padEnd(
    decimals,
    "0",
  )}`;
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

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 650 or 650.00).",
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
    // Allow trailing separators like "12." or "12," (treat as 12)
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

/**
 * Source of truth: annual equivalence with fixed day counts.
 * Year = 365 days, week = 7, biweekly = 14, every 4 weeks = 28, month = 365/12 (average).
 * We use fixed-point BigInt to preserve decimals end-to-end.
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

function sanitizeRawAmountKeepCaret(raw: string, caret: number | null) {
  const before = caret === null ? raw : raw.slice(0, Math.max(0, caret));
  const commasBefore = (before.match(/,/g) || []).length;
  const sanitized = raw.replace(/,/g, "");
  const nextCaret = caret === null ? null : Math.max(0, caret - commasBefore);
  return { sanitized, nextCaret };
}

function coerceDisplayDecimalsFromStorage(raw: string | null): number {
  const allowed = new Set([0, 2, 4, 6]);
  const n = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : 2;
}

export default function RentPaidEvery4Weeks() {
  const pageName = "Rent Paid Every 4 Weeks (28 Days) Calculator";
  const canonicalUrl =
    "https://www.rentconverter.com/rent-paid-every-4-weeks-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "650";
    const saved = localStorage.getItem("rc_4w_amount") ?? "650";
    return saved.replace(/,/g, "");
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_4w_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (do not affect computation)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_4w_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return coerceDisplayDecimalsFromStorage(
      localStorage.getItem("rc_4w_display_decimals"),
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_4w_amount", amount);
      localStorage.setItem("rc_4w_currency", currency);
      localStorage.setItem("rc_4w_round_display", JSON.stringify(roundDisplay));
      localStorage.setItem("rc_4w_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsed.ok) errors.push(parsed.error ?? "Enter a valid 4-week amount.");
    if (parsed.warnings.length) warnings.push(...parsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const every4wScaled = parsed.scaled as bigint;

    const annualScaled = annualizeFromScaled(every4wScaled, "every_4_weeks");
    const monthlyScaled = fromAnnualScaled(annualScaled, "monthly");
    const weeklyScaled = fromAnnualScaled(annualScaled, "weekly");
    const biweeklyScaled = fromAnnualScaled(annualScaled, "biweekly");
    const dailyScaled = fromAnnualScaled(annualScaled, "daily");
    const hourlyScaled = fromAnnualScaled(annualScaled, "hourly");

    // Counts (context)
    const paymentsPer52WeekYear = 13; // 52 / 4
    const periodsPer365DayYear = 365 / 28; // ~13.04
    const monthlyPayments = 12;

    // Comparison: 13 payments vs 365-day annual equivalence (this tool)
    const annualVia13Scaled = every4wScaled * 13n;
    const diffAnnualScaled = annualScaled - annualVia13Scaled;

    const diffAnnualPct = (() => {
      if (annualVia13Scaled === 0n) return 0;
      const num = toNumberSafe(diffAnnualScaled);
      const den = toNumberSafe(annualVia13Scaled);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
      return (num / den) * 100;
    })();

    // Monthly vs 4-week difference (same annual basis)
    const monthlyMinus4wScaled = monthlyScaled - every4wScaled;
    const monthlyMinus4wPct = (() => {
      if (every4wScaled === 0n) return 0;
      const num = toNumberSafe(monthlyMinus4wScaled);
      const den = toNumberSafe(every4wScaled);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
      return (num / den) * 100;
    })();

    return {
      ok: true as const,
      warnings,

      every4wScaled,
      hourlyScaled,
      dailyScaled,
      weeklyScaled,
      biweeklyScaled,
      monthlyScaled,
      annualScaled,

      paymentsPer52WeekYear,
      periodsPer365DayYear,
      monthlyPayments,

      annualVia13Scaled,
      diffAnnualScaled,
      diffAnnualPct,

      monthlyMinus4wScaled,
      monthlyMinus4wPct,
    };
  }, [parsed]);

  const amountPreviewValue = useMemo(() => {
    const preview = formatNumberPreviewFromParsed(parsed);
    return preview ?? amount;
  }, [parsed, amount]);

  const amountDisplayValue = amountFocused
    ? amount
    : parsed.ok
      ? amountPreviewValue
      : amount;

  const faqData = [
    {
      q: "What does “rent paid every 4 weeks” mean?",
      a: "It means rent is due on a fixed 28-day cycle instead of by calendar month. Because 28 days is shorter than most months, the due date drifts through the calendar.",
    },
    {
      q: "How many payments happen in a year on a 4-week schedule?",
      a: "A 4-week schedule is commonly described as 13 payments in a 52-week year (52 ÷ 4 = 13). Using a 365-day year, there are about 13.04 28-day periods (365 ÷ 28). Lease terms determine how billing is handled in practice.",
    },
    {
      q: "Why can 4-week rent feel higher than monthly rent?",
      a: "Monthly billing implies 12 payments per year. A 4-week cadence is closer to 13 cycles per year, so the annual total can be higher even when each 4-week payment looks similar to a monthly payment.",
    },
    {
      q: "Is 4-week rent the same as paying monthly?",
      a: "No. A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Different period lengths produce different annual equivalents.",
    },
    {
      q: "Does this match exact due dates in my lease?",
      a: "It provides equivalents for budgeting and comparison. Exact due dates and totals depend on lease rules, start dates, prorations, fees, and what is included in rent.",
    },
    {
      q: "Why does the calculator use an average month?",
      a: "Calendar months vary from 28 to 31 days. Using 365 ÷ 12 creates a consistent monthly average so hourly, daily, weekly, 4-week, monthly, and annual equivalents stay comparable.",
    },
    {
      q: "How does this help when comparing listings?",
      a: "It converts a 4-week amount into monthly and annual equivalents so listings priced on different schedules can be compared on the same annual basis.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
      "Convert rent paid every 4 weeks (28 days) into monthly (average), weekly, and annual equivalents using a consistent 365-day annual basis. Includes schedule comparisons.",
    url: canonicalUrl,
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const amountHelpId = "rc-4w-amount-help";
  const amountErrorId = "rc-4w-amount-error";

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
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-4">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                4-week to monthly rent calculator
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

          <div className="grid gap-x-5 gap-y-3">
            <div>
              <label
                htmlFor="rc-4w-amount"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                4-week rent amount (every 28 days)
              </label>

              <div className="flex gap-2">
                <input
                  id="rc-4w-amount"
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => {
                    const caret = e.currentTarget.selectionStart;
                    const next = sanitizeRawAmountKeepCaret(
                      e.target.value,
                      caret,
                    );
                    setAmount(next.sanitized);
                    if (next.nextCaret !== null) {
                      queueMicrotask(() => {
                        try {
                          e.currentTarget.setSelectionRange(
                            next.nextCaret as number,
                            next.nextCaret as number,
                          );
                        } catch {
                          // ignore
                        }
                      });
                    }
                  }}
                  placeholder="e.g. 650 or 650.00"
                  className={`cursor-pointer w-full rounded-xl border px-4 py-2.5 text-lg outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    parsed.ok
                      ? "border-slate-300 focus:border-sky-600"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsed.ok}
                  aria-describedby={
                    parsed.ok
                      ? amountHelpId
                      : `${amountHelpId} ${amountErrorId}`
                  }
                />

                <label htmlFor="rc-4w-currency" className="sr-only">
                  Currency
                </label>
                <select
                  id="rc-4w-currency"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none transition hover:bg-sky-50 hover:border-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsed.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsed.error}
                </p>
              ) : (parsed as any).warnings?.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {(parsed as any).warnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div
            className=" mt-3 rounded-2xl border border-slate-200 border-l-4 border-l-sky-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block"
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
                  Fix the input to calculate equivalents.
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
                    Monthly equivalent
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                    {fmtMoney(computed.monthlyScaled)}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourlyScaled, "hourly"],
                      ["Daily", computed.dailyScaled, "daily"],
                      ["Weekly", computed.weeklyScaled, "weekly"],
                      ["2 weeks", computed.biweeklyScaled, "biweekly"],
                      [
                        "4 weeks (28 days)",
                        computed.every4wScaled,
                        "every_4_weeks",
                      ],
                      ["Annual", computed.annualScaled, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 border-t-2 border-t-sky-100 bg-white px-4 py-2.5 shadow-sm"
                    >
                      <div className="text-xs text-slate-600">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmtMoney(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-3 py-2">
                    <div className="text-[11px] text-slate-600">
                      4-week vs monthly (same annual basis)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">4-week</div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.every4wScaled)}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-600">
                          28-day period
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Monthly
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.monthlyScaled)}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-600">
                          365 ÷ 12 days
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Difference
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.monthlyMinus4wScaled)}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-600 tabular-nums">
                          ≈ {safeToFixed(computed.monthlyMinus4wPct, 2)}% of
                          4-week
                        </div>
                      </div>
                    </div>
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
          <Assumptions />
        </div>

        <div className="md:col-span-6 mt-6">
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

      <section
        id="payment-counts"
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
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-sky-900 tracking-tight">
              Annual payment counts for common rent schedules
            </h2>

            <p className="text-slate-600 leading-7 mb-6">
              Most “4-week rent” confusion comes from mixing two different
              concepts: calendar months and fixed-day cycles. A 4-week schedule
              repeats every <strong>28 days</strong>. Calendar months are not 28
              days, and they are not a fixed length. The table below shows how
              many payments each schedule implies in a 52-week framing and how
              many “periods” each schedule implies in a 365-day year. Those are
              different yardsticks on purpose.
            </p>

            <div className="overflow-x-auto rounded-3xl ring-1 ring-slate-200/80 bg-white shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-2">
                      Schedule
                    </th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-2">
                      Length
                    </th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-2">
                      Payments per 52-week year
                    </th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-2">
                      Periods per 365-day year (approx.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2 text-sm text-slate-900 font-semibold">
                      Monthly
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      Calendar month
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      12 payments
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      12 months
                    </td>
                  </tr>

                  <tr className="border-t border-slate-200 bg-slate-50/40">
                    <td className="px-4 py-2 text-sm text-slate-900 font-semibold">
                      Every 4 weeks (28 days)
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      28 days
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      13 payments
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      {safeToFixed(365 / 28, 2)} periods
                    </td>
                  </tr>

                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2 text-sm text-slate-900 font-semibold">
                      Biweekly (every 2 weeks)
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      14 days
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      26 payments
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      {safeToFixed(365 / 14, 2)} periods
                    </td>
                  </tr>

                  <tr className="border-t border-slate-200 bg-slate-50/40">
                    <td className="px-4 py-2 text-sm text-slate-900 font-semibold">
                      Weekly
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      7 days
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      52 payments
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800 tabular-nums">
                      {safeToFixed(365 / 7, 2)} weeks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              These counts are for comparison. Real billing can depend on lease
              start date, due-date rules, proration, fees, and how partial
              periods are handled.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">
                What this table is telling you
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
                <li>
                  <strong>
                    “4-week × 13” is a schedule framing, not a calendar-month
                    statement.
                  </strong>{" "}
                  It describes how many 4-week payments fit inside 52 weeks.
                </li>
                <li>
                  <strong>A 365-day year is a different basis.</strong> Under a
                  strict time-length model, 365 ÷ 28 is not exactly 13. The tool
                  surfaces the approximation rather than hiding it.
                </li>
                <li>
                  <strong>Monthly is calendar-based.</strong> It does not have a
                  fixed day length, so it will never line up perfectly with
                  28-day blocks.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Breadcrumbs */}
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="cursor-pointer hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

      {/* JSON-LD */}
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
