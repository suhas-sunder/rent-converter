import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-tax-income-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-after-tax-income-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-after-tax-income-calculator/ToolFit";
function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Free Rent vs Take-Home Pay Calculator";
  const description =
    "Calculate rent as a percentage of take-home pay. See rent vs after-tax income, net income impact, pay-cycle breakdowns, and export options.";

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
  "/rent-after-increase-calculator",

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

function parseDisplayDecimalsStrict(raw: string | null): number {
  const allowed = new Set<number>([0, 2, 4, 6]);
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : 2;
}

export default function RentAfterTaxIncome() {
  const [grossIncome, setGrossIncome] = useState<string>(() => {
    if (typeof window === "undefined") return "60000";
    return window.localStorage.getItem("rc_rati_gross") ?? "60000";
  });

  const [incomePeriod, setIncomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "annual";
    const saved =
      window.localStorage.getItem("rc_rati_income_period") ?? "annual";
    return isPeriod(saved) ? saved : "annual";
  });

  const [taxRate, setTaxRate] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    return window.localStorage.getItem("rc_rati_tax_rate") ?? "25";
  });

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return window.localStorage.getItem("rc_rati_rent") ?? "2200";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved =
      window.localStorage.getItem("rc_rati_rent_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_rati_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding (calculations preserve decimals)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_rati_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return parseDisplayDecimalsStrict(
      window.localStorage.getItem("rc_rati_display_decimals"),
    );
  });

  const [isGrossFocused, setIsGrossFocused] = useState(false);
  const [isRentFocused, setIsRentFocused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_rati_gross", grossIncome);
      window.localStorage.setItem("rc_rati_income_period", incomePeriod);
      window.localStorage.setItem("rc_rati_tax_rate", taxRate);
      window.localStorage.setItem("rc_rati_rent", rentAmount);
      window.localStorage.setItem("rc_rati_rent_period", rentPeriod);
      window.localStorage.setItem("rc_rati_currency", currency);
      window.localStorage.setItem(
        "rc_rati_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_rati_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [
    grossIncome,
    incomePeriod,
    taxRate,
    rentAmount,
    rentPeriod,
    currency,
    roundDisplay,
    displayDecimals,
  ]);

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

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(
      scaled,
      currency,
      roundDisplay,
      effectiveDisplayDecimals,
    );

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
      q: "What is an effective tax rate in this calculator?",
      a: "It’s a single percentage used to estimate take-home income from pre-tax income. It’s a simplification and can differ from actual withholding and year-end taxes.",
    },
    {
      q: "What does this page calculate?",
      a: "It estimates annual after-tax income, annual rent, rent as a percentage of after-tax income, and how much take-home income remains after rent. Per-period equivalents are derived from the same annual totals.",
    },
    {
      q: "Why does the calculator use annual equivalence?",
      a: "Annualizing both income and rent keeps comparisons consistent across time periods and avoids mixing monthly assumptions with 4-week or weekly cycles.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals.",
    },
    {
      q: "Does this include utilities, parking, or other housing costs?",
      a: "No. It compares rent to income only. If you want to account for bundled housing costs, add them to the rent input.",
    },
    {
      q: "Is this a budgeting recommendation?",
      a: "No. The results show how rent relates to estimated take-home income. Actual affordability depends on debts, household size, location, and other expenses.",
    },
    {
      q: "Can I mix periods (for example monthly rent and annual income)?",
      a: "Yes. Each input is annualized using its selected period before the percentage is calculated.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "Assumptions: year = 365 days, week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
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
      "Estimate take-home income from pre-tax income and an effective tax rate, then compare rent to after-tax income using annual equivalence (365-day year).",
    url: "https://www.rentconverter.com/rent-after-tax-income-calculator",
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6"
      >
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              Rent Share Calculator (After-Tax Income)
            </h1>

            <div
              id="export-controls"
              className="hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
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

          <p className="hidden md:flex w-full py-2 text-base text-slate-600">
            Estimate how much of your after-tax income goes to rent. See your
            rent share percentage instantly with clear calculations.
          </p>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                  className="cursor-pointer col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!grossParsed.ok}
                />
                <select
                  value={incomePeriod}
                  onChange={(e) =>
                    setIncomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "annual",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Income period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {!grossParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {grossParsed.error}
                </p>
              ) : grossParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {grossParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Effective tax rate (Simplified estimate)
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25 or 12.5"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!taxParsed.ok}
                />
                <div className="col-span-5 rounded-xl bg-white py-2 flex items-center text-sm font-bold text-slate-700">
                  %
                </div>
              </div>
              {!taxParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {taxParsed.error}
                </p>
              ) : taxParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {taxParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
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
                  value={rentPreview}
                  onChange={(e) =>
                    setRentAmount(e.target.value.replace(/,/g, ""))
                  }
                  onFocus={() => setIsRentFocused(true)}
                  onBlur={() => setIsRentFocused(false)}
                  placeholder="e.g. 2200 or 2200.00"
                  className="cursor-pointer col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!rentParsed.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Rent period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {!rentParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {rentParsed.error}
                </p>
              ) : rentParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {rentParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-lg font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Fix the inputs below to see rent share and net income after
                  rent.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">Notes</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
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
                  <div className="text-sm font-semibold text-slate-800">
                    Rent share of estimated after-tax income
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {safeToFixed(computed.rentShareNetPct, 2)}%
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annual pre-tax income (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualGross)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annual after-tax income (estimated)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNet)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annual after-tax income left after rent
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNetAfterRent)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-3 py-2 rc-print-block">
                    <div className="text-[11px] text-slate-500">
                      Monthly vs 4-week (from annual totals)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Net · monthly
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(
                            convertScaled(
                              computed.annualNet,
                              "annual",
                              "monthly",
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Net · 4-week
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(
                            convertScaled(
                              computed.annualNet,
                              "annual",
                              "every_4_weeks",
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Rent · monthly
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(
                            convertScaled(
                              computed.annualRent,
                              "annual",
                              "monthly",
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          Rent · 4-week
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
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

                    <p className="mt-1.5 text-[11px] text-slate-500">
                      4-week = 28 days. Avg month ={" "}
                      {safeToFixed(computed.avgMonthDays, 2)} days (365 ÷ 12).
                    </p>
                  </div>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
          </div>

          {computed.ok ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:px-6 rc-print-block">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Full breakdown across periods (annual-equivalent)
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                This table converts income and rent through annual totals first,
                then expresses gross income, estimated net income, rent, and net
                income after rent across common periods.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-4">Period</th>
                      <th className="py-2 pr-4">Gross</th>
                      <th className="py-2 pr-4">Net (est.)</th>
                      <th className="py-2 pr-4">Rent</th>
                      <th className="py-2 pr-4">Net after rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.breakdown.map((row) => (
                      <tr key={row.p} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-semibold text-slate-800">
                          {PERIOD_LABEL[row.p]}
                        </td>
                        <td className="py-2 pr-4 text-slate-800">
                          {fmtMoney(row.grossP)}
                        </td>
                        <td className="py-2 pr-4 text-slate-800">
                          {fmtMoney(row.netP)}
                        </td>
                        <td className="py-2 pr-4 text-slate-800">
                          {fmtMoney(row.rentP)}
                        </td>
                        <td className="py-2 pr-4 text-slate-800">
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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <Rounding
            roundDisplay={roundDisplay}
            setRoundDisplay={setRoundDisplay}
            displayDecimals={displayDecimals}
            setDisplayDecimals={setDisplayDecimals as any}
          />
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="cursor-pointer max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Rent After-Tax Income Calculator
        </nav>
      </section>

      <ToolFit />

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
