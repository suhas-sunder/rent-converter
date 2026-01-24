import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/weekly-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Monthly Rent Converter" },
  {
    name: "description",
    content:
      "Convert weekly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown, a 4-week (28-day) comparison, export to CSV, and print-to-PDF.",
  },
  {
    name: "keywords",
    content:
      "weekly to monthly rent, weekly rent to monthly, rent converter weekly to monthly, convert weekly rent to monthly, weekly to monthly rent calculator, 4 week rent vs monthly, 28 day rent vs monthly",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Weekly to Monthly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert weekly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown and a 4-week (28-day) comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/weekly-to-monthly-rent-converter",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Monthly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert weekly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown and a 4-week (28-day) comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/weekly-to-monthly-rent-converter",
  },
];

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
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
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

/**
 * Internal link whitelist.
 * Only keep routes you know exist in your app.
 * Unknown routes are forced to "/".
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
  "/rent-affordability-calculator",
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

  // Context pages
  "/rent-paid-weekly-vs-monthly",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

/** Fixed-point: store up to 12 decimals exactly */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
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
  if (!Number.isFinite(n)) return "N/A";
  const digits = Math.max(0, Math.min(12, displayDecimals));
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/**
 * Accepts: $650, 650.00, 1,200, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 650 or 650.00).`,
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: `Enter a valid ${label} (misplaced minus sign).`,
        warnings,
      };
    }
    return { ok: false, error: `${label} must be 0 or greater.`, warnings };
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
    if (split.length > 2)
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };

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

  return { ok: true, scaled: clamped, warnings };
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

/**
 * Annual equivalence with a 365-day year.
 * Weekly is treated as a 7-day block, monthly is 365/12 days on the same annual basis.
 */
function annualizeScaled(valueScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return valueScaled;
    case "monthly":
      return valueScaled * 12n;
    case "every_4_weeks":
      return mulDivRound(valueScaled, 365n, 28n);
    case "biweekly":
      return mulDivRound(valueScaled, 365n, 14n);
    case "weekly":
      return mulDivRound(valueScaled, 365n, 7n);
    case "daily":
      return valueScaled * 365n;
    case "hourly":
      return valueScaled * 24n * 365n;
    default:
      return 0n;
  }
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  switch (to) {
    case "annual":
      return annualScaled;
    case "monthly":
      return mulDivRound(annualScaled, 1n, 12n);
    case "every_4_weeks":
      return mulDivRound(annualScaled, 28n, 365n);
    case "biweekly":
      return mulDivRound(annualScaled, 14n, 365n);
    case "weekly":
      return mulDivRound(annualScaled, 7n, 365n);
    case "daily":
      return mulDivRound(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivRound(annualScaled, 1n, 365n * 24n);
    default:
      return 0n;
  }
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

function safeParseInt(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return Math.max(min, Math.min(max, t));
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

export default function WeeklyToMonthlyRent() {
  const pageName = "Weekly to Monthly Rent Converter";
  const canonicalUrl =
    "https://rentconverter.com/weekly-to-monthly-rent-converter";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    return localStorage.getItem("rc_wtm_amount") ?? "500";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_wtm_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (keeps old key rc_wtm_rounding as fallback)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;

    const newKey = localStorage.getItem("rc_wtm_round_display");
    if (newKey !== null) return safeParseBoolean(newKey, true);

    const oldKey = localStorage.getItem("rc_wtm_rounding");
    if (oldKey !== null) return safeParseBoolean(oldKey, true);

    return true;
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseInt(
      localStorage.getItem("rc_wtm_display_decimals"),
      2,
      0,
      6,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtm_amount", amount);
      localStorage.setItem("rc_wtm_currency", currency);
      localStorage.setItem(
        "rc_wtm_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_wtm_display_decimals", String(displayDecimals));

      // keep legacy key in sync
      localStorage.setItem("rc_wtm_rounding", JSON.stringify(roundDisplay));
    } catch {}
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    // Source of truth: annual equivalence (365-day year)
    const annual = annualizeScaled(weekly, "weekly");

    // Monthly derived from annual (keeps consistent annual basis)
    const monthly = fromAnnualScaled(annual, "monthly");

    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const biweekly = fromAnnualScaled(annual, "biweekly");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? toNumberSafe(monthlyMinus4w) / toNumberSafe(fourWeeks)
        : Number.NaN;

    // Payment-count shortcuts (illustrative)
    const annualFromWeekly52 = weekly * 52n;
    const annualFromMonthly12 = monthly * 12n;

    // 4-week comparison
    const weeklyTimes4 = weekly * 4n;
    const weeklyTimes4Delta = monthly - weeklyTimes4;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      monthly,
      annual,
      hourly,
      daily,
      biweekly,
      every_4_weeks: fourWeeks,
      monthlyMinus4w,
      monthlyMinus4wPct,
      annualFromWeekly52,
      annualFromMonthly12,
      weeklyTimes4,
      weeklyTimes4Delta,
    };
  }, [parsed]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleExportCsv = () => {
    if (!computed.ok) return;

    const rows: string[] = [];
    rows.push(buildCsvRow([pageName]));
    rows.push(buildCsvRow(["URL", canonicalUrl]));
    rows.push(buildCsvRow(["Currency", currency]));
    rows.push(buildCsvRow(["Input weekly amount (as entered)", amount]));
    rows.push(buildCsvRow(["Display rounding enabled", String(roundDisplay)]));
    rows.push(buildCsvRow(["Displayed decimals", String(displayDecimals)]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Primary conversion"]));
    rows.push(buildCsvRow(["Weekly", money(computed.weekly)]));
    rows.push(
      buildCsvRow([
        "Monthly (average, derived from 365-day annual)",
        money(computed.monthly),
      ]),
    );
    rows.push(
      buildCsvRow(["Weekly x 4 (28 days)", money(computed.weeklyTimes4)]),
    );
    rows.push(
      buildCsvRow([
        "Delta (monthly - weekly x 4)",
        money(computed.weeklyTimes4Delta),
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Full breakdown (from annual total)"]));
    rows.push(buildCsvRow(["Period", "Amount"]));
    rows.push(buildCsvRow(["Hourly", money(computed.hourly)]));
    rows.push(buildCsvRow(["Daily", money(computed.daily)]));
    rows.push(buildCsvRow(["Weekly", money(computed.weekly)]));
    rows.push(buildCsvRow(["Every 2 weeks", money(computed.biweekly)]));
    rows.push(
      buildCsvRow(["Every 4 weeks (28 days)", money(computed.every_4_weeks)]),
    );
    rows.push(buildCsvRow(["Monthly (average)", money(computed.monthly)]));
    rows.push(buildCsvRow(["Annual (365-day)", money(computed.annual)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Monthly vs 4-week context"]));
    rows.push(
      buildCsvRow(["Monthly minus 4-week", money(computed.monthlyMinus4w)]),
    );
    rows.push(
      buildCsvRow([
        "Monthly minus 4-week (% of 4-week)",
        Number.isFinite(computed.monthlyMinus4wPct)
          ? (computed.monthlyMinus4wPct * 100).toFixed(6)
          : "",
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Calendar payment-count illustrations"]));
    rows.push(buildCsvRow(["Weekly x 52", money(computed.annualFromWeekly52)]));
    rows.push(
      buildCsvRow(["Monthly x 12", money(computed.annualFromMonthly12)]),
    );

    downloadTextFile(
      "weekly-to-monthly-rent.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  };

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

  const faqData = [
    {
      q: "What is the formula for weekly to monthly rent on this page?",
      a: "This page converts through annual equivalence: weekly is treated as a 7-day amount, converted to an annual total using a 365-day year, then divided by 12 to produce a monthly equivalent.",
    },
    {
      q: "Why does weekly x 4 not match the monthly result?",
      a: "Four weeks is 28 days. An average month is about 30.42 days (365 ÷ 12). Weekly x 4 is closer to a 28-day cycle, not a calendar month average.",
    },
    {
      q: "How is every-4-weeks rent different from monthly rent?",
      a: "Every 4 weeks is 28 days and is commonly associated with 13 periods per year. Monthly billing is 12 periods per year. Even if the per-payment amounts look similar, annual totals can differ.",
    },
    {
      q: "Can weekly rent look cheaper but cost more over a year?",
      a: "Yes. Weekly and monthly quotes can look different even when the annual totals are similar. Converting both to annual totals is the cleanest way to compare.",
    },
    {
      q: "Does this match the exact day rent is due?",
      a: "It is an estimate for budgeting and comparison. Exact totals depend on lease terms, start dates, proration, and how billing periods are defined.",
    },
    {
      q: "Does the math change by country?",
      a: "The conversion math stays the same. What changes is what is commonly advertised (for example, weekly rent in Australia and New Zealand, or monthly rent in Canada and the US).",
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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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
    name: pageName,
    description:
      "Convert weekly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown and a 4-week (28-day) comparison.",
    url: canonicalUrl,
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
          / Weekly to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Weekly to Monthly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert weekly rent into a monthly equivalent using annual equivalence
          (365-day year). This helps compare weekly listings and monthly
          listings using the same annual basis.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Instant weekly to monthly conversion
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Invalid input hides results to avoid misleading 0 outputs.
                Calculations preserve decimals; rounding is display-only.
              </p>
            </div>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!computed.ok}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  computed.ok
                    ? "border-slate-200 bg-white text-slate-800 hover:bg-sky-50 hover:border-sky-200"
                    : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                }`}
                aria-disabled={!computed.ok}
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

          {/* Display controls */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Displayed decimals
                </span>
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
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Internal math is fixed-point up to 12 decimals. This only changes
              what is displayed.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-7">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.ok}
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
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Conversion
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">
                  Interpretation note
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Monthly is derived from a 365-day annual total (then divided
                  by 12). That is why weekly x 4 (28 days) is not the same as
                  monthly.
                </p>
              </div>
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {parsed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {parsed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
                <div className="text-sm text-slate-600">Monthly equivalent</div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {money(computed.monthly)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {money(computed.weekly)} weekly ≈{" "}
                    <strong>{money(computed.monthly)}</strong> monthly
                  </div>
                  <div className="text-xs text-slate-500">
                    Weekly x 4 (28 days):{" "}
                    <strong className="text-slate-800">
                      {money(computed.weeklyTimes4)}
                    </strong>{" "}
                    (delta to monthly:{" "}
                    <strong className="text-slate-800">
                      {money(computed.weeklyTimes4Delta)}
                    </strong>
                    )
                  </div>
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "headline",
                        `Weekly rent: ${money(computed.weekly)} (${currency}) ≈ Monthly: ${money(computed.monthly)} (derived from 365-day annual equivalence).`,
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                  >
                    {copiedKey === "headline" ? "Copied" : "Copy result"}
                  </button>
                  {copiedKey === "copy_failed" ? (
                    <span className="self-center text-sm font-semibold text-rose-700">
                      Copy failed
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourly, "hourly"],
                      ["Daily", computed.daily, "daily"],
                      ["Weekly", computed.weekly, "weekly"],
                      ["Every 2 weeks", computed.biweekly, "biweekly"],
                      [
                        "Every 4 weeks (28 days)",
                        computed.every_4_weeks,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", computed.monthly, "monthly"],
                      ["Annual", computed.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      4-week (28-day) vs monthly comparison
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week ={" "}
                        <strong className="text-slate-900">
                          {money(computed.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {Number.isFinite(computed.monthlyMinus4wPct)
                            ? (computed.monthlyMinus4wPct * 100).toFixed(2)
                            : "N/A"}
                          %
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Monthly uses an average month (365 ÷ 12). A 4-week period
                      is 28 days. That gap changes annual totals.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Calendar payment-count illustrations
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Weekly x 52
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annualFromWeekly52)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common shortcut (52 payments)
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly x 12
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annualFromMonthly12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common shortcut (12 payments)
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Annual (day-based)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annual)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          365-day annual equivalence
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      The main conversion on this page uses day-based annual
                      equivalence. Payment-count shortcuts are shown for context
                      only.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500 rc-print-block">
                Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14
                days, 4-week = 28 days, month = 365 ÷ 12 days (average). Actual
                due dates vary by lease.
              </p>
            </>
          ) : null}
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700 mb-4">
            Enter a weekly rent amount and choose a currency for formatting. The
            calculator converts your weekly amount into an annual total using a
            365-day year, then divides by 12 to produce a monthly equivalent.
          </p>

          <p className="text-slate-700 mb-4">
            The breakdown (daily, biweekly, 4-week, annual) is derived from the
            same annual total. This keeps period comparisons consistent and
            makes the difference between a calendar month and a 28-day cycle
            visible.
          </p>

          <p className="text-slate-600 text-sm">
            Outputs are estimates for budgeting and comparison. If your lease
            uses a strict payment-count schedule (for example, exactly 52 weekly
            payments), your actual totals can differ from day-based equivalence.
          </p>

          <p className="text-slate-700 mt-6">
            Related pages:{" "}
            <a
              href={safeHref("/rent-paid-weekly-vs-monthly")}
              className="text-sky-700 hover:underline"
            >
              weekly vs monthly rent
            </a>
            ,{" "}
            <a
              href={safeHref("/rent-converter")}
              className="text-sky-700 hover:underline"
            >
              rent converter
            </a>
            , and{" "}
            <a
              href={safeHref("/rent-affordability-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent affordability calculator
            </a>
            .
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
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

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-print-block">
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
