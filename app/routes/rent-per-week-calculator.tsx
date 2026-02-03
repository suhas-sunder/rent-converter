import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-per-week-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => [
  {
    title: "Rent Per Week Calculator (Weekly Rent From Any Pay Cycle)",
  },
  {
    name: "description",
    content:
      "Instantly calculate rent per week from monthly, 4-week (28-day), biweekly, daily, hourly, or annual amounts. See clear breakdowns, payment counts, and optional weekly totals using consistent math. Free and private.",
  },
  {
    name: "keywords",
    content:
      "rent per week calculator, weekly rent calculator, rent per week from monthly, weekly equivalent rent, rent per week from 4 week rent, rent per week from biweekly, prorated weekly rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Per Week Calculator (Weekly Rent From Any Pay Cycle)",
  },
  {
    property: "og:description",
    content:
      "Convert rent to a weekly amount from monthly, 28-day, biweekly, daily, hourly, or annual pay cycles with clear breakdowns and consistent assumptions.",
  },
  {
    property: "og:url",
    content: "https://www.rentconverter.com/rent-per-week-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  {
    property: "og:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Per Week Calculator" },
  {
    name: "twitter:description",
    content:
      "See your rent per week from monthly, 4-week, biweekly, daily, hourly, or annual amounts.",
  },
  {
    name: "twitter:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.rentconverter.com/rent-per-week-calculator",
  },
];

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
  monthly: "Monthly",
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
 * Route whitelist. Only include routes you know exist in your app.
 * Add routes only when confirmed.
 */
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
 * Accepts: $650, 650, 650.00, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a rent amount.", warnings };

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
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: "Enter a valid number.", warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: "Enter a valid number.", warnings };

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

type ParsedInt = { ok: boolean; value?: number; error?: string };

function parseNonNegInt(raw: string, label: string, max: number): ParsedInt {
  const s = (raw ?? "").trim();
  if (!s) return { ok: false, error: `Enter ${label}.` };
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned)
    return { ok: false, error: `Enter a whole number for ${label}.` };
  const n = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(n))
    return { ok: false, error: `Enter a valid ${label}.` };
  if (n < 0) return { ok: false, error: `${label} must be 0 or more.` };
  if (n > max) return { ok: false, error: `${label} must be ${max} or less.` };
  return { ok: true, value: n };
}

/**
 * Annual equivalence (365-day year), fixed counts for:
 * - Week = 7 days
 * - Biweekly = 14 days
 * - Every 4 weeks = 28 days
 * - Month = 365/12 days (average month)
 * - Hour = 1/24 day
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

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
}

function safeParseDisplayDecimals(raw: string | null): number {
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
}

function formatPreviewFromNormalized(normalized: string): string {
  const [intStr, fracStr] = normalized.split(".");
  const intNum = Number(intStr);
  const grouped = Number.isFinite(intNum)
    ? new Intl.NumberFormat("en-US", {
        useGrouping: true,
        maximumFractionDigits: 0,
      }).format(intNum)
    : intStr;
  if (typeof fracStr === "string" && fracStr.length > 0) {
    return `${grouped}.${fracStr}`;
  }
  return grouped;
}

export default function RentPerWeekCalculator() {
  const pageName = "Rent Per Week Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-per-week-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpwc_amount") ?? "2000";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const amountIsAmbiguous = useMemo(() => {
    const t = (amount ?? "").trim();
    return t.endsWith(".") || t.endsWith(",");
  }, [amount]);

  const parsedRent = useMemo(() => {
    const base = parseMoneyInputToScaled(amount);
    if (base.ok && amountIsAmbiguous) {
      return {
        ok: false,
        warnings: base.warnings,
        error:
          "That amount looks incomplete. Finish the decimals or remove the trailing separator.",
      } satisfies ParsedScaled;
    }
    return base;
  }, [amount, amountIsAmbiguous]);

  const amountPreviewValue = useMemo(() => {
    if (!parsedRent.ok) return amount;
    const normalized = parsedRent.normalized ?? "";
    if (!normalized) return amount;
    return formatPreviewFromNormalized(normalized);
  }, [parsedRent, amount]);

  const amountDisplayValue = isAmountFocused
    ? amount
    : parsedRent.ok
      ? amountPreviewValue
      : amount;

  const [from, setFrom] = useState<Exclude<Period, "weekly">>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rpwc_from") ?? "monthly";
    // allow "weekly" in storage if it ever existed, but we treat it as valid Period
    const p = isPeriod(saved) ? saved : "monthly";
    return (p === "weekly" ? "monthly" : p) as Exclude<Period, "weekly">;
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rpwc_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (do not affect computation)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rpwc_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rpwc_display_decimals"),
    );
  });

  const [weeksCount, setWeeksCount] = useState<string>(() => {
    if (typeof window === "undefined") return "4";
    return localStorage.getItem("rpwc_weeksCount") ?? "4";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpwc_amount", amount);
    localStorage.setItem("rpwc_from", from);
    localStorage.setItem("rpwc_currency", currency);
    localStorage.setItem("rpwc_round_display", JSON.stringify(roundDisplay));
    localStorage.setItem("rpwc_display_decimals", String(displayDecimals));
    localStorage.setItem("rpwc_weeksCount", weeksCount);
  }, [amount, from, currency, roundDisplay, displayDecimals, weeksCount]);

  const parsedWeeks = useMemo(
    () => parseNonNegInt(weeksCount, "number of weeks", 520),
    [weeksCount],
  );

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedRent.ok)
      errors.push(parsedRent.error ?? "Enter a valid rent amount.");
    if (parsedRent.warnings.length) warnings.push(...parsedRent.warnings);

    if (!parsedWeeks.ok)
      errors.push(parsedWeeks.error ?? "Enter a valid number of weeks.");

    if (errors.length) return { ok: false as const, errors, warnings };

    const rentScaled = parsedRent.scaled as bigint;

    const annualScaled = annualizeFromScaled(rentScaled, from);
    const weeklyScaled = fromAnnualScaled(annualScaled, "weekly");

    const hourlyScaled = fromAnnualScaled(annualScaled, "hourly");
    const dailyScaled = fromAnnualScaled(annualScaled, "daily");
    const biweeklyScaled = fromAnnualScaled(annualScaled, "biweekly");
    const fourWeeksScaled = fromAnnualScaled(annualScaled, "every_4_weeks");
    const monthlyScaled = fromAnnualScaled(annualScaled, "monthly");

    const monthlyMinus4w = monthlyScaled - fourWeeksScaled;

    // % difference vs 4-week: (monthly - 4w)/4w
    const pct =
      fourWeeksScaled === 0n
        ? 0
        : Number(monthlyMinus4w) / Number(fourWeeksScaled);

    const weeksN = parsedWeeks.value as number;
    const totalForWeeksScaled = weeklyScaled * BigInt(weeksN);

    return {
      ok: true as const,
      warnings,
      rentScaled,
      annualScaled,
      weeklyScaled,
      breakdown: {
        hourlyScaled,
        dailyScaled,
        weeklyScaled,
        biweeklyScaled,
        fourWeeksScaled,
        monthlyScaled,
        annualScaled,
        monthlyMinus4w,
        monthlyMinus4wPct: pct,
      },
      weeksN,
      totalForWeeksScaled,
    };
  }, [parsedRent, parsedWeeks, from]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

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

  const faqData = [
    {
      q: "What does “rent per week” mean on this calculator?",
      a: "It is the rent amount converted into a weekly equivalent using annual equivalence (365-day basis). This helps compare listings quoted in different billing cycles on the same weekly basis.",
    },
    {
      q: "Why isn’t monthly rent divided by 4 the same as weekly rent?",
      a: "A month is not exactly 4 weeks. This calculator uses an average month length of 365 ÷ 12 days, converts to an annual total, then expresses that annual total as a weekly equivalent.",
    },
    {
      q: "How does every 4 weeks (28 days) compare to weekly rent?",
      a: "Every 4 weeks is exactly 28 days, which corresponds to 4 weeks. Many 4-week billing schedules imply about 13 payments per year, which can differ from monthly (12 payments per year).",
    },
    {
      q: "Is this the same as prorated rent for a partial month?",
      a: "Not necessarily. This tool is for equivalence and comparison. Lease proration depends on lease terms and how the landlord defines the billing month and due dates.",
    },
    {
      q: "What assumptions does the calculator use?",
      a: "It uses a 365-day year, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average).",
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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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
    name: pageName,
    description:
      "Convert rent to a weekly equivalent from monthly, 4-week, biweekly, daily, hourly, or annual amounts using annual equivalence (365-day basis).",
    url: canonicalUrl,
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

      <section className="max-w-6xl mx-auto px-6 rc-no-print mt-4 sm:block hidden">
        <nav className="text-sm text-slate-500 mb-4">
          <a href={safeHref("/")} className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Weekly rent equivalent
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 2000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedRent.ok}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period for that amount
              </label>
              <select
                value={from}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!isPeriod(v)) return;
                  // This page is "per week", so we exclude selecting "weekly" as input to keep UI consistent,
                  // but conversion code supports it.
                  setFrom(
                    (v === "weekly" ? "monthly" : v) as Exclude<
                      Period,
                      "weekly"
                    >,
                  );
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "annual",
                    "daily",
                    "hourly",
                  ] as const
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!computed.ok ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate weekly rent.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {computed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {computed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {computed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <>
              {computed.warnings.length ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Rent per week
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(computed.weeklyScaled)}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["Hourly", computed.breakdown.hourlyScaled, "hourly"],
                          ["Daily", computed.breakdown.dailyScaled, "daily"],
                          ["Weekly", computed.breakdown.weeklyScaled, "weekly"],
                          [
                            "Every 2 weeks",
                            computed.breakdown.biweeklyScaled,
                            "biweekly",
                          ],
                          [
                            "Every 4 weeks (28 days)",
                            computed.breakdown.fourWeeksScaled,
                            "every_4_weeks",
                          ],
                          [
                            "Monthly (average)",
                            computed.breakdown.monthlyScaled,
                            "monthly",
                          ],
                          ["Annual", computed.breakdown.annualScaled, "annual"],
                        ] as const
                      ).map(([label, val, key]) => (
                        <div
                          key={key}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                        >
                          <div className="text-xs text-slate-500">{label}</div>
                          <div className="mt-1 text-lg font-bold text-slate-800">
                            {fmt(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Total for a chosen number of weeks
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        This multiplies the weekly equivalent by a week count
                        for quick comparisons. Lease proration rules can differ
                        from this estimate.
                      </p>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of weeks
                      </label>
                      <input
                        inputMode="numeric"
                        value={weeksCount}
                        onChange={(e) => setWeeksCount(e.target.value)}
                        placeholder="e.g. 4"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        aria-invalid={!parsedWeeks.ok}
                      />

                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <div className="text-xs text-slate-500">
                          Estimated total
                        </div>
                        <div className="mt-1 text-2xl font-extrabold text-slate-800">
                          {fmt(computed.totalForWeeksScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {fmt(computed.weeklyScaled)} per week ×{" "}
                          {computed.weeksN} weeks
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <div className="text-xs text-slate-500">
                          Annual total (source of truth)
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-800">
                          {fmt(computed.annualScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          365-day basis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                <div className="text-xs text-slate-500">
                  4-week vs monthly comparison
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week ={" "}
                    <strong className="text-slate-900">
                      {fmt(computed.breakdown.monthlyMinus4w)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference ≈{" "}
                    <strong className="text-slate-900">
                      {safeToFixed(
                        computed.breakdown.monthlyMinus4wPct * 100,
                        2,
                      )}
                      %
                    </strong>
                  </div>
                </div>
              </div>
              <section className="mt-2 rc-no-print">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                  Payment counts per year (for comparison)
                </h3>
                <ul className="list-disc ml-6 text-slate-700 mb-4">
                  <li>
                    Weekly: <strong>52</strong> payments per year
                  </li>
                  <li>
                    Every 2 weeks: <strong>26</strong> payments per year
                  </li>
                  <li>
                    Every 4 weeks (28 days): <strong>13</strong> payments per
                    year
                  </li>
                  <li>
                    Monthly: <strong>12</strong> payments per year
                  </li>
                </ul>
              </section>
            </>
          )}

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

        <div className="md:col-span-12 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
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
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Displayed decimals
                </span>
                <select
                  value={displayDecimals}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDisplayDecimals(
                      v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                    );
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Calculations preserve decimals internally (up to 12). Only display
              rounding changes.
            </p>
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
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
              How this rent per week calculator works
            </h2>

            <p className="text-slate-600 leading-7">
              This page converts whatever rent amount you enter into a{" "}
              <strong>weekly equivalent</strong> (a 7-day amount) using a
              consistent annual basis. The calculator first translates your
              input period into an annual total using a 365-day year (and an
              average month length when monthly is involved). It then expresses
              that same annual total as a weekly figure. That “annual first”
              approach is the cleanest way to compare listings that use
              different billing cycles without quietly switching assumptions
              between outputs.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Amount + period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CONVERT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly (7 days)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weeks total box
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Card 1 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    1) Weekly is computed from a single annual basis
                  </h3>

                  <p className="mt-4">
                    The weekly result represents the same underlying cost as
                    your input, expressed as a 7-day equivalent. The page does
                    not use “quick conversions” that can change the implied
                    annual total depending on the input period. Instead, it uses
                    an annual total as the source of truth and derives
                    everything from that.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Assumptions used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Hourly conversions assume 24 hours per day</li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    This is especially helpful when comparing a monthly listing
                    against a 4-week listing. A 4-week period is always 28 days,
                    and a month is longer on average. Converting through an
                    annual total keeps that difference visible across the
                    breakdown rather than hiding it behind a “close enough”
                    shortcut.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    2) What the breakdown cards are for
                  </h3>

                  <p className="mt-4">
                    In addition to the weekly headline number, the page shows a
                    breakdown across common periods. Those values are not
                    independent guesses. They are the same annual total
                    expressed as hourly, daily, weekly, biweekly, every 4 weeks,
                    monthly (average), and annual equivalents. If the breakdown
                    looks inconsistent, that’s a signal that the inputs or the
                    selected period don’t match what you intended.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Common comparisons this supports
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Monthly vs weekly listings (calendar month vs 7-day
                        periods)
                      </li>
                      <li>
                        Every-4-weeks vs weekly (28-day periods vs 7-day
                        periods)
                      </li>
                      <li>
                        Biweekly vs weekly (14-day vs 7-day, useful for pay
                        cycles)
                      </li>
                      <li>
                        Daily or hourly equivalents for short-window comparisons
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    The intent is consistency: once the annual number is fixed,
                    you can interpret each period view without wondering whether
                    a different assumption was used for each output.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    3) The “total for a chosen number of weeks” estimator
                  </h3>

                  <p className="mt-4">
                    The weeks-total box is a quick estimator that multiplies the
                    computed weekly equivalent by a number of weeks you choose.
                    It’s useful for “what does this cost over 6 weeks” or “what
                    is the difference over a 12-week span” comparisons,
                    especially when you’re comparing two listings that quote
                    different cycles.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Estimator scope
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Uses the weekly equivalent computed from the annual
                        basis
                      </li>
                      <li>Multiplies by your chosen number of weeks</li>
                      <li>
                        Does not model due dates, proration, partial periods, or
                        fees
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    If you need calendar-accurate totals based on due dates,
                    month boundaries, or “rent due on the 1st” behavior, that’s
                    a different type of tool. This one stays in equivalence math
                    and week-count estimation.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    4) Decimals and rounding
                  </h3>

                  <p className="mt-4">
                    Decimals are preserved internally (up to 12). If the UI
                    offers rounding, rounding should be display-only so it
                    formats what you see without changing the underlying annual
                    and weekly calculations. The input parser should accept
                    common formats (currency symbols, commas, .5, 12.) and avoid
                    producing a misleading “0” result when input is invalid or
                    ambiguous.
                  </p>
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
                    Scope note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                    Weekly equivalence is a comparison value
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The weekly number is the same annual cost expressed as a
                    7-day equivalent. It does not change how rent is billed
                    under a lease, and it does not apply proration rules,
                    due-date logic, or fees. It’s designed for clean comparisons
                    across billing cycles and quick week-count estimates.
                  </p>
                </div>
              </div>

              <div className="mt-10 rc-no-print">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                  Related pages
                </h3>
                <ul className="list-disc ml-6 text-slate-700">
                  <li>
                    <a
                      href={safeHref("/monthly-to-weekly-rent-converter")}
                      className="text-sky-700 hover:underline"
                    >
                      Monthly to weekly rent converter
                    </a>
                  </li>
                  <li>
                    <a
                      href={safeHref("/rent-paid-every-4-weeks-calculator")}
                      className="text-sky-700 hover:underline"
                    >
                      Rent paid every 4 weeks calculator
                    </a>
                  </li>
                  <li>
                    <a
                      href={safeHref("/how-much-rent-can-i-afford-calculator")}
                      className="text-sky-700 hover:underline"
                    >
                      How much rent can I afford calculator
                    </a>
                  </li>
                </ul>
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
