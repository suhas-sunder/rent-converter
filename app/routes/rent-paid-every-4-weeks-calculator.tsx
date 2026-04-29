import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-paid-every-4-weeks-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-paid-every-4-weeks-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-paid-every-4-weeks-calculator/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Free 4-Week Rent Calculator";
  const description =
    "Convert rent paid every 4 weeks into monthly, weekly, and annual amounts. See the 28-day rent comparison clearly.";

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
      q: "What does rent paid every 4 weeks mean?",
      a: "It means rent is due every 28 days instead of once per calendar month. Because 28 days is shorter than most months, the due date moves through the calendar over time.",
    },
    {
      q: "How many 4-week rent payments happen in a year?",
      a: "A 4-week schedule is often described as 13 payments in a 52-week year. Using a 365-day year, there are about 13.04 periods of 28 days.",
    },
    {
      q: "Is 4-week rent the same as monthly rent?",
      a: "No. A 4-week period is 28 days. An average month is about 30.42 days based on 365 days divided by 12. The annual totals are different.",
    },
    {
      q: "Why can 4-week rent cost more than it looks?",
      a: "Monthly rent normally means 12 payments per year. Rent due every 4 weeks is closer to 13 payments per year, so the annual cost can be higher even if the payment amount looks similar.",
    },
    {
      q: "Does this calculator match exact lease due dates?",
      a: "No. It gives budgeting comparisons using fixed day-count assumptions. Exact lease totals can depend on start dates, prorations, fees, and lease wording.",
    },
    {
      q: "Why does the calculator use an average month?",
      a: "Calendar months vary from 28 to 31 days. Using 365 ÷ 12 gives a consistent average month for comparing 4-week, weekly, monthly, and annual amounts.",
    },
    {
      q: "How can this help compare listings?",
      a: "It converts a 4-week rent amount into monthly, weekly, and annual amounts so you can compare listings that use different rent schedules.",
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
      "Convert rent paid every 4 weeks into monthly, weekly, and annual amounts. See the 28-day rent comparison clearly.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const amountHelpId = "rc-4w-amount-help";
  const amountErrorId = "rc-4w-amount-error";

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

      <section id="converter" className="mx-auto max-w-6xl px-6 py-6">
        <div className="rounded-2xl bg-white/95 pb-6 shadow-sm border border-slate-200 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  28-day rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  4-Week to Monthly Rent Converter
                </h1>

                <p className="mt-2 max-w-3xl text-base text-slate-700">
                  Convert rent paid every 4 weeks into monthly, weekly, and
                  annual amounts. This helps compare 28-day rent with normal
                  monthly rent.
                </p>
              </div>

              <div
                id="export-controls"
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4">
            <div>
              <label
                htmlFor="rc-4w-amount"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                4-week rent amount
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
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsed.ok
                      ? "border-slate-300 focus:border-sky-500"
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
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-300 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id={amountHelpId} className="mt-1 text-xs text-slate-600">
                Enter the rent due every 28 days.
              </p>

              {!parsed.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsed.error}
                </p>
              ) : parsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsed.warnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div
            className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50/60 shadow-sm rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:px-6">
              {!computed.ok ? (
                <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Fix the input to calculate amounts.
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
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-900">
                      Monthly amount
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.monthlyScaled)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Based on the 4-week amount converted to an annual total,
                      then divided by 12.
                    </p>
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
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm"
                      >
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(val)}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        4-week vs monthly comparison
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-lg border border-emerald-200 bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-600">
                            4-week
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.every4wScaled)}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-600">
                            28-day period
                          </div>
                        </div>

                        <div className="rounded-lg border border-emerald-200 bg-white/70 px-3 py-2">
                          <div className="text-[11px] text-slate-600">
                            Monthly
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.monthlyScaled)}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-600">
                            Annual total ÷ 12
                          </div>
                        </div>

                        <div className="rounded-lg border border-emerald-200 bg-white/70 px-3 py-2">
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
          </div>

          <Assumptions />

          <div className="mt-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm rc-no-print">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Rounding
                roundDisplay={roundDisplay}
                setRoundDisplay={setRoundDisplay}
                displayDecimals={displayDecimals}
                setDisplayDecimals={setDisplayDecimals as any}
              />

              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 md:hidden"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="payment-counts"
        className="mx-auto max-w-6xl px-6 py-6 rc-no-print"
      >
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-sky-800 tracking-tight">
                Annual payment counts for common rent schedules
              </h2>

              <p className="text-slate-700 leading-7 mb-5">
                A 4-week schedule repeats every 28 days. Calendar months are not
                28 days, so monthly rent and 4-week rent do not line up exactly.
                The table shows the difference between common schedule counts.
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full bg-white">
                  <thead className="bg-sky-50/70">
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
                        Periods per 365-day year
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

                    <tr className="border-t border-slate-200 bg-slate-50/50">
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

                    <tr className="border-t border-slate-200 bg-slate-50/50">
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
                These counts are for comparison. Real billing can depend on
                lease start date, due-date rules, proration, fees, and how
                partial periods are handled.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="text-sm font-bold text-sky-800">
                  What this table is showing
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
                  <li>
                    <strong className="text-slate-900">
                      4-week rent is a fixed 28-day schedule.
                    </strong>{" "}
                    It is not the same as calendar-month billing.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      13 payments is a 52-week framing.
                    </strong>{" "}
                    A 365-day year is slightly longer than 52 weeks.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Monthly rent is calendar-based.
                    </strong>{" "}
                    It does not have one fixed day length.
                  </li>
                </ul>
              </div>
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
            className="cursor-pointer rounded text-sky-700 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-5 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
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
