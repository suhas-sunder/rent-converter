import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/home";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

const SITE_URL = "https://www.rentconverter.com";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Converter Calculator (Weekly, Monthly, 4-Week, Biweekly, Daily, Hourly)",
  },
  {
    name: "description",
    content:
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear, consistent assumptions. Exact decimals, side-by-side comparisons, and transparent math.",
  },

  // Open Graph
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Converter Calculator (Weekly, Monthly, 4-Week, Biweekly, Daily, Hourly)",
  },
  {
    property: "og:description",
    content:
      "Accurate rent conversions across weekly, monthly, 28-day, biweekly, daily, hourly, and annual periods with clear assumptions and exact decimals.",
  },
  { property: "og:url", content: SITE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

  // Twitter
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Converter Calculator (Weekly, Monthly, 4-Week, Biweekly)",
  },
  {
    name: "twitter:description",
    content:
      "Clear, accurate rent conversions with transparent math and exact decimals.",
  },
  { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

  // Canonical
  { tagName: "link", rel: "canonical", href: SITE_URL },
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
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rent Converter Calculator: Weekly, Monthly, 4-Week (28-Day), Biweekly, Daily, Hourly, Annual",
    description:
      "Convert rent between weekly, monthly, every 4 weeks (28 days), biweekly, daily, hourly, and annual using clear assumptions. Decimal-safe input and a clear breakdown.",
    url: SITE_URL,
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-8 mt-4 sm:mt-6 sm:pb-12"
      >
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center sm:text-left text-2xl sm:text-4xl capitalize font-bold text-sky-800 tracking-tight">
              Instant rent converter
            </h1>

            <div
              id="export-controls"
              className="mt-6 hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p id={decimalsHelpId} className="sr-only">
            Controls how many decimals to show when rounding is enabled.
          </p>

          <div className="grid gap-y-3 gap-x-5 md:grid-cols-12">
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
                  className="cursor-pointer w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
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
                <></>
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
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
                className="cursor-pointer  w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Swap from and to"
              >
                ⇄
              </button>
            </div>
          </div>

          <div
            id={resultRegionId}
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 shadow-sm relative"
            role="region"
            aria-label="Converted rent"
            aria-live="polite"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-200 rounded-t-2xl" />
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Converted rent
              </div>
            </div>

            <div className=" flex flex-col">
              <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                {validation.ok ? displayMoney : "—"}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3 shadow-sm">
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

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div
                id="export-controls"
                className="mb-3 sm:hidden flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window === "undefined") return;
                      window.print();
                    }}
                    className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                  >
                    Print / Save PDF
                  </button>
                </div>
              </div>
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
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
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
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm"
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
                  <h2 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                    How the rent conversion calculator works
                  </h2>
                  <p className="text-center sm:text-left mt-2 text-slate-600 leading-7 max-w-2xl">
                    This tool converts a rent amount from one billing period
                    into equivalent amounts for other periods using a consistent
                    day-based model. It is designed for direct comparison. You
                    enter the number as written, select the period it applies
                    to, and get conversions plus a full breakdown.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Day-based model
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Decimals preserved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    MODEL
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Period → per-day
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Converted values
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DETAILS
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Full breakdown
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: What it does */}
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
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        What this rent conversion tool gives you
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      You provide a rent amount and select the period it applies
                      to (weekly, monthly, every 4 weeks, biweekly, daily,
                      hourly, or annual). The tool returns a headline conversion
                      to your selected target and a breakdown across common
                      periods so you can compare values without switching
                      calculators.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        A consistent conversion model across weekly vs monthly
                        rent, 28-day rent, and annual equivalents
                      </li>
                      <li>
                        Decimals preserved end-to-end so $1,234.56 stays
                        $1,234.56 throughout the math
                      </li>
                      <li>
                        Display rounding only, when shown, with the underlying
                        precision retained in the calculations
                      </li>
                      <li>
                        A readable breakdown you can print and save as a PDF
                        from your browser
                      </li>
                    </ul>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Quick converters
                        </div>
                        <p className="mt-2">
                          If you only need one direction, use a dedicated page
                          for faster input and cleaner output.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <SafeLink
                            href="/weekly-to-monthly-rent-converter"
                            className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                          >
                            Weekly to monthly →
                          </SafeLink>
                          <SafeLink
                            href="/rent-billed-every-4-weeks-calculator"
                            className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                          >
                            Rent billed every 28 days →
                          </SafeLink>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Due date planning
                        </div>
                        <p className="mt-2">
                          If you need calendar dates (not just equivalents), use
                          the due-date tool.
                        </p>
                        <div className="mt-3 text-sm">
                          <SafeLink
                            href="/rent-due-date-calculator"
                            className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                          >
                            Rent due date calculator →
                          </SafeLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: Inputs */}
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
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Inputs and accepted formats
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Enter the rent exactly as shown in the listing. You can
                      include decimals. If you paste values that include commas
                      or currency symbols, the input is interpreted as a number
                      and converted.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Examples of valid input
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>1200</li>
                        <li>1200.50</li>
                        <li>1,200.50</li>
                        <li>$1,200.50</li>
                        <li>.5 (interpreted as 0.5)</li>
                      </ul>
                    </div>

                    <p>
                      Then select the period the number applies to. If the
                      listing says “every 4 weeks” or “every 28 days,” choose
                      the 4-week option. If it says “biweekly,” choose biweekly.
                      If the listing is monthly, choose monthly.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: Assumptions */}
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
                          d="M5 12h14M12 5v14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Assumptions used in conversions
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Conversions are calculated through a per-day rate. Period
                      lengths are fixed so the model stays consistent across
                      every conversion on the site.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Period lengths
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-semibold text-slate-900">
                            Week:
                          </span>{" "}
                          7 days
                        </li>
                        <li>
                          <span className="font-semibold text-slate-900">
                            Every 4 weeks:
                          </span>{" "}
                          28 days
                        </li>
                        <li>
                          <span className="font-semibold text-slate-900">
                            Year:
                          </span>{" "}
                          365 days
                        </li>
                        <li>
                          <span className="font-semibold text-slate-900">
                            Average month:
                          </span>{" "}
                          365 ÷ 12 ≈ 30.42 days
                        </li>
                      </ul>
                    </div>

                    <p>
                      If you need calendar-specific schedules (for example, “due
                      on the 1st”), conversions are still useful for comparing
                      value, but dates come from the due-date calculator instead
                      of the conversion model.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: Output + rounding */}
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
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Output you get and how rounding is handled
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      You get a primary converted result plus a breakdown across
                      other periods. The breakdown is meant for comparison
                      across listings that quote different billing cycles.
                    </p>

                    <p>
                      Rounding is display-only. The underlying calculation keeps
                      your decimals, then formats the final values for
                      readability. If a value is shown with fewer decimals, it
                      is not because precision was discarded during the math.
                      This avoids “looks clean but compares wrong” outputs.
                    </p>

                    <div className="mt-4 rounded-2xl bg-sky-50 ring-1 ring-sky-200/70 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Practical note for 4-week (28-day) listings
                      </div>
                      <p className="mt-2">
                        “Every 4 weeks” is a fixed 28-day cycle. When you
                        convert it to a monthly equivalent, you are comparing on
                        the monthly scale using the model’s average month
                        length. That is the intended use of the conversion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark callout block like the reference file */}
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
                    Conversions are equivalents, not calendar promises
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This tool converts amounts by time coverage using fixed
                    period lengths. It does not generate or predict calendar
                    payment dates. If you need the exact sequence of due dates
                    for a lease schedule, use the due-date calculator.
                  </p>
                  <div className="mt-4">
                    <SafeLink
                      href="/rent-due-date-calculator"
                      className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                    >
                      Rent due date calculator →
                    </SafeLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
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

      <div id="bottom-nav">
        <OtherUsefulTools />
        <RenterChecklists />
        <RentToolsByCountry />
      </div>

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
