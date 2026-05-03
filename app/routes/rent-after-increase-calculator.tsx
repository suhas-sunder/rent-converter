import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-increase-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-after-increase-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-after-increase-calculator/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent After Increase Calculator | New Rent Amount";
  const description =
    "Calculate rent after a fixed or percentage increase. See the new rent by billing period, annual impact, and before-and-after breakdown.";

  const url = "https://www.rentconverter.com/rent-after-increase-calculator";
  const image = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent after increase, rent increase calculator, new rent after increase, percent rent increase calculator, fixed rent increase calculator, rent raise calculator, rent increase amount calculator",
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

type IncreaseMode = "percent" | "amount";

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

const PERIOD_RESULT_LABEL: Record<Period, string> = {
  hourly: "Hourly rent after increase",
  daily: "Daily rent after increase",
  weekly: "Weekly rent after increase",
  biweekly: "Every 2 weeks rent after increase",
  every_4_weeks: "Every 4 weeks rent after increase",
  monthly: "Monthly rent after increase",
  annual: "Annual rent after increase",
};

const PERIOD_CARD_LABEL: Record<Period, string> = {
  hourly: "Hourly rent",
  daily: "Daily rent",
  weekly: "Weekly rent",
  biweekly: "Every 2 weeks rent",
  every_4_weeks: "Every 4 weeks rent",
  monthly: "Monthly rent",
  annual: "Annual rent",
};

// Only include routes that exist in your app.
const ROUTE_WHITELIST = new Set<string>([
  "/",
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

function isMode(x: string): x is IncreaseMode {
  return x === "percent" || x === "amount";
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

/**
 * Money formatting rules:
 */
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

/**
 * Parses:
 * - $1,234.56
 * - 1234.56
 * - 1234,56 (comma decimal)
 * - .5 / 12.
 * Avoids silently returning 0 on invalid or ambiguous inputs.
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a rent amount.", warnings };

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
    return { ok: false, error: "Rent must be 0 or greater.", warnings };
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

  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }

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
 * Percent parser:
 * - allows "5", "2.5", "5%", "0.5", "12."
 * - rejects ambiguous junk
 */
function parsePercentToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: "Enter a percent.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/%/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid percent (example: 5 or 2.5).",
      warnings,
    };
  }

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

  // Allow either dot or comma decimal, but not both
  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  if (hasDot && hasComma) {
    return {
      ok: false,
      error: 'Use one decimal separator (example: "2.5").',
      warnings,
    };
  }

  if (hasComma) s = s.replace(",", ".");

  if (!/^\d*\.?\d*$/.test(s)) {
    return { ok: false, error: "Enter a valid percent.", warnings };
  }
  if (s === "." || s === "") {
    return { ok: false, error: "Enter a valid percent.", warnings };
  }

  const parts = s.split(".");
  const intPart = (parts[0] ?? "0").replace(/^0+(?=\d)/, "") || "0";
  const fracPart = parts[1] ?? "";

  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid percent.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid percent.", warnings };
  }

  const maxDec = Number(MAX_DECIMALS);
  const fracCapped =
    fracPart.length > maxDec ? fracPart.slice(0, maxDec) : fracPart;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  // clamp 0 to 10000%
  const maxPct = 10_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxPct);
  if (clamped !== scaled)
    warnings.push("Percent was clamped to the supported maximum.");

  const normalized = fracPart.length
    ? `${intPart}.${fracCapped}`
    : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivInt(value: bigint, mul: bigint, div: bigint): bigint {
  if (div === 0n) return 0n;
  return (value * mul) / div;
}

/**
 * Convert across periods using annual equivalence:
 * month is treated as average month length (365/12 days).
 */
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

function hasTrailingAmbiguousDecimal(raw: string): boolean {
  const s = (raw ?? "").trim();
  return s.endsWith(".") || s.endsWith(",");
}

function formatGroupedFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return "";

  const parts = s.split(".");
  const intPartRaw = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";

  const intDigits = intPartRaw.replace(/[^\d]/g, "") || "0";
  const grouped = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fracPart.length ? `${grouped}.${fracPart}` : grouped;
}

export default function RentAfterIncrease() {
  const [currentRent, setCurrentRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return window.localStorage.getItem("rc_rai_current") ?? "2000";
  });

  const [mode, setMode] = useState<IncreaseMode>(() => {
    if (typeof window === "undefined") return "percent";
    const saved = window.localStorage.getItem("rc_rai_mode") ?? "percent";
    return isMode(saved) ? saved : "percent";
  });

  const [increasePercent, setIncreasePercent] = useState<string>(() => {
    if (typeof window === "undefined") return "5";
    return window.localStorage.getItem("rc_rai_percent") ?? "5";
  });

  const [increaseAmount, setIncreaseAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "100";
    return window.localStorage.getItem("rc_rai_amount") ?? "100";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = window.localStorage.getItem("rc_rai_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_rai_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [isCurrentFocused, setIsCurrentFocused] = useState(false);
  const [isIncreaseAmtFocused, setIsIncreaseAmtFocused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_rai_current", currentRent);
      window.localStorage.setItem("rc_rai_mode", mode);
      window.localStorage.setItem("rc_rai_percent", increasePercent);
      window.localStorage.setItem("rc_rai_amount", increaseAmount);
      window.localStorage.setItem("rc_rai_period", period);
      window.localStorage.setItem("rc_rai_currency", currency);
    } catch {
      // ignore
    }
  }, [
    currentRent,
    mode,
    increasePercent,
    increaseAmount,
    period,
    currency,
  ]);

  const currentParsed = useMemo(
    () => parseMoneyInputToScaled(currentRent),
    [currentRent],
  );
  const amtParsed = useMemo(
    () => parseMoneyInputToScaled(increaseAmount),
    [increaseAmount],
  );
  const pctParsed = useMemo(
    () => parsePercentToScaled(increasePercent),
    [increasePercent],
  );

  const currentAmbiguous = useMemo(
    () => hasTrailingAmbiguousDecimal(currentRent),
    [currentRent],
  );
  const amtAmbiguous = useMemo(
    () => hasTrailingAmbiguousDecimal(increaseAmount),
    [increaseAmount],
  );

  const currentDisplayError = !isCurrentFocused && currentAmbiguous;
  const amtDisplayError = !isIncreaseAmtFocused && amtAmbiguous;

  const currentDisplayValue = useMemo(() => {
    if (isCurrentFocused) return currentRent;
    if (currentParsed.ok && !currentAmbiguous && currentParsed.normalized) {
      return formatGroupedFromNormalized(currentParsed.normalized);
    }
    return currentRent;
  }, [
    isCurrentFocused,
    currentRent,
    currentParsed.ok,
    currentParsed.normalized,
    currentAmbiguous,
  ]);

  const increaseAmountDisplayValue = useMemo(() => {
    if (isIncreaseAmtFocused) return increaseAmount;
    if (amtParsed.ok && !amtAmbiguous && amtParsed.normalized) {
      return formatGroupedFromNormalized(amtParsed.normalized);
    }
    return increaseAmount;
  }, [
    isIncreaseAmtFocused,
    increaseAmount,
    amtParsed.ok,
    amtParsed.normalized,
    amtAmbiguous,
  ]);
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!currentParsed.ok)
      errors.push(currentParsed.error ?? "Enter a valid current rent.");
    if (currentParsed.warnings.length) warnings.push(...currentParsed.warnings);
    if (currentAmbiguous)
      errors.push(
        "That rent value is incomplete or ambiguous (trailing decimal separator).",
      );

    if (mode === "percent") {
      if (!pctParsed.ok)
        errors.push(pctParsed.error ?? "Enter a valid percent.");
      if (pctParsed.warnings.length) warnings.push(...pctParsed.warnings);
    } else {
      if (!amtParsed.ok)
        errors.push(amtParsed.error ?? "Enter a valid increase amount.");
      if (amtParsed.warnings.length) warnings.push(...amtParsed.warnings);
      if (amtAmbiguous)
        errors.push(
          "That increase amount is incomplete or ambiguous (trailing decimal separator).",
        );
    }

    if (errors.length) {
      return { ok: false as const, errors, warnings };
    }

    const currentScaled = currentParsed.scaled as bigint;

    // Annualize current rent from the selected billing period.
    const annualCurrent = convertScaled(currentScaled, period, "annual");

    // Annualize increase from the same selected billing period for fixed-amount mode.
    let annualIncrease = 0n;
    if (mode === "percent") {
      const pctScaled = pctParsed.scaled as bigint;
      annualIncrease = mulDivInt(annualCurrent, pctScaled, 100n * SCALE);
    } else {
      const incScaled = amtParsed.scaled as bigint;
      annualIncrease = convertScaled(incScaled, period, "annual");
    }

    const annualNew = annualCurrent + annualIncrease;

    const pctTimes100 =
      annualCurrent > 0n
        ? mulDivInt(annualIncrease, 10_000n, annualCurrent)
        : 0n;
    const effectivePctNum = Number(pctTimes100) / 100;

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
      const oldVal = convertScaled(annualCurrent, "annual", p);
      const newVal = convertScaled(annualNew, "annual", p);
      const delta = newVal - oldVal;
      return { p, oldVal, newVal, delta };
    });

    const selectedRow = breakdown.find((row) => row.p === period);
    const otherBreakdown = breakdown.filter((row) => row.p !== period);

    const newPerSelected = selectedRow?.newVal ?? annualNew;
    const oldPerSelected = selectedRow?.oldVal ?? annualCurrent;
    const deltaPerSelected = selectedRow?.delta ?? annualIncrease;

    const oldMonthlyAvg = convertScaled(annualCurrent, "annual", "monthly");
    const old4w = convertScaled(annualCurrent, "annual", "every_4_weeks");
    const newMonthlyAvg = convertScaled(annualNew, "annual", "monthly");
    const new4w = convertScaled(annualNew, "annual", "every_4_weeks");

    return {
      ok: true as const,
      warnings,
      annualCurrent,
      annualNew,
      annualIncrease,
      effectivePctNum,
      breakdown,
      otherBreakdown,
      newPerSelected,
      deltaPerSelected,
      oldMonthlyAvg,
      old4w,
      newMonthlyAvg,
      new4w,
      avgMonthDays: 365 / 12,
      oldPerSelected,
    };
  }, [
    currentParsed,
    amtParsed,
    pctParsed,
    mode,
    period,
    currentAmbiguous,
    amtAmbiguous,
  ]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do you calculate rent after an increase?",
      a: "Enter the current rent, billing period, and increase. The calculator applies the increase to that billing period, then shows the new rent and converts it into other common periods.",
    },
    {
      q: "What does the billing period apply to?",
      a: "The billing period applies to the current rent and, in fixed amount mode, to the increase amount. It also controls the large result shown at the top.",
    },
    {
      q: "What formula does the percent rent increase calculation use?",
      a: "For percent mode, the formula is new rent = current rent × (1 + increase percent ÷ 100). The calculator also converts the result into other periods.",
    },
    {
      q: "What formula does the fixed amount increase calculation use?",
      a: "For fixed amount mode, the formula is new rent = current rent + increase amount for the selected billing period.",
    },
    {
      q: "Why are monthly and every 4 weeks shown separately?",
      a: "Every 4 weeks is 28 days. An average month is about 30.42 days. Showing both avoids treating two different billing periods as the same.",
    },
    {
      q: "Does this include utilities, fees, taxes, or rent-control rules?",
      a: "No. It compares rent amounts only. Legal limits, utilities, fees, taxes, deposits, and lease-specific rules are not included.",
    },
    {
      q: "Will this match the first payment after an increase takes effect?",
      a: "Not always. A first payment can be affected by proration, mid-cycle effective dates, or lease terms. This calculator shows full-period estimates.",
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
        name: "Rent After Increase Calculator",
        item: "https://www.rentconverter.com/rent-after-increase-calculator",
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
    name: "Rent After Increase Calculator",
    description:
      "Calculate new rent after a percentage or fixed increase. Includes result-by-period conversions, annual impact, and rent breakdowns.",
    url: "https://www.rentconverter.com/rent-after-increase-calculator",
  };

  const currentInvalid = !currentParsed.ok || currentDisplayError;

  const currentDescribedBy = currentInvalid
    ? "rc-current-help rc-current-error"
    : "rc-current-help";

  const increaseInvalid =
    mode === "percent" ? !pctParsed.ok : !amtParsed.ok || amtDisplayError;

  const increaseDescribedBy = increaseInvalid
    ? "rc-inc-help rc-inc-error"
    : "rc-inc-help";

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
                  Rent after increase
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Rent After Increase Calculator
                </h1>

                <p className="mt-2 max-w-6xl text-base leading-relaxed text-slate-700">
                  Calculate new rent after a percentage or fixed increase. The
                  selected billing period controls the main result.
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
                  Current rent
                </label>

                <div className="flex gap-2">
                  <input
                    inputMode="decimal"
                    value={currentDisplayValue}
                    onFocus={() => setIsCurrentFocused(true)}
                    onBlur={() => setIsCurrentFocused(false)}
                    onChange={(e) =>
                      setCurrentRent(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 2000 or 2000.00"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={currentInvalid}
                    aria-describedby={currentDescribedBy}
                  />

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        isCurrency(e.target.value) ? e.target.value : "USD",
                      )
                    }
                    className="w-28 shrink-0 cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-current-help" className="mt-2 text-sm text-slate-700">
                  Enter the rent amount before the increase.
                </p>

                {currentDisplayError ? (
                  <p
                    id="rc-current-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    That rent value is incomplete or ambiguous (trailing decimal
                    separator).
                  </p>
                ) : !currentParsed.ok ? (
                  <p
                    id="rc-current-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {currentParsed.error}
                  </p>
                ) : currentParsed.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {currentParsed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Billing period
                </label>
                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="w-full cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                  aria-label="Billing period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Increase type
                </label>
                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(isMode(e.target.value) ? e.target.value : "percent")
                  }
                  className="w-full cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                  aria-label="Increase type"
                >
                  <option value="percent">Percent increase</option>
                  <option value="amount">Fixed amount increase</option>
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {mode === "percent" ? "Increase percent" : "Increase amount"}
                </label>

                {mode === "percent" ? (
                  <>
                    <input
                      inputMode="decimal"
                      value={increasePercent}
                      onChange={(e) => setIncreasePercent(e.target.value)}
                      placeholder="e.g. 5 or 2.5"
                      className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                      aria-invalid={!pctParsed.ok}
                      aria-describedby={increaseDescribedBy}
                    />
                    <p id="rc-inc-help" className="mt-2 text-sm text-slate-700">
                      Enter the increase as a percent, such as 5 or 2.5.
                    </p>
                    {!pctParsed.ok ? (
                      <p
                        id="rc-inc-error"
                        className="mt-2 text-sm font-semibold text-rose-700"
                        role="alert"
                      >
                        {pctParsed.error}
                      </p>
                    ) : pctParsed.warnings.length ? (
                      <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                        <div className="font-semibold">
                          Input interpretation note
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {pctParsed.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <input
                      inputMode="decimal"
                      value={increaseAmountDisplayValue}
                      onFocus={() => setIsIncreaseAmtFocused(true)}
                      onBlur={() => setIsIncreaseAmtFocused(false)}
                      onChange={(e) =>
                        setIncreaseAmount(e.target.value.replace(/,/g, ""))
                      }
                      placeholder="e.g. 100 or 100.00"
                      className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition placeholder:text-slate-700 hover:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                      aria-invalid={!amtParsed.ok || amtDisplayError}
                      aria-describedby={increaseDescribedBy}
                    />
                    <p id="rc-inc-help" className="mt-2 text-sm text-slate-700">
                      Enter the increase as an amount per the selected billing
                      period.
                    </p>
                    {amtDisplayError ? (
                      <p
                        id="rc-inc-error"
                        className="mt-2 text-sm font-semibold text-rose-700"
                        role="alert"
                      >
                        That increase amount is incomplete or ambiguous
                        (trailing decimal separator).
                      </p>
                    ) : !amtParsed.ok ? (
                      <p
                        id="rc-inc-error"
                        className="mt-2 text-sm font-semibold text-rose-700"
                        role="alert"
                      >
                        {amtParsed.error}
                      </p>
                    ) : amtParsed.warnings.length ? (
                      <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                        <div className="font-semibold">
                          Input interpretation note
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {amtParsed.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block">
              <div
                className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400"
                aria-hidden="true"
              />

              <div className="p-5 sm:p-6">
                {!computed.ok ? (
                  <div className="rounded-2xl bg-white p-4">
                    <div className="font-semibold text-slate-950">
                      No results to show
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      Fix the inputs below to see the updated rent and annual
                      impact.
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
                        {PERIOD_RESULT_LABEL[period]}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <div className="tabular-nums text-3xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">
                        {fmt(computed.newPerSelected)}
                      </div>
                      <p className="text-sm text-slate-700">
                        Based on {PERIOD_LABEL[period].toLowerCase()} rent and
                        the selected increase.
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {computed.otherBreakdown.map((row) => (
                        <div
                          key={row.p}
                          className="rounded-2xl bg-white px-4 py-3"
                        >
                          <div className="text-xs font-medium text-slate-700">
                            {PERIOD_CARD_LABEL[row.p]}
                          </div>
                          <div className="mt-1 tabular-nums text-lg font-bold text-slate-950">
                            {fmt(row.newVal)}
                          </div>
                        </div>
                      ))}

                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 sm:col-span-2 lg:col-span-3 rc-print-block">
                        <div className="text-xs font-medium text-slate-700">
                          Increase summary
                        </div>
                        <div className="mt-2 grid gap-3 sm:grid-cols-3">
                          <div>
                            <div className="text-xs text-slate-700">
                              Estimated percent change
                            </div>
                            <div className="mt-1 tabular-nums text-sm font-bold text-slate-950">
                              {safeToFixed(computed.effectivePctNum, 2)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-700">
                              Change per selected period
                            </div>
                            <div className="mt-1 tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.deltaPerSelected)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-700">
                              Annual increase
                            </div>
                            <div className="mt-1 tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.annualIncrease)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3 sm:col-span-2 lg:col-span-3 rc-print-block">
                        <div className="text-xs font-medium text-slate-700">
                          Annual totals
                        </div>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-slate-700">
                            Current annual rent:{" "}
                            <strong className="tabular-nums text-slate-950">
                              {fmt(computed.annualCurrent)}
                            </strong>
                          </div>
                          <div className="text-sm text-slate-700">
                            New annual rent:{" "}
                            <strong className="tabular-nums text-slate-950">
                              {fmt(computed.annualNew)}
                            </strong>
                          </div>
                          <div className="text-sm text-slate-700">
                            Difference:{" "}
                            <strong className="tabular-nums text-slate-950">
                              {fmt(computed.annualNew - computed.annualCurrent)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 shadow-sm sm:col-span-2 lg:col-span-3 rc-print-block">
                        <div className="text-xs font-medium text-slate-700">
                          Monthly vs 4-week before and after
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Current · monthly
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.oldMonthlyAvg)}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              Current · 4-week
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.old4w)}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              New · monthly
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.newMonthlyAvg)}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                            <div className="text-[11px] text-slate-700">
                              New · 4-week
                            </div>
                            <div className="mt-0.5 whitespace-nowrap tabular-nums text-sm font-bold text-slate-950">
                              {fmt(computed.new4w)}
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
              <div className="mt-3 rounded-2xl bg-white p-5 sm:p-6 rc-print-block">
                <h3 className="mb-3 text-lg font-bold text-sky-800">
                  Full breakdown across periods
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-700">
                  This table converts the current rent and new rent into common
                  billing periods.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-[820px] w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-700">
                        <th className="py-2 pr-4 font-semibold">Period</th>
                        <th className="py-2 pr-4 font-semibold">Current</th>
                        <th className="py-2 pr-4 font-semibold">New</th>
                        <th className="py-2 pr-4 font-semibold">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {computed.breakdown.map((row) => (
                        <tr key={row.p} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-semibold text-slate-950">
                            {PERIOD_LABEL[row.p]}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmt(row.oldVal)}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmt(row.newVal)}
                          </td>
                          <td className="py-2 pr-4 tabular-nums text-slate-700">
                            {fmt(row.delta)}
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
          / Rent After Increase Calculator
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
