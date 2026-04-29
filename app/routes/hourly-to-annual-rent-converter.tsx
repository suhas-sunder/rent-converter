import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/hourly-to-annual-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/hourly-to-annual-rent-converter/HowItWorks";
import ToolFit from "~/client/components/hourly-to-annual-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/hourly-to-annual-rent-converter";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const meta: Route.MetaFunction = () => {
  const title = "Hourly to Annual Rent Converter | Rent Calculator";
  const description =
    "Convert hourly rent to annual rent. See the yearly amount, related breakdowns, and paid-hours comparison.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "hourly to annual rent converter, hourly rent to yearly, hourly rent annual calculator, hourly to yearly rent, annual rent from hourly, paid hours rent comparison",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: PAGE_URL },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: OG_IMAGE_URL },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE_URL },

    { tagName: "link", rel: "canonical", href: PAGE_URL },
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

  const hourlyInterpreted = useMemo(() => {
    if (!parsedHourly.ok) return null;
    return fmt(hourlyScaled);
  }, [parsedHourly.ok, hourlyScaled, currency, displayDecimals, roundDisplay]);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleCsvExport = () => {
    if (typeof window === "undefined") return;
    if (!parsedHourly.ok || !breakdownScaled) return;

    const rows: string[][] = [
      ["Hourly to Annual Rent Converter"],
      ["Input hourly amount", hourlyInterpreted ?? ""],
      ["Currency", currency],
      ["Hour mode", hourMode === "clock" ? "24/7 hours" : "Paid hours"],
      [
        "Display rounding",
        roundDisplay ? `On (${displayDecimals} decimals)` : "Off",
      ],
      [],
      ["Period", "Amount"],
      [PERIOD_LABEL.hourly, fmt(breakdownScaled.hourly)],
      [PERIOD_LABEL.daily, fmt(breakdownScaled.daily)],
      [PERIOD_LABEL.weekly, fmt(breakdownScaled.weekly)],
      [PERIOD_LABEL.biweekly, fmt(breakdownScaled.biweekly)],
      [PERIOD_LABEL.every_4_weeks, fmt(breakdownScaled.every4w)],
      [PERIOD_LABEL.monthly, fmt(breakdownScaled.monthly)],
      ["Annual (24/7 hours)", fmt(breakdownScaled.annualClock)],
    ];

    if (hourMode === "paid") {
      rows.push(
        [],
        ["Paid-hours comparison", ""],
        [
          "Paid hours per week",
          parsedPaidHours.ok ? formatNumber(parsedPaidHours.hours, 2) : "",
        ],
        ["Annual using paid hours", fmt(breakdownScaled.annualPaidScaled)],
        ["Monthly using paid hours", fmt(breakdownScaled.monthlyPaidScaled)],
        [
          "Difference vs 24/7 annual",
          fmt(breakdownScaled.annualPaidMinusClock),
        ],
        [
          "Difference percentage",
          formatPercent(breakdownScaled.annualPaidMinusClockPct, 2),
        ],
      );
    }

    rows.push(
      [],
      ["Comparison", "Amount"],
      ["Monthly minus 4-week amount", fmt(breakdownScaled.monthlyMinus4w)],
      [
        "Monthly minus 4-week percentage",
        formatPercent(breakdownScaled.monthlyMinus4wPct, 2),
      ],
    );

    const csv = rows.map(buildCsvRow).join("\n");
    downloadTextFile(
      "hourly-to-annual-rent-conversion.csv",
      csv,
      "text/csv;charset=utf-8",
    );
  };

  const faqData = [
    {
      q: "How do you convert hourly rent to annual rent?",
      a: "In 24/7 mode, the calculator multiplies the hourly amount by 24, then by 365.",
    },
    {
      q: "What is paid-hours mode?",
      a: "Paid-hours mode multiplies the hourly amount by paid hours per week, then by 52.",
    },
    {
      q: "Which mode should I use?",
      a: "Use 24/7 mode for a pure time-based rent comparison. Use paid-hours mode when the hourly amount only applies to a set number of hours per week.",
    },
    {
      q: "Will this match what a landlord charges?",
      a: "Not always. Actual charges can depend on minimum stays, billing rules, utilities, fees, and your agreement.",
    },
    {
      q: "Why does this page show monthly and 4-week amounts too?",
      a: "Those breakdowns help compare the same hourly amount against other common rent periods.",
    },
    {
      q: "Does this use leap years?",
      a: "No. The calculator uses a 365-day year for consistency.",
    },
    {
      q: "Does display rounding change the calculation?",
      a: "No. Rounding is display-only. The calculator keeps decimal precision through the calculation and only rounds shown or exported values.",
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hourly to Annual Rent Converter",
        item: PAGE_URL,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hourly to Annual Rent Converter",
    description:
      "Convert hourly rent to annual rent and compare 24/7 hours with a paid-hours scenario.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Hourly to annual rent conversion",
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
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-5 shadow-sm sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                    Hourly to yearly rent calculator
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                    Hourly to Annual Rent Converter
                  </h1>

                  <p className="mt-2 max-w-4xl text-base text-slate-600">
                    Convert an hourly rent amount into an annual amount. Use
                    24/7 hours or a paid-hours scenario.
                  </p>
                </div>

                <div
                  id="export-controls"
                  className="rc-no-print flex flex-wrap gap-2 sm:justify-end"
                >
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    Print / Save PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleCsvExport}
                    disabled={!canShowResults}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="rc-no-print rounded-xl border border-slate-200 bg-sky-50/60 px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Hour basis
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Choose whether the hourly amount applies to every clock
                      hour or only paid hours.
                    </p>
                  </div>

                  <div
                    className="inline-flex w-fit rounded-xl border border-slate-200 bg-white p-1"
                    role="tablist"
                    aria-label="Hour interpretation"
                  >
                    <button
                      type="button"
                      onClick={() => setHourMode("clock")}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        hourMode === "clock"
                          ? "bg-sky-600 text-white"
                          : "text-slate-800 hover:bg-sky-50"
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
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        hourMode === "paid"
                          ? "bg-sky-600 text-white"
                          : "text-slate-800 hover:bg-sky-50"
                      }`}
                      aria-label="Use paid-hours per week scenario"
                      role="tab"
                      aria-selected={hourMode === "paid"}
                    >
                      Paid hours
                    </button>
                  </div>
                </div>

                {hourMode === "paid" ? (
                  <div className="mt-3 max-w-sm">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Paid hours per week
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
                      className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                      aria-invalid={!parsedPaidHours.ok}
                      aria-describedby="rc-paid-hours-help rc-paid-hours-error"
                    />

                    <p
                      id="rc-paid-hours-help"
                      className="mt-2 text-xs leading-relaxed text-slate-600"
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Hourly amount
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    inputMode="decimal"
                    value={amountDisplayValue}
                    onFocus={() => setAmountFocused(true)}
                    onBlur={() => setAmountFocused(false)}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/,/g, ""))
                    }
                    placeholder="e.g. 25 or 25.50"
                    className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                    className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-hourly-help" className="mt-2 text-xs text-slate-600">
                  Enter the hourly rent amount. Currency symbols, commas, and
                  decimals are accepted.
                </p>

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
                    <div className="font-semibold">
                      Input interpretation note
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedHourly.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 shadow-sm sm:px-6 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label="Annual amount results"
            >
              <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="mt-4 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-900">
                  Annual amount
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Enter a valid hourly amount. If you choose paid-hours mode,
                    enter valid hours per week too.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                      <div className="min-h-[3.5rem] sm:min-h-[4rem]">
                        <div className="whitespace-nowrap text-3xl font-extrabold tabular-nums text-emerald-800 sm:text-5xl">
                          {fmt(displayedAnnualScaled)}
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-emerald-700">
                        {hourMode === "clock"
                          ? "Based on hourly rent multiplied by 24 hours and 365 days."
                          : "Based on hourly rent multiplied by paid hours per week and 52 weeks."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        [
                          PERIOD_LABEL.hourly,
                          breakdownScaled!.hourly,
                          "hourly",
                        ],
                        [PERIOD_LABEL.daily, breakdownScaled!.daily, "daily"],
                        [
                          PERIOD_LABEL.weekly,
                          breakdownScaled!.weekly,
                          "weekly",
                        ],
                        [
                          PERIOD_LABEL.biweekly,
                          breakdownScaled!.biweekly,
                          "biweekly",
                        ],
                        [
                          PERIOD_LABEL.every_4_weeks,
                          breakdownScaled!.every4w,
                          "every_4_weeks",
                        ],
                        [
                          PERIOD_LABEL.monthly,
                          breakdownScaled!.monthly,
                          "monthly",
                        ],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm"
                      >
                        <div className="text-xs font-medium text-slate-600">
                          {label}
                        </div>
                        <div className="mt-1 whitespace-nowrap text-lg font-bold tabular-nums text-slate-900">
                          {fmt(val)}
                        </div>
                      </div>
                    ))}

                    {hourMode === "paid" ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                        <div className="text-xs font-medium text-emerald-700">
                          Paid-hours comparison
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-600">
                              24/7 annual
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900">
                              {fmt(breakdownScaled!.annualClock)}
                            </div>
                          </div>

                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-600">
                              Paid-hours annual
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900">
                              {fmt(breakdownScaled!.annualPaidScaled)}
                            </div>
                          </div>

                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-600">
                              Difference
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900">
                              {fmt(breakdownScaled!.annualPaidMinusClock)}
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              ≈{" "}
                              {formatPercent(
                                breakdownScaled!.annualPaidMinusClockPct,
                                2,
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-slate-600">
                          Paid-hours mode uses hours per week × 52.
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
            </div>

            <Assumptions />

            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm rc-no-print">
              <div className="mb-3 text-sm font-semibold text-slate-900">
                Display rounding
              </div>

              <Rounding
                roundDisplay={roundDisplay}
                setRoundDisplay={setRoundDisplay}
                displayDecimals={displayDecimals}
                setDisplayDecimals={setDisplayDecimals as any}
              />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 rc-no-print hidden sm:block">
        <nav className="mx-auto max-w-6xl px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="cursor-pointer rounded text-sky-800 transition hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Home
          </a>{" "}
          / Hourly to Annual Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-600">
          These answers explain 24/7 annualization, paid-hours mode, and how to
          read the related breakdowns.
        </p>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 max-w-prose leading-relaxed text-slate-700">
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
