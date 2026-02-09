import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-annual-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";

export const meta: Route.MetaFunction = () => {
  const title = "Hourly to Annual Rent Converter (Exact 365-Day Math)";
  const description =
    "Instantly convert an hourly rent or rate into an annual amount using a true 365-day year. Compare paid-hours scenarios, see exact decimals, and get a full breakdown with print-to-PDF. Free, private, no signup.";

  const url = "https://www.rentconverter.com/hourly-to-annual-rent-converter";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

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
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },

    {
      tagName: "link",
      rel: "canonical",
      href: url,
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
  daily: "Daily (24 hours)",
  weekly: "Weekly (7 days)",
  biweekly: "2 weeks (14 days)",
  every_4_weeks: "4 weeks (28 days)",
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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 md:mb-none sm:mb-none flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="flex w-full text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Instant hourly to annual conversion
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

              <div className="mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.hourly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.annual}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block border-l-4 border-l-sky-200"
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
                        "Monthly (average, 365 ÷ 12)",
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

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-sm">
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

                  <div className="rc-no-print mt-5 hidden md:flex flex-col sm:flex-row gap-2 mb-auto">
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
                  className="cursor-pointer h-4 w-4 accent-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
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
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                    How the hourly to annual rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts an hourly amount into an annual
                    equivalent using two clearly separated approaches. The
                    default result treats hourly as a continuous clock-hour rate
                    (24 hours per day, 365 days per year). An optional
                    paid-hours scenario shows how the result changes when hourly
                    applies only to certain hours.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Clock-hour basis
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Paid-hours optional
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Hourly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    TIME
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    × 24 × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SCENARIO
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Paid hours
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    BREAKDOWN
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    All periods shown
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: clock-hour model */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Clock-hour annual equivalence (default)
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      By default, the converter treats your hourly amount as
                      applying to every clock hour. That means one day contains
                      twenty-four applicable hours, and one year contains three
                      hundred sixty-five days.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>Daily</strong> = hourly × 24
                        </li>
                        <li>
                          <strong>Annual</strong> = daily × 365
                        </li>
                        <li>
                          Combined: <strong>Annual = hourly × 24 × 365</strong>
                        </li>
                      </ul>
                    </div>

                    <p>
                      This is the same time-length model used by daily, weekly,
                      biweekly, and monthly conversions on the site. It provides
                      a single annual basis that all other period lines can
                      reconcile to without switching assumptions.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why hourly is ambiguous */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Why hourly needs a stated assumption
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Unlike daily or weekly amounts, an hourly number does not
                      inherently describe how many hours apply per day or per
                      year. Without an assumption, there is no single correct
                      annual equivalent.
                    </p>

                    <p>
                      This page makes the assumption explicit. The default
                      treats hourly as continuous clock time. An optional
                      paid-hours scenario is shown separately so you can see how
                      a different assumption changes the result.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Clock-hour meaning
                        </div>
                        <p className="mt-2">
                          Hourly applies to every hour in the day.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Paid-hour meaning
                        </div>
                        <p className="mt-2">
                          Hourly applies only to selected hours per week.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: paid-hours scenario */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Paid-hours scenario (optional comparison)
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      If hourly does not apply to all twenty-four hours, the
                      paid-hours scenario shows an alternative annual
                      calculation based on a weekly hours assumption. This does
                      not replace the clock-hour annual. It is shown alongside
                      it.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Paid-hours formula
                      </div>
                      <p className="mt-2">
                        <strong>Annual (paid)</strong> = hourly × (hours per
                        week) × 52
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        The number of weeks is fixed at 52 for schedule
                        comparison.
                      </p>
                    </div>

                    <p>
                      This scenario is useful for seeing how sensitive the
                      annual total is to the assumed number of applicable hours.
                      It is intentionally labeled as a scenario so it is not
                      confused with the primary time-length result.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: breakdown */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    How the breakdown stays consistent
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      All breakdown values are derived from the same clock-hour
                      daily rate. Weekly, biweekly, and 4-week values use fixed
                      day counts. Monthly is derived from the annual total so
                      the year reconciles cleanly.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weekly</strong> = daily × 7
                      </li>
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                      <li>
                        <strong>4-week</strong> = daily × 28
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                    </ul>

                    <p>
                      The breakdown does not reuse the paid-hours result. That
                      scenario exists only to show contrast. The primary
                      breakdown remains anchored to clock-hour time.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: precision */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Parsing, precision, and output behavior
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Hourly input is parsed as a decimal value. Thousands
                      separators are treated as grouping characters. Currency
                      symbols may be present and are ignored for numeric
                      parsing.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> → 1234
                      </li>
                      <li>
                        <strong>1.234</strong> → 1.234
                      </li>
                      <li>
                        Edge formats such as <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>

                    <p>
                      Computation preserves precision internally, up to twelve
                      decimal places. Rounding, if enabled, affects only display
                      formatting. When disabled, additional decimals remain
                      visible so comparisons do not collapse into identical
                      values.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: printing */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Printing and saved copies
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      You can print the page or save it as a PDF using your
                      browser’s print function. This explanation section is
                      marked no-print so it does not appear in exported copies.
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                    Hourly does not imply how many hours apply
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This page separates clock-hour equivalence from paid-hour
                    scenarios so you can see the difference clearly. If you
                    compare hourly numbers across listings, make sure the same
                    assumption is being used.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
