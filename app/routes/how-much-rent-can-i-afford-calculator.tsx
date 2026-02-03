import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/how-much-rent-can-i-afford-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "How Much Rent Can I Afford? Income-Based Calculator";
  const description =
    "Instantly estimate how much rent you can afford based on income using clear, consistent assumptions. See affordable rent across monthly, weekly, and 4-week (28-day) pay cycles, with exact breakdowns and print-to-PDF. Free and private.";

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
      content:
        "https://www.rentconverter.com/how-much-rent-can-i-afford-calculator",
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
      href: "https://www.rentconverter.com/how-much-rent-can-i-afford-calculator",
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
  monthly: "Monthly (average, 365 ÷ 12)",
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

function groupThousandsEnUSInt(intStr: string): string {
  const s = intStr || "0";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPreviewFromNormalized(normalized: string): string {
  const trimmed = (normalized ?? "").trim();
  if (!trimmed) return "";
  const parts = trimmed.split(".");
  const intPart = parts[0] ?? "0";
  const fracPart = parts.length === 2 ? (parts[1] ?? "") : "";
  const groupedInt = groupThousandsEnUSInt(intPart.replace(/^0+(?=\d)/, ""));
  return fracPart.length ? `${groupedInt}.${fracPart}` : groupedInt;
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
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
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

function sanitizeRawAmountForState(raw: string): string {
  return (raw ?? "").replace(/,/g, "");
}

function normalizeDisplayDecimals(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 2;
  const v = Math.trunc(n);
  return v === 0 || v === 2 || v === 4 || v === 6 ? v : 2;
}

export default function HowMuchRentCanIAfford() {
  const [income, setIncome] = useState<string>(() => {
    if (typeof window === "undefined") return "6000";
    const saved = window.localStorage.getItem("rc_aff_income");
    return sanitizeRawAmountForState(saved ?? "6000");
  });

  const [incomeFocused, setIncomeFocused] = useState<boolean>(false);

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
    return normalizeDisplayDecimals(saved ?? 2);
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

  const incomePreviewValue = useMemo(() => {
    if (incomeFocused) return income;
    if (!parsedIncome.ok) return income;
    const normalized = parsedIncome.normalized ?? "";
    return formatPreviewFromNormalized(normalized);
  }, [incomeFocused, income, parsedIncome.ok, parsedIncome.normalized]);

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

    // Use scaled multiplication via integer numerator over 10000 (4dp ratio)
    const ratioToNum = (r: number) => BigInt(Math.round(r * 10_000));
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

  const canShowResults =
    parsedIncome.ok && !!annualIncomeScaled && !!affordability;

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
        item: "https://www.rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How Much Rent Can I Afford?",
        item: "https://www.rentconverter.com/how-much-rent-can-i-afford-calculator",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How Much Rent Can I Afford?",
    description:
      "Estimate rent affordability from income using annual equivalence (365-day year). Compare affordable rent across monthly, weekly, and every 4 weeks, and print or save as PDF.",
    url: "https://www.rentconverter.com/how-much-rent-can-i-afford-calculator",
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
          / How Much Rent Can I Afford?
        </nav>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-6 mt-4" id="calculator">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Income and affordability estimates
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden sm:flex">
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
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Income amount
              </label>

              <input
                inputMode="decimal"
                value={incomePreviewValue}
                onFocus={() => setIncomeFocused(true)}
                onBlur={() => setIncomeFocused(false)}
                onChange={(e) => {
                  const el = e.currentTarget;
                  const next = el.value;

                  if (next.includes(",")) {
                    const start = el.selectionStart ?? next.length;
                    const before = next.slice(0, start);
                    const cleaned = sanitizeRawAmountForState(next);
                    const newPos = sanitizeRawAmountForState(before).length;

                    setIncome(cleaned);

                    requestAnimationFrame(() => {
                      try {
                        el.setSelectionRange(newPos, newPos);
                      } catch {
                        // ignore
                      }
                    });

                    return;
                  }

                  setIncome(next);
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                placeholder="e.g. 6000 or 6000.00"
                aria-invalid={!parsedIncome.ok}
                aria-describedby="rc-income-help rc-income-error"
              />

              {!parsedIncome.ok ? (
                <p
                  id="rc-income-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {parsedIncome.error}
                </p>
              ) : parsedIncome.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedIncome.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 bg-white text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                aria-label="Income period"
              >
                {(Object.entries(PERIOD_LABEL) as Array<[Period, string]>).map(
                  ([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Currency and display
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 bg-white text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block border-l-4 border-l-sky-200">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Affordability results
              </div>
            </div>

            {!canShowResults ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800">
                <div className="font-semibold">No results to show</div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Enter a valid income amount to see affordability estimates.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-600">
                    Annualized income (365-day basis)
                  </div>
                  <div className="mt-1 text-4xl sm:text-6xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                    {fmt(annualIncomeScaled!)}
                  </div>

                  <div className="mt-2 text-sm text-slate-700 leading-relaxed">
                    Income input:{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {fmt(incomeScaled)}
                    </strong>{" "}
                    ({PERIOD_LABEL[period]})
                  </div>

                  <div className="rc-no-print mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("annualIncome", fmt(annualIncomeScaled!))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
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

                <div className="mt-6 grid gap-4 sm:grid-cols-3 rc-print-block">
                  {affordability!.map((row) => (
                    <div
                      key={row.ratio}
                      className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm"
                    >
                      <div className="text-sm text-slate-600">
                        <strong className="text-slate-900">
                          {Math.round(row.ratio * 100)}%
                        </strong>{" "}
                        of income{" "}
                        <span className="text-slate-500">({row.label})</span>
                      </div>

                      <div className="mt-2 text-xl font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmt(row.monthly)} / month
                      </div>

                      <div className="mt-2 text-sm text-slate-800 tabular-nums whitespace-nowrap">
                        {fmt(row.weekly)} / week
                      </div>

                      <div className="text-sm text-slate-800 tabular-nums whitespace-nowrap">
                        {fmt(row.every4w)} / 4 weeks
                      </div>

                      <div className="mt-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        Annual rent equivalent: {fmt(row.annual)}
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        Rent share: {formatPercent(row.ratio, 0)} of annualized
                        income
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  These are income-share targets, not guarantees. Real
                  affordability depends on utilities, debt, savings, insurance,
                  location, and lease terms.
                </p>
              </>
            )}
          </div>

          <div className="flex my-6 w-full mx-auto ">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                  i
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    Annualization basis
                  </div>

                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Income is annualized using a 365-day year so monthly,
                    weekly, and every-4-weeks comparisons stay consistent.
                  </p>

                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    Annualized income is computed using daily equivalence on a
                    365-day year. Monthly uses 365 ÷ 12 days per month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-600">Rounding (display only)</div>

          <label className="mt-1 flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={roundDisplay}
              onChange={(e) => setRoundDisplay(e.target.checked)}
              className="h-4 w-4 accent-sky-600 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            />
            Round displayed values
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">Displayed decimals</div>
            <select
              value={displayDecimals}
              onChange={(e) =>
                setDisplayDecimals(normalizeDisplayDecimals(e.target.value))
              }
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
              aria-label="Displayed decimals"
            >
              <option value={0}>0</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>
          </div>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Calculations use up to 12 decimals internally. If rounding is
            enabled, displayed values keep exactly your chosen decimals.
          </p>
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
                    How this rent affordability target calculator works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page takes your income and pay period, annualizes it
                    using one consistent time-length model, then applies common
                    rent-share targets so you can see a rent budget in multiple
                    familiar cycles. It avoids guessing what your income
                    includes and avoids producing “clean” results from ambiguous
                    inputs.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Annualized via daily
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Targets: 25% / 30% / 35%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Income + period
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Convert to daily
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ANNUALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Targets + cycles
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: inputs */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 1: Enter income and choose the pay period
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Start with the income figure you want to use for rent
                      planning, then select the period that number belongs to
                      (hourly, daily, weekly, biweekly, 4-week, monthly, or
                      annual). The calculator treats your input as the
                      source-of-truth for the chosen period. It does not adjust
                      for taxes, overtime, bonuses, tips, deductions, benefits,
                      or household size.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Input parsing rules
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Commas are treated as thousands separators:{" "}
                          <span className="font-semibold text-slate-900">
                            1,234
                          </span>{" "}
                          → 1234
                        </li>
                        <li>
                          Decimals are supported and preserved (up to 12
                          places):{" "}
                          <span className="font-semibold text-slate-900">
                            3000.50
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            .5
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            12.
                          </span>
                        </li>
                        <li>
                          If a format could reasonably mean two different
                          numbers, the correct outcome is a warning or an error
                          instead of a guessed result
                        </li>
                      </ul>
                    </div>

                    <p>
                      If you want this page to reflect a specific definition of
                      income, use the number that matches your definition. The
                      tool is deliberately conservative about assumptions so the
                      outputs remain interpretable.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: annualization */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 2: Annualize income using a single daily basis
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The calculator converts your selected pay period into a
                      daily equivalent first, then scales that daily number to
                      an annual total using a fixed 365-day year. This keeps the
                      annual number consistent even when you switch the input
                      period. It also prevents the page from mixing “payment
                      counts” with time-length.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Annualization model
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Annual income
                        </span>{" "}
                        = daily income × 365
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        “Daily income” is derived from the period you chose
                        (weekly ÷ 7, biweekly ÷ 14, hourly × 24, etc.).
                      </p>
                    </div>

                    <p>
                      This design matters because it makes the rest of the page
                      mechanical. Once the annual basis exists, the targets and
                      the output cycles can be generated without changing
                      assumptions.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: targets */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 3: Apply rent-share targets to the annualized income
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The page then applies a set of commonly used rent-share
                      percentages to the annual income figure. Each percentage
                      produces a target rent budget expressed as an annual
                      amount. Showing several targets is the point. It lets you
                      see how sensitive the rent number is to the assumed share,
                      without forcing one “correct” threshold.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          25%
                        </div>
                        <p className="mt-2 text-slate-700">
                          A conservative target for tighter budgets.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          30%
                        </div>
                        <p className="mt-2 text-slate-700">
                          A common benchmark for comparisons.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          35%
                        </div>
                        <p className="mt-2 text-slate-700">
                          A higher target to stress-test fit.
                        </p>
                      </div>
                    </div>

                    <p>
                      The tool does not decide which target is appropriate. It
                      calculates each one from the same annual basis so you can
                      read them as “if rent were X% of income, here is what that
                      implies.”
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: back to cycles + assumptions card */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 4: Convert targets back into familiar pay and billing
                    cycles
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      After the target rent budgets are created on an annual
                      basis, the page converts them into monthly, weekly, and
                      other cycles using the same time-length assumptions used
                      to annualize income. Monthly is computed as annual ÷ 12.
                      Weekly uses 7-day weeks. Every 4 weeks uses 28 days. The
                      point is consistency: every output can be traced back to
                      the same annual target.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Assumptions used
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
                        <li>Year = 365 days</li>
                        <li>Month = 365 ÷ 12 days (average month)</li>
                        <li>Week = 7 days</li>
                        <li>Every 4 weeks = 28 days</li>
                        <li>Hourly conversions assume 24 hours/day</li>
                      </ul>
                    </div>

                    <p>
                      If you are comparing listings billed on different cycles,
                      these outputs are designed to be comparable. They are not
                      a schedule simulator. They are equivalents derived from
                      one model so you can align numbers before making a
                      decision.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: printing + related */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Printing and related pages
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Use your browser’s print dialog to print the results or
                      save them as a PDF. This explanation section is marked
                      no-print so it won’t appear in saved copies.
                    </p>

                    <p className="text-slate-700">
                      Related pages:{" "}
                      <a
                        href={safeHref(
                          "/rent-as-percentage-of-income-calculator",
                        )}
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        rent as percentage of income →
                      </a>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <a
                        href={safeHref("/rent-after-tax-income-calculator")}
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        rent after tax income →
                      </a>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <a
                        href={safeHref("/rent-vs-take-home-pay-calculator")}
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        rent vs take-home pay →
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark utility callout */}
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
                    Targets are math, not policy
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This page converts your income into an annual basis, applies
                    percentage targets, and converts those targets back into
                    familiar cycles. It does not decide what’s “affordable,” and
                    it does not assume what your income includes. If you want
                    the page to reflect a different definition, change the input
                    so the math stays honest.
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
