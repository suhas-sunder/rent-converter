import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Hourly to Monthly Rent Converter (Avg Month vs 30 Days)";
  const description =
    "Instantly convert hourly rent into a monthly amount using true annual equivalence (365-day year). Compare average-month vs 30-day math, with exact decimals and a clear period breakdown. Free, private, no signup.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "hourly to monthly rent, convert hourly rent to monthly, hourly rent to monthly calculator, hourly rate to monthly rent equivalent, rent per hour to monthly, monthly equivalent of hourly rent, hour to month rent converter",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/hourly-to-monthly-rent-converter",
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
      href: "https://rentconverter.com/hourly-to-monthly-rent-converter",
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
  daily: "Daily (24 hours)",
  weekly: "Weekly (7 days)",
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
  annual: "Annual",
};

// Internal link whitelist (keep conservative)
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

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function formatGroupedPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;
  const [intPartRaw, fracPart] = s.split(".");
  const intPart = (intPartRaw ?? "0").replace(/^0+(?=\d)/, "") || "0";
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (typeof fracPart === "string" && fracPart.length > 0) {
    return `${groupedInt}.${fracPart}`;
  }
  return groupedInt;
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

  if (!s0) return { ok: false, error: "Enter an hourly amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 2.5 or 2.50).",
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
          `Interpreted "${s0}" as thousands grouping. If you meant a decimal, use a dot like "1.234".`,
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

function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

/**
 * Hourly -> period using day-based equivalence:
 * - daily = hourly * 24
 * - annual = hourly * 24 * 365
 * - monthly = annual / 12
 */
function hourlyToPeriodScaled(hourlyScaled: bigint, period: Period): bigint {
  switch (period) {
    case "hourly":
      return hourlyScaled;
    case "daily":
      return mulDivScaled(hourlyScaled, 24n, 1n);
    case "weekly":
      return mulDivScaled(hourlyScaled, 24n * 7n, 1n);
    case "biweekly":
      return mulDivScaled(hourlyScaled, 24n * 14n, 1n);
    case "every_4_weeks":
      return mulDivScaled(hourlyScaled, 24n * 28n, 1n);
    case "annual":
      return mulDivScaled(hourlyScaled, 24n * 365n, 1n);
    case "monthly":
      return mulDivScaled(hourlyScaled, 24n * 365n, 12n);
    default:
      return hourlyScaled;
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

const ALLOWED_DISPLAY_DECIMALS = new Set<number>([0, 2, 4, 6]);

function parseDisplayDecimalsStrict(raw: string | null): number {
  const n = raw === null ? NaN : Number(raw);
  return Number.isFinite(n) && ALLOWED_DISPLAY_DECIMALS.has(n) ? n : 2;
}

export default function HourlyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2.5";
    return window.localStorage.getItem("rc_htm_amount") ?? "2.5";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_htm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return parseDisplayDecimalsStrict(
      window.localStorage.getItem("rc_htm_display_decimals"),
    );
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_htm_round_display"),
      true,
    );
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const [amountFocused, setAmountFocused] = useState<boolean>(false);
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_htm_amount", amount);
      window.localStorage.setItem("rc_htm_currency", currency);
      window.localStorage.setItem(
        "rc_htm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_htm_round_display",
        JSON.stringify(roundDisplay),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, displayDecimals, roundDisplay]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedHourly = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const hourlyScaled = parsedHourly.ok ? (parsedHourly.scaled as bigint) : 0n;

  const amountPreviewValue = useMemo(() => {
    if (!parsedHourly.ok) return amount;
    const normalized = parsedHourly.normalized ?? "";
    return formatGroupedPreviewFromNormalized(normalized);
  }, [amount, parsedHourly.ok, parsedHourly.normalized]);

  const amountDisplayValue = amountFocused
    ? amount
    : parsedHourly.ok
      ? amountPreviewValue
      : amount;

  const breakdownScaled = useMemo(() => {
    if (!parsedHourly.ok) return null;

    const hourly = hourlyScaled;

    const daily = hourlyToPeriodScaled(hourlyScaled, "daily");
    const weekly = hourlyToPeriodScaled(hourlyScaled, "weekly");
    const biweekly = hourlyToPeriodScaled(hourlyScaled, "biweekly");
    const every4w = hourlyToPeriodScaled(hourlyScaled, "every_4_weeks");
    const monthly = hourlyToPeriodScaled(hourlyScaled, "monthly");
    const annual = hourlyToPeriodScaled(hourlyScaled, "annual");

    // Month-length comparison:
    // 30-day month: hourly * 24 * 30
    // avg month: hourly * 24 * (365/12) which equals annual/12
    const monthly30Day = mulDivScaled(hourlyScaled, 24n * 30n, 1n);
    const monthlyAvg = monthly; // already annual/12
    const monthDelta = monthlyAvg - monthly30Day;
    const monthDeltaPct =
      monthly30Day === 0n ? 0 : Number(monthDelta) / Number(monthly30Day);

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,
      monthly30Day,
      monthlyAvg,
      monthDelta,
      monthDeltaPct,
      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [parsedHourly.ok, hourlyScaled]);

  const canShowResults = parsedHourly.ok && !!breakdownScaled;

  const maxDecimals = roundDisplay ? displayDecimals : 12;
  const minDecimals = roundDisplay ? displayDecimals : 0;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, maxDecimals, minDecimals);

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
      q: "How does this convert hourly rent to monthly rent?",
      a: "It uses annual equivalence. The hourly amount is converted into a daily amount (24 hours per day), then expressed as a monthly equivalent using an average month length based on a 365-day year.",
    },
    {
      q: "Why does this not treat a month as exactly 30 days?",
      a: "A fixed 30-day month is a rough estimate. This converter uses an average month length (365 ÷ 12 days) so the monthly result stays consistent with annual, weekly, and 4-week equivalents.",
    },
    {
      q: "What does an hourly rent number represent in practice?",
      a: "It can represent a time-based rate used for comparison, budgeting, or short-stay pricing. The monthly equivalent here illustrates what that hourly amount would look like when scaled to an average month on the same annual basis.",
    },
    {
      q: "Does this include assumptions about occupancy or usage?",
      a: "No. It applies time-period assumptions only (hours per day, days per year, and average month length). If an hourly rate is only charged for certain hours or days, that is a different structure than this equivalence.",
    },
    {
      q: "How is hourly conversion related to 4-week (28-day) rent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Converting both through annual equivalence helps compare 28-day pricing to monthly pricing without treating 4 weeks as a calendar month.",
    },
    {
      q: "Why can the monthly equivalent look high compared with expectations?",
      a: "Hourly amounts scale quickly when expressed over an average month because a month contains many hours. The full breakdown shows the intermediate daily and weekly equivalents so the scaling is visible.",
    },
    {
      q: "Does this match exact totals for a specific contract or lease?",
      a: "It estimates equivalents for comparison. Real totals depend on contract terms, billing rules, minimum charges, and due dates.",
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
        name: "Hourly to Monthly Rent Converter",
        item: "https://rentconverter.com/hourly-to-monthly-rent-converter",
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
    name: "Hourly to Monthly Rent Converter",
    description:
      "Convert hourly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full period breakdown and a month-length comparison.",
    url: "https://rentconverter.com/hourly-to-monthly-rent-converter",
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
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            Home
          </a>{" "}
          / Hourly to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print flex flex-col w-full justify-center items-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Hourly to Monthly Rent Converter
        </h1>
        <p className="text-slate-700 max-w-5xl text-center  text-lg leading-relaxed">
          Convert an hourly rent amount into a monthly equivalent using annual
          equivalence as the source of truth. This helps compare hourly pricing
          to monthly rent using consistent time-period assumptions.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Instant hourly to monthly conversion
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Hourly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  ref={amountInputRef}
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => {
                    const el = e.currentTarget;
                    const incoming = el.value;
                    const caret = el.selectionStart ?? incoming.length;
                    const before = incoming.slice(0, caret);
                    const commasBefore = (before.match(/,/g) ?? []).length;
                    const cleaned = incoming.replace(/,/g, "");
                    const nextCaret = Math.max(0, caret - commasBefore);
                    setAmount(cleaned);
                    requestAnimationFrame(() => {
                      const node = amountInputRef.current;
                      if (!node) return;
                      if (document.activeElement !== node) return;
                      try {
                        node.setSelectionRange(nextCaret, nextCaret);
                      } catch {
                        // ignore
                      }
                    });
                  }}
                  placeholder="e.g. 2.5 or 2.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                  aria-invalid={!parsedHourly.ok}
                  aria-describedby="rc-hourly-help rc-hourly-error"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedHourly.ok ? (
                <p
                  id="rc-hourly-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {parsedHourly.error}
                </p>
              ) : parsedHourly.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedHourly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Display settings
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl col-span-1 border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-600">From</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
                <div className="rounded-xl sm:col-span-2 border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-600">To</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block border-l-4 border-l-sky-200"
            aria-live="polite"
            role="region"
            aria-label="Monthly equivalent results"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Monthly equivalent
              </div>
            </div>

            {!canShowResults ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Enter a valid hourly amount to see the monthly equivalent and
                  breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="min-h-[3.5rem] sm:min-h-[4rem]">
                    <div className="text-4xl sm:text-5xl font-extrabold text-sky-900 tabular-nums whitespace-nowrap">
                      {fmt(breakdownScaled!.monthly)}
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="tabular-nums whitespace-nowrap">
                      {fmt(breakdownScaled!.hourly)}
                    </span>{" "}
                    hourly ≈{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {fmt(breakdownScaled!.monthly)}
                    </strong>{" "}
                    monthly (average month, 365 ÷ 12)
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed">
                    Implied annual equivalent:{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {fmt(breakdownScaled!.annual)}
                    </strong>{" "}
                    annual (365-day basis)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("monthly", fmt(breakdownScaled!.monthly))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    >
                      {copiedKey === "monthly"
                        ? "Copied"
                        : "Copy monthly amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Hourly: ${fmt(breakdownScaled!.hourly)} | Monthly: ${fmt(breakdownScaled!.monthly)} | Annual: ${fmt(breakdownScaled!.annual)}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
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
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily (24 hours)", breakdownScaled!.daily, "daily"],
                      ["Weekly (7 days)", breakdownScaled!.weekly, "weekly"],
                      [
                        "Every 2 weeks (14 days)",
                        breakdownScaled!.biweekly,
                        "biweekly",
                      ],
                      [
                        "Every 4 weeks (28 days)",
                        breakdownScaled!.every4w,
                        "every_4_weeks",
                      ],
                      [
                        "Monthly (average, 365 ÷ 12)",
                        breakdownScaled!.monthly,
                        "monthly",
                      ],
                      [
                        "Annual (365-day basis)",
                        breakdownScaled!.annual,
                        "annual",
                      ],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="text-xs font-medium text-slate-600">
                        {label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-xs font-medium text-slate-600">
                        Month length comparison (average month vs 30-day month)
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          30-day month estimate
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthly30Day)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Computed as hourly × 24 × 30
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          Average-month equivalence
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthlyAvg)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Uses 365 ÷ 12 days per month
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          Difference
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthDelta)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          ≈ {formatPercent(breakdownScaled!.monthDeltaPct, 2)}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      This page uses the average-month approach so the monthly
                      amount aligns with annual equivalence. A fixed 30-day
                      month is shorter than an average month and can drift.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-xs font-medium text-slate-600">
                        4-week vs monthly context
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Monthly minus 4-week:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Difference:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {formatPercent(breakdownScaled!.monthlyMinus4wPct, 2)}
                        </strong>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). These are different periods, so
                      their equivalents can diverge.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-600 leading-relaxed">
            Assumptions: year = 365 days, day = 24 hours, week = 7 days,
            biweekly = 14 days, 4-week = 28 days, month = 365 ÷ 12 days
            (average). Actual billing depends on the agreement.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-slate-600">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4 accent-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Calculations use up to 12 decimals internally. If enabled,
                displayed values are rounded to your chosen decimals.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-600">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setDisplayDecimals(
                    Number.isFinite(n) && ALLOWED_DISPLAY_DECIMALS.has(n)
                      ? n
                      : 2,
                  );
                }}
                className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                aria-label="Displayed decimals"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800">
            <div className="font-semibold">Math basis</div>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              Monthly = (hourly × 24 × 365) ÷ 12 using a 365-day year and an
              average month length.
            </p>
          </div>
        </div>
      </section>

      {/* Required: explanation above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-800 leading-relaxed">
            <li>
              <strong>You enter an hourly amount.</strong> The page parses the
              input in a decimal-safe way (up to 12 decimals) and flags
              ambiguous formatting.
            </li>
            <li>
              <strong>It converts hourly to annual using time.</strong> Annual =
              hourly × 24 hours/day × 365 days/year.
            </li>
            <li>
              <strong>It converts annual to monthly.</strong> Monthly = annual ÷
              12, which is equivalent to using an average month length (365 ÷ 12
              days).
            </li>
            <li>
              <strong>Breakdowns stay consistent.</strong> Daily, weekly,
              biweekly, 4-week, monthly, and annual values all come from the
              same time assumptions.
            </li>
          </ol>
        </div>

        <p className="mt-4 text-slate-800 leading-relaxed">
          Related pages:{" "}
          <a
            href={safeHref("/rent-converter")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            rent converter
          </a>
          ,{" "}
          <a
            href={safeHref("/daily-to-monthly-rent-converter")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            daily to monthly rent
          </a>
          , and{" "}
          <a
            href={safeHref("/how-much-rent-can-i-afford-calculator")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            fees, proration, taxes, and obligations vary by location, landlord,
            and contract terms. Review your agreement for the rules that apply
            to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            real payment schedule, due dates, and fees in your agreement.
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
