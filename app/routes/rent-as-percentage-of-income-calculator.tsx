import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-as-percentage-of-income-calculator";
function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent-to-Income Ratio Calculator (Percent of Income)";
  const description =
    "Instantly calculate what percent of your income goes to rent. Compare monthly, weekly, and 4-week (28-day) pay cycles with clear assumptions and an annualized breakdown of income and rent. Free and private.";

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
    {
      property: "og:url",
      content:
        "https://www.rentconverter.comrent-as-percentage-of-income-calculator",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.comog-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.comog-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.comrent-as-percentage-of-income-calculator",
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
      a: "It estimates how much of your income is associated with rent over the same time horizon. This page annualizes both values first so different pay cycles can be compared consistently.",
    },
    {
      q: "How does this calculator handle weekly pay, biweekly pay, and 4-week pay?",
      a: "Both rent and income are converted to an annual total using a 365-day year, then the ratio is calculated from those annual totals. This avoids mixing 12-month assumptions with 28-day pay cycles.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals, which changes the percentage.",
    },
    {
      q: "Can I enter rent as monthly and income as hourly (or any mix)?",
      a: "Yes. Each input is annualized using its own selected period, then compared on the same annual basis.",
    },
    {
      q: "Is this based on take-home pay or gross pay?",
      a: "It works with either, as long as the income number matches what you want to compare against. Taxes, deductions, benefits, and irregular income can make real cash flow differ from a simple ratio.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. This is a rent-to-income comparison only. If your housing cost includes add-ons, you can include them in the rent input to estimate a combined housing payment percentage.",
    },
    {
      q: "What happens if income is zero or invalid?",
      a: "Results are not shown. Enter a valid income greater than 0 to compute a meaningful percentage.",
    },
    {
      q: "What assumptions does the math use?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
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

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Calculate rent as a percentage of income
              </h1>
            </div>

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

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
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
          <div className="text-xs text-slate-500">Display</div>
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={roundDisplay}
              onChange={(e) => setRoundDisplay(e.target.checked)}
              className="cursor-pointer h-4 w-4"
            />
            Round displayed values (display only)
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">Displayed decimals</div>
            <select
              value={displayDecimals}
              onChange={(e) => {
                const n = Number(e.target.value);
                const allowed = new Set<number>([0, 2, 4, 6]);
                setDisplayDecimals(allowed.has(n) ? n : 2);
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
            Calculations preserve decimals internally (up to 12). Only the
            display is rounded.
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight text-center">
              How it works and what to expect
            </h2>

            <p className="mt-4 text-slate-600 leading-7">
              This page calculates rent as a percentage of income using a
              consistent annual basis. You enter a rent amount, an income
              amount, and the periods each one applies to. The calculator
              converts both values into annual totals using explicit day-count
              assumptions, computes the percentage from those annual totals, and
              then derives monthly, weekly, and 28-day (4-week) views from the
              same annual basis. The goal is simple: keep the math consistent
              when rent and income are expressed on different schedules.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Income + period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual totals
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent % + breakdown
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Card: steps */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    Calculation steps used on this page
                  </h3>

                  <ol className="mt-4 list-decimal pl-5 space-y-3">
                    <li>
                      <strong>
                        Inputs are validated before results are shown.
                      </strong>{" "}
                      If rent or income is invalid, ambiguous, or income
                      annualizes to 0, the page hides results instead of showing
                      misleading values.
                    </li>
                    <li>
                      <strong>
                        Both numbers are converted to annual totals first.
                      </strong>{" "}
                      The tool uses a 365-day year (month is 365 ÷ 12 days) to
                      annualize rent and income so the comparison uses one
                      basis.
                    </li>
                    <li>
                      <strong>
                        The percentage is computed on the annual basis.
                      </strong>{" "}
                      Rent % = (annual rent ÷ annual income) × 100.
                    </li>
                    <li>
                      <strong>
                        Monthly, weekly, and 4-week views are derived from the
                        same annual totals.
                      </strong>{" "}
                      This keeps outputs consistent even when pay cycles do not
                      match billing cycles.
                    </li>
                    <li>
                      <strong>Rounding is display-only.</strong> Calculations
                      preserve decimals internally (up to 12). If rounding is
                      enabled, only displayed values are rounded.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Card: validation and parsing */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    What counts as valid input
                  </h3>

                  <p className="mt-4">
                    The calculator accepts currency symbols, commas, and
                    decimals. If an input cannot be interpreted as a single
                    numeric value, results are suppressed. This avoids a common
                    failure mode where a malformed entry quietly turns into a
                    zero and then produces a “0% rent share” that looks
                    legitimate.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Formatting behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong>1,234</strong> is treated as 1234 (comma as
                        thousands grouping)
                      </li>
                      <li>
                        <strong>1.234</strong> is treated as 1.234 (decimal
                        point)
                      </li>
                      <li>
                        Edge formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If a value could be interpreted in more than one way, the
                      page surfaces an error or warning rather than choosing for
                      you.
                    </p>
                  </div>

                  <p className="mt-4">
                    If income annualizes to 0, rent percentage is undefined. In
                    that case, results remain hidden. This is a deliberate
                    guardrail: “0%” is not a neutral fallback and would be
                    misleading.
                  </p>
                </div>
              </div>

              {/* Card: annual basis + periods */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    Why this page converts through annual totals
                  </h3>

                  <p className="mt-4">
                    Rent and income are often described on different schedules.
                    A weekly rent against a monthly income (or a biweekly income
                    against a monthly rent) can’t be compared directly unless
                    both values are expressed using a shared basis. This page
                    uses annual totals as that shared basis, derived from time
                    length assumptions.
                  </p>

                  <p className="mt-4">
                    The key point is that the period labels are treated as time
                    lengths: weekly means 7 days, biweekly means 14 days, and
                    every 4 weeks means 28 days. Monthly is treated as an
                    average month length (365 ÷ 12 days). Once everything is
                    annualized on a 365-day year, the tool can consistently
                    derive any other period without switching definitions.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Assumptions used
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

                  <p className="mt-4">
                    The payment-count box shown below (when available) is a
                    visibility aid. It shows how many “occurrences per year”
                    your selected periods imply. That is separate from the
                    equivalence math, which stays anchored to day counts and the
                    annual basis.
                  </p>
                </div>
              </div>

              {/* Conditional block, styled */}
              {computed.ok ? (
                <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                  <div className="p-5 sm:p-6">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700">
                      <div className="font-semibold text-sky-900">
                        Payment counts per year implied by your selections
                      </div>
                      <div className="mt-2 text-slate-600">
                        Rent period: <strong>{PERIOD_LABEL[rentPeriod]}</strong>{" "}
                        (about{" "}
                        <strong>
                          {safeToFixed(computed.paymentsPerYearRent, 2)}
                        </strong>{" "}
                        occurrences per year)
                      </div>
                      <div className="mt-1 text-slate-600">
                        Income period:{" "}
                        <strong>{PERIOD_LABEL[incomePeriod]}</strong> (about{" "}
                        <strong>
                          {safeToFixed(computed.paymentsPerYearIncome, 2)}
                        </strong>{" "}
                        occurrences per year)
                      </div>
                    </div>

                    <p className="mt-4 text-slate-600 leading-7">
                      These counts are shown for clarity when rent and income
                      cycles differ. They are not used as shortcuts to compute
                      the percentage. The percentage is computed from annual
                      totals derived from time length assumptions (365-day year,
                      average month length).
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Card: rounding */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    Rounding and precision
                  </h3>

                  <p className="mt-4">
                    Internally, values are computed with decimal-safe arithmetic
                    up to 12 decimal places. If rounding is enabled, it is
                    applied only to the displayed outputs. This prevents
                    rounding preferences from altering the computed annual
                    totals or the percentage result.
                  </p>

                  <p className="mt-4">
                    If you are comparing close values, leaving rounding disabled
                    keeps the underlying precision visible. If you are copying
                    results for documentation or sharing, rounding can be
                    enabled to make the display consistent without changing the
                    computation.
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
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                    This page keeps rent-share math consistent across mismatched
                    cycles
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The rent percentage is computed from annual totals derived
                    from explicit day-count assumptions. The monthly, weekly,
                    and 28-day views are derived from the same annual basis so
                    the share does not change depending on which period you
                    happen to be looking at.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related pages:{" "}
                <a
                  href={safeHref("/how-much-rent-can-i-afford-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  affordability calculator
                </a>
                ,{" "}
                <a
                  href={safeHref("/rent-paid-every-4-weeks-calculator")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent paid every 4 weeks
                </a>
                ,{" "}
                <a
                  href={safeHref("/weekly-to-monthly-rent-converter")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  weekly to monthly converter
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="cursor-pointer max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Rent as Percentage of Income Calculator
        </nav>
      </section>
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
