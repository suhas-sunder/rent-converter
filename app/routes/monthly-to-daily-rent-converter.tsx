import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-daily-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/monthly-to-daily-rent-converter/HowItWorks";
import ToolFit from "~/client/components/monthly-to-daily-rent-converter/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/monthly-to-daily-rent-converter";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Daily Rent Converter | Rent Per Day";
  const description =
    "Convert monthly rent to a daily amount using an average 365-day month. Compare daily rent with weekly, 4-week, and annual totals.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to daily rent converter, convert monthly rent to daily, true daily rent from monthly, daily equivalent rent, rent per day from monthly, average day vs 30 day month rent, rent daily from monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: PAGE_URL },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: OG_IMAGE_URL },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE_URL },

    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
};

type Period =
  | "weekly"
  | "monthly"
  | "biweekly"
  | "every_4_weeks"
  | "daily"
  | "hourly"
  | "annual";

// Keep conservative and aligned with your known route set.
// Add routes here only if they are confirmed to exist.
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

/** Decimal-safe fixed-point (up to 12 decimals). */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedAmount = {
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
 * Formatting rules:
 * - preserve decimals end-to-end
 * - rounding is display-only and clearly labeled
 * - if rounding disabled: show up to 12 decimals (no forced trailing zeros)
 */
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
 * Parses:
 * - $1,234.56
 * - 1234.56
 * - 1234,56 (comma decimal)
 * - .5 / 12.
 * Avoids silently returning 0 on invalid or ambiguous inputs.
 */
function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return { ok: false, error: "Enter a monthly rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 2000 or 2000.00).",
      warnings,
    };

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
            'That format is ambiguous. Try "1234.56" or "1,234.56" or "1234,56" (comma decimal).',
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
    if (split.length > 2)
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };
  if (fracPart && !/^\d+$/.test(fracPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };

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
    warnings.push("Value was clamped to the supported maximum for safety.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivInt(value: bigint, mul: bigint, div: bigint): bigint {
  if (div === 0n) return 0n;
  return (value * mul) / div;
}

/**
 * Convert across periods using annual equivalence:
 * monthly is treated as average month length (365/12 days).
 */
function convertScaled(valueScaled: bigint, from: Period, to: Period): bigint {
  if (from === to) return valueScaled;

  const daysPer: Record<
    Exclude<Period, "hourly">,
    { num: bigint; den: bigint }
  > = {
    daily: { num: 1n, den: 1n },
    weekly: { num: 7n, den: 1n },
    biweekly: { num: 14n, den: 1n },
    every_4_weeks: { num: 28n, den: 1n },
    monthly: { num: 365n, den: 12n },
    annual: { num: 365n, den: 1n },
  };

  let dailyScaled: bigint;
  if (from === "hourly") {
    dailyScaled = mulDivInt(valueScaled, 24n, 1n);
  } else {
    const dp = daysPer[from as Exclude<Period, "hourly">] ?? {
      num: 1n,
      den: 1n,
    };
    dailyScaled = mulDivInt(valueScaled, dp.den, dp.num);
  }

  if (to === "hourly") return mulDivInt(dailyScaled, 1n, 24n);
  const dpTo = daysPer[to as Exclude<Period, "hourly">] ?? { num: 1n, den: 1n };
  return mulDivInt(dailyScaled, dpTo.num, dpTo.den);
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

function groupThousandsEnUS(intStr: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return (s || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPreviewFromNormalized(normalized: string): string {
  const parts = normalized.split(".");
  const intPart = parts[0] ?? "0";
  const fracPart = parts[1];
  const groupedInt = groupThousandsEnUS(intPart);
  if (typeof fracPart === "string") return `${groupedInt}.${fracPart}`;
  return groupedInt;
}

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return (n * 100).toFixed(2) + "%";
}

export default function MonthlyToDailyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = window.localStorage.getItem("rc_mtd_amount") ?? "2000";
    return saved.replace(/,/g, "");
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_mtd_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  // Rounding is display-only and labeled

  const copyTimerRef = useRef<number | null>(null);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  const [isAmountFocused, setIsAmountFocused] = useState(false);

  const amountPreviewValue = useMemo(() => {
    if (!parsedAmount.ok) return amount;
    const normalized = parsedAmount.normalized ?? "";
    return normalized ? formatPreviewFromNormalized(normalized) : amount;
  }, [parsedAmount.ok, parsedAmount.normalized, amount]);

  const amountInputValue = isAmountFocused ? amount : amountPreviewValue;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mtd_amount", amount);
      window.localStorage.setItem("rc_mtd_currency", currency);
    } catch {
      // ignore
    }
  }, [amount, currency]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const breakdown = useMemo(() => {
    if (!parsedAmount.ok) return null;

    const monthly = monthlyScaled;

    const daily = convertScaled(monthly, "monthly", "daily");
    const hourly = convertScaled(monthly, "monthly", "hourly");
    const weekly = convertScaled(monthly, "monthly", "weekly");
    const biweekly = convertScaled(monthly, "monthly", "biweekly");
    const every4w = convertScaled(monthly, "monthly", "every_4_weeks");
    const annualEquiv = convertScaled(monthly, "monthly", "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w
      ? Number(monthlyMinus4w) / Number(every4w)
      : 0;

    // Context-only schedule framing (not used as truth)
    const annualFromMonthly12 = mulDivInt(monthly, 12n, 1n);
    const annualFromWeekly52 = mulDivInt(weekly, 52n, 1n);

    const daily30Day = mulDivInt(monthly, 1n, 30n);
    const dailyAverage = daily;
    const dailyAverageMinus30Day = dailyAverage - daily30Day;
    const dailyAverageMinus30DayPct = daily30Day
      ? Number(dailyAverageMinus30Day) / Number(daily30Day)
      : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annualEquiv,
      monthlyMinus4w,
      monthlyMinus4wPct,
      annualFromMonthly12,
      annualFromWeekly52,
      daily30Day,
      dailyAverage,
      dailyAverageMinus30Day,
      dailyAverageMinus30DayPct,
    };
  }, [parsedAmount.ok, monthlyScaled]);

  const canShowResults = parsedAmount.ok && !!breakdown;


  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do you convert monthly rent to daily rent?",
      a: "This calculator treats a month as 365 ÷ 12 days, then divides the monthly rent by that average month length.",
    },
    {
      q: "Why not just divide monthly rent by 30?",
      a: "Dividing by 30 is a shortcut. The main result uses the average month length across a 365-day year.",
    },
    {
      q: "Why does every 4 weeks differ from monthly rent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days, so the amounts differ.",
    },
    {
      q: "Does this match exact prorated rent?",
      a: "Not always. Exact prorated rent can depend on lease terms, local rules, and whether the landlord uses calendar days, a 30-day month, or another method.",
    },
    {
      q: "What assumptions does this converter use?",
      a: "It uses 365 days per year, 7 days per week, 14 days per biweekly period, 28 days per 4-week period, and 365 ÷ 12 days per average month.",
    },
    {
      q: "Does display rounding change the calculation?",
      a: "No. Rounding is display-only. The calculator keeps decimal precision through the calculation and only rounds shown or printed values.",
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Monthly to Daily Rent Converter",
        item: PAGE_URL,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Monthly to Daily Rent Converter",
    description:
      "Convert monthly rent to daily rent and compare it with a 30-day estimate.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Monthly to daily rent conversion",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth">
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
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 pt-3 sm:pt-6"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 rc-page-eyebrow">
                  Monthly to daily rent calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Monthly to Daily Rent Converter
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Convert monthly rent into a daily amount. The calculator also
                  shows related rent breakdowns for comparison.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex flex-wrap gap-2 sm:justify-end"
              >
                <button
                  type="button"
                  onClick={handlePrint}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>

              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Monthly rent amount
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    inputMode="decimal"
                    value={amountInputValue}
                    onChange={(e) =>
                      setAmount((e.target.value ?? "").replace(/,/g, ""))
                    }
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                    placeholder="e.g. 2000 or 2000.00"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={!parsedAmount.ok}
                    aria-describedby="rc-amt-help rc-amt-error"
                  />

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        isCurrency(e.target.value)
                          ? (e.target.value as Currency)
                          : "USD",
                      )
                    }
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:border-sky-400 hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-amt-help" className="mt-2 text-xs text-slate-700">
                  Enter the monthly rent amount. Currency symbols, commas, and
                  decimals are accepted.
                </p>

                {!parsedAmount.ok ? (
                  <p
                    id="rc-amt-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                    aria-live="assertive"
                  >
                    {parsedAmount.error}
                  </p>
                ) : parsedAmount.warnings.length ? (
                  <div
                    className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="font-semibold">Input interpretation note</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedAmount.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label="Daily rent results"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />


              <div className="p-5 sm:px-6">

              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-950">
                  Daily amount
                </div>
              </div>

              {!canShowResults || !breakdown ? (
                <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-950">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid monthly rent amount to see the daily amount
                    and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3">
                    <div className="text-3xl font-extrabold text-emerald-700 sm:text-5xl">
                      {fmt(breakdown.daily)}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      Based on monthly rent divided by 365 ÷ 12 days.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdown.hourly, "hourly"],
                        ["Weekly", breakdown.weekly, "weekly"],
                        ["2 weeks (14 days)", breakdown.biweekly, "biweekly"],
                        ["4 weeks (28 days)", breakdown.every4w, "every_4_weeks"],
                        ["Monthly", breakdown.monthly, "monthly"],
                        ["Annual", breakdown.annualEquiv, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs font-medium text-slate-700">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {fmt(val)}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3 rc-print-block">
                      <div className="text-xs font-medium text-emerald-700">
                        30-day comparison
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            30-day shortcut
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {fmt(breakdown.daily30Day)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            Average-month daily
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {fmt(breakdown.dailyAverage)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            Difference
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {fmt(breakdown.dailyAverageMinus30Day)}
                          </div>
                          <div className="mt-1 text-xs text-slate-700">
                            ≈{" "}
                            {formatPercent(
                              breakdown.dailyAverageMinus30DayPct)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-700">
                        The main result uses the average month length. The
                        30-day amount is shown as a common shortcut.
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3 rc-print-block">
                      <div className="text-xs font-medium text-emerald-700">
                        Monthly vs 4-week context
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            Monthly minus 4-week amount
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {fmt(breakdown.monthlyMinus4w)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            Difference
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {safeToFixed(breakdown.monthlyMinus4wPct * 100, 2)}%
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-700">
                            12 monthly payments
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-950">
                            {fmt(breakdown.annualFromMonthly12)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-700">
                        A 4-week period is 28 days. An average month is about
                        30.42 days.
                      </p>
                    </div>
                  </div>
                </>
              )}


              </div></div>

            <Assumptions />

          </div>
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
          / Monthly to Daily Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-700">
          These answers explain monthly-to-daily rent conversion and why a
          30-day shortcut can differ.
        </p>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 leading-relaxed text-slate-700">
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
