import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/daily-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Daily to Monthly Rent Converter (30-Day vs Avg Month)";
  const description =
    "Instantly convert a daily rent price into a monthly amount using a true 365-day year. Compare 30-day months vs average-month math, with exact decimals, a full breakdown, and print-to-PDF. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "daily to monthly rent converter, daily rent to monthly equivalent, rent per day to monthly, convert daily rent into monthly, daily rate rent monthly, 30 day rent vs monthly, average month rent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/daily-to-monthly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.com/daily-to-monthly-rent-converter",
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
  weekly: "Weekly (7 days)",
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
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

function formatCurrencyFromScaledFlexible(
  scaled: bigint,
  currency: Currency,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 12,
  }).format(n);
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a daily rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 70 or 70.50).",
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
          `Interpreted "${s0}" as thousands grouping (1234). If you meant a decimal, use a dot like "1.234".`,
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

  const maxRent = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxRent);
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

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
}

function readDisplayDecimalsStrict(saved: string | null): number {
  const allowed = new Set<number>([0, 2, 4, 6]);
  const n = saved === null ? 2 : Number(saved);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : 2;
}

function formatPreviewFromNormalizedEnUS(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;
  const [intPartRaw, fracPart] = s.split(".", 2);
  const intPart = (intPartRaw ?? "0").replace(/^0+(?=\d)/, "") || "0";
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fracPart !== undefined && fracPart.length > 0
    ? `${grouped}.${fracPart}`
    : grouped;
}

export default function DailyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "70";
    const saved = window.localStorage.getItem("rc_dtm_amount");
    return saved ?? "70";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_dtm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_dtm_display_decimals");
    return readDisplayDecimalsStrict(saved);
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
      window.localStorage.setItem(
        "rc_dtm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_dtm_round_display",
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

  const parsedDaily = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const dailyScaled = parsedDaily.ok ? (parsedDaily.scaled as bigint) : 0n;

  const canShowResults = parsedDaily.ok;

  const amountDisplayValue = useMemo(() => {
    if (isAmountFocused) return amount;
    if (!parsedDaily.ok) return amount;
    const normalized = parsedDaily.normalized ?? amount;
    return formatPreviewFromNormalizedEnUS(normalized);
  }, [amount, isAmountFocused, parsedDaily.ok, parsedDaily.normalized]);

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
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    const monthByThirty = mulDivScaled(dailyScaled, 30n, 1n);
    const monthByAverage = monthly;
    const monthByThirtyDiff = monthByAverage - monthByThirty;

    const annualFromWeekly52 = weekly * 52n;
    const annualFromMonthly12 = monthly * 12n;

    const pctVsAnnual52 =
      annualFromWeekly52 === 0n
        ? 0
        : Number(annual - annualFromWeekly52) / Number(annualFromWeekly52);
    const pctVsAnnual12 =
      annualFromMonthly12 === 0n
        ? 0
        : Number(annual - annualFromMonthly12) / Number(annualFromMonthly12);

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

  const fmt = (scaled: bigint) => {
    return roundDisplay
      ? formatCurrencyFromScaled(
          scaled,
          currency,
          roundDisplay,
          displayDecimals,
        )
      : formatCurrencyFromScaledFlexible(scaled, currency);
  };

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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Daily to Monthly Rent Converter",
        item: "https://www.rentconverter.com/daily-to-monthly-rent-converter",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Daily to Monthly Rent Converter",
    description:
      "Convert a daily rent price into a monthly equivalent using a 365-day year (annual equivalence). Decimal-safe input, full breakdown, 30-day vs average-month context, and print-to-PDF.",
    url: "https://www.rentconverter.com/daily-to-monthly-rent-converter",
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
          / Daily to Monthly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Convert a daily rate into a monthly equivalent
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
                Daily rent amount
              </label>

              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 70 or 70.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                  aria-invalid={!parsedDaily.ok}
                  aria-describedby="rc-amount-help rc-amount-error"
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

              {!parsedDaily.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {parsedDaily.error}
                </p>
              ) : parsedDaily.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedDaily.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.daily}
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
                  Enter a valid daily amount above to see the monthly equivalent
                  and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                    {fmt(monthlyHeadlineScaled)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily", breakdownScaled!.daily, "daily"],
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
                      ["Annual", breakdownScaled!.annual, "annual"],
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

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3 shadow-sm">
                    <div className="text-xs font-medium text-slate-600">
                      30-day month vs average month
                    </div>
                    <div className="mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div className="text-sm text-slate-800 leading-relaxed">
                        30-day month estimate:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthByThirty)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Average month (365 ÷ 12):{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthByAverage)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Difference:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthByThirtyDiff)}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      This page uses the average month so daily, weekly,
                      monthly, and annual equivalents stay consistent under one
                      framework.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
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
                  const v = Number(e.target.value);
                  const next = v === 0 || v === 2 || v === 4 || v === 6 ? v : 2;
                  setDisplayDecimals(next);
                }}
                className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                aria-label="Displayed decimals"
                disabled={!roundDisplay}
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
                    How the daily to monthly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page starts from a daily rent amount and produces a
                    monthly equivalent by scaling through an annual total. Daily
                    is treated as the base unit. Monthly is treated as an
                    average month derived from a 365-day year. All other period
                    values shown on the page reconcile to the same daily input.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Daily = base unit
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
                    Daily amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SCALE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual = × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DERIVE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Monthly = ÷ 12
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    BREAKDOWN
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    All periods from daily
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: core model */}
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
                      The converter treats your daily input as covering exactly
                      one day. From there, it expands that amount to a full year
                      using a fixed 365-day assumption. The monthly value is
                      then computed by dividing the annual total into twelve
                      equal parts.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>Annual</strong> = daily × 365
                        </li>
                        <li>
                          <strong>Monthly</strong> = annual ÷ 12
                        </li>
                        <li>
                          Combined: <strong>Monthly = daily × 365 ÷ 12</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        Monthly corresponds to an average month length of 365 ÷
                        12 days.
                      </p>
                    </div>

                    <p>
                      This approach keeps the math reversible. If you multiply
                      the monthly result by twelve, you return to the same
                      annual total. If you divide the annual by 365, you return
                      to the original daily rate.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why annual first */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Why the page converts to annual before monthly
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      It is possible to compute a “monthly” value directly from
                      daily by multiplying by an assumed month length. The
                      problem is that there are several plausible month lengths.
                      This page avoids that ambiguity by anchoring monthly to an
                      annual total first.
                    </p>

                    <p>
                      By defining monthly as one-twelfth of an annual amount,
                      the page makes it clear that the result is an average
                      monthly equivalent, not a calendar-specific due amount for
                      any particular month.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What monthly is
                        </div>
                        <p className="mt-2">
                          One-twelfth of an annual total derived from daily.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What monthly is not
                        </div>
                        <p className="mt-2">
                          A fixed 28-day or 30-day billing period.
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
                    How other periods are derived
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Once the daily rate is established, all other period
                      equivalents are computed from that same base. This keeps
                      the breakdown internally consistent and prevents drift
                      caused by chaining rounded values.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Derived periods
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
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
                          <strong>Hourly</strong> = daily ÷ 24
                        </li>
                      </ul>
                    </div>

                    <p>
                      All of these values reconcile back to the same annual
                      total. If you multiply any of them by the appropriate
                      number of periods per year, the annual figure matches.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: precision */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Precision, parsing, and rounding behavior
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Daily inputs are parsed as decimal values. Thousands
                      separators are treated as grouping characters. Currency
                      symbols may be present and are ignored during numeric
                      parsing.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> → 1234
                      </li>
                      <li>
                        <strong>1.234</strong> → 1.234
                      </li>
                      <li>
                        Edge formats such as <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>

                    <p>
                      Computation preserves precision internally, up to twelve
                      decimal places. Rounding, if enabled, affects only how
                      results are displayed. When disabled, additional decimals
                      remain visible so close values do not collapse into the
                      same output.
                    </p>

                    <p>
                      If an input could reasonably be interpreted in more than
                      one way, the correct behavior is to stop and show a
                      warning or error instead of returning a misleading number.
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

                    <p>
                      If you need to convert between arbitrary periods or
                      evaluate affordability against income, use the related
                      tools linked below.
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
                    Monthly here is an average, not a due date
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This converter produces a monthly equivalent derived from a
                    daily rate via an annual total. It does not attempt to
                    predict calendar billing dates or month-specific charges. If
                    you need schedule-based modeling, use a due-date calculator
                    instead.
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
