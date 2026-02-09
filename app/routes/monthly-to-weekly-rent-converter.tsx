import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-weekly-rent-converter";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Weekly Rent Converter (28-Day vs Monthly)";
  const description =
    "Instantly convert monthly rent into a weekly amount using a true 365-day year and average month length. Compare monthly vs 4-week (28-day) rent math, with exact decimals and full period breakdowns. Free and private.";

  const url = "https://www.rentconverter.com/monthly-to-weekly-rent-converter";
  const image = "https://www.rentconverter.com/og-image.jpg";

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
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: image },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    {
      tagName: "link",
      rel: "canonical",
      href: url,
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
      "Convert monthly rent to a weekly equivalent using annual equivalence (365-day year and average month length). Includes period breakdowns and 4-week (28-day) comparisons.",
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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Instant Monthly to Weekly Rent Converter
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
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
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg leading-6 outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
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
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAmount.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.monthly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.weekly}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block min-h-[240px]">
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
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Weekly equivalent (365-day basis)
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
                    {fmt(breakdown.weekly)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdown.hourly, "hourly"],
                      ["Daily", breakdown.daily, "daily"],
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
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 rc-print-block">
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
                          {safeToFixed(breakdown.monthlyMinus4wPct * 100, 2)}%
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). Different periods can produce
                      different annual totals.
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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={roundDisplay}
              onChange={(e) => setRoundDisplay(e.target.checked)}
              className="cursor-pointer h-4 w-4 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
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

      <>
        {/* HOW IT WORKS */}
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
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                      How the monthly to weekly rent converter works
                    </h2>
                    <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                      This page converts a monthly rent amount into a weekly
                      equivalent using one time-length model. Monthly is treated
                      as an average month derived from a 365-day year. Weekly is
                      defined as a fixed 7-day period. The weekly figure you see
                      is the 7-day equivalent of the same implied annual cost,
                      not a “payments per year” shortcut.
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                      Month = 365 ÷ 12 days
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      Week = 7 days
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      INPUT
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      Monthly amount
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ANNUALIZE
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      Monthly × 12
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      NORMALIZE
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      Annual → daily
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      DERIVE
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      Daily × 7
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
                {/* Step 1 */}
                <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                  />
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Step 1: Enter the monthly rent amount
                    </h3>

                    <div className="mt-4 space-y-3">
                      <p>
                        Enter the rent value and select “monthly.” The parser
                        accepts currency symbols, grouping commas, and decimal
                        formats, including edge inputs. It avoids producing a
                        clean weekly result from an invalid entry.
                      </p>

                      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Parsing rules
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>
                            <strong>1,234</strong> is interpreted as 1234
                          </li>
                          <li>
                            <strong>1.234</strong> is interpreted as 1.234
                          </li>
                          <li>
                            Formats like <strong>.5</strong> and{" "}
                            <strong>12.</strong> are supported
                          </li>
                        </ul>
                      </div>

                      <p>
                        The calculator converts the rent amount only. It does
                        not guess included costs like utilities, fees, deposits,
                        or taxes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                  />
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Step 2: Convert monthly into a weekly equivalent (7-day
                      basis)
                    </h3>

                    <div className="mt-4 space-y-3">
                      <p>
                        The weekly figure is derived by first establishing an
                        annual total implied by the monthly amount, then
                        converting that annual total into a daily rate, then
                        into a 7-day week. This keeps weekly aligned with the
                        same assumptions used elsewhere in the breakdown.
                      </p>

                      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Formulas
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>
                            <strong>Annual</strong> = monthly × 12
                          </li>
                          <li>
                            <strong>Daily</strong> = annual ÷ 365
                          </li>
                          <li>
                            <strong>Weekly</strong> = daily × 7
                          </li>
                          <li>
                            Combined:{" "}
                            <strong>Weekly = monthly × 12 ÷ 365 × 7</strong>
                          </li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-600">
                          Monthly corresponds to an average month length of 365
                          ÷ 12 days. Weekly is fixed at 7 days.
                        </p>
                      </div>

                      <p>
                        This is a time-length conversion. It’s not attempting to
                        infer how your lease is billed or how many payment dates
                        occur in a calendar year.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                  />
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Step 3: Keep the breakdown consistent and keep rounding
                      separate
                    </h3>

                    <div className="mt-4 space-y-3">
                      <p>
                        The breakdown (hourly, daily, weekly, biweekly, 4-week,
                        monthly, annual) is generated from the same annual basis
                        so period values don’t drift from mixed assumptions. The
                        4-week line uses exactly 28 days.
                      </p>

                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong>Biweekly</strong> = daily × 14
                        </li>
                        <li>
                          <strong>4-week</strong> = daily × 28
                        </li>
                        <li>
                          <strong>Hourly</strong> = daily ÷ 24
                        </li>
                        <li>
                          <strong>Monthly</strong> = annual ÷ 12
                        </li>
                      </ul>

                      <p>
                        Calculations preserve decimals internally (up to 12
                        places). If rounding is enabled, only the displayed
                        values are rounded. The underlying equivalents are
                        unchanged.
                      </p>

                      <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What you can do
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                          <li>
                            Compare weekly-advertised and monthly-advertised
                            listings on one annual basis
                          </li>
                          <li>
                            Keep 28-day and monthly pricing distinct instead of
                            treating them as the same
                          </li>
                          <li>
                            Copy weekly and summary numbers for sharing or
                            documentation
                          </li>
                        </ul>
                      </div>
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
                    <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                      Weekly comparisons are easiest when the year is the anchor
                    </h3>
                    <p className="mt-3 text-slate-200 leading-7">
                      If you compare “weekly” and “monthly” by eyeballing
                      labels, you end up mixing time lengths. This route forces
                      a single annual basis, then derives weekly as a 7-day
                      equivalent. That keeps the weekly number compatible with
                      the 14-day and 28-day lines in the same breakdown.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEARN */}
        <section
          id="learn"
          className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm mt-6 rc-no-print"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-10">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center leading-tight">
                Monthly rent expressed as a weekly equivalent
              </h2>

              <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
                <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      What the weekly number represents
                    </h3>
                    <p className="mt-4">
                      Weekly is a 7-day unit. Monthly is not a fixed day count,
                      which is why a direct “monthly ÷ 4” shortcut is usually
                      wrong. This page produces a weekly equivalent that matches
                      the same implied annual cost as the monthly amount, under
                      one explicit time model.
                    </p>
                    <p className="mt-4">
                      Practically, that means you can line up listings that use
                      different labels. Convert each one and compare the weekly
                      values, then scan the breakdown to see whether the 14-day
                      and 28-day equivalents are in the same range.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Why 28-day billing creates “almost monthly” prices
                    </h3>
                    <p className="mt-4">
                      A 4-week period is always 28 days. An average month is
                      longer than 28 days (365 ÷ 12 days). That’s why a listing
                      billed “every 4 weeks” can imply a different annual total
                      even when the number looks close to the monthly price.
                      This route keeps those time lengths explicit by converting
                      through the same annual and daily basis.
                    </p>

                    <p className="mt-5 text-slate-700 leading-relaxed">
                      Related pages:{" "}
                      <a
                        href={safeHref("/weekly-to-monthly-rent-converter")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        weekly to monthly rent
                      </a>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <a
                        href={safeHref("/rent-paid-every-4-weeks-calculator")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        rent paid every 4 weeks
                      </a>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <a
                        href={safeHref(
                          "/how-much-rent-can-i-afford-calculator",
                        )}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        how much rent can I afford
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

      <section className="mt-8 mb-4 hidden sm:block">
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
      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
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
