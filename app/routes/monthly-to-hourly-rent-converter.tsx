import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-hourly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Hourly Rent Converter";
  const description =
    "Convert monthly rent to an hourly equivalent using annual equivalence (365-day year and average month length). Includes a full breakdown across periods and a month-length comparison to avoid fixed 30-day assumptions.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to hourly rent, convert monthly rent to hourly, monthly rent to hourly calculator, rent per month to per hour, hourly equivalent of monthly rent, monthly rent hourly rate, month to hour rent converter",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/monthly-to-hourly-rent-converter",
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
      href: "https://rentconverter.com/monthly-to-hourly-rent-converter",
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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: Math.max(0, Math.min(12, displayDecimals)),
    minimumFractionDigits: 0,
  }).format(n);
}

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

export default function MonthlyToHourlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return window.localStorage.getItem("rc_mth_amount") ?? "2000";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_mth_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_mth_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 4;
    const saved = window.localStorage.getItem("rc_mth_display_decimals");
    const n = saved ? Number(saved) : 4;
    if (!Number.isFinite(n)) return 4;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mth_amount", amount);
      window.localStorage.setItem("rc_mth_currency", currency);
      window.localStorage.setItem(
        "rc_mth_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_mth_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const breakdown = useMemo(() => {
    if (!parsedAmount.ok) return null;

    const monthly = monthlyScaled;

    const hourly = convertScaled(monthly, "monthly", "hourly");
    const daily = convertScaled(monthly, "monthly", "daily");
    const weekly = convertScaled(monthly, "monthly", "weekly");
    const biweekly = convertScaled(monthly, "monthly", "biweekly");
    const every4w = convertScaled(monthly, "monthly", "every_4_weeks");
    const annualEquiv = convertScaled(monthly, "monthly", "annual");

    const hourly30Day = mulDivInt(monthly, SCALE, 30n * 24n * SCALE);
    const hourlyAvgMonth = mulDivInt(monthly, 12n, 365n * 24n);
    const hourDelta = hourlyAvgMonth - hourly30Day;

    const pct =
      toNumberSafe(hourly30Day) !== 0
        ? toNumberSafe(hourDelta) / toNumberSafe(hourly30Day)
        : 0;

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w
      ? Number(monthlyMinus4w) / Number(every4w)
      : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annualEquiv,

      hourly30Day,
      hourlyAvgMonth,
      hourDelta,
      hourDeltaPct: pct,

      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [parsedAmount.ok, monthlyScaled]);

  const canShowResults = parsedAmount.ok && !!breakdown;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

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
    rows.push(buildCsvRow(["Monthly to Hourly Rent Converter"]));
    rows.push(buildCsvRow(["Input (monthly)", fmt(monthlyScaled)]));
    rows.push(
      buildCsvRow(["Hourly equivalent (365-day basis)", fmt(breakdown.hourly)]),
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
        "Week=7 days",
        "Biweekly=14 days",
        "4-week=28 days",
        "Day=1",
        "Hour=1/24 day",
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
    rows.push(
      buildCsvRow(["Every 2 weeks (14 days)", fmt(breakdown.biweekly)]),
    );
    rows.push(buildCsvRow(["Every 4 weeks (28 days)", fmt(breakdown.every4w)]));
    rows.push(buildCsvRow(["Monthly (average)", fmt(breakdown.monthly)]));
    rows.push(
      buildCsvRow(["Annual (equivalence)", fmt(breakdown.annualEquiv)]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Month length comparison", "Value"]));
    rows.push(
      buildCsvRow([
        "30-day month estimate (monthly ÷ (30×24))",
        fmt(breakdown.hourly30Day),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Average-month equivalence (uses 365 ÷ 12)",
        fmt(breakdown.hourlyAvgMonth),
      ]),
    );
    rows.push(
      buildCsvRow(["Difference (avg - 30-day)", fmt(breakdown.hourDelta)]),
    );
    rows.push(
      buildCsvRow([
        "Difference percent",
        `${(breakdown.hourDeltaPct * 100).toFixed(2)}%`,
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Monthly vs 4-week", "Value"]));
    rows.push(
      buildCsvRow(["Monthly minus 4-week", fmt(breakdown.monthlyMinus4w)]),
    );
    rows.push(
      buildCsvRow([
        "Difference percent",
        `${(breakdown.monthlyMinus4wPct * 100).toFixed(2)}%`,
      ]),
    );

    downloadTextFile(
      "monthly-to-hourly-rent-converter.csv",
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
      q: "How does this convert monthly rent to an hourly equivalent?",
      a: "It uses annual equivalence. The monthly amount is first expressed on an annual basis using an average month length (365 ÷ 12 days), then converted to an hourly amount using 24 hours per day.",
    },
    {
      q: "Why is the converter not based on a 30-day month?",
      a: "A fixed 30-day month is a rough estimate. This tool uses an average month length so the hourly result stays consistent with annual, weekly, biweekly, and 4-week equivalents on the same basis.",
    },
    {
      q: "What does an hourly rent equivalent mean for a monthly lease?",
      a: "It is a comparison number. It illustrates what the monthly amount represents per hour when expressed through the same annual equivalence assumptions. Billing and due dates remain defined by the lease.",
    },
    {
      q: "Is the hourly number the same as a short-stay hourly charge?",
      a: "Not necessarily. Short stays often include minimum charges, fees, utilities, or different terms. This tool converts the rent amount only, using time-period equivalence.",
    },
    {
      q: "How does monthly compare to rent billed every 4 weeks (28 days)?",
      a: "A 4-week period is 28 days, while an average month is about 30.42 days (365 ÷ 12). These are different periods, so their annual totals and equivalents can differ even when the amounts look similar.",
    },
    {
      q: "Why can the hourly equivalent look small?",
      a: "Monthly rent is spread across many hours in an average month. The breakdown shows daily and weekly equivalents so the scaling from monthly to hourly is transparent.",
    },
    {
      q: "Does this match exact totals for partial months or specific due dates?",
      a: "It estimates equivalents for comparison. Actual totals for partial periods depend on lease terms, prorating rules, and due dates.",
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
        name: "Monthly to Hourly Rent Converter",
        item: "https://rentconverter.com/monthly-to-hourly-rent-converter",
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
    name: "Monthly to Hourly Rent Converter",
    description:
      "Convert monthly rent to an hourly equivalent using annual equivalence (365-day year and average month length). Includes full breakdowns and a month-length comparison.",
    url: "https://rentconverter.com/monthly-to-hourly-rent-converter",
  };

  const amountDescribedBy = parsedAmount.ok
    ? "rc-amt-help"
    : "rc-amt-help rc-amt-error";

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
        <nav
          className="max-w-6xl mx-auto px-6 text-sm text-slate-500"
          aria-label="Breadcrumb"
        >
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            Home
          </a>{" "}
          / Monthly to Hourly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Hourly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Convert a monthly rent amount into an hourly equivalent using annual
          equivalence as the reference. This helps compare monthly prices to
          time-based rates using consistent time-period assumptions.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Instant monthly to hourly conversion
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
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
                  role="alert"
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
                Conversion
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Display</div>
                <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={roundDisplay}
                    onChange={(e) => setRoundDisplay(e.target.checked)}
                    className="h-4 w-4 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                  />
                  Round displayed values (display only)
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
                          Math.min(6, Math.trunc(Number(e.target.value) || 4)),
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                    aria-label="Displayed decimals"
                  >
                    <option value={0}>0</option>
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Calculations preserve decimals internally (up to 12). If
                  rounding is enabled, only the displayed values are rounded.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block min-h-[240px]">
            {!canShowResults || !breakdown ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid monthly rent amount to see the hourly equivalent
                  and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600">
                  Hourly equivalent (365-day basis)
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800 tabular-nums tracking-tight">
                    {fmt(breakdown.hourly)}
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <span className="tabular-nums">
                      {fmt(breakdown.monthly)}
                    </span>{" "}
                    {PERIOD_LABEL.monthly.toLowerCase()} is approximately{" "}
                    <strong className="tabular-nums">
                      {fmt(breakdown.hourly)}
                    </strong>{" "}
                    {PERIOD_LABEL.hourly.toLowerCase()} using annual equivalence
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("hourly", fmt(breakdown.hourly))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {copiedKey === "hourly" ? "Copied" : "Copy hourly"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Monthly: ${fmt(breakdown.monthly)} | Hourly: ${fmt(
                            breakdown.hourly,
                          )} | Annual equiv: ${fmt(breakdown.annualEquiv)}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span
                        className="self-center text-sm font-semibold text-rose-700"
                        role="status"
                        aria-live="polite"
                      >
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
                      <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Month length comparison (average month vs 30-day month)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          30-day month estimate
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.hourly30Day)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Computed as monthly ÷ (30 × 24)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Average-month equivalence
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.hourlyAvgMonth)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Uses (365 ÷ 12) days per month
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Difference</div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.hourDelta)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 tabular-nums">
                          ≈ {(breakdown.hourDeltaPct * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                      This page uses the average-month approach so monthly
                      amounts convert into hourly values that remain consistent
                      with a 365-day annual basis. A fixed 30-day month can
                      shift the hourly equivalent.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs 4-week context
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week amount:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(breakdown.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {(breakdown.monthlyMinus4wPct * 100).toFixed(2)}%
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). These are different periods, so
                      monthly-equivalent comparisons can differ.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500 leading-relaxed">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates vary by lease.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-16 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700 leading-relaxed">
            <li>
              <strong>You enter a monthly rent amount.</strong> The parser
              supports commas, currency symbols, and formats like .5 and 12.,
              and it avoids showing misleading zero results on invalid input.
            </li>
            <li>
              <strong>The converter uses annual equivalence.</strong> Monthly
              rent is interpreted using an average month length (365 ÷ 12 days),
              converted through a 365-day year, then expressed as an hourly
              equivalent using 24 hours per day.
            </li>
            <li>
              <strong>The breakdown stays consistent.</strong> Hourly, daily,
              weekly, biweekly, 4-week, monthly, and annual are derived from the
              same annual basis so you are not mixing assumptions.
            </li>
            <li>
              <strong>Rounding is display-only.</strong> Calculations preserve
              decimals internally (up to 12). If rounding is enabled, only the
              displayed values are rounded.
            </li>
            <li>
              <strong>You can export and print.</strong> Results can be exported
              to CSV, and printing supports save-as-PDF in the browser.
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">What you can do</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600 leading-relaxed">
              <li>
                Compare monthly rent to time-based rates without assuming a
                30-day month
              </li>
              <li>
                Use the month-length comparison to see how big the 30-day
                shortcut error is
              </li>
              <li>Export results for budgeting, sharing, or documentation</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Monthly rent expressed as an hourly equivalent
        </h2>

        <p className="text-slate-700 mb-4 leading-relaxed">
          A monthly rent amount is commonly used for leases and long-term
          rentals, while hourly pricing can appear in short stays or flexible
          arrangements. Converting monthly to hourly can help compare monthly
          rent to time-based rates using a consistent annual basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why annual equivalence matters for monthly-to-hourly conversion
        </h3>
        <p className="text-slate-700 mb-4 leading-relaxed">
          This converter treats annual cost as the reference point. The monthly
          amount is converted through an average month length (365 ÷ 12) and a
          365-day year, then translated into an hourly value. This keeps the
          hourly equivalent aligned with other conversions on the site.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          What the hourly number does and does not mean
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4 leading-relaxed">
          <li>
            The hourly figure is a comparison value derived from the monthly
            amount. It does not change how rent is billed under a lease.
          </li>
          <li>
            Short-stay hourly pricing often includes different rules, fees, or
            minimums. This tool converts the rent amount only.
          </li>
          <li>
            The month-length comparison section shows why using a fixed 30-day
            month can shift the result.
          </li>
        </ul>

        <p className="text-slate-700 mb-4 leading-relaxed">
          Related tools:{" "}
          <a
            href={safeHref("/rent-converter")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            rent converter
          </a>{" "}
          and{" "}
          <a
            href={safeHref("/rent-affordability-calculator")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            rent affordability calculator
          </a>
          .
        </p>
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
              <p className="text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and average month
            length) and simplified models. Results are estimates, not
            guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice.
            Rental costs, affordability, payment schedules, and obligations vary
            by location, landlord, lease terms, and individual circumstances.
            Always review your lease agreement and consult qualified
            professionals before making financial decisions.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
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
