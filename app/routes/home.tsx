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
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear, consistent assumptions. Decimal-safe input and clear breakdown.",
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
      "Convert rent between weekly, monthly, biweekly, every 4 weeks (28 days), daily, hourly, and annual. Decimal-safe input and clear assumptions.",
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
      "Accurate rent period conversions with decimal-safe parsing, clear assumptions, and a full breakdown.",
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
  "/rent-split-calculator",
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

function safeDisplayDecimals(value: string | null, fallback: 0 | 2 | 4 | 6) {
  if (value === null) return fallback;
  const n = Number(value);
  if (n === 0 || n === 2 || n === 4 || n === 6) return n as 0 | 2 | 4 | 6;
  return fallback;
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
  const rr = normRational(r);
  return (rr.n * SCALE) / rr.d;
}

function absBigInt(x: bigint) {
  return x < 0n ? -x : x;
}

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
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
  const fracPart = x % SCALE;

  const fracStr6 = fracPart.toString().padStart(6, "0");
  const fracStr = d === 0 ? "" : fracStr6.slice(0, d);

  let out = d === 0 ? intPart.toString() : `${intPart.toString()}.${fracStr}`;

  if (opts?.trimTrailingZeros && d > 0) {
    out = out.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
  }

  if (opts?.fixed && d > 0) {
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

  const sanitized = raw.replace(/[^\d.,+\-()\s$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "");

  const isParenNeg =
    sanitized.includes("(") &&
    sanitized.includes(")") &&
    !sanitized.includes("-");
  const noParens = sanitized.replace(/[()]/g, "");

  const s0 = noParens.replace(/[$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "").replace(/\s+/g, "");

  if (!s0) return { ok: false, error: "Enter a rent amount." };

  const signCount = (s0.match(/[+\-]/g) ?? []).length;
  if (signCount > 1) {
    return {
      ok: false,
      error: "That number format looks unclear. Remove extra + or - signs.",
    };
  }

  let s = s0;
  const hasMinus = s.includes("-");
  s = s.replace(/[+\-]/g, "");
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

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot !== -1 && lastComma !== -1) {
    const decimalSep = lastDot > lastComma ? "." : ",";
    const thousandsSep = decimalSep === "." ? "," : ".";
    s = s.split(thousandsSep).join("");
    if (decimalSep === ",") s = s.replace(",", ".");
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error:
          "That number format is ambiguous. Use only one decimal separator (like 1250.50).",
      };
    }
  } else if (lastComma !== -1 && lastDot === -1) {
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
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error: "That number format looks unclear. Try 1250.50 or 1,250.50.",
      };
    }
    s = s.replace(/,/g, "");
  }

  if (s.startsWith(".")) s = `0${s}`;
  if (s.endsWith(".")) s = `${s}0`;

  if (!/^\d+(\.\d+)?$/u.test(s)) {
    return {
      ok: false,
      error:
        "That number format looks unclear. Try 1250.50 or 1,250.50 (and avoid mixed separators).",
    };
  }

  const [intStr, fracStrRaw = ""] = s.split(".");
  const fracStr = fracStrRaw.slice(0, 6);
  const fracPadded = fracStr.padEnd(6, "0");

  const intPart = BigInt(intStr || "0");
  const fracPart = BigInt(fracPadded || "0");

  const scaled = intPart * SCALE + fracPart;

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

function formatGroupedNumberFromDecimalString(
  decimalStr: string,
  opts: { minimumFractionDigits: number; maximumFractionDigits: number },
) {
  const n = Number(decimalStr);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat(undefined, {
    useGrouping: true,
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: opts.maximumFractionDigits,
  }).format(n);
}

const DAYS_PER_PERIOD: Record<Exclude<Period, "hourly">, Rational> = {
  daily: { n: 1n, d: 1n },
  weekly: { n: 7n, d: 1n },
  biweekly: { n: 14n, d: 1n },
  every_4_weeks: { n: 28n, d: 1n },
  monthly: { n: 365n, d: 12n },
  annual: { n: 365n, d: 1n },
};

function toDailyRate(amount: Rational, from: Period): Rational {
  if (from === "hourly") {
    return mulR(amount, { n: 24n, d: 1n });
  }
  const days = DAYS_PER_PERIOD[from as Exclude<Period, "hourly">];
  return divR(amount, days);
}

function fromDailyRate(daily: Rational, to: Period): Rational {
  if (to === "hourly") {
    return divR(daily, { n: 24n, d: 1n });
  }
  const days = DAYS_PER_PERIOD[to as Exclude<Period, "hourly">];
  return mulR(daily, days);
}

function convertRational(amount: Rational, from: Period, to: Period): Rational {
  if (from === to) return amount;
  const daily = toDailyRate(amount, from);
  return fromDailyRate(daily, to);
}

function percentStringFromRatio(ratio: Rational, digits = 2) {
  const pct = mulR(ratio, { n: 100n, d: 1n });
  const scaled = toScaledUnits(pct);
  const rounded = roundScaledToDigits(scaled, Math.max(0, Math.min(6, digits)));
  return `${scaledToDecimalString(rounded, digits, { fixed: true })}%`;
}

function safeEnvIsDev(): boolean {
  try {
    const v = (import.meta as any)?.env?.DEV;
    return Boolean(v);
  } catch {
    return false;
  }
}

export default function Home() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    return localStorage.getItem("rc_amount") ?? "500";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [from, setFrom] = useState<Period>(() => {
    if (typeof window === "undefined") return "weekly";
    return safePeriod(localStorage.getItem("rc_from"), "weekly");
  });

  const [to, setTo] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return safePeriod(localStorage.getItem("rc_to"), "monthly");
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return safeCurrency(localStorage.getItem("rc_currency"), "USD");
  });

  const [roundForDisplay, setRoundForDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeJsonParseBoolean(localStorage.getItem("rc_rounding"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    return safeDisplayDecimals(localStorage.getItem("rc_display_decimals"), 2);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rc_amount", amount);
    localStorage.setItem("rc_from", from);
    localStorage.setItem("rc_to", to);
    localStorage.setItem("rc_currency", currency);
    localStorage.setItem("rc_rounding", JSON.stringify(roundForDisplay));
    localStorage.setItem("rc_display_decimals", String(displayDecimals));
  }, [amount, from, to, currency, roundForDisplay, displayDecimals]);

  const hasInput = useMemo(() => amount.trim().length > 0, [amount]);

  const parsed = useMemo(() => {
    const p = parseMoneyToScaled(amount);
    return p;
  }, [amount]);

  const validation = useMemo(() => {
    if (!hasInput)
      return { ok: false, message: "Enter a rent amount." as string };
    if (!parsed.ok)
      return {
        ok: false,
        message: parsed.error ?? "Enter a valid rent amount.",
      };
    if (parsed.scaled === 0n) {
      return {
        ok: true,
        message:
          "A value of 0 converts to 0. If that is not what you intend, enter your rent above.",
      };
    }
    return { ok: true, message: "" };
  }, [hasInput, parsed.ok, parsed.error, parsed.scaled]);

  const amountR: Rational | null = useMemo(() => {
    if (!validation.ok || !parsed.ok || parsed.scaled === undefined)
      return null;
    return fromScaledUnits(parsed.scaled);
  }, [validation.ok, parsed.ok, parsed.scaled]);

  const rawResultR = useMemo(() => {
    if (!amountR) return null;
    return convertRational(amountR, from, to);
  }, [amountR, from, to]);

  const roundingNote = roundForDisplay
    ? `Display rounded to ${displayDecimals} decimals (math stays exact in decimals up to 6 places).`
    : "No display rounding (shown with up to 12 decimals when available).";

  const displayMoney = useMemo(() => {
    if (!rawResultR) return "—";
    const scaled = toScaledUnits(rawResultR);

    const roundedScaled = roundForDisplay
      ? roundScaledToDigits(scaled, displayDecimals)
      : scaled;

    const dec = scaledToDecimalString(roundedScaled, 6, {
      fixed: roundForDisplay ? displayDecimals > 0 : false,
      trimTrailingZeros: !roundForDisplay,
    });

    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: roundForDisplay ? displayDecimals : 0,
      maximumFractionDigits: roundForDisplay ? displayDecimals : 12,
    });
  }, [rawResultR, roundForDisplay, displayDecimals, currency]);

  const inputGroupedDisplay = useMemo(() => {
    if (amountFocused) return amount;
    if (!hasInput) return amount;
    if (!parsed.ok || parsed.scaled === undefined) return amount;

    const dec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    return formatGroupedNumberFromDecimalString(dec, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }, [amountFocused, amount, hasInput, parsed.ok, parsed.scaled]);

  const interpretationLine = useMemo(() => {
    if (!validation.ok || !parsed.ok || parsed.scaled === undefined)
      return null;

    const raw = amount.trim();
    if (!raw) return null;

    const hasCurrencySymbol = /[$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/u.test(raw);
    const hasWhitespace = /\s/u.test(raw);
    const startsWithDot = raw.startsWith(".");
    const endsWithDot = raw.endsWith(".");
    const hasComma = raw.includes(",");
    const hasDot = raw.includes(".");
    const isSimple = /^\d+(\.\d+)?$/u.test(raw);

    const shouldShow =
      !isSimple &&
      (startsWithDot ||
        endsWithDot ||
        hasCurrencySymbol ||
        hasWhitespace ||
        (hasComma && !hasDot) ||
        (hasComma && hasDot));

    if (!shouldShow) return null;

    const dec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    const nice = formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    return `Interpreting that as ${nice}.`;
  }, [validation.ok, parsed.ok, parsed.scaled, amount, currency]);

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

  function formatRationalMoney(r: Rational | null) {
    if (!r) return "—";
    const scaled = toScaledUnits(r);

    const roundedScaled = roundForDisplay
      ? roundScaledToDigits(scaled, displayDecimals)
      : scaled;

    const dec = scaledToDecimalString(roundedScaled, 6, {
      fixed: roundForDisplay ? displayDecimals > 0 : false,
      trimTrailingZeros: !roundForDisplay,
    });

    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: roundForDisplay ? displayDecimals : 0,
      maximumFractionDigits: roundForDisplay ? displayDecimals : 12,
    });
  }

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
        // eslint-disable-next-line no-console
        console.warn("[DEV] Parse failed unexpectedly:", c, p.error);
      }
    }

    const a = parseMoneyToScaled("0.1");
    const b = parseMoneyToScaled("0.2");
    if (a.ok && b.ok && a.scaled !== undefined && b.scaled !== undefined) {
      const sum = a.scaled + b.scaled;
      const expected = parseMoneyToScaled("0.3");
      if (
        expected.ok &&
        expected.scaled !== undefined &&
        sum !== expected.scaled
      ) {
        // eslint-disable-next-line no-console
        console.error("[DEV] Decimal drift detected in scaled math.");
      }
    }
  }, []);

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
      q: "Can I save the results?",
      a: "Yes. Use Print / Save PDF to save a copy from your browser.",
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
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear assumptions. Decimal-safe input and a clear breakdown.",
    url: "https://rentconverter.com/",
  };

  const convertSummaryLine = useMemo(() => {
    if (
      !validation.ok ||
      !parsed.ok ||
      parsed.scaled === undefined ||
      !rawResultR
    )
      return "Enter a valid amount to see results.";

    const inputDec = scaledToDecimalString(parsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    const outputScaled = toScaledUnits(rawResultR);

    const outputRounded = roundForDisplay
      ? roundScaledToDigits(outputScaled, displayDecimals)
      : outputScaled;

    const outputDec = scaledToDecimalString(outputRounded, 6, {
      fixed: roundForDisplay ? displayDecimals > 0 : false,
      trimTrailingZeros: !roundForDisplay,
    });

    const inputFormatted = formatMoneyFromDecimalString(inputDec, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    const outputFormatted = formatMoneyFromDecimalString(outputDec, currency, {
      minimumFractionDigits: roundForDisplay ? displayDecimals : 0,
      maximumFractionDigits: roundForDisplay ? displayDecimals : 12,
    });

    return `${inputFormatted} ${PERIOD_LABEL[from].toLowerCase()} ≈ ${outputFormatted} ${PERIOD_LABEL[to].toLowerCase()}.`;
  }, [
    validation.ok,
    parsed.ok,
    parsed.scaled,
    rawResultR,
    roundForDisplay,
    displayDecimals,
    currency,
    from,
    to,
  ]);

  const monthlyMinus4wPctDisplay = useMemo(() => {
    if (!validation.ok || !breakdown.monthlyMinus4wPct) return "—";
    return percentStringFromRatio(breakdown.monthlyMinus4wPct, 2);
  }, [validation.ok, breakdown.monthlyMinus4wPct]);

  const amountHelpId = "rent-amount-help";
  const amountStatusId = "rent-amount-status";
  const resultRegionId = "converted-rent-region";
  const decimalsHelpId = "display-decimals-help";

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
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

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Rent Converter
        </h1>
        <p className="text-slate-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Convert rent between weekly, monthly, every 4 weeks (28 days),
          biweekly, daily, hourly, and annual amounts. This is a comparison
          tool: it uses consistent time-length assumptions so you can compare
          listings fairly.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Instant rent conversion
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={roundForDisplay}
                  onChange={(e) => setRoundForDisplay(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round results for display
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 select-none">
                <span className="sr-only">Display decimals</span>
                <select
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(safeDisplayDecimals(e.target.value, 2))
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  aria-describedby={decimalsHelpId}
                  aria-label="Display decimals"
                >
                  <option value={0}>0 decimals</option>
                  <option value={2}>2 decimals</option>
                  <option value={4}>4 decimals</option>
                  <option value={6}>6 decimals</option>
                </select>
              </label>
            </div>
          </div>

          <p id={decimalsHelpId} className="sr-only">
            Controls how many decimals to show when rounding is enabled.
          </p>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={inputGroupedDisplay}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500 or 1250.50"
                  className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  aria-invalid={!validation.ok}
                  aria-describedby={`${amountHelpId} ${amountStatusId}`}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
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
                <p
                  id={amountStatusId}
                  className="mt-2 text-sm text-rose-700"
                  role="alert"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : validation.message ? (
                <p
                  id={amountStatusId}
                  className="mt-2 text-sm text-slate-600"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : (
                <p
                  id={amountHelpId}
                  className="mt-2 text-xs text-slate-600 leading-relaxed"
                >
                  Accepted examples: <span className="font-semibold">$650</span>
                  , <span className="font-semibold">650.00</span>,{" "}
                  <span className="font-semibold">1,250.50</span>,{" "}
                  <span className="font-semibold">.5</span>,{" "}
                  <span className="font-semibold">12.</span>, or{" "}
                  <span className="font-semibold">1250,50</span> (comma-decimal
                  with 2 digits). Ambiguous inputs are rejected to avoid false
                  results.
                </p>
              )}

              {interpretationLine ? (
                <p className="mt-2 text-sm text-slate-600" aria-live="polite">
                  <span className="font-semibold tabular-nums">
                    {interpretationLine}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                aria-label="From period"
              >
                {PERIOD_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                aria-label="To period"
              >
                {PERIOD_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex md:items-end">
              <button
                type="button"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Swap from and to"
              >
                ⇄
              </button>
            </div>
          </div>

          <div
            id={resultRegionId}
            className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 shadow-sm relative"
            role="region"
            aria-label="Converted rent"
            aria-live="polite"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-200 rounded-t-2xl" />

            <div className="text-sm font-medium text-slate-700">
              Converted rent
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800 tabular-nums leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                {validation.ok ? displayMoney : "—"}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed">
                {validation.ok ? (
                  <>
                    {convertSummaryLine}{" "}
                    <span className="ml-2 text-xs text-slate-600">
                      ({roundingNote})
                    </span>
                  </>
                ) : (
                  "Enter a valid amount to see results."
                )}
              </div>

              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                Assumptions used here: year = 365 days; average month = 365 ÷ 12
                days; week = 7 days; biweekly = 14 days; 4-week = 28 days;
                hourly = 1/24 day. This is for budgeting comparisons, not
                calendar-exact lease proration.
              </div>

              <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                What is included: rent only. Utilities, parking, fees, taxes,
                and deposits are not added unless you include them in your
                input.
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
                    breakdown.every_4_weeks,
                    "every_4_weeks",
                  ],
                  ["Monthly", breakdown.monthly, "monthly"],
                  ["Annual", breakdown.annual, "annual"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="text-xs font-medium text-slate-600">
                    {label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    {validation.ok ? formatRationalMoney(val) : "—"}
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-xs font-medium text-slate-600">
                  4-week vs monthly comparison (time-length model)
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-800 leading-relaxed">
                    Monthly minus 4-week ={" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {validation.ok
                        ? formatRationalMoney(breakdown.monthlyMinus4w)
                        : "—"}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-800 leading-relaxed">
                    Difference ≈{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {validation.ok ? monthlyMinus4wPctDisplay : "—"}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Because an average month (365 ÷ 12 days) is longer than 28
                  days, the monthly-equivalent value is usually higher than the
                  4-week value.
                </p>
              </div>
            </div>

            <div
              id="export-controls"
              className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-600 leading-relaxed">
            Disclaimer: this tool is for budgeting and comparison. Always
            confirm payment schedules and lease terms in your agreement.
          </p>
        </div>
      </section>

      <section id="overview" className="max-w-5xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 tracking-tight">
          What this tool helps you do
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Compare listings fairly
            </h3>
            <p className="mt-2 text-slate-700 text-sm leading-relaxed">
              Weekly, monthly, and 4-week pricing can hide the real time-length
              equivalent. Convert everything to the same period before you
              decide.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/weekly-to-monthly-rent"
                className="text-sky-700 hover:underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Weekly to monthly →
              </SafeLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Understand 4-week and 28-day rent
            </h3>
            <p className="mt-2 text-slate-700 text-sm leading-relaxed">
              A 4-week period is exactly 28 days. An average month is about
              30.42 days. That difference matters when you compare how much time
              your rent covers.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/rent-billed-every-28-days"
                className="text-sky-700 hover:underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Rent billed every 28 days →
              </SafeLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Move from conversion to budget fit
            </h3>
            <p className="mt-2 text-slate-700 text-sm leading-relaxed">
              Conversions help you compare listings. The next step is checking
              whether rent fits your income and take-home pay.
            </p>
            <div className="mt-3 text-sm">
              <SafeLink
                href="/rent-as-percentage-of-income"
                className="text-sky-700 hover:underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Rent as % of income →
              </SafeLink>
            </div>
          </div>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 tracking-tight">
          How rent conversion works
        </h2>

        <p className="text-slate-700 mb-4 leading-relaxed">
          This page uses a consistent comparison model. We treat your input as a
          rate per time period, convert it to a per-day rate, then convert it to
          the target period. This keeps assumptions explicit and avoids close
          enough math.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900 tracking-tight">
          Weekly vs monthly vs every 4 weeks (28 days)
        </h3>
        <p className="text-slate-700 mb-4 leading-relaxed">
          Under this model, the length of each period is what matters:
        </p>
        <ul className="list-disc ml-6 text-slate-700 mb-4 space-y-1 leading-relaxed">
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
        <p className="text-slate-700 mb-4 leading-relaxed">
          If your lease collects payments on specific calendar dates, your real
          cash-flow can differ across months. For due-date planning, use{" "}
          <SafeLink
            href="/rent-due-date-calculator"
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            rent due date calculator
          </SafeLink>
          .
        </p>
      </section>

      <section id="how-it-works" className="max-w-5xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 tracking-tight">
          How it works on RentConverter.com
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ol className="list-decimal ml-6 text-slate-700 space-y-2 leading-relaxed">
            <li>
              Enter the rent amount exactly as written (decimals are kept, up to
              6 places).
            </li>
            <li>
              Choose the period the amount applies to (weekly, monthly, 4-week,
              biweekly, daily, hourly, or annual).
            </li>
            <li>
              We convert through a per-day rate using explicit assumptions
              (365-day year, average month = 365 ÷ 12 days).
            </li>
            <li>
              You get a headline conversion plus a full breakdown across all
              periods.
            </li>
            <li>Print the page to save as a PDF from your browser.</li>
          </ol>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="bottom-nav">
        <OtherUsefulTools />
        <RenterChecklists />
        <RentToolsByCountry />
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. They use
            standard time-length assumptions (365-day year and average month
            length). Always confirm payment schedules and lease terms in your
            agreement.
          </em>
        </p>
      </section>

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
