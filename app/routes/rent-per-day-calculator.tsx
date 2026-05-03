import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-per-day-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-per-day-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-per-day-calculator/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent Per Day Calculator | Daily Rent Equivalent";
  const description =
    "Calculate rent per day from monthly, weekly, 4-week, biweekly, hourly, or annual rent using stated 365-day assumptions.";

  const canonicalUrl = "https://www.rentconverter.com/rent-per-day-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent per day calculator, daily rent calculator, true daily rent, rent per day from monthly, daily equivalent rent, rent per day from weekly, rent per day from 4 week rent, prorated rent per day",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },
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
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
  monthly: "Monthly (average)",
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

function isPeriod(x: string): x is Period {
  return (
    x === "hourly" ||
    x === "daily" ||
    x === "weekly" ||
    x === "biweekly" ||
    x === "every_4_weeks" ||
    x === "monthly" ||
    x === "annual"
  );
}

/**
 * Only include routes you are sure exist.
 * Add routes here only when you have them in your known route set.
 */
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

/** Fixed-point decimals preserved end-to-end (up to 12 decimals). */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
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
): string {
  const digits = 2;
  const scaledForDisplay = roundScaledToDecimals(scaled, digits);

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const parts = fmt.formatToParts(0);
  const currencyPart = parts.find((p) => p.type === "currency");
  const symbol = currencyPart?.value ?? "";
  const minus = negative ? "-" : "";

  return minus + symbol + groupedInt + (digits > 0 ? decimal + fracStr.padEnd(digits, "0") : "");
}

function formatGroupedPreviewFromNormalized(normalized: string): string {
  const [intPartRaw, fracPartRaw] = normalized.split(".");
  const intPart = (intPartRaw ?? "0").replace(/^0+(?=\d)/, "0");
  const groupedInt = (intPart || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (typeof fracPartRaw === "string") return `${groupedInt}.${fracPartRaw}`;
  return groupedInt;
}

/**
 * Accepts: $650, 650, 650.00, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

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
      if (/^\d{1,2}$/.test(after) || after === "") {
        // allow "12," (treat as 12)
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
    if (split.length > 2) {
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    }
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
    // allow trailing separators like "12." or "12," by treating empty frac as 0
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
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
    warnings.push("Value was clamped to the supported maximum.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

/**
 * Assumptions (source of truth):
 * - Year = 365 days
 * - Month = 365/12 days (average)
 * - Week = 7 days
 * - Biweekly = 14 days
 * - Every 4 weeks = 28 days
 * - Hour = 1/24 day
 *
 * Conversion uses annual equivalence:
 * 1) convert input to annual
 * 2) convert annual to target period
 *
 * Fixed-point BigInt preserves decimals end-to-end (up to 12 decimals).
 */
function annualizeFromScaled(valueScaled: bigint, period: Period): bigint {
  if (period === "hourly") return valueScaled * 24n * 365n;
  if (period === "daily") return valueScaled * 365n;
  if (period === "weekly") return valueScaled * 52n;
  if (period === "biweekly") return valueScaled * 26n;
  if (period === "every_4_weeks") return valueScaled * 13n;
  if (period === "monthly") return valueScaled * 12n;
  return valueScaled;
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

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
}

function convertScaled(valueScaled: bigint, from: Period, to: Period): bigint {
  if (from === to) return valueScaled;
  const annual = annualizeFromScaled(valueScaled, from);
  return fromAnnualScaled(annual, to);
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

export default function RentPerDayCalculator() {
  const pageName = "Rent Per Day Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-per-day-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpdc_amount") ?? "2000";
  });

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const pendingAmountSelectionRef = useRef<{
    start: number;
    end: number;
  } | null>(null);
  const [amountFocused, setAmountFocused] = useState<boolean>(false);
  const [amountPreview, setAmountPreview] = useState<string>(() => amount);

  const [from, setFrom] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rpdc_from") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rpdc_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [daysCount, setDaysCount] = useState<string>(() => {
    if (typeof window === "undefined") return "30";
    return localStorage.getItem("rpdc_daysCount") ?? "30";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rpdc_amount", amount);
      localStorage.setItem("rpdc_from", from);
      localStorage.setItem("rpdc_currency", currency);
      localStorage.setItem("rpdc_daysCount", daysCount);
    } catch {
      // ignore
    }
  }, [amount, from, currency, daysCount]);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  useEffect(() => {
    if (!amountFocused) {
      if (parsedAmount.ok && parsedAmount.normalized) {
        setAmountPreview(
          formatGroupedPreviewFromNormalized(parsedAmount.normalized),
        );
      } else {
        setAmountPreview(amount);
      }
    }
  }, [amount, amountFocused, parsedAmount.ok, parsedAmount.normalized]);

  useEffect(() => {
    const sel = pendingAmountSelectionRef.current;
    if (!sel) return;
    if (!amountFocused) {
      pendingAmountSelectionRef.current = null;
      return;
    }
    const el = amountInputRef.current;
    if (!el) {
      pendingAmountSelectionRef.current = null;
      return;
    }
    try {
      el.setSelectionRange(sel.start, sel.end);
    } catch {
      // ignore
    }
    pendingAmountSelectionRef.current = null;
  }, [amount, amountFocused]);

  const parsedDays = useMemo(() => {
    const s = (daysCount ?? "").trim();
    if (!s) return { ok: false as const, n: 0, error: "Enter a day count." };
    if (!/^\d+$/.test(s)) {
      return {
        ok: false as const,
        n: 0,
        error: "Enter a whole number of days.",
      };
    }
    const n = Number(s);
    if (!Number.isFinite(n))
      return { ok: false as const, n: 0, error: "Enter a valid day count." };
    const t = Math.trunc(n);
    if (t < 0)
      return {
        ok: false as const,
        n: 0,
        error: "Day count must be 0 or greater.",
      };
    return { ok: true as const, n: Math.max(0, Math.min(3660, t)) };
  }, [daysCount]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedAmount.ok)
      errors.push(parsedAmount.error ?? "Enter a valid amount.");
    if (parsedAmount.warnings.length) warnings.push(...parsedAmount.warnings);

    if (!errors.length) {
      const amountScaled = parsedAmount.scaled as bigint;

      const dailyScaled = convertScaled(amountScaled, from, "daily");

      const hourlyScaled = convertScaled(amountScaled, from, "hourly");
      const weeklyScaled = convertScaled(amountScaled, from, "weekly");
      const biweeklyScaled = convertScaled(amountScaled, from, "biweekly");
      const every4wScaled = convertScaled(amountScaled, from, "every_4_weeks");
      const monthlyScaled = convertScaled(amountScaled, from, "monthly");
      const annualScaled = convertScaled(amountScaled, from, "annual");

      const monthlyMinus4wScaled = monthlyScaled - every4wScaled;

      const monthlyMinus4wPct = (() => {
        if (every4wScaled === 0n) return 0;
        const num = toNumberSafe(monthlyMinus4wScaled);
        const den = toNumberSafe(every4wScaled);
        if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0)
          return 0;
        return (num / den) * 100;
      })();

      return {
        ok: true as const,
        warnings,

        amountScaled,
        dailyScaled,
        hourlyScaled,
        weeklyScaled,
        biweeklyScaled,
        every4wScaled,
        monthlyScaled,
        annualScaled,

        monthlyMinus4wScaled,
        monthlyMinus4wPct,
      };
    }

    return { ok: false as const, errors, warnings };
  }, [parsedAmount, from]);

  const totalForDaysScaled = useMemo(() => {
    if (!computed.ok) return { ok: false as const, scaled: 0n };
    if (!parsedDays.ok) return { ok: false as const, scaled: 0n };
    const t = computed.dailyScaled * BigInt(parsedDays.n);
    return { ok: true as const, scaled: t };
  }, [computed, parsedDays]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do I calculate rent per day?",
      a: "Convert the rent amount to an annual total, then divide by 365. For example, monthly rent is multiplied by 12 first, then divided by 365.",
    },
    {
      q: "Why is dividing monthly rent by 30 different?",
      a: "Months do not all have 30 days. This calculator uses an average month based on 365 ÷ 12 days, then calculates a daily amount from the annual total.",
    },
    {
      q: "Can I use this for prorated rent?",
      a: "It can estimate a daily amount, but exact lease proration can depend on lease wording, local rules, billing dates, and how the landlord handles partial periods.",
    },
    {
      q: "How does every 4 weeks affect the daily rent?",
      a: "A 4-week period is 28 days. The calculator converts that amount to an annual total, then shows the daily, weekly, monthly, and annual amounts on the same basis.",
    },
    {
      q: "What is the day-count total for?",
      a: "It multiplies the calculated daily rent by the number of days you enter. This is useful for quick estimates, short stays, move-in windows, or comparison checks.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "The calculator uses 365 days per year, 365 ÷ 12 days for an average month, 7 days per week, 14 days for biweekly rent, and 28 days for every 4 weeks.",
    },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Calculate rent per day from monthly, weekly, 4-week, biweekly, hourly, or annual rent using stated 365-day assumptions.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl,
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const amountInputId = "rpdc_amount_input";
  const amountHelpId = "rpdc_amount_help";
  const amountErrorId = "rpdc_amount_error";

  const periodSelectId = "rpdc_period_select";

  const daysInputId = "rpdc_days_input";
  const daysErrorId = "rpdc_days_error";

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Daily rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Per Day Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate the daily equivalent of monthly, weekly, 4-week,
                  biweekly, hourly, or annual rent. Use it for short stays,
                  prorated comparisons, or day-by-day budgeting.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  ref={amountInputRef}
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountFocused ? amount : amountPreview}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => {
                    const el = e.target;
                    const next = el.value;
                    const start = el.selectionStart ?? next.length;
                    const end = el.selectionEnd ?? next.length;

                    const beforeStart = next.slice(0, start);
                    const beforeEnd = next.slice(0, end);
                    const removedBeforeStart = (beforeStart.match(/,/g) || [])
                      .length;
                    const removedBeforeEnd = (beforeEnd.match(/,/g) || [])
                      .length;

                    const sanitized = next.replace(/,/g, "");
                    const newStart = Math.max(0, start - removedBeforeStart);
                    const newEnd = Math.max(0, end - removedBeforeEnd);

                    pendingAmountSelectionRef.current = {
                      start: newStart,
                      end: newEnd,
                    };
                    setAmount(sanitized);
                  }}
                  placeholder="e.g. 2000 or 2000.00"
                  className={`w-full min-w-0 rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsedAmount.ok
                      ? "focus:bg-white"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsedAmount.ok}
                  aria-describedby={`${amountHelpId}${!parsedAmount.ok ? ` ${amountErrorId}` : ""}`}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id={amountHelpId} className="mt-1 text-xs text-slate-700">
                Enter the rent amount for the billing period selected.
              </p>

              {!parsedAmount.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
              <label
                htmlFor={periodSelectId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Billing period for that amount
              </label>
              <select
                id={periodSelectId}
                value={from}
                onChange={(e) =>
                  setFrom(isPeriod(e.target.value) ? e.target.value : "monthly")
                }
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              >
                <option value="hourly">{PERIOD_LABEL.hourly}</option>
                <option value="daily">{PERIOD_LABEL.daily}</option>
                <option value="weekly">{PERIOD_LABEL.weekly}</option>
                <option value="biweekly">{PERIOD_LABEL.biweekly}</option>
                <option value="every_4_weeks">
                  {PERIOD_LABEL.every_4_weeks}
                </option>
                <option value="monthly">{PERIOD_LABEL.monthly}</option>
                <option value="annual">{PERIOD_LABEL.annual}</option>
              </select>
            </div>
          </div>

          <div
            className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:p-6">
              {!computed.ok ? (
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    Fix the input to calculate the daily amount.
                  </p>
                  {"errors" in computed ? (
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                      {computed.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Rent per day
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                      {fmtMoney(computed.dailyScaled)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on the entered rent converted to an annual total,
                      then divided by 365.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(
                          [
                            ["Hourly", computed.hourlyScaled, "hourly"],
                            ["Daily", computed.dailyScaled, "daily"],
                            ["Weekly", computed.weeklyScaled, "weekly"],
                            ["2 weeks", computed.biweeklyScaled, "biweekly"],
                            [
                              "4 weeks (28 days)",
                              computed.every4wScaled,
                              "every_4_weeks",
                            ],
                            [
                              "Monthly (average)",
                              computed.monthlyScaled,
                              "monthly",
                            ],
                            ["Annual", computed.annualScaled, "annual"],
                          ] as const
                        ).map(([label, val, key]) => (
                          <div
                            key={key}
                            className="rounded-2xl bg-white px-4 py-3"
                          >
                            <div className="text-xs text-slate-700">
                              {label}
                            </div>
                            <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                              {fmtMoney(val)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-2xl bg-white p-5">
                        <h3 className="text-lg font-bold text-sky-800 mb-2">
                          Total for a chosen number of days
                        </h3>
                        <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                          This multiplies the daily amount by a day count. Lease
                          proration rules can differ.
                        </p>

                        <label
                          htmlFor={daysInputId}
                          className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          Number of days
                        </label>
                        <input
                          id={daysInputId}
                          inputMode="numeric"
                          value={daysCount}
                          onChange={(e) => setDaysCount(e.target.value)}
                          placeholder="e.g. 30"
                          className="w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                          aria-invalid={!parsedDays.ok}
                          aria-describedby={
                            !parsedDays.ok ? daysErrorId : undefined
                          }
                        />
                        {!parsedDays.ok ? (
                          <p
                            id={daysErrorId}
                            className="mt-2 text-sm font-semibold text-rose-700"
                            role="alert"
                          >
                            {parsedDays.error}
                          </p>
                        ) : null}

                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
                          <div className="text-xs text-slate-700">
                            Estimated total
                          </div>
                          <div className="mt-1 text-2xl font-extrabold text-slate-950 tabular-nums break-words">
                            {totalForDaysScaled.ok
                              ? fmtMoney(totalForDaysScaled.scaled)
                              : "-"}
                          </div>
                          <div className="mt-1 text-xs text-slate-700 leading-relaxed">
                            <span className="tabular-nums whitespace-nowrap">
                              {fmtMoney(computed.dailyScaled)}
                            </span>{" "}
                            per day ×{" "}
                            <span className="tabular-nums whitespace-nowrap">
                              {parsedDays.ok ? parsedDays.n : 0}
                            </span>{" "}
                            days
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {computed.ok ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3">
              <div className="text-xs font-semibold text-emerald-800">
                Monthly vs every 4 weeks
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-slate-700 leading-relaxed">
                  Monthly minus 4-week:{" "}
                  <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                    {fmtMoney(computed.monthlyMinus4wScaled)}
                  </strong>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  Difference:{" "}
                  <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                    {safeToFixed(computed.monthlyMinus4wPct, 2)}%
                  </strong>
                </div>
              </div>
            </div>
          ) : null}

          {computed.ok && computed.warnings.length ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
              <div className="font-semibold">Notes</div>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                {computed.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Assumptions />

        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
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
