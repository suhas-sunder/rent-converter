import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-per-day-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => [
  {
    title: "Rent Per Day Calculator (Daily Rent From Any Pay Cycle)",
  },
  {
    name: "description",
    content:
      "Instantly calculate rent per day from monthly, weekly, 4-week (28-day), biweekly, hourly, or annual amounts. Includes clear breakdowns and a daily total estimator for any number of days using consistent math. Free and private.",
  },
  {
    name: "keywords",
    content:
      "rent per day calculator, daily rent calculator, rent per day from monthly, daily equivalent rent, rent per day from weekly, rent per day from 4 week rent, 28 day rent per day, prorated rent per day",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Per Day Calculator (Daily Rent From Any Pay Cycle)",
  },
  {
    property: "og:description",
    content:
      "Convert rent to a daily amount from monthly, weekly, 28-day, biweekly, hourly, or annual pay cycles. See clear breakdowns and daily totals using consistent assumptions.",
  },
  {
    property: "og:url",
    content: "https://www.rentconverter.com/rent-per-day-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  {
    property: "og:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Per Day Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate daily rent from monthly, weekly, 4-week, biweekly, hourly, or annual amounts with clear breakdowns.",
  },
  {
    name: "twitter:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.rentconverter.com/rent-per-day-calculator",
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

function safeParseDisplayDecimals(raw: string | null): number {
  const fallback = 2;
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
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

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rpdc_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rpdc_display_decimals"),
    );
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
      localStorage.setItem("rpdc_round_display", JSON.stringify(roundDisplay));
      localStorage.setItem("rpdc_display_decimals", String(displayDecimals));
      localStorage.setItem("rpdc_daysCount", daysCount);
    } catch {
      // ignore
    }
  }, [amount, from, currency, roundDisplay, displayDecimals, daysCount]);

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
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

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
      q: "What does “rent per day” mean on this calculator?",
      a: "It is the rent amount converted into a daily equivalent using a consistent 365-day annual basis. This helps compare rent amounts quoted on different billing cycles on the same basis.",
    },
    {
      q: "Why is monthly rent divided by 30 not always the same as this result?",
      a: "Months are not a fixed length. This calculator uses an average month of 365 ÷ 12 days, then expresses the implied annual total as a per-day amount. Dividing by 30 assumes a 30-day month and changes the implied annual total.",
    },
    {
      q: "How does every 4 weeks (28 days) affect daily rent?",
      a: "A 4-week period is exactly 28 days, which makes the daily math straightforward for that billing cycle. The annual total can still differ from monthly because a 4-week schedule often implies 13 payments per year rather than 12.",
    },
    {
      q: "Is this the same as a lease proration calculation for a specific move-in date?",
      a: "No. This is a daily equivalent for comparison. Lease proration depends on the lease wording and how the landlord defines billing months, due dates, and partial periods.",
    },
    {
      q: "What is this most useful for?",
      a: "Comparing listings (weekly vs monthly vs 4-week), translating a quoted rent into a consistent per-day rate, and estimating short windows for budgeting comparisons.",
    },
    {
      q: "What assumptions does the daily calculation use?",
      a: "It uses a 365-day year, a month length of 365 ÷ 12 days (average), and fixed day counts for weekly (7), biweekly (14), and every 4 weeks (28).",
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
      "Convert rent into a daily equivalent from common billing periods using a consistent 365-day annual basis. Includes a full breakdown and a total estimator by day count.",
    url: canonicalUrl,
  };

  const amountInputId = "rpdc_amount_input";
  const amountHelpId = "rpdc_amount_help";
  const amountErrorId = "rpdc_amount_error";

  const periodSelectId = "rpdc_period_select";

  const roundCheckboxId = "rpdc_round_display";
  const decimalsSelectId = "rpdc_display_decimals";

  const daysInputId = "rpdc_days_input";
  const daysErrorId = "rpdc_days_error";

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
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

      <section className="max-w-6xl mx-auto px-6 rc-no-print mt-4 hidden sm:block">
        <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
          <a
            href={safeHref("/")}
            className="inline-flex items-center gap-2 rounded-md text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Daily rent equivalent calculator
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-800 mb-2"
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
                  className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedAmount.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor={periodSelectId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Billing period for that amount
              </label>
              <select
                id={periodSelectId}
                value={from}
                onChange={(e) =>
                  setFrom(isPeriod(e.target.value) ? e.target.value : "monthly")
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
            aria-atomic="true"
          >
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
                <div className="font-semibold text-slate-900">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Fix the input to calculate the daily equivalent.
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
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Rent per day (annual-basis)
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                    {fmtMoney(computed.dailyScaled)}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["Hourly", computed.hourlyScaled, "hourly"],
                          ["Daily", computed.dailyScaled, "daily"],
                          ["Weekly", computed.weeklyScaled, "weekly"],
                          [
                            "Every 2 weeks",
                            computed.biweeklyScaled,
                            "biweekly",
                          ],
                          [
                            "Every 4 weeks (28 days)",
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
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm"
                        >
                          <div className="text-xs text-slate-600">{label}</div>
                          <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {fmtMoney(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-950 mb-2">
                        Total for a chosen number of days
                      </h3>
                      <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                        This multiplies the daily equivalent by a day count for
                        quick comparisons. Lease proration rules can differ from
                        this estimate.
                      </p>

                      <label
                        htmlFor={daysInputId}
                        className="block text-sm font-semibold text-slate-800 mb-2"
                      >
                        Number of days
                      </label>
                      <input
                        id={daysInputId}
                        inputMode="numeric"
                        value={daysCount}
                        onChange={(e) => setDaysCount(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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

                      <div className="mt-4 rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-2">
                        <div className="text-xs text-slate-700">
                          Estimated total
                        </div>
                        <div className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums break-words">
                          {totalForDaysScaled.ok
                            ? fmtMoney(totalForDaysScaled.scaled)
                            : "-"}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 leading-relaxed">
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

          {computed.ok ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
              <div className="text-xs text-slate-700">
                Monthly vs every 4-week (same annual basis)
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-slate-800 leading-relaxed">
                  Monthly minus 4-week:{" "}
                  <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                    {fmtMoney(computed.monthlyMinus4wScaled)}
                  </strong>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed">
                  Difference:{" "}
                  <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                    {safeToFixed(computed.monthlyMinus4wPct, 2)}%
                  </strong>
                </div>
              </div>
            </div>
          ) : null}
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
              <label
                htmlFor={roundCheckboxId}
                className="flex items-center gap-2 text-sm text-slate-800"
              >
                <input
                  id={roundCheckboxId}
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-5 w-5 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 rounded"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">
                  Displayed decimals
                </span>
                <select
                  id={decimalsSelectId}
                  value={displayDecimals}
                  onChange={(e) => {
                    const v = Math.trunc(Number(e.target.value));
                    setDisplayDecimals(
                      v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                    );
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
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
              How this rent per day calculator works
            </h2>

            <p className="text-slate-600 leading-7">
              This page converts your entered rent amount into a{" "}
              <strong>daily equivalent</strong>. It does that by using an annual
              total as the common basis. First, your selected input period is
              converted into an annual amount using a consistent time-length
              model. Then that annual amount is converted into a 1-day value.
              The result is a daily figure that lines up with the rest of the
              breakdown (weekly, biweekly, 28-day, monthly average, and annual)
              without switching assumptions mid-stream.
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
                  Daily equivalent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Days total box
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
                    1) The daily value is derived from an annual basis
                  </h3>

                  <p className="mt-4">
                    The daily equivalent is not computed by taking a shortcut
                    like “monthly ÷ 30” or “weekly ÷ 7 unless the input was
                    weekly.” The page uses one consistent basis for all inputs:
                    <strong>
                      {" "}
                      convert the input to an annual total, then divide by 365
                      to get daily
                    </strong>
                    . That way, daily, weekly, 28-day, and monthly outputs
                    reconcile cleanly because they all come from the same annual
                    number.
                  </p>

                  <p className="mt-4">
                    This matters most when the input is monthly or every 4
                    weeks. A calendar month is not a fixed number of days, and a
                    4-week period is exactly 28 days. If you convert monthly to
                    daily by dividing by 30, you have implicitly changed the
                    annual total. This page avoids that by mapping monthly
                    through an average month length (365 ÷ 12 days) and using a
                    365-day year.
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
                    2) Period definitions used on this page
                  </h3>

                  <p className="mt-4">
                    The converter treats each period label as a time length.
                    That prevents mixing calendar-based payment schedules with
                    fixed-day cycles when you are trying to compare costs.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Assumptions used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours per day</li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    If you are comparing listings, the daily equivalent is often
                    the simplest common unit because it can be scaled into any
                    other period without switching definitions. It also helps
                    you see whether a “monthly” listing and a “4-week” listing
                    that look similar are actually the same annual cost.
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
                    3) What the “total for a chosen number of days” box does
                  </h3>

                  <p className="mt-4">
                    The days-total box is a quick estimator: it multiplies the
                    daily equivalent by a day count you choose. That makes it
                    useful for “what does this difference mean over 10 days, 45
                    days, or 90 days” comparisons, or for rough planning across
                    a defined number of days.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Estimator behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        It uses the <strong>computed daily equivalent</strong>{" "}
                        from this page as the base.
                      </li>
                      <li>
                        It multiplies by your selected day count (no extra
                        assumptions are added).
                      </li>
                      <li>
                        It is not a proration engine and does not model
                        lease-specific rules.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    Real proration depends on what the lease defines as a
                    billing month, due dates, partial periods, and any fees or
                    minimums. This tool keeps that out of scope and stays
                    strictly in “equivalence math” territory.
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
                    Inputs are parsed in a decimal-safe way and calculations
                    preserve precision internally (up to 12 decimals). If
                    rounding is enabled in the UI, it should be display-only:
                    formatting what you see without changing the underlying
                    daily or annual numbers that the breakdown is based on.
                  </p>

                  <p className="mt-4">
                    If an input is invalid or ambiguous, the page should avoid
                    showing a misleading “0” daily result. A daily equivalent is
                    often used as a base for other calculations on the page, so
                    hiding results on bad input is the correct behavior.
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
                    This is an equivalence calculator, not a billing simulator
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The outputs are consistent comparisons derived from explicit
                    time assumptions. They are useful for comparing listings,
                    sanity-checking implied annual cost, and estimating
                    day-based totals. They do not model lease-specific
                    proration, due-date rules, partial periods, or fees.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related tools:{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent converter
                </a>
                ,{" "}
                <a
                  href={safeHref("/monthly-to-daily-rent-converter")}
                  className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  monthly to daily
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-paid-every-4-weeks-calculator")}
                  className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent paid every 4 weeks
                </a>
                .
              </p>
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
