import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-tax-income-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-after-tax-income-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-after-tax-income-calculator/ToolFit";
import {
  useHydrationSafeSavedState,
  validSavedMoney,
  validSavedPercentage,
} from "~/client/utils/savedState";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent After-Tax Income Calculator | Take-Home Rent Share";
  const description =
    "Estimate rent as a percentage of after-tax income. Enter income, tax rate, and rent to compare rent with take-home pay.";

  const url = "https://www.rentconverter.com/rent-after-tax-income-calculator";
  const image = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent after tax income, rent percentage of net income, rent vs take home pay, after tax income rent calculator, rent to net income, take home pay rent percentage",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: image },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    { tagName: "link", rel: "canonical", href: url },
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
  monthly: "Monthly",
  annual: "Annual",
};

// Only include routes you are certain exist in your app.
// Unknown links should resolve to "/" to avoid linking to non-existent routes.
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

/** Decimal-safe fixed point (up to 12 decimals). */
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

function formatNumberPreviewFromParsed(parsed: ParsedScaled): string | null {
  if (!parsed.ok || !parsed.normalized) return null;

  const normalized = parsed.normalized;
  const [intStr, fracStr] = normalized.split(".");
  const intNum = Number(intStr || "0");
  if (!Number.isFinite(intNum)) return null;

  const groupedInt = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(intNum);

  if (typeof fracStr === "string" && fracStr.length > 0) {
    return `${groupedInt}.${fracStr}`;
  }
  return groupedInt;
}

function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 60000 or 2200.00).",
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
  intPart = intPart.replace(/^0+(?=\d)/, "");

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
    warnings.push("Value was clamped to the supported maximum for safety.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

/**
 * Percent parser (0 to 100):
 * Allows "25", "25%", "12.5", "12.", ".5"
 */
function parsePercent0to100ToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: "Enter a tax rate percent.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/%/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid percent (example: 25 or 12.5).",
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: "Enter a valid percent (misplaced minus sign).",
        warnings,
      };
    }
    return { ok: false, error: "Percent must be 0 or greater.", warnings };
  }

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  if (hasDot && hasComma) {
    return {
      ok: false,
      error: 'Use one decimal separator (example: "12.5").',
      warnings,
    };
  }
  if (hasComma) s = s.replace(",", ".");
  if (!/^\d*\.?\d*$/.test(s))
    return { ok: false, error: "Enter a valid percent.", warnings };
  if (s === "." || s === "")
    return { ok: false, error: "Enter a valid percent.", warnings };

  const parts = s.split(".");
  const intPart = (parts[0] ?? "0").replace(/^0+(?=\d)/, "") || "0";
  const fracPart = parts[1] ?? "";

  if (!/^\d+$/.test(intPart))
    return { ok: false, error: "Enter a valid percent.", warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: "Enter a valid percent.", warnings };

  const maxDec = Number(MAX_DECIMALS);
  const fracCapped =
    fracPart.length > maxDec ? fracPart.slice(0, maxDec) : fracPart;
  const fracPadded = fracCapped.padEnd(maxDec, "0");
  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxPct = 100n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxPct);
  if (clamped !== scaled) warnings.push("Tax rate was clamped to 0 to 100.");

  const normalized = fracPart.length
    ? `${intPart}.${fracCapped}`
    : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivInt(value: bigint, mul: bigint, div: bigint): bigint {
  if (div === 0n) return 0n;
  return (value * mul) / div;
}

function convertScaled(valueScaled: bigint, from: Period, to: Period): bigint {
  if (from === to) return valueScaled;

  const daysPer: Record<
    Exclude<Period, "hourly">,
    { num: bigint; den: bigint }
  > = {
    daily: { num: 1n, den: 1n },
    weekly: { num: 7n, den: 1n },
    biweekly: { num: 14n, den: 1n },
    every_4_weeks: { num: 28n, den: 1n },
    monthly: { num: 365n, den: 12n },
    annual: { num: 365n, den: 1n },
  };

  // to daily
  let dailyScaled: bigint;
  if (from === "hourly") {
    dailyScaled = mulDivInt(valueScaled, 24n, 1n);
  } else {
    const dp = daysPer[from as Exclude<Period, "hourly">] ?? {
      num: 1n,
      den: 1n,
    };
    dailyScaled = mulDivInt(valueScaled, dp.den, dp.num);
  }

  // from daily to target
  if (to === "hourly") return mulDivInt(dailyScaled, 1n, 24n);
  const dpTo = daysPer[to as Exclude<Period, "hourly">] ?? { num: 1n, den: 1n };
  return mulDivInt(dailyScaled, dpTo.num, dpTo.den);
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

function percentFromRatio(num: bigint, den: bigint, decimals: number): number {
  if (den <= 0n) return 0;
  const d = Math.max(0, Math.min(6, Math.trunc(decimals)));
  const factor = 10n ** BigInt(d);
  // percentScaled = (num/den) * 100 * 10^d
  const percentScaled = (num * 100n * factor) / den;

  // Keep it safely convertible to number.
  const limit = 9_000_000_000_000_000n; // ~9e15
  const safe = percentScaled > limit ? limit : percentScaled;
  return Number(safe) / Number(factor);
}

export default function RentAfterTaxIncome() {
  const [grossIncome, setGrossIncome] = useState<string>("60000");
  const [incomePeriod, setIncomePeriod] = useState<Period>("annual");
  const [taxRate, setTaxRate] = useState<string>("25");
  const [rentAmount, setRentAmount] = useState<string>("2200");
  const [rentPeriod, setRentPeriod] = useState<Period>("monthly");
  const [currency, setCurrency] = useState<Currency>("USD");

  const [isGrossFocused, setIsGrossFocused] = useState(false);
  const [isRentFocused, setIsRentFocused] = useState(false);

  useHydrationSafeSavedState({
    restore(storage) {
      const savedGross = validSavedMoney(storage.getItem("rc_rati_gross"), {
        allowZero: false,
      });
      const savedIncomePeriod = storage.getItem("rc_rati_income_period");
      const savedTax = validSavedPercentage(storage.getItem("rc_rati_tax_rate"));
      const savedRent = validSavedMoney(storage.getItem("rc_rati_rent"), {
        allowZero: true,
      });
      const savedRentPeriod = storage.getItem("rc_rati_rent_period");
      const savedCurrency = storage.getItem("rc_rati_currency");

      let applied = false;
      if (savedGross !== undefined) {
        setGrossIncome(savedGross);
        applied = true;
      }
      if (savedIncomePeriod && isPeriod(savedIncomePeriod)) {
        setIncomePeriod(savedIncomePeriod);
        applied = true;
      }
      if (savedTax !== undefined) {
        setTaxRate(savedTax);
        applied = true;
      }
      if (savedRent !== undefined) {
        setRentAmount(savedRent);
        applied = true;
      }
      if (savedRentPeriod && isPeriod(savedRentPeriod)) {
        setRentPeriod(savedRentPeriod);
        applied = true;
      }
      if (savedCurrency && isCurrency(savedCurrency)) {
        setCurrency(savedCurrency);
        applied = true;
      }
      return applied;
    },
    persist(storage) {
      storage.setItem("rc_rati_gross", grossIncome);
      storage.setItem("rc_rati_income_period", incomePeriod);
      storage.setItem("rc_rati_tax_rate", taxRate);
      storage.setItem("rc_rati_rent", rentAmount);
      storage.setItem("rc_rati_rent_period", rentPeriod);
      storage.setItem("rc_rati_currency", currency);
    },
    dependencies: [
      grossIncome,
      incomePeriod,
      taxRate,
      rentAmount,
      rentPeriod,
      currency,
    ],
  });

  const grossParsed = useMemo(
    () => parseMoneyInputToScaled(grossIncome),
    [grossIncome],
  );
  const rentParsed = useMemo(
    () => parseMoneyInputToScaled(rentAmount),
    [rentAmount],
  );
  const taxParsed = useMemo(
    () => parsePercent0to100ToScaled(taxRate),
    [taxRate],
  );
  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const grossPreview = useMemo(() => {
    if (isGrossFocused) return grossIncome;
    const pv = formatNumberPreviewFromParsed(grossParsed);
    return pv ?? grossIncome;
  }, [grossIncome, grossParsed, isGrossFocused]);

  const rentPreview = useMemo(() => {
    if (isRentFocused) return rentAmount;
    const pv = formatNumberPreviewFromParsed(rentParsed);
    return pv ?? rentAmount;
  }, [rentAmount, rentParsed, isRentFocused]);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!grossParsed.ok)
      errors.push(grossParsed.error ?? "Enter a valid pre-tax income.");
    if (!rentParsed.ok)
      errors.push(rentParsed.error ?? "Enter a valid rent amount.");
    if (!taxParsed.ok)
      errors.push(taxParsed.error ?? "Enter a valid tax rate percent.");

    if (grossParsed.warnings.length) warnings.push(...grossParsed.warnings);
    if (rentParsed.warnings.length) warnings.push(...rentParsed.warnings);
    if (taxParsed.warnings.length) warnings.push(...taxParsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const annualGross = convertScaled(
      grossParsed.scaled as bigint,
      incomePeriod,
      "annual",
    );
    const annualRent = convertScaled(
      rentParsed.scaled as bigint,
      rentPeriod,
      "annual",
    );

    // annualNet = annualGross * (1 - taxRate/100)
    // taxScaled is percent in SCALE units (0..100)
    const taxScaled = taxParsed.scaled as bigint;
    const oneHundredScaled = 100n * SCALE;
    const netFactorScaled = oneHundredScaled - taxScaled; // (100 - tax) * SCALE
    const annualNet = mulDivInt(annualGross, netFactorScaled, oneHundredScaled);

    const annualNetAfterRent = annualNet - annualRent;

    const rentShareNetPct =
      annualNet > 0n ? percentFromRatio(annualRent, annualNet, 4) : 0;

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => {
      const grossP = convertScaled(annualGross, "annual", p);
      const netP = convertScaled(annualNet, "annual", p);
      const rentP = convertScaled(annualRent, "annual", p);
      const leftP = convertScaled(annualNetAfterRent, "annual", p);
      return { p, grossP, netP, rentP, leftP };
    });

    const avgMonthDays = 365 / 12;

    return {
      ok: true as const,
      warnings,
      annualGross,
      annualNet,
      annualRent,
      annualNetAfterRent,
      rentShareNetPct,
      breakdown,
      avgMonthDays,
    };
  }, [grossParsed, rentParsed, taxParsed, incomePeriod, rentPeriod]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does this calculator measure?",
      a: "It estimates rent as a percentage of after-tax income. It also shows pre-tax income, estimated take-home income, rent, and income left after rent across common periods.",
    },
    {
      q: "What is an effective tax rate?",
      a: "It is a single percentage used to estimate take-home income from pre-tax income. Actual tax withholding and final tax owed can differ.",
    },
    {
      q: "How is rent as a percentage of after-tax income calculated?",
      a: "The calculator estimates annual after-tax income, annualizes rent, then divides annual rent by annual after-tax income.",
    },
    {
      q: "Can I use different periods for income and rent?",
      a: "Yes. For example, you can enter annual income and monthly rent. Each input is converted to an annual amount before the percentage is calculated.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days. Over a year, those periods do not produce the same totals.",
    },
    {
      q: "Does this include utilities, parking, debt, or other expenses?",
      a: "No. It compares rent with estimated after-tax income only. Add bundled housing costs to the rent input if you want them included.",
    },
    {
      q: "Is this a tax calculator?",
      a: "No. It uses the tax rate you enter as a simplified estimate. It does not calculate actual tax brackets, credits, deductions, or payroll rules.",
    },
    {
      q: "Is this a budgeting recommendation?",
      a: "No. It shows the relationship between rent and estimated take-home income. Real affordability depends on other expenses, debt, household size, location, and savings needs.",
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Rent After-Tax Income Calculator",
        item: "https://www.rentconverter.com/rent-after-tax-income-calculator",
      },
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
    name: "Rent After-Tax Income Calculator",
    description:
      "Estimate rent as a percentage of after-tax income using income, rent, and an effective tax rate. Includes annual totals and period breakdowns.",
    url: "https://www.rentconverter.com/rent-after-tax-income-calculator",
  };

  const grossInvalid = !grossParsed.ok;
  const rentInvalid = !rentParsed.ok;
  const taxInvalid = !taxParsed.ok;

  const grossDescribedBy = grossInvalid
    ? "rc-gross-help rc-gross-error"
    : "rc-gross-help";
  const rentDescribedBy = rentInvalid
    ? "rc-rent-help rc-rent-error"
    : "rc-rent-help";
  const taxDescribedBy = taxInvalid
    ? "rc-tax-help rc-tax-error"
    : "rc-tax-help";

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
        className="mx-auto max-w-6xl px-6 pb-6 pt-4 sm:pt-6"
      >
        <div className="rounded-[1.75rem] bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  After-tax income
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Rent After-Tax Income Calculator
                </h1>

                <p className="mt-2 max-w-6xl text-base leading-relaxed text-slate-700">
                  Estimate how much of your after-tax income goes to rent. Enter
                  income, tax rate, and rent to compare the numbers.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 flex-wrap gap-2 sm:justify-end"
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

            <div className="mt-2 grid gap-x-5 gap-y-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pre-tax income
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={grossPreview}
                    onChange={(e) =>
                      setGrossIncome(e.target.value.replace(/,/g, ""))
                    }
                    onFocus={() => setIsGrossFocused(true)}
                    onBlur={() => setIsGrossFocused(false)}
                    placeholder="e.g. 60000 or 5000.50"
                    className="col-span-7 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={grossInvalid}
                    aria-describedby={grossDescribedBy}
                  />
                  <select
                    value={incomePeriod}
                    onChange={(e) =>
                      setIncomePeriod(
                        isPeriod(e.target.value) ? e.target.value : "annual",
                      )
                    }
                    className="col-span-5 cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Income period"
                  >
                    {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-gross-help" className="mt-2 text-sm text-slate-700">
                  Enter income before tax for the selected period.
                </p>

                {!grossParsed.ok ? (
                  <p
                    id="rc-gross-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {grossParsed.error}
                  </p>
                ) : grossParsed.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {grossParsed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Effective tax rate
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="e.g. 25 or 12.5"
                    className="col-span-7 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={taxInvalid}
                    aria-describedby={taxDescribedBy}
                  />
                  <div className="col-span-5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                    %
                  </div>
                </div>

                <p id="rc-tax-help" className="mt-2 text-sm text-slate-700">
                  Use a simplified tax percentage, such as 25 or 12.5.
                </p>

                {!taxParsed.ok ? (
                  <p
                    id="rc-tax-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {taxParsed.error}
                  </p>
                ) : taxParsed.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">Note</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {taxParsed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Rent
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={rentPreview}
                    onChange={(e) =>
                      setRentAmount(e.target.value.replace(/,/g, ""))
                    }
                    onFocus={() => setIsRentFocused(true)}
                    onBlur={() => setIsRentFocused(false)}
                    placeholder="e.g. 2200 or 2200.00"
                    className="col-span-7 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={rentInvalid}
                    aria-describedby={rentDescribedBy}
                  />
                  <select
                    value={rentPeriod}
                    onChange={(e) =>
                      setRentPeriod(
                        isPeriod(e.target.value) ? e.target.value : "monthly",
                      )
                    }
                    className="col-span-5 cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Rent period"
                  >
                    {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-rent-help" className="mt-2 text-sm text-slate-700">
                  Enter rent for the selected rent period.
                </p>

                {!rentParsed.ok ? (
                  <p
                    id="rc-rent-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {rentParsed.error}
                  </p>
                ) : rentParsed.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {rentParsed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="w-full cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
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

            <div className="mt-3 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block">
              <div
                className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400"
                aria-hidden="true"
              />

              <div className="p-5 sm:px-6">
                {!computed.ok ? (
                  <div className="rounded-2xl bg-white p-4">
                    <div className="font-semibold text-slate-950">
                      No results to show
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Fix the inputs below to see rent share and income left
                      after rent.
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-rose-700">
                      {computed.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                    {computed.warnings.length ? (
                      <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                        <div className="font-semibold">Notes</div>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {computed.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-sm font-semibold text-slate-950">
                        Rent share of estimated after-tax income
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <div className="text-3xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">
                        {safeToFixed(computed.rentShareNetPct, 2)}%
                      </div>
                      <p className="text-sm text-slate-700">
                        Based on annual rent divided by estimated annual
                        after-tax income.
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-700">
                          Annual pre-tax income
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {fmtMoney(computed.annualGross)}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-700">
                          Estimated annual after-tax income
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {fmtMoney(computed.annualNet)}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-700">
                          Annual income left after rent
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {fmtMoney(computed.annualNetAfterRent)}
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 shadow-sm sm:col-span-2 lg:col-span-3 rc-print-block">
                        <div className="text-xs font-medium text-slate-700">
                          Monthly vs 4-week comparison
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Net · monthly
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmtMoney(
                                convertScaled(
                                  computed.annualNet,
                                  "annual",
                                  "monthly",
                                ),
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Net · 4-week
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmtMoney(
                                convertScaled(
                                  computed.annualNet,
                                  "annual",
                                  "every_4_weeks",
                                ),
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Rent · monthly
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmtMoney(
                                convertScaled(
                                  computed.annualRent,
                                  "annual",
                                  "monthly",
                                ),
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Rent · 4-week
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmtMoney(
                                convertScaled(
                                  computed.annualRent,
                                  "annual",
                                  "every_4_weeks",
                                ),
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-slate-700">
                          4-week = 28 days. Average month ={" "}
                          {safeToFixed(computed.avgMonthDays, 2)} days (365 ÷
                          12).
                        </p>
                      </div>
                    </div>

                    {computed.warnings.length ? (
                      <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                        <div className="font-semibold">Notes</div>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {computed.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            {computed.ok ? (
              <div className="mt-3 rounded-2xl bg-white p-5 sm:px-6 rc-print-block">
                <h3 className="mb-3 text-lg font-bold text-sky-800">
                  Full breakdown across periods
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-700">
                  This table annualizes income and rent first, then shows gross
                  income, estimated net income, rent, and income left after rent
                  across common periods.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-[920px] w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-700">
                        <th className="py-2 pr-4 font-semibold">Period</th>
                        <th className="py-2 pr-4 font-semibold">Gross</th>
                        <th className="py-2 pr-4 font-semibold">Net est.</th>
                        <th className="py-2 pr-4 font-semibold">Rent</th>
                        <th className="py-2 pr-4 font-semibold">
                          Net after rent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {computed.breakdown.map((row) => (
                        <tr key={row.p} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-semibold text-slate-950">
                            {PERIOD_LABEL[row.p]}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmtMoney(row.grossP)}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmtMoney(row.netP)}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmtMoney(row.rentP)}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmtMoney(row.leftP)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
            <Assumptions />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="rc-no-print mb-4 flex flex-col gap-2 md:hidden sm:flex-row">
            <button
              type="button"
              onClick={handlePrint}
              className="rc-print-button"
            >
              Print / Save as PDF
            </button>
          </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Calculations preserve precision internally, while displayed money values are rounded to cents.
              </p>
        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav

          aria-label="Breadcrumb"
         className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / Rent After-Tax Income Calculator
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-8">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-slate-200">
            {faqData.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                  <span>{f.q}</span>
                  <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>

                <div className="mt-2 leading-relaxed text-slate-700">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
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
