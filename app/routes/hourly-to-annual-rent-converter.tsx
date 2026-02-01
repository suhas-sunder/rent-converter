import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-annual-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Hourly to Annual Rent Converter (Exact 365-Day Math)";
  const description =
    "Instantly convert an hourly rent or rate into an annual amount using a true 365-day year. Compare paid-hours scenarios, see exact decimals, and get a full breakdown with print-to-PDF. Free, private, no signup.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "hourly to annual rent, convert hourly rent to yearly, hourly rate to annual rent, hourly rent to annual calculator, hourly to yearly rent converter, annual rent equivalent from hourly, hourly rent annualized",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/hourly-to-annual-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: "https://www.rentconverter.com/og-image.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    { tagName: "link", rel: "canonical", href: "https://www.rentconverter.com/hourly-to-annual-rent-converter" },
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
  daily: "Daily (24 hours)",
  weekly: "Weekly (7 days)",
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
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


function groupThousandsEnUS(intStr: string): string {
  const s = String(intStr ?? "");
  if (!/^\d+$/.test(s)) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPreviewFromParsed(parsed: ParsedAmount): string {
  const normalized = parsed.normalized ?? "";
  if (!normalized) return normalized;
  const parts = normalized.split(".");
  const intPart = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";
  const grouped = groupThousandsEnUS(intPart);
  return fracPart ? `${grouped}.${fracPart}` : grouped;
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

  return out || "-";
}

function formatNumber(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(Math.max(0, Math.min(6, displayDecimals)));
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an hourly amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 25 or 25.50).",
      warnings,
    };

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
          `Interpreted "${s0}" as thousands grouping. If you meant a decimal, use a dot like "1.234".`,
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
    if (split.length > 2)
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };
  if (fracPart && !/^\d+$/.test(fracPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };

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

function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

function hourlyToPeriodScaled(hourlyScaled: bigint, period: Period): bigint {
  switch (period) {
    case "hourly":
      return hourlyScaled;
    case "daily":
      return mulDivScaled(hourlyScaled, 24n, 1n);
    case "weekly":
      return mulDivScaled(hourlyScaled, 24n * 7n, 1n);
    case "biweekly":
      return mulDivScaled(hourlyScaled, 24n * 14n, 1n);
    case "every_4_weeks":
      return mulDivScaled(hourlyScaled, 24n * 28n, 1n);
    case "annual":
      return mulDivScaled(hourlyScaled, 24n * 365n, 1n);
    case "monthly":
      return mulDivScaled(hourlyScaled, 24n * 365n, 12n);
    default:
      return hourlyScaled;
  }
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

function safeParseEnum<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (!raw) return fallback;
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

function safeParseDisplayDecimals(
  raw: string | null,
  fallback: number,
): number {
  const allowed = new Set<number>([0, 2, 4, 6]);
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : fallback;
}

export default function HourlyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    return (window.localStorage.getItem("rc_hta_amount") ?? "25").replace(
      /,/g,
      "",
    );
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_hta_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      window.localStorage.getItem("rc_hta_display_decimals"),
      2,
    );
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(
      window.localStorage.getItem("rc_hta_round_display"),
      true,
    );
  });

  const [hourMode, setHourMode] = useState<"clock" | "paid">(() => {
    if (typeof window === "undefined") return "clock";
    return safeParseEnum(
      window.localStorage.getItem("rc_hta_hour_mode"),
      ["clock", "paid"] as const,
      "clock",
    );
  });

  const [paidHoursPerWeek, setPaidHoursPerWeek] = useState<string>(() => {
    if (typeof window === "undefined") return "40";
    return (
      window.localStorage.getItem("rc_hta_paid_hours_week") ?? "40"
    ).replace(/,/g, "");
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);
  const [paidHoursFocused, setPaidHoursFocused] = useState<boolean>(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_hta_amount", amount);
      window.localStorage.setItem("rc_hta_currency", currency);
      window.localStorage.setItem(
        "rc_hta_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_hta_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem("rc_hta_hour_mode", hourMode);
      window.localStorage.setItem("rc_hta_paid_hours_week", paidHoursPerWeek);
    } catch {
      // ignore
    }
  }, [
    amount,
    currency,
    displayDecimals,
    roundDisplay,
    hourMode,
    paidHoursPerWeek,
  ]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedHourly = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const parsedPaidHours = useMemo(() => {
    const out = parseMoneyInputToScaled(paidHoursPerWeek);
    if (!out.ok)
      return {
        ok: false,
        hours: 0,
        error: "Enter paid hours per week (0 to 168).",
      };
    const h = toNumberSafe(out.scaled as bigint);
    if (!Number.isFinite(h))
      return {
        ok: false,
        hours: 0,
        error: "Enter paid hours per week (0 to 168).",
      };
    if (h < 0)
      return { ok: false, hours: 0, error: "Paid hours must be 0 or greater." };
    if (h > 168)
      return {
        ok: false,
        hours: 168,
        error: "Paid hours must be 168 or less.",
      };
    return { ok: true, hours: h, error: "" };
  }, [paidHoursPerWeek]);

  const canShowResults =
    parsedHourly.ok && (hourMode === "clock" || parsedPaidHours.ok);
  const hourlyScaled = parsedHourly.ok ? (parsedHourly.scaled as bigint) : 0n;

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (parsedHourly.ok) return formatPreviewFromParsed(parsedHourly);
    return amount;
  }, [amountFocused, amount, parsedHourly]);

  const paidHoursDisplayValue = useMemo(() => {
    if (paidHoursFocused) return paidHoursPerWeek;
    if (parsedPaidHours.ok) {
      const out = parseMoneyInputToScaled(paidHoursPerWeek);
      if (out.ok) return formatPreviewFromParsed(out);
    }
    return paidHoursPerWeek;
  }, [paidHoursFocused, paidHoursPerWeek, parsedPaidHours.ok]);

  const breakdownScaled = useMemo(() => {
    if (!parsedHourly.ok) return null;

    const hourly = hourlyScaled;
    const daily = hourlyToPeriodScaled(hourlyScaled, "daily");
    const weekly = hourlyToPeriodScaled(hourlyScaled, "weekly");
    const biweekly = hourlyToPeriodScaled(hourlyScaled, "biweekly");
    const every4w = hourlyToPeriodScaled(hourlyScaled, "every_4_weeks");
    const monthly = hourlyToPeriodScaled(hourlyScaled, "monthly");
    const annualClock = hourlyToPeriodScaled(hourlyScaled, "annual");

    const annualPaid = parsedPaidHours.ok
      ? Number(toNumberSafe(hourlyScaled)) * parsedPaidHours.hours * 52
      : 0;
    const annualPaidScaled = BigInt(Math.round(annualPaid * Number(SCALE)));

    const monthlyClock = mulDivScaled(annualClock, 1n, 12n);
    const monthlyPaidScaled = mulDivScaled(annualPaidScaled, 1n, 12n);

    const annualPaidMinusClock = annualPaidScaled - annualClock;
    const annualPaidMinusClockPct =
      annualClock === 0n
        ? 0
        : Number(annualPaidMinusClock) / Number(annualClock);

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    const hoursPerYear = 24 * 365;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annualClock,
      annualPaidScaled,
      monthlyClock,
      monthlyPaidScaled,
      annualPaidMinusClock,
      annualPaidMinusClockPct,
      monthlyMinus4w,
      monthlyMinus4wPct,
      hoursPerYear,
    };
  }, [
    parsedHourly.ok,
    hourlyScaled,
    parsedPaidHours.ok,
    parsedPaidHours.hours,
  ]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const displayedAnnualScaled = useMemo(() => {
    if (!breakdownScaled) return 0n;
    return hourMode === "clock"
      ? breakdownScaled.annualClock
      : breakdownScaled.annualPaidScaled;
  }, [hourMode, breakdownScaled]);

  const displayedMonthlyScaled = useMemo(() => {
    if (!breakdownScaled) return 0n;
    return hourMode === "clock"
      ? breakdownScaled.monthlyClock
      : breakdownScaled.monthlyPaidScaled;
  }, [hourMode, breakdownScaled]);

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

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How does this convert an hourly amount to annual rent?",
      a: "Clock-hour conversion uses annual equivalence. It treats the hourly amount as applying to every hour of the day (24 hours), then scales to a 365-day year for an annual total.",
    },
    {
      q: "Why does hourly-to-annual depend on assumptions about hours?",
      a: "Hourly quotes can mean different things. A pure time-based equivalence treats every clock hour as billable, while other contexts treat only certain hours as applicable. This page shows both to illustrate how annual totals change.",
    },
    {
      q: "What is the difference between 24/7 equivalence and paid-hours mode?",
      a: "24/7 equivalence uses 365 × 24 hours per year. Paid-hours mode annualizes as hourly × (paid hours per week) × 52. Both are comparison tools; real billing terms can differ.",
    },
    {
      q: "Does this represent what a landlord will actually charge in a year?",
      a: "It estimates an annual equivalent for comparison. Actual charges can depend on minimum stays, proration rules, included utilities, fees, and the specific agreement.",
    },
    {
      q: "Why show monthly and 4-week amounts on an annual converter page?",
      a: "Listings mix periods. Showing monthly and every-4-weeks equivalents alongside annual totals helps compare the same value across common billing cycles using one consistent basis.",
    },
    {
      q: "Does this use leap years or a 365-day year?",
      a: "It uses a 365-day year, 7-day weeks, and an average month length of 365 ÷ 12 days. This keeps the math consistent for budgeting comparisons.",
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
        name: "Hourly to Annual Rent Converter",
        item: "https://www.rentconverter.com/hourly-to-annual-rent-converter",
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
    name: "Hourly to Annual Rent Converter",
    description:
      "Convert an hourly rent or rate into an annual rent equivalent using a 365-day year (annual equivalence). Includes a full breakdown and a paid-hours scenario comparison, plus printing.",
    url: "https://www.rentconverter.com/hourly-to-annual-rent-converter",
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
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            Home
          </a>{" "}
          / Hourly to Annual Rent Converter
        </nav>
      </section>

      <section className="flex flex-col pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Hourly to Annual Rent Converter
        </h1>
        <p className="text-slate-700 max-w-5xl mx-auto text-lg leading-relaxed">
          Convert an hourly amount into an annual rent equivalent using annual
          equivalence as the source of truth. If “hourly” can mean “paid hours
          only,” you can switch to a paid-hours scenario to see how the assumed
          hours change the annual total.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-auto">
              Instant hourly to annual conversion
            </h2>
            <div className="ml-auto max-w-xl rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">
                Hour interpretation
              </div>
              <div
                className="inline-flex rounded-xl border border-slate-200 bg-white p-1"
                role="tablist"
                aria-label="Hour interpretation"
              >
                <button
                  type="button"
                  onClick={() => setHourMode("clock")}
                  className={`cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 ${
                    hourMode === "clock"
                      ? "bg-sky-600 text-white"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-label="Use 24/7 clock-hour equivalence"
                  role="tab"
                  aria-selected={hourMode === "clock"}
                >
                  24/7 hours
                </button>
                <button
                  type="button"
                  onClick={() => setHourMode("paid")}
                  className={`cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 ${
                    hourMode === "paid"
                      ? "bg-sky-600 text-white"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-label="Use paid-hours per week scenario"
                  role="tab"
                  aria-selected={hourMode === "paid"}
                >
                  Paid hours
                </button>
              </div>

              {hourMode === "paid" ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Paid hours per week (scenario)
                  </label>
                  <input
                    inputMode="decimal"
                    value={paidHoursDisplayValue}
                    onFocus={() => setPaidHoursFocused(true)}
                    onBlur={() => setPaidHoursFocused(false)}
                    onChange={(e) =>
                      setPaidHoursPerWeek(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 40"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                    aria-invalid={!parsedPaidHours.ok}
                    aria-describedby="rc-paid-hours-help rc-paid-hours-error"
                  />
                  <p
                    id="rc-paid-hours-help"
                    className="mt-2 text-sm text-slate-600 leading-relaxed"
                  >
                    Range: 0 to 168 hours per week.
                  </p>
                  {!parsedPaidHours.ok ? (
                    <p
                      id="rc-paid-hours-error"
                      className="mt-1 text-sm font-semibold text-rose-700"
                      role="alert"
                      aria-live="assertive"
                    >
                      {parsedPaidHours.error}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="rc-no-print mt-5 flex flex-col sm:flex-row gap-2 mb-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Hourly amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value.replace(/,/g, ""))}
                  placeholder="e.g. 25 or 25.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                  aria-invalid={!parsedHourly.ok}
                  aria-describedby="rc-hourly-help rc-hourly-error"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedHourly.ok ? (
                <p
                  id="rc-hourly-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {parsedHourly.error}
                </p>
              ) : parsedHourly.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedHourly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Display settings
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-600">From</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-600">To</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block border-l-4 border-l-sky-200"
            aria-live="polite"
            role="region"
            aria-label="Annual equivalent results"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Annual equivalent
              </div>
            </div>

            {!canShowResults ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Enter a valid hourly amount. If you choose paid-hours mode,
                  enter a valid hours-per-week value too.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="min-h-[3.5rem] sm:min-h-[4rem]">
                    <div className="text-4xl sm:text-5xl font-extrabold text-sky-900 tabular-nums whitespace-nowrap">
                      {fmt(displayedAnnualScaled)}
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="tabular-nums whitespace-nowrap">
                      {fmt(hourlyScaled)}
                    </span>{" "}
                    hourly ≈{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {fmt(displayedAnnualScaled)}
                    </strong>{" "}
                    annual{" "}
                    {hourMode === "clock"
                      ? "(24/7 equivalence)"
                      : "(paid-hours scenario)"}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    Implied monthly equivalent:{" "}
                    <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                      {fmt(displayedMonthlyScaled)}
                    </strong>{" "}
                    monthly (annual ÷ 12)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("annual", fmt(displayedAnnualScaled))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    >
                      {copiedKey === "annual" ? "Copied" : "Copy annual amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Hourly: ${fmt(hourlyScaled)} | Annual: ${fmt(displayedAnnualScaled)} | Mode: ${
                            hourMode === "clock"
                              ? "24/7 (365×24)"
                              : `paid-hours (${formatNumber(parsedPaidHours.ok ? parsedPaidHours.hours : 0, 2)} hrs/week × 52)`
                          }`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span className="self-center text-sm font-semibold text-rose-700">
                        Copy failed
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily (24 hours)", breakdownScaled!.daily, "daily"],
                      ["Weekly (7 days)", breakdownScaled!.weekly, "weekly"],
                      [
                        "Every 2 weeks (14 days)",
                        breakdownScaled!.biweekly,
                        "biweekly",
                      ],
                      [
                        "Every 4 weeks (28 days)",
                        breakdownScaled!.every4w,
                        "every_4_weeks",
                      ],
                      [
                        "Monthly (average, 365 ÷ 12)",
                        breakdownScaled!.monthly,
                        "monthly",
                      ],
                      [
                        "Annual (24/7 equivalence)",
                        breakdownScaled!.annualClock,
                        "annual",
                      ],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="text-xs font-medium text-slate-600">
                        {label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-xs font-medium text-slate-600">
                        Paid-hours scenario comparison (annual totals)
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          24/7 equivalence
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.annualClock)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          {breakdownScaled!.hoursPerYear} hours/year
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          Paid-hours annualized
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.annualPaidScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          {parsedPaidHours.ok
                            ? formatNumber(parsedPaidHours.hours, 2)
                            : "-"}{" "}
                          hours/week × 52
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs font-medium text-slate-600">
                          Difference
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.annualPaidMinusClock)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          ≈{" "}
                          {formatPercent(
                            breakdownScaled!.annualPaidMinusClockPct,
                            2,
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      Clock-hour conversion is the consistent time-based
                      equivalence across this site. Paid-hours mode is a
                      scenario illustration for cases where the hourly amount
                      applies only to certain hours.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-sky-600"
                        aria-hidden="true"
                      />
                      <div className="text-xs font-medium text-slate-600">
                        Monthly vs 4-week context
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Monthly minus 4-week:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {fmt(breakdownScaled!.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Difference:{" "}
                        <strong className="text-slate-900 tabular-nums whitespace-nowrap">
                          {formatPercent(breakdownScaled!.monthlyMinus4wPct, 2)}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). These are different periods, so
                      equivalents can diverge.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 text-sm text-slate-600 leading-relaxed">
            24/7 hours uses a pure time-based equivalence. Paid hours shows a
            scenario where the hourly amount applies only to a chosen number of
            hours per week.
          </div>

          <p className="mt-6 text-sm text-slate-600 leading-relaxed">
            Assumptions: year = 365 days, day = 24 hours, week = 7 days,
            biweekly = 14 days, 4-week = 28 days, month = 365 ÷ 12 days
            (average). Exact billing depends on the agreement.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-slate-600">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4 accent-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Calculations use up to 12 decimals internally. If enabled,
                displayed values are rounded to your chosen decimals.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-600">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setDisplayDecimals(
                    n === 0 || n === 2 || n === 4 || n === 6 ? n : 2,
                  );
                }}
                className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
                aria-label="Displayed decimals"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800">
            <div className="font-semibold">Math basis</div>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              Clock-hour equivalence uses 365 days × 24 hours. Paid-hours mode
              uses hours/week × 52 as a scenario illustration.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-800 leading-relaxed">
            <li>
              <strong>You enter an hourly amount.</strong> The page parses the
              input in a decimal-safe way (up to 12 decimals).
            </li>
            <li>
              <strong>Clock-hour equivalence converts through time.</strong>{" "}
              Daily = hourly × 24, annual = daily × 365, monthly = annual ÷ 12.
            </li>
            <li>
              <strong>Other periods share the same basis.</strong> Weekly,
              biweekly, and 4-week values are derived from day counts so the
              breakdown stays consistent.
            </li>
            <li>
              <strong>
                Paid-hours mode is a scenario, not a different basis.
              </strong>{" "}
              Annual (paid) = hourly × (hours/week) × 52. This illustrates how
              the assumed number of applicable hours changes annual totals when
              hourly does not mean “24/7.”
            </li>
            <li>
              <strong>Printing.</strong> You can print the page to save as a
              PDF.
            </li>
          </ol>
        </div>

        <p className="mt-4 text-slate-800 leading-relaxed">
          Related pages:{" "}
          <a
            href={safeHref("/rent-converter")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            rent converter
          </a>
          ,{" "}
          <a
            href={safeHref("/monthly-to-hourly-rent-converter")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            monthly to hourly rent
          </a>
          , and{" "}
          <a
            href={safeHref("/how-much-rent-can-i-afford-calculator")}
            className="text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            fees, proration, taxes, and obligations vary by location, landlord,
            and contract terms. Review your agreement for the rules that apply
            to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            real payment schedule, due dates, and fees in your agreement.
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
