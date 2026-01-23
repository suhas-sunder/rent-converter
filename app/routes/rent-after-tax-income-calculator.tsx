import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-after-tax-income-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Rent After-Tax Income Calculator";
  const description =
    "Estimate after-tax (net) income from a pre-tax income and an effective tax rate, then compare rent to net income using annual equivalence (365-day year). Includes net income after rent and pay-cycle comparisons.";

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
      content: "https://rentconverter.com/rent-after-tax-income-calculator",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://rentconverter.com/og-image.jpg",
    },

    {
      rel: "canonical",
      href: "https://rentconverter.com/rent-after-tax-income-calculator",
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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  displayDecimals: number,
  roundDisplay: boolean,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";

  const maxFrac = Math.max(0, Math.min(12, displayDecimals));

  // If rounding is enabled, lock to the chosen decimals for consistent display.
  // If rounding is disabled, allow up to 12 decimals, but do not drop cents.
  const maximumFractionDigits = roundDisplay ? maxFrac : 12;
  const minimumFractionDigits = roundDisplay ? maxFrac : 2;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(n);
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

function buildCsvRow(cols: string[]): string {
  return cols
    .map((c) => {
      const s = String(c ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(",");
}

function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8",
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
    const saved = window.localStorage.getItem("rc_rati_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

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
      effectiveDisplayDecimals,
      roundDisplay,
    );

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

  const canShowResults = computed.ok;

  const handleExportCsv = () => {
    if (!computed.ok) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Rent After-Tax Income Calculator"]));
    rows.push(buildCsvRow(["Currency", currency]));
    rows.push(
      buildCsvRow(["Income period (input)", PERIOD_LABEL[incomePeriod]]),
    );
    rows.push(buildCsvRow(["Rent period (input)", PERIOD_LABEL[rentPeriod]]));

    rows.push(
      buildCsvRow([
        "Pre-tax income (input)",
        fmtMoney(grossParsed.scaled as bigint),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Effective tax rate (input)",
        `${toNumberSafe(taxParsed.scaled as bigint)}%`,
      ]),
    );
    rows.push(
      buildCsvRow(["Rent (input)", fmtMoney(rentParsed.scaled as bigint)]),
    );

    rows.push(
      buildCsvRow([
        "Display",
        roundDisplay
          ? `Rounded to ${displayDecimals} decimals for display`
          : "No display rounding (up to 12 decimals)",
      ]),
    );

    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Month=365 ÷ 12 days",
        "Week=7 days",
        "Biweekly=14 days",
        "4-week=28 days",
        "Day=1",
        "Hour=1/24 day",
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Annual totals", "Amount"]));
    rows.push(
      buildCsvRow(["Annual pre-tax income", fmtMoney(computed.annualGross)]),
    );
    rows.push(
      buildCsvRow([
        "Annual after-tax income (estimated)",
        fmtMoney(computed.annualNet),
      ]),
    );
    rows.push(buildCsvRow(["Annual rent", fmtMoney(computed.annualRent)]));
    rows.push(
      buildCsvRow([
        "Annual after-tax income left after rent",
        fmtMoney(computed.annualNetAfterRent),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Rent share of after-tax income",
        `${computed.rentShareNetPct.toFixed(2)}%`,
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(
      buildCsvRow([
        "Per-period breakdown (annual-equivalent)",
        "Gross",
        "Net",
        "Rent",
        "Net after rent",
      ]),
    );
    computed.breakdown.forEach((r) => {
      rows.push(
        buildCsvRow([
          PERIOD_LABEL[r.p],
          fmtMoney(r.grossP),
          fmtMoney(r.netP),
          fmtMoney(r.rentP),
          fmtMoney(r.leftP),
        ]),
      );
    });

    downloadTextFile(
      "rent-after-tax-income-calculator.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
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
        item: "https://rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rent After-Tax Income Calculator",
        item: "https://rentconverter.com/rent-after-tax-income-calculator",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rent After-Tax Income Calculator",
    description:
      "Estimate take-home income from pre-tax income and an effective tax rate, then compare rent to after-tax income using annual equivalence (365-day year).",
    url: "https://rentconverter.com/rent-after-tax-income-calculator",
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
          / Rent After-Tax Income Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent After-Tax Income Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Enter pre-tax income, an effective tax rate, and rent. This page
          estimates after-tax income and shows rent as a share of that take-home
          amount using a consistent annual basis.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Estimate rent share using after-tax income
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Income and rent are annualized first (365-day year). After-tax
                income is estimated using your effective tax rate. Rent share
                and "income left after rent" are computed from those annual
                totals.
              </p>
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
                Pre-tax income
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(e.target.value)}
                  placeholder="e.g. 60000 or 5000.50"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!grossParsed.ok}
                />
                <select
                  value={incomePeriod}
                  onChange={(e) =>
                    setIncomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "annual",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Income period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Accepted inputs: $60,000, 60000.00, .5, 12., 60000,50 (comma
                decimal). If input is invalid or ambiguous, results are not
                shown.
              </p>
              {!grossParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {grossParsed.error}
                </p>
              ) : grossParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                Effective tax rate
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25 or 12.5"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!taxParsed.ok}
                />
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                  %
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This is a simplified estimate (0 to 100). It does not model
                brackets, deductions, or credits.
              </p>
              {!taxParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {taxParsed.error}
                </p>
              ) : taxParsed.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
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

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
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
                  <div className="text-xs text-slate-500">
                    Displayed decimals
                  </div>
                  <select
                    value={displayDecimals}
                    onChange={(e) =>
                      setDisplayDecimals(
                        Math.max(
                          0,
                          Math.min(6, Math.trunc(Number(e.target.value) || 2)),
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
                  >
                    <option value={0}>0</option>
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Calculations preserve decimals internally (up to 12). If
                  rounding is enabled, only displayed values are rounded.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
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
                  Rent share of estimated after-tax income
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {computed.rentShareNetPct.toFixed(2)}%
                  </div>
                  <div className="text-sm text-slate-600">
                    Annual after-tax income (estimated):{" "}
                    <strong>{fmtMoney(computed.annualNet)}</strong>. Annual
                    rent: <strong>{fmtMoney(computed.annualRent)}</strong>.
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `After-tax income (annual): ${fmtMoney(
                            computed.annualNet,
                          )} | Rent (annual): ${fmtMoney(
                            computed.annualRent,
                          )} | Rent share: ${computed.rentShareNetPct.toFixed(
                            2,
                          )}% | Net after rent (annual): ${fmtMoney(
                            computed.annualNetAfterRent,
                          )}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "pct",
                          `${computed.rentShareNetPct.toFixed(2)}%`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "pct" ? "Copied" : "Copy percent"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span className="self-center text-sm font-semibold text-rose-700">
                        Copy failed
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual pre-tax income (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualGross)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual after-tax income (estimated)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNet)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual after-tax income left after rent
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNetAfterRent)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 rc-print-block">
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
                      {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12).
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
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block">
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

              <p className="mt-4 text-xs text-slate-500">
                Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks =
                28 days, and month = 365 ÷ 12 days (average). Exact pay dates
                and billing rules vary.
              </p>
            </div>
          ) : null}

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). The tax rate is an input
            estimate and does not model brackets, deductions, or credits.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>Inputs are validated before results are shown.</strong> If
              income, rent, or tax rate is invalid or ambiguous, the calculator
              does not show a misleading 0 result.
            </li>
            <li>
              <strong>
                Income and rent are converted through annual totals.
              </strong>{" "}
              The tool annualizes both inputs using a 365-day year (month is 365
              ÷ 12 days).
            </li>
            <li>
              <strong>Net income is estimated with one rate.</strong> Net income
              is computed as annual gross × (1 − effective tax rate).
            </li>
            <li>
              <strong>
                Rent share and income left are computed on that same basis.
              </strong>{" "}
              Rent share is annual rent ÷ annual net, and "after rent" is annual
              net − annual rent.
            </li>
            <li>
              <strong>Rounding is display-only.</strong> Calculations preserve
              decimals internally (up to 12). If rounding is enabled, only
              displayed values are rounded.
            </li>
            <li>
              <strong>Export and print.</strong> You can export a CSV of the
              breakdown and print the results (including save-as-PDF via the
              browser print dialog).
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">What you can do</div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
              <li>
                Estimate rent as a percentage of take-home pay using a single
                effective rate
              </li>
              <li>See estimated net income left after rent</li>
              <li>
                Compare monthly and every-4-weeks views without treating them as
                interchangeable
              </li>
            </ul>
          </div>

          <p className="text-slate-700 mt-6">
            Related pages:{" "}
            <a
              href={safeHref("/how-much-rent-can-i-afford-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent affordability calculator
            </a>
            ,{" "}
            <a
              href={safeHref("/rent-paid-every-4-weeks-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent paid every 4 weeks
            </a>
            .
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6 rc-no-print">
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

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and average month
            length) and simplified models. Results are estimates, not
            guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice.
            Rental costs, affordability, payment schedules, and obligations vary
            by location, landlord, lease terms, and individual circumstances.
            Always review your lease agreement and consult qualified
            professionals before making financial decisions.
          </p>
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
