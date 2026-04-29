import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/monthly-to-annual-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/monthly-to-annual-rent-converter/HowItWorks";
import ToolFit from "~/client/components/monthly-to-annual-rent-converter/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/monthly-to-annual-rent-converter";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const meta: Route.MetaFunction = () => {
  const title = "Monthly to Annual Rent Converter | Rent Calculator";
  const description =
    "Convert monthly rent to annual rent. See the yearly amount, related breakdowns, and 4-week comparison.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "monthly to annual rent converter, monthly rent to yearly total, true yearly rent from monthly, 12 payments vs 13 payments rent, 4 week rent vs monthly annual total, rent monthly to annual calculator, annual rent equivalent from monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: PAGE_URL },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: OG_IMAGE_URL },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE_URL },

    { tagName: "link", rel: "canonical", href: PAGE_URL },
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

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  const d = Math.max(0, Math.min(6, Math.trunc(displayDecimals)));
  return `${(n * 100).toFixed(d)}%`;
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

  const monthlyInterpreted = useMemo(() => {
    if (!parsedAmount.ok) return null;
    return fmt(monthlyScaled);
  }, [parsedAmount.ok, monthlyScaled, currency, roundDisplay, displayDecimals]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleCsvExport = () => {
    if (typeof window === "undefined") return;
    if (!parsedAmount.ok || !breakdown) return;

    const rows: string[][] = [
      ["Monthly to Annual Rent Converter"],
      ["Input monthly rent", monthlyInterpreted ?? ""],
      ["Currency", currency],
      [
        "Display rounding",
        roundDisplay ? `On (${displayDecimals} decimals)` : "Off",
      ],
      [],
      ["Period", "Amount"],
      ["Hourly", fmt(breakdown.hourly)],
      ["Daily", fmt(breakdown.daily)],
      ["Weekly", fmt(breakdown.weekly)],
      ["2 weeks (14 days)", fmt(breakdown.biweekly)],
      ["4 weeks (28 days)", fmt(breakdown.every4w)],
      ["Monthly", fmt(breakdown.monthly)],
      ["Annual equivalent", fmt(breakdown.annualEquiv)],
      [],
      ["Comparison", "Amount"],
      ["12 monthly payments", fmt(breakdown.annualFromMonthly12)],
      ["52 weekly payments", fmt(breakdown.annualFromWeekly52)],
      ["13 4-week payments", fmt(breakdown.annualFrom4w13)],
      ["Monthly minus 4-week amount", fmt(breakdown.monthlyMinus4w)],
      [
        "Monthly minus 4-week percentage",
        formatPercent(breakdown.monthlyMinus4wPct, 2),
      ],
      [
        "Annual equivalent minus 12 monthly payments",
        fmt(breakdown.deltaVsMonthly12.diff),
      ],
      [
        "Annual equivalent vs 12 monthly payments percentage",
        formatPercent(breakdown.deltaVsMonthly12.pct, 2),
      ],
      [
        "13 4-week payments minus 12 monthly payments",
        fmt(breakdown.delta4w13VsMonthly12.diff),
      ],
      [
        "13 4-week payments vs 12 monthly payments percentage",
        formatPercent(breakdown.delta4w13VsMonthly12.pct, 2),
      ],
    ];

    const csv = rows.map(buildCsvRow).join("\n");
    downloadTextFile(
      "monthly-to-annual-rent-conversion.csv",
      csv,
      "text/csv;charset=utf-8",
    );
  };

  const faqData = [
    {
      q: "How do you convert monthly rent to annual rent?",
      a: "Multiply the monthly rent by 12 for the 12-payment yearly total.",
    },
    {
      q: "Why does this page show an annual-equivalent result?",
      a: "Annual equivalence keeps monthly, weekly, biweekly, 4-week, daily, and hourly comparisons on the same 365-day basis.",
    },
    {
      q: "Is yearly rent always monthly rent × 12?",
      a: "For a standard monthly lease, yes. The calculator also shows related breakdowns so you can compare other payment periods.",
    },
    {
      q: "Why does 4-week rent differ from monthly rent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days, so the amounts differ.",
    },
    {
      q: "Does this match my exact lease or due dates?",
      a: "Not always. Exact totals can depend on lease dates, prorations, fees, and payment rules.",
    },
    {
      q: "Does display rounding change the calculation?",
      a: "No. Rounding is display-only. The calculator keeps decimal precision through the calculation and only rounds shown or exported values.",
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Monthly to Annual Rent Converter",
        item: PAGE_URL,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Monthly to Annual Rent Converter",
    description:
      "Convert monthly rent to annual rent and compare it with related rent periods.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Monthly to annual rent conversion",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth">
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
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 pt-3 sm:pt-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-5 shadow-sm sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  Monthly to yearly rent calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Monthly to Annual Rent Converter
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-600">
                  Convert monthly rent into an annual amount. The calculator
                  also shows related rent breakdowns for comparison.
                </p>
              </div>

              <div
                id="export-controls"
                className="rc-no-print flex flex-wrap gap-2 sm:justify-end"
              >
                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Print / Save PDF
                </button>

                <button
                  type="button"
                  onClick={handleCsvExport}
                  disabled={!canShowResults}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Monthly rent amount
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
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
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-400 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id="rc-amt-help" className="mt-2 text-xs text-slate-600">
                Enter the monthly rent amount. Currency symbols, commas, and
                decimals are accepted.
              </p>

              {!parsedAmount.ok ? (
                <p
                  id="rc-amt-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {parsedAmount.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div
              className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 shadow-sm sm:px-6 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label="Annual rent results"
            >
              <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="mt-4 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-900">
                  Annual amount
                </div>
              </div>

              {!canShowResults || !breakdown ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Enter a valid monthly rent amount to see the annual amount
                    and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                    <div className="text-3xl font-extrabold text-emerald-800 sm:text-5xl">
                      {fmt(breakdown.annualEquiv)}
                    </div>
                    <p className="mt-2 text-sm text-emerald-700">
                      Based on monthly rent annualized over a 365-day year.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdown.hourly, "hourly"],
                        ["Daily", breakdown.daily, "daily"],
                        ["Weekly", breakdown.weekly, "weekly"],
                        ["2 weeks (14 days)", breakdown.biweekly, "biweekly"],
                        [
                          "4 weeks (28 days)",
                          breakdown.every4w,
                          "every_4_weeks",
                        ],
                        ["Monthly", breakdown.monthly, "monthly"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm"
                      >
                        <div className="text-xs font-medium text-slate-600">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-900">
                          {fmt(val)}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm rc-print-block">
                      <div className="text-xs font-medium text-emerald-700">
                        Monthly vs 4-week context
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            Monthly minus 4-week amount
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdown.monthlyMinus4w)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            Difference
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {safeToFixed(breakdown.monthlyMinus4wPct * 100, 2)}%
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            13 four-week payments
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdown.annualFrom4w13)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600">
                        A 4-week period is 28 days. An average month is about
                        30.42 days.
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-slate-600">
                        Yearly total checks
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs text-slate-600">
                            12 monthly payments
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdown.annualFromMonthly12)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs text-slate-600">
                            52 weekly payments
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdown.annualFromWeekly52)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs text-slate-600">
                            Annual equivalent vs 12 monthly
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdown.deltaVsMonthly12.diff)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Assumptions />

            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm rc-no-print">
              <div className="mb-3 text-sm font-semibold text-slate-900">
                Display rounding
              </div>
              <Rounding
                roundDisplay={roundDisplay}
                setRoundDisplay={setRoundDisplay}
                displayDecimals={displayDecimals}
                setDisplayDecimals={setDisplayDecimals as any}
              />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="mx-auto max-w-6xl px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="cursor-pointer rounded text-sky-800 transition hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Home
          </a>{" "}
          / Monthly to Annual Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-3xl text-center text-slate-600">
          These answers explain monthly-to-annual rent conversion and how to
          compare monthly rent with 4-week rent.
        </p>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 max-w-prose leading-relaxed text-slate-700">
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
