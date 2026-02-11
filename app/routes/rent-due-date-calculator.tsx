import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-due-date-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-due-date-calculator/HowItWorks";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Due Date Calculator (Next Due Date + Schedule)";
  const description =
    "See your next rent due date and a full payment schedule at a glance. Track how many payments fall each month and total rent paid by any date across monthly, weekly, biweekly, and 28-day cycles. Free, private, no signup.";

  const ogTitle = "Rent Due Date Calculator (Next Due Date + Schedule)";
  const ogDescription =
    "Find your next rent due date and view payment counts by month plus total rent paid by any date for monthly, weekly, biweekly, and 28-day cycles.";

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
    { name: "twitter:title", content: "Rent Due Date Calculator" },
    {
      name: "twitter:description",
      content:
        "Find your next rent due date and view payment schedules, monthly totals, and cumulative rent paid.",
    },
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

function safeParseInt(value: string, fallback: number) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

const ALLOWED_DISPLAY_DECIMALS = new Set<number>([0, 2, 4, 6]);

function parseDisplayDecimals(raw: string | null): number {
  if (!raw) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return ALLOWED_DISPLAY_DECIMALS.has(t) ? t : 2;
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

function formatDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function toISODateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function lastDayOfMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function nextMonthlyDueDate(fromDate: Date, dueDay: number) {
  const start = stripTime(fromDate);
  const y = start.getFullYear();
  const m = start.getMonth();

  const thisMonthLast = lastDayOfMonth(y, m);
  const thisMonthDue = new Date(y, m, Math.min(dueDay, thisMonthLast));

  if (thisMonthDue >= start) return thisMonthDue;

  const nextMonth = m + 1;
  const ny = y + Math.floor(nextMonth / 12);
  const nm = nextMonth % 12;
  const nextLast = lastDayOfMonth(ny, nm);
  return new Date(ny, nm, Math.min(dueDay, nextLast));
}

function nextAnnualDueDate(fromDate: Date, anchor: Date) {
  const start = stripTime(fromDate);
  const a = stripTime(anchor);

  const candidateThisYear = new Date(
    start.getFullYear(),
    a.getMonth(),
    a.getDate(),
  );
  if (candidateThisYear >= start) return candidateThisYear;

  return new Date(start.getFullYear() + 1, a.getMonth(), a.getDate());
}

function nextFixedIntervalDueDate(
  fromDate: Date,
  intervalDays: number,
  anchor: Date,
) {
  const start = stripTime(fromDate);
  const a = stripTime(anchor);

  if (a >= start) return a;

  const diffMs = start.getTime() - a.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const steps = Math.ceil(diffDays / intervalDays);
  return addDays(a, steps * intervalDays);
}

function buildScheduleUntilEnd(
  cycle: BillingCycle,
  asOfDate: Date,
  endDate: Date,
  anchorDate: Date,
  dueDayMonthly: number,
) {
  const start = stripTime(asOfDate);
  const end = stripTime(endDate);

  if (end < start) return [];

  const dates: Date[] = [];

  if (cycle === "monthly") {
    let cursor = nextMonthlyDueDate(start, dueDayMonthly);
    let guard = 0;
    while (cursor <= end && guard < 2000) {
      dates.push(cursor);
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const ny = y + Math.floor(m / 12);
      const nm = m % 12;
      const nextLast = lastDayOfMonth(ny, nm);
      cursor = new Date(ny, nm, Math.min(dueDayMonthly, nextLast));
      guard++;
    }
    return dates;
  }

  if (cycle === "annual") {
    let cursor = nextAnnualDueDate(start, anchorDate);
    let guard = 0;
    while (cursor <= end && guard < 2000) {
      dates.push(cursor);
      cursor = new Date(
        cursor.getFullYear() + 1,
        cursor.getMonth(),
        cursor.getDate(),
      );
      guard++;
    }
    return dates;
  }

  const intervalDays = cycle === "weekly" ? 7 : cycle === "biweekly" ? 14 : 28;
  let cursor = nextFixedIntervalDueDate(start, intervalDays, anchorDate);
  let guard = 0;
  while (cursor <= end && guard < 5000) {
    dates.push(cursor);
    cursor = addDays(cursor, intervalDays);
    guard++;
  }
  return dates;
}

function ymKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function yKey(d: Date) {
  return String(d.getFullYear());
}

function monthLabelFromKey(key: string) {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(date);
}

function makeMonthKeysBetween(start: Date, end: Date) {
  const s = new Date(start.getFullYear(), start.getMonth(), 1);
  const e = new Date(end.getFullYear(), end.getMonth(), 1);

  const keys: string[] = [];
  let cursor = new Date(s);
  let guard = 0;

  while (cursor <= e && guard < 2000) {
    keys.push(ymKey(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    guard++;
  }
  return keys;
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

  const [cycle, setCycle] = useState<BillingCycle>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = window.localStorage.getItem("rdd2_cycle") ?? "monthly";
    return isBillingCycle(saved) ? saved : "monthly";
  });

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return window.localStorage.getItem("rdd2_amount") ?? "2000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rdd2_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rdd2_round_display"),
      true,
    );
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return parseDisplayDecimals(
      window.localStorage.getItem("rdd2_display_decimals"),
    );
  });

  const [asOfDate, setAsOfDate] = useState<string>(() => {
    const d = new Date();
    if (typeof window === "undefined") return toISODateInputValue(d);
    return window.localStorage.getItem("rdd2_asOf") ?? toISODateInputValue(d);
  });

  const [horizonMode, setHorizonMode] = useState<"years" | "end_date">(() => {
    if (typeof window === "undefined") return "years";
    const saved = window.localStorage.getItem("rdd2_horizonMode");
    return saved === "end_date" ? "end_date" : "years";
  });

  const [yearsAhead, setYearsAhead] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return window.localStorage.getItem("rdd2_yearsAhead") ?? "1";
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const d = addYears(new Date(), 1);
    if (typeof window === "undefined") return toISODateInputValue(d);
    return (
      window.localStorage.getItem("rdd2_endDate") ?? toISODateInputValue(d)
    );
  });

  const [anchorDate, setAnchorDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(Math.max(1, Math.min(28, d.getDate())));
    if (typeof window === "undefined") return toISODateInputValue(d);
    return window.localStorage.getItem("rdd2_anchor") ?? toISODateInputValue(d);
  });

  const [dueDayMonthly, setDueDayMonthly] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return window.localStorage.getItem("rdd2_dueDay") ?? "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rdd2_cycle", cycle);
      window.localStorage.setItem("rdd2_amount", amount);
      window.localStorage.setItem("rdd2_currency", currency);
      window.localStorage.setItem(
        "rdd2_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rdd2_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem("rdd2_asOf", asOfDate);
      window.localStorage.setItem("rdd2_horizonMode", horizonMode);
      window.localStorage.setItem("rdd2_yearsAhead", yearsAhead);
      window.localStorage.setItem("rdd2_endDate", endDate);
      window.localStorage.setItem("rdd2_anchor", anchorDate);
      window.localStorage.setItem("rdd2_dueDay", dueDayMonthly);
    } catch {
      // ignore
    }
  }, [
    cycle,
    amount,
    currency,
    roundDisplay,
    displayDecimals,
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

  const parsedAsOf = useMemo(() => {
    const d = new Date(asOfDate);
    if (!Number.isFinite(d.getTime())) return stripTime(new Date());
    return stripTime(d);
  }, [asOfDate]);

  const parsedAnchor = useMemo(() => {
    const d = new Date(anchorDate);
    if (!Number.isFinite(d.getTime())) return stripTime(new Date());
    return stripTime(d);
  }, [anchorDate]);

  const dueDay = useMemo(
    () => clampNum(safeParseInt(dueDayMonthly, 1), 1, 31),
    [dueDayMonthly],
  );

  const computedEnd = useMemo(() => {
    if (horizonMode === "end_date") {
      const d = new Date(endDate);
      if (!Number.isFinite(d.getTime()))
        return stripTime(addYears(parsedAsOf, 1));
      return stripTime(d);
    }
    const yrs = clampNum(safeParseInt(yearsAhead, 1), 1, 5);
    return stripTime(addYears(parsedAsOf, yrs));
  }, [horizonMode, endDate, yearsAhead, parsedAsOf]);

  const schedule = useMemo(() => {
    return buildScheduleUntilEnd(
      cycle,
      parsedAsOf,
      computedEnd,
      parsedAnchor,
      dueDay,
    );
  }, [cycle, parsedAsOf, computedEnd, parsedAnchor, dueDay]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!parsedAmount.ok)
      errors.push(parsedAmount.error ?? "Enter a valid amount.");
    if (parsedAmount.warnings.length) warnings.push(...parsedAmount.warnings);

    if (computedEnd < parsedAsOf)
      errors.push("End date must be on or after the as-of date.");

    const rentPerPaymentScaled = parsedAmount.ok
      ? (parsedAmount.scaled as bigint)
      : 0n;

    if (errors.length) {
      return { ok: false as const, errors, warnings, rentPerPaymentScaled };
    }

    const nextDue = schedule[0] ?? parsedAsOf;
    const paymentsTotal = schedule.length;

    const totalPaidScaled = rentPerPaymentScaled * BigInt(paymentsTotal);

    const monthlyKeys = makeMonthKeysBetween(parsedAsOf, computedEnd);
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
    };
  }, [parsedAmount, computedEnd, parsedAsOf, cycle, schedule]);

  // FIX: only whitelisted routes here
  const relatedLinks = [
    { href: "/rent-converter", text: "Rent converter hub" },
    {
      href: "/weekly-to-monthly-rent-converter",
      text: "Weekly to monthly rent converter",
    },
    {
      href: "/rent-paid-every-4-weeks-calculator",
      text: "Rent paid every 4 weeks calculator",
    },
  ];

  const faqData = [
    {
      q: "What does “total paid by end date” mean on this page?",
      a: "It is the number of scheduled due dates from the as-of date through the selected end date, multiplied by the rent amount you entered. It illustrates timing and cadence, not lease enforcement.",
    },
    {
      q: "Why can monthly totals vary for weekly, biweekly, or 28-day rent?",
      a: "Those cycles repeat on fixed day intervals. Some calendar months contain more due dates than others, which changes how many payments fall within a given month.",
    },
    {
      q: "How is monthly rent handled when the due day is 29 to 31?",
      a: "If the selected day does not exist in a month, the schedule places the due date on that month’s last calendar day for that cycle.",
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
      a: "No. It uses calendar dates and a simple cadence to illustrate timing. Lease terms and landlord policies can define different rules.",
    },
    {
      q: "Why can the schedule total differ from the standard annual total?",
      a: "The standard annual total uses fixed payment counts for comparison. The schedule total is a calendar-based rollup from your as-of date through the selected end date, which can span partial years.",
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
        id="calculator"
        className="mx-auto max-w-6xl px-6 pb-6 mt-4 pt-4"
      >
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Rent due date schedule and totals
            </h1>

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
            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent per payment
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000 or 2000.00"
                  className="cursor-pointer col-span-7 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedAmount.ok}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {parsedAmount.error}
                </p>
              ) : parsedAmount.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing cycle
              </label>
              <select
                value={cycle}
                onChange={(e) =>
                  setCycle(
                    isBillingCycle(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                As-of date (First Due Date)
              </label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Schedule horizon
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={horizonMode}
                  onChange={(e) =>
                    setHorizonMode(
                      e.target.value === "end_date" ? "end_date" : "years",
                    )
                  }
                  className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="years">Years ahead</option>
                  <option value="end_date">End date</option>
                </select>

                {horizonMode === "years" ? (
                  <select
                    value={yearsAhead}
                    onChange={(e) => setYearsAhead(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    {["1", "2", "3", "5"].map((y) => (
                      <option key={y} value={y}>
                        {y} {y === "1" ? "year" : "years"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {cycle === "monthly" ? "Monthly due day" : "Anchor due date"}
              </label>

              {cycle === "monthly" ? (
                <input
                  inputMode="numeric"
                  value={dueDayMonthly}
                  onChange={(e) => setDueDayMonthly(e.target.value)}
                  placeholder="e.g. 1"
                  className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Monthly due day"
                />
              ) : (
                <input
                  type="date"
                  value={anchorDate}
                  onChange={(e) => setAnchorDate(e.target.value)}
                  className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              )}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Fix the inputs to generate a schedule.
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
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Total rent paid by end date
                    </div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">
                      {fmtMoney(computed.totalPaidScaled)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
                      Next estimated due date
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {formatDate(computed.nextDue)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
                    <div className="text-xs text-slate-500">
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
                    <div className="text-xs text-slate-500">
                      Dates shown are estimates based on the selected cadence
                      and horizon.
                    </div>
                  </div>
                  <ul className="divide-y divide-slate-200 max-h-[360px] overflow-auto">
                    {schedule.length === 0 ? (
                      <li className="px-4 py-2 text-sm text-slate-600">
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
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">
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
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">
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
                              className="px-4 py-2 text-slate-600"
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
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">
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
                    <div className="text-xs text-slate-500">
                      Selected cycle (standard annual total)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.currentCycleStandardAnnualScaled)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Uses standard payment counts for comparison.
                      Calendar-based totals can differ over partial years.
                    </div>
                  </div>
                </section>

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

          <Assumptions />
        </div>

        <div className="md:col-span-12 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
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
        </div>
      </section>

      <HowItWorks relatedLinks={relatedLinks} safeHref={safeHref} />

      <section className="max-w-6xl mx-auto px-6 mt-4 hidden sm:block">
        <nav className="cursor-pointer text-sm text-slate-500 rc-no-print">
          <a href={safeHref("/")} className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
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
    </main>
  );
}
