import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-monthly-rent-converter";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

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
      content: "https://www.rentconverter.comhourly-to-monthly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.comog-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.comog-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.comhourly-to-monthly-rent-converter",
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
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  let digits = 12;

  if (roundDisplay) {
    digits = Math.max(0, Math.min(12, displayDecimals));
  } else {
    // Show up to 12 decimals but trim trailing zeros for display.
    const a = absBigInt(scaled);
    const fracPart = a % SCALE;
    if (fracPart === 0n) {
      digits = 0;
    } else {
      const fracFull = fracPart.toString().padStart(12, "0");
      const trimmed = fracFull.replace(/0+$/g, "");
      digits = Math.min(12, Math.max(0, trimmed.length));
    }
  }

  const scaledForDisplay = roundDisplay
    ? roundScaledToDecimals(scaled, digits)
    : scaled;

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    !roundDisplay, // trim only when not rounding to fixed digits
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  // Build by parts so we keep locale currency placement and symbols without using floats for the value.
  const parts = fmt.formatToParts(-1);
  let out = "";
  for (const p of parts) {
    if (p.type === "minusSign") {
      if (negative) out += p.value;
      continue;
    }
    if (p.type === "integer") {
      out += groupedInt;
      continue;
    }
    if (p.type === "group") {
      // We already grouped ourselves.
      continue;
    }
    if (p.type === "decimal") {
      if (digits > 0 && fracStr.length > 0) out += decimal;
      continue;
    }
    if (p.type === "fraction") {
      if (digits > 0 && fracStr.length > 0) out += fracStr;
      continue;
    }
    out += p.value;
  }

  return out || "-";
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
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

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

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
        item: "https://www.rentconverter.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hourly to Monthly Rent Converter",
        item: "https://www.rentconverter.comhourly-to-monthly-rent-converter",
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
    name: "Hourly to Monthly Rent Converter",
    description:
      "Convert hourly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full period breakdown and a month-length comparison.",
    url: "https://www.rentconverter.comhourly-to-monthly-rent-converter",
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

      <section className="mt-4 rc-no-print hidden sm:block">
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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Instant hourly to monthly conversion
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
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
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
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

              <div className="mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.hourly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.monthly}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block border-l-4 border-l-sky-200"
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
                <div className="flex flex-col gap-2">
                  <div className="">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                      {fmt(breakdownScaled!.monthly)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                        "Annual (365-day basis)",
                        breakdownScaled!.annual,
                        "annual",
                      ],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm"
                    >
                      <div className="text-xs font-medium text-slate-600">
                        {label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-sm">
                    <div className="flex items-center gap-2">
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

          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <div className="font-semibold">Assumptions used on this page</div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>Biweekly = 14 days</li>
              <li>4-week rent = 28 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” (fees,
                utilities, taxes). Enter the total you want to budget with.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
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
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                    How the hourly to monthly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts an hourly amount into a monthly
                    equivalent by scaling through a full year. Hourly is treated
                    as a clock-hour rate unless stated otherwise. Monthly is
                    defined as one-twelfth of an annual total derived from that
                    hourly input.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Hourly = base
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Monthly = annual ÷ 12
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Hourly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    EXPAND
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    × 24 × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DIVIDE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    ÷ 12
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUTS
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Full breakdown
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: core path */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    The conversion path used on this page
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The converter treats the hourly input as a rate that
                      applies to every hour in the day. That hourly rate is
                      expanded into a daily amount, then into an annual total.
                      The monthly value is computed by dividing that annual
                      total into twelve equal parts.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>Daily</strong> = hourly × 24
                        </li>
                        <li>
                          <strong>Annual</strong> = daily × 365
                        </li>
                        <li>
                          <strong>Monthly</strong> = annual ÷ 12
                        </li>
                        <li>
                          Combined:{" "}
                          <strong>Monthly = hourly × 24 × 365 ÷ 12</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        Monthly corresponds to an average month length of 365 ÷
                        12 days.
                      </p>
                    </div>

                    <p>
                      This keeps the math reversible. Multiplying the monthly
                      result by twelve returns the same annual total. Dividing
                      the annual total by 365 returns the original daily rate
                      implied by the hourly input.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why hourly needs clarification */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    What “hourly” means in this context
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      An hourly number does not, by itself, describe how many
                      hours apply per day or per year. Without an assumption,
                      there is no single correct monthly equivalent.
                    </p>

                    <p>
                      This page makes the assumption explicit. Hourly is treated
                      as a clock-hour rate that applies to all twenty-four hours
                      of each day. Alternative interpretations, such as
                      paid-hours schedules, are not used as the primary basis
                      here.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Included
                        </div>
                        <p className="mt-2">
                          Hourly applies to every hour in the day.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Not modeled
                        </div>
                        <p className="mt-2">
                          Work schedules or limited paid hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: breakdown */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    How the breakdown stays consistent
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      All period values shown on the page are derived from the
                      same clock-hour assumption. Daily, weekly, biweekly, and
                      4-week lines are computed using fixed day counts. Monthly
                      is derived from the annual total so the year reconciles
                      cleanly.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weekly</strong> = daily × 7
                      </li>
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                      <li>
                        <strong>4-week</strong> = daily × 28
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                    </ul>

                    <p>
                      No value in the breakdown is chained from a rounded
                      intermediate result. Each line reconciles back to the same
                      annual figure implied by the hourly input.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: parsing and precision */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Parsing rules and precision handling
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Hourly inputs are parsed as decimal values. Thousands
                      separators are treated as grouping characters. Currency
                      symbols may be present and are ignored during numeric
                      parsing.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is interpreted as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is interpreted as 1.234
                      </li>
                      <li>
                        Edge formats such as <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>

                    <p>
                      Computation preserves precision internally, up to twelve
                      decimal places. Rounding, if enabled, affects display
                      only. When rounding is disabled, additional decimals
                      remain visible for close comparisons.
                    </p>

                    <p>
                      If an input could reasonably be interpreted in more than
                      one way, the tool shows a warning or error instead of
                      producing a misleading result.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: printing */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Printing and saved copies
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      You can print the page or save it as a PDF using your
                      browser’s print function. This explanation section is
                      marked no-print so it does not appear in exported copies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark callout */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
                </div>

                <div className="relative">
                  <div className="text-sm font-semibold text-sky-300">
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                    Monthly here is an average, not a schedule
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This page produces a monthly equivalent derived from an
                    hourly rate via an annual total. It does not attempt to
                    model billing dates or work schedules. If you need
                    schedule-based assumptions, use a paid-hours or due-date
                    tool instead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
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
