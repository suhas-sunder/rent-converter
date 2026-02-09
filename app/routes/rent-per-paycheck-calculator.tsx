import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-per-paycheck-calculator";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Per Paycheck Calculator (How Much to Set Aside Each Pay)";
  const description =
    "Instantly calculate how much rent to set aside from each paycheck. See rent per weekly, biweekly, semimonthly, or monthly pay using clear assumptions, payment counts, and exact breakdowns. Free and private.";

  const canonicalUrl =
    "https://www.rentconverter.com/rent-per-paycheck-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent per paycheck, rent per paycheque, rent per paycheck calculator, biweekly paycheck rent, weekly paycheck rent, semimonthly paycheck rent, twice a month pay rent, rent set aside per paycheck, rent budget per paycheck",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Rent Per Paycheck Calculator" },
    {
      name: "twitter:description",
      content:
        "See how much rent to set aside from each paycheck based on your pay frequency.",
    },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },
  ];
};

type RentPeriod =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

const RENT_PERIOD_LABEL: Record<RentPeriod, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average)",
  annual: "Annual",
};

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

const PAY_LABEL: Record<PayFrequency, string> = {
  weekly: "Weekly paycheck",
  biweekly: "Biweekly paycheck (every 2 weeks)",
  semimonthly: "Semimonthly paycheck (twice per month)",
  monthly: "Monthly paycheck",
};

const PAY_PERIODS_PER_YEAR: Record<PayFrequency, bigint> = {
  weekly: 52n,
  biweekly: 26n,
  semimonthly: 24n,
  monthly: 12n,
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

function isRentPeriod(x: string): x is RentPeriod {
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

function isPayFrequency(x: string): x is PayFrequency {
  return (
    x === "weekly" || x === "biweekly" || x === "semimonthly" || x === "monthly"
  );
}

/**
 * Only include routes you are sure exist.
 * Add routes here only when they are in your known route set.
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

function formatMoneyPreviewFromNormalized(normalized: string): string {
  const [intRaw, fracRaw] = normalized.split(".");
  const intStr = (() => {
    try {
      return BigInt(intRaw || "0").toString();
    } catch {
      return intRaw || "0";
    }
  })();
  const grouped = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fracRaw && fracRaw.length > 0 ? `${grouped}.${fracRaw}` : grouped;
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
      if (/^\d{1,2}$/.test(after) || after === "") {
        // allow "12," (treat as 12)
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
    // allow trailing separators like "12." or "12," by treating empty frac as 0
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

/**
 * Assumptions (source of truth):
 * - Calendar year = 365 days
 * - Monthly rent uses 12 payments/year (calendar-average month)
 * - Weekly rent uses 52 payments/year
 * - Every 2 weeks (biweekly rent) uses 26 payments/year
 * - Every 4 weeks (28-day cycle) uses 13 payments/year
 * - Daily rent uses 365 days/year
 * - Hourly rent uses a standard 2,080-hour work year (40h/week × 52 weeks)
 *
 * Conversions are annual-basis:
 * 1) convert input to annual using the above payment counts
 * 2) derive any other period from annual using the same conventions
 */

function annualizeFromScaled(valueScaled: bigint, period: RentPeriod): bigint {
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

function fromAnnualScaled(annualScaled: bigint, to: RentPeriod): bigint {
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
}

function convertScaled(
  valueScaled: bigint,
  from: RentPeriod,
  to: RentPeriod,
): bigint {
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
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
}

export default function RentPerPaycheck() {
  const pageName = "Rent Per Paycheck Calculator";
  const canonicalUrl =
    "https://www.rentconverter.comrent-per-paycheck-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpc_amount") ?? "2000";
  });

  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rpc_rentPeriod") ?? "monthly";
    return isRentPeriod(saved) ? saved : "monthly";
  });

  const [payFreq, setPayFreq] = useState<PayFrequency>(() => {
    if (typeof window === "undefined") return "biweekly";
    const saved = localStorage.getItem("rpc_payFreq") ?? "biweekly";
    return isPayFrequency(saved) ? saved : "biweekly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rpc_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rpc_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rpc_display_decimals"),
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rpc_amount", amount);
      localStorage.setItem("rpc_rentPeriod", rentPeriod);
      localStorage.setItem("rpc_payFreq", payFreq);
      localStorage.setItem("rpc_currency", currency);
      localStorage.setItem("rpc_round_display", JSON.stringify(roundDisplay));
      localStorage.setItem("rpc_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [amount, rentPeriod, payFreq, currency, roundDisplay, displayDecimals]);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const [amountIsFocused, setAmountIsFocused] = useState<boolean>(false);
  const [amountDisplay, setAmountDisplay] = useState<string>(() => {
    const initialParsed = parseMoneyInputToScaled(
      typeof window === "undefined"
        ? "2000"
        : (localStorage.getItem("rpc_amount") ?? "2000"),
    );
    if (initialParsed.ok && initialParsed.normalized) {
      return formatMoneyPreviewFromNormalized(initialParsed.normalized);
    }
    return typeof window === "undefined"
      ? "2000"
      : (localStorage.getItem("rpc_amount") ?? "2000");
  });

  useEffect(() => {
    if (amountIsFocused) return;
    if (parsedAmount.ok && parsedAmount.normalized) {
      setAmountDisplay(
        formatMoneyPreviewFromNormalized(parsedAmount.normalized),
      );
    } else {
      setAmountDisplay(amount);
    }
  }, [amountIsFocused, parsedAmount.ok, parsedAmount.normalized, amount]);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedAmount.ok)
      errors.push(parsedAmount.error ?? "Enter a valid amount.");
    if (parsedAmount.warnings.length) warnings.push(...parsedAmount.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const amountScaled = parsedAmount.scaled as bigint;
    const annualRentScaled = annualizeFromScaled(amountScaled, rentPeriod);
    const perPaycheckScaled =
      annualRentScaled / (PAY_PERIODS_PER_YEAR[payFreq] || 1n);

    const paycheckBreakdown = {
      weekly: annualRentScaled / PAY_PERIODS_PER_YEAR.weekly,
      biweekly: annualRentScaled / PAY_PERIODS_PER_YEAR.biweekly,
      semimonthly: annualRentScaled / PAY_PERIODS_PER_YEAR.semimonthly,
      monthly: annualRentScaled / PAY_PERIODS_PER_YEAR.monthly,
    };

    const rentBreakdown = {
      hourly: convertScaled(amountScaled, rentPeriod, "hourly"),
      daily: convertScaled(amountScaled, rentPeriod, "daily"),
      weekly: convertScaled(amountScaled, rentPeriod, "weekly"),
      biweekly: convertScaled(amountScaled, rentPeriod, "biweekly"),
      every_4_weeks: convertScaled(amountScaled, rentPeriod, "every_4_weeks"),
      monthly: convertScaled(amountScaled, rentPeriod, "monthly"),
      annual: convertScaled(amountScaled, rentPeriod, "annual"),
    };

    const annualCounts = {
      rentPayments: {
        hourly: 365 * 24,
        daily: 365,
        weekly: 52,
        biweekly: 26,
        every_4_weeks: 13,
        monthly: 12,
        annual: 1,
      },
      paychecks: {
        weekly: 52,
        biweekly: 26,
        semimonthly: 24,
        monthly: 12,
      },
    };

    return {
      ok: true as const,
      warnings,
      amountScaled,
      annualRentScaled,
      perPaycheckScaled,
      paycheckBreakdown,
      rentBreakdown,
      annualCounts,
    };
  }, [parsedAmount, rentPeriod, payFreq]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does rent per paycheck mean?",
      a: "It is the estimated amount of rent to allocate from each paycheck so the total adds up to the same annual rent cost across your pay cycle.",
    },
    {
      q: "Why does semimonthly differ from biweekly?",
      a: "Semimonthly pay is typically 24 paychecks per year. Biweekly pay is typically 26 paychecks per year. With the same annual rent, dividing by 24 versus 26 changes the per-paycheck estimate.",
    },
    {
      q: "How does this handle rent that is billed every 4 weeks?",
      a: "A 4-week billing cycle is treated as 28 days, which corresponds to about 13 rent payments per year. The calculator converts that to an annual total before estimating amounts per paycheck.",
    },
    {
      q: "If rent is due monthly but pay is biweekly, how is this used?",
      a: "This is an allocation amount. Setting aside that amount each paycheck helps spread a monthly rent cost across the year, even though rent due dates and paycheck dates do not always align.",
    },
    {
      q: "Is the result exact for my calendar and due dates?",
      a: "No. The result uses standard time-period assumptions and annual equivalence. Actual pay schedules, months, and rent due dates can vary.",
    },
    {
      q: "What assumptions does this calculator use?",
      a: "It uses a 365-day year and an average month length of 365 ÷ 12 days, with fixed day counts for weekly (7), biweekly (14), and every 4 weeks (28). Paycheck counts use standard definitions (weekly=52, biweekly=26, semimonthly=24, monthly=12).",
    },
    {
      q: "Does this tell whether rent is affordable?",
      a: "No. This calculator allocates rent across pay cycles. For budgeting context, use the rent affordability calculator.",
    },
  ];

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
      "Estimate how much rent to set aside per paycheck by converting rent to an annual total using a 365-day basis, then dividing by pay frequency.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl,
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const amountInputId = "rpc_amount_input";
  const amountHelpId = "rpc_amount_help";
  const amountErrorId = "rpc_amount_error";
  const rentPeriodSelectId = "rpc_rent_period";
  const payFreqSelectId = "rpc_pay_freq";
  const roundCheckboxId = "rpc_round_display";
  const decimalsSelectId = "rpc_display_decimals";

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



      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Rent allocation per paycheck Calculator
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountIsFocused ? amount : amountDisplay}
                  onFocus={() => {
                    setAmountIsFocused(true);
                    setAmountDisplay(amount);
                  }}
                  onBlur={() => {
                    setAmountIsFocused(false);
                    if (parsedAmount.ok && parsedAmount.normalized) {
                      setAmountDisplay(
                        formatMoneyPreviewFromNormalized(
                          parsedAmount.normalized,
                        ),
                      );
                    } else {
                      setAmountDisplay(amount);
                    }
                  }}
                  onChange={(e) => {
                    const nextRaw = (e.target.value || "").replace(/,/g, "");
                    setAmount(nextRaw);
                  }}
                  placeholder="e.g. 2000 or 2000.00"
                  className="cursor-pointer w-full min-w-0 rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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

            <div className="md:col-span-3">
              <label
                htmlFor={rentPeriodSelectId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Rent is listed as
              </label>
              <select
                id={rentPeriodSelectId}
                value={rentPeriod}
                onChange={(e) =>
                  setRentPeriod(
                    isRentPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
              >
                {(Object.keys(RENT_PERIOD_LABEL) as RentPeriod[]).map((p) => (
                  <option key={p} value={p}>
                    {RENT_PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor={payFreqSelectId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Pay frequency
              </label>
              <select
                id={payFreqSelectId}
                value={payFreq}
                onChange={(e) =>
                  setPayFreq(
                    isPayFrequency(e.target.value)
                      ? e.target.value
                      : "biweekly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
              >
                {(Object.keys(PAY_LABEL) as PayFrequency[]).map((p) => (
                  <option key={p} value={p}>
                    {PAY_LABEL[p]}
                  </option>
                ))}
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
                  Fix the input to calculate rent per paycheck.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Estimated rent to set aside per paycheck
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                    {fmtMoney(computed.perPaycheckScaled)}
                  </div>
                </div>

                <div className=" grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      [
                        "Weekly paycheck",
                        computed.paycheckBreakdown.weekly,
                        "weekly",
                      ],
                      [
                        "Biweekly paycheck",
                        computed.paycheckBreakdown.biweekly,
                        "biweekly",
                      ],
                      [
                        "Semimonthly paycheck",
                        computed.paycheckBreakdown.semimonthly,
                        "semimonthly",
                      ],
                      [
                        "Monthly paycheck",
                        computed.paycheckBreakdown.monthly,
                        "monthly",
                      ],
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

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Equivalent monthly cost
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.annualRentScaled / 12n)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Equivalent 4-week cost
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.annualRentScaled / 13n)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">Annual total</div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.annualRentScaled)}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="rc-no-print md:hidden flex flex-col mt-4 sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <section className="mt-10 rc-print-block">
            <h3 className="text-center sm:text-left text-2xl font-semibold mb-4 text-slate-950">
              Annual payment counts
            </h3>
            <p className="text-center sm:text-left text-slate-700 mb-4 leading-relaxed">
              Rent listings and pay schedules often use different cycles. This
              table shows the standard counts per year used for comparison.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-800">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">Type</th>
                    <th className="text-left px-4 py-2 font-semibold">Cycle</th>
                    <th className="text-right px-4 py-2 font-semibold">
                      Payments per year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Rent</td>
                    <td className="px-4 py-2 text-slate-800">Monthly</td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.rentPayments.monthly
                        : 12}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Rent</td>
                    <td className="px-4 py-2 text-slate-800">
                      Every 4 weeks (28 days)
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.rentPayments.every_4_weeks
                        : 13}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Rent</td>
                    <td className="px-4 py-2 text-slate-800">Weekly</td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.rentPayments.weekly
                        : 52}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Pay</td>
                    <td className="px-4 py-2 text-slate-800">
                      Weekly paycheck
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.paychecks.weekly
                        : 52}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Pay</td>
                    <td className="px-4 py-2 text-slate-800">
                      Biweekly paycheck
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.paychecks.biweekly
                        : 26}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Pay</td>
                    <td className="px-4 py-2 text-slate-800">
                      Semimonthly paycheck
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.paychecks.semimonthly
                        : 24}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Pay</td>
                    <td className="px-4 py-2 text-slate-800">
                      Monthly paycheck
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.paychecks.monthly
                        : 12}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {computed.ok ? (
            <section className="mt-10 rc-print-block">
              <h3 className="text-center sm:text-left text-2xl font-semibold mb-4 text-slate-950">
                Rent period breakdown for the entered amount
              </h3>
              <p className="text-center sm:text-left text-slate-700 mb-4 leading-relaxed">
                This breakdown expresses the entered rent in other time periods
                using the same annual equivalence and standard assumptions.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    ["Hourly", computed.rentBreakdown.hourly, "hourly"],
                    ["Daily", computed.rentBreakdown.daily, "daily"],
                    ["Weekly", computed.rentBreakdown.weekly, "weekly"],
                    [
                      "Every 2 weeks",
                      computed.rentBreakdown.biweekly,
                      "biweekly",
                    ],
                    [
                      "Every 4 weeks (28 days)",
                      computed.rentBreakdown.every_4_weeks,
                      "every_4_weeks",
                    ],
                    [
                      "Monthly (average)",
                      computed.rentBreakdown.monthly,
                      "monthly",
                    ],
                    ["Annual", computed.rentBreakdown.annual, "annual"],
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
            </section>
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
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
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
                  className="cursor-pointer h-5 w-5 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 rounded"
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
                    const v = Number(e.target.value);
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
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center sm:text-left  text-sky-900 tracking-tight leading-tight">
              How this rent per paycheck calculator works and what to expect
            </h2>

            <p className="text-center sm:text-left text-slate-600 leading-7">
              This calculator is a budgeting allocator. It estimates how much
              rent to set aside from each paycheck by treating your rent as a
              yearly cost and spreading that cost across the paychecks implied
              by the pay frequency you select. The goal is not to predict your
              due dates or simulate your landlord’s billing rules. The goal is
              to give you a stable “per pay” set-aside number that stays
              consistent across pay cycles that don’t line up cleanly with
              calendar months.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent + rent period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SELECT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Pay frequency
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
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent per paycheck
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
                    1) Rent is converted to an annual total first
                  </h3>

                  <p className="mt-4">
                    The calculator starts by converting your rent into an annual
                    total using a consistent time-length model. This is the same
                    “one source of truth” approach used across the site. Once
                    rent is annualized, it can be split across paychecks without
                    mixing calendar-month assumptions with fixed-day cycles.
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
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      These assumptions are for equivalence math. Your lease can
                      still be due on specific dates.
                    </p>
                  </div>

                  <p className="mt-4">
                    This step is where small differences versus “month math”
                    come from. If you divide a monthly amount by 2 and call it
                    “biweekly rent,” you have implicitly assumed a calendar
                    structure that may not match a 14-day pay cycle. Using an
                    annual basis keeps the allocator stable across pay
                    frequencies.
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
                    2) Annual rent is divided by paychecks per year
                  </h3>

                  <p className="mt-4">
                    After rent is annualized, the calculator divides that annual
                    total by the number of paychecks implied by your selected
                    pay frequency. The result is the amount to set aside from
                    each paycheck so that, over time, you have allocated the
                    same annual rent.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Why this avoids drift
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        If pay cycles and rent cycles don’t match, “set aside
                        per pay” should still sum to the same annual rent.
                      </li>
                      <li>
                        Using a single annual basis prevents hidden switching
                        between 52-week framing and calendar months.
                      </li>
                      <li>
                        You can change the pay frequency and see a consistent
                        re-allocation, not a different implied rent.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    The output is meant to be used as a budgeting habit:
                    allocate the rent-per-paycheck amount each pay period,
                    regardless of when rent is actually due. When the rent due
                    date arrives, the accumulated set-aside is the intended
                    funding source.
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
                    3) The result does not change your lease schedule
                  </h3>

                  <p className="mt-4">
                    This is not a due-date tool. If rent is due monthly and you
                    are paid biweekly or semimonthly, the rent-per-paycheck
                    number is still useful, but it does not claim that rent is
                    “really due” every paycheck. It only spreads the annual rent
                    across pay periods for budgeting consistency.
                  </p>

                  <p className="mt-4">
                    If you need a forward schedule of actual due dates and
                    calendar-month totals, use a due-date schedule tool. If you
                    need conversions between cycles for listing comparisons, use
                    a converter. This page is specifically “how much to set
                    aside per pay” given a rent amount and a pay frequency.
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
                    4) Where “monthly vs 4-week vs pay cycle” mismatches show up
                  </h3>

                  <p className="mt-4">
                    The biggest budgeting surprises happen when a rent listing
                    uses a fixed-day cycle (every 4 weeks) while your mental
                    model is monthly, or when pay is biweekly while expenses are
                    monthly. A 28-day schedule drifts through the calendar, and
                    a biweekly schedule yields a different cadence than “twice
                    per month.”
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Practical interpretation
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong>Biweekly</strong> means every 14 days. It is not
                        “twice a month.”
                      </li>
                      <li>
                        <strong>Every 4 weeks</strong> means every 28 days. It
                        is not “monthly.”
                      </li>
                      <li>
                        A stable allocation strategy starts from annual rent,
                        then spreads across paychecks.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    This calculator’s annual basis is the anchor that keeps the
                    per-pay set-aside stable even when rent due dates and
                    paycheck dates don’t align neatly month-to-month.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    5) Decimals and rounding
                  </h3>

                  <p className="mt-4">
                    Decimals are preserved end-to-end. Internally, calculations
                    keep precision (up to 12 decimals). If rounding is enabled
                    in the UI, rounding should be display-only so it formats
                    what you see without changing the underlying annual basis
                    used for the allocation.
                  </p>

                  <p className="mt-4">
                    If an input is invalid or ambiguous, the page should avoid
                    producing a misleading per-pay value. A budgeting allocator
                    becomes counterproductive if it quietly converts bad input
                    into a confident-looking result.
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
                    What this tool includes and excludes
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This is a per-pay allocation calculator based on annualized
                    rent and paycheck count. It does not model due dates,
                    proration, partial periods, late fees, utilities, taxes, or
                    deposits. It is designed for stable budgeting across pay
                    frequencies that don’t match rent billing cycles.
                  </p>
                </div>
              </div>

              <section className="mt-10">
                <h3 className="text-2xl font-extrabold mb-4 text-sky-900 tracking-tight">
                  Links to related tools
                </h3>

                <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-5 sm:p-6">
                  <ul className="list-disc ml-6 text-slate-700 space-y-2">
                    <li>
                      <a
                        href={safeHref("/rent-converter")}
                        className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent converter
                      </a>
                    </li>
                    <li>
                      <a
                        href={safeHref(
                          "/how-much-rent-can-i-afford-calculator",
                        )}
                        className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford?
                      </a>
                    </li>
                    <li>
                      <a
                        href={safeHref("/rent-after-tax-income-calculator")}
                        className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent after tax income calculator
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section className=" hidden sm:flex max-w-6xl mx-auto px-6 mt-8 mb-4">
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
      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
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
