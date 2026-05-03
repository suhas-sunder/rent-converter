import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-weekly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/monthly-to-weekly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/monthly-to-weekly-rent-converter/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Weekly Rent Converter | True Weekly Rent";
  const description =
    "Convert monthly rent to a true weekly amount. Compare PCM rent with weekly, 4-week, annual, daily, and hourly equivalents.";

  const url = "https://www.rentconverter.com/monthly-to-weekly-rent-converter";
  const image = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to weekly rent, convert monthly rent to weekly, weekly rent calculator, monthly rent weekly rate, monthly vs 4 week rent, 28 day rent vs monthly, rent weekly from monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: image },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    { tagName: "link", rel: "canonical", href: url },
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

const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/rent-converter",

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

  "/rent-calculator",
  "/rent-per-day-calculator",
  "/rent-per-week-calculator",
  "/rent-paid-every-4-weeks-calculator",
  "/rent-per-paycheck-calculator",
  "/rent-split-calculator",
  "/rent-due-date-calculator",

  "/rent-as-percentage-of-income-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",

  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",

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

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return { ok: false, error: "Enter a monthly rent amount.", warnings };

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
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart)) {
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };
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
    warnings.push("Value was clamped to the supported maximum for safety.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivInt(value: bigint, mul: bigint, div: bigint): bigint {
  if (div === 0n) return 0n;
  return (value * mul) / div;
}

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

function formatAmountPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;

  const dotIdx = s.indexOf(".");
  const intPart = dotIdx === -1 ? s : s.slice(0, dotIdx);
  const fracPart = dotIdx === -1 ? "" : s.slice(dotIdx + 1);

  if (!/^\d+$/.test(intPart)) return s;
  if (fracPart && !/^\d+$/.test(fracPart)) return s;

  const groupedInt = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(intPart));

  return fracPart.length ? `${groupedInt}.${fracPart}` : groupedInt;
}

export default function MonthlyToWeeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return window.localStorage.getItem("rc_mtw_amount") ?? "2000";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_mtw_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mtw_amount", amount);
      window.localStorage.setItem("rc_mtw_currency", currency);
    } catch {
      // ignore
    }
  }, [amount, currency]);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const breakdown = useMemo(() => {
    if (!parsedAmount.ok) return null;

    const monthly = monthlyScaled;

    const weekly = convertScaled(monthly, "monthly", "weekly");
    const biweekly = convertScaled(monthly, "monthly", "biweekly");
    const every4w = convertScaled(monthly, "monthly", "every_4_weeks");
    const daily = convertScaled(monthly, "monthly", "daily");
    const hourly = convertScaled(monthly, "monthly", "hourly");
    const annualEquiv = convertScaled(monthly, "monthly", "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w
      ? Number(monthlyMinus4w) / Number(every4w)
      : 0;

    const annualFromMonthly12 = monthly * 12n;
    const annualFromWeekly52 = weekly * 52n;
    const annualFrom4w13 = every4w * 13n;

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
      annualFrom4w13,
    };
  }, [parsedAmount.ok, monthlyScaled]);

  const canShowResults = parsedAmount.ok && !!breakdown;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do you convert monthly rent to weekly rent?",
      a: "This calculator uses the sitewide 365-day model. It multiplies monthly rent by 12, then converts that annual amount into a 7-day weekly equivalent.",
    },
    {
      q: "What formula does the monthly to weekly rent converter use?",
      a: "The main formula is monthly rent × 12 × 7 ÷ 365. For example, $2,000 per month is about $460.27 per week before display rounding.",
    },
    {
      q: "Why not divide monthly rent by 4?",
      a: "Dividing by 4 assumes every month is exactly 4 weeks, or 28 days. An average month is about 30.42 days, so that shortcut understates the weekly amount.",
    },
    {
      q: "What does the weekly amount mean if my lease is monthly?",
      a: "It is a comparison amount only. It helps compare rent across different listing formats, but your lease still controls how and when rent is paid.",
    },
    {
      q: "How is every 4 weeks different from monthly rent?",
      a: "Every 4 weeks means 13 payment periods in a 52-week year. Monthly rent usually means 12 payments per year, so the annual totals are not the same.",
    },
    {
      q: "Will this match exact charges on specific due dates?",
      a: "No. Exact billing can depend on lease terms, start dates, proration rules, fees, and due-date policies. This page is for time-period comparison.",
    },
    {
      q: "Does the conversion change by country?",
      a: "The math is the same. What changes is how rent is commonly advertised, such as weekly, monthly, or per calendar month.",
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Monthly to Weekly Rent Converter",
        item: "https://www.rentconverter.com/monthly-to-weekly-rent-converter",
      },
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
    name: "Monthly to Weekly Rent Converter",
    description:
      "Convert monthly rent to a weekly amount using the 365-day model. Includes related rent breakdowns and a 4-week comparison.",
    url: "https://www.rentconverter.com/monthly-to-weekly-rent-converter",
  };

  const amountDescribedBy = parsedAmount.ok
    ? "rc-amt-help"
    : "rc-amt-help rc-amt-error";

  const amountDisplayValue = useMemo(() => {
    if (isAmountFocused) return amount;
    if (!parsedAmount.ok) return amount;
    const normalized = parsedAmount.normalized ?? "";
    return formatAmountPreviewFromNormalized(normalized);
  }, [amount, isAmountFocused, parsedAmount.ok, parsedAmount.normalized]);

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
        className="mx-auto max-w-6xl px-6 pb-6 pt-4 sm:pt-6"
      >
        <div className="rounded-[1.75rem] bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  Monthly to weekly rent
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Monthly to Weekly Rent Converter
                </h1>

                <p className="mt-2 max-w-6xl text-base leading-relaxed text-slate-700">
                  Convert monthly rent into a weekly amount. The calculator also
                  shows hourly, daily, 4-week, and annual breakdowns for
                  comparison.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 flex-wrap gap-2 sm:justify-end"
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

            <div className="mt-2 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Monthly rent amount
                </label>

                <div className="flex gap-2">
                  <input
                    inputMode="decimal"
                    value={amountDisplayValue}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                    placeholder="e.g. 2000 or 2000.00"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg leading-6 text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={!parsedAmount.ok}
                    aria-describedby={amountDescribedBy}
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
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-amt-help" className="mt-2 text-sm text-slate-700">
                  Enter the monthly rent amount before fees or deposits.
                </p>

                {!parsedAmount.ok ? (
                  <p
                    id="rc-amt-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {parsedAmount.error}
                  </p>
                ) : parsedAmount.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedAmount.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block">
              <div
                className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400"
                aria-hidden="true"
              />

              <div className="p-5 sm:px-6">
                {!canShowResults || !breakdown ? (
                  <div className="rounded-2xl bg-white p-4">
                    <div className="font-semibold text-slate-950">
                      No results to show
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Enter a valid monthly rent amount to see the weekly result
                      and breakdown.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-sm font-semibold text-slate-950">
                        Weekly rent amount
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <div className="tabular-nums text-3xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">
                        {fmt(breakdown.weekly)}
                      </div>
                      <p className="text-sm text-slate-700">
                        Based on monthly rent × 12 × 7 ÷ 365.
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(
                        [
                          ["Hourly", breakdown.hourly, "hourly"],
                          ["Daily", breakdown.daily, "daily"],
                          ["2 weeks (14 days)", breakdown.biweekly, "biweekly"],
                          [
                            "4 weeks (28 days)",
                            breakdown.every4w,
                            "every_4_weeks",
                          ],
                          ["Monthly (average)", breakdown.monthly, "monthly"],
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
                          <div className="mt-1 tabular-nums text-lg font-bold text-slate-950">
                            {fmt(val)}
                          </div>
                        </div>
                      ))}

                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 sm:col-span-2 lg:col-span-3 rc-print-block">
                        <div className="text-xs font-medium text-slate-700">
                          Monthly vs 4-week comparison
                        </div>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-slate-700">
                            Monthly minus 4-week amount:{" "}
                            <strong className="tabular-nums text-slate-950">
                              {fmt(breakdown.monthlyMinus4w)}
                            </strong>
                          </div>
                          <div className="text-sm text-slate-700">
                            Difference:{" "}
                            <strong className="tabular-nums text-slate-950">
                              {safeToFixed(
                                breakdown.monthlyMinus4wPct * 100,
                                2,
                              )}
                              %
                            </strong>
                          </div>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-700">
                          A 4-week period is 28 days. An average month is about
                          30.42 days.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Assumptions />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="rc-no-print mb-4 flex flex-col gap-2 md:hidden sm:flex-row">
            <button
              type="button"
              onClick={handlePrint}
              className="rc-print-button"
            >
              Print / Save as PDF
            </button>
          </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Calculations preserve precision internally, while displayed money values are rounded to cents.
              </p>
        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav

          aria-label="Breadcrumb"
         className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / Monthly to Weekly Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-8">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-slate-200">
            {faqData.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
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
