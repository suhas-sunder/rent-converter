import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-annual-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/hourly-to-annual-rent-converter/HowItWorks";
import ToolFit from "~/client/components/hourly-to-annual-rent-converter/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Free Hourly/Annual Rental Rate Calculator";
  const description =
    "Convert hourly rent to rent per year. See the hourly to annual rent formula, instant result, paid-hours scenarios, and export options.";

  const url = "https://www.rentconverter.com/hourly-to-annual-rent-converter";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "hourly to annual rent, convert hourly rent to yearly, true yearly rent from hourly, hourly rent annualized, hourly to yearly rent converter, annual rent equivalent from hourly, rent hourly to annual",
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
  daily: "Daily (24 hours)",
  weekly: "Weekly (7 days)",
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
  // Convert scaled (1e12) BigInt to a JS number without casting the full scaled
  // value to Number (which can overflow even when the unscaled value is safe).
  const sign = scaled < 0n ? -1 : 1;
  const a = absBigInt(scaled);

  const intPart = a / SCALE; // unscaled integer part
  const fracPart = a % SCALE; // 0..SCALE-1

  // intPart must fit in JS safe integer to keep integer precision.
  if (intPart > MAX_SAFE_INT_FOR_NUMBER) return Number.NaN;

  const intNum = Number(intPart);
  const fracNum = Number(fracPart) / Number(SCALE);

  return sign * (intNum + fracNum);
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
      return mulDivScaled(hourlyScaled, 2080n, 365n);
    case "weekly":
      return hourlyScaled * 40n;
    case "biweekly":
      return hourlyScaled * 80n;
    case "every_4_weeks":
      return hourlyScaled * 160n;
    case "annual":
      return hourlyScaled * 2080n;
    case "monthly":
      return mulDivScaled(hourlyScaled, 2080n, 12n);
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
    if (!out.ok) {
      return {
        ok: false,
        hours: 0,
        scaled: 0n,
        error: "Enter paid hours per week (0 to 168).",
      };
    }

    const scaled = out.scaled as bigint;

    const maxScaled = 168n * SCALE;
    if (scaled > maxScaled) {
      return {
        ok: false,
        hours: 168,
        scaled: maxScaled,
        error: "Paid hours must be 168 or less.",
      };
    }

    const h = toNumberSafe(scaled);
    if (!Number.isFinite(h) || h < 0) {
      return {
        ok: false,
        hours: 0,
        scaled: 0n,
        error: "Enter paid hours per week (0 to 168).",
      };
    }

    return { ok: true, hours: h, scaled, error: "" };
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

    // Paid-hours annual: hourly * (hours/week) * 52, fully in scaled BigInt.
    // (hourlyScaled * hoursScaled) is scaled^2, so divide by SCALE to return scaled.
    const annualPaidScaled =
      parsedPaidHours.ok && parsedPaidHours.scaled
        ? (hourlyScaled * (parsedPaidHours.scaled as bigint) * 52n) / SCALE
        : 0n;

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

    const hoursPerYear = 2080;

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
    parsedPaidHours.scaled,
  ]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const displayedAnnualScaled = useMemo(() => {
    if (!breakdownScaled) return 0n;
    return hourMode === "clock"
      ? breakdownScaled.annualClock
      : breakdownScaled.annualPaidScaled;
  }, [hourMode, breakdownScaled]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How does this convert an hourly amount to annual rent?",
      a: "The main result is time-based: the hourly amount is treated as applying to every hour of the day (24 hours), then annualized over a 365-day year to produce an annual equivalent.",
    },
    {
      q: "Why does hourly-to-annual depend on assumptions about hours?",
      a: "Hourly prices can mean different things in practice. A pure time-based equivalence treats every clock hour as billable, while other contexts only apply to certain hours. This page shows both so you can see how annual totals change under different assumptions.",
    },
    {
      q: "What is the difference between 24/7 equivalence and paid-hours mode?",
      a: "24/7 equivalence uses 365 × 24 hours per year. Paid-hours mode annualizes as hourly × (paid hours per week) × 52. Both are comparison tools; real billing terms can differ.",
    },
    {
      q: "Does this represent what a landlord will actually charge in a year?",
      a: "Not necessarily. This is an annualized equivalent for comparison. Actual charges depend on minimum stays, proration rules, included utilities, fees, and the agreement.",
    },
    {
      q: "Why show monthly and 4-week amounts on an annual converter page?",
      a: "Listings mix billing periods. Showing monthly and 4-week equivalents alongside annual totals lets you compare the same value across common cycles using one consistent basis.",
    },
    {
      q: "Does this use leap years or a 365-day year?",
      a: "The calculator uses a 365-day year, 7-day weeks, and an average month length of 365 ÷ 12 days for consistent budgeting comparisons.",
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
        name: "Hourly to Annual Rent Converter",
        item: "https://www.rentconverter.com/hourly-to-annual-rent-converter",
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6"
      >
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-4">
            <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              Hourly to Annual Rent Converter
            </h1>

            <div className="flex flex-col w-full sm:ml-auto sm:max-w-[15em] rounded-xl border border-slate-200 bg-blue-50 p-4">
              <div
                className="inline-flex rounded-xl border border-slate-200 bg-white"
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
                  <label className="block text-sm font-semibold text-slate-800 ">
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
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
          </div>

          <p className="hidden md:flex w-full pb-2 text-base text-slate-600">
            Convert an hourly rent rate into an annual total instantly. Clear
            calculations, no sign-up required.
          </p>
          <div className="grid gap-5">
            <div>
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
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2.5 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus:border-sky-500"
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
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
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
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block border-l-4 border-l-sky-200"
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
                <div className="flex flex-col gap-2">
                  <div className="min-h-[3.5rem] sm:min-h-[4rem]">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                      {fmt(displayedAnnualScaled)}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily (24 hours)", breakdownScaled!.daily, "daily"],
                      ["Weekly (7 days)", breakdownScaled!.weekly, "weekly"],
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
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm"
                    >
                      <div className="text-xs font-medium text-slate-600">
                        {label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  {breakdownScaled && (
                    <FourWeekVsMonthly
                      monthlyMinus4w={breakdownScaled.monthlyMinus4w}
                      monthlyMinus4wPct={breakdownScaled.monthlyMinus4wPct}
                      fmt={fmt}
                      formatPercent={formatPercent as any}
                    />
                  )}

                  <div className="rc-no-print hidden md:flex flex-col sm:flex-row gap-2 mb-auto">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    >
                      Print / Save as PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <Assumptions />
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
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

      <HowItWorks />

      <section className="mt-8 mb-4 rc-no-print hidden sm:block">
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
