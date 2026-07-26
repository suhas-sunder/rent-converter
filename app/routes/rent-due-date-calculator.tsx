import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-due-date-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-due-date-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-due-date-calculator/ToolFit";
import {
  addCalendarMonths,
  compareCalendarDates,
  currentCalendarDateString,
  formatCalendarDate,
  formatCalendarDateForDisplay,
  formatCalendarMonthForDisplay,
  generateRentDueDates,
  parseCalendarDate,
  parseWholeNumber,
  subtractCalendarDay,
} from "~/client/utils/calendarDate.js";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Due Date Calculator | Next Rent Payment Date";
  const description =
    "Enter a due rule and as-of date to find upcoming rent due dates for monthly, weekly, biweekly, annual, or 28-day rent cycles.";

  const ogTitle = "Rent Due Date Calculator | Next Rent Payment Date";
  const ogDescription = "Enter a due rule and as-of date to find upcoming rent due dates for monthly, weekly, biweekly, annual, or 28-day rent cycles.";

  const canonical = "https://www.rentconverter.com/rent-due-date-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent due date calculator, next rent due date, rent payment schedule, rent paid by date, rent payment calendar, rent billed every 28 days, rent due weekly, rent due biweekly, monthly rent totals",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
    { name: "twitter:image", content: ogImage },

    { tagName: "link", rel: "canonical", href: canonical },
  ];
};

type BillingCycle =
  | "monthly"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "annual";

const BILLING_LABEL: Record<BillingCycle, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
  annual: "Annual",
};

const BILLING_PAYMENTS_PER_YEAR: Record<BillingCycle, number> = {
  weekly: 52,
  biweekly: 26,
  every_4_weeks: 13,
  monthly: 12,
  annual: 1,
};

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

/**
 * Only include routes you are sure exist.
 * If you do not have a whitelist, remove safeHref and use plain hrefs.
 */
const ROUTE_WHITELIST = new Set<string>([
  // Home
  "/",

  // Rent converter hub
  "/",

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

  // Rent vs buy
  "/rent-vs-buy-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
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

function formatGroupedPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;

  const [intPartRaw, fracPart] = s.split(".", 2);
  const intPart = intPartRaw === "" ? "0" : intPartRaw;

  if (!/^\d+$/.test(intPart)) return s;

  const grouped = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(intPart));

  if (typeof fracPart === "string") return `${grouped}.${fracPart}`;
  return grouped;
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

type CalendarDateValue = { year: number; month: number; day: number };

function formatDate(date: CalendarDateValue) {
  return formatCalendarDateForDisplay(date);
}

function ymKey(date: CalendarDateValue) {
  return `${date.year}-${String(date.month).padStart(2, "0")}`;
}

function yKey(date: CalendarDateValue) {
  return String(date.year);
}

function monthLabelFromKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  return formatCalendarMonthForDisplay({ year, month, day: 1 });
}

function makeMonthKeysBetween(start: CalendarDateValue, endExclusive: CalendarDateValue) {
  if (compareCalendarDates(endExclusive, start) <= 0) return [];
  const finalDate = subtractCalendarDay(endExclusive);
  const keys: string[] = [];
  let cursor = { ...start, day: 1 };
  for (let guard = 0; guard < 2000 && compareCalendarDates(cursor, finalDate) <= 0; guard += 1) {
    keys.push(ymKey(cursor));
    cursor = addCalendarMonths(cursor, 1, 1).date;
  }
  return keys;
}

function isBillingCycle(x: string): x is BillingCycle {
  return (
    x === "monthly" ||
    x === "weekly" ||
    x === "biweekly" ||
    x === "every_4_weeks" ||
    x === "annual"
  );
}

export default function RentDueDateCalculator() {
  const pageName = "Rent Due Date Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-due-date-calculator";

  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [amount, setAmount] = useState<string>("2000");
  const [amountFocused, setAmountFocused] = useState<boolean>(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [asOfDate, setAsOfDate] = useState<string>("");
  const [horizonMode, setHorizonMode] = useState<"years" | "end_date">("years");
  const [yearsAhead, setYearsAhead] = useState<string>("1");
  const [endDate, setEndDate] = useState<string>("");
  const [anchorDate, setAnchorDate] = useState<string>("");
  const [dueDayMonthly, setDueDayMonthly] = useState<string>("1");
  const [storageRestored, setStorageRestored] = useState(false);

  useEffect(() => {
    const browserDate = currentCalendarDateString();
    try {
      const savedCycle = window.localStorage.getItem("rdd2_cycle");
      if (savedCycle && isBillingCycle(savedCycle)) setCycle(savedCycle);

      const savedAmount = window.localStorage.getItem("rdd2_amount");
      if (savedAmount && parseMoneyInputToScaled(savedAmount).ok) setAmount(savedAmount);

      const savedCurrency = window.localStorage.getItem("rdd2_currency");
      if (savedCurrency && isCurrency(savedCurrency)) setCurrency(savedCurrency);

      const savedAsOf = window.localStorage.getItem("rdd2_asOf");
      const restoredAsOf = savedAsOf && parseCalendarDate(savedAsOf, "As-of date").ok ? savedAsOf : browserDate;
      setAsOfDate(restoredAsOf);

      const savedMode = window.localStorage.getItem("rdd2_horizonMode");
      if (savedMode === "end_date") setHorizonMode("end_date");

      const savedYears = window.localStorage.getItem("rdd2_yearsAhead");
      if (savedYears && ["1", "2", "3", "5"].includes(savedYears)) setYearsAhead(savedYears);

      const savedEnd = window.localStorage.getItem("rdd2_endDate");
      const savedEndParsed = savedEnd ? parseCalendarDate(savedEnd, "End boundary") : null;
      const restoredAsOfParsed = parseCalendarDate(restoredAsOf);
      if (savedEnd && savedEndParsed?.ok && restoredAsOfParsed.ok && compareCalendarDates(savedEndParsed.date, restoredAsOfParsed.date) > 0) {
        setEndDate(savedEnd);
      } else {
        if (restoredAsOfParsed.ok) setEndDate(formatCalendarDate(addCalendarMonths(restoredAsOfParsed.date, 12).date));
      }

      const savedAnchor = window.localStorage.getItem("rdd2_anchor");
      setAnchorDate(savedAnchor && parseCalendarDate(savedAnchor, "Anchor date").ok ? savedAnchor : restoredAsOf);

      const savedDueDay = window.localStorage.getItem("rdd2_dueDay");
      if (savedDueDay && parseWholeNumber(savedDueDay, "Monthly due day", 1, 31).ok) setDueDayMonthly(savedDueDay);
    } catch {
      setAsOfDate(browserDate);
      const parsedBrowserDate = parseCalendarDate(browserDate);
      if (parsedBrowserDate.ok) {
        setEndDate(formatCalendarDate(addCalendarMonths(parsedBrowserDate.date, 12).date));
      }
      setAnchorDate(browserDate);
    } finally {
      setStorageRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!storageRestored) return;
    try {
      window.localStorage.setItem("rdd2_cycle", cycle);
      window.localStorage.setItem("rdd2_amount", amount);
      window.localStorage.setItem("rdd2_currency", currency);
      window.localStorage.setItem("rdd2_asOf", asOfDate);
      window.localStorage.setItem("rdd2_horizonMode", horizonMode);
      window.localStorage.setItem("rdd2_yearsAhead", yearsAhead);
      window.localStorage.setItem("rdd2_endDate", endDate);
      window.localStorage.setItem("rdd2_anchor", anchorDate);
      window.localStorage.setItem("rdd2_dueDay", dueDayMonthly);
    } catch {
      // Storage is optional; calculation behavior does not depend on it.
    }
  }, [
    storageRestored,
    cycle,
    amount,
    currency,
    asOfDate,
    horizonMode,
    yearsAhead,
    endDate,
    anchorDate,
    dueDayMonthly,
  ]);

  const parsedAmount = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (parsedAmount.ok && parsedAmount.normalized) {
      return formatGroupedPreviewFromNormalized(parsedAmount.normalized);
    }
    return amount;
  }, [amountFocused, amount, parsedAmount.ok, parsedAmount.normalized]);

  const parsedAsOf = useMemo(() => parseCalendarDate(asOfDate, "As-of date"), [asOfDate]);
  const parsedAnchor = useMemo(() => parseCalendarDate(anchorDate, "Anchor date"), [anchorDate]);
  const parsedEnd = useMemo(() => parseCalendarDate(endDate, "End boundary"), [endDate]);
  const parsedDueDay = useMemo(() => parseWholeNumber(dueDayMonthly, "Monthly due day", 1, 31), [dueDayMonthly]);
  const computedBoundary = useMemo(() => {
    if (!parsedAsOf.ok) return null;
    if (horizonMode === "end_date") return parsedEnd.ok ? parsedEnd.date : null;
    const years = Number(yearsAhead);
    return addCalendarMonths(parsedAsOf.date, years * 12, parsedAsOf.date.day).date;
  }, [horizonMode, parsedAsOf, parsedEnd, yearsAhead]);
  const boundaryRelationError = parsedAsOf.ok && computedBoundary && compareCalendarDates(computedBoundary, parsedAsOf.date) <= 0
    ? "The end boundary must be after the as-of date."
    : null;

  const dateErrors = useMemo(() => {
    if (!storageRestored) return [];
    const errors: string[] = [];
    if (!parsedAsOf.ok) errors.push(parsedAsOf.error);
    if (horizonMode === "end_date" && !parsedEnd.ok) errors.push(parsedEnd.error);
    if (cycle === "monthly" && !parsedDueDay.ok) errors.push(parsedDueDay.error);
    if (cycle !== "monthly" && !parsedAnchor.ok) errors.push(parsedAnchor.error);
    if (boundaryRelationError) errors.push(boundaryRelationError);
    return errors;
  }, [boundaryRelationError, cycle, horizonMode, parsedAnchor, parsedAsOf, parsedDueDay, parsedEnd, storageRestored]);

  const schedule = useMemo(() => {
    if (dateErrors.length || !parsedAsOf.ok || !computedBoundary) return [];
    return generateRentDueDates({
      cycle,
      asOf: parsedAsOf.date,
      boundary: computedBoundary,
      anchor: parsedAnchor.ok ? parsedAnchor.date : undefined,
      dueDay: parsedDueDay.ok ? parsedDueDay.value : undefined,
    });
  }, [computedBoundary, cycle, dateErrors, parsedAnchor, parsedAsOf, parsedDueDay]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!parsedAmount.ok)
      errors.push(parsedAmount.error ?? "Enter a valid amount.");
    if (parsedAmount.warnings.length) warnings.push(...parsedAmount.warnings);
    errors.push(...dateErrors);

    const rentPerPaymentScaled = parsedAmount.ok
      ? (parsedAmount.scaled as bigint)
      : 0n;

    if (errors.length || !parsedAsOf.ok || !computedBoundary) {
      return { ok: false as const, errors, warnings, rentPerPaymentScaled };
    }

    const nextDue = schedule[0] ?? null;
    const paymentsTotal = schedule.length;

    const totalPaidScaled = rentPerPaymentScaled * BigInt(paymentsTotal);

    const monthlyKeys = parsedAsOf.ok && computedBoundary
      ? makeMonthKeysBetween(parsedAsOf.date, computedBoundary)
      : [];
    const paymentsByMonth = new Map<string, number>();
    for (const k of monthlyKeys) paymentsByMonth.set(k, 0);
    for (const d of schedule) {
      const k = ymKey(d);
      paymentsByMonth.set(k, (paymentsByMonth.get(k) ?? 0) + 1);
    }

    const monthRows = monthlyKeys.map((k) => {
      const count = paymentsByMonth.get(k) ?? 0;
      const totalScaled = rentPerPaymentScaled * BigInt(count);
      return {
        key: k,
        label: monthLabelFromKey(k),
        payments: count,
        totalScaled,
      };
    });

    const yearMap = new Map<string, number>();
    for (const d of schedule) {
      const y = yKey(d);
      yearMap.set(y, (yearMap.get(y) ?? 0) + 1);
    }
    const yearTotals = Array.from(yearMap.keys())
      .sort()
      .map((y) => {
        const count = yearMap.get(y) ?? 0;
        const totalScaled = rentPerPaymentScaled * BigInt(count);
        return { year: y, payments: count, totalScaled };
      });

    const standardAnnualTotals = (
      [
        "monthly",
        "every_4_weeks",
        "biweekly",
        "weekly",
        "annual",
      ] as BillingCycle[]
    ).map((c) => {
      const paymentsPerYear = BILLING_PAYMENTS_PER_YEAR[c];
      const annualScaled = rentPerPaymentScaled * BigInt(paymentsPerYear);
      return { key: c, label: BILLING_LABEL[c], paymentsPerYear, annualScaled };
    });

    const currentCycleStandardAnnualScaled =
      rentPerPaymentScaled * BigInt(BILLING_PAYMENTS_PER_YEAR[cycle] ?? 0);

    return {
      ok: true as const,
      warnings,

      nextDue,
      paymentsTotal,
      totalPaidScaled,

      monthRows,
      yearTotals,
      standardAnnualTotals,
      currentCycleStandardAnnualScaled,

      rentPerPaymentScaled,
      asOf: parsedAsOf.date,
      endBoundary: computedBoundary,
    };
  }, [parsedAmount, computedBoundary, parsedAsOf, cycle, schedule, dateErrors]);

  // FIX: only whitelisted routes here
  const relatedLinks = [
    {
      href: "/rent-schedule-calculator",
      text: "Rent schedule calculator",
    },
    {
      href: "/lease-date-calculator",
      text: "Lease date calculator",
    },
  ];

  const faqData = [
    {
      q: "What does total rent due before the end boundary mean?",
      a: "It is the number of generated due dates from the inclusive as-of date up to, but not including, the end boundary, multiplied by the rent amount entered.",
    },
    {
      q: "Why can monthly totals vary for weekly, biweekly, or 28-day rent?",
      a: "Those cycles repeat on fixed day intervals. Some calendar months contain more due dates than others, which changes how many payments fall within a given month.",
    },
    {
      q: "How is monthly rent handled when the due day is 29 to 31?",
      a: "If the requested day does not exist in a month, that month uses its final calendar day. Later months return to the requested due day when it exists.",
    },
    {
      q: "What is the anchor date used for?",
      a: "For weekly, biweekly, and 28-day cycles, the anchor date sets the reference point for the repeating interval so the schedule follows that cadence forward in time.",
    },
    {
      q: "Why does a 4-week (28-day) cycle often show 13 payments per year?",
      a: "A 28-day interval fits into a 365-day year about 13 times. That cadence shifts due dates across the calendar and can produce an extra payment compared with 12 monthly payments.",
    },
    {
      q: "Does this adjust for weekends, holidays, or grace periods?",
      a: "No. It calculates calendar dates from the due rule you enter. Check the written agreement and the relevant official authority for any separate timing rules.",
    },
    {
      q: "Why can the schedule total differ from the standard annual total?",
      a: "The standard annual total uses fixed payment counts for comparison. The generated schedule counts only dates before the exclusive end boundary.",
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
        item: "https://www.rentconverter.com",
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
              Rent Due Date Calculator
            </h1>

            <div
              id="export-controls"
              data-nosnippet
              className="hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p className="hidden md:flex w-full py-2 text-base text-slate-700">
            Enter the due date or cadence stated in the rental agreement to
            calculate upcoming dates. This tool does not decide when rent is
            legally due; use the rent schedule calculator for full
            lease-bounded payment rows.
          </p>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <label htmlFor="rent-due-amount" className="block text-sm font-semibold text-slate-700 mb-2">
                Rent per payment
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  id="rent-due-amount"
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000 or 2000.00"
                  className="cursor-pointer col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                  aria-invalid={!parsedAmount.ok}
                  aria-describedby={!parsedAmount.ok ? "rent-due-amount-error" : undefined}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="col-span-5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedAmount.ok ? (
                <p id="rent-due-amount-error" role="alert" className="mt-2 text-sm font-semibold text-rose-700">
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAmount.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-4">
              <label htmlFor="rent-due-cycle" className="block text-sm font-semibold text-slate-700 mb-2">
                Billing cycle
              </label>
              <select
                id="rent-due-cycle"
                value={cycle}
                onChange={(e) =>
                  setCycle(
                    isBillingCycle(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "weekly",
                    "annual",
                  ] as BillingCycle[]
                ).map((c) => (
                  <option key={c} value={c}>
                    {BILLING_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label htmlFor="rent-due-as-of" className="block text-sm font-semibold text-slate-700 mb-2">
                As-of date
              </label>
              <input
                id="rent-due-as-of"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                aria-invalid={storageRestored && !parsedAsOf.ok}
                aria-describedby={storageRestored && !parsedAsOf.ok ? "rent-due-as-of-error" : "rent-due-as-of-help"}
              />
              <p id="rent-due-as-of-help" className="mt-1 text-xs text-slate-600">Inclusive: a due date can be the as-of date itself.</p>
              {storageRestored && !parsedAsOf.ok ? <p id="rent-due-as-of-error" role="alert" className="mt-1 text-sm font-semibold text-rose-700">{parsedAsOf.error}</p> : null}
            </div>

            <div className="md:col-span-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="rent-due-horizon-mode" className="block text-sm font-semibold text-slate-700 mb-2">Horizon type</label>
                  <select
                    id="rent-due-horizon-mode"
                    value={horizonMode}
                    onChange={(e) => setHorizonMode(e.target.value === "end_date" ? "end_date" : "years")}
                    className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                  >
                    <option value="years">Years ahead</option>
                    <option value="end_date">End boundary</option>
                  </select>
                </div>

                {horizonMode === "years" ? (
                  <div>
                    <label htmlFor="rent-due-years" className="block text-sm font-semibold text-slate-700 mb-2">Years ahead</label>
                    <select id="rent-due-years" value={yearsAhead} onChange={(e) => setYearsAhead(e.target.value)} className="w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200">
                      {["1", "2", "3", "5"].map((y) => <option key={y} value={y}>{y} {y === "1" ? "year" : "years"}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="rent-due-end-boundary" className="block text-sm font-semibold text-slate-700 mb-2">Exclusive end boundary</label>
                    <input
                      id="rent-due-end-boundary"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                      aria-invalid={!parsedEnd.ok || Boolean(boundaryRelationError)}
                      aria-describedby={!parsedEnd.ok || boundaryRelationError ? "rent-due-end-error" : "rent-due-end-help"}
                    />
                  </div>
                )}
              </div>
              {horizonMode === "end_date" ? (
                !parsedEnd.ok || boundaryRelationError
                  ? <p id="rent-due-end-error" role="alert" className="mt-1 text-sm font-semibold text-rose-700">{!parsedEnd.ok ? parsedEnd.error : boundaryRelationError}</p>
                  : <p id="rent-due-end-help" className="mt-1 text-xs text-slate-600">Exclusive: due dates on this boundary are not included.</p>
              ) : <p className="mt-1 text-xs text-slate-600">The selected anniversary is an exclusive boundary.</p>}
            </div>

            <div className="md:col-span-6">
              <label htmlFor={cycle === "monthly" ? "rent-due-month-day" : "rent-due-anchor"} className="block text-sm font-semibold text-slate-700 mb-2">
                {cycle === "monthly" ? "Monthly due day" : "Anchor due date"}
              </label>

              {cycle === "monthly" ? (
                <input
                  id="rent-due-month-day"
                  inputMode="numeric"
                  value={dueDayMonthly}
                  onChange={(e) => setDueDayMonthly(e.target.value)}
                  placeholder="e.g. 1"
                  className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                  aria-label="Monthly due day"
                  aria-invalid={!parsedDueDay.ok}
                  aria-describedby={!parsedDueDay.ok ? "rent-due-day-error" : "rent-due-day-help"}
                />
              ) : (
                <input
                  id="rent-due-anchor"
                  type="date"
                  value={anchorDate}
                  onChange={(e) => setAnchorDate(e.target.value)}
                  className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                  aria-invalid={!parsedAnchor.ok}
                  aria-describedby={!parsedAnchor.ok ? "rent-due-anchor-error" : "rent-due-anchor-help"}
                />
              )}
              {cycle === "monthly" ? (
                !parsedDueDay.ok
                  ? <p id="rent-due-day-error" role="alert" className="mt-1 text-sm font-semibold text-rose-700">{parsedDueDay.error}</p>
                  : <p id="rent-due-day-help" className="mt-1 text-xs text-slate-600">Days 29–31 clamp for short months and return when the requested day exists.</p>
              ) : (
                !parsedAnchor.ok
                  ? <p id="rent-due-anchor-error" role="alert" className="mt-1 text-sm font-semibold text-rose-700">{parsedAnchor.error}</p>
                  : <p id="rent-due-anchor-help" className="mt-1 text-xs text-slate-600">Weekly-style cycles advance by exact calendar-day intervals from this anchor.</p>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
            {!storageRestored ? null : !computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4" role="status" aria-live="polite">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Fix the inputs to generate a schedule.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
                <div className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-4 rc-print-block">
                  <div><span className="block text-xs text-slate-600">As-of date</span><strong>{formatCalendarDate(computed.asOf)}</strong></div>
                  <div><span className="block text-xs text-slate-600">Exclusive end boundary</span><strong>{formatCalendarDate(computed.endBoundary)}</strong></div>
                  <div><span className="block text-xs text-slate-600">Frequency</span><strong>{BILLING_LABEL[cycle]}</strong></div>
                  <div><span className="block text-xs text-slate-600">Due rule</span><strong>{cycle === "monthly" ? `Day ${dueDayMonthly}` : `Anchor ${anchorDate}`}</strong></div>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-700">
                      Total rent due before the end boundary
                    </div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">
                      {fmtMoney(computed.totalPaidScaled)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-700">
                      Next estimated due date
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {computed.nextDue ? formatDate(computed.nextDue) : "No due date in horizon"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-700">
                      Payments in horizon
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {computed.paymentsTotal}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white overflow-hidden rc-print-block">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <div className="text-sm font-semibold text-slate-800">
                      Upcoming due dates
                    </div>
                    <div className="text-xs text-slate-700">
                      The as-of date is inclusive. The end boundary is exclusive.
                    </div>
                  </div>
                  <ul className="divide-y divide-slate-200 max-h-[360px] overflow-auto">
                    {schedule.length === 0 ? (
                      <li className="px-4 py-2 text-sm text-slate-700">
                        No due dates in the selected range.
                      </li>
                    ) : (
                      schedule.map((d, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between px-4 py-2"
                        >
                          <div className="text-sm text-slate-700">
                            Payment {idx + 1}
                          </div>
                          <div className="text-sm font-semibold text-slate-800">
                            {formatDate(d)}
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <section className="mt-10 rc-print-block">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-950">
                    Monthly totals
                  </h3>
                  <p className="text-slate-700 mb-4">
                    This table groups scheduled due dates into calendar months.
                    Fixed-day cycles can produce months with different payment
                    counts.
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold">
                            Month
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Payments in month
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Total paid in month
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {computed.monthRows.map((r) => (
                          <tr key={r.key}>
                            <td className="px-4 py-2 text-slate-700">
                              {r.label}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-800">
                              {r.payments}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-800">
                              {fmtMoney(r.totalScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="mt-10 rc-print-block">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-950">
                    Totals by calendar year
                  </h3>
                  <p className="text-slate-700 mb-4">
                    This shows how many payments fall inside each calendar year
                    within the selected horizon.
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold">
                            Year
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Payments
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {computed.yearTotals.length === 0 ? (
                          <tr>
                            <td
                              className="px-4 py-2 text-slate-700"
                              colSpan={3}
                            >
                              No payments in the selected range.
                            </td>
                          </tr>
                        ) : (
                          computed.yearTotals.map((r) => (
                            <tr key={r.year}>
                              <td className="px-4 py-2 text-slate-700">
                                {r.year}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold text-slate-800">
                                {r.payments}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold text-slate-800">
                                {fmtMoney(r.totalScaled)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="mt-10 rc-print-block">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-950">
                    Standard annual totals (comparison)
                  </h3>
                  <p className="text-slate-700 mb-4">
                    These standard counts help compare cycles. The schedule
                    totals above are calendar-based within the selected horizon.
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold">
                            Billing cycle
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Payments per year
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            Standard annual total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {computed.standardAnnualTotals.map((r) => (
                          <tr key={r.key}>
                            <td className="px-4 py-2 text-slate-700">
                              {r.label}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-800">
                              {r.paymentsPerYear}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-800">
                              {fmtMoney(r.annualScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                    <div className="text-xs text-slate-700">
                      Selected cycle (standard annual total)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.currentCycleStandardAnnualScaled)}
                    </div>
                    <div className="mt-1 text-xs text-slate-700">
                      Uses standard payment counts for comparison.
                      Calendar-based totals can differ over partial years.
                    </div>
                  </div>
                </section>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900 rc-no-print">
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

        <div className="md:col-span-12 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
              <button
                type="button"
                onClick={handlePrint}
                className="rc-print-button"
              >
                Print / Save as PDF
              </button>
            </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Calculations preserve precision internally, while displayed money values are rounded to cents.
              </p>
          </div>
        </div>
      </section>

      <HowItWorks relatedLinks={relatedLinks} safeHref={safeHref} />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a href={safeHref("/")} className="rc-breadcrumb-link">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
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
