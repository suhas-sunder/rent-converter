import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/home/HowItWorks";
import ToolFit from "~/client/components/home/ToolFit";

const SITE_URL = "https://www.rentconverter.com/";

export const meta: Route.MetaFunction = () => [
  {
    title: "Rent Converter: Weekly, Monthly, Daily & Annual",
  },
  {
    name: "description",
    content:
      "Convert rent between weekly, monthly, biweekly, 4-week, daily, hourly, and annual amounts. See true monthly cost, annual cost, and 4-week vs monthly differences. Free, private, no signup.",
  },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Converter: Weekly, Monthly, Daily & Annual",
  },
  {
    property: "og:description",
    content:
      "Convert rent across weekly, monthly, biweekly, 4-week, daily, hourly, and annual periods with clear assumptions, exact decimal-safe math, and side-by-side results.",
  },
  { property: "og:url", content: SITE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}og-image.jpg` },

  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Converter: Weekly, Monthly, Daily & Annual",
  },
  {
    name: "twitter:description",
    content:
      "Find the true monthly, weekly, daily, hourly, and annual cost of rent with clear assumptions and decimal-safe calculations.",
  },
  { name: "twitter:image", content: `${SITE_URL}og-image.jpg` },

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rc_amount", amount);
    localStorage.setItem("rc_from", from);
    localStorage.setItem("rc_to", to);
    localStorage.setItem("rc_currency", currency);
  }, [amount, from, to, currency]);

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

  const displayMoney = useMemo(() => {
    if (!rawResultR) return "-";
    const scaled = toScaledUnits(rawResultR);
    const roundedScaled = roundScaledToDigits(scaled, 2);
    const dec = scaledToDecimalString(roundedScaled, 2, { fixed: true });

    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [rawResultR, currency]);

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
    if (!r) return "-";
    const scaled = toScaledUnits(r);
    const roundedScaled = roundScaledToDigits(scaled, 2);
    const dec = scaledToDecimalString(roundedScaled, 2, { fixed: true });

    return formatMoneyFromDecimalString(dec, currency, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
      q: "What does this rent converter calculate?",
      a: "It converts a rent amount from one payment period to another, including hourly, daily, weekly, biweekly, every 4 weeks, monthly, and annual rent. It is useful when a listing, lease, or budget uses a different rent frequency than the one you normally compare.",
    },
    {
      q: "How do you convert weekly rent to monthly rent?",
      a: "The calculator converts the weekly rent into a daily rate using 7 days, then converts that daily rate into a true average month using 365 ÷ 12 days. This is more accurate than multiplying weekly rent by 4 because most months are longer than 28 days.",
    },
    {
      q: "Why is every-4-weeks rent different from monthly rent?",
      a: "Every 4 weeks means a 28-day period. A true average month is about 30.42 days. That difference matters because 13 four-week periods fit into a 52-week year, while monthly rent is usually paid 12 times per year.",
    },
    {
      q: "Does this include utilities, parking, fees, or deposits?",
      a: "No. The calculator only converts the rent amount you enter. If you want to include utilities, parking, recurring fees, or another fixed monthly cost, add those amounts to the rent before converting.",
    },
    {
      q: "Does the calculator preserve decimals?",
      a: "Yes. The calculator uses decimal-safe math and preserves precision internally. Displayed money values are rounded to cents, while internal calculations preserve precision.",
    },
    {
      q: "Can I save or share the result?",
      a: "Yes. Use the print option to print the result or save it as a PDF from your browser. This is useful when comparing listings, checking a lease, or keeping a copy of your rent calculation.",
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
    name: "Rent Converter: Weekly, Monthly, Daily, Hourly, Biweekly, 4-Week, and Annual Rent",
    description:
      "Convert rent between weekly, monthly, every 4 weeks, biweekly, daily, hourly, and annual periods. See true monthly rent, annual rent, and 4-week vs monthly differences with clear assumptions.",
    url: SITE_URL,
  };

  const monthlyMinus4wPctDisplay = useMemo(() => {
    if (!validation.ok || !breakdown.monthlyMinus4wPct) return "—";
    return percentStringFromRatio(breakdown.monthlyMinus4wPct, 2);
  }, [validation.ok, breakdown.monthlyMinus4wPct]);

  const amountHelpId = "rent-amount-help";
  const amountStatusId = "rent-amount-status";
  const resultRegionId = "converted-rent-region";
  return (
    <main className="bg-sky-50 text-slate-700 scroll-smooth antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              a[href]:after { content: ""; }
              #top-links, #bottom-nav, #export-controls-top, #export-controls-bottom { display: none !important; }
              #converter { padding-bottom: 0 !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            .home-assumptions-clean .border {
              border-width: 0 !important;
            }
            .home-assumptions-clean > div {
              background: #e0f2fe !important;
            }
          `,
        }}
      />

      <section
        id="converter"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white">
          <div className="flex flex-col gap-3 px-5 pb-2 pt-7 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:pt-8">
            <div>
              <p className="mb-2 text-center sm:text-left text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                Rent conversion calculator
              </p>
              <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                Rent Converter: Daily, Weekly, Monthly & Annual
              </h1>
              <p className="hidden md:flex w-full max-w-3xl pt-2 text-slate-700 leading-relaxed">
                Convert rent between daily, weekly, monthly, and yearly rates in
                one click. No sign-up, instant results.
              </p>
            </div>

            <div
              id="export-controls-top"
              data-nosnippet
              className="hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-y-3 gap-x-5 px-5 pb-5 pt-2 sm:px-8 sm:pt-3 md:grid-cols-12">
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
                  className="cursor-pointer w-full min-w-0 rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                  aria-invalid={!validation.ok}
                  aria-describedby={`${amountHelpId} ${amountStatusId}`}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
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
                  className="mt-2 text-sm font-medium text-rose-700"
                  role="alert"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : validation.message ? (
                <p
                  id={amountStatusId}
                  className="mt-2 text-sm text-slate-700"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : (
                <></>
              )}

              {interpretationLine ? (
                <p className="mt-2 text-sm text-slate-700" aria-live="polite">
                  <span className="font-semibold tabular-nums">
                    {interpretationLine}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as Period)}
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-3 text-base font-medium text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-3 text-base font-medium text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                aria-label="To period"
              >
                {PERIOD_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div
            id={resultRegionId}
            className="relative mx-5 mb-6 rounded-[1.5rem] bg-sky-50 p-5 sm:mx-8 sm:p-6"
            role="region"
            aria-label="Converted rent"
            aria-live="polite"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400 rounded-t-2xl" />

            {(() => {
              const selectedLabel =
                (PERIOD_LABEL as any)?.[to] ??
                (PERIOD_LABEL as any)?.[from] ??
                "Converted rent";

              const topTitle = `${selectedLabel} rent`;

              const items = [
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
              ] as const;

              const selectedKey = to as string;
              const selectedItem =
                items.find(([, , key]) => key === selectedKey) ??
                items.find(([, , key]) => key === "monthly");

              const selectedValue = selectedItem?.[1];

              const gridItems = items.filter(
                ([, , key]) => key !== selectedKey,
              );

              return (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-sky-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-800">
                      {topTitle}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                      {validation.ok
                        ? formatRationalMoney(
                            selectedValue ?? breakdown.monthly,
                          )
                        : "—"}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {gridItems.map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs font-semibold text-slate-700">
                          {label} rent
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                          {validation.ok ? formatRationalMoney(val) : "—"}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        4-week vs monthly
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm text-slate-800 leading-relaxed">
                          Monthly minus 4-week ={" "}
                          <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                            {validation.ok
                              ? formatRationalMoney(breakdown.monthlyMinus4w)
                              : "—"}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-800 leading-relaxed">
                          Difference ≈{" "}
                          <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                            {validation.ok ? monthlyMinus4wPctDisplay : "—"}
                          </strong>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                        A 4-week rent period is 28 days. A true average month is
                        about 30.42 days, so the monthly equivalent is
                        different.
                      </p>
                    </div>
                  </div>

                </>
              );
            })()}
          </div>
        </div>
        <div className="home-assumptions-clean">
          <Assumptions />
        </div>
      </section>

      <HowItWorks />
      <ToolFit />

      <section id="faq" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl bg-slate-50 px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                  <span>{f.q}</span>
                  <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>

                <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
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
