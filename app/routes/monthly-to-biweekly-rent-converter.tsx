import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-biweekly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Biweekly Rent Converter";
  const description =
    "Convert monthly rent to a biweekly equivalent using annual equivalence (365-day year). Includes an always-visible breakdown and clear notes on biweekly vs twice-monthly timing.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to biweekly rent, convert monthly rent to biweekly, monthly rent biweekly equivalent, biweekly rent from monthly, monthly to every 2 weeks rent, twice monthly vs biweekly rent, rent converter monthly to biweekly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/monthly-to-biweekly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://rentconverter.com/og-image.jpg",
    },

    {
      rel: "canonical",
      href: "https://rentconverter.com/monthly-to-biweekly-rent-converter",
    },
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

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

// Keep conservative and aligned with your known route set
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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

/**
 * Formatting rules:
 * - preserve decimals end-to-end
 * - rounding is display-only
 * - if rounding enabled: show exactly `displayDecimals` decimals (including trailing zeros)
 * - if rounding disabled: show up to 12 decimals, no forced trailing zeros
 */
function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  maxDecimals: number,
  minDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";
  const max = Math.max(0, Math.min(12, maxDecimals));
  const min = Math.max(0, Math.min(max, minDecimals));
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: max,
    minimumFractionDigits: min,
  }).format(n);
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
    monthly: { num: 365n, den: 12n }, // 365/12
    annual: { num: 365n, den: 1n },
  };

  // toDaily
  let dailyScaled: bigint;
  if (from === "hourly") {
    dailyScaled = mulDivInt(valueScaled, 24n, 1n);
  } else {
    const dp = daysPer[from as Exclude<Period, "hourly">] ?? {
      num: 1n,
      den: 1n,
    };
    // value / (num/den) = value * den / num
    dailyScaled = mulDivInt(valueScaled, dp.den, dp.num);
  }

  // fromDaily
  if (to === "hourly") return mulDivInt(dailyScaled, 1n, 24n);
  const dpTo = daysPer[to as Exclude<Period, "hourly">] ?? { num: 1n, den: 1n };
  return mulDivInt(dailyScaled, dpTo.num, dpTo.den);
}

function buildCsvRow(cols: string[]): string {
  return cols
    .map((c) => {
      const s = String(c ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(",");
}

function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8",
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

export default function MonthlyToBiweeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return window.localStorage.getItem("rc_mtbw_amount") ?? "2000";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_mtbw_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  // Rounding is display-only and labeled
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_mtbw_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_mtbw_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mtbw_amount", amount);
      window.localStorage.setItem("rc_mtbw_currency", currency);
      window.localStorage.setItem(
        "rc_mtbw_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_mtbw_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  const maxDecimals = roundDisplay ? displayDecimals : 12;
  const minDecimals = roundDisplay ? displayDecimals : 0;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, maxDecimals, minDecimals);

  const breakdown = useMemo(() => {
    if (!parsedAmount.ok) return null;

    const monthly = monthlyScaled;

    const biweekly = convertScaled(monthly, "monthly", "biweekly");
    const weekly = convertScaled(monthly, "monthly", "weekly");
    const every4w = convertScaled(monthly, "monthly", "every_4_weeks");
    const daily = convertScaled(monthly, "monthly", "daily");
    const hourly = convertScaled(monthly, "monthly", "hourly");
    const annualEquiv = convertScaled(monthly, "monthly", "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w
      ? Number(monthlyMinus4w) / Number(every4w)
      : 0;

    // Schedule-style totals (context only)
    const annualFromMonthly12 = mulDivInt(monthly, 12n, 1n);
    const annualFromBiweekly26 = mulDivInt(biweekly, 26n, 1n);
    const annualFrom4w13 = mulDivInt(every4w, 13n, 1n);

    // Common confusion: biweekly vs twice-monthly (half-month)
    const monthlyDiv2 = mulDivInt(monthly, 1n, 2n);

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
      annualFromBiweekly26,
      annualFrom4w13,

      monthlyDiv2,
    };
  }, [parsedAmount.ok, monthlyScaled]);

  const canShowResults = parsedAmount.ok && !!breakdown;

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      setCopiedKey("copy_failed");
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    }
  };

  const handleExportCsv = () => {
    if (!canShowResults || !breakdown) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Monthly to Biweekly Rent Converter"]));
    rows.push(buildCsvRow(["Input (monthly)", fmt(monthlyScaled)]));
    rows.push(
      buildCsvRow([
        "Biweekly equivalent (14-day basis)",
        fmt(breakdown.biweekly),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Annual equivalent (365-day basis)",
        fmt(breakdown.annualEquiv),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Month=365 ÷ 12 days",
        "Biweekly=14 days",
        "4-week=28 days",
        "Week=7 days",
      ]),
    );
    rows.push(
      buildCsvRow([
        "Display",
        roundDisplay
          ? `Rounded to ${displayDecimals} decimals for display`
          : "No display rounding (shows up to 12 decimals)",
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Period breakdown", "Amount"]));
    rows.push(buildCsvRow(["Hourly", fmt(breakdown.hourly)]));
    rows.push(buildCsvRow(["Daily", fmt(breakdown.daily)]));
    rows.push(buildCsvRow(["Weekly", fmt(breakdown.weekly)]));
    rows.push(buildCsvRow(["Biweekly (14 days)", fmt(breakdown.biweekly)]));
    rows.push(buildCsvRow(["Every 4 weeks (28 days)", fmt(breakdown.every4w)]));
    rows.push(buildCsvRow(["Monthly (average)", fmt(breakdown.monthly)]));
    rows.push(
      buildCsvRow(["Annual (equivalence)", fmt(breakdown.annualEquiv)]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(
      buildCsvRow(["Schedule comparisons (context)", "Annual total", "Notes"]),
    );
    rows.push(
      buildCsvRow([
        "Monthly × 12 payments",
        fmt(breakdown.annualFromMonthly12),
        "Common shorthand",
      ]),
    );
    rows.push(
      buildCsvRow([
        "Biweekly × 26 payments",
        fmt(breakdown.annualFromBiweekly26),
        "Common schedule framing",
      ]),
    );
    rows.push(
      buildCsvRow([
        "4-week × 13 payments",
        fmt(breakdown.annualFrom4w13),
        "Illustrative 13-payment framing",
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Confusion check", "Value"]));
    rows.push(
      buildCsvRow(["Monthly ÷ 2 (half-month)", fmt(breakdown.monthlyDiv2)]),
    );
    rows.push(
      buildCsvRow(["Biweekly equivalent (14 days)", fmt(breakdown.biweekly)]),
    );

    downloadTextFile(
      "monthly-to-biweekly-rent-converter.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How is monthly rent converted to biweekly rent?",
      a: "This converter uses annual equivalence. It converts a monthly amount to an annual equivalent using an average month length, then expresses that annual amount as a 14-day biweekly equivalent.",
    },
    {
      q: "Is biweekly the same as twice per month?",
      a: "No. Biweekly refers to a 14-day cycle. Twice per month is tied to calendar months. Over a year, these can imply different timing and totals.",
    },
    {
      q: "Why is the biweekly amount not exactly monthly rent ÷ 2?",
      a: "Monthly ÷ 2 is a half-month number. A month is not a fixed number of weeks, so half a month does not reliably equal 14 days. This page shows both so the difference is visible.",
    },
    {
      q: "Why does the page show a 4-week (28-day) value on a monthly converter?",
      a: "Many comparisons mix monthly and 4-week amounts. A 4-week period is 28 days, while an average month is about 30.42 days. Showing both helps illustrate the annual-equivalent difference.",
    },
    {
      q: "How many payment cycles are implied by monthly and biweekly rent?",
      a: "Monthly is commonly described as 12 payments per year. Biweekly is often described as 26 payments per year. This tool also shows a day-based annual equivalence so periods remain comparable across the breakdown.",
    },
    {
      q: "Does this match a lease that bills on specific calendar dates?",
      a: "It estimates equivalents for budgeting and comparison. Exact totals depend on lease terms, start date, proration rules, fees, and what is included in rent.",
    },
    {
      q: "Can the results be used to compare listings across different rent periods?",
      a: "Yes. Converting everything to consistent equivalents can help compare a monthly quote to a biweekly or weekly quote without treating different time windows as the same.",
    },
    {
      q: "What month length does the converter assume?",
      a: "The converter uses an average month length of 365 ÷ 12 days. This keeps conversions consistent across periods, even though actual months vary.",
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
        item: "https://rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Monthly to Biweekly Rent Converter",
        item: "https://rentconverter.com/monthly-to-biweekly-rent-converter",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Monthly to Biweekly Rent Converter",
    description:
      "Convert monthly rent to biweekly rent using annual equivalence. Includes an always-visible breakdown and clear notes on biweekly vs twice-monthly timing.",
    url: "https://rentconverter.com/monthly-to-biweekly-rent-converter",
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

      <section className="pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Monthly to Biweekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Biweekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a monthly rent amount into a biweekly equivalent using annual
          equivalence as the basis. This helps compare a monthly quote with rent
          expressed every two weeks, including pay-cycle style listings.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant monthly to biweekly conversion
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000 or 2000.00"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id="rc-amt-help" className="mt-2 text-xs text-slate-500">
                Accepted inputs: $2,000, 2000.00, 2000, .5, 12., 2000,50 (comma
                decimal). If input is invalid or ambiguous, results are not
                shown.
              </p>

              {!parsedAmount.ok ? (
                <p
                  id="rc-amt-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAmount.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display
              </label>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">
                  Rounding (display only)
                </div>
                <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={roundDisplay}
                    onChange={(e) => setRoundDisplay(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Round displayed values
                </label>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Displayed decimals
                  </div>
                  <select
                    value={displayDecimals}
                    onChange={(e) =>
                      setDisplayDecimals(
                        Math.max(
                          0,
                          Math.min(6, Math.trunc(Number(e.target.value) || 2)),
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
                  >
                    <option value={0}>0</option>
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Calculations preserve decimals internally (up to 12). If
                  rounding is enabled, displayed values keep exactly the
                  selected decimals.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Key distinction</div>
                <p className="mt-1 text-sm text-slate-700">
                  Biweekly means every 14 days. Twice per month is a monthly
                  schedule. This page converts a monthly amount to a 14-day
                  equivalent using the same annual basis as the full breakdown.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            {!canShowResults || !breakdown ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid monthly rent amount to see the biweekly
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600">
                  Biweekly equivalent (14-day basis)
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {fmt(breakdown.biweekly)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(breakdown.monthly)}{" "}
                    {PERIOD_LABEL.monthly.toLowerCase()} ≈{" "}
                    <strong>{fmt(breakdown.biweekly)}</strong>{" "}
                    {PERIOD_LABEL.biweekly.toLowerCase()} using annual
                    equivalence
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("biweekly", fmt(breakdown.biweekly))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "biweekly" ? "Copied" : "Copy biweekly"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Monthly: ${fmt(breakdown.monthly)} | Biweekly: ${fmt(breakdown.biweekly)} | Annual equiv: ${fmt(breakdown.annualEquiv)} | Monthly×12: ${fmt(breakdown.annualFromMonthly12)}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span className="self-center text-sm font-semibold text-rose-700">
                        Copy failed
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdown.hourly, "hourly"],
                      ["Daily", breakdown.daily, "daily"],
                      ["Weekly", breakdown.weekly, "weekly"],
                      [
                        "Every 2 weeks (14 days)",
                        breakdown.biweekly,
                        "biweekly",
                      ],
                      [
                        "Every 4 weeks (28 days)",
                        breakdown.every4w,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", breakdown.monthly, "monthly"],
                      ["Annual (equivalence)", breakdown.annualEquiv, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs 4-week context
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week:{" "}
                        <strong className="text-slate-900">
                          {fmt(breakdown.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900">
                          {(breakdown.monthlyMinus4wPct * 100).toFixed(2)}%
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). These are different periods, so
                      their equivalents can diverge.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Payment-count context (illustrative)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly × 12
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFromMonthly12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common schedule framing
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Biweekly × 26
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFromBiweekly26)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common schedule framing
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          4-week × 13
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFrom4w13)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Illustrative 13-payment framing
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      These are schedule-style multiplications shown for
                      context. The breakdown uses day-based annual equivalence
                      (365-day year, average month length).
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Why monthly ÷ 2 can be misleading
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      Monthly ÷ 2 produces a half-month number, not a 14-day
                      number. This page shows both so the difference is visible.
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly ÷ 2 (half-month)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.monthlyDiv2)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Biweekly equivalent (14 days)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.biweekly)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates and billing terms vary by agreement.
          </p>
        </div>
      </section>

      {/* Required: explanation above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-16 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>You enter a monthly rent amount.</strong> The parser
              supports commas, currency symbols, and formats like .5 and 12.,
              and it avoids showing misleading results on invalid or ambiguous
              input.
            </li>
            <li>
              <strong>The converter uses annual equivalence.</strong> Monthly
              rent is interpreted using an average month length (365 ÷ 12 days),
              then expressed as a 14-day biweekly equivalent on the same 365-day
              basis.
            </li>
            <li>
              <strong>All breakdown values share the same assumptions.</strong>{" "}
              Hourly, daily, weekly, biweekly, 4-week, monthly, and annual are
              derived from the same annual basis so comparisons stay consistent.
            </li>
            <li>
              <strong>Schedule-style totals are shown separately.</strong>{" "}
              Monthly × 12 and biweekly × 26 are payment schedule illustrations,
              not the equivalence basis.
            </li>
            <li>
              <strong>You can export and print.</strong> Results can be exported
              to CSV, and printing supports save-as-PDF in the browser.
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">What you can expect</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
              <li>Biweekly equivalent for a monthly listing (14-day basis)</li>
              <li>Always-visible breakdown across common billing periods</li>
              <li>
                A clear “biweekly vs twice-monthly” comparison (monthly ÷ 2)
              </li>
              <li>Export to CSV and print to save as PDF</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            payment schedules, proration, fees, and obligations vary by
            location, landlord, and lease terms. Review your rental agreement
            for the rules that apply to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            actual payment schedule, due dates, and proration rules in your
            lease.
          </em>
        </p>
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
