import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/daily-to-monthly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/daily-to-monthly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/daily-to-monthly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com" as const;
const ROUTE_SLUG = "daily-to-monthly-rent-converter" as const;
const ROUTE_PATH = `/${ROUTE_SLUG}` as const;
const PAGE_URL = `${SITE_URL}${ROUTE_PATH}` as const;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg` as const;

export const meta: Route.MetaFunction = () => {
  const title = "Daily to Monthly Rent Converter | Rent Calculator";
  const description =
    "Convert daily rent to monthly rent. See the monthly amount, related breakdowns, and 30-day comparison.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "daily to monthly rent converter, daily rent to monthly, rent per day to monthly, daily rent monthly calculator, 30 day vs monthly rent, daily rate rent monthly",
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
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

// Internal link whitelist (only known routes)
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

/** Decimal-safe fixed-point (up to 12 decimals) */
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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n; // ~9e15

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
    if (trimTrailingZeros) fracStr = fracStr.replace(/0+$/g, "");
  }
  return { negative, intStr: intPart.toString(), fracStr };
}

/**
 * IMPORTANT:
 * - If displayDecimals is N, we force exactly N decimals so values like 900.50 show properly.
 * - This is display-only; internal math stays fixed-point with up to 12 decimals.
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
    !roundDisplay,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

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
    if (p.type === "group") continue;
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
  const d = Math.max(0, Math.min(6, Math.trunc(displayDecimals)));
  return `${(n * 100).toFixed(d)}%`;
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

/**
 * Fixed-point multiply/divide.
 * Note: integer division truncates. We minimize precision loss by doing one-step ratios where possible.
 */
function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

/**
 * Converts a daily amount into other periods using one-step ratios.
 * Key correctness points:
 * - Annual = daily * 365
 * - Monthly (avg) = daily * 365 / 12
 * - 4-week = daily * 28
 * - Weekly = daily * 7
 * - Hourly = daily / 24
 */
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

function ratioToNumber(numer: bigint, denom: bigint, precision = 8): number {
  if (denom === 0n) return 0;
  const p = Math.max(0, Math.min(12, Math.trunc(precision)));
  const factor = 10n ** BigInt(p);
  const scaled = (numer * factor) / denom;
  return Number(scaled) / 10 ** p;
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
    const monthlyMinus4wPct = ratioToNumber(monthlyMinus4w, every4w, 8);

    const monthByThirty = mulDivScaled(dailyScaled, 30n, 1n);
    const monthByAverage = monthly;
    const monthByThirtyDiff = monthByAverage - monthByThirty;

    const annualFromWeekly52 = weekly * 52n;
    const annualFromMonthly12 = monthly * 12n;

    const pctVsAnnual52 = ratioToNumber(
      annual - annualFromWeekly52,
      annualFromWeekly52,
      8,
    );
    const pctVsAnnual12 = ratioToNumber(
      annual - annualFromMonthly12,
      annualFromMonthly12,
      8,
    );

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

  const dailyInterpreted = useMemo(() => {
    if (!parsedDaily.ok) return null;
    return fmt(dailyScaled);
  }, [parsedDaily.ok, dailyScaled, currency, displayDecimals, roundDisplay]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleCsvExport = () => {
    if (typeof window === "undefined") return;
    if (!parsedDaily.ok || !breakdownScaled) return;

    const rows: string[][] = [
      ["Daily to Monthly Rent Converter"],
      ["Input daily rent", dailyInterpreted ?? ""],
      ["Currency", currency],
      [
        "Display rounding",
        roundDisplay ? `On (${displayDecimals} decimals)` : "Off",
      ],
      [],
      ["Period", "Amount"],
      ["Hourly", fmt(breakdownScaled.hourly)],
      ["Daily", fmt(breakdownScaled.daily)],
      ["Weekly", fmt(breakdownScaled.weekly)],
      ["2 weeks (14 days)", fmt(breakdownScaled.biweekly)],
      ["4 weeks (28 days)", fmt(breakdownScaled.every4w)],
      ["Monthly", fmt(breakdownScaled.monthly)],
      ["Annual", fmt(breakdownScaled.annual)],
      [],
      ["Comparison", "Amount"],
      ["30-day month", fmt(breakdownScaled.monthByThirty)],
      ["Average month", fmt(breakdownScaled.monthByAverage)],
      [
        "Average month minus 30-day month",
        fmt(breakdownScaled.monthByThirtyDiff),
      ],
      ["Monthly minus 4-week amount", fmt(breakdownScaled.monthlyMinus4w)],
      [
        "Monthly minus 4-week percentage",
        formatPercent(breakdownScaled.monthlyMinus4wPct, 2),
      ],
      [
        "Annual from 52 weekly payments",
        fmt(breakdownScaled.annualFromWeekly52),
      ],
      [
        "Annual from 12 monthly payments",
        fmt(breakdownScaled.annualFromMonthly12),
      ],
      [
        "365-day annual vs 52 weekly percentage",
        formatPercent(breakdownScaled.pctVsAnnual52, 2),
      ],
      [
        "365-day annual vs 12 monthly percentage",
        formatPercent(breakdownScaled.pctVsAnnual12, 2),
      ],
    ];

    const csv = rows.map(buildCsvRow).join("\n");
    downloadTextFile(
      "daily-to-monthly-rent-conversion.csv",
      csv,
      "text/csv;charset=utf-8",
    );
  };

  const faqData = [
    {
      q: "How do you convert daily rent to monthly rent?",
      a: "This calculator multiplies the daily rent by 365, then divides by 12.",
    },
    {
      q: "Why not just multiply daily rent by 30?",
      a: "A 30-day month is a shortcut. The main result uses the average month length across a 365-day year.",
    },
    {
      q: "Why does the 4-week amount differ from the monthly amount?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days, so the monthly amount is usually higher.",
    },
    {
      q: "Does this match exact totals for short stays?",
      a: "Not always. Short stays may include cleaning fees, taxes, parking, utilities, or other charges.",
    },
    {
      q: "What assumptions does this converter use?",
      a: "It uses 365 days per year, 7 days per week, 14 days per biweekly period, 28 days per 4-week period, and 365 ÷ 12 days per average month.",
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
        name: "Daily to Monthly Rent Converter",
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
    name: "Daily to Monthly Rent Converter",
    description:
      "Convert daily rent to monthly rent and compare it with a 30-day estimate.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Daily to monthly rent conversion",
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
                  Daily to monthly rent calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Daily to Monthly Rent Converter
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-600">
                  Convert daily rent into a monthly amount. The calculator also
                  shows related rent breakdowns for comparison.
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

            <div className="grid gap-y-3 gap-x-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Daily rent amount
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    inputMode="decimal"
                    value={amountDisplayValue}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                    placeholder="e.g. 70 or 70.50"
                    className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                    className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-amount-help" className="mt-2 text-xs text-slate-600">
                  Enter the daily rent amount. Currency symbols, commas, and
                  decimals are accepted.
                </p>

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
                    className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedDaily.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 shadow-sm sm:px-6 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label="Monthly amount results"
            >
              <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="mt-4 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-900">
                  Monthly amount
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Enter a valid daily amount above to see the monthly amount
                    and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                      <div className="whitespace-nowrap text-3xl font-extrabold tabular-nums text-emerald-800 sm:text-5xl">
                        {fmt(monthlyHeadlineScaled)}
                      </div>
                      <p className="mt-2 text-sm text-emerald-700">
                        Based on daily rent multiplied by 365, then divided by
                        12.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdownScaled!.hourly, "hourly"],
                        ["Daily", breakdownScaled!.daily, "daily"],
                        ["Weekly", breakdownScaled!.weekly, "weekly"],
                        [
                          "2 weeks (14 days)",
                          breakdownScaled!.biweekly,
                          "biweekly",
                        ],
                        [
                          "4 weeks (28 days)",
                          breakdownScaled!.every4w,
                          "every_4_weeks",
                        ],
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm"
                      >
                        <div className="text-xs font-medium text-slate-600">
                          {label}
                        </div>
                        <div className="mt-1 whitespace-nowrap text-lg font-bold tabular-nums text-slate-900">
                          {fmt(val)}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-emerald-700">
                        30-day comparison
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            30-day month
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdownScaled!.monthByThirty)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            Average month
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdownScaled!.monthByAverage)}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                          <div className="text-xs text-slate-600">
                            Difference
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {fmt(breakdownScaled!.monthByThirtyDiff)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600">
                        The main result uses the average month length. The
                        30-day amount is shown as a common shortcut.
                      </p>
                    </div>

                    {breakdownScaled && (
                      <FourWeekVsMonthly
                        monthlyMinus4w={breakdownScaled.monthlyMinus4w}
                        monthlyMinus4wPct={breakdownScaled.monthlyMinus4wPct}
                        fmt={fmt}
                        formatPercent={formatPercent as any}
                      />
                    )}
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
          / Daily to Monthly Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-3xl text-center text-slate-600">
          These answers explain how daily rent is converted to monthly rent and
          why a 30-day shortcut can differ.
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
