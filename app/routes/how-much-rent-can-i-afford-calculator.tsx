import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/how-much-rent-can-i-afford-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "How Much Rent Can I Afford? (Income-Based Estimator)";
  const description =
    "Estimate rent affordability from income using annual equivalence (365-day year). Compare affordable rent across monthly, weekly, and every-4-weeks, with CSV export and print-to-PDF.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "how much rent can i afford, rent affordability calculator, affordable rent based on income, rent budget calculator, income to rent calculator",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/how-much-rent-can-i-afford",
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
      href: "https://rentconverter.com/how-much-rent-can-i-afford",
    },
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
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

// Keep conservative and aligned with your known route set
const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/rent-converter",
  "/rent-affordability-calculator",
  "/how-much-rent-can-i-afford",
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

function isPeriod(x: string): x is Period {
  return (Object.keys(PERIOD_LABEL) as Period[]).includes(x as Period);
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

  if (!s0) return { ok: false, error: "Enter an income amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 6000 or 6000.00).",
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
    return { ok: false, error: "Income must be 0 or greater.", warnings };
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
 * Annual equivalence:
 * - Convert income (in a period) to annual via daily-equivalence:
 *   daily = (hourly ? v*24 : v / daysPer(period))
 *   annual = daily * 365
 *
 * Using rational math with fixed-point scaling for value.
 */
function annualizeScaled(valueScaled: bigint, period: Period): bigint {
  // days per unit for non-hourly periods
  const daysPer: Record<
    Exclude<Period, "hourly">,
    { num: bigint; den: bigint }
  > = {
    daily: { num: 1n, den: 1n },
    weekly: { num: 7n, den: 1n },
    biweekly: { num: 14n, den: 1n },
    every_4_weeks: { num: 28n, den: 1n },
    monthly: { num: 365n, den: 12n }, // 365/12 days
    annual: { num: 365n, den: 1n },
  };

  if (period === "annual") return valueScaled;

  if (period === "hourly") {
    // annual = hourly * 24 * 365
    return mulDivInt(valueScaled, 24n * 365n, 1n);
  }

  // daily = value / daysPer(period)
  // annual = daily * 365
  const dp = daysPer[period as Exclude<Period, "hourly">] ?? {
    num: 1n,
    den: 1n,
  };
  // value / (num/den) = value * den / num
  const dailyScaled = mulDivInt(valueScaled, dp.den, dp.num);
  return mulDivInt(dailyScaled, 365n, 1n);
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
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

  if (to === "annual") return annualScaled;

  // daily = annual / 365
  const dailyScaled = mulDivInt(annualScaled, 1n, 365n);

  if (to === "hourly") {
    // hourly = daily / 24
    return mulDivInt(dailyScaled, 1n, 24n);
  }

  const dp = daysPer[to as Exclude<Period, "hourly">] ?? { num: 1n, den: 1n };
  // periodValue = daily * (num/den)
  return mulDivInt(dailyScaled, dp.num, dp.den);
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

export default function HowMuchRentCanIAfford() {
  const [income, setIncome] = useState<string>(() => {
    if (typeof window === "undefined") return "6000";
    return window.localStorage.getItem("rc_aff_income") ?? "6000";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = window.localStorage.getItem("rc_aff_period");
    return saved && isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_aff_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_aff_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_aff_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_aff_income", income);
      window.localStorage.setItem("rc_aff_period", period);
      window.localStorage.setItem("rc_aff_currency", currency);
      window.localStorage.setItem(
        "rc_aff_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_aff_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [income, period, currency, roundDisplay, displayDecimals]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedIncome = useMemo(() => parseMoneyInputToScaled(income), [income]);
  const incomeScaled = parsedIncome.ok ? (parsedIncome.scaled as bigint) : 0n;

  const annualIncomeScaled = useMemo(() => {
    if (!parsedIncome.ok) return null;
    return annualizeScaled(incomeScaled, period);
  }, [parsedIncome.ok, incomeScaled, period]);

  const affordability = useMemo(() => {
    if (!annualIncomeScaled) return null;

    // common heuristics: 25%, 30%, 35%
    const ratios = [
      { label: "Conservative", ratio: 0.25 },
      { label: "Common target", ratio: 0.3 },
      { label: "Upper range", ratio: 0.35 },
    ] as const;

    // Use scaled multiplication via integer numerator over 100
    const ratioToNum = (r: number) => BigInt(Math.round(r * 10_000)); // 4dp ratio
    const ratioDen = 10_000n;

    return ratios.map((r) => {
      const annualAffordable = mulDivInt(
        annualIncomeScaled,
        ratioToNum(r.ratio),
        ratioDen,
      );

      return {
        label: r.label,
        ratio: r.ratio,
        annual: annualAffordable,
        monthly: fromAnnualScaled(annualAffordable, "monthly"),
        weekly: fromAnnualScaled(annualAffordable, "weekly"),
        every4w: fromAnnualScaled(annualAffordable, "every_4_weeks"),
      };
    });
  }, [annualIncomeScaled]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

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

  const canShowResults =
    parsedIncome.ok && !!annualIncomeScaled && !!affordability;

  const handleExportCsv = () => {
    if (!canShowResults || !annualIncomeScaled || !affordability) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["How Much Rent Can I Afford?"]));
    rows.push(buildCsvRow(["Input income", fmt(incomeScaled)]));
    rows.push(buildCsvRow(["Income period", PERIOD_LABEL[period]]));
    rows.push(
      buildCsvRow([
        "Annualized income (365-day basis)",
        fmt(annualIncomeScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Month=365 ÷ 12 days",
        "4-week=28 days",
        "Week=7 days",
        "Hourly assumes 24 hours/day when annualized",
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

    rows.push(
      buildCsvRow([
        "Rent share",
        "Label",
        "Monthly",
        "Weekly",
        "Every 4 weeks",
        "Annual",
      ]),
    );
    for (const row of affordability) {
      rows.push(
        buildCsvRow([
          `${Math.round(row.ratio * 100)}%`,
          row.label,
          fmt(row.monthly),
          fmt(row.weekly),
          fmt(row.every4w),
          fmt(row.annual),
        ]),
      );
    }

    downloadTextFile(
      "rent-affordability.csv",
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
      q: "What does this calculator estimate?",
      a: "It estimates rent amounts that correspond to different shares of income using annualized income as the comparison base.",
    },
    {
      q: "Is this telling me what rent I should pay?",
      a: "No. The results illustrate how different rent levels relate to income. Actual affordability depends on many factors beyond income alone.",
    },
    {
      q: "Why does the calculator use annual income?",
      a: "Annualizing income allows pay cycles like monthly, weekly, and every 4 weeks to be compared consistently.",
    },
    {
      q: "Why are multiple percentages shown?",
      a: "Different households tolerate different housing costs. Showing multiple ranges illustrates how rent levels change as income share changes.",
    },
    {
      q: "Does this include utilities or other housing costs?",
      a: "No. This calculator compares rent to income only. Utilities, insurance, parking, debt payments, and other costs can materially change affordability.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, this changes totals.",
    },
    {
      q: "Can this be used with hourly or variable income?",
      a: "It can illustrate estimates, but irregular income can make any fixed-period comparison less representative. Treat results as a starting point.",
    },
    {
      q: "What assumptions are used?",
      a: "Assumptions: 1 year = 365 days and 1 month = 365 ÷ 12 days (average). Actual pay schedules and billing rules vary.",
    },
  ];

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
        name: "How Much Rent Can I Afford?",
        item: "https://rentconverter.com/how-much-rent-can-i-afford",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

      <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500 py-4 rc-no-print">
        <a href={safeHref("/")} className="hover:underline">
          Home
        </a>{" "}
        / How Much Rent Can I Afford?
      </nav>

      <section className="text-center px-6 pb-8 rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          How Much Rent Can I Afford?
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600">
          Estimate rent amounts relative to income using a consistent annual
          comparison. This helps illustrate how rent levels change across pay
          cycles.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="rounded-2xl border border-slate-200 p-6 rc-print-block">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-bold">Income</h2>

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

          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Income amount
              </label>
              <input
                inputMode="decimal"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="e.g. 6000 or 6000.00"
                aria-invalid={!parsedIncome.ok}
                aria-describedby="rc-income-help rc-income-error"
              />
              <p id="rc-income-help" className="mt-2 text-xs text-slate-500">
                Accepted inputs: $6,000, 6000.00, 6000, .5, 12., 6000,50 (comma
                decimal). If input is invalid or ambiguous, results are not
                shown.
              </p>

              {!parsedIncome.ok ? (
                <p
                  id="rc-income-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedIncome.error}
                </p>
              ) : parsedIncome.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedIncome.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Income period
              </label>
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value)
                      ? (e.target.value as Period)
                      : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              >
                {(Object.entries(PERIOD_LABEL) as Array<[Period, string]>).map(
                  ([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ),
                )}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Income is annualized using a 365-day year so different pay
                cycles can be compared consistently.
              </p>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value)
                      ? (e.target.value as Currency)
                      : "USD",
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
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
                  Calculations use up to 12 decimals internally. If rounding is
                  enabled, only the displayed values are rounded.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!canShowResults ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                <div className="font-semibold">No results to show</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid income amount to see affordability estimates.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-500">
                    Annualized income (365-day basis)
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">
                    {fmt(annualIncomeScaled!)}
                  </div>

                  <div className="rc-no-print mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("annualIncome", fmt(annualIncomeScaled!))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "annualIncome"
                        ? "Copied"
                        : "Copy annualized income"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Income: ${fmt(incomeScaled)} (${PERIOD_LABEL[period]}) | Annualized: ${fmt(annualIncomeScaled!)}`,
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

                  <div className="mt-2 text-xs text-slate-500">
                    {roundDisplay ? (
                      <>
                        Displayed values rounded to {displayDecimals} decimals.
                        Calculations use up to 12 decimals internally.
                      </>
                    ) : (
                      <>
                        Displayed values show up to 12 decimals (no display
                        rounding).
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3 rc-print-block">
                  {affordability!.map((row) => (
                    <div
                      key={row.ratio}
                      className="rounded-xl border border-slate-200 p-4 bg-slate-50"
                    >
                      <div className="text-sm text-slate-500">
                        {Math.round(row.ratio * 100)}% of income{" "}
                        <span className="text-slate-400">({row.label})</span>
                      </div>
                      <div className="font-extrabold text-xl text-slate-900 mt-1">
                        {fmt(row.monthly)} / month
                      </div>
                      <div className="text-sm text-slate-700 mt-1">
                        {fmt(row.weekly)} / week
                      </div>
                      <div className="text-sm text-slate-700">
                        {fmt(row.every4w)} / 4 weeks
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Annual rent equivalent: {fmt(row.annual)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
              <strong>Enter your income and the period it is paid.</strong> The
              input parser is decimal-safe and avoids producing misleading
              results on invalid or ambiguous formats.
            </li>
            <li>
              <strong>The calculator annualizes your income.</strong> It
              converts your pay period to a daily equivalent, then scales to an
              annual total using a 365-day year.
            </li>
            <li>
              <strong>It applies common affordability shares.</strong> The page
              shows rent targets at 25%, 30%, and 35% of annual income.
            </li>
            <li>
              <strong>
                It converts those targets back to familiar cycles.
              </strong>{" "}
              Monthly, weekly, and every-4-weeks amounts are derived from the
              same annual basis, so comparisons are consistent.
            </li>
            <li>
              <strong>Export and printing.</strong> You can export your results
              to CSV and print the page to save as a PDF.
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">Assumptions used</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
              <li>Year = 365 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>Week = 7 days</li>
              <li>Every 4 weeks = 28 days</li>
              <li>
                Hourly income annualization assumes 24 hours/day (time-based
                equivalence)
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-slate-700">
          Related pages:{" "}
          <a
            href={safeHref("/rent-converter")}
            className="text-sky-700 hover:underline"
          >
            rent converter
          </a>{" "}
          and{" "}
          <a
            href={safeHref("/rent-affordability-calculator")}
            className="text-sky-700 hover:underline"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 p-6">
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

      <section className="max-w-5xl mx-auto px-6 py-16 rc-no-print" id="faq">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg">{f.q}</h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
