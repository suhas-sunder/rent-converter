import { useEffect, useMemo, useRef, useState } from "react";
import { useHydrationSafeSavedState, validSavedMoney } from "~/client/utils/savedState.js";
import type { Route } from "./+types/rent-per-paycheck-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-per-paycheck-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-per-paycheck-calculator/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Per Paycheck Calculator | Biweekly and Semi-Monthly Rent";
  const description =
    "Calculate how much rent to set aside from each paycheck based on rent amount and pay frequency. Useful for biweekly and semi-monthly budgeting.";

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
    { name: "theme-color", content: "#f0f9ff" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
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
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
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
): string {
  const digits = 2;
  const scaledForDisplay = roundScaledToDecimals(scaled, digits);

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const parts = fmt.formatToParts(0);
  const currencyPart = parts.find((p) => p.type === "currency");
  const symbol = currencyPart?.value ?? "";
  const minus = negative ? "-" : "";

  return minus + symbol + groupedInt + (digits > 0 ? decimal + fracStr.padEnd(digits, "0") : "");
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
 * - Weekly rent uses 7-day periods in a 365-day year
 * - Every 2 weeks (biweekly rent) uses 14-day periods in a 365-day year
 * - Every 4 weeks (28-day cycle) uses 28-day periods in a 365-day year
 * - Daily rent uses 365 days/year
 * - Hourly rent uses 24-hour days in a 365-day year
 *
 * Conversions are annual-basis:
 * 1) convert input to annual using the above rent-period assumptions
 * 2) derive any other period from annual using the same conventions
 */

function annualizeFromScaled(valueScaled: bigint, period: RentPeriod): bigint {
  if (period === "hourly") return valueScaled * 24n * 365n;
  if (period === "daily") return valueScaled * 365n;
  if (period === "weekly") return mulDivRound(valueScaled, 365n, 7n);
  if (period === "biweekly") return mulDivRound(valueScaled, 365n, 14n);
  if (period === "every_4_weeks") return mulDivRound(valueScaled, 365n, 28n);
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

export default function RentPerPaycheck() {
  const pageName = "Rent Per Paycheck Calculator";
  const canonicalUrl =
    "https://www.rentconverter.com/rent-per-paycheck-calculator";

  const [amount, setAmount] = useState<string>("2000");

  const [rentPeriod, setRentPeriod] = useState<RentPeriod>("monthly");

  const [payFreq, setPayFreq] = useState<PayFrequency>("biweekly");

  const [currency, setCurrency] = useState<Currency>("USD");

  useHydrationSafeSavedState({
    restore(storage) {
      let applied = false;
      const savedAmount = validSavedMoney(storage.getItem("rpc_amount"), "Rent amount", { allowZero: true });
      if (savedAmount !== undefined) { setAmount(savedAmount); applied = true; }
      const savedRentPeriod = storage.getItem("rpc_rentPeriod");
      if (savedRentPeriod && isRentPeriod(savedRentPeriod)) { setRentPeriod(savedRentPeriod); applied = true; }
      const savedPayFrequency = storage.getItem("rpc_payFreq");
      if (savedPayFrequency && isPayFrequency(savedPayFrequency)) { setPayFreq(savedPayFrequency); applied = true; }
      const savedCurrency = storage.getItem("rpc_currency");
      if (savedCurrency && isCurrency(savedCurrency)) { setCurrency(savedCurrency); applied = true; }
      return applied;
    },
    persist(storage) {
      storage.setItem("rpc_amount", amount);
      storage.setItem("rpc_rentPeriod", rentPeriod);
      storage.setItem("rpc_payFreq", payFreq);
      storage.setItem("rpc_currency", currency);
    },
    dependencies: [amount, rentPeriod, payFreq, currency],
  });

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const [amountIsFocused, setAmountIsFocused] = useState<boolean>(false);
  const [amountDisplay, setAmountDisplay] = useState<string>("2000");

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
        hourly: "8,760",
        daily: "365",
        weekly: "52.14",
        biweekly: "26.07",
        every_4_weeks: "13.04",
        monthly: "12",
        annual: "1",
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
      q: "How do I calculate rent per paycheck?",
      a: "Convert your rent to an annual total, then divide that annual total by the number of paychecks you receive per year. For example, biweekly pay usually means 26 paychecks per year.",
    },
    {
      q: "Why does semimonthly rent per paycheck differ from biweekly?",
      a: "Semimonthly pay usually means 24 paychecks per year. Biweekly pay usually means 26 paychecks per year. The same annual rent divided by 24 is higher than the same annual rent divided by 26.",
    },
    {
      q: "Can I use this if rent is monthly but I am paid biweekly?",
      a: "Yes. The result is the amount to set aside from each paycheck so your total set-aside amount matches your annual rent cost. Actual rent due dates may not line up with paycheck dates.",
    },
    {
      q: "How does this handle rent paid every 4 weeks?",
      a: "A 4-week rent cycle is treated as 28 days. The calculator converts that rent to an annual total using the 365-day model before dividing it by paycheck frequency.",
    },
    {
      q: "Does this tell me whether rent is affordable?",
      a: "No. This page only allocates annualized rent across paychecks. It does not calculate payroll deductions, tax withholding, paycheck dates, or legal affordability.",
    },
    {
      q: "What assumptions does this calculator use?",
      a: "Rent assumptions: year = 365 days, month = 365 / 12 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days. Paycheck counts: weekly = 52, biweekly = 26, semimonthly = 24, monthly = 12.",
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
      "Calculate how much rent to set aside from each paycheck based on rent amount and pay frequency. Useful for biweekly and semi-monthly budgeting.",
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

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
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
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Paycheck rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Per Paycheck Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate how much rent to set aside from each paycheck based
                  on your rent period and pay frequency. Compare rent against
                  biweekly, semi-monthly, weekly, or monthly pay.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-5">
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                  className={`w-full min-w-0 rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsedAmount.ok
                      ? "focus:bg-white"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
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
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p id={amountHelpId} className="mt-1 text-xs text-slate-700">
                Enter the rent amount for the selected period. Choose a visible
                currency; USD and CAD are both supported.
              </p>

              {!parsedAmount.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAmount.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor={rentPeriodSelectId}
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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
            className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:px-6">
              {!computed.ok ? (
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
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
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Rent to set aside per paycheck
                    </div>
                  </div>

                  <div className="mt-2 mb-4 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                      {fmtMoney(computed.perPaycheckScaled)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on annual rent divided by{" "}
                      {PAY_PERIODS_PER_YEAR[payFreq].toString()} paychecks per
                      year.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                        className="rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs text-slate-700">{label}</div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(val)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">
                        Monthly rent amount
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                        {fmtMoney(computed.annualRentScaled / 12n)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">
                        4-week rent amount
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                        {fmtMoney(computed.annualRentScaled / 13n)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">Annual rent</div>
                      <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                        {fmtMoney(computed.annualRentScaled)}
                      </div>
                    </div>
                  </div>

                  {computed.warnings.length ? (
                    <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {computed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}

              <div className="rc-no-print md:hidden flex flex-col mt-4 sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <section className="mt-8 rc-print-block">
            <h3 className="text-center sm:text-left text-2xl font-semibold mb-3 text-sky-800">
              Annual payment counts
            </h3>
            <p className="text-center sm:text-left text-slate-700 mb-4 leading-relaxed">
              Rent and pay schedules often use different cycles. These are the
              yearly counts used for comparison.
            </p>

            <div className="rounded-[1.75rem] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-sky-50/70 text-slate-800">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
                      {computed.ok
                        ? computed.annualCounts.rentPayments.every_4_weeks
                        : 13}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-800">Rent</td>
                    <td className="px-4 py-2 text-slate-800">Weekly</td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
                    <td className="px-4 py-2 text-right font-semibold text-slate-950 tabular-nums whitespace-nowrap">
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
            <section className="mt-8 rc-print-block">
              <h3 className="text-center sm:text-left text-2xl font-semibold mb-3 text-sky-800">
                Rent period breakdown for the entered amount
              </h3>
              <p className="text-center sm:text-left text-slate-700 mb-4 leading-relaxed">
                This shows the entered rent amount across common rent periods
                using the same annual basis.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    ["Hourly", computed.rentBreakdown.hourly, "hourly"],
                    ["Daily", computed.rentBreakdown.daily, "daily"],
                    ["Weekly", computed.rentBreakdown.weekly, "weekly"],
                    ["2 weeks", computed.rentBreakdown.biweekly, "biweekly"],
                    [
                      "4 weeks (28 days)",
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
                    className="rounded-2xl bg-white px-4 py-3"
                  >
                    <div className="text-xs text-slate-700">{label}</div>
                    <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                      {fmtMoney(val)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <Assumptions />

        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
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
