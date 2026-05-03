import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-hourly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import HowItWorks from "~/client/components/annual-to-hourly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/annual-to-hourly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/annual-to-hourly-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Annual to Hourly Rent Converter | Rent Per Hour";
  const description =
    "Convert annual rent into an hourly rent equivalent using a 365-day year. Compare hourly, daily, weekly, monthly, and optional paid-hours results.";

  const url = `${SITE_URL}${PAGE_PATH}`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to hourly rent converter, annual rent per hour, yearly to hourly rent, rent per hour calculator, annual rent to hourly calculator, 8760 hours per year rent, hourly rent equivalent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

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
  biweekly: "2 weeks (14 days)",
  every_4_weeks: "4 weeks (28 days)",
  monthly: "Monthly (average)",
  annual: "Annual",
};

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

function SafeLink({
  href,
  className,
  children,
  id,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  if (!ROUTE_WHITELIST.has(href)) return null;
  return (
    <a id={id} href={href} className={className}>
      {children}
    </a>
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

const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedAmount = {
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

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
  const d = Math.max(0, Math.min(12, Math.trunc(digits)));
  const drop = 12 - d;
  const factor = 10n ** BigInt(drop);
  if (factor === 1n) return scaled;

  const half = factor / 2n;
  const neg = scaled < 0n;
  const x = absBigInt(scaled);

  const rounded = (x + half) / factor;
  const back = rounded * factor;
  return neg ? -back : back;
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

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return (n * 100).toFixed(2) + "%";
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) {
    return { ok: false, error: "Enter an annual rent amount.", warnings };
  }

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 30000 or 30000.50).",
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
    return { ok: false, error: "Annual rent must be 0 or greater.", warnings };
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
          `Interpreted "${s0}" as thousands grouping (1234). If you meant a decimal, use a dot like "1.234".`,
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
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };
  }

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxAnnual = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxAnnual);

  if (clamped !== scaled) {
    warnings.push("Value was clamped to the supported maximum for safety.");
  }

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;

  return { ok: true, scaled: clamped, normalized, warnings };
}

function parseHoursInput(raw: string): {
  ok: boolean;
  hoursPerWeek?: bigint;
  normalized?: string;
  error?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: "Enter paid hours per week.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number of hours (example: 40).",
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
    return {
      ok: false,
      error: "Paid hours per week must be 0 or greater.",
      warnings,
    };
  }

  const parsed = parseMoneyInputToScaled(s);
  if (!parsed.ok || parsed.scaled === undefined) {
    return {
      ok: false,
      error: parsed.error ?? "Enter a valid number of hours.",
      warnings: parsed.warnings,
    };
  }

  const maxHoursScaled = 168n * SCALE;
  const clamped = clampScaled(parsed.scaled, 0n, maxHoursScaled);

  if (clamped !== parsed.scaled) {
    warnings.push("Hours per week was clamped to 168 (max hours in a week).");
  }

  return {
    ok: true,
    hoursPerWeek: clamped,
    normalized: parsed.normalized,
    warnings: [...parsed.warnings, ...warnings],
  };
}

function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

function annualToPeriodScaled(annualScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return annualScaled;
    case "monthly":
      return mulDivScaled(annualScaled, 1n, 12n);
    case "every_4_weeks":
      return mulDivScaled(annualScaled, 28n, 365n);
    case "biweekly":
      return mulDivScaled(annualScaled, 14n, 365n);
    case "weekly":
      return mulDivScaled(annualScaled, 7n, 365n);
    case "daily":
      return mulDivScaled(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivScaled(annualScaled, 1n, 365n * 24n);
    default:
      return annualScaled;
  }
}

function annualToPaidHoursHourlyScaled(
  annualScaled: bigint,
  hoursPerWeekScaled: bigint,
): bigint {
  const den = hoursPerWeekScaled * 52n;
  if (den === 0n) return 0n;
  return (annualScaled * SCALE) / den;
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

function groupDigitsFromNormalized(normalized: string): string {
  const s = String(normalized ?? "").trim();
  if (!s) return "";
  const parts = s.split(".");
  const intPartRaw = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";

  const intPart = intPartRaw.replace(/^0+(?=\d)/, "") || "0";
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fracPart ? `${grouped}.${fracPart}` : grouped;
}

export default function AnnualToHourlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "30000";
    const saved = window.localStorage.getItem("rc_ath_amount");
    return saved ?? "30000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_ath_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [showPaidHoursScenario, setShowPaidHoursScenario] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      const saved = window.localStorage.getItem("rc_ath_paid_hours_show");
      return safeParseBoolean(saved, false);
    },
  );

  const [paidHoursPerWeek, setPaidHoursPerWeek] = useState<string>(() => {
    if (typeof window === "undefined") return "40";
    const saved = window.localStorage.getItem("rc_ath_paid_hours_week");
    return saved ?? "40";
  });

  const [paidHoursFocused, setPaidHoursFocused] = useState<boolean>(false);

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_ath_amount", amount);
      window.localStorage.setItem("rc_ath_currency", currency);
      window.localStorage.setItem(
        "rc_ath_paid_hours_show",
        JSON.stringify(showPaidHoursScenario),
      );
      window.localStorage.setItem("rc_ath_paid_hours_week", paidHoursPerWeek);
    } catch {
      // ignore
    }
  }, [
    amount,
    currency,
    showPaidHoursScenario,
    paidHoursPerWeek,
  ]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedAnnual = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const annualScaled = parsedAnnual.ok ? (parsedAnnual.scaled as bigint) : 0n;

  const amountPreview = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    const normalized = parsedAnnual.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsedAnnual.ok, parsedAnnual.normalized]);

  const amountInputValue = amountFocused
    ? amount
    : parsedAnnual.ok && amountPreview
      ? amountPreview
      : amount;

  const parsedHours = useMemo(() => {
    if (!showPaidHoursScenario) return null;
    return parseHoursInput(paidHoursPerWeek);
  }, [paidHoursPerWeek, showPaidHoursScenario]);

  const hoursPreview = useMemo(() => {
    if (!parsedHours?.ok) return null;
    const normalized = parsedHours.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsedHours?.ok, parsedHours?.normalized]);

  const paidHoursInputValue = paidHoursFocused
    ? paidHoursPerWeek
    : parsedHours?.ok && hoursPreview
      ? hoursPreview
      : paidHoursPerWeek;

  const hoursPerWeekScaled = parsedHours?.ok
    ? (parsedHours.hoursPerWeek as bigint)
    : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const annualInterpreted = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    return fmt(annualScaled);
  }, [parsedAnnual.ok, annualScaled, currency]);

  const canShowAnnualResults = parsedAnnual.ok;

  const breakdownScaled = useMemo(() => {
    if (!parsedAnnual.ok) return null;

    const hourly = annualToPeriodScaled(annualScaled, "hourly");
    const daily = annualToPeriodScaled(annualScaled, "daily");
    const weekly = annualToPeriodScaled(annualScaled, "weekly");
    const biweekly = annualToPeriodScaled(annualScaled, "biweekly");
    const every4w = annualToPeriodScaled(annualScaled, "every_4_weeks");
    const monthly = annualToPeriodScaled(annualScaled, "monthly");
    const annual = annualScaled;

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    let paidHourly: bigint | null = null;
    let paidMinusClock: bigint | null = null;
    let paidMinusClockPct: number | null = null;
    let paidHoursPerYearLabel: string | null = null;

    if (showPaidHoursScenario) {
      if (!parsedHours?.ok) {
        paidHourly = null;
        paidMinusClock = null;
        paidMinusClockPct = null;
        paidHoursPerYearLabel = null;
      } else {
        const hoursPerYearScaled = hoursPerWeekScaled * 52n;
        paidHoursPerYearLabel = `${toNumberSafe(
          hoursPerYearScaled,
        ).toLocaleString(undefined, { maximumFractionDigits: 4 })} hours/year`;

        paidHourly = annualToPaidHoursHourlyScaled(
          annualScaled,
          hoursPerWeekScaled,
        );
        paidMinusClock = paidHourly - hourly;
        paidMinusClockPct =
          hourly === 0n ? 0 : Number(paidMinusClock) / Number(hourly);
      }
    }

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,
      monthlyMinus4w,
      monthlyMinus4wPct,
      paidHourly,
      paidMinusClock,
      paidMinusClockPct,
      paidHoursPerYearLabel,
    };
  }, [
    parsedAnnual.ok,
    annualScaled,
    showPaidHoursScenario,
    parsedHours?.ok,
    hoursPerWeekScaled,
  ]);

  const headlineHourlyScaled = breakdownScaled?.hourly ?? 0n;

  const canShowPaidScenario =
    showPaidHoursScenario &&
    parsedAnnual.ok &&
    parsedHours !== null &&
    parsedHours.ok &&
    breakdownScaled?.paidHourly !== null;

  const paidScenarioBlocked =
    showPaidHoursScenario &&
    (!parsedHours || !parsedHours.ok) &&
    parsedAnnual.ok;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleCsvExport = () => {
    if (typeof window === "undefined") return;
    if (!parsedAnnual.ok || !breakdownScaled) return;

    const rows: string[][] = [
      ["Annual to Hourly Rent Converter"],
      ["Input annual rent", annualInterpreted ?? ""],
      ["Currency", currency],
      ["Display note", "Money values rounded to cents"],
      [],
      ["Period", "Amount"],
      [PERIOD_LABEL.hourly, fmt(breakdownScaled.hourly)],
      [PERIOD_LABEL.daily, fmt(breakdownScaled.daily)],
      [PERIOD_LABEL.weekly, fmt(breakdownScaled.weekly)],
      [PERIOD_LABEL.biweekly, fmt(breakdownScaled.biweekly)],
      [PERIOD_LABEL.every_4_weeks, fmt(breakdownScaled.every4w)],
      [PERIOD_LABEL.monthly, fmt(breakdownScaled.monthly)],
      [PERIOD_LABEL.annual, fmt(breakdownScaled.annual)],
    ];

    if (canShowPaidScenario) {
      rows.push(
        [],
        ["Paid-hours scenario", ""],
        ["Paid hours per year", breakdownScaled.paidHoursPerYearLabel ?? ""],
        ["Time-based hourly", fmt(breakdownScaled.hourly)],
        ["Paid-hours hourly", fmt(breakdownScaled.paidHourly as bigint)],
        ["Difference", fmt(breakdownScaled.paidMinusClock as bigint)],
        [
          "Difference percentage",
          formatPercent(breakdownScaled.paidMinusClockPct as number),
        ],
      );
    }

    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "annual-to-hourly-rent-conversion.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const faqData = [
    {
      q: "How do I convert annual rent to hourly rent?",
      a: "Divide the annual rent total by 8,760, which is 365 days × 24 hours. For example, 30,000 per year divided by 8,760 equals about 3.42 per hour before display rounding.",
    },
    {
      q: "Is annual rent per hour the same as a lease billing rate?",
      a: "No. Annual rent per hour is a budgeting comparison. It spreads the annual total across every hour in a 365-day year. It does not mean rent is billed by the hour.",
    },
    {
      q: "Why does the hourly rent equivalent look small?",
      a: "The hourly figure is small because the annual rent is divided across all 8,760 hours in the year, including nights, weekends, and time when the space is not actively used.",
    },
    {
      q: "What is the paid-hours scenario?",
      a: "The paid-hours scenario spreads the same annual rent across an assumed number of paid or working hours. For example, 40 hours per week × 52 weeks equals 2,080 hours per year, which gives a different hourly comparison than the full 8,760-hour year.",
    },
    {
      q: "Should I include utilities, fees, taxes, or insurance in annual rent?",
      a: "Include only the costs you want to analyze. If you want a pure rent comparison, use rent only. If you want an all-in occupancy cost comparison, include recurring costs such as utilities, fees, taxes, or insurance where relevant.",
    },
    {
      q: "Does the currency selector convert exchange rates?",
      a: "No. The currency selector only changes the displayed currency format. If you need another currency, convert the amount externally first, then enter the converted annual total.",
    },
    {
      q: "Does this annual to hourly rent calculator use leap years?",
      a: "No. The calculator uses a 365-day year for consistency. That means the main hourly formula is annual rent ÷ 8,760.",
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
        item: SITE_URL, // no trailing slash
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Annual to Hourly Rent Converter",
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Annual to Hourly Rent Converter",
    url: `${SITE_URL}${PAGE_PATH}`,
    description:
      "Convert annual rent to an hourly rent equivalent using a 365-day year, with daily, weekly, biweekly, 4-week, monthly, annual, and optional paid-hours comparisons.",
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Annual to hourly rent conversion",
    },
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 pt-3 sm:pt-6"
      >
        <div className="rounded-[1.75rem] bg-white px-4 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  Annual rent per hour calculator
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-sky-900 tracking-tight">
                  Annual to Hourly Rent Converter
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-700">
                  Convert an annual rent total into an hourly equivalent using a
                  365-day year. The tool also shows daily, weekly, biweekly,
                  4-week, monthly, and annual breakdowns so you can compare rent
                  across common planning periods.
                </p>
              </div>

              <div className="rc-no-print flex flex-wrap gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Print / Save as PDF
                </button>

                <button
                  type="button"
                  onClick={handleCsvExport}
                  disabled={!canShowAnnualResults}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm rc-no-print">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    Paid-hours scenario
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Optional comparison using hours per week × 52 instead of the
                    full 8,760-hour year.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaidHoursScenario((v) => !v)}
                  className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    showPaidHoursScenario
                      ? "bg-sky-600 hover:bg-sky-700"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label="Toggle paid-hours scenario"
                  aria-pressed={showPaidHoursScenario}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 cursor-pointer rounded-full bg-white shadow transition ${
                      showPaidHoursScenario ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {showPaidHoursScenario ? (
                <div className="mt-4 max-w-md">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Paid hours per week
                  </label>
                  <input
                    inputMode="decimal"
                    value={paidHoursInputValue}
                    onChange={(e) => setPaidHoursPerWeek(e.target.value)}
                    onFocus={() => setPaidHoursFocused(true)}
                    onBlur={() => setPaidHoursFocused(false)}
                    placeholder="e.g. 40 or 37.5"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-base text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={Boolean(parsedHours && !parsedHours.ok)}
                    aria-describedby="rc-hours-help rc-hours-error"
                  />
                  <p id="rc-hours-help" className="mt-2 text-xs text-slate-700">
                    Valid range is 0 to 168 hours/week. This is only an
                    illustrative comparison.
                  </p>

                  {parsedHours && !parsedHours.ok ? (
                    <p
                      id="rc-hours-error"
                      className="mt-2 text-sm font-semibold text-rose-700"
                    >
                      {parsedHours.error}
                    </p>
                  ) : parsedHours && parsedHours.warnings.length ? (
                    <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Hours input note</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {parsedHours.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Annual rent total
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    inputMode="decimal"
                    value={amountInputValue}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setAmountFocused(true)}
                    onBlur={() => setAmountFocused(false)}
                    placeholder="e.g. 30000 or 30000.50"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-invalid={!parsedAnnual.ok}
                    aria-describedby="rc-amount-help rc-amount-error"
                  />

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        isCurrency(e.target.value)
                          ? (e.target.value as Currency)
                          : "USD",
                      )
                    }
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-amount-help" className="mt-2 text-xs text-slate-700">
                  Enter the yearly rent amount you want to analyze. Currency
                  symbols, commas, and decimals are accepted.
                </p>

                {!parsedAnnual.ok ? (
                  <p
                    id="rc-amount-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                  >
                    {parsedAnnual.error}
                  </p>
                ) : parsedAnnual.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">Amount input note</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {parsedAnnual.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              aria-live="polite"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />


              <div className="p-5 sm:px-6">

              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-950">
                  Hourly equivalent
                </div>
              </div>

              {!canShowAnnualResults ? (
                <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-slate-700">
                  <div className="font-semibold text-slate-950">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid annual rent total above to see the hourly
                    equivalent and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <div>
                      <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                        {fmt(headlineHourlyScaled)}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">
                        Based on annual rent divided by 8,760 hours.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Daily", breakdownScaled!.daily, "daily"],
                        ["Weekly", breakdownScaled!.weekly, "weekly"],
                        [
                          "2 weeks (14 days)",
                          breakdownScaled!.biweekly,
                          "biweekly",
                        ],
                        [
                          "4 weeks (28 days)",
                          breakdownScaled!.every4w,
                          "every_4_weeks",
                        ],
                        [
                          "Monthly (average)",
                          breakdownScaled!.monthly,
                          "monthly",
                        ],
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs font-medium text-slate-700">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {fmt(val)}
                        </div>
                      </div>
                    ))}

                    {showPaidHoursScenario ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-700">
                          Paid-hours hourly comparison (optional)
                        </div>

                        {paidScenarioBlocked ? (
                          <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-900">
                            <div className="font-semibold">
                              Paid-hours scenario needs a valid hours/week input
                            </div>
                            <p className="mt-1 text-sm">
                              Fix the paid hours per week field to see the
                              paid-hours hourly comparison.
                            </p>
                          </div>
                        ) : canShowPaidScenario ? (
                          <div className="mt-2 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white px-4 py-3">
                              <div className="text-xs text-slate-700">
                                Time-based hourly
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-950">
                                {fmt(breakdownScaled!.hourly)}
                              </div>
                              <div className="mt-1 text-xs text-slate-700">
                                Annual ÷ 8,760
                              </div>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                              <div className="text-xs text-emerald-700">
                                Paid-hours hourly
                              </div>
                              <div className="mt-1 text-sm font-bold text-emerald-800">
                                {fmt(breakdownScaled!.paidHourly as bigint)}
                              </div>
                              <div className="mt-1 text-xs text-emerald-700">
                                Annual ÷ (hours/week × 52)
                                {breakdownScaled!.paidHoursPerYearLabel
                                  ? ` ≈ ${breakdownScaled!.paidHoursPerYearLabel}`
                                  : ""}
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white px-4 py-3">
                              <div className="text-xs text-slate-700">
                                Difference
                              </div>
                              <div className="mt-1 text-sm font-bold text-slate-950">
                                {fmt(breakdownScaled!.paidMinusClock as bigint)}
                              </div>
                              <div className="mt-1 text-xs text-slate-700">
                                ≈{" "}
                                {formatPercent(
                                  breakdownScaled!.paidMinusClockPct as number)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-slate-700">
                            Enter paid hours per week to see the paid-hours
                            scenario comparison.
                          </p>
                        )}

                        <p className="mt-3 text-xs text-slate-700">
                          The paid-hours scenario is a comparison tool. It does
                          not replace the main time-based hourly equivalence.
                        </p>
                      </div>
                    ) : null}

                    {breakdownScaled && (
                      <FourWeekVsMonthly
                        monthlyMinus4w={breakdownScaled.monthlyMinus4w}
                        monthlyMinus4wPct={breakdownScaled.monthlyMinus4wPct}
                        fmt={fmt}
                        formatPercent={formatPercent as any}
                      />
                    )}
                  </div>
                </>
              )}


              </div></div>

            <Assumptions />

            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-950">
                Precision note
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Calculations preserve precision internally, while displayed money values are rounded to cents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-700">
          <SafeLink
            href="/"
            className="cursor-pointer text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
          >
            Home
          </SafeLink>{" "}
          / Annual to Hourly Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-700">
          These answers explain how the annual to hourly rent conversion works,
          what the hourly equivalent means, and when the optional paid-hours
          comparison is useful.
        </p>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 max-w-prose text-slate-700 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
