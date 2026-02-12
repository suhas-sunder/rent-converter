import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-as-percentage-of-income-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-as-percentage-of-income-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-as-percentage-of-income-calculator/ToolFit";
function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent-to-Income Ratio Calculator (What % Goes to Rent)";
  const description =
    "See what percent of your income goes to rent and how much you keep. Compare monthly, weekly, and 4-week (28-day) pay cycles with exact decimals. Free, private, no signup.";

  const url =
    "https://www.rentconverter.com/rent-as-percentage-of-income-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent as percentage of income, rent to income ratio calculator, rent income percentage, rent affordability percentage, monthly rent percentage of income, weekly pay rent percentage, 4 week pay rent percentage",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },

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

/**
 * Only include routes you are sure exist.
 * Unknown links should resolve to "/" to avoid linking to non-existent routes.
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

function percentFromRatio(num: bigint, den: bigint, decimals: number): number {
  if (den <= 0n) return 0;
  const d = Math.max(0, Math.min(6, Math.trunc(decimals)));
  const factor = 10n ** BigInt(d);
  const percentScaled = (num * 100n * factor) / den;

  // Keep conversion safe
  const limit = 9_000_000_000_000_000n;
  const safe = percentScaled > limit ? limit : percentScaled;
  return Number(safe) / Number(factor);
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

function groupThousandsEnUS(intPart: string): string {
  const s = intPart.replace(/^0+(?=\d)/, "") || "0";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPreviewFromNormalized(normalized: string): string {
  const idx = normalized.indexOf(".");
  if (idx === -1) return groupThousandsEnUS(normalized);
  const intPart = normalized.slice(0, idx) || "0";
  const fracPart = normalized.slice(idx + 1);
  return `${groupThousandsEnUS(intPart)}.${fracPart}`;
}

export default function RentAsPercentageOfIncome() {
  const rentInputRef = useRef<HTMLInputElement | null>(null);
  const incomeInputRef = useRef<HTMLInputElement | null>(null);

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    const v = window.localStorage.getItem("rc_rpi_rent_amount") ?? "2200";
    return v.includes(",") ? v.replace(/,/g, "") : v;
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved =
      window.localStorage.getItem("rc_rpi_rent_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [incomeAmount, setIncomeAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "6500";
    const v = window.localStorage.getItem("rc_rpi_income_amount") ?? "6500";
    return v.includes(",") ? v.replace(/,/g, "") : v;
  });

  const [incomePeriod, setIncomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved =
      window.localStorage.getItem("rc_rpi_income_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_rpi_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding (math always preserves decimals)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_rpi_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_rpi_display_decimals");
    const n = saved ? Number(saved) : 2;
    const allowed = new Set<number>([0, 2, 4, 6]);
    return allowed.has(n) ? n : 2;
  });

  const [rentFocused, setRentFocused] = useState(false);
  const [incomeFocused, setIncomeFocused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_rpi_rent_amount", rentAmount);
      window.localStorage.setItem("rc_rpi_rent_period", rentPeriod);
      window.localStorage.setItem("rc_rpi_income_amount", incomeAmount);
      window.localStorage.setItem("rc_rpi_income_period", incomePeriod);
      window.localStorage.setItem("rc_rpi_currency", currency);
      window.localStorage.setItem(
        "rc_rpi_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_rpi_display_decimals",
        String(displayDecimals),
      );
    } catch {
      // ignore
    }
  }, [
    rentAmount,
    rentPeriod,
    incomeAmount,
    incomePeriod,
    currency,
    roundDisplay,
    displayDecimals,
  ]);

  const rentParsed = useMemo(
    () => parseMoneyInputToScaled(rentAmount),
    [rentAmount],
  );
  const incomeParsed = useMemo(
    () => parseMoneyInputToScaled(incomeAmount),
    [incomeAmount],
  );

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rentParsed.ok)
      errors.push(rentParsed.error ?? "Enter a valid rent amount.");
    if (!incomeParsed.ok)
      errors.push(incomeParsed.error ?? "Enter a valid income amount.");

    if (rentParsed.warnings.length) warnings.push(...rentParsed.warnings);
    if (incomeParsed.warnings.length) warnings.push(...incomeParsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const annualRent = convertScaled(
      rentParsed.scaled as bigint,
      rentPeriod,
      "annual",
    );
    const annualIncome = convertScaled(
      incomeParsed.scaled as bigint,
      incomePeriod,
      "annual",
    );

    if (annualIncome <= 0n) {
      return {
        ok: false as const,
        errors: [
          "Income must be greater than 0 to compute a meaningful percentage.",
        ],
        warnings,
      };
    }

    const ratioPct = percentFromRatio(annualRent, annualIncome, 4);

    const rentMonthly = convertScaled(annualRent, "annual", "monthly");
    const rentWeekly = convertScaled(annualRent, "annual", "weekly");
    const rent4w = convertScaled(annualRent, "annual", "every_4_weeks");

    const incomeMonthly = convertScaled(annualIncome, "annual", "monthly");
    const incomeWeekly = convertScaled(annualIncome, "annual", "weekly");
    const income4w = convertScaled(annualIncome, "annual", "every_4_weeks");

    const ratioOn4wBasis = percentFromRatio(rent4w, income4w, 4);

    const paymentsPerYear = (p: Period): number => {
      if (p === "annual") return 1;
      if (p === "monthly") return 12;
      if (p === "every_4_weeks") return 365 / 28;
      if (p === "biweekly") return 365 / 14;
      if (p === "weekly") return 365 / 7;
      if (p === "daily") return 365;
      return 365 * 24; // hourly
    };

    return {
      ok: true as const,
      warnings,

      annualRent,
      annualIncome,
      ratioPct,

      rentMonthly,
      rentWeekly,
      rent4w,

      incomeMonthly,
      incomeWeekly,
      income4w,

      ratioOn4wBasis,

      paymentsPerYearRent: paymentsPerYear(rentPeriod),
      paymentsPerYearIncome: paymentsPerYear(incomePeriod),

      avgMonthDays: 365 / 12,
    };
  }, [rentParsed, incomeParsed, rentPeriod, incomePeriod]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (v: string) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const el = e.target;
    const v = el.value;
    if (!v.includes(",")) {
      setValue(v);
      return;
    }

    const start = el.selectionStart ?? v.length;
    const commasBefore = (v.slice(0, start).match(/,/g) || []).length;
    const next = v.replace(/,/g, "");
    const nextPos = Math.max(0, start - commasBefore);

    setValue(next);

    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      try {
        node.setSelectionRange(nextPos, nextPos);
      } catch {
        // ignore
      }
    });
  };

  const rentDisplayValue = useMemo(() => {
    if (rentFocused) return rentAmount;
    if (!rentParsed.ok) return rentAmount;
    const normalized = rentParsed.normalized ?? rentAmount;
    return formatPreviewFromNormalized(normalized);
  }, [rentFocused, rentAmount, rentParsed]);

  const incomeDisplayValue = useMemo(() => {
    if (incomeFocused) return incomeAmount;
    if (!incomeParsed.ok) return incomeAmount;
    const normalized = incomeParsed.normalized ?? incomeAmount;
    return formatPreviewFromNormalized(normalized);
  }, [incomeFocused, incomeAmount, incomeParsed]);

  const faqData = [
    {
      q: "What does rent as a percentage of income represent?",
      a: "It shows what share of your income is associated with rent over the same time horizon. This page annualizes both values so different pay cycles can be compared consistently.",
    },
    {
      q: "How does this handle weekly, biweekly, and 4-week pay?",
      a: "Both rent and income are converted to annual totals using a 365-day year, then the ratio is calculated from those annual totals. This avoids mixing 12-month assumptions with 28-day pay cycles.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals and therefore the percentage.",
    },
    {
      q: "Can I mix periods (for example monthly rent and hourly income)?",
      a: "Yes. Each input is annualized using its selected period, then compared on the same annual basis.",
    },
    {
      q: "Is this based on take-home pay or gross pay?",
      a: "Either works, as long as the income number matches what you want to compare against. Taxes, deductions, and irregular income can make real cash flow differ from a simple ratio.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. This compares rent to income only. If housing costs include add-ons, include them in the rent input to estimate a combined housing percentage.",
    },
    {
      q: "What happens if income is zero or invalid?",
      a: "No result is shown. Enter a valid income greater than 0 to compute a meaningful percentage.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "Assumptions: year = 365 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual pay schedules and billing rules vary.",
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
        name: "Rent as Percentage of Income Calculator",
        item: "https://www.rentconverter.com/rent-as-percentage-of-income-calculator",
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
    name: "Rent as Percentage of Income Calculator",
    description:
      "Calculate rent as a percentage of income using annual equivalence (365-day year). Compare pay cycles with annualized breakdowns.",
    url: "https://www.rentconverter.com/rent-as-percentage-of-income-calculator",
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
              Rent as a Percentage of Income Calculator
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
            Calculate what percentage of your income goes to rent. See the
            result instantly with clear calculations.
          </p>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-4">
            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  ref={rentInputRef}
                  inputMode="decimal"
                  value={rentDisplayValue}
                  onFocus={() => setRentFocused(true)}
                  onBlur={() => setRentFocused(false)}
                  onChange={(e) =>
                    handleAmountChange(e, setRentAmount, rentInputRef)
                  }
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

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Income amount
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  ref={incomeInputRef}
                  inputMode="decimal"
                  value={incomeDisplayValue}
                  onFocus={() => setIncomeFocused(true)}
                  onBlur={() => setIncomeFocused(false)}
                  onChange={(e) =>
                    handleAmountChange(e, setIncomeAmount, incomeInputRef)
                  }
                  placeholder="e.g. 6500 or 6500.00"
                  className="cursor-pointer col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!incomeParsed.ok}
                />
                <select
                  value={incomePeriod}
                  onChange={(e) =>
                    setIncomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
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

              <div className="mt-3 grid gap-3 md:col-span-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
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

              {!incomeParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {incomeParsed.error}
                </p>
              ) : incomeParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {incomeParsed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Fix the inputs below to compute a meaningful percentage.
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
                    Estimated rent share
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {safeToFixed(computed.ratioPct, 2)}%
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annualized rent
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualRent)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Annualized income
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualIncome)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Rent share (annual basis)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {safeToFixed(computed.ratioPct, 2)}%
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-2 rc-print-block">
                    <div className=" grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-700">
                        Rent per week:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.rentWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Income per week:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.incomeWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.rent4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Income per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.income4w)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 rc-print-block">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (derived from annual totals)
                    </div>
                    <div className="mt-2 grid gap-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-700">
                        Rent per month (avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.rentMonthly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.rent4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Ratio on 4-week basis:{" "}
                        <strong className="text-slate-900">
                          {safeToFixed(computed.ratioOn4wBasis, 2)}%
                        </strong>
                      </div>
                    </div>
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

          <Assumptions />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 mt-6">
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

      <HowItWorks
        computed={computed}
        rentPeriod={rentPeriod}
        incomePeriod={incomePeriod}
        PERIOD_LABEL={PERIOD_LABEL}
        safeToFixed={safeToFixed}
      />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="cursor-pointer max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Rent as Percentage of Income Calculator
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
