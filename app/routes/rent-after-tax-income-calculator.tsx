import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-tax-income-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent vs Take-Home Pay Calculator (After-Tax Income)";
  const description =
    "Calculate rent as a percentage of your take-home (after-tax) income. See net income after rent, compare pay cycles, and understand what you actually keep. Clear assumptions, exact decimals. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent after tax income, rent percentage of net income, after tax income rent calculator, rent to net income, take home pay rent percentage",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/rent-after-tax-income-calculator",
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
      href: "https://www.rentconverter.com/rent-after-tax-income-calculator",
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

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
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
      q: "What is an effective tax rate in this calculator?",
      a: "It is a single percentage used to estimate take-home income from pre-tax income. It is a simplified estimate and can differ from actual withholding and year-end taxes.",
    },
    {
      q: "What numbers does this page calculate?",
      a: "It estimates annual after-tax income, annual rent, rent as a percentage of after-tax income, and estimated after-tax income left after rent. It also shows per-period equivalents derived from the same annual totals.",
    },
    {
      q: "Why does the calculator use annual equivalence?",
      a: "Annualizing both income and rent keeps comparisons consistent across time periods. It avoids mixing 12-month assumptions with 4-week cycles.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, the totals differ.",
    },
    {
      q: "Does this include utilities, parking, or other housing costs?",
      a: "No. It compares rent to income. If you want a combined housing payment estimate, you can add those amounts to the rent input.",
    },
    {
      q: "Is the result the same as a budgeting recommendation?",
      a: "No. The results show relationships between rent and estimated take-home income. Actual affordability depends on debts, household size, location, and other expenses.",
    },
    {
      q: "Can I enter monthly rent but annual income (or any mix)?",
      a: "Yes. Each input is annualized using its own selected period before the percentage is calculated.",
    },
    {
      q: "What assumptions are used for time periods?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and 1 month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
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
        name: "Rent After-Tax Income Calculator",
        item: "https://www.rentconverter.com/rent-after-tax-income-calculator",
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

      <section className="mt-4 rc-no-print hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Rent After-Tax Income Calculator
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Estimate rent share using after-tax income
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-2 flex items-center text-sm font-semibold text-slate-700">
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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (derived from annual totals)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-700">
                        Net per month (avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            convertScaled(
                              computed.annualNet,
                              "annual",
                              "monthly",
                            ),
                          )}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Net per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            convertScaled(
                              computed.annualNet,
                              "annual",
                              "every_4_weeks",
                            ),
                          )}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per month (avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            convertScaled(
                              computed.annualRent,
                              "annual",
                              "monthly",
                            ),
                          )}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            convertScaled(
                              computed.annualRent,
                              "annual",
                              "every_4_weeks",
                            ),
                          )}
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
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block">
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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <div className="text-xs text-slate-500">Display</div>
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={roundDisplay}
              onChange={(e) => setRoundDisplay(e.target.checked)}
              className="h-4 w-4"
            />
            Round displayed values (display only)
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">Displayed decimals</div>
            <select
              value={displayDecimals}
              onChange={(e) => {
                const v = Number(e.target.value);
                const allowed = new Set<number>([0, 2, 4, 6]);
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

          <p className="mt-2 text-xs text-slate-500">
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
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight text-center">
                    How the rent after tax income calculator works
                  </h2>
                  <p className="mt-3 text-slate-600 leading-7">
                    This page estimates take-home (net) income using a single
                    effective tax rate, then compares rent to that net income on
                    one consistent time basis. It produces three primary
                    outputs: estimated net income, rent as a percentage of net
                    income, and estimated income left after rent. All values are
                    derived from annual totals so the breakdown stays consistent
                    across monthly, weekly, and 28-day views.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Income + period
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Rent + period
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ASSUMPTION
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Effective tax rate
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Net, share, after rent
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
                    Inputs are validated before results are shown
                  </h3>

                  <p className="mt-4">
                    The calculator validates income, rent, and tax rate before
                    it shows computed outputs. If an entry is invalid or
                    ambiguous, it avoids returning a misleading 0 or a guessed
                    result. This includes basic numeric errors and formatting
                    that could reasonably be interpreted multiple ways.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Parsing behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Currency symbols and thousands separators are supported
                        (for example, <strong>$1,234.56</strong>).
                      </li>
                      <li>
                        Decimal formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are accepted.
                      </li>
                      <li>
                        If a value is ambiguous, the page shows an error or
                        warning instead of guessing.
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      The tool does not infer missing context. It uses only the
                      values and periods you enter.
                    </p>
                  </div>
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
                    Income and rent are converted through annual totals
                  </h3>

                  <p className="mt-4">
                    Both income and rent are annualized first so all comparisons
                    share one basis. The model uses a 365-day year and treats a
                    month as an average month length of{" "}
                    <strong>365 ÷ 12</strong> days. Weekly is always a 7-day
                    equivalent. Biweekly is always 14 days. Every 4 weeks is
                    always 28 days.
                  </p>

                  <p className="mt-4">
                    This matters because “monthly” and “every 4 weeks” are
                    different time lengths. If a breakdown mixes time
                    definitions, the rent share and “after rent” values can
                    drift depending on which line you look at. Here, the annual
                    basis keeps the breakdown coherent.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Time assumptions used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours per day</li>
                    </ul>
                  </div>
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
                    Net income is estimated using one effective tax rate
                  </h3>

                  <p className="mt-4">
                    The calculator uses a single effective tax rate to estimate
                    take-home income. The net income estimate is computed from
                    the annual gross income as:
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Net income formula
                    </div>
                    <p className="mt-2 text-slate-700">
                      <strong>Annual net income</strong> = annual gross income ×
                      (1 − effective tax rate)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The tax rate is treated as an all-in effective rate. The
                      calculator does not apply brackets, credits, deductions,
                      or multiple payroll components.
                    </p>
                  </div>

                  <p className="mt-4">
                    This is a simplification by design. The page is built to
                    keep the model explicit and consistent, not to approximate
                    any specific tax system. If you need a different definition
                    of net income, enter the value you want represented by
                    choosing a rate that matches your intended effective
                    adjustment.
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
                    Rent share and income left are computed on the same annual
                    basis
                  </h3>

                  <p className="mt-4">
                    Once annual rent and annual net income exist, the tool
                    computes two core comparisons: rent share (as a percentage
                    of take-home pay) and income left after rent. Both are
                    derived from annual totals so they stay consistent no matter
                    which period you entered.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Comparison formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong>Rent share</strong> = annual rent ÷ annual net
                        income
                      </li>
                      <li>
                        <strong>After rent</strong> = annual net income − annual
                        rent
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      The page may also show period equivalents of these
                      outputs, derived from the same annual basis.
                    </p>
                  </div>

                  <p className="mt-4">
                    The “monthly vs every 4 weeks” view exists because those
                    labels are commonly treated as interchangeable, but they are
                    not the same time length. This tool keeps them distinct by
                    converting everything through the same annual reference.
                  </p>
                </div>
              </div>

              {/* Precision and rounding */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    Rounding and numeric precision
                  </h3>

                  <p className="mt-4">
                    Calculations preserve decimals internally (up to 12 places).
                    If rounding is enabled, only the displayed values are
                    rounded. This separation prevents rounding preferences from
                    changing the computed share or “after rent” results.
                  </p>

                  <p className="mt-4">
                    If you are comparing close values, leaving rounding disabled
                    keeps the raw precision visible. If you are copying results
                    for documentation, rounding can be enabled to format values
                    consistently without changing the underlying computation.
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
                    This page estimates net income with one rate and compares it
                    to rent
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The tool does not model tax brackets, credits, deductions,
                    payroll categories, or jurisdiction rules. It applies one
                    effective rate to annualized gross income, then computes
                    rent share and “after rent” using annual totals derived from
                    explicit day-count assumptions.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">
                  What you can do
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    Estimate rent as a percentage of take-home pay using one
                    effective rate
                  </li>
                  <li>
                    See estimated net income left after rent on an annual basis
                  </li>
                  <li>
                    Compare monthly and every-4-weeks views without treating
                    them as interchangeable
                  </li>
                  <li>
                    Copy results with consistent formatting by enabling
                    display-only rounding
                  </li>
                </ul>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related pages:{" "}
                <a
                  href={safeHref("/how-much-rent-can-i-afford-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent affordability calculator
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-paid-every-4-weeks-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent paid every 4 weeks
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
