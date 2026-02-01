import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

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
    content: "https://rentconverter.com/rent-increase-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Increase Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate your new rent after a percent or fixed increase and see the annual impact and pay-cycle equivalents.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-increase-calculator",
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
  const parts = new Intl.NumberFormat(undefined, { useGrouping: true }).formatToParts(1000.1);
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
  const qRounded = r >= half ? (q + 1n) : q;
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

  const scaledForDisplay = roundDisplay ? roundScaledToDecimals(scaled, digits) : scaled;

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

  return out || "—";
}

function formatPercentValue(
  value: number,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";

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

export default function RentIncreaseCalculator() {
  const pageName = "Rent Increase Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-increase-calculator";

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

    const factor = 1 + pct / 100;

    // annualNewScaled:
    // - percent mode: annualBase * factor^n (float exponentiation), then round to SCALE
    // - fixed mode: annualBase + annualFixedIncrement*n (exact bigint)
    let annualNewScaled: bigint;

    if (mode === "percent") {
      const base = toNumberSafe(annualBaseScaled);
      const annualNew = base * Math.pow(factor, n);
      if (!Number.isFinite(annualNew)) {
        return {
          ok: false as const,
          errors: ["Inputs produced an invalid result."],
          warnings,
        };
      }
      annualNewScaled = BigInt(Math.round(annualNew * Number(SCALE)));
    } else {
      annualNewScaled =
        annualBaseScaled + annualFixedIncrementScaled * BigInt(n);
    }

    const annualDeltaScaled = annualNewScaled - annualBaseScaled;

    const annualBase = toNumberSafe(annualBaseScaled);
    const annualDelta = toNumberSafe(annualDeltaScaled);
    const effectivePct = annualBase > 0 ? (annualDelta / annualBase) * 100 : 0;

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

    // Projection steps (step 0 = current)
    const steps = Array.from({ length: n + 1 }, (_, i) => {
      let annualAtStepScaled: bigint;

      if (i === 0) {
        annualAtStepScaled = annualBaseScaled;
      } else if (mode === "percent") {
        const annualAtStep = annualBase * Math.pow(factor, i);
        annualAtStepScaled = BigInt(Math.round(annualAtStep * Number(SCALE)));
      } else {
        annualAtStepScaled =
          annualBaseScaled + annualFixedIncrementScaled * BigInt(i);
      }

      const annualPrevScaled =
        i === 0
          ? annualBaseScaled
          : mode === "percent"
            ? BigInt(
                Math.round(
                  annualBase * Math.pow(factor, i - 1) * Number(SCALE),
                ),
              )
            : annualBaseScaled + annualFixedIncrementScaled * BigInt(i - 1);

      const deltaFromPrevScaled = annualAtStepScaled - annualPrevScaled;

      return {
        step: i,
        annualScaled: annualAtStepScaled,
        perPeriodScaled: fromAnnualScaled(annualAtStepScaled, rentPeriod),
        monthlyAvgScaled: fromAnnualScaled(annualAtStepScaled, "monthly"),
        every4wScaled: fromAnnualScaled(annualAtStepScaled, "every_4_weeks"),
        weeklyScaled: fromAnnualScaled(annualAtStepScaled, "weekly"),
        deltaAnnualFromPrevScaled: deltaFromPrevScaled,
      };
    });

    return {
      ok: true as const,
      warnings,

      n,
      pct,
      factor,

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
        item: "https://rentconverter.com/",
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

      <section className="pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">{pageName}</h1>
        <p className="text-slate-600 max-w-5xl mx-auto text-lg">
          Estimate a new rent after an increase and see the annual impact.
          Results are computed on an annual basis so monthly, weekly, and 4-week
          equivalents stay consistent.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Calculate a new rent after an increase
              </h2>
            </div>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!rentParsed.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    mode === "percent"
                      ? "border-sky-300 bg-sky-50"
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
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    mode === "fixed"
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    Fixed amount increase
                  </div>
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Fixed increases are treated as an increase in the same period as
                the rent input.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase value
              </label>

              {mode === "percent" ? (
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={percentIncrease}
                    onChange={(e) => setPercentIncrease(e.target.value)}
                    placeholder="e.g. 3 or 3.5"
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!pctParsed.ok}
                  />
                  <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                    %
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={fixedDisplayValue}
                    onFocus={() => setFixedFocused(true)}
                    onBlur={() => setFixedFocused(false)}
                    onChange={(e) =>
                      setFixedIncrease(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 100 or 100.00"
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!fixedParsed.ok}
                  />
                  <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                    {PERIOD_LABEL[rentPeriod]}
                  </div>
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

              <p className="mt-2 text-xs text-slate-500">
                Percent mode compounds across steps. Fixed mode adds the same
                annualized increment each step.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of increases to project
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="numeric"
                  value={numIncreases}
                  onChange={(e) => setNumIncreases(e.target.value)}
                  placeholder="e.g. 1"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!nParsed.ok}
                />
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                  steps (1 to 50)
                </div>
              </div>
              {!nParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {nParsed.error}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">
                This is a projection count only. It does not assume any specific
                legal schedule or notice rules.
              </p>
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
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
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                <div className="text-sm text-slate-600">
                  New rent after increase
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {fmtMoney(computed.newPerPeriodScaled)}
                  </div>

                  <div className="text-sm text-slate-600">
                    Current rent:{" "}
                    <strong>{fmtMoney(computed.basePerPeriodScaled)}</strong> (
                    {PERIOD_LABEL[rentPeriod].toLowerCase()}
                    ). New rent after{" "}
                    <strong>
                      {mode === "percent"
                        ? fmtPct(computed.pct)
                        : `${fmtMoney(fromAnnualScaled(computed.annualFixedIncrementScaled, rentPeriod))} per ${PERIOD_LABEL[rentPeriod].toLowerCase()}`}
                    </strong>{" "}
                    × <strong>{computed.n}</strong>.
                  </div>
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "summary",
                        `New rent: ${fmtMoney(computed.newPerPeriodScaled)} (${PERIOD_LABEL[rentPeriod]}); Annual difference: ${fmtMoney(
                          computed.annualDeltaScaled,
                        )}; Effective: ${fmtPct(computed.effectivePct)}`,
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                  >
                    {copiedKey === "summary" ? "Copied" : "Copy summary"}
                  </button>

                  {copiedKey === "copy_failed" ? (
                    <span className="self-center text-sm font-semibold text-rose-700">
                      Copy failed
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Increase (effective)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtPct(computed.effectivePct)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual before (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualBaseScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual after (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNewScaled)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Annual impact</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
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
                                ? "—"
                                : fmtMoney(s.deltaAnnualFromPrevScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Assumptions used for conversions: 1 year = 365 days, 1 week
                    = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days
                    (average). Effective dates and proration can change real
                    payments.
                  </p>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 rc-no-print">
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

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 rc-print-block">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong>
              <br />
              Tools on this site are provided for informational, budgeting, and
              comparison purposes only. Calculations are based on standard
              time-period assumptions (including a 365-day year and average
              month length) and simplified models. Results are estimates, not
              guarantees.
              <br />
              <br />
              This website does not provide financial, legal, or tax advice.
              Rental costs, affordability, payment schedules, and obligations
              vary by location, landlord, lease terms, and individual
              circumstances. Always review your lease agreement and consult
              qualified professionals before making financial decisions.
            </p>
          </section>

          <p className="mt-6 text-sm text-slate-500 rc-print-block">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This tool estimates
            full-period equivalents and does not model legal limits, notice
            requirements, or proration.
          </p>
        </div>

        <div className="md:col-span-6 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
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
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>
                The calculator converts your current rent to an annual total.
              </strong>{" "}
              This puts every rent period on the same basis using a 365-day year
              (and an average month of 365 ÷ 12 days).
            </li>
            <li>
              <strong>It applies the increase.</strong> Percent mode compounds
              across steps. Fixed mode annualizes the fixed amount (in your
              selected rent period) and adds it each step.
            </li>
            <li>
              <strong>
                It converts the annual total back into common equivalents.
              </strong>{" "}
              That is why you can compare monthly (average), weekly, and every 4
              weeks without mixing assumptions.
            </li>
            <li>
              <strong>Decimals are preserved end-to-end.</strong> If you enable
              rounding, only the displayed values are rounded.
            </li>
            <li>
              <strong>Print or save.</strong> Use your browser print dialog to
              print or save the page as a PDF.
            </li>
          </ol>

          <p className="mt-6 text-slate-700">
            Useful for: estimating the budget impact of a rent raise and making
            fair comparisons between monthly pricing and fixed-day cycles like
            every 4 weeks.
          </p>

          <p className="mt-6 text-slate-700">
            Related pages:{" "}
            <a
              href={safeHref("/rent-converter")}
              className="text-sky-700 hover:underline"
            >
              rent converter
            </a>{" "}
            and{" "}
            <a
              href={safeHref("/how-much-rent-can-i-afford-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent affordability calculator
            </a>
            .
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions. Always confirm payment
            schedules and lease terms in your rental agreement.
          </em>
        </p>
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
