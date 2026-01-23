import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/daily-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Daily to Monthly Rent Converter (365-day basis)";
  const description =
    "Convert a daily rent price into a monthly equivalent using a 365-day year (annual equivalence). Decimal-safe input, full breakdown, 30-day vs average-month context, CSV export, and print-to-PDF.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "daily to monthly rent converter, daily rent to monthly equivalent, rent per day to monthly, convert daily rent into monthly, daily rate rent monthly, 28 day rent vs monthly, 4 week vs monthly rent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://rentconverter.com/daily-to-monthly-rent" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

    { rel: "canonical", href: "https://rentconverter.com/daily-to-monthly-rent" },
  ];
};

type Period = "hourly" | "daily" | "weekly" | "biweekly" | "every_4_weeks" | "monthly" | "annual";

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly (7 days)",
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
  annual: "Annual",
};

// Internal link whitelist (keep this conservative to avoid linking to non-existent routes)
const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/rent-converter",
  "/rent-affordability-calculator",
  "/rent-paid-every-4-weeks",
  "/weekly-to-monthly-rent",
  "/monthly-to-weekly-rent",
  "/biweekly-to-monthly-rent",
  "/biweekly-to-weekly-rent",
  "/biweekly-to-annual-rent",
  "/daily-to-monthly-rent",
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

/** Decimal-safe fixed-point (up to 12 decimals) */
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

function formatCurrencyFromScaled(scaled: bigint, currency: Currency, displayDecimals: number): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: Math.max(0, Math.min(12, displayDecimals)),
    minimumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

/**
 * Parses:
 * - $1,234.56
 * - 1234.56
 * - 1234,56 (comma decimal)
 * - .5 / 12.
 * Avoids silently returning 0 on invalid/ambiguous inputs.
 */
function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a daily rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) return { ok: false, error: "Enter a valid number (example: 70 or 70.50).", warnings };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return { ok: false, error: "Enter a valid number (misplaced minus sign).", warnings };
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
          `Interpreted "${s0}" as thousands grouping (1234). If you meant a decimal, use a dot like "1.234".`,
        );
      } else {
        return {
          ok: false,
          error: 'That format is ambiguous. Try "1234.56" or "1,234.56" or "1234,56" (comma decimal).',
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
    if (split.length > 2) return { ok: false, error: "Enter a valid number (too many decimal separators).", warnings };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart)) return { ok: false, error: "Enter a valid number (invalid digits).", warnings };
  if (fracPart && !/^\d+$/.test(fracPart)) return { ok: false, error: "Enter a valid number (invalid decimals).", warnings };

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped = fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled = BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxRent = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxRent);
  if (clamped !== scaled) warnings.push("Value was clamped to the supported maximum for safety.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivScaled(valueScaled: bigint, mulNum: bigint, divDen: bigint): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

function dailyToPeriodScaled(dailyScaled: bigint, period: Period): bigint {
  switch (period) {
    case "daily":
      return dailyScaled;
    case "hourly":
      return mulDivScaled(dailyScaled, 1n, 24n);
    case "weekly":
      return mulDivScaled(dailyScaled, 7n, 1n);
    case "biweekly":
      return mulDivScaled(dailyScaled, 14n, 1n);
    case "every_4_weeks":
      return mulDivScaled(dailyScaled, 28n, 1n);
    case "annual":
      return mulDivScaled(dailyScaled, 365n, 1n);
    case "monthly":
      return mulDivScaled(dailyScaled, 365n, 12n);
    default:
      return dailyScaled;
  }
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

function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
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

export default function DailyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "70";
    const saved = window.localStorage.getItem("rc_dtm_amount");
    return saved ?? "70";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = window.localStorage.getItem("rc_dtm_currency");
    return saved && isCurrency(saved) ? saved : "CAD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_dtm_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_dtm_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_dtm_amount", amount);
      window.localStorage.setItem("rc_dtm_currency", currency);
      window.localStorage.setItem("rc_dtm_display_decimals", String(displayDecimals));
      window.localStorage.setItem("rc_dtm_round_display", JSON.stringify(roundDisplay));
    } catch {
      // ignore
    }
  }, [amount, currency, displayDecimals, roundDisplay]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedDaily = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const dailyScaled = parsedDaily.ok ? (parsedDaily.scaled as bigint) : 0n;

  const canShowResults = parsedDaily.ok;

  const breakdownScaled = useMemo(() => {
    if (!parsedDaily.ok) return null;

    const hourly = dailyToPeriodScaled(dailyScaled, "hourly");
    const daily = dailyScaled;
    const weekly = dailyToPeriodScaled(dailyScaled, "weekly");
    const biweekly = dailyToPeriodScaled(dailyScaled, "biweekly");
    const every4w = dailyToPeriodScaled(dailyScaled, "every_4_weeks");
    const monthly = dailyToPeriodScaled(dailyScaled, "monthly");
    const annual = dailyToPeriodScaled(dailyScaled, "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    // 30-day month vs average month
    const monthByThirty = mulDivScaled(dailyScaled, 30n, 1n);
    const monthByAverage = monthly; // daily * 365 / 12
    const monthByThirtyDiff = monthByAverage - monthByThirty;

    // Calendar-style illustrative annuals
    const annualFromWeekly52 = weekly * 52n;
    const annualFromMonthly12 = monthly * 12n;

    const pctVsAnnual52 = annualFromWeekly52 === 0n ? 0 : Number(annual - annualFromWeekly52) / Number(annualFromWeekly52);
    const pctVsAnnual12 = annualFromMonthly12 === 0n ? 0 : Number(annual - annualFromMonthly12) / Number(annualFromMonthly12);

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,
      monthlyMinus4w,
      monthlyMinus4wPct,
      monthByThirty,
      monthByAverage,
      monthByThirtyDiff,
      annualFromWeekly52,
      annualFromMonthly12,
      pctVsAnnual52,
      pctVsAnnual12,
    };
  }, [parsedDaily.ok, dailyScaled]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) => formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const monthlyHeadlineScaled = breakdownScaled?.monthly ?? 0n;

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
    if (!canShowResults || !breakdownScaled) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Daily to Monthly Rent Converter"]));
    rows.push(buildCsvRow(["Assumptions", "Year=365 days", "Week=7 days", "Biweekly=14 days", "4-week=28 days", "Month=365 ÷ 12 days (average)"]));
    rows.push(buildCsvRow(["Currency formatting", currency]));
    rows.push(buildCsvRow(["Display", roundDisplay ? `Rounded to ${displayDecimals} decimals for display` : "No display rounding (shows up to 12 decimals)"]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Input (Daily)", fmt(dailyScaled)]));
    rows.push(buildCsvRow(["Headline (Monthly)", fmt(monthlyHeadlineScaled)]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Period", "Amount"]));
    const items: Array<[Period, bigint]> = [
      ["hourly", breakdownScaled.hourly],
      ["daily", breakdownScaled.daily],
      ["weekly", breakdownScaled.weekly],
      ["biweekly", breakdownScaled.biweekly],
      ["every_4_weeks", breakdownScaled.every4w],
      ["monthly", breakdownScaled.monthly],
      ["annual", breakdownScaled.annual],
    ];
    for (const [p, val] of items) rows.push(buildCsvRow([PERIOD_LABEL[p], fmt(val)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["30-day month estimate", fmt(breakdownScaled.monthByThirty)]));
    rows.push(buildCsvRow(["Average month (365 ÷ 12)", fmt(breakdownScaled.monthByAverage)]));
    rows.push(buildCsvRow(["Difference (avg - 30-day)", fmt(breakdownScaled.monthByThirtyDiff)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Monthly minus 4-week", fmt(breakdownScaled.monthlyMinus4w)]));
    rows.push(buildCsvRow(["Monthly vs 4-week difference (%)", formatPercent(breakdownScaled.monthlyMinus4wPct, 2)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Illustrative annual comparisons"]));
    rows.push(buildCsvRow(["Weekly × 52 (annual)", fmt(breakdownScaled.annualFromWeekly52)]));
    rows.push(buildCsvRow(["Monthly × 12 (annual)", fmt(breakdownScaled.annualFromMonthly12)]));
    rows.push(buildCsvRow(["Day-based annual (365-day)", fmt(breakdownScaled.annual)]));
    rows.push(buildCsvRow(["Delta vs weekly×52 (%)", formatPercent(breakdownScaled.pctVsAnnual52, 2)]));
    rows.push(buildCsvRow(["Delta vs monthly×12 (%)", formatPercent(breakdownScaled.pctVsAnnual12, 2)]));

    downloadTextFile("daily-to-monthly-rent.csv", rows.join("\n"), "text/csv;charset=utf-8");
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "If rent is priced per day, what does “monthly rent” mean?",
      a: "It is an estimated monthly equivalent so you can compare a daily rate to typical monthly listings. This page uses consistent year-based assumptions.",
    },
    {
      q: "How is daily rent converted into a monthly equivalent on this page?",
      a: "Daily is converted to an annual total using 365 days, then converted to monthly using an average month length (365 ÷ 12 days).",
    },
    {
      q: "Why not just multiply the daily rate by 30?",
      a: "Thirty days is a common shortcut, but it changes assumptions. Using an average month keeps the conversion consistent across daily, weekly, 4-week, monthly, and annual equivalents.",
    },
    {
      q: "Why does a 4-week (28-day) amount differ from the monthly equivalent?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days. Different lengths produce different equivalents.",
    },
    {
      q: "Does this match exact totals for short stays?",
      a: "Not necessarily. Short stays often include cleaning fees, taxes, parking, or bundled utilities. Treat the result as a baseline for rate comparison.",
    },
    {
      q: "What assumptions are used for the math?",
      a: "Assumptions: year = 365 days, week = 7 days, biweekly = 14 days, 4-week = 28 days, month = 365 ÷ 12 days (average). Your agreement can differ.",
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rentconverter.com/" },
      { "@type": "ListItem", position: 2, name: "Daily to Monthly Rent Converter", item: "https://rentconverter.com/daily-to-monthly-rent" },
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
    name: "Daily to Monthly Rent Converter",
    description:
      "Convert a daily rent price into a monthly equivalent using a 365-day year (annual equivalence). Decimal-safe input, full breakdown, 30-day vs average-month context, CSV export, and print-to-PDF.",
    url: "https://rentconverter.com/daily-to-monthly-rent",
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
          / Daily to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Daily to Monthly Rent Converter</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Turn a daily rent price into a monthly equivalent you can compare against typical listings. This page uses a year-based method so daily, weekly, 4-week,
          and monthly numbers come from the same assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href={safeHref("/rent-converter")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href={safeHref("/rent-paid-every-4-weeks")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent paid every 4 weeks
          </a>
          <a
            href={safeHref("/rent-affordability-calculator")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Affordability
          </a>
        </div>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Convert a daily rate into a monthly equivalent</h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!canShowResults}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  canShowResults
                    ? "border-slate-200 bg-white text-slate-800 hover:bg-sky-50 hover:border-sky-200"
                    : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                }`}
                aria-disabled={!canShowResults}
              >
                Export CSV
              </button>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Daily rent amount</label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 70 or 70.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedDaily.ok}
                  aria-describedby="rc-amount-help rc-amount-error"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(isCurrency(e.target.value) ? (e.target.value as Currency) : "CAD")}
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

              <p id="rc-amount-help" className="mt-2 text-xs text-slate-500">
                Accepted inputs: $70.50, 70, 70.00, .5, 12., 1250,50 (comma decimal). If an input is ambiguous, the page shows a warning or error instead of a
                misleading result.
              </p>

              {!parsedDaily.ok ? (
                <p id="rc-amount-error" className="mt-2 text-sm font-semibold text-rose-700">
                  {parsedDaily.error}
                </p>
              ) : parsedDaily.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedDaily.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display settings</label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">{PERIOD_LABEL.daily}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">{PERIOD_LABEL.monthly}</div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Rounding (display only)</div>
                    <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={roundDisplay} onChange={(e) => setRoundDisplay(e.target.checked)} className="h-4 w-4" />
                      Round displayed values
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Calculations use up to 12 decimals internally. If enabled, displayed values are rounded to your chosen decimals.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500">Displayed decimals</div>
                    <select
                      value={displayDecimals}
                      onChange={(e) => setDisplayDecimals(Math.max(0, Math.min(6, Math.trunc(Number(e.target.value) || 2))))}
                      className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      aria-label="Displayed decimals"
                    >
                      <option value={0}>0</option>
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold">What this represents</div>
                  <p className="mt-1 text-xs text-slate-600">
                    Monthly here means an average month derived from a 365-day year (365 ÷ 12). It is an equivalence for comparison, not a claim about calendar due
                    dates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            <div className="text-sm text-slate-600">Monthly equivalent</div>

            {!canShowResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">Enter a valid daily amount above to see the monthly equivalent and breakdown.</p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">{fmt(monthlyHeadlineScaled)}</div>
                  <div className="text-sm text-slate-600">
                    {fmt(dailyScaled)} daily ≈ <strong>{fmt(monthlyHeadlineScaled)}</strong> monthly (average, 365 ÷ 12)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy("monthly", fmt(monthlyHeadlineScaled))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "monthly" ? "Copied" : "Copy monthly amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Daily: ${fmt(dailyScaled)} | Monthly (avg): ${fmt(monthlyHeadlineScaled)} | Assumptions: year=365 days, month=365/12`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? <span className="self-center text-sm font-semibold text-rose-700">Copy failed</span> : null}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {roundDisplay ? (
                      <>Displayed values rounded to {displayDecimals} decimals. Calculations use up to 12 decimals internally.</>
                    ) : (
                      <>Displayed values show up to 12 decimals (no display rounding).</>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily", breakdownScaled!.daily, "daily"],
                      ["Weekly (7 days)", breakdownScaled!.weekly, "weekly"],
                      ["Every 2 weeks (14 days)", breakdownScaled!.biweekly, "biweekly"],
                      ["Every 4 weeks (28 days)", breakdownScaled!.every4w, "every_4_weeks"],
                      ["Monthly (average, 365 ÷ 12)", breakdownScaled!.monthly, "monthly"],
                      ["Annual", breakdownScaled!.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div key={key} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">{fmt(val)}</div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">30-day month vs average month</div>
                    <div className="mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        30-day month estimate: <strong className="text-slate-900">{fmt(breakdownScaled!.monthByThirty)}</strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Average month (365 ÷ 12): <strong className="text-slate-900">{fmt(breakdownScaled!.monthByAverage)}</strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference: <strong className="text-slate-900">{fmt(breakdownScaled!.monthByThirtyDiff)}</strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      This page uses the average month so daily, weekly, monthly, and annual equivalents stay consistent under one framework.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">4-week (28-day) vs monthly comparison</div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week amount: <strong className="text-slate-900">{fmt(breakdownScaled!.monthlyMinus4w)}</strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference: <strong className="text-slate-900">{formatPercent(breakdownScaled!.monthlyMinus4wPct, 2)}</strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Different lengths produce different equivalents.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Annual framing (illustrative)</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Weekly × 52</div>
                        <div className="mt-1 text-sm font-bold text-slate-800">{fmt(breakdownScaled!.annualFromWeekly52)}</div>
                        <div className="mt-1 text-xs text-slate-500">Delta vs day-based: {formatPercent(breakdownScaled!.pctVsAnnual52, 2)}</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Monthly × 12</div>
                        <div className="mt-1 text-sm font-bold text-slate-800">{fmt(breakdownScaled!.annualFromMonthly12)}</div>
                        <div className="mt-1 text-xs text-slate-500">Delta vs day-based: {formatPercent(breakdownScaled!.pctVsAnnual12, 2)}</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Annual (day-based, 365-day)</div>
                        <div className="mt-1 text-sm font-bold text-slate-800">{fmt(breakdownScaled!.annual)}</div>
                        <div className="mt-1 text-xs text-slate-500">Source of truth for equivalence on this page</div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      These comparisons show how calendar-style counts (52 weeks, 12 months) relate to day-based equivalence (365 days). Your billing rules can differ.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: year = 365 days, week = 7 days, biweekly = 14 days, 4-week = 28 days, month = 365 ÷ 12 days (average). Exact billing depends on the agreement.
          </p>
        </div>
      </section>

      {/* Required: explanation above FAQ */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 pt-16 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">How it works</h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>You enter a daily rent amount.</strong> Daily is treated as the base unit.
            </li>
            <li>
              <strong>The page converts to annual first.</strong> Annual = daily × 365.
            </li>
            <li>
              <strong>Monthly is derived from annual.</strong> Monthly = annual ÷ 12 (average month length of 365 ÷ 12 days).
            </li>
            <li>
              <strong>Other periods share the same base.</strong> Weekly = daily × 7, 4-week = daily × 28, biweekly = daily × 14, hourly = daily ÷ 24.
            </li>
            <li>
              <strong>Decimals are preserved.</strong> Input is parsed into fixed-point integers (up to 12 decimals). If an input is ambiguous, you see a warning or an
              error instead of a misleading result.
            </li>
            <li>
              <strong>Export and printing.</strong> You can export the breakdown to CSV and print the page to save as a PDF.
            </li>
          </ol>
        </div>

        <p className="mt-4 text-slate-700">
          Related pages:{" "}
          <a href={safeHref("/rent-converter")} className="text-sky-700 hover:underline">
            rent converter
          </a>{" "}
          and{" "}
          <a href={safeHref("/rent-affordability-calculator")} className="text-sky-700 hover:underline">
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">{f.q}</h3>
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
            Tools on this site are for informational, budgeting, and comparison use. Calculations rely on standard time-period assumptions (including a 365-day year
            and an average month length) and simplified models. Outputs are estimates intended to illustrate equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent, fees, proration, taxes, and obligations vary by location, landlord, and contract
            terms. Review your agreement for the rules that apply to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>Use these calculators for comparisons and budgeting. Confirm your real payment schedule, due dates, and fees in your agreement.</em>
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </main>
  );
}
