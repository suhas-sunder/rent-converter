import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-annual-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Annual Rent Converter (12 vs 13 Payments)";
  const description =
    "Instantly convert monthly rent into an annual total and see the difference between monthly × 12 and 4-week (13-payment) schedules. Exact decimals, clear comparisons, and a full breakdown across billing periods. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to annual rent converter, monthly rent to yearly total, convert rent monthly to annual, yearly rent from monthly, annual rent calculator, 12 payments vs 13 payments rent, 4 week rent vs monthly annual total",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/monthly-to-annual-rent-converter",
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
      href: "https://rentconverter.com/monthly-to-annual-rent-converter",
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

// Keep conservative and aligned with your known route set
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
  const parts = new Intl.NumberFormat(undefined, { useGrouping: true }).formatToParts(1000.1);
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
  const qRounded = r >= half ? (q + 1n) : q;
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


/**
 * Format currency:
 * - preserve decimals end-to-end
 * - if display rounding is enabled, keep exactly the selected decimal count
 * - if rounding is disabled, show up to 12 decimals (no forced trailing zeros)
 */
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

  const scaledForDisplay = roundDisplay ? roundScaledToDecimals(scaled, digits) : scaled;

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

  return out || "—";
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

/**
 * Convert across periods using annual equivalence:
 * monthly is treated as average month length (365/12 days).
 */
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
    monthly: { num: 365n, den: 12n }, // 365/12
    annual: { num: 365n, den: 1n },
  };

  // toDaily
  let dailyScaled: bigint;
  if (from === "hourly") {
    dailyScaled = mulDivInt(valueScaled, 24n, 1n);
  } else {
    const dp = daysPer[from as Exclude<Period, "hourly">] ?? {
      num: 1n,
      den: 1n,
    };
    // value / (num/den) = value * den / num
    dailyScaled = mulDivInt(valueScaled, dp.den, dp.num);
  }

  // fromDaily
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

  const parts = s.split(".");
  const intPartRaw = parts[0] ?? "0";
  const fracPart = parts.length > 1 ? (parts[1] ?? "") : "";

  const intPart = intPartRaw.replace(/^0+(?=\d)/, "") || "0";
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fracPart.length ? `${groupedInt}.${fracPart}` : groupedInt;
}

function sanitizeAmountInputPreserveCaret(
  el: HTMLInputElement,
  rawNext: string,
): { sanitized: string; nextCaret: number | null } {
  const caret = el.selectionStart;
  if (caret === null)
    return { sanitized: rawNext.replace(/,/g, ""), nextCaret: null };

  let commasBeforeCaret = 0;
  for (let i = 0; i < Math.min(caret, rawNext.length); i++) {
    if (rawNext[i] === ",") commasBeforeCaret++;
  }
  const sanitized = rawNext.replace(/,/g, "");
  const nextCaret = Math.max(0, caret - commasBeforeCaret);
  return { sanitized, nextCaret };
}

const ALLOWED_DISPLAY_DECIMALS = new Set<number>([0, 2, 4, 6]);

export default function MonthlyToAnnualRent() {
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const pendingCaretRef = useRef<number | null>(null);

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = window.localStorage.getItem("rc_mta_amount") ?? "2000";
    return saved.replace(/,/g, "");
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_mta_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_mta_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_mta_display_decimals");
    const n = saved === null ? NaN : Number(saved);
    if (!Number.isFinite(n)) return 2;
    const v = Math.trunc(n);
    return ALLOWED_DISPLAY_DECIMALS.has(v) ? v : 2;
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_mta_amount", amount);
      window.localStorage.setItem("rc_mta_currency", currency);
      window.localStorage.setItem(
        "rc_mta_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_mta_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = amountInputRef.current;
    const caret = pendingCaretRef.current;
    if (!el || caret === null) return;
    pendingCaretRef.current = null;
    try {
      el.setSelectionRange(caret, caret);
    } catch {
      // ignore
    }
  });

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const monthlyScaled = parsedAmount.ok ? (parsedAmount.scaled as bigint) : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const amountPreviewValue = useMemo(() => {
    if (!parsedAmount.ok) return amount;
    const normalized = parsedAmount.normalized ?? "";
    return formatAmountPreviewFromNormalized(normalized);
  }, [parsedAmount.ok, parsedAmount.normalized, amount]);

  const amountDisplayValue = isAmountFocused ? amount : amountPreviewValue;

  const breakdown = useMemo(() => {
    if (!parsedAmount.ok) return null;

    const monthly = monthlyScaled;

    const hourly = convertScaled(monthly, "monthly", "hourly");
    const daily = convertScaled(monthly, "monthly", "daily");
    const weekly = convertScaled(monthly, "monthly", "weekly");
    const biweekly = convertScaled(monthly, "monthly", "biweekly");
    const every4w = convertScaled(monthly, "monthly", "every_4_weeks");
    const annualEquiv = convertScaled(monthly, "monthly", "annual");

    // Schedule-style totals (not the same thing as annual equivalence)
    const annualFromMonthly12 = mulDivInt(monthly, 12n, 1n);
    const annualFromWeekly52 = mulDivInt(weekly, 52n, 1n);

    // "13 payments" comparison (common framing for 4-week schedules)
    // Note: 365/28 = 13.035..., so "13 payments" is a schedule illustration, not a calendar truth for every start date.
    const annualFrom4w13 = mulDivInt(every4w, 13n, 1n);

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = every4w
      ? Number(monthlyMinus4w) / Number(every4w)
      : 0;

    const deltaVsMonthly12 = {
      diff: annualEquiv - annualFromMonthly12,
      pct: annualFromMonthly12
        ? Number(annualEquiv - annualFromMonthly12) /
          Number(annualFromMonthly12)
        : 0,
    };

    const delta4w13VsMonthly12 = {
      diff: annualFrom4w13 - annualFromMonthly12,
      pct: annualFromMonthly12
        ? Number(annualFrom4w13 - annualFromMonthly12) /
          Number(annualFromMonthly12)
        : 0,
    };

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annualEquiv,
      annualFromMonthly12,
      annualFromWeekly52,
      annualFrom4w13,
      monthlyMinus4w,
      monthlyMinus4wPct,
      deltaVsMonthly12,
      delta4w13VsMonthly12,
    };
  }, [parsedAmount.ok, monthlyScaled]);

  const canShowResults = parsedAmount.ok && !!breakdown;

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
      q: "What is “annual rent” when a listing is priced monthly?",
      a: "It is the yearly total implied by that monthly price. This page estimates an annual equivalent so you can compare listings and payment schedules on the same timeline.",
    },
    {
      q: "How does this converter turn monthly rent into an annual total?",
      a: "It uses annual equivalence. A month is treated as an average month length (365 ÷ 12 days), which keeps conversions consistent when comparing monthly pricing to weekly, biweekly, or 4-week schedules.",
    },
    {
      q: "Is yearly rent always monthly rent × 12?",
      a: "For many quick comparisons, yes. This page also shows an annual-equivalence view and related period breakdowns so you can compare monthly pricing to other billing frequencies without mixing assumptions.",
    },
    {
      q: "Why does 4-week (28-day) billing change the annual total?",
      a: "Because 28-day periods fit into a year differently than calendar months. A 4-week schedule is often framed as 13 payments per year, while monthly is typically 12 payments. The annual total can be higher even if each 4-week payment looks similar.",
    },
    {
      q: "Does this match my exact lease or due dates?",
      a: "No. It is for budgeting and comparison. Your actual total depends on the lease start date, proration rules, billing terms, and fees.",
    },
    {
      q: "What does the breakdown section help with?",
      a: "It shows the same rent expressed hourly, daily, weekly, biweekly, every 4 weeks, monthly, and annually. That makes it easier to compare ads that use different price formats and to sanity-check what a rate implies over a year.",
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
        name: "Monthly to Annual Rent Converter",
        item: "https://rentconverter.com/monthly-to-annual-rent-converter",
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
    name: "Monthly to Annual Rent Converter",
    description:
      "Convert monthly rent into an annual rent total using annual equivalence. Includes a full period breakdown and a 4-week (28-day) schedule comparison.",
    url: "https://rentconverter.com/monthly-to-annual-rent-converter",
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
          / Monthly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-5xl mx-auto text-lg">
          See what a monthly rent price implies over a year. This page converts
          monthly rent using annual equivalence (365-day year) and includes a
          full breakdown across billing periods.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Convert monthly rent to an annual total
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  ref={amountInputRef}
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  onChange={(e) => {
                    const el = e.currentTarget;
                    const nextRaw = el.value ?? "";
                    const { sanitized, nextCaret } =
                      sanitizeAmountInputPreserveCaret(el, nextRaw);
                    if (nextCaret !== null) pendingCaretRef.current = nextCaret;
                    setAmount(sanitized);
                  }}
                  placeholder="e.g. 2000 or 2000.00"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedAmount.ok}
                  aria-describedby="rc-amt-help rc-amt-error"
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

              {!parsedAmount.ok ? (
                <p
                  id="rc-amt-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
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
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            {!canShowResults || !breakdown ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid monthly rent amount to see the annual equivalent
                  and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600">
                  Annual equivalent (annual equivalence)
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {fmt(breakdown.annualEquiv)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(breakdown.monthly)} monthly ≈{" "}
                    <strong>{fmt(breakdown.annualEquiv)}</strong> annually using
                    annual equivalence (365-day year)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("annualEquiv", fmt(breakdown.annualEquiv))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "annualEquiv"
                        ? "Copied"
                        : "Copy annual equivalent"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Monthly: ${fmt(breakdown.monthly)} | Annual equiv: ${fmt(breakdown.annualEquiv)} | Monthly×12: ${fmt(breakdown.annualFromMonthly12)}`,
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
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdown.hourly, "hourly"],
                      ["Daily", breakdown.daily, "daily"],
                      ["Weekly", breakdown.weekly, "weekly"],
                      ["Every 2 weeks", breakdown.biweekly, "biweekly"],
                      [
                        "Every 4 weeks (28 days)",
                        breakdown.every4w,
                        "every_4_weeks",
                      ],
                      ["Monthly", breakdown.monthly, "monthly"],
                      ["Annual (equivalence)", breakdown.annualEquiv, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Annual comparisons: equivalence vs payment schedules
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly × 12 payments
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFromMonthly12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common shorthand
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Weekly × 52 payments
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFromWeekly52)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Schedule-style multiplication
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          4-week × 13 payments
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdown.annualFrom4w13)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Illustrative 13-payment framing
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Annual equiv minus (monthly × 12):{" "}
                        <strong className="text-slate-900">
                          {fmt(breakdown.deltaVsMonthly12.diff)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900">
                          {safeToFixed(breakdown.deltaVsMonthly12.pct * 100, 2)}%
                        </strong>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        4-week × 13 minus (monthly × 12):{" "}
                        <strong className="text-slate-900">
                          {fmt(breakdown.delta4w13VsMonthly12.diff)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900">
                          {(breakdown.delta4w13VsMonthly12.pct * 100).toFixed(
                            2,
                          )}
                          %
                        </strong>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Annual equivalence is the conversion basis used for the
                      breakdown (365-day year, average month length). The
                      payment schedule totals are separate comparison scenarios.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs 4-week context
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week amount:{" "}
                        <strong className="text-slate-900">
                          {fmt(breakdown.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900">
                          {safeToFixed(breakdown.monthlyMinus4wPct * 100, 2)}%
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). These are different periods, so
                      their equivalents can diverge.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Your lease
            rules can produce different totals.
          </p>
        </div>

        <div className="md:col-span-6 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
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
              <div className="text-xs text-slate-500">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  const v = Number.isFinite(n) ? Math.trunc(n) : 2;
                  setDisplayDecimals(ALLOWED_DISPLAY_DECIMALS.has(v) ? v : 2);
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Calculations preserve decimals internally (up to 12). If rounding
              is enabled, displayed values keep exactly the selected decimals.
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
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>You enter a monthly rent amount.</strong> The input parser
              supports currency symbols and formats like .5 and 12., and it
              avoids showing misleading results on invalid or ambiguous input.
            </li>
            <li>
              <strong>
                The converter uses annual equivalence as the base.
              </strong>{" "}
              Monthly rent is interpreted using an average month length (365 ÷
              12 days), then converted through a 365-day year to produce an
              annual equivalent.
            </li>
            <li>
              <strong>
                All other periods come from the same annual basis.
              </strong>{" "}
              Weekly, biweekly, and every-4-weeks equivalents are derived
              consistently, so comparisons do not mix assumptions across the
              breakdown.
            </li>
            <li>
              <strong>Schedule comparisons are shown separately.</strong>{" "}
              Monthly × 12 and 4-week × 13 are payment schedule illustrations,
              not the equivalence basis.
            </li>
            <li>
              <strong>Printing.</strong> Use your browser’s print dialog to save
              as a PDF.
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">What you can do here</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
              <li>Get an annual equivalent for consistent comparisons</li>
              <li>
                See a full breakdown across hourly, daily, weekly, biweekly,
                4-week, monthly, and annual
              </li>
              <li>
                Compare with payment schedule scenarios (monthly × 12, 4-week ×
                13) for context
              </li>
              <li>Print the results to save as a PDF</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-slate-700">
          Related pages:{" "}
          <a
            href={safeHref("/monthly-to-weekly-rent-converter")}
            className="text-sky-700 hover:underline"
          >
            monthly to weekly rent
          </a>
          ,{" "}
          <a
            href={safeHref("/weekly-to-annual-rent-converter")}
            className="text-sky-700 hover:underline"
          >
            weekly to annual rent
          </a>
          , and{" "}
          <a
            href={safeHref("/annual-to-monthly-rent-converter")}
            className="text-sky-700 hover:underline"
          >
            annual to monthly rent
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
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            payment schedules, proration, fees, and obligations vary by
            location, landlord, and lease terms. Review your rental agreement
            for the rules that apply to you.
          </p>
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
