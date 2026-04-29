import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/how-much-rent-can-i-afford-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/how-much-rent-can-i-afford-calculator/HowItWorks";
import ToolFit from "~/client/components/how-much-rent-can-i-afford-calculator/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/how-much-rent-can-i-afford-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const meta: Route.MetaFunction = () => {
  const title = "How Much Rent Can I Afford? | Rent Calculator";
  const description =
    "Estimate how much rent you can afford based on income. Compare monthly, weekly, and 4-week rent targets.";

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

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
  monthly: "Monthly (average)",
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

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
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
    !roundDisplay,
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

  const canShowResults =
    parsedIncome.ok && !!annualIncomeScaled && !!affordability;

  const incomeInterpreted = useMemo(() => {
    if (!parsedIncome.ok) return null;
    return fmt(incomeScaled);
  }, [parsedIncome.ok, incomeScaled, currency, roundDisplay, displayDecimals]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleCsvExport = () => {
    if (typeof window === "undefined") return;
    if (!parsedIncome.ok || !annualIncomeScaled || !affordability) return;

    const rows: string[][] = [
      ["How Much Rent Can I Afford Calculator"],
      ["Input income", incomeInterpreted ?? ""],
      ["Income period", PERIOD_LABEL[period]],
      ["Annualized income", fmt(annualIncomeScaled)],
      ["Currency", currency],
      ["Display rounding", roundDisplay ? `On (${displayDecimals} decimals)` : "Off"],
      [],
      ["Target", "Rent share", "Monthly", "Weekly", "4 weeks", "Annual"],
      ...affordability.map((row) => [
        row.label,
        formatPercent(row.ratio, 0),
        fmt(row.monthly),
        fmt(row.weekly),
        fmt(row.every4w),
        fmt(row.annual),
      ]),
    ];

    const csv = rows.map(buildCsvRow).join("\n");
    downloadTextFile(
      "rent-affordability-estimate.csv",
      csv,
      "text/csv;charset=utf-8",
    );
  };

  const faqData = [
    {
      q: "What does this calculator estimate?",
      a: "It estimates rent targets based on different shares of your income.",
    },
    {
      q: "Is this telling me what rent I should pay?",
      a: "No. It shows income-based rent targets. Your actual budget may be lower depending on debt, savings, utilities, transportation, and other costs.",
    },
    {
      q: "Why does the calculator annualize income?",
      a: "Annualizing income lets different income periods be compared on the same basis.",
    },
    {
      q: "Why are multiple percentages shown?",
      a: "Different households use different rent-to-income targets. Showing 25%, 30%, and 35% makes the tradeoff easier to compare.",
    },
    {
      q: "Does this include utilities or other housing costs?",
      a: "No. It compares rent to income only. Add utilities, parking, insurance, internet, and other housing costs separately.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days.",
    },
    {
      q: "Can this be used with hourly or variable income?",
      a: "It can provide estimates, but irregular income makes fixed-period comparisons less reliable.",
    },
    {
      q: "What assumptions are used?",
      a: "The calculator uses 365 days per year and 365 ÷ 12 days per average month.",
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How Much Rent Can I Afford?",
        item: PAGE_URL,
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
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How Much Rent Can I Afford?",
    description:
      "Estimate rent affordability from income and compare monthly, weekly, and 4-week rent targets.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Rent affordability calculation",
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
                  Rent affordability calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  How Much Rent Can I Afford?
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-600">
                  Estimate rent targets from your income. Compare monthly,
                  weekly, and 4-week rent amounts.
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

            <div className="grid gap-5 md:grid-cols-12">
              <div className="md:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                  placeholder="e.g. 6000 or 6000.00"
                  aria-invalid={!parsedIncome.ok}
                  aria-describedby="rc-income-help rc-income-error"
                />

                <p id="rc-income-help" className="mt-2 text-xs text-slate-600">
                  Enter your income for the selected period. Currency symbols,
                  commas, and decimals are accepted.
                </p>

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
                    className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="font-semibold">Input interpretation note</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedIncome.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Currency
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
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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

            <div
              className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 shadow-sm sm:px-6 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label="Rent affordability results"
            >
              <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="mt-4 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-900">
                  Rent targets
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No results to show yet
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Enter a valid income amount to see rent affordability
                    estimates.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                    <div className="text-xs font-medium text-emerald-700">
                      Annualized income
                    </div>
                    <div className="mt-1 whitespace-nowrap text-3xl font-extrabold tabular-nums text-emerald-800 sm:text-5xl">
                      {fmt(annualIncomeScaled as bigint)}
                    </div>
                    <p className="mt-2 text-sm text-emerald-700">
                      Based on the income amount and period selected above.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {affordability!.map((row) => (
                      <div
                        key={row.ratio}
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm"
                      >
                        <div className="text-sm text-slate-600">
                          <strong className="text-slate-900">
                            {Math.round(row.ratio * 100)}%
                          </strong>{" "}
                          of income{" "}
                          <span className="text-slate-500">({row.label})</span>
                        </div>

                        <div className="mt-2 whitespace-nowrap text-xl font-extrabold tabular-nums text-slate-900">
                          {fmt(row.monthly)} / month
                        </div>

                        <div className="mt-2 whitespace-nowrap text-sm tabular-nums text-slate-800">
                          {fmt(row.weekly)} / week
                        </div>

                        <div className="whitespace-nowrap text-sm tabular-nums text-slate-800">
                          {fmt(row.every4w)} / 4 weeks
                        </div>

                        <div className="mt-3 whitespace-nowrap text-xs tabular-nums text-slate-600">
                          Annual rent: {fmt(row.annual)}
                        </div>

                        <div className="mt-2 text-xs text-slate-600">
                          Rent share: {formatPercent(row.ratio, 0)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed text-slate-700">
                      These are income-share estimates. Actual affordability
                      depends on your full budget.
                    </p>
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
          / How Much Rent Can I Afford?
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-600">
          These answers explain how rent targets are estimated from income and
          why actual affordability can differ.
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