import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-calculator";
export const meta: Route.MetaFunction = () => [
  {
    title: "Rent Increase Calculator (Percent or Fixed) + Annual Impact",
  },
  {
    name: "description",
    content:
      "Instantly calculate your new rent after a percent or fixed increase. See the monthly, weekly, and 4-week (28-day) equivalents, the annual impact, and optional multi-increase projections. Clear assumptions, exact decimals. Free and private.",
  },
  {
    name: "keywords",
    content:
      "rent increase calculator, calculate rent increase, rent increase percentage, rent raise calculator, new rent after increase, rent increase projection",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Increase Calculator (Percent or Fixed) + Annual Impact",
  },
  {
    property: "og:description",
    content:
      "Calculate your new rent after a percent or fixed increase and see the annual impact plus monthly, weekly, and 28-day equivalents. Includes optional multi-increase projections.",
  },
  {
    property: "og:url",
    content: "https://www.rentconverter.com/rent-increase-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  {
    property: "og:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Increase Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate your new rent after a percent or fixed increase and see the annual impact and pay-cycle equivalents.",
  },
  {
    name: "twitter:image",
    content: "https://www.rentconverter.com/og-image.jpg",
  },

  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.rentconverter.com/rent-increase-calculator",
  },
];

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

function formatPercentValue(
  value: number,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";

  const allowed = new Set([0, 2, 4, 6]);
  const digits = allowed.has(displayDecimals) ? displayDecimals : 2;

  return (
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: roundDisplay ? digits : 0,
      maximumFractionDigits: roundDisplay ? digits : 12,
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

function parseDisplayDecimalsStrict(raw: string | null): number {
  const allowed = new Set([0, 2, 4, 6]);
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : 2;
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

  // display-only rounding
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_ri_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return parseDisplayDecimalsStrict(
      localStorage.getItem("rc_ri_display_decimals"),
    );
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
      localStorage.setItem("rc_ri_round_display", JSON.stringify(roundDisplay));
      localStorage.setItem("rc_ri_display_decimals", String(displayDecimals));
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
    roundDisplay,
    displayDecimals,
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
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const fmtPct = (n: number) =>
    formatPercentValue(n, roundDisplay, displayDecimals);

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
      q: "What does this rent increase calculator output?",
      a: "It estimates a new rent after a percent or fixed increase, plus the annual and monthly impact. The results are derived from annual totals so different pay and billing cycles can be compared consistently.",
    },
    {
      q: "How is a percent increase applied when there are multiple increases?",
      a: "Percent increases are compounded in the projection. For example, two increases of 3% are applied as 1.03 × 1.03 on the annualized rent total.",
    },
    {
      q: "How is a fixed increase applied when there are multiple increases?",
      a: "A fixed increase is treated as an amount added each time, in the same billing period as the rent input. The calculator annualizes that fixed amount and applies it repeatedly for the number of increases selected.",
    },
    {
      q: "Why do the monthly and 4-week equivalents differ?",
      a: "A 4-week period is always 28 days. An average month is about 30.42 days (365 ÷ 12). This calculator shows both so the difference is visible instead of implied away.",
    },
    {
      q: "Does this reflect proration, mid-lease changes, or partial months?",
      a: "No. It estimates full-period equivalents. Lease proration rules and effective dates can change the first payment after an increase.",
    },
    {
      q: "Can this be used to compare two different rent listings after an increase?",
      a: "It helps compare estimated totals on a consistent basis. Actual costs can differ if utilities, fees, parking, or incentives are included in one listing and not the other.",
    },
    {
      q: "What assumptions are used for the time conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com/",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      setCopiedKey("copy_failed");
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    }
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

      <section className="max-w-6xl mx-auto px-6 mt-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline cursor-pointer">
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Calculate rent after an increase
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!rentParsed.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="cursor-pointer col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 hover:bg-slate-50 transition"
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
                  className={`cursor-pointer rounded-xl border px-4 py-2 text-left transition hover:bg-slate-50 ${
                    mode === "percent"
                      ? "border-sky-300 bg-sky-50 hover:bg-sky-100"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    Percent increase
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("fixed")}
                  className={`cursor-pointer rounded-xl border px-4 py-2 text-left transition hover:bg-slate-50 ${
                    mode === "fixed"
                      ? "border-sky-300 bg-sky-50 hover:bg-sky-100"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    Fixed amount increase
                  </div>
                </button>
              </div>
            </div>

            <div className="md:col-span-6">
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
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!pctParsed.ok}
                  />
                  <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-2 flex items-center text-sm font-semibold text-slate-700">
                    %
                  </div>
                </div>
              ) : (
                <div className="grid  gap-2">
                  <input
                    inputMode="decimal"
                    value={fixedDisplayValue}
                    onFocus={() => setFixedFocused(true)}
                    onBlur={() => setFixedFocused(false)}
                    onChange={(e) =>
                      setFixedIncrease(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 100 or 100.00"
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of increases to project (steps (1 to 50))
              </label>
              <div className="grid gap-2">
                <input
                  inputMode="numeric"
                  value={numIncreases}
                  onChange={(e) => setNumIncreases(e.target.value)}
                  placeholder="e.g. 1"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!nParsed.ok}
                />
              </div>
              {!nParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {nParsed.error}
                </p>
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 hover:bg-slate-50 transition"
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

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
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
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    New rent after increase
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmtMoney(computed.newPerPeriodScaled)}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Increase (effective)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtPct(computed.effectivePct)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annual before (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualBaseScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annual after (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNewScaled)}
                    </div>
                  </div>

                  <div className=" sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className=" grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-700">
                        Annual difference:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.annualDeltaScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Monthly (avg) difference:{" "}
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

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (before and after)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-700">
                        Before (monthly avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.baseMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Before (4 weeks):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.base4wScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        After (monthly avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.newMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        After (4 weeks):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.new4wScaled)}
                        </strong>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Monthly (average) and 4-week cycles are not
                      interchangeable. The difference here is shown explicitly:
                      before {fmtMoney(computed.monthMinus4wBaseScaled)}, after{" "}
                      {fmtMoney(computed.monthMinus4wNewScaled)}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Projection by increase step
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Percent mode compounds; fixed mode adds the same annualized
                    increment each step.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                          <th className="py-2 pr-4">Step</th>
                          <th className="py-2 pr-4">
                            Rent ({PERIOD_LABEL[rentPeriod]})
                          </th>
                          <th className="py-2 pr-4">Annualized</th>
                          <th className="py-2 pr-4">Monthly (avg)</th>
                          <th className="py-2 pr-4">Every 4 weeks</th>
                          <th className="py-2 pr-4">Weekly</th>
                          <th className="py-2 pr-4">Delta vs prior (annual)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.steps.map((s) => (
                          <tr
                            key={s.step}
                            className="border-b border-slate-100"
                          >
                            <td className="py-2 pr-4 font-semibold text-slate-800">
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

        <div className="md:col-span-6 mt-6">
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
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Displayed decimals
                </span>
                <select
                  value={displayDecimals}
                  onChange={(e) => {
                    const allowed = new Set([0, 2, 4, 6]);
                    const v = Number(e.target.value);
                    const t = Number.isFinite(v) ? Math.trunc(v) : 2;
                    setDisplayDecimals(allowed.has(t) ? t : 2);
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none hover:bg-slate-50 transition"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Calculations preserve decimals internally (up to 12). Only the
              display is rounded.
            </p>
          </div>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
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
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
              How this rent increase calculator works
            </h2>

            <p className="text-slate-600 leading-7">
              This tool estimates your new rent after one or more increases and
              shows the impact across common pay and billing cycles. You enter a
              current rent amount and its period (monthly, weekly, every 4
              weeks, etc.), then choose either a percent increase (compounding
              across steps) or a fixed amount increase (added each step in the
              same period as your rent input). Results are computed from annual
              totals so the comparisons are consistent, and decimals are
              preserved end-to-end (up to 12 places) with optional display-only
              rounding.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Current rent + period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  MODE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Percent or fixed
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  STEPS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  1 to 50 increases
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  New rent + impact
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
                    1) Everything is computed from annual totals first
                  </h3>
                  <p className="mt-4">
                    The calculator starts by converting your rent into an
                    annualized amount using standard assumptions:
                    <span className="font-semibold"> 1 year = 365 days</span>,
                    <span className="font-semibold"> 1 week = 7 days</span>,
                    <span className="font-semibold">
                      {" "}
                      every 4 weeks = 28 days
                    </span>
                    , and
                    <span className="font-semibold">
                      {" "}
                      month = 365 ÷ 12 days (average)
                    </span>
                    . This avoids “mixing” cycle assumptions when showing
                    monthly vs weekly vs 28-day equivalents.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Annualization formula
                    </div>
                    <p className="mt-2 text-slate-700">
                      If your input rent is{" "}
                      <span className="font-semibold">R</span> per period, the
                      annualized base is:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong>Monthly</strong>: Annual = R × 12
                      </li>
                      <li>
                        <strong>Weekly</strong>: Annual = R × 52
                      </li>
                      <li>
                        <strong>Biweekly</strong>: Annual = R × 26
                      </li>
                      <li>
                        <strong>Every 4 weeks (28 days)</strong>: Annual = R ×
                        13
                      </li>
                      <li>
                        <strong>Daily</strong>: Annual = R × 365
                      </li>
                      <li>
                        <strong>Hourly</strong>: Annual = R × 24 × 365
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      After computing the annual result, the tool converts back
                      into your chosen period and also into common equivalents
                      (monthly avg, weekly, and 28-day) so the comparisons stay
                      consistent.
                    </p>
                  </div>

                  <p className="mt-4">
                    This is why the page can show{" "}
                    <span className="font-semibold">Monthly (avg)</span> and{" "}
                    <span className="font-semibold">Every 4 weeks</span>{" "}
                    side-by-side without pretending they are interchangeable. A
                    28-day cycle is always 28 days; a month is not.
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
                    2) Percent mode compounds; fixed mode adds a repeated
                    increment
                  </h3>

                  <p className="mt-4">You pick one of two increase modes:</p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Percent increase mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      A percent increase compounds across steps. If the
                      annualized base rent is{" "}
                      <span className="font-semibold">A</span>, the percent is{" "}
                      <span className="font-semibold">p</span>, and the number
                      of steps is <span className="font-semibold">n</span>,
                      then:
                    </p>
                    <p className="mt-2 text-slate-700">
                      <span className="font-semibold">Annual after</span> = A ×
                      (1 + p/100)
                      <span className="font-semibold">^n</span>
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      Step-by-step, the projection table applies the same
                      multiplier each step so you can see the compounding effect
                      rather than only the final total.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Fixed amount increase mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      A fixed increase is treated as an amount added each step
                      in the{" "}
                      <span className="font-semibold">
                        same period as your rent input
                      </span>
                      . The tool annualizes that fixed increment and adds it
                      repeatedly.
                    </p>
                    <p className="mt-2 text-slate-700">
                      If annual base is <span className="font-semibold">A</span>
                      , and the annualized fixed increment is{" "}
                      <span className="font-semibold">F</span>, then:
                    </p>
                    <p className="mt-2 text-slate-700">
                      <span className="font-semibold">Annual after</span> = A +
                      F × n
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      Example: if rent is weekly and the fixed increase is
                      “+$25”, the tool treats that as +$25 per week each step,
                      annualizes it as $25 × 52, then adds it each step.
                    </p>
                  </div>

                  <p className="mt-4">
                    The output “Increase (effective)” is computed from annual
                    totals: it compares the annual after vs annual before, then
                    expresses that change as a percentage. This lets you compare
                    percent mode and fixed mode on the same basis.
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
                    3) Pay-cycle equivalents are derived from the same annual
                    result
                  </h3>

                  <p className="mt-4">
                    After the tool computes the annualized “before” and “after”,
                    it converts those totals into several equivalents:
                    <span className="font-semibold"> your input period</span>,
                    plus
                    <span className="font-semibold"> monthly (average)</span>,
                    <span className="font-semibold"> weekly</span>, and
                    <span className="font-semibold"> every 4 weeks</span>. These
                    conversions answer a practical question:
                    <span className="font-semibold">
                      “What does this rent look like if I compare it on a
                      different cycle?”
                    </span>
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Why monthly (avg) is not the same as every 4 weeks
                    </div>
                    <p className="mt-2 text-slate-700">
                      A 4-week period is exactly 28 days. The “monthly (avg)”
                      value is computed from annual ÷ 12, which corresponds to
                      an average month length of 365 ÷ 12 days. The tool shows
                      the difference explicitly as “Monthly vs every 4 weeks
                      (before and after)” so you do not have to guess the gap.
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      This is useful if you are comparing listings where one
                      advertises monthly pricing and another effectively behaves
                      like a fixed-day cycle (for example, some payroll-linked
                      housing arrangements).
                    </p>
                  </div>

                  <p className="mt-4">
                    The “Annual impact” panel breaks the result into the
                    differences you usually care about: annual difference,
                    monthly (avg) difference, and weekly difference. All of
                    those come from the same annual totals, so they stay
                    aligned.
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
                    4) The projection table shows each step and the delta vs
                    prior
                  </h3>

                  <p className="mt-4">
                    The “Projection by increase step” table starts at step 0
                    (your current rent) and runs through step n. For each step
                    it shows the annualized total and the key equivalents (your
                    input period, monthly avg, 4-week, weekly). The last column
                    shows the change from the previous step on an annual basis
                    so you can see how the increase behaves over time.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example (percent compounding, simplified)
                    </div>
                    <p className="mt-2 text-slate-700">
                      Suppose your rent is{" "}
                      <span className="font-semibold">$2,000 monthly</span>, and
                      you project <span className="font-semibold">2</span>{" "}
                      increases at <span className="font-semibold">3%</span>.
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Annual base = 2000 × 12 = 24000</li>
                      <li>Step 1 annual = 24000 × 1.03</li>
                      <li>Step 2 annual = 24000 × 1.03 × 1.03</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Your UI will show the exact currency formatting and the
                      converted equivalents. Internally, decimals are preserved
                      up to 12 places, then optionally rounded only for display.
                    </p>
                  </div>

                  <p className="mt-4">
                    Percent mode is where this table matters most because
                    compounding changes the step-to-step delta over time. Fixed
                    mode produces the same annual delta each step (because it
                    adds a constant annualized increment).
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
                    5) Decimals are preserved; rounding is display-only
                  </h3>

                  <p className="mt-4">
                    Inputs are parsed into a fixed-point decimal representation
                    so the tool can preserve cents and small fractional values
                    without losing precision during conversions and projections.
                    This is especially important when you project multiple steps
                    or compare cycles, because early rounding can compound into
                    noticeable drift.
                  </p>

                  <p className="mt-4">
                    If you enable “Round displayed values”, rounding only
                    affects what you see on screen (and what you copy/print).
                    The calculations remain based on the exact preserved
                    decimals (up to 12 places).
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Input formats supported
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>$2,000</li>
                      <li>2000.00</li>
                      <li>.5 (interpreted as 0.5)</li>
                      <li>12. (interpreted as 12)</li>
                      <li>2000,50 (comma-decimal formats)</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If an input format is ambiguous, the tool warns you or
                      asks you to enter the number in a clearer format.
                    </p>
                  </div>
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
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                    Use annualized comparisons to avoid misleading “cycle math”
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    A weekly amount is not “monthly” in a fixed way, and a
                    28-day cycle is not a calendar month. This calculator shows
                    the annual impact first, then derives each equivalent from
                    that same annual total so you can compare increases without
                    hiding the assumptions.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">Useful for</div>
                <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    Estimating a new rent after a percent or fixed increase
                  </li>
                  <li>Projecting multiple increases (1 to 50 steps)</li>
                  <li>
                    Comparing monthly (avg), weekly, and 28-day equivalents
                    fairly
                  </li>
                  <li>
                    Seeing the annual budget impact before and after the
                    increase
                  </li>
                  <li>Copying or printing a clean summary for budgeting</li>
                </ul>
              </div>

              <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:p-6">
                  <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                    Related pages
                  </h3>
                  <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-2">
                    {[
                      { href: "/rent-converter", text: "Rent converter" },
                      {
                        href: "/rent-after-increase-calculator",
                        text: "Rent after increase calculator",
                      },
                      {
                        href: "/rent-increase-percentage-calculator",
                        text: "Rent increase percentage calculator",
                      },
                      {
                        href: "/how-much-rent-can-i-afford-calculator",
                        text: "How much rent can I afford calculator",
                      },
                    ].map((l) => (
                      <li key={l.href}>
                        <a
                          href={safeHref(l.href)}
                          className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          {l.text}
                        </a>
                      </li>
                    ))}
                  </ul>
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
