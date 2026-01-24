import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-weekly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Weekly Rent Converter";
  const description =
    "Convert monthly rent to a weekly equivalent using annual equivalence (365-day year and average month length). Includes full period breakdowns and a monthly vs 28-day (4-week) comparison.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to weekly rent, monthly rent to weekly, rent converter monthly to weekly, convert monthly rent to weekly, weekly equivalent of monthly rent, rent per week from monthly, monthly vs 4 week rent, 28 day rent vs monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/monthly-to-weekly-rent-converter",
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
      href: "https://rentconverter.com/monthly-to-weekly-rent-converter",
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
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: roundDisplay ? displayDecimals : 0,
    maximumFractionDigits: roundDisplay ? displayDecimals : 12,
  }).format(n);
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

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_mtw_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_mtw_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    const t = Math.trunc(n);
    return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mtw_amount", amount);
      window.localStorage.setItem("rc_mtw_currency", currency);
      window.localStorage.setItem(
        "rc_mtw_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_mtw_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

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

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How is monthly rent converted to weekly rent on this page?",
      a: "It uses annual equivalence. Monthly is treated as an average month (365 ÷ 12 days), converted to an annual basis, then expressed as a weekly amount (7-day weeks) on the same annual basis.",
    },
    {
      q: "Why not just divide monthly rent by 4 to get weekly?",
      a: "Dividing by 4 assumes a month is exactly 4 weeks (28 days). An average month is about 30.42 days (365 ÷ 12), so the annual totals do not line up with that shortcut.",
    },
    {
      q: "What does “weekly equivalent” mean if my lease is monthly?",
      a: "It is a comparison number. It helps compare listings across rent periods but does not change how rent is billed under a monthly lease.",
    },
    {
      q: "How is every 4 weeks (28 days) different from monthly?",
      a: "A 4-week period is 28 days. Over a year, 4-week billing can imply 13 periods, while monthly billing is typically described as 12 payments. Different period lengths can create different annual totals.",
    },
    {
      q: "Will this match exact charges on specific due dates?",
      a: "It estimates equivalents for budgeting and comparison. Exact billing depends on the lease terms, start date, prorations, fees, and due date rules.",
    },
    {
      q: "Does the conversion change by country?",
      a: "The math stays the same. What changes is how rent is commonly advertised (for example weekly in some countries vs per calendar month in others).",
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
        name: "Monthly to Weekly Rent Converter",
        item: "https://rentconverter.com/monthly-to-weekly-rent-converter",
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
    name: "Monthly to Weekly Rent Converter",
    description:
      "Convert monthly rent to a weekly equivalent using annual equivalence (365-day year and average month length). Includes period breakdowns and 4-week (28-day) comparisons.",
    url: "https://rentconverter.com/monthly-to-weekly-rent-converter",
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
          / Monthly to Weekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Weekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Convert monthly rent into a weekly equivalent using annual
          equivalence. This helps compare a monthly-advertised listing against
          weekly-advertised listings using consistent annual totals.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Instant monthly to weekly conversion
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
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
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
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
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
                  Enter a valid monthly rent amount to see the weekly equivalent
                  and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600">
                  Weekly equivalent (365-day basis)
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800 tabular-nums tracking-tight">
                    {fmt(breakdown.weekly)}
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <span className="tabular-nums">
                      {fmt(breakdown.monthly)}
                    </span>{" "}
                    {PERIOD_LABEL.monthly.toLowerCase()} is approximately{" "}
                    <strong className="tabular-nums">
                      {fmt(breakdown.weekly)}
                    </strong>{" "}
                    {PERIOD_LABEL.weekly.toLowerCase()} using annual equivalence
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("weekly", fmt(breakdown.weekly))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {copiedKey === "weekly" ? "Copied" : "Copy weekly"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Monthly: ${fmt(breakdown.monthly)} | Weekly: ${fmt(
                            breakdown.weekly,
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
                      Monthly vs 4-week (28-day) comparison
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
                      30.42 days (365 ÷ 12). Different periods can produce
                      different annual totals.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Annual payment-count context (illustrative)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly × 12
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.annualFromMonthly12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common schedule count (12 payments)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Weekly × 52
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.annualFromWeekly52)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Calendar week count (52 weeks)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          4-week × 13
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800 tabular-nums">
                          {fmt(breakdown.annualFrom4w13)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Calendar cycle count (13 payments)
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                      This illustrates how common schedule counts relate to
                      annual totals. The breakdown itself uses a day-based
                      annual equivalence (365-day year) so periods remain
                      comparable.
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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
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
            <div className="text-xs text-slate-500">Displayed decimals</div>
            <select
              value={displayDecimals}
              onChange={(e) => {
                const n = Math.trunc(Number(e.target.value));
                setDisplayDecimals(
                  n === 0 || n === 2 || n === 4 || n === 6 ? n : 2,
                );
              }}
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
            Calculations preserve decimals internally (up to 12). If rounding is
            enabled, only the displayed values are rounded.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
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
              converted through a 365-day year, then expressed as a weekly
              equivalent using 7-day weeks.
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
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">What you can do</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600 leading-relaxed">
              <li>
                Compare weekly-advertised and monthly-advertised listings on a
                consistent annual basis
              </li>
              <li>
                Use the monthly vs 4-week section to avoid treating 28 days and
                a month as the same
              </li>
              <li>
                Copy key figures (weekly, summary) for sharing or documentation
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Monthly rent expressed as a weekly equivalent
        </h2>

        <p className="text-slate-700 mb-4 leading-relaxed">
          A monthly rent figure is usually tied to calendar months in a lease,
          while weekly pricing is tied to 7-day periods. Converting monthly to
          weekly is a way to express the same overall cost in a different time
          unit so comparisons are easier.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why 4-week (28-day) billing creates confusion
        </h3>
        <p className="text-slate-700 mb-4 leading-relaxed">
          A 4-week period is 28 days, not a month. Many 4-week schedules imply
          13 periods in a year, while monthly schedules imply 12 payments per
          year. That mismatch is why monthly and every-4-weeks can produce
          different annual totals.
        </p>

        <p className="text-slate-700 mb-4 leading-relaxed">
          Related pages:{" "}
          <a
            href={safeHref("/weekly-to-monthly-rent-converter")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            weekly to monthly rent
          </a>
          ,{" "}
          <a
            href={safeHref("/rent-paid-every-4-weeks-calculator")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            rent paid every 4 weeks
          </a>
          , and{" "}
          <a
            href={safeHref("/how-much-rent-can-i-afford-calculator")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            how much rent can I afford
          </a>
          .
        </p>
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
