import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-increase-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent After Increase Calculator (Percent or Fixed Raise)";
  const description =
    "Instantly calculate your new rent after an increase by percent or fixed amount. See updated rent per period, annual impact, and clear comparisons across monthly, 4-week (28-day), and other pay cycles. Exact decimals, full breakdown. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent after increase, rent increase calculator, new rent after increase, rent raise calculator, percent rent increase calculator, rent increase amount calculator",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/rent-after-increase-calculator",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.com/rent-after-increase-calculator",
    },
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
 * - If displayDecimals === 12 (no display rounding mode), show up to 12 decimals (min 0).
 * - Otherwise, show exactly displayDecimals decimals (min = max = displayDecimals).
 */
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

function isAllowedDisplayDecimals(n: number): n is 0 | 2 | 4 | 6 {
  return n === 0 || n === 2 || n === 4 || n === 6;
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

  // Display-only rounding
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_rai_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_rai_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    const v = Math.trunc(n);
    return isAllowedDisplayDecimals(v) ? v : 2;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_rai_current", currentRent);
      window.localStorage.setItem("rc_rai_mode", mode);
      window.localStorage.setItem("rc_rai_percent", increasePercent);
      window.localStorage.setItem("rc_rai_amount", increaseAmount);
      window.localStorage.setItem("rc_rai_period", period);
      window.localStorage.setItem("rc_rai_currency", currency);
      window.localStorage.setItem(
        "rc_rai_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_rai_display_decimals",
        String(displayDecimals),
      );
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
    roundDisplay,
    displayDecimals,
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

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(
      scaled,
      currency,
      roundDisplay,
      effectiveDisplayDecimals,
    );

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

    // Annualize current rent from selected billing period
    const annualCurrent = convertScaled(currentScaled, period, "annual");

    // Annualize increase
    let annualIncrease = 0n;
    if (mode === "percent") {
      // pctScaled is percent in SCALE units: "5" => 5*SCALE
      const pctScaled = pctParsed.scaled as bigint;

      // annualIncrease = annualCurrent * (pct / 100)
      // pctScaled represents pct * SCALE, so:
      // annualCurrent * pctScaled / (100 * SCALE)
      annualIncrease = mulDivInt(annualCurrent, pctScaled, 100n * SCALE);
    } else {
      const incScaled = amtParsed.scaled as bigint;
      annualIncrease = convertScaled(incScaled, period, "annual");
    }

    const annualNew = annualCurrent + annualIncrease;

    // Effective percent (safe bigint math, 2 decimals)
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

    const newPerSelected = convertScaled(annualNew, "annual", period);
    const oldPerSelected = convertScaled(annualCurrent, "annual", period);
    const deltaPerSelected = newPerSelected - oldPerSelected;

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

  const canShowResults = computed.ok;

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

  const faqData = [
    {
      q: "What does this calculator output?",
      a: "It estimates the new rent after an increase and shows the annual impact. It also displays equivalents across common pay cycles so the change is comparable even when listings use different periods.",
    },
    {
      q: "How do I enter the increase?",
      a: "Choose percent if the increase is stated as a rate (for example 5%). Choose amount if the increase is a fixed add-on per billing period (for example $100 per month).",
    },
    {
      q: "What does the billing period apply to?",
      a: "The billing period applies to the current rent and also to the increase amount if you use fixed-amount mode. The calculator converts values to annual totals to keep comparisons consistent.",
    },
    {
      q: "Why does the page show monthly and every 4 weeks separately?",
      a: "Every 4 weeks is always 28 days. A calendar month is longer on average (365 ÷ 12 days). Showing both avoids treating them as interchangeable when comparing costs.",
    },
    {
      q: "Does this include utilities, fees, or taxes?",
      a: "No. It compares rent amounts only. If one option includes bundled costs, treat the result as a baseline comparison, not a full housing-cost total.",
    },
    {
      q: "Will this match the first payment after an increase takes effect?",
      a: "Not necessarily. This is a full-period estimate. Proration, mid-cycle effective dates, and lease-specific rules can change the first payment after a change.",
    },
    {
      q: "What assumptions are used for the period conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
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
        item: "https://www.rentconverter.com/",
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
    url: "https://www.rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rent After Increase Calculator",
    description:
      "Calculate your new rent after an increase (percent or fixed amount) using annual equivalence (365-day year). Includes annual impact and pay-cycle breakdowns.",
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

      <section className="mt-4 rc-no-print hidden sm:block">
        <nav
          className="max-w-6xl mx-auto px-6 text-sm text-slate-500"
          aria-label="Breadcrumb"
        >
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            Home
          </a>{" "}
          / Rent After Increase Calculator
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Calculate the new rent after an increase
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden sm:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
              <input
                inputMode="decimal"
                value={currentDisplayValue}
                onFocus={() => setIsCurrentFocused(true)}
                onBlur={() => setIsCurrentFocused(false)}
                onChange={(e) =>
                  setCurrentRent(e.target.value.replace(/,/g, ""))
                }
                placeholder="e.g. 2000 or 2000.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                aria-invalid={currentInvalid}
                aria-describedby={currentDescribedBy}
              />

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
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {currentParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period (for the current rent)
              </label>
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase type
              </label>
              <select
                value={mode}
                onChange={(e) =>
                  setMode(isMode(e.target.value) ? e.target.value : "percent")
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                aria-label="Increase type"
              >
                <option value="percent">Percent increase</option>
                <option value="amount">Fixed amount increase</option>
              </select>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Percent applies to annualized rent. Fixed amount is treated as
                an add-on per the selected billing period.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {mode === "percent" ? "Increase percent" : "Increase amount"}
              </label>

              {mode === "percent" ? (
                <>
                  <input
                    inputMode="decimal"
                    value={increasePercent}
                    onChange={(e) => setIncreasePercent(e.target.value)}
                    placeholder="e.g. 5 or 2.5"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                    aria-invalid={!pctParsed.ok}
                    aria-describedby={increaseDescribedBy}
                  />
                  <p id="rc-inc-help" className="mt-2 text-xs text-slate-500">
                    Enter a percent like 5, 2.5, or 5%. If invalid, results are
                    not shown.
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
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <div className="font-semibold">
                        Input interpretation note
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                    aria-invalid={!amtParsed.ok || amtDisplayError}
                    aria-describedby={increaseDescribedBy}
                  />
                  <p id="rc-inc-help" className="mt-2 text-xs text-slate-500">
                    Enter the increase as an amount per the same billing period
                    as the current rent. If invalid, results are not shown.
                  </p>
                  {amtDisplayError ? (
                    <p
                      id="rc-inc-error"
                      className="mt-2 text-sm font-semibold text-rose-700"
                      role="alert"
                    >
                      That increase amount is incomplete or ambiguous (trailing
                      decimal separator).
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
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <div className="font-semibold">
                        Input interpretation note
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {amtParsed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-6" />
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Fix the inputs below to see the updated rent and annual
                  impact.
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
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums tracking-tight">
                    {fmt(computed.newPerSelected)}
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <span className="tabular-nums">
                      {fmt(computed.oldPerSelected)}
                    </span>{" "}
                    per {PERIOD_LABEL[period].toLowerCase()} becomes{" "}
                    <strong className="tabular-nums">
                      {fmt(computed.newPerSelected)}
                    </strong>{" "}
                    per {PERIOD_LABEL[period].toLowerCase()} using annual
                    equivalence.
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("new", fmt(computed.newPerSelected))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {copiedKey === "new" ? "Copied" : "Copy new rent"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `New per ${PERIOD_LABEL[period]}: ${fmt(
                            computed.newPerSelected,
                          )} | Annual increase: ${fmt(computed.annualIncrease)} | New annual: ${fmt(
                            computed.annualNew,
                          )}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span
                        className="self-center text-sm font-semibold text-rose-700"
                        role="status"
                      >
                        Copy failed
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Estimated percent change
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
                      {safeToFixed(computed.effectivePctNum, 2)}%
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Change per selected period
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
                      {fmt(computed.deltaPerSelected)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual increase (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800 tabular-nums">
                      {fmt(computed.annualIncrease)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">Annual totals</div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Current annual rent:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.annualCurrent)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        New annual rent:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.annualNew)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.annualNew - computed.annualCurrent)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (before and after)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-700">
                        Current (monthly avg):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.oldMonthlyAvg)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Current (4 weeks):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.old4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        New (monthly avg):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.newMonthlyAvg)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        New (4 weeks):{" "}
                        <strong className="text-slate-900 tabular-nums">
                          {fmt(computed.new4w)}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Every 4 weeks is 28 days. An average month is{" "}
                      {safeToFixed(computed.avgMonthDays, 2)} days (365 ÷ 12).
                    </p>
                  </div>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Full breakdown across periods (annual-equivalent)
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                This table annualizes the current rent and the new rent first,
                then expresses both as hourly, daily, weekly, 4-week, monthly,
                and annual equivalents. This helps compare the increase across
                different pay cycles without mixing assumptions.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-[820px] w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-4">Period</th>
                      <th className="py-2 pr-4">Current</th>
                      <th className="py-2 pr-4">New</th>
                      <th className="py-2 pr-4">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.breakdown.map((row) => (
                      <tr key={row.p} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-semibold text-slate-800">
                          {PERIOD_LABEL[row.p]}
                        </td>
                        <td className="py-2 pr-4 text-slate-800 tabular-nums">
                          {fmt(row.oldVal)}
                        </td>
                        <td className="py-2 pr-4 text-slate-800 tabular-nums">
                          {fmt(row.newVal)}
                        </td>
                        <td className="py-2 pr-4 text-slate-800 tabular-nums">
                          {fmt(row.delta)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks =
                28 days, and month = 365 ÷ 12 days (average). Exact billing and
                due dates vary by agreement.
              </p>
            </div>
          ) : null}

          <p className="my-6 text-sm text-slate-500 leading-relaxed">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This page estimates
            full-period equivalents and does not model fees, proration, or
            effective dates.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={roundDisplay}
              onChange={(e) => setRoundDisplay(e.target.checked)}
              className="h-4 w-4 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            />
            Round displayed values (display only)
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">Displayed decimals</div>
            <select
              value={displayDecimals}
              onChange={(e) => {
                const v = Number(e.target.value);
                setDisplayDecimals(isAllowedDisplayDecimals(v) ? v : 2);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
              aria-label="Displayed decimals"
            >
              <option value={0}>0</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>
          </div>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Calculations preserve decimals internally (up to 12). If rounding is
            enabled, only displayed values are rounded.
          </p>
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
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                    How the rent after increase calculator works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page applies a defined increase to a rent amount and
                    then expresses the updated rent across common time periods
                    using one consistent time basis. It converts through an
                    annual reference so the before-and-after numbers stay
                    comparable across monthly, weekly, and 28-day views.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Year = 365 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Month = 365 ÷ 12 days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Current rent
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
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual basis
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Updated breakdown
                  </div>
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
                    Inputs and validation
                  </h3>
                  <p className="mt-4">
                    Inputs are validated before results are shown. If the
                    current rent, increase percent, or increase amount is
                    invalid or ambiguous, the calculator avoids outputting a
                    misleading “0” or a guessed value. The tool only uses what
                    you explicitly provide.
                  </p>
                  <p className="mt-4">
                    The parser supports currency symbols, thousands separators,
                    and decimal formats such as <strong>.5</strong> and{" "}
                    <strong>12.</strong>. If an entry could reasonably be read
                    more than one way, the page surfaces an error or warning
                    rather than silently picking an interpretation.
                  </p>
                  <p className="mt-4">
                    This calculator does not infer inclusions. Utilities, fees,
                    taxes, deposits, and one-time charges are not added or
                    removed. Whatever “rent” means for your use case is the
                    number you enter.
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
                    One consistent annual basis
                  </h3>
                  <p className="mt-4">
                    Everything is converted through an annual reference based on
                    a 365-day year. Months are treated as an average month
                    length of <strong>365 ÷ 12</strong> days. Weekly is always 7
                    days. Biweekly is always 14 days. Every 4 weeks is always 28
                    days. Those time lengths are what drive equivalence values
                    across the breakdown.
                  </p>
                  <p className="mt-4">
                    This is not a payment-schedule model. The equivalence math
                    does not assume “monthly × 12” or “4-week × 13” as the basis
                    for the breakdown. Those schedule totals can be shown
                    elsewhere for context, but the conversion here is based on
                    time length so the outputs remain compatible across periods.
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
                    Percent mode vs fixed-amount mode
                  </h3>

                  <p className="mt-4">
                    Percent mode treats the current annual rent as the baseline
                    and computes the increase as a proportion of that annual
                    total. The annual increase is:
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Percent mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      <strong>Annual increase</strong> = annual current rent ×
                      (percent ÷ 100)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The new annual total is then converted back into hourly,
                      daily, weekly, biweekly, 4-week, monthly, and annual
                      equivalents using the same time basis.
                    </p>
                  </div>

                  <p className="mt-5">
                    Fixed-amount mode treats the increase as an add-on in the
                    same billing period as the rent you entered. If rent is
                    monthly and the increase amount is entered, the increase is
                    interpreted as a monthly add-on. If rent is weekly, it’s
                    treated as a weekly add-on. That combined amount is then
                    annualized on the same 365-day and average-month basis.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Fixed-amount mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      <strong>New period rent</strong> = current rent + fixed
                      increase (same period)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The period result is then annualized and reconverted into
                      the full breakdown so all displayed periods reconcile to
                      the same annual total.
                    </p>
                  </div>

                  <p className="mt-5">
                    The calculator does not infer whether a fixed increase is
                    temporary, capped, prorated, or offset by other changes. It
                    applies the numbers mechanically and shows the resulting
                    equivalents.
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
                    Outputs, precision, and printing
                  </h3>

                  <p className="mt-4">
                    Results are converted back into common periods so the change
                    can be viewed consistently: hourly, daily, weekly, biweekly,
                    every 4 weeks, monthly, and annual. All outputs come from
                    the same annual basis.
                  </p>

                  <p className="mt-4">
                    Rounding is display-only. Internally the calculator
                    preserves decimals (up to 12 places). Enabling rounding
                    changes only what is shown on screen, not the underlying
                    computed values.
                  </p>

                  <p className="mt-4">
                    Printing uses your browser’s print dialog, including
                    save-as-PDF. The breakdown is formatted to remain readable
                    when printed.
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What you can do
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Compute the updated rent in the same period you entered
                      </li>
                      <li>
                        See the annual impact without switching assumptions
                      </li>
                      <li>
                        Compare monthly and 28-day views without treating them
                        as the same period
                      </li>
                      <li>Print or save a PDF copy of the results</li>
                    </ul>
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
                    Percent and fixed increases behave differently across
                    periods
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    A percent increase scales with the baseline annual rent. A
                    fixed increase depends on the period it’s attached to. This
                    page keeps both modes on the same annual basis so the
                    updated weekly, monthly, and 28-day equivalents can be
                    compared without hidden shortcuts.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related pages:{" "}
                <a
                  href={safeHref("/rent-increase-percentage-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent increase percentage calculator
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-increase-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent increase calculator
                </a>
                , and{" "}
                <a
                  href={safeHref("/rent-paid-every-4-weeks-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent paid every 4 weeks calculator
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
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

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
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
