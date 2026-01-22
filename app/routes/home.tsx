import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/home";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Converter Calculator: Weekly, Monthly, 4-Week (28-Day), Biweekly, Daily, Hourly, Annual",
  },
  {
    name: "description",
    content:
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear, consistent assumptions. Decimal-safe input, private (no signup), and exportable results.",
  },
  {
    name: "keywords",
    content:
      "rent converter, rent calculator, weekly to monthly rent, monthly to weekly rent, 4 week rent, 28 day rent, rent paid every 4 weeks, rent billed every 28 days, biweekly to monthly rent, monthly to annual rent, annual to monthly rent, rent per day, rent per week, rent per hour, rent as percentage of income, how much rent can I afford",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  // Open Graph
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Converter Calculator: Weekly, Monthly, 4-Week (28-Day), Biweekly, Daily, Hourly, Annual",
  },
  {
    property: "og:description",
    content:
      "Convert rent between weekly, monthly, biweekly, every 4 weeks (28 days), daily, hourly, and annual. Decimal-safe input, clear assumptions, and exportable breakdown.",
  },
  { property: "og:url", content: "https://rentconverter.com/" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  // Twitter
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content:
      "Rent Converter Calculator: Weekly, Monthly, 4-Week, Biweekly, Daily, Hourly, Annual",
  },
  {
    name: "twitter:description",
    content:
      "Accurate rent period conversions with decimal-safe parsing, clear assumptions, and a full breakdown you can export.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },
  { rel: "canonical", href: "https://rentconverter.com/" },
];

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

const PERIOD_ORDER: Period[] = [
  "hourly",
  "daily",
  "weekly",
  "biweekly",
  "every_4_weeks",
  "monthly",
  "annual",
];

const CURRENCY_OPTIONS: Array<{ code: string; label: string }> = [
  { code: "USD", label: "USD" },
  { code: "CAD", label: "CAD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "AUD", label: "AUD" },
  { code: "NZD", label: "NZD" },
  { code: "JPY", label: "JPY" },
  { code: "CNY", label: "CNY" },
  { code: "HKD", label: "HKD" },
  { code: "SGD", label: "SGD" },
  { code: "INR", label: "INR" },
  { code: "KRW", label: "KRW" },
  { code: "CHF", label: "CHF" },
  { code: "SEK", label: "SEK" },
  { code: "NOK", label: "NOK" },
  { code: "DKK", label: "DKK" },
  { code: "MXN", label: "MXN" },
  { code: "BRL", label: "BRL" },
];

/**
 * Internal link whitelist constraint: only render links that exist.
 * If a link is not in ROUTE_WHITELIST, it must not appear anywhere in the UI.
 */
const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/monthly-to-weekly-rent",
  "/weekly-to-monthly-rent",
  "/biweekly-to-monthly-rent",
  "/monthly-to-annual-rent",
  "/annual-to-monthly-rent",
  "/monthly-to-daily-rent",
  "/daily-to-monthly-rent",
  "/weekly-to-annual-rent",
  "/annual-to-weekly-rent",
  "/hourly-to-monthly-rent",
  "/monthly-to-hourly-rent",
  "/hourly-to-annual-rent",
  "/annual-to-hourly-rent",
  "/biweekly-to-weekly-rent",
  "/weekly-to-biweekly-rent",
  "/monthly-to-biweekly-rent",
  "/annual-to-biweekly-rent",
  "/biweekly-to-annual-rent",
  "/rent-paid-every-4-weeks",
  "/rent-paid-every-2-weeks",
  "/rent-billed-every-28-days",
  "/rent-per-paycheck",
  "/rent-per-pay-period",
  "/rent-due-date-calculator",
  "/true-cost-of-rent-per-day",
  "/true-cost-of-rent-per-week",
  "/rent-per-day-calculator",
  "/rent-per-week-calculator",
  "/rent-as-percentage-of-income",
  "/how-much-rent-can-i-afford",
  "/rent-after-tax-income",
  "/rent-vs-take-home-pay",
  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",
  "/rent-per-person-calculator",
  "/rent-vs-buy-calculator",
  "/rent-converter",
  "/rent-calculator",
]);

function SafeLink({
  href,
  className,
  children,
  id,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  if (!ROUTE_WHITELIST.has(href)) return null;
  return (
    <a id={id} href={href} className={className}>
      {children}
    </a>
  );
}

function safeJsonParseBoolean(value: string | null, fallback: boolean) {
  if (value === null) return fallback;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "boolean" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safePeriod(value: string | null, fallback: Period): Period {
  if (!value) return fallback;
  const v = value as Period;
  return PERIOD_ORDER.includes(v) ? v : fallback;
}

function safeCurrency(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const v = value.toUpperCase();
  return CURRENCY_OPTIONS.some((c) => c.code === v) ? v : fallback;
}

/**
 * Decimal-safe math (no float drift in computation).
 * We parse user input to a scaled integer (micro-units) and keep all conversions as rational BigInt.
 */
const SCALE = 1_000_000n; // 6 decimal places preserved end-to-end

function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0n ? 1n : x;
}

type Rational = { n: bigint; d: bigint }; // n/d

function normRational(r: Rational): Rational {
  if (r.d === 0n) return { n: 0n, d: 1n };
  let n = r.n;
  let d = r.d;
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcdBigInt(n, d);
  return { n: n / g, d: d / g };
}

function addR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
}

function subR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.d - b.n * a.d, d: a.d * b.d });
}

function mulR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.n, d: a.d * b.d });
}

function divR(a: Rational, b: Rational): Rational {
  if (b.n === 0n) return { n: 0n, d: 1n };
  return normRational({ n: a.n * b.d, d: a.d * b.n });
}

function fromScaledUnits(scaled: bigint): Rational {
  return { n: scaled, d: SCALE };
}

function toScaledUnits(r: Rational): bigint {
  // r is currency units; return scaled integer with truncation toward zero.
  const rr = normRational(r);
  return (rr.n * SCALE) / rr.d;
}

function absBigInt(x: bigint) {
  return x < 0n ? -x : x;
}

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
  // scaled is in micro-units (1e-6). To round to `digits` decimals, we reduce micro-units to 10^(6-digits).
  // digits must be in [0..6]
  const d = Math.max(0, Math.min(6, digits));
  const drop = 6 - d;
  const factor = 10n ** BigInt(drop);
  const half = factor / 2n;

  const neg = scaled < 0n;
  const x = absBigInt(scaled);
  const rounded = (x + half) / factor;
  const back = rounded * factor;
  return neg ? -back : back;
}

function scaledToDecimalString(
  scaled: bigint,
  digits: number,
  opts?: { fixed?: boolean; trimTrailingZeros?: boolean },
): string {
  const d = Math.max(0, Math.min(6, digits));
  const neg = scaled < 0n;
  const x = absBigInt(scaled);

  const intPart = x / SCALE;
  const fracPart = x % SCALE; // 0..999999

  // fracPart is 6 digits; we need d digits
  const fracStr6 = fracPart.toString().padStart(6, "0");
  const fracStr = d === 0 ? "" : fracStr6.slice(0, d);

  let out = d === 0 ? intPart.toString() : `${intPart.toString()}.${fracStr}`;

  if (opts?.trimTrailingZeros && d > 0) {
    out = out.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
  }

  if (opts?.fixed && d > 0) {
    // ensure exactly d decimals
    const m = out.match(/^(-?\d+)(?:\.(\d+))?$/u);
    if (m) {
      const a = m[1];
      const b = (m[2] ?? "").padEnd(d, "0").slice(0, d);
      out = `${a}.${b}`;
    }
  }

  return neg ? `-${out}` : out;
}

/**
 * Robust money/decimal parsing.
 * Rules:
 * - Keep the raw string until validated
 * - Accept: "$1,234.56", "1 234.56", "1250.50", ".5", "12."
 * - Accept comma-decimal ONLY when it is clearly a decimal (exactly 2 digits after comma), like "1250,50"
 * - Reject ambiguous comma usage like "1,2" or "1,234,56"
 * - Reject negatives (rent cannot be negative here)
 */
function parseMoneyToScaled(input: string): {
  ok: boolean;
  scaled?: bigint;
  normalized?: string;
  error?: string;
} {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Enter a rent amount." };

  // Keep digits, separators, sign, parentheses, spaces, and currency symbols.
  const sanitized = raw.replace(/[^\d.,+\-()\s$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "");

  const isParenNeg =
    sanitized.includes("(") &&
    sanitized.includes(")") &&
    !sanitized.includes("-");
  const noParens = sanitized.replace(/[()]/g, "");

  // Strip currency symbols and spaces
  const s0 = noParens
    .replace(/[$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "")
    .replace(/\s+/g, "");

  if (!s0) return { ok: false, error: "Enter a rent amount." };

  // Reject multiple signs
  const signCount = (s0.match(/[+\-]/g) ?? []).length;
  if (signCount > 1) {
    return {
      ok: false,
      error: "That number format looks unclear. Remove extra + or - signs.",
    };
  }

  // Normalize leading sign
  let s = s0;
  const hasMinus = s.includes("-");
  s = s.replace(/[+\-]/g, ""); // remove signs for parsing digits
  const isNegative = isParenNeg || hasMinus;

  if (isNegative) {
    return { ok: false, error: "Rent amount cannot be negative." };
  }

  if (!s) {
    return {
      ok: false,
      error: "That number format looks unclear. Try 1250.50 or 1,250.50.",
    };
  }

  // If both '.' and ',' exist, infer decimal separator as the last occurring one.
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot !== -1 && lastComma !== -1) {
    const decimalSep = lastDot > lastComma ? "." : ",";
    const thousandsSep = decimalSep === "." ? "," : ".";
    // Remove all thousands separators
    s = s.split(thousandsSep).join("");
    // Convert decimal separator to '.'
    if (decimalSep === ",") s = s.replace(",", ".");
    // If still more than one '.', reject
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error:
          "That number format is ambiguous. Use only one decimal separator (like 1250.50).",
      };
    }
  } else if (lastComma !== -1 && lastDot === -1) {
    // Only comma present. Accept as decimal ONLY if exactly 2 digits after comma, else reject ambiguity.
    const commaCount = (s.match(/,/g) ?? []).length;
    if (commaCount !== 1) {
      return {
        ok: false,
        error:
          "That comma format is ambiguous. Use a dot for decimals (example: 1250.50).",
      };
    }
    const parts = s.split(",");
    const right = parts[1] ?? "";
    if (right.length !== 2) {
      return {
        ok: false,
        error:
          "That comma-decimal format is ambiguous. Use 2 digits after the comma (example: 1250,50) or use a dot (1250.50).",
      };
    }
    s = `${parts[0]}.${right}`;
  } else {
    // Only dot or no separator. Validate dot count.
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error:
          "That number format looks unclear. Try 1250.50 or 1,250.50.",
      };
    }
    // Remove any commas (should not exist in this branch, but safe)
    s = s.replace(/,/g, "");
  }

  // Accept ".5" and "12."
  if (s.startsWith(".")) s = `0${s}`;
  if (s.endsWith(".")) s = `${s}0`;

  // Final validation: digits and optional single dot
  if (!/^\d+(\.\d+)?$/u.test(s)) {
    return {
      ok: false,
      error:
        "That number format looks unclear. Try 1250.50 or 1,250.50 (and avoid mixed separators).",
    };
  }

  const [intStr, fracStrRaw = ""] = s.split(".");
  const fracStr = fracStrRaw.slice(0, 6); // preserve up to 6 decimals
  const fracPadded = fracStr.padEnd(6, "0");

  // Avoid empty integer part (should not happen due to regex)
  const intPart = BigInt(intStr || "0");
  const fracPart = BigInt(fracPadded || "0");

  const scaled = intPart * SCALE + fracPart;

  // Range protection (avoid misleading huge numbers)
  // Max: 1,000,000,000 currency units (1e9) with 6 decimals.
  const maxScaled = 1_000_000_000n * SCALE;
  if (scaled > maxScaled) {
    return {
      ok: false,
      error:
        "That value is extremely large. Please enter a smaller rent amount (under 1,000,000,000).",
    };
  }

  return { ok: true, scaled, normalized: s };
}

function formatMoneyFromDecimalString(
  decimalStr: string,
  currency: string,
  opts: { minimumFractionDigits: number; maximumFractionDigits: number },
) {
  const n = Number(decimalStr);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: opts.maximumFractionDigits,
  }).format(n);
}

function toCsvRow(values: Array<string | number>) {
  return values
    .map((v) => {
      const s = String(v);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(",");
}

function downloadTextFile(filename: string, content: string, mime: string) {
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

/**
 * Conversion model (first principles, budget comparison):
 * - Treat entered rent as a rate per chosen period.
 * - Convert via a per-day rate using:
 *   Year = 365 days
 *   Month = 365/12 days (average month)
 *   Week = 7 days
 *   Biweekly = 14 days
 *   4-week = 28 days
 *   Hour = 1/24 day
 *
 * This is not calendar-precise proration for specific dates; it is a consistent comparison model.
 */
const DAYS_PER_PERIOD: Record<
  Exclude<Period, "hourly">,
  Rational
> = {
  daily: { n: 1n, d: 1n },
  weekly: { n: 7n, d: 1n },
  biweekly: { n: 14n, d: 1n },
  every_4_weeks: { n: 28n, d: 1n },
  monthly: { n: 365n, d: 12n },
  annual: { n: 365n, d: 1n },
};

function toDailyRate(amount: Rational, from: Period): Rational {
  if (from === "hourly") {
    // hourly * 24 = daily
    return mulR(amount, { n: 24n, d: 1n });
  }
  const days = DAYS_PER_PERIOD[from as Exclude<Period, "hourly">];
  // amount per period -> per day = amount / days
  return divR(amount, days);
}

function fromDailyRate(daily: Rational, to: Period): Rational {
  if (to === "hourly") {
    // daily / 24 = hourly
    return divR(daily, { n: 24n, d: 1n });
  }
  const days = DAYS_PER_PERIOD[to as Exclude<Period, "hourly">];
  // per day -> per period = daily * days
  return mulR(daily, days);
}

function convertRational(amount: Rational, from: Period, to: Period): Rational {
  if (from === to) return amount;
  const daily = toDailyRate(amount, from);
  return fromDailyRate(daily, to);
}

function percentStringFromRatio(ratio: Rational, digits = 2) {
  // ratio is unitless (e.g. 0.1234). Convert to percent = ratio*100.
  const pct = mulR(ratio, { n: 100n, d: 1n });
  const scaled = toScaledUnits(pct); // micro-percent units of "percent"
  const rounded = roundScaledToDigits(scaled, Math.max(0, Math.min(6, digits)));
  return `${scaledToDecimalString(rounded, digits, { fixed: true })}%`;
}

function safeEnvIsDev(): boolean {
  try {
    // Remix/Vite: import.meta.env.DEV
    const v = (import.meta as any)?.env?.DEV;
    return Boolean(v);
  } catch {
    return false;
  }
}

export default function Home() {
  // ---------------------------
  // Route intent verification
  // ---------------------------
  // Route: "/"
  // Intent: The site-wide hub that converts rent across multiple time periods and provides a full breakdown + exports.
  // SEO uniqueness checklist (internal, not user-visible):
  // - Unique angle: multi-period rent conversion hub (hourly/daily/weekly/biweekly/4-week/monthly/annual) with breakdown + CSV + print-to-PDF
  // - Distinct content: explicitly explains the day-rate model (365-day year, average month 365/12), plus 4-week vs monthly gap
  // - Distinct navigation: links to dedicated conversion and budgeting routes (whitelist-only) and country/tool components
  // - Avoids duplicating single-conversion routes by staying hub-level and offering “compare everything” workflow

  // ---------------------------
  // State (localStorage)
  // ---------------------------
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    return localStorage.getItem("rc_amount") ?? "500";
  });

  const [from, setFrom] = useState<Period>(() => {
    if (typeof window === "undefined") return "weekly";
    return safePeriod(localStorage.getItem("rc_from"), "weekly");
  });

  const [to, setTo] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return safePeriod(localStorage.getItem("rc_to"), "monthly");
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    return safeCurrency(localStorage.getItem("rc_currency"), "CAD");
  });

  // This toggles rounding FOR DISPLAY ONLY (math stays exact rational).
  const [roundForDisplay, setRoundForDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeJsonParseBoolean(localStorage.getItem("rc_rounding"), true);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rc_amount", amount);
    localStorage.setItem("rc_from", from);
    localStorage.setItem("rc_to", to);
    localStorage.setItem("rc_currency", currency);
    localStorage.setItem("rc_rounding", JSON.stringify(roundForDisplay));
  }, [amount, from, to, currency, roundForDisplay]);

  // ---------------------------
  // Robust parsing + validation
  // ---------------------------
  const hasInput = useMemo(() => amount.trim().length > 0, [amount]);

  const parsed = useMemo(() => {
    const p = parseMoneyToScaled(amount);
    return p;
  }, [amount]);

  const validation = useMemo(() => {
    if (!hasInput) return { ok: false, message: "Enter a rent amount." as string };
    if (!parsed.ok) return { ok: false, message: parsed.error ?? "Enter a valid rent amount." };
    if (parsed.scaled === 0n) {
      return {
        ok: true,
        message:
          "A value of 0 converts to 0. If that is not what you intend, enter your rent above.",
      };
    }
    return { ok: true, message: "" };
  }, [hasInput, parsed.ok, parsed.error, parsed.scaled]);

  // Parsed amount as rational currency units
  const amountR: Rational | null = useMemo(() => {
    if (!validation.ok || !parsed.ok || parsed.scaled === undefined) return null;
    return fromScaledUnits(parsed.scaled);
  }, [validation.ok, parsed.ok, parsed.scaled]);

  // ---------------------------
  // Derived results (decimal-safe, no float math)
  // ---------------------------
  const rawResultR = useMemo(() => {
    if (!amountR) return null;
    return convertRational(amountR, from, to);
  }, [amountR, from, to]);

  const displayDigits = roundForDisplay ? 2 : 6;
  const roundingNote = roundForDisplay
    ? "Display rounded to 2 decimals (math stays exact in decimals up to 6 places)."
    : "No display rounding (shown up to 6 decimals).";

  const displayMoney = useMemo(() => {
    if (!rawResultR) return "—";
    const scaled = toScaledUnits(rawResultR);
    const roundedScaled = roundForDisplay
      ? roundScaledToDigits(scaled, 2)
      : scaled;

    const dec = scaledToDecimalString(roundedScaled, displayDigits, {
      fixed: roundForDisplay,
      trimTrailingZeros: !roundForDisplay,
    });

    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: roundForDisplay ? 2 : 0,
      maximumFractionDigits: roundForDisplay ? 2 : 6,
    });
  }, [rawResultR, roundForDisplay, currency, displayDigits]);

  const parsedDisplay = useMemo(() => {
    if (!parsed.ok || parsed.scaled === undefined) return "—";
    // Show the user's parsed value (up to 6 decimals) to avoid false certainty.
    const dec = scaledToDecimalString(parsed.scaled, 6, { trimTrailingZeros: true });
    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }, [parsed.ok, parsed.scaled, currency]);

  const breakdown = useMemo(() => {
    if (!amountR) {
      return {
        hourly: null as Rational | null,
        daily: null as Rational | null,
        weekly: null as Rational | null,
        biweekly: null as Rational | null,
        every_4_weeks: null as Rational | null,
        monthly: null as Rational | null,
        annual: null as Rational | null,
        monthlyMinus4w: null as Rational | null,
        monthlyMinus4wPct: null as Rational | null,
      };
    }

    const hourly = convertRational(amountR, from, "hourly");
    const daily = convertRational(amountR, from, "daily");
    const weekly = convertRational(amountR, from, "weekly");
    const biweekly = convertRational(amountR, from, "biweekly");
    const every_4_weeks = convertRational(amountR, from, "every_4_weeks");
    const monthly = convertRational(amountR, from, "monthly");
    const annual = convertRational(amountR, from, "annual");

    const monthlyMinus4w = subR(monthly, every_4_weeks);
    const monthlyMinus4wPct =
      every_4_weeks.n !== 0n ? divR(monthlyMinus4w, every_4_weeks) : null;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [amountR, from]);

  function formatRationalMoney(r: Rational | null, fixed2: boolean) {
    if (!r) return "—";
    const scaled = toScaledUnits(r);
    const digits = fixed2 ? 2 : 6;
    const roundedScaled = fixed2 ? roundScaledToDigits(scaled, 2) : scaled;
    const dec = scaledToDecimalString(roundedScaled, digits, {
      fixed: fixed2,
      trimTrailingZeros: !fixed2,
    });
    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: fixed2 ? 2 : 0,
      maximumFractionDigits: fixed2 ? 2 : 6,
    });
  }

  // ---------------------------
  // Export helpers (CSV + print-to-PDF workflow)
  // ---------------------------
  const exportCsv = () => {
    if (typeof window === "undefined") return;
    if (!validation.ok || !parsed.ok || parsed.scaled === undefined || !amountR)
      return;

    const assumptions =
      "Year=365 days; Month=365/12 days (average); Week=7 days; Biweekly=14 days; 4 weeks=28 days; Hour=1/24 day";
    const roundingLabel = roundForDisplay
      ? "Display rounded to 2 decimals"
      : "No display rounding (up to 6 decimals shown)";

    const rows: string[] = [];
    rows.push(
      toCsvRow([
        "Input Amount",
        "Input Period",
        "Output Period",
        "Currency",
        "Converted Rent",
        "Rounding",
        "Assumptions",
      ]),
    );

    const inputDec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    const outputScaled = rawResultR ? toScaledUnits(rawResultR) : 0n;
    const outputScaledRounded = roundForDisplay
      ? roundScaledToDigits(outputScaled, 2)
      : outputScaled;

    const outputDec = scaledToDecimalString(outputScaledRounded, roundForDisplay ? 2 : 6, {
      fixed: roundForDisplay,
      trimTrailingZeros: !roundForDisplay,
    });

    rows.push(
      toCsvRow([
        inputDec,
        PERIOD_LABEL[from],
        PERIOD_LABEL[to],
        currency,
        outputDec,
        roundingLabel,
        assumptions,
      ]),
    );

    rows.push("");
    rows.push(toCsvRow(["Breakdown Period", "Value"]));

    const items: Array<[string, Rational | null]> = [
      ["Hourly", breakdown.hourly],
      ["Daily", breakdown.daily],
      ["Weekly", breakdown.weekly],
      ["Every 2 weeks", breakdown.biweekly],
      ["Every 4 weeks (28 days)", breakdown.every_4_weeks],
      ["Monthly", breakdown.monthly],
      ["Annual", breakdown.annual],
    ];

    for (const [label, val] of items) {
      if (!val) {
        rows.push(toCsvRow([label, ""]));
        continue;
      }
      const scaled = toScaledUnits(val);
      const roundedScaled = roundForDisplay
        ? roundScaledToDigits(scaled, 2)
        : scaled;
      const dec = scaledToDecimalString(roundedScaled, roundForDisplay ? 2 : 6, {
        fixed: roundForDisplay,
        trimTrailingZeros: !roundForDisplay,
      });
      rows.push(toCsvRow([label, dec]));
    }

    const csv = rows.join("\n");
    downloadTextFile("rent-conversion.csv", csv, "text/csv;charset=utf-8");
  };

  const printToPdf = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const copyOneRowCsv = async () => {
    if (
      typeof window === "undefined" ||
      !navigator.clipboard ||
      !validation.ok ||
      !parsed.ok ||
      parsed.scaled === undefined ||
      !rawResultR
    )
      return;

    const inputDec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    const outputScaled = toScaledUnits(rawResultR);
    const outputScaledRounded = roundForDisplay
      ? roundScaledToDigits(outputScaled, 2)
      : outputScaled;

    const outputDec = scaledToDecimalString(outputScaledRounded, roundForDisplay ? 2 : 6, {
      fixed: roundForDisplay,
      trimTrailingZeros: !roundForDisplay,
    });

    const header = toCsvRow([
      "Input Amount",
      "Input Period",
      "Output Period",
      "Currency",
      "Converted Rent",
    ]);
    const row = toCsvRow([
      inputDec,
      PERIOD_LABEL[from],
      PERIOD_LABEL[to],
      currency,
      outputDec,
    ]);

    await navigator.clipboard.writeText(`${header}\n${row}`);
  };

  // ---------------------------
  // Dev-only runtime checks (decimal correctness hard mode)
  // ---------------------------
  useEffect(() => {
    if (!safeEnvIsDev()) return;

    const cases = [
      ".5",
      "12.",
      "1,234.56",
      "$1,234.56",
      "1250,50",
      "0.1",
      "12.345",
      "999999999.999999",
    ];

    for (const c of cases) {
      const p = parseMoneyToScaled(c);
      if (!p.ok || p.scaled === undefined) {
        // Accept that some inputs may be rejected by design (ambiguity), but these should pass.
        // If any fails, log it.
        // eslint-disable-next-line no-console
        console.warn("[DEV] Parse failed unexpectedly:", c, p.error);
      }
    }

    // Drift check: 0.1 + 0.2 should equal 0.3 in our scaled integer world.
    const a = parseMoneyToScaled("0.1");
    const b = parseMoneyToScaled("0.2");
    if (a.ok && b.ok && a.scaled !== undefined && b.scaled !== undefined) {
      const sum = a.scaled + b.scaled;
      const expected = parseMoneyToScaled("0.3");
      if (expected.ok && expected.scaled !== undefined && sum !== expected.scaled) {
        // eslint-disable-next-line no-console
        console.error("[DEV] Decimal drift detected in scaled math.");
      }
    }
  }, []);

  // ---------------------------
  // SEO: FAQ + schemas
  // ---------------------------
  const faqData = [
    {
      q: "What does “rent” mean on this page?",
      a: "It means your recurring rent amount for the chosen period (weekly, monthly, 4-week, etc.). This tool does not include utilities, parking, taxes, fees, or deposits unless you manually include them in the number you enter.",
    },
    {
      q: "How do you convert weekly rent to monthly rent?",
      a: "We convert via a consistent day-rate model: weekly is treated as a 7-day rate, then we convert to a daily rate, then to an average month (365 ÷ 12 days). This avoids guesswork and keeps assumptions explicit.",
    },
    {
      q: "Why is every-4-weeks (28-day) rent different from monthly rent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). When you compare them as time lengths, 4-week rent typically comes out lower than the equivalent monthly rent, even if the sticker numbers look similar.",
    },
    {
      q: "Does the calculator preserve decimals?",
      a: "Yes. We parse and compute using decimal-safe math (not floating point). Optional rounding is display-only and clearly labeled.",
    },
    {
      q: "Can I export the results?",
      a: "Yes. Download a CSV breakdown, or use Print / Save PDF to save a PDF from your browser.",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rent Converter Calculator: Weekly, Monthly, 4-Week (28-Day), Biweekly, Daily, Hourly, Annual",
    description:
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear assumptions. Decimal-safe input and exportable results.",
    url: "https://rentconverter.com/",
  };

  // ---------------------------
  // Page
  // ---------------------------
  const convertSummaryLine = useMemo(() => {
    if (!validation.ok || !parsed.ok || parsed.scaled === undefined || !rawResultR)
      return "Enter a valid amount to see results.";

    const inputDec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    const outputScaled = toScaledUnits(rawResultR);
    const outputRounded = roundForDisplay
      ? roundScaledToDigits(outputScaled, 2)
      : outputScaled;

    const outputDec = scaledToDecimalString(outputRounded, roundForDisplay ? 2 : 6, {
      fixed: roundForDisplay,
      trimTrailingZeros: !roundForDisplay,
    });

    const inputFormatted = formatMoneyFromDecimalString(inputDec, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    const outputFormatted = formatMoneyFromDecimalString(outputDec, currency, {
      minimumFractionDigits: roundForDisplay ? 2 : 0,
      maximumFractionDigits: roundForDisplay ? 2 : 6,
    });

    return `${inputFormatted} ${PERIOD_LABEL[from].toLowerCase()} ≈ ${outputFormatted} ${PERIOD_LABEL[to].toLowerCase()}.`;
  }, [validation.ok, parsed.ok, parsed.scaled, rawResultR, roundForDisplay, currency, from, to]);

  const monthlyMinus4wPctDisplay = useMemo(() => {
    if (!validation.ok || !breakdown.monthlyMinus4wPct) return "—";
    return percentStringFromRatio(breakdown.monthlyMinus4wPct, 2);
  }, [validation.ok, breakdown.monthlyMinus4wPct]);

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      {/* Print styles for PDF workflow */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              a[href]:after { content: ""; }
              #top-links, #bottom-nav, #export-controls { display: none !important; }
              #converter { padding-bottom: 0 !important; }
              .shadow-sm { box-shadow: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `,
        }}
      />

      {/* Hero */}
      <section className="pb-10 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly,
          daily, hourly, and annual amounts. This is a comparison tool: it uses
          consistent time-length assumptions so you can compare listings fairly.
        </p>

        <div
          id="top-links"
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm"
        >
          <SafeLink
            href="/weekly-to-monthly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly → Monthly
          </SafeLink>
          <SafeLink
            href="/monthly-to-weekly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Weekly
          </SafeLink>
          <SafeLink
            href="/rent-paid-every-4-weeks"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Every 4 weeks
          </SafeLink>
          <SafeLink
            href="/how-much-rent-can-i-afford"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Affordability
          </SafeLink>
        </div>
      </section>

      {/* Converter */}
      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant rent conversion
            </h2>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={roundForDisplay}
                  onChange={(e) => setRoundForDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round results for display
              </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {/* Amount */}
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500 or 1250.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!validation.ok}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {!validation.ok ? (
                <p className="mt-2 text-xs text-rose-600">{validation.message}</p>
              ) : validation.message ? (
                <p className="mt-2 text-xs text-slate-500">{validation.message}</p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Accepted examples:{" "}
                  <span className="font-semibold">$650</span>,{" "}
                  <span className="font-semibold">650.00</span>,{" "}
                  <span className="font-semibold">1,250.50</span>,{" "}
                  <span className="font-semibold">.5</span>,{" "}
                  <span className="font-semibold">12.</span>, or{" "}
                  <span className="font-semibold">1250,50</span> (comma-decimal
                  with 2 digits). Ambiguous inputs are rejected to avoid false results.
                </p>
              )}

              {validation.ok && parsed.ok && parsed.scaled !== undefined ? (
                <p className="mt-2 text-xs text-slate-500">
                  Parsed as: <span className="font-semibold">{parsedDisplay}</span>{" "}
                  ({currency})
                </p>
              ) : null}
            </div>

            {/* From */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {PERIOD_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {PERIOD_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex md:items-end">
              <button
                type="button"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold hover:bg-sky-50 hover:border-sky-200 transition"
                aria-label="Swap from and to"
              >
                ⇄
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Converted rent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {validation.ok ? displayMoney : "—"}
              </div>

              <div className="text-sm text-slate-600">
                {validation.ok ? (
                  <>
                    {convertSummaryLine}{" "}
                    <span className="ml-2 text-xs text-slate-500">
                      ({roundingNote})
                    </span>
                  </>
                ) : (
                  "Enter a valid amount to see results."
                )}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Assumptions used here: year = 365 days; average month = 365 ÷ 12 days;
                week = 7 days; biweekly = 14 days; 4-week = 28 days; hourly = 1/24 day.
                This is for budgeting comparisons, not calendar-exact lease proration.
              </div>

              <div className="mt-2 text-xs text-slate-500">
                What is included: rent only. Utilities, parking, fees, taxes, and deposits
                are not added unless you include them in your input.
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Hourly", breakdown.hourly, "hourly"],
                  ["Daily", breakdown.daily, "daily"],
                  ["Weekly", breakdown.weekly, "weekly"],
                  ["Every 2 weeks", breakdown.biweekly, "biweekly"],
                  ["Every 4 weeks (28 days)", breakdown.every_4_weeks, "every_4_weeks"],
                  ["Monthly", breakdown.monthly, "monthly"],
                  ["Annual", breakdown.annual, "annual"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {validation.ok ? formatRationalMoney(val, roundForDisplay) : "—"}
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  4-week vs monthly comparison (time-length model)
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week ={" "}
                    <strong className="text-slate-900">
                      {validation.ok
                        ? formatRationalMoney(breakdown.monthlyMinus4w, roundForDisplay)
                        : "—"}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference ≈{" "}
                    <strong className="text-slate-900">
                      {validation.ok ? monthlyMinus4wPctDisplay : "—"}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Because an average month (365 ÷ 12 days) is longer than 28 days,
                  the monthly-equivalent value is usually higher than the 4-week value.
                </p>
              </div>
            </div>

            {/* Exports */}
            <div
              id="export-controls"
              className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="text-xs text-slate-500">
                Export: download CSV, copy a one-row CSV, or print to save as PDF.
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={!validation.ok}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-sky-50 hover:border-sky-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={copyOneRowCsv}
                  disabled={!validation.ok}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-sky-50 hover:border-sky-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy 1-row CSV
                </button>
                <button
                  type="button"
                  onClick={printToPdf}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-sky-50 hover:border-sky-200 transition"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Disclaimer: this tool is for budgeting and comparison. Always confirm payment
            schedules and lease terms in your agreement.
          </p>
        </div>
      </section>

      {/* SEO-rich home content */}
      <section id="overview" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          What this tool helps you do
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Compare listings fairly
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              Weekly, monthly, and 4-week pricing can hide the real time-length
              equivalent. Convert everything to the same period before you decide.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/weekly-to-monthly-rent"
                className="text-sky-700 hover:underline font-semibold"
              >
                Weekly to monthly →
              </SafeLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Understand 4-week and 28-day rent
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              A 4-week period is exactly 28 days. An average month is about 30.42 days.
              That difference matters when you compare “how much time” your rent covers.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/rent-billed-every-28-days"
                className="text-sky-700 hover:underline font-semibold"
              >
                Rent billed every 28 days →
              </SafeLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Move from conversion to budget fit
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              Conversions help you compare listings. The next step is checking whether
              rent fits your income and take-home pay.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/rent-as-percentage-of-income"
                className="text-sky-700 hover:underline font-semibold"
              >
                Rent as % of income →
              </SafeLink>
            </div>
          </div>
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How rent conversion works
        </h2>

        <p className="text-slate-700 mb-4">
          This page uses a consistent comparison model. We treat your input as a rate per
          time period, convert it to a per-day rate, then convert it to the target period.
          This keeps assumptions explicit and avoids “close enough” math.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Weekly vs monthly vs every 4 weeks (28 days)
        </h3>
        <p className="text-slate-700 mb-4">
          Under this model, the length of each period is what matters:
        </p>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            <strong>Week</strong>: 7 days
          </li>
          <li>
            <strong>Every 4 weeks</strong>: 28 days
          </li>
          <li>
            <strong>Average month</strong>: 365 ÷ 12 ≈ 30.42 days
          </li>
        </ul>
        <p className="text-slate-700 mb-4">
          If your lease collects payments on specific calendar dates, your real cash-flow
          can differ across months. For due-date planning, use{" "}
          <SafeLink
            href="/rent-due-date-calculator"
            className="text-sky-700 hover:underline"
          >
            rent due date calculator
          </SafeLink>
          .
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          True cost per day and per week
        </h3>
        <p className="text-slate-700 mb-4">
          Converting everything to daily or weekly equivalents removes ambiguity when
          comparing listings.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 text-sm">
          <SafeLink
            href="/true-cost-of-rent-per-day"
            className="text-sky-700 hover:underline font-semibold"
          >
            True cost per day →
          </SafeLink>
          <SafeLink
            href="/true-cost-of-rent-per-week"
            className="text-sky-700 hover:underline font-semibold"
          >
            True cost per week →
          </SafeLink>
        </div>
      </section>

      {/* How it works (required above FAQ for RentConverter.com) */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works on RentConverter.com
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ol className="list-decimal ml-6 text-slate-700 space-y-2">
            <li>
              Enter the rent amount exactly as written (decimals are kept, up to 6 places).
            </li>
            <li>
              Choose the period the amount applies to (weekly, monthly, 4-week, biweekly,
              daily, hourly, or annual).
            </li>
            <li>
              We convert through a per-day rate using explicit assumptions (365-day year,
              average month = 365 ÷ 12 days).
            </li>
            <li>
              You get a headline conversion plus a full breakdown across all periods.
            </li>
            <li>
              Export as CSV, or print the page to save as a PDF from your browser.
            </li>
          </ol>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">{f.q}</h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom navigation blocks */}
      <div id="bottom-nav">
        <OtherUsefulTools />
        <RenterChecklists />
        <RentToolsByCountry />
      </div>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. They use standard
            time-length assumptions (365-day year and average month length). Always
            confirm payment schedules and lease terms in your agreement.
          </em>
        </p>
      </section>

      {/* JSON-LD */}
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
