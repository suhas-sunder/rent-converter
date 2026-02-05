import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-take-home-pay-calculator";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => [
  { title: "Rent vs Take-Home Pay Calculator (What You Actually Keep)" },
  {
    name: "description",
    content:
      "Instantly see how much of your take-home pay goes to rent and how much you have left. View rent as a percent of net income with clear monthly, weekly, and 4-week (28-day) breakdowns. Free and private.",
  },
  {
    name: "keywords",
    content:
      "rent vs take home pay, rent percentage of take home pay, rent to net income, rent vs after tax income, take home pay rent calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent vs Take-Home Pay Calculator (What You Actually Keep)",
  },
  {
    property: "og:description",
    content:
      "Calculate rent as a percentage of your take-home pay and see how much income remains after rent across common pay cycles.",
  },
  {
    property: "og:url",
    content: "https://www.rentconverter.comrent-vs-take-home-pay-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  {
    property: "og:image",
    content: "https://www.rentconverter.comog-image.jpg",
  },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent vs Take-Home Pay Calculator" },
  {
    name: "twitter:description",
    content:
      "See how much of your take-home pay goes to rent and what you actually keep.",
  },
  {
    name: "twitter:image",
    content: "https://www.rentconverter.comog-image.jpg",
  },

  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.rentconverter.comrent-vs-take-home-pay-calculator",
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
  "/rent-after-increase-calculator",

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

function safeParseDisplayDecimals(
  raw: string | null,
  fallback: number,
): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
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
    "https://www.rentconverter.comrent-vs-take-home-pay-calculator";

  const [takeHomePay, setTakeHomePay] = useState<string>(() => {
    if (typeof window === "undefined") return "5000";
    return stripCommas(localStorage.getItem("rc_rvt_takehome") ?? "5000");
  });

  const [takeHomePeriod, setTakeHomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rvt_takehome_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1800";
    return stripCommas(localStorage.getItem("rc_rvt_rent") ?? "1800");
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rvt_rent_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rvt_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rvt_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_rvt_display_decimals"),
      2,
    );
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rvt_takehome", takeHomePay);
      localStorage.setItem("rc_rvt_takehome_period", takeHomePeriod);
      localStorage.setItem("rc_rvt_rent", rentAmount);
      localStorage.setItem("rc_rvt_rent_period", rentPeriod);
      localStorage.setItem("rc_rvt_currency", currency);
      localStorage.setItem(
        "rc_rvt_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rvt_display_decimals", String(displayDecimals));
    } catch {}
  }, [
    takeHomePay,
    takeHomePeriod,
    rentAmount,
    rentPeriod,
    currency,
    roundDisplay,
    displayDecimals,
  ]);

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
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What is “take-home pay” on this page?",
      a: "Take-home pay refers to income after payroll deductions such as taxes and other withholdings. This calculator treats the input as a net amount.",
    },
    {
      q: "What does this tool calculate?",
      a: "It annualizes take-home pay and rent using a 365-day year, then calculates rent as a percentage of take-home pay and the estimated amount left after rent. It also shows monthly, weekly, and 4-week equivalents derived from the same annual totals.",
    },
    {
      q: "Why does it convert everything to an annual total?",
      a: "Annualizing both numbers keeps the comparison consistent when rent and pay use different time periods. It prevents treating calendar months as fixed weeks and makes 4-week cycles comparable.",
    },
    {
      q: "Why do monthly and every-4-weeks amounts differ?",
      a: "Every 4 weeks is always 28 days. An average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals.",
    },
    {
      q: "If my rent is monthly, can I enter take-home pay weekly or biweekly?",
      a: "Yes. Each input is annualized from its selected period first, then the percent and leftover amount are computed from annual totals.",
    },
    {
      q: "Does “left after rent” include utilities or other bills?",
      a: "No. It is take-home pay minus rent only.",
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
        name: pageName,
        item: "https://www.rentconverter.com/rent-vs-take-home-pay-calculator",
      },
    ],
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
          / {pageName}
        </nav>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Compare rent to take-home pay
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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.takeHome.ok}
                />
                <select
                  value={takeHomePeriod}
                  onChange={(e) =>
                    setTakeHomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.rent.ok}
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

          {!parsed.ok ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the inputs to calculate.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {parsed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {parsed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Rent share of take-home pay
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {computed.rentPctText}%
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Take-home pay (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualTakeHome)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Rent (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualRent)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Take-home pay left after rent (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualLeft)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Monthly, weekly, and 4-week equivalents (from annual
                      totals)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-700">
                        Take-home per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHomeMonthly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.rentMonthly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.leftMonthly)}
                        </strong>
                      </div>

                      <div className="text-sm text-slate-700">
                        Take-home per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHomeWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.rentWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.leftWeekly)}
                        </strong>
                      </div>

                      <div className="text-sm text-slate-700">
                        Take-home per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHome4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.rent4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.left4w)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (rent)
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly rent (avg) minus 4-week rent:{" "}
                        <strong className="text-slate-900">
                          {money(computed.monthMinus4wRent)}
                        </strong>
                      </div>
                      <strong className="text-slate-900">
                        {computed.monthMinus4wRentPctText}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                <div className="font-semibold">
                  Assumptions used on this page
                </div>
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
            </>
          ) : null}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
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
              <span className="text-xs text-slate-500">Displayed decimals</span>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value));
                  setDisplayDecimals(
                    v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                  );
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
            Internal math is fixed-point up to 12 decimals. This control only
            changes what is displayed.
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
            <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                    Rent vs take-home pay comparison
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page answers a simple budgeting question:{" "}
                    <span className="font-semibold text-slate-900">
                      how much of my take-home pay goes to rent?
                    </span>{" "}
                    You can enter rent and take-home pay in different periods
                    (for example, weekly pay with monthly rent, or biweekly pay
                    with 28-day rent). The tool converts both to the same annual
                    basis first, then computes rent share and the amount left
                    over.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Annual basis
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Periods can differ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Take-home pay + period
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
                    METHOD
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annualize both values
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Rent % + after-rent
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* SectionCard: what it does */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        What you get on this page
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The calculator produces two headline outputs derived from
                      the same annual basis:
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Rent share of take-home
                        </div>
                        <p className="mt-2">
                          Rent share = annual rent ÷ annual take-home pay, shown
                          as a percentage.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Income left after rent
                        </div>
                        <p className="mt-2">
                          After-rent = annual take-home pay − annual rent, with
                          equivalents shown in other periods for readability.
                        </p>
                      </div>
                    </div>

                    <p>
                      The monthly, weekly, and 28-day figures shown under the
                      results are not separate calculations with new
                      assumptions. They are derived from the same annual totals
                      so you can view the same relationship in familiar cycles
                      without mixing definitions.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why annual basis */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M12 5v14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        Why everything converts through annual totals
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      People get misleading results when pay and rent are
                      entered in different cycles and the math silently treats
                      one cycle as “close enough” to another. This tool avoids
                      that by converting both inputs to annual totals first,
                      then computing the ratio and remainder on that same basis.
                    </p>

                    <p>
                      Converting through annual totals does two practical
                      things:
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        It prevents “monthly” from being treated as a fixed
                        number of weeks, which can shift the implied annual
                        totals.
                      </li>
                      <li>
                        It keeps fixed-day cycles visible. A 28-day rent
                        schedule is not the same thing as a calendar month, and
                        that mismatch is exactly what causes confusion in
                        budgeting.
                      </li>
                    </ul>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Consistency rule
                      </div>
                      <p className="mt-2">
                        Annualize pay and rent first. Compute rent share and
                        leftover from those annual totals. Convert back to
                        display periods only for readability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: step-by-step */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        How it works (exactly)
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong className="text-slate-900">
                          Enter your take-home pay and choose its period.
                        </strong>{" "}
                        Take-home pay is treated as what lands in your account
                        for budgeting. It is not gross pay and it is not
                        automatically adjusted for taxes, deductions, or
                        benefits.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Enter your rent and choose its period.
                        </strong>{" "}
                        Rent is treated as the rent amount only. The tool does
                        not add utilities, fees, parking, debt payments, or
                        other household costs unless you include them in the
                        rent number you enter.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Both inputs are annualized on the same model.
                        </strong>{" "}
                        Fixed-day cycles use their day lengths (weekly = 7 days,
                        biweekly = 14 days, every 4 weeks = 28 days). Monthly
                        uses an average month length derived from the same
                        annual basis.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Rent share and after-rent are computed from annual
                          totals.
                        </strong>{" "}
                        Rent share = annual rent ÷ annual take-home pay.
                        After-rent = annual take-home pay − annual rent.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Display periods are derived from the same annual
                          totals.
                        </strong>{" "}
                        The monthly, weekly, and 28-day blocks shown under
                        results are conversions of the same annual rent and
                        annual take-home pay. They exist to help you read the
                        numbers in a cycle you recognize without changing the
                        math.
                      </li>
                    </ol>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Why this matters for mixed cycles
                      </div>
                      <p className="mt-2">
                        If you are paid weekly and rent is monthly, the tool
                        does not pretend that a month equals four weeks. If rent
                        is every 28 days, it does not quietly convert it into
                        “monthly” by assuming 30 days. The entire point is that
                        cycles don’t line up, so annualizing is the neutral
                        meeting point.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: what it includes / excludes */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        Scope and expectations
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      This page is a rent-versus-income share calculator based
                      on take-home pay. It is designed for quick comparison and
                      budgeting checks, not for building a full household
                      budget.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Included
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>Rent amount in your selected period</li>
                          <li>Take-home pay in your selected period</li>
                          <li>Annualized rent share and after-rent totals</li>
                          <li>Equivalent views (monthly, weekly, 28-day)</li>
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Not included
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>Utilities, internet, parking, or fees</li>
                          <li>Debt payments, groceries, or other costs</li>
                          <li>
                            Tax calculations (use after-tax tool if needed)
                          </li>
                          <li>Calendar due-date planning</li>
                        </ul>
                      </div>
                    </div>

                    <p>
                      If you need a take-home estimate from gross income, use
                      the after-tax tool. If you need an apples-to-apples
                      conversion of a listing between weekly, monthly, and
                      28-day cycles, use the rent converter hub.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark utility callout */}
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    This compares amounts, not timing
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The outputs are annualized equivalents and period views.
                    They do not attempt to model when money leaves your account.
                    If you need a calendar schedule of due dates (especially for
                    28-day cycles), use the due-date calculator instead of
                    relying on period equivalence.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related tools:{" "}
                <a
                  href={safeHref("/how-much-rent-can-i-afford-calculator")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  how much rent can I afford
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-after-tax-income-calculator")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent after-tax income calculator
                </a>
                , and{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent converter
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
