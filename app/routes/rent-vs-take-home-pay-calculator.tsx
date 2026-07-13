import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-take-home-pay-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-vs-take-home-pay-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-vs-take-home-pay-calculator/ToolFit";
import {
  useHydrationSafeSavedState,
  validSavedMoney,
} from "~/client/utils/savedState";

export const meta: Route.MetaFunction = () => {
  const title = "Rent vs Take-Home Pay Calculator | Income After Rent";
  const description =
    "Compare rent with take-home pay. See rent as a percentage of net income and how much income remains after rent.";

  const canonicalUrl =
    "https://www.rentconverter.com/rent-vs-take-home-pay-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent vs take home pay, rent percentage of take home pay, rent to net income, rent vs after tax income, take home pay rent calculator",
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

function formatPercentFromRatio(
  numScaled: bigint,
  denScaled: bigint,
  decimals: number,
): string {
  const d = Math.max(0, Math.min(6, Math.trunc(decimals)));
  if (denScaled <= 0n) return "-";

  const scale = 10n ** BigInt(d);
  // percentScaled = round( (num/den) * 100 * 10^d )
  const percentScaled = mulDivRound(numScaled * 100n * scale, 1n, denScaled);

  const negative = percentScaled < 0n;
  const a = absBigInt(percentScaled);

  const intPart = a / scale;
  const fracPart = a % scale;

  if (d === 0) return `${negative ? "-" : ""}${intPart.toString()}`;

  const fracStr = fracPart.toString().padStart(d, "0");
  return `${negative ? "-" : ""}${intPart.toString()}.${fracStr}`;
}

function formatSignedPercentFromRatio(
  numScaled: bigint,
  denScaled: bigint,
  decimals: number,
): string {
  // same as above, but keeps sign even when num is negative
  const d = Math.max(0, Math.min(6, Math.trunc(decimals)));
  if (denScaled === 0n) return "-";

  const scale = 10n ** BigInt(d);
  const percentScaled = mulDivRound(numScaled * 100n * scale, 1n, denScaled);

  const negative = percentScaled < 0n;
  const a = absBigInt(percentScaled);

  const intPart = a / scale;
  const fracPart = a % scale;

  if (d === 0) return `${negative ? "-" : ""}${intPart.toString()}`;

  const fracStr = fracPart.toString().padStart(d, "0");
  return `${negative ? "-" : ""}${intPart.toString()}.${fracStr}`;
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

  "/rent-vs-buy-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

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
  const limit = MAX_SAFE_INT_FOR_NUMBER * SCALE;
  if (a > limit) return Number.NaN;
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

function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 2000 or 2000.00).`,
      warnings,
    };
  }

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
    if (split.length > 2) {
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
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

function stripCommas(s: string): string {
  return (s ?? "").replace(/,/g, "");
}

function inferPreviewFraction(raw: string): {
  fractionDigits: number;
  trailingDecimalPoint: boolean;
} {
  const s0 = (raw ?? "").trim();
  if (!s0) return { fractionDigits: 0, trailingDecimalPoint: false };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

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
      const after = parts[1] ?? "";
      if (/^\d{1,2}$/.test(after)) decimalSep = ",";
      else decimalSep = null;
    } else {
      decimalSep = null;
    }
  }

  if (!decimalSep) return { fractionDigits: 0, trailingDecimalPoint: false };

  const idx = s.lastIndexOf(decimalSep);
  const trailingDecimalPoint = idx === s.length - 1;

  const frac = trailingDecimalPoint ? "" : s.slice(idx + 1);
  const fracDigits = /^\d+$/.test(frac) ? Math.min(12, frac.length) : 0;

  return { fractionDigits: fracDigits, trailingDecimalPoint };
}

function formatAmountPreviewFromRaw(raw: string): {
  ok: boolean;
  value: string;
  error?: string;
} {
  const parsed = parseMoneyInputToScaled(raw, "value");
  if (!parsed.ok || parsed.scaled === undefined)
    return { ok: false, value: raw, error: parsed.error ?? "Enter a value." };

  const n = toNumberSafe(parsed.scaled);
  if (!Number.isFinite(n))
    return { ok: false, value: raw, error: "Enter a valid value." };

  const { fractionDigits, trailingDecimalPoint } = inferPreviewFraction(raw);

  const formatted = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);

  return {
    ok: true,
    value: trailingDecimalPoint ? `${formatted}.` : formatted,
  };
}

export default function RentVsTakeHomePay() {
  const pageName = "Rent vs Take-Home Pay Calculator";
  const canonicalUrl =
    "https://www.rentconverter.com/rent-vs-take-home-pay-calculator";

  const [takeHomePay, setTakeHomePay] = useState<string>("5000");
  const [takeHomePeriod, setTakeHomePeriod] = useState<Period>("monthly");
  const [rentAmount, setRentAmount] = useState<string>("1800");
  const [rentPeriod, setRentPeriod] = useState<Period>("monthly");
  const [currency, setCurrency] = useState<Currency>("USD");

  const [takeHomeFocused, setTakeHomeFocused] = useState(false);
  const [rentFocused, setRentFocused] = useState(false);

  const [takeHomeDisplay, setTakeHomeDisplay] = useState<string>(() => "5000");
  const [rentDisplay, setRentDisplay] = useState<string>(() => "1800");

  const [takeHomeInputError, setTakeHomeInputError] = useState<string | null>(
    null,
  );
  const [rentInputError, setRentInputError] = useState<string | null>(null);

  useEffect(() => {
    if (!takeHomeFocused) {
      const res = formatAmountPreviewFromRaw(takeHomePay);
      setTakeHomeDisplay(res.value);
      setTakeHomeInputError(
        res.ok ? null : (res.error ?? "Enter take-home pay."),
      );
    } else {
      setTakeHomeDisplay(takeHomePay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takeHomePay, takeHomeFocused]);

  useEffect(() => {
    if (!rentFocused) {
      const res = formatAmountPreviewFromRaw(rentAmount);
      setRentDisplay(res.value);
      setRentInputError(res.ok ? null : (res.error ?? "Enter rent."));
    } else {
      setRentDisplay(rentAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentAmount, rentFocused]);

  useHydrationSafeSavedState({
    restore(storage) {
      const savedTakeHome = validSavedMoney(storage.getItem("rc_rvt_takehome"), {
        allowZero: false,
      });
      const savedTakeHomePeriod = storage.getItem("rc_rvt_takehome_period");
      const savedRent = validSavedMoney(storage.getItem("rc_rvt_rent"), {
        allowZero: true,
      });
      const savedRentPeriod = storage.getItem("rc_rvt_rent_period");
      const savedCurrency = storage.getItem("rc_rvt_currency");

      let applied = false;
      if (savedTakeHome !== undefined) {
        setTakeHomePay(savedTakeHome);
        applied = true;
      }
      if (savedTakeHomePeriod && isPeriod(savedTakeHomePeriod)) {
        setTakeHomePeriod(savedTakeHomePeriod);
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
      storage.setItem("rc_rvt_takehome", takeHomePay);
      storage.setItem("rc_rvt_takehome_period", takeHomePeriod);
      storage.setItem("rc_rvt_rent", rentAmount);
      storage.setItem("rc_rvt_rent_period", rentPeriod);
      storage.setItem("rc_rvt_currency", currency);
    },
    dependencies: [takeHomePay, takeHomePeriod, rentAmount, rentPeriod, currency],
  });

  const parsed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const takeHome = parseMoneyInputToScaled(takeHomePay, "take-home pay");
    if (!takeHome.ok) errors.push(takeHome.error ?? "Enter take-home pay.");
    warnings.push(...takeHome.warnings);

    const rent = parseMoneyInputToScaled(rentAmount, "rent");
    if (!rent.ok) errors.push(rent.error ?? "Enter rent.");
    warnings.push(...rent.warnings);

    return { ok: errors.length === 0, errors, warnings, takeHome, rent };
  }, [takeHomePay, rentAmount]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const annualTakeHome = annualizeScaled(
      parsed.takeHome.scaled as bigint,
      takeHomePeriod,
    );
    const annualRent = annualizeScaled(
      parsed.rent.scaled as bigint,
      rentPeriod,
    );

    const annualLeft = annualTakeHome - annualRent;

    const takeHomeMonthly = fromAnnualScaled(annualTakeHome, "monthly");
    const rentMonthly = fromAnnualScaled(annualRent, "monthly");
    const leftMonthly = takeHomeMonthly - rentMonthly;

    const takeHomeWeekly = fromAnnualScaled(annualTakeHome, "weekly");
    const rentWeekly = fromAnnualScaled(annualRent, "weekly");
    const leftWeekly = takeHomeWeekly - rentWeekly;

    const takeHome4w = fromAnnualScaled(annualTakeHome, "every_4_weeks");
    const rent4w = fromAnnualScaled(annualRent, "every_4_weeks");
    const left4w = takeHome4w - rent4w;

    const monthMinus4wRent = rentMonthly - rent4w;

    const rentPctText = formatPercentFromRatio(annualRent, annualTakeHome, 2);

    const monthMinus4wRentPctText = formatSignedPercentFromRatio(
      monthMinus4wRent,
      rent4w,
      2,
    );

    return {
      ok: true as const,
      warnings: parsed.warnings,

      annualTakeHome,
      annualRent,
      annualLeft,

      rentPctText,

      takeHomeMonthly,
      rentMonthly,
      leftMonthly,

      takeHomeWeekly,
      rentWeekly,
      leftWeekly,

      takeHome4w,
      rent4w,
      left4w,

      avgMonthDays: 365 / 12,
      monthMinus4wRent,
      monthMinus4wRentPctText,
    };
  }, [parsed, takeHomePeriod, rentPeriod]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What is take-home pay?",
      a: "Take-home pay is your net income after payroll deductions such as taxes, benefits, and other withholdings. Enter the amount you actually receive.",
    },
    {
      q: "How do I calculate rent as a percentage of take-home pay?",
      a: "Divide rent by take-home pay for the same time period, then multiply by 100. This calculator annualizes both amounts first so different pay and rent periods can be compared consistently.",
    },
    {
      q: "Can I compare monthly rent with biweekly take-home pay?",
      a: "Yes. Select the correct period for each input. The calculator converts both values to annual totals before calculating the rent percentage and the amount left after rent.",
    },
    {
      q: "Why do monthly and every 4 weeks differ?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days based on 365 days divided by 12. Those are different billing cycles.",
    },
    {
      q: "Does this include utilities or other bills?",
      a: "No. The result is take-home pay minus rent only. Add utilities or other housing costs to the rent input if you want a combined housing-cost estimate.",
    },
    {
      q: "What if rent is more than take-home pay?",
      a: "The calculator can show a negative amount left after rent. That means the entered rent is higher than the entered take-home pay on an annualized basis.",
    },
    {
      q: "What assumptions does this page use?",
      a: "The calculator uses 365 days per year, 7 days per week, 14 days for biweekly amounts, 28 days for every 4 weeks, and 365 ÷ 12 days for an average month.",
    },
  ];

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
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
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
    name: pageName,
    description:
      "Compare rent with take-home pay. See rent as a percentage of net income and how much income remains after rent.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

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
                  Take-home pay tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent vs Take-Home Pay Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate rent as a percentage of take-home pay. See how much
                  income remains after rent.
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
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Take-home pay (net)
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={takeHomeFocused ? takeHomePay : takeHomeDisplay}
                  onFocus={() => {
                    setTakeHomeFocused(true);
                    setTakeHomeDisplay(takeHomePay);
                  }}
                  onBlur={() => {
                    setTakeHomeFocused(false);
                    const res = formatAmountPreviewFromRaw(takeHomePay);
                    setTakeHomeDisplay(res.value);
                    setTakeHomeInputError(
                      res.ok ? null : (res.error ?? "Enter take-home pay."),
                    );
                  }}
                  onChange={(e) => setTakeHomePay(stripCommas(e.target.value))}
                  placeholder="e.g. 5000"
                  className="col-span-7 rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-invalid={!parsed.takeHome.ok}
                />
                <select
                  value={takeHomePeriod}
                  onChange={(e) =>
                    setTakeHomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="cursor-pointer col-span-5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Take-home pay period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {!takeHomeFocused && takeHomeInputError ? (
                <div className="mt-2 text-sm font-semibold text-rose-700">
                  {takeHomeInputError}
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentFocused ? rentAmount : rentDisplay}
                  onFocus={() => {
                    setRentFocused(true);
                    setRentDisplay(rentAmount);
                  }}
                  onBlur={() => {
                    setRentFocused(false);
                    const res = formatAmountPreviewFromRaw(rentAmount);
                    setRentDisplay(res.value);
                    setRentInputError(
                      res.ok ? null : (res.error ?? "Enter rent."),
                    );
                  }}
                  onChange={(e) => setRentAmount(stripCommas(e.target.value))}
                  placeholder="e.g. 1800"
                  className="col-span-7 rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-invalid={!parsed.rent.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="cursor-pointer col-span-5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Rent period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {!rentFocused && rentInputError ? (
                <div className="mt-2 text-sm font-semibold text-rose-700">
                  {rentInputError}
                </div>
              ) : null}
            </div>

            <div className="md:col-span-12">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value) ? e.target.value : "USD",
                  )
                }
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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

          {!parsed.ok ? (
            <div
              className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              role="region"
              aria-label="Results"
              aria-live="polite"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="p-5 sm:px-6">
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Fix the inputs to calculate rent as a percentage of
                    take-home pay.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                    {parsed.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                  {parsed.warnings.length ? (
                    <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {parsed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Notes</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
                role="region"
                aria-label="Results"
                aria-live="polite"
              >
                <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

                <div className="p-5 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Rent share of take-home pay
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                      {computed.rentPctText}%
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on annualized take-home pay and rent.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">
                        Take-home pay annualized
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {money(computed.annualTakeHome)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">
                        Rent annualized
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {money(computed.annualRent)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">
                        Left after rent annualized
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {money(computed.annualLeft)}
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700">
                        Monthly, weekly, and 4-week amounts
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Take-home per month:{" "}
                          <strong className="text-slate-950">
                            {money(computed.takeHomeMonthly)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Rent per month:{" "}
                          <strong className="text-slate-950">
                            {money(computed.rentMonthly)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Left per month:{" "}
                          <strong className="text-slate-950">
                            {money(computed.leftMonthly)}
                          </strong>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Take-home per week:{" "}
                          <strong className="text-slate-950">
                            {money(computed.takeHomeWeekly)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Rent per week:{" "}
                          <strong className="text-slate-950">
                            {money(computed.rentWeekly)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Left per week:{" "}
                          <strong className="text-slate-950">
                            {money(computed.leftWeekly)}
                          </strong>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Take-home per 4 weeks:{" "}
                          <strong className="text-slate-950">
                            {money(computed.takeHome4w)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Rent per 4 weeks:{" "}
                          <strong className="text-slate-950">
                            {money(computed.rent4w)}
                          </strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700">
                          Left per 4 weeks:{" "}
                          <strong className="text-slate-950">
                            {money(computed.left4w)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Monthly vs every 4 weeks rent
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm text-slate-700">
                          Monthly rent minus 4-week rent:{" "}
                          <strong className="text-slate-950">
                            {money(computed.monthMinus4wRent)}
                          </strong>
                        </div>
                        <strong className="text-slate-950">
                          {computed.monthMinus4wRentPctText}%
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Assumptions />
            </>
          ) : null}
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
