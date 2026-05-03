import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-calculator";
import HowItWorks from "~/client/components/rent-increase-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-increase-calculator/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Increase Calculator | New Rent and Percent Change";
  const description =
    "Calculate the new rent after a fixed or percentage increase. Compare the old rent, new rent, monthly change, and yearly impact.";

  const canonicalUrl = "https://www.rentconverter.com/rent-increase-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent increase calculator, calculate rent increase, rent increase percentage, rent raise calculator, new rent after increase, rent increase projection",
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
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

type IncreaseMode = "percent" | "fixed";

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
  return x === "percent" || x === "fixed";
}

/**
 * Only include routes you are sure exist.
 * If you do not have a whitelist, remove safeHref and use plain hrefs.
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

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
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

function formatPercentValue(value: number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";

  return (
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n) + "%"
  );
}

function groupThousandsEnUS(intDigits: string): string {
  const s = (intDigits ?? "").replace(/^0+(?=\d)/, "") || "0";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMoneyPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;

  const parts = s.split(".");
  const intPart = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";

  const groupedInt = groupThousandsEnUS(intPart.replace(/[^\d]/g, "") || "0");
  return fracPart.length ? `${groupedInt}.${fracPart}` : groupedInt;
}

/**
 * Accepts: $2,000, 2000.00, .5, 12., 2000,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3" etc.
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
      error: "Enter a valid number (example: 2200 or 2200.00).",
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
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
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
    warnings.push("Value was clamped to the supported maximum.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

type ParsedPercent = { ok: boolean; value?: number; error?: string };

function parsePercentInput(raw: string): ParsedPercent {
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: "Enter a percent." };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return { ok: false, error: "Enter a valid percent (example: 3 or 3.5)." };
  if (s.includes("-"))
    return { ok: false, error: "Percent must be 0 or greater." };

  // percent: allow comma as decimal if it's clearly decimal
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let decimalSep: "." | "," | null = null;

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSep = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1) {
    decimalSep = ".";
  } else if (lastComma !== -1) {
    const parts = s.split(",");
    if (
      parts.length === 2 &&
      /^\d{1,4}$/.test(parts[0] ?? "") &&
      /^\d{1,6}$/.test(parts[1] ?? "")
    ) {
      decimalSep = ",";
    } else {
      // treat commas as thousand separators for percent
      decimalSep = null;
    }
  }

  let intPart = s;
  let fracPart = "";
  if (decimalSep) {
    const split = s.split(decimalSep);
    if (split.length > 2) return { ok: false, error: "Enter a valid percent." };
    intPart = split[0] ?? "0";
    fracPart = split[1] ?? "";
  }

  intPart = intPart.replace(/[.,]/g, "");
  const rebuilt = fracPart ? `${intPart}.${fracPart}` : intPart;

  const n = Number(rebuilt);
  if (!Number.isFinite(n))
    return { ok: false, error: "Enter a valid percent." };

  return { ok: true, value: clampNum(n, 0, 1000) };
}

function divRound(numer: bigint, denom: bigint): bigint {
  if (denom === 0n) return 0n;
  // half-up rounding for positive values
  return (numer + denom / 2n) / denom;
}

function annualizeFromScaled(valueScaled: bigint, period: Period): bigint {
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

/**
 * Percent compounding without floats.
 * We convert the percent into "micros" (1e-6) and apply factor as a rational:
 * factor = (100% + pct) / 100% = (100_000_000 + pctMicros) / 100_000_000
 */
const PCT_MICROS_SCALE = 1_000_000n; // 1e6
const PCT_DENOM = 100n * PCT_MICROS_SCALE; // 100_000_000

function pctToMicrosBigInt(pct: number): bigint {
  const n = Number(pct);
  if (!Number.isFinite(n) || n < 0) return 0n;
  // pct is clamped earlier to <= 1000, so this stays safe as a Number.
  return BigInt(Math.round(n * 1_000_000));
}

function computeEffectivePctNumber(
  annualBaseScaled: bigint,
  annualDeltaScaled: bigint,
): number {
  if (annualBaseScaled <= 0n) return 0;
  // effectivePctMicros = (delta/base) * 100, in micros
  const numer = annualDeltaScaled * PCT_DENOM; // delta * (100*1e6)
  const denom = annualBaseScaled;
  // half-up for positive values, and handle sign
  const sign = numer < 0n ? -1n : 1n;
  const a = numer < 0n ? -numer : numer;
  const q = (a + denom / 2n) / denom;
  const micros = sign < 0n ? -q : q;

  const am = absBigInt(micros);
  if (am > MAX_SAFE_INT_FOR_NUMBER) return Number.NaN;
  return Number(micros) / 1_000_000;
}

export default function RentIncreaseCalculator() {
  const pageName = "Rent Increase Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-increase-calculator";

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_ri_rent") ?? "2200";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_ri_rent_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [mode, setMode] = useState<IncreaseMode>(() => {
    if (typeof window === "undefined") return "percent";
    const saved = localStorage.getItem("rc_ri_mode") ?? "percent";
    return isMode(saved) ? saved : "percent";
  });

  const [percentIncrease, setPercentIncrease] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_ri_pct") ?? "3";
  });

  const [fixedIncrease, setFixedIncrease] = useState<string>(() => {
    if (typeof window === "undefined") return "100";
    return localStorage.getItem("rc_ri_fixed") ?? "100";
  });

  const [numIncreases, setNumIncreases] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return localStorage.getItem("rc_ri_n") ?? "1";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_ri_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [rentFocused, setRentFocused] = useState(false);
  const [fixedFocused, setFixedFocused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_ri_rent", rentAmount);
      localStorage.setItem("rc_ri_rent_period", rentPeriod);
      localStorage.setItem("rc_ri_mode", mode);
      localStorage.setItem("rc_ri_pct", percentIncrease);
      localStorage.setItem("rc_ri_fixed", fixedIncrease);
      localStorage.setItem("rc_ri_n", numIncreases);
      localStorage.setItem("rc_ri_currency", currency);
    } catch {
      // ignore
    }
  }, [
    rentAmount,
    rentPeriod,
    mode,
    percentIncrease,
    fixedIncrease,
    numIncreases,
    currency,
  ]);

  const rentParsed = useMemo(
    () => parseMoneyInputToScaled(rentAmount),
    [rentAmount],
  );
  const fixedParsed = useMemo(
    () => parseMoneyInputToScaled(fixedIncrease),
    [fixedIncrease],
  );
  const pctParsed = useMemo(
    () => parsePercentInput(percentIncrease),
    [percentIncrease],
  );

  const nParsed = useMemo(() => {
    const s = (numIncreases ?? "").trim();
    if (!s)
      return {
        ok: false as const,
        value: 1,
        error: "Enter a projection step count.",
      };
    const cleaned = s.replace(/[^\d]/g, "");
    if (!cleaned)
      return {
        ok: false as const,
        value: 1,
        error: "Enter a valid whole number (1 to 50).",
      };
    const n = Number(cleaned);
    if (!Number.isFinite(n))
      return {
        ok: false as const,
        value: 1,
        error: "Enter a valid whole number (1 to 50).",
      };
    return { ok: true as const, value: clampNum(Math.floor(n), 1, 50) };
  }, [numIncreases]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const fmtPct = (n: number) =>
    formatPercentValue(n);

  const rentDisplayValue = useMemo(() => {
    if (rentFocused) return rentAmount;
    if (rentParsed.ok && rentParsed.normalized) {
      return formatMoneyPreviewFromNormalized(rentParsed.normalized);
    }
    return rentAmount;
  }, [rentFocused, rentAmount, rentParsed.ok, rentParsed.normalized]);

  const fixedDisplayValue = useMemo(() => {
    if (fixedFocused) return fixedIncrease;
    if (fixedParsed.ok && fixedParsed.normalized) {
      return formatMoneyPreviewFromNormalized(fixedParsed.normalized);
    }
    return fixedIncrease;
  }, [fixedFocused, fixedIncrease, fixedParsed.ok, fixedParsed.normalized]);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rentParsed.ok)
      errors.push(rentParsed.error ?? "Enter a valid rent amount.");
    if (rentParsed.warnings.length) warnings.push(...rentParsed.warnings);

    if (mode === "fixed") {
      if (!fixedParsed.ok)
        errors.push(
          fixedParsed.error ?? "Enter a valid fixed increase amount.",
        );
      if (fixedParsed.warnings.length) warnings.push(...fixedParsed.warnings);
    } else {
      if (!pctParsed.ok)
        errors.push(pctParsed.error ?? "Enter a valid percent.");
    }

    if (!nParsed.ok)
      errors.push(nParsed.error ?? "Enter a valid projection step count.");

    const rentScaled = rentParsed.ok ? (rentParsed.scaled as bigint) : 0n;
    const fixedScaled = fixedParsed.ok ? (fixedParsed.scaled as bigint) : 0n;
    const pct = pctParsed.ok ? (pctParsed.value as number) : 0;

    if (errors.length) {
      return { ok: false as const, errors, warnings };
    }

    const n = nParsed.value;

    // annualize current rent and the fixed increase in the same period
    const annualBaseScaled = annualizeFromScaled(rentScaled, rentPeriod);
    const annualFixedIncrementScaled = annualizeFromScaled(
      fixedScaled,
      rentPeriod,
    );

    // Percent mode: apply compounding using integer math (no floats).
    // Fixed mode: annualBase + annualFixedIncrement*n (exact bigint)
    let annualNewScaled: bigint;

    const pctMicros = pctToMicrosBigInt(pct);
    const pctNum = PCT_DENOM + pctMicros; // (100% + pct) in micros

    // Build projection steps (step 0 = current) in a single pass.
    const steps: Array<{
      step: number;
      annualScaled: bigint;
      perPeriodScaled: bigint;
      monthlyAvgScaled: bigint;
      every4wScaled: bigint;
      weeklyScaled: bigint;
      deltaAnnualFromPrevScaled: bigint;
    }> = [];

    if (mode === "percent") {
      let prev = annualBaseScaled;
      let cur = annualBaseScaled;

      steps.push({
        step: 0,
        annualScaled: cur,
        perPeriodScaled: fromAnnualScaled(cur, rentPeriod),
        monthlyAvgScaled: fromAnnualScaled(cur, "monthly"),
        every4wScaled: fromAnnualScaled(cur, "every_4_weeks"),
        weeklyScaled: fromAnnualScaled(cur, "weekly"),
        deltaAnnualFromPrevScaled: 0n,
      });

      for (let i = 1; i <= n; i++) {
        cur = mulDivRound(cur, pctNum, PCT_DENOM);
        const delta = cur - prev;

        steps.push({
          step: i,
          annualScaled: cur,
          perPeriodScaled: fromAnnualScaled(cur, rentPeriod),
          monthlyAvgScaled: fromAnnualScaled(cur, "monthly"),
          every4wScaled: fromAnnualScaled(cur, "every_4_weeks"),
          weeklyScaled: fromAnnualScaled(cur, "weekly"),
          deltaAnnualFromPrevScaled: delta,
        });

        prev = cur;
      }

      annualNewScaled = cur;
    } else {
      // fixed mode
      annualNewScaled =
        annualBaseScaled + annualFixedIncrementScaled * BigInt(n);

      // steps for fixed mode
      let prev = annualBaseScaled;

      for (let i = 0; i <= n; i++) {
        const cur = annualBaseScaled + annualFixedIncrementScaled * BigInt(i);
        const delta = i === 0 ? 0n : cur - prev;

        steps.push({
          step: i,
          annualScaled: cur,
          perPeriodScaled: fromAnnualScaled(cur, rentPeriod),
          monthlyAvgScaled: fromAnnualScaled(cur, "monthly"),
          every4wScaled: fromAnnualScaled(cur, "every_4_weeks"),
          weeklyScaled: fromAnnualScaled(cur, "weekly"),
          deltaAnnualFromPrevScaled: delta,
        });

        prev = cur;
      }
    }

    // Guard: this should not happen now, but keep the UX-friendly error.
    if (!annualNewScaled || annualNewScaled < 0n) {
      return {
        ok: false as const,
        errors: ["Inputs produced an invalid result."],
        warnings,
      };
    }

    const annualDeltaScaled = annualNewScaled - annualBaseScaled;

    const effectivePct = computeEffectivePctNumber(
      annualBaseScaled,
      annualDeltaScaled,
    );

    const basePerPeriodScaled = fromAnnualScaled(annualBaseScaled, rentPeriod);
    const newPerPeriodScaled = fromAnnualScaled(annualNewScaled, rentPeriod);

    const baseMonthlyAvgScaled = fromAnnualScaled(annualBaseScaled, "monthly");
    const newMonthlyAvgScaled = fromAnnualScaled(annualNewScaled, "monthly");

    const base4wScaled = fromAnnualScaled(annualBaseScaled, "every_4_weeks");
    const new4wScaled = fromAnnualScaled(annualNewScaled, "every_4_weeks");

    const baseWeeklyScaled = fromAnnualScaled(annualBaseScaled, "weekly");
    const newWeeklyScaled = fromAnnualScaled(annualNewScaled, "weekly");

    const monthMinus4wBaseScaled = baseMonthlyAvgScaled - base4wScaled;
    const monthMinus4wNewScaled = newMonthlyAvgScaled - new4wScaled;

    return {
      ok: true as const,
      warnings,

      n,
      pct,
      factor: Number.NaN, // kept for backward shape, not used in UI

      annualBaseScaled,
      annualNewScaled,
      annualDeltaScaled,
      effectivePct,

      basePerPeriodScaled,
      newPerPeriodScaled,

      baseMonthlyAvgScaled,
      newMonthlyAvgScaled,
      base4wScaled,
      new4wScaled,
      baseWeeklyScaled,
      newWeeklyScaled,

      monthMinus4wBaseScaled,
      monthMinus4wNewScaled,

      annualFixedIncrementScaled,

      steps,
    };
  }, [rentParsed, fixedParsed, pctParsed, nParsed, rentPeriod, mode]);

  const faqData = [
    {
      q: "What does this rent increase calculator show?",
      a: "It shows the new rent after a percentage or fixed increase. It also shows the annual impact, average monthly amount, weekly amount, and 4-week amount.",
    },
    {
      q: "How are percentage rent increases calculated?",
      a: "Percentage increases are applied to the current rent. If you project more than one increase, each increase compounds from the previous result.",
    },
    {
      q: "How are fixed rent increases calculated?",
      a: "A fixed increase is added in the same billing period as the rent you entered. The calculator annualizes that amount so the results can be compared across monthly, weekly, and 4-week periods.",
    },
    {
      q: "Why are monthly rent and 4-week rent different?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days based on 365 days divided by 12. That difference changes the annual total.",
    },
    {
      q: "Does this calculate prorated rent after an increase?",
      a: "No. This page estimates full-period rent after an increase. If an increase starts partway through a billing period, the first payment may need a separate proration calculation.",
    },
    {
      q: "Can I use this for lease renewal planning?",
      a: "Yes. It is useful for estimating the cost of a proposed rent increase before renewing a lease, comparing options, or checking the annual impact of a rent change.",
    },
    {
      q: "What assumptions does this page use?",
      a: "The calculator uses 365 days per year, 7 days per week, 14 days for biweekly rent, 28 days for every 4 weeks, and 365 ÷ 12 days for an average month.",
    },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    url: canonicalUrl,
    description:
      "Calculate the new rent after a fixed or percentage increase. Compare the old rent, new rent, monthly change, and yearly impact.",
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

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 pt-6">
        <div className="rounded-2xl bg-white/95 shadow-sm border border-slate-200 px-0 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  Rent increase tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Increase Calculator
                </h1>

                <p className="mt-2 max-w-3xl text-base text-slate-700">
                  Calculate your new rent after a percentage or fixed increase.
                  The calculator also shows the annual and per-period impact.
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
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current rent
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentDisplayValue}
                  onFocus={() => setRentFocused(true)}
                  onBlur={() => setRentFocused(false)}
                  onChange={(e) =>
                    setRentAmount(e.target.value.replace(/,/g, ""))
                  }
                  placeholder="e.g. 2200 or 2200.00"
                  className="col-span-7 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!rentParsed.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="cursor-pointer col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-300 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                Increase type
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("percent")}
                  className={`cursor-pointer rounded-xl border px-4 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    mode === "percent"
                      ? "border-sky-300 bg-sky-50 hover:border-sky-400 hover:bg-sky-100"
                      : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  <div className="text-xs text-slate-600">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    Percent increase
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("fixed")}
                  className={`cursor-pointer rounded-xl border px-4 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    mode === "fixed"
                      ? "border-sky-300 bg-sky-50 hover:border-sky-400 hover:bg-sky-100"
                      : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  <div className="text-xs text-slate-600">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    Fixed amount increase
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase value ({PERIOD_LABEL[rentPeriod]})
              </label>

              {mode === "percent" ? (
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={percentIncrease}
                    onChange={(e) => setPercentIncrease(e.target.value)}
                    placeholder="e.g. 3 or 3.5"
                    className="col-span-8 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!pctParsed.ok}
                  />
                  <div className="col-span-4 rounded-xl border border-slate-200 bg-white px-4 py-2 flex items-center text-sm font-semibold text-slate-700">
                    %
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <input
                    inputMode="decimal"
                    value={fixedDisplayValue}
                    onFocus={() => setFixedFocused(true)}
                    onBlur={() => setFixedFocused(false)}
                    onChange={(e) =>
                      setFixedIncrease(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 100 or 100.00"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!fixedParsed.ok}
                  />
                </div>
              )}

              {mode === "percent" && !pctParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {pctParsed.error}
                </p>
              ) : null}

              {mode === "fixed" && !fixedParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {fixedParsed.error}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-4 md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of increases to project (steps 1 to 50)
              </label>
              <div className="grid gap-2">
                <input
                  inputMode="numeric"
                  value={numIncreases}
                  onChange={(e) => setNumIncreases(e.target.value)}
                  placeholder="e.g. 1"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!nParsed.ok}
                />
              </div>
              {!nParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {nParsed.error}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-4 md:col-span-12">
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-300 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50/60 shadow-sm rc-print-block">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:p-6">
              {!computed.ok ? (
                <div className="rounded-xl border border-slate-200 bg-white/95 p-4">
                  <div className="font-semibold text-slate-900">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Fix the inputs to calculate the increase.
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
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-900">
                      New rent after increase
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                      {fmtMoney(computed.newPerPeriodScaled)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Based on the rent period selected above.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                      <div className="text-xs text-slate-600">
                        Increase (effective)
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900">
                        {fmtPct(computed.effectivePct)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                      <div className="text-xs text-slate-600">
                        Annual before
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900">
                        {fmtMoney(computed.annualBaseScaled)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                      <div className="text-xs text-slate-600">Annual after</div>
                      <div className="mt-1 text-lg font-bold text-slate-900">
                        {fmtMoney(computed.annualNewScaled)}
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="text-sm text-slate-700">
                          Annual difference:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(computed.annualDeltaScaled)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Monthly difference:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(
                              computed.newMonthlyAvgScaled -
                                computed.baseMonthlyAvgScaled,
                            )}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Weekly difference:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(
                              computed.newWeeklyScaled -
                                computed.baseWeeklyScaled,
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Monthly vs every 4 weeks
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-sm text-slate-700">
                          Before monthly:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(computed.baseMonthlyAvgScaled)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Before 4 weeks:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(computed.base4wScaled)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          After monthly:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(computed.newMonthlyAvgScaled)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          After 4 weeks:{" "}
                          <strong className="text-slate-900">
                            {fmtMoney(computed.new4wScaled)}
                          </strong>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600">
                        Monthly and 4-week cycles are different. Difference:
                        before {fmtMoney(computed.monthMinus4wBaseScaled)},
                        after {fmtMoney(computed.monthMinus4wNewScaled)}.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white/95 p-5 sm:p-6 shadow-sm rc-print-block">
                    <h3 className="text-lg font-bold text-sky-800 mb-2">
                      Projection by increase step
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Percent mode compounds. Fixed mode adds the same
                      annualized amount each step.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-[860px] w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-600 border-b border-slate-200">
                            <th className="py-2 pr-4">Step</th>
                            <th className="py-2 pr-4">
                              Rent ({PERIOD_LABEL[rentPeriod]})
                            </th>
                            <th className="py-2 pr-4">Annualized</th>
                            <th className="py-2 pr-4">Monthly</th>
                            <th className="py-2 pr-4">Every 4 weeks</th>
                            <th className="py-2 pr-4">Weekly</th>
                            <th className="py-2 pr-4">Delta vs prior annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.steps.map((s) => (
                            <tr
                              key={s.step}
                              className="border-b border-slate-100"
                            >
                              <td className="py-2 pr-4 font-semibold text-slate-900">
                                {s.step === 0 ? "Current" : `+${s.step}`}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {fmtMoney(s.perPeriodScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {fmtMoney(s.annualScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {fmtMoney(s.monthlyAvgScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {fmtMoney(s.every4wScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {fmtMoney(s.weeklyScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-800">
                                {s.step === 0
                                  ? "-"
                                  : fmtMoney(s.deltaAnnualFromPrevScaled)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {computed.warnings.length ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
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
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div className="font-semibold text-slate-900">
              Assumptions used on this page
            </div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>Biweekly = 14 days</li>
              <li>4-week rent = 28 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” such as
                fees, utilities, or taxes. Enter the total you want to budget
                with.
              </li>
            </ul>
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm rc-no-print">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculations preserve precision internally, while displayed money values are rounded to cents.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 md:hidden"
              >
                Print / Save PDF
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Calculations preserve precision internally, while displayed money values are rounded to cents.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks safeHref={safeHref} />

      <section className="max-w-6xl mx-auto px-6 pt-4 hidden sm:block">
        <nav className="text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="cursor-pointer text-sky-700 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded"
          >
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>
      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-5 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
