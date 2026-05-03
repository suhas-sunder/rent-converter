import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-week-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-per-week-calculator/HowItWorks";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent Per Week Calculator | Weekly Rent Equivalent";
  const description =
    "Calculate rent per week from monthly, 4-week, biweekly, daily, hourly, or annual rent using clear period assumptions.";

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

  const [weeksCount, setWeeksCount] = useState<string>(() => {
    if (typeof window === "undefined") return "4";
    return localStorage.getItem("rpwc_weeksCount") ?? "4";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpwc_amount", amount);
    localStorage.setItem("rpwc_from", from);
    localStorage.setItem("rpwc_currency", currency);
    localStorage.setItem("rpwc_weeksCount", weeksCount);
  }, [amount, from, currency, weeksCount]);

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
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do I calculate rent per week?",
      a: "Convert the rent amount to an annual total, then convert that annual rent into a 7-day weekly equivalent. For example, monthly rent is multiplied by 12 first, then multiplied by 7 and divided by 365.",
    },
    {
      q: "Why is monthly rent divided by 4 different from weekly rent?",
      a: "A month is not exactly 4 weeks. This calculator uses an annual basis so monthly rent, 4-week rent, and weekly rent can be compared consistently.",
    },
    {
      q: "How does every 4 weeks compare to weekly rent?",
      a: "Every 4 weeks is a 28-day cycle, so it equals 4 weekly periods. It is not the same as monthly rent because monthly rent usually means 12 payments per year.",
    },
    {
      q: "Can this estimate rent for a chosen number of weeks?",
      a: "Yes. Enter a number of weeks and the calculator multiplies the weekly amount by that week count. Exact lease proration may use different rules.",
    },
    {
      q: "What assumptions does this page use?",
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
      "Calculate rent per week from monthly, 4-week, biweekly, daily, hourly, or annual rent using clear period assumptions.",
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

  const amountInputId = "rpwc_amount_input";
  const amountHelpId = "rpwc_amount_help";
  const amountErrorId = "rpwc_amount_error";
  const fromSelectId = "rpwc_from_select";
  const currencySelectId = "rpwc_currency_select";
  const weeksInputId = "rpwc_weeks_input";
  const weeksErrorId = "rpwc_weeks_error";

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
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
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Weekly rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Per Week Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate rent per week from monthly, 4-week, biweekly,
                  daily, hourly, or annual rent using the same period
                  assumptions shown in the result.
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
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 2000"
                  className={`w-full min-w-0 rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsedRent.ok
                      ? "focus:bg-white"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsedRent.ok}
                  aria-describedby={`${amountHelpId}${!parsedRent.ok ? ` ${amountErrorId}` : ""}`}
                />
                <select
                  id={currencySelectId}
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id={amountHelpId} className="mt-1 text-xs text-slate-700">
                Enter the rent amount for the selected billing period.
              </p>

              {!parsedRent.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedRent.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor={fromSelectId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Billing period for that amount
              </label>
              <select
                id={fromSelectId}
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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
            <div
              className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              role="region"
              aria-label="Results"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
              <div className="p-5 sm:px-6">
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Fix the input to calculate weekly rent.
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
              </div>
            </div>
          ) : (
            <>
              {computed.warnings.length ? (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Notes</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
                role="region"
                aria-label="Results"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

                <div className="p-5 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Rent per week
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                      {fmt(computed.weeklyScaled)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on annual rent x 7 / 365.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(
                          [
                            [
                              "Hourly",
                              computed.breakdown.hourlyScaled,
                              "hourly",
                            ],
                            ["Daily", computed.breakdown.dailyScaled, "daily"],
                            [
                              "Weekly",
                              computed.breakdown.weeklyScaled,
                              "weekly",
                            ],
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
                            [
                              "Annual",
                              computed.breakdown.annualScaled,
                              "annual",
                            ],
                          ] as const
                        ).map(([label, val, key]) => (
                          <div
                            key={key}
                            className="rounded-2xl bg-white px-4 py-3"
                          >
                            <div className="text-xs text-slate-700">
                              {label}
                            </div>
                            <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                              {fmt(val)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-2xl bg-white p-5">
                        <h3 className="text-lg font-bold text-sky-800 mb-2">
                          Total for a chosen number of weeks
                        </h3>
                        <p className="text-sm text-slate-700 mb-4">
                          This multiplies the weekly amount by a week count.
                          Lease proration rules can differ.
                        </p>

                        <label
                          htmlFor={weeksInputId}
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Number of weeks
                        </label>
                        <input
                          id={weeksInputId}
                          inputMode="numeric"
                          value={weeksCount}
                          onChange={(e) => setWeeksCount(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                          aria-invalid={!parsedWeeks.ok}
                          aria-describedby={
                            !parsedWeeks.ok ? weeksErrorId : undefined
                          }
                        />

                        {!parsedWeeks.ok ? (
                          <p
                            id={weeksErrorId}
                            className="mt-2 text-sm font-semibold text-rose-700"
                            role="alert"
                          >
                            {parsedWeeks.error}
                          </p>
                        ) : null}

                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
                          <div className="text-xs text-slate-700">
                            Estimated total
                          </div>
                          <div className="mt-1 text-2xl font-extrabold text-slate-950 tabular-nums break-words">
                            {fmt(computed.totalForWeeksScaled)}
                          </div>
                          <div className="mt-1 text-xs text-slate-700">
                            <span className="tabular-nums whitespace-nowrap">
                              {fmt(computed.weeklyScaled)}
                            </span>{" "}
                            per week ×{" "}
                            <span className="tabular-nums whitespace-nowrap">
                              {computed.weeksN}
                            </span>{" "}
                            weeks
                          </div>
                        </div>

                        <div className="mt-3 rounded-2xl bg-white px-4 py-3">
                          <div className="text-xs text-slate-700">
                            Annual total
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                            {fmt(computed.annualScaled)}
                          </div>
                          <div className="mt-1 text-xs text-slate-700">
                            365-day basis
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="text-xs font-semibold text-emerald-800">
                  4-week vs monthly comparison
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week:{" "}
                    <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                      {fmt(computed.breakdown.monthlyMinus4w)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                      {safeToFixed(
                        computed.breakdown.monthlyMinus4wPct * 100,
                        2,
                      )}
                      %
                    </strong>
                  </div>
                </div>
              </div>

              <section className="mt-5 rc-no-print">
                <div className="rounded-2xl bg-white p-5">
                  <h3 className="text-xl font-semibold mb-3 text-sky-800">
                    Payment counts per year
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
                    <li>
                      Weekly: <strong className="text-slate-950">52</strong>{" "}
                      payments per year
                    </li>
                    <li>
                      Every 2 weeks:{" "}
                      <strong className="text-slate-950">26</strong> payments
                      per year
                    </li>
                    <li>
                      Every 4 weeks:{" "}
                      <strong className="text-slate-950">13</strong> payments
                      per year
                    </li>
                    <li>
                      Monthly: <strong className="text-slate-950">12</strong>{" "}
                      payments per year
                    </li>
                  </ul>
                </div>
              </section>
            </>
          )}

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
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

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
