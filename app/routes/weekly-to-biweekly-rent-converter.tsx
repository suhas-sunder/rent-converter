import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/weekly-to-biweekly-rent-converter";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Biweekly Rent Converter (7-Day vs 14-Day Math)" },
  {
    name: "description",
    content:
      "Instantly convert weekly rent into a biweekly (14-day) amount and see how weekly math carries over across a true 365-day year. Includes a clear breakdown plus monthly vs 4-week (28-day) context. Free and private.",
  },
  {
    name: "keywords",
    content:
      "weekly to biweekly rent, convert weekly rent to biweekly, weekly rent biweekly equivalent, weekly to every 2 weeks rent, 7 day rent to 14 day rent, rent converter weekly to biweekly",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Weekly to Biweekly Rent Converter (7-Day vs 14-Day Math)",
  },
  {
    property: "og:description",
    content:
      "Convert weekly rent to a biweekly amount and clearly see how 7-day and 14-day schedules compare over a full year.",
  },
  {
    property: "og:url",
    content: "https://www.rentconverter.comweekly-to-biweekly-rent-converter",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  {
    property: "og:image",
    content: "https://www.rentconverter.comog-image.jpg",
  },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Biweekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "See the biweekly equivalent of weekly rent and how 7-day math translates to 14-day pay cycles.",
  },
  {
    name: "twitter:image",
    content: "https://www.rentconverter.comog-image.jpg",
  },

  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.rentconverter.comweekly-to-biweekly-rent-converter",
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

/**
 * Internal link whitelist (only routes you know exist).
 * Add more only if they exist in your app.
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
  "/rent-affordability-calculator",
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

  // Context pages
  "/rent-paid-weekly-vs-monthly",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

/** Fixed-point: store up to 12 decimals exactly */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
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

  return out || "—";
}

/**
 * Accepts: $450, 450, 450.00, .5, 12., 450,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 450 or 450.00).`,
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: `Enter a valid ${label} (misplaced minus sign).`,
        warnings,
      };
    }
    return { ok: false, error: `${label} must be 0 or greater.`, warnings };
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
    if (split.length > 2)
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };

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

  return { ok: true, scaled: clamped, warnings };
}

function isAmbiguousRawOnBlur(raw: string): boolean {
  const s0 = (raw ?? "").trim();
  if (!s0) return true;

  const s = s0.replace(/\s+/g, "");
  if (/[.,]$/.test(s)) return true;

  const cleaned = s.replace(/[^\d.,]/g, "");
  if (!cleaned) return true;
  if (/[.,]$/.test(cleaned)) return true;

  return false;
}

function getRawFractionDigitsForPreview(raw: string): number | null {
  const s0 = (raw ?? "").trim();
  if (!s0) return null;

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");
  if (!s) return null;
  if (s.includes("-")) return null;

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
      if (/^\d{1,2}$/.test(after)) decimalSep = ",";
      else if (/^\d{3}$/.test(after) && /^\d{1,3}$/.test(before))
        decimalSep = null;
      else return null;
    } else {
      decimalSep = null;
    }
  }

  if (!decimalSep) return 0;

  const split = s.split(decimalSep);
  if (split.length !== 2) return null;

  const frac = split[1] ?? "";
  if (frac.length === 0) return null;

  const maxDec = Number(MAX_DECIMALS);
  return Math.max(0, Math.min(maxDec, frac.length));
}

function formatNumberPreviewFromScaled(
  scaled: bigint,
  fractionDigits: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "";
  const digits = Math.max(0, Math.min(12, Math.trunc(fractionDigits)));
  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
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
 * Annual equivalence with a 365-day year.
 * For weekly/biweekly/4-week, treat as 7/14/28 day blocks.
 */
function annualizeScaled(valueScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return valueScaled;
    case "monthly":
      return valueScaled * 12n;
    case "every_4_weeks":
      return mulDivRound(valueScaled, 365n, 28n);
    case "biweekly":
      return mulDivRound(valueScaled, 365n, 14n);
    case "weekly":
      return mulDivRound(valueScaled, 365n, 7n);
    case "daily":
      return valueScaled * 365n;
    case "hourly":
      return valueScaled * 24n * 365n;
    default:
      return 0n;
  }
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

function safeParseDisplayDecimals(raw: string | null, fallback = 2): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  if (t === 0 || t === 2 || t === 4 || t === 6) return t;
  return fallback;
}

export default function WeeklyToBiweeklyRent() {
  const pageName = "Weekly to Biweekly Rent Converter";
  const canonicalUrl =
    "https://www.rentconverter.comweekly-to-biweekly-rent-converter";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "450";
    return localStorage.getItem("rc_wtbw_amount") ?? "450";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_wtbw_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (keeps old key rc_wtbw_rounding as fallback)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;

    const newKey = localStorage.getItem("rc_wtbw_round_display");
    if (newKey !== null) return safeParseBoolean(newKey, true);

    const oldKey = localStorage.getItem("rc_wtbw_rounding");
    if (oldKey !== null) return safeParseBoolean(oldKey, true);

    return true;
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_wtbw_display_decimals"),
      2,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtbw_amount", amount);
      localStorage.setItem("rc_wtbw_currency", currency);
      localStorage.setItem(
        "rc_wtbw_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_wtbw_display_decimals", String(displayDecimals));

      // keep legacy key in sync
      localStorage.setItem("rc_wtbw_rounding", JSON.stringify(roundDisplay));
    } catch {}
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    // Source of truth: annual equivalence (365-day year)
    const annual = annualizeScaled(weekly, "weekly");

    // Target: biweekly from annual (keeps one consistent pipeline)
    const biweekly = fromAnnualScaled(annual, "biweekly");

    // Other derived values from the same annual total
    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");
    const monthly = fromAnnualScaled(annual, "monthly");

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? toNumberSafe(monthlyMinus4w) / toNumberSafe(fourWeeks)
        : Number.NaN;

    // Payment-count illustrations (calendar counts) vs day-based annual equivalence
    const annualFromWeekly52 = weekly * 52n;
    const annualFromBiweekly26 = biweekly * 26n;

    // Day-block expectation: biweekly ~= 2x weekly; compute exact delta
    const biweeklyDouble = weekly * 2n;
    const biweeklyDelta = biweekly - biweeklyDouble;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      biweekly,
      annual,
      hourly,
      daily,
      every_4_weeks: fourWeeks,
      monthly,
      monthlyMinus4w,
      monthlyMinus4wPct,
      annualFromWeekly52,
      annualFromBiweekly26,
      biweeklyDouble,
      biweeklyDelta,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
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

  const [amountFocused, setAmountFocused] = useState(false);
  const [amountBlurred, setAmountBlurred] = useState(false);
  const [amountBlurError, setAmountBlurError] = useState<string | null>(null);

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;

    if (!amountBlurred) return amount;

    if (amountBlurError) return amount;

    if (!parsed.ok) return amount;

    const fd = getRawFractionDigitsForPreview(amount);
    if (fd === null) return amount;

    return formatNumberPreviewFromScaled(parsed.p.scaled as bigint, fd);
  }, [amountFocused, amountBlurred, amountBlurError, amount, parsed]);

  useEffect(() => {
    if (!amountBlurred) return;

    const trimmed = (amount ?? "").trim();
    if (!trimmed) {
      setAmountBlurError("Enter weekly rent amount.");
      return;
    }

    if (isAmbiguousRawOnBlur(amount)) {
      setAmountBlurError("That value is incomplete or ambiguous.");
      return;
    }

    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    if (!p.ok) {
      setAmountBlurError(p.error ?? "Enter a valid weekly rent amount.");
      return;
    }

    const fd = getRawFractionDigitsForPreview(amount);
    if (fd === null) {
      setAmountBlurError("That value is incomplete or ambiguous.");
      return;
    }

    setAmountBlurError(null);
  }, [amount, amountBlurred]);

  const faqData = [
    {
      q: "How do you convert weekly rent to biweekly rent?",
      a: "This page uses annual equivalence as the source of truth. Your weekly amount is converted to an annual total using a 365-day year, then expressed as a 14-day (biweekly) equivalent derived from that same annual total.",
    },
    {
      q: "Is biweekly rent always exactly double weekly rent?",
      a: "Under the day-based definitions used here (weekly = 7 days and biweekly = 14 days), the biweekly equivalent is effectively 2x the weekly amount. Real billing schedules can still differ depending on due dates and how a lease defines per-week payments.",
    },
    {
      q: "Why show an annual basis if the conversion is weekly to biweekly?",
      a: "RentConverter.com uses annual equivalence consistently so all period breakdowns are derived from one annual total. That avoids mixing month-length assumptions with 4-week cycles.",
    },
    {
      q: "Why does the monthly equivalent differ from the 4-week equivalent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days (365 divided by 12). Because the periods are different lengths, their annual-equivalent amounts differ.",
    },
    {
      q: "Does this match exact lease totals when rent is due on specific dates?",
      a: "It estimates period equivalents for comparison. Exact totals depend on the payment schedule, start date, proration, fees, and what is included in rent.",
    },
    {
      q: "What costs are included?",
      a: "Only the rent you enter. Utilities, parking, insurance, fees, and one-time charges are not included unless you add them into the amount first.",
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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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
    name: pageName,
    description:
      "Convert weekly rent to biweekly rent using annual equivalence (365-day year). Includes a full breakdown and monthly vs 4-week context.",
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

      <section className="mt-4 rc-no-print hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Weekly to Biweekly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Instant weekly to biweekly conversion
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

          <div className="grid gap-x-5 gap-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
              </label>

              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => {
                    setAmountFocused(false);
                    setAmountBlurred(true);
                  }}
                  placeholder="e.g. 450"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={amountBlurred && !!amountBlurError}
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

              {amountBlurred && amountBlurError ? (
                <div className="mt-2 text-sm text-rose-700 font-semibold">
                  {amountBlurError}
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.weekly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.biweekly}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {parsed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {parsed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
                    Biweekly equivalent
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {money(computed.biweekly)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourly, "hourly"],
                      ["Daily", computed.daily, "daily"],
                      ["Weekly", computed.weekly, "weekly"],
                      ["Every 2 weeks", computed.biweekly, "biweekly"],
                      [
                        "Every 4 weeks (28 days)",
                        computed.every_4_weeks,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", computed.monthly, "monthly"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Monthly vs 4-week context (same annual basis)
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week ={" "}
                        <strong className="text-slate-900">
                          {money(computed.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {Number.isFinite(computed.monthlyMinus4wPct)
                            ? safeToFixed(computed.monthlyMinus4wPct * 100, 2)
                            : "N/A"}
                          %
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                <div className="font-semibold">
                  Assumptions used on this page
                </div>
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
            </>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print">
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
              <span className="text-xs text-slate-500">Displayed decimals</span>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value));
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
            Internal math is fixed-point up to 12 decimals. This only changes
            what is displayed.
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
            <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                    Weekly to biweekly rent conversion
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a weekly rent amount into a biweekly
                    equivalent using a fixed day-length definition. Weekly is
                    treated as{" "}
                    <span className="font-semibold text-slate-900">7 days</span>{" "}
                    and biweekly is treated as{" "}
                    <span className="font-semibold text-slate-900">
                      14 days
                    </span>
                    . The calculator converts through a consistent annual basis
                    so the full breakdown stays aligned across other periods.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Biweekly = 14 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    365-day model
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Weekly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DEFINITION
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Biweekly = 14 days
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CORE RULE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    biweekly = weekly × 2
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Biweekly + breakdown
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* SectionCard: what it returns */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        What this converter returns
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      You enter a weekly rent amount and the tool returns the
                      biweekly equivalent as a{" "}
                      <span className="font-semibold text-slate-900">
                        14-day
                      </span>{" "}
                      amount. Under these definitions, the biweekly figure is
                      exact: two 7-day weeks make one 14-day period.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Core rule
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Biweekly equivalent
                        </span>{" "}
                        = weekly rent × 2
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is a time-length definition (14 days). It is not a
                        claim about how a lease bills payments across calendar
                        dates.
                      </p>
                    </div>

                    <p>
                      In addition to the headline biweekly number, the page can
                      show a breakdown table across common periods. Those values
                      are derived from one consistent basis so the outputs do
                      not mix assumptions. That matters when you are comparing
                      weekly, biweekly, 4-week (28 days), and monthly averages
                      in the same view.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: how the breakdown stays consistent */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        How the math stays consistent across periods
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Weekly to biweekly is simple, but most people use this
                      page while they are also looking at monthly listings or
                      4-week listings. The breakdown is built to keep those
                      comparisons stable by converting through daily and annual
                      equivalents on a{" "}
                      <span className="font-semibold text-slate-900">
                        365-day year
                      </span>
                      .
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          One shared basis
                        </div>
                        <p className="mt-2">
                          Daily = weekly ÷ 7. Annual = daily × 365. Monthly =
                          annual ÷ 12. 4-week = daily × 28. Biweekly = daily ×
                          14.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What that avoids
                        </div>
                        <p className="mt-2">
                          It avoids treating “monthly” as a fixed number of
                          weeks, and it avoids hiding the difference between 28
                          days and an average month (365 ÷ 12 days).
                        </p>
                      </div>
                    </div>

                    <p>
                      If you only need weekly and biweekly, the direct rule (×
                      2) is the main output. If you are comparing across
                      listings that quote different cycles, the breakdown gives
                      you a common frame without forcing you to do mental
                      conversions or rely on 30-day shortcuts.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: examples + formats */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        Examples you can cross-check
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      These examples match the same rules the calculator uses.
                      If the UI formats the display to fewer decimals, your
                      screen output can look slightly different, but the
                      underlying computation is the same.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Weekly rent{" "}
                        <strong className="text-slate-900">$500</strong> →
                        biweekly equivalent{" "}
                        <strong className="text-slate-900">
                          $500 × 2 = $1,000
                        </strong>
                      </li>
                      <li>
                        Weekly rent{" "}
                        <strong className="text-slate-900">$625.75</strong> →
                        biweekly equivalent{" "}
                        <strong className="text-slate-900">$1,251.50</strong>{" "}
                        (decimals stay part of the calculation)
                      </li>
                      <li>
                        Input <strong className="text-slate-900">1,234</strong>{" "}
                        → comma is treated as thousands grouping (1234). If you
                        meant a decimal, use{" "}
                        <strong className="text-slate-900">1.234</strong>.
                      </li>
                    </ul>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Input formats supported
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Decimals:{" "}
                          <strong className="text-slate-900">1200.50</strong>,{" "}
                          <strong className="text-slate-900">.5</strong>,{" "}
                          <strong className="text-slate-900">12.</strong>
                        </li>
                        <li>
                          Thousands grouping:{" "}
                          <strong className="text-slate-900">1,200</strong>,{" "}
                          <strong className="text-slate-900">1,200.50</strong>
                        </li>
                        <li>
                          Currency symbols are ignored for parsing:{" "}
                          <strong className="text-slate-900">$1,200.50</strong>
                        </li>
                      </ul>
                    </div>

                    <p>
                      If an input could reasonably be interpreted more than one
                      way, the correct behavior is to warn or block instead of
                      guessing and returning a clean-looking but incorrect
                      result.
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    This converts periods, not due dates
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The biweekly result is a 14-day equivalent. It does not
                    infer a calendar schedule and it does not tell you which
                    months have more or fewer payments. If you need a list of
                    due dates over a horizon, use a due-date schedule tool.
                  </p>
                  <div className="mt-4">
                    <a
                      href={safeHref("/rent-due-date-calculator")}
                      className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                    >
                      Rent due date calculator →
                    </a>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related pages:{" "}
                <a
                  href={safeHref("/rent-paid-weekly-vs-monthly")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  weekly vs monthly rent
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent converter
                </a>
                , and{" "}
                <a
                  href={safeHref("/rent-affordability-calculator")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent affordability calculator
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
