import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Monthly Rent Converter (26-Pay vs Monthly)";
  const description =
    "Instantly convert rent paid every 14 days into a monthly amount using a true 365-day year. See the impact of 26 payments per year, compare against monthly and 28-day rent, with exact decimals, CSV export, and print-to-PDF. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "biweekly to monthly rent converter, every 2 weeks to monthly rent, convert biweekly rent to monthly, biweekly rent monthly equivalent, 26 payments per year rent, biweekly vs monthly rent, 28 day vs monthly rent",
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
        "https://www.rentconverter.com/biweekly-to-monthly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.com/biweekly-to-monthly-rent-converter",
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
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
  annual: "Annual",
};

// Internal link whitelist
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

/** Decimal-safe fixed-point (up to 12 decimals) */
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

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return { ok: false, error: "Enter a biweekly rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 1000 or 1000.50).",
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
    return { ok: false, error: "Rent must be 0 or greater.", warnings };
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

  const maxRent = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxRent);
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

function biweeklyToPeriodScaled(
  biweeklyScaled: bigint,
  period: Period,
): bigint {
  // Base: biweekly is 14 days
  const daily = mulDivScaled(biweeklyScaled, 1n, 14n);

  switch (period) {
    case "biweekly":
      return biweeklyScaled;
    case "annual":
      return mulDivScaled(daily, 365n, 1n);
    case "monthly":
      return mulDivScaled(daily, 365n, 12n);
    case "every_4_weeks":
      return mulDivScaled(daily, 28n, 1n);
    case "weekly":
      return mulDivScaled(daily, 7n, 1n);
    case "daily":
      return daily;
    case "hourly":
      return mulDivScaled(daily, 1n, 24n);
    default:
      return biweeklyScaled;
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

function validateDisplayDecimals(raw: string | null): 0 | 2 | 4 | 6 {
  const n = raw === null ? NaN : Number(raw);
  if (n === 0 || n === 2 || n === 4 || n === 6) return n;
  return 2;
}

function formatGroupedPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;
  const [intRaw, fracRaw] = s.split(".");
  const intPart = intRaw && /^\d+$/.test(intRaw) ? intRaw : "0";
  const groupedInt = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(intPart));
  if (fracRaw === undefined || fracRaw === "") return groupedInt;
  return `${groupedInt}.${fracRaw}`;
}

export default function BiweeklyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1000";
    const saved = window.localStorage.getItem("rc_btm_amount");
    return saved ?? "1000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_btm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_btm_display_decimals");
    return validateDisplayDecimals(saved);
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_btm_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_btm_amount", amount);
      window.localStorage.setItem("rc_btm_currency", currency);
      window.localStorage.setItem(
        "rc_btm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_btm_round_display",
        JSON.stringify(roundDisplay),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, displayDecimals, roundDisplay]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedBiweekly = useMemo(
    () => parseMoneyInputToScaled(amount),
    [amount],
  );
  const biweeklyScaled = parsedBiweekly.ok
    ? (parsedBiweekly.scaled as bigint)
    : 0n;
  const canShowResults = parsedBiweekly.ok;

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (parsedBiweekly.ok && parsedBiweekly.normalized) {
      return formatGroupedPreviewFromNormalized(parsedBiweekly.normalized);
    }
    return amount;
  }, [amountFocused, amount, parsedBiweekly.ok, parsedBiweekly.normalized]);

  const breakdownScaled = useMemo(() => {
    if (!parsedBiweekly.ok) return null;

    const hourly = biweeklyToPeriodScaled(biweeklyScaled, "hourly");
    const daily = biweeklyToPeriodScaled(biweeklyScaled, "daily");
    const weekly = biweeklyToPeriodScaled(biweeklyScaled, "weekly");
    const biweekly = biweeklyScaled;
    const every4w = biweeklyToPeriodScaled(biweeklyScaled, "every_4_weeks");
    const monthly = biweeklyToPeriodScaled(biweeklyScaled, "monthly");
    const annual = biweeklyToPeriodScaled(biweeklyScaled, "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

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
    };
  }, [parsedBiweekly.ok, biweeklyScaled]);

  const paymentMath = useMemo(() => {
    if (!parsedBiweekly.ok || !breakdownScaled) return null;

    const paymentsPerYear = 26n;
    const annualFromPayments = biweeklyScaled * paymentsPerYear;

    // Use mulDiv to avoid any implied rounding beyond integer division.
    const monthlyFromPayments = mulDivScaled(annualFromPayments, 1n, 12n);

    const converterMonthly = breakdownScaled.monthly;
    const deltaVsConverter = monthlyFromPayments - converterMonthly;
    const pctVsConverter =
      converterMonthly === 0n
        ? 0
        : Number(deltaVsConverter) / Number(converterMonthly);

    return {
      paymentsPerYear: Number(paymentsPerYear),
      annualFromPayments,
      monthlyFromPayments,
      deltaVsConverter,
      pctVsConverter,
    };
  }, [parsedBiweekly.ok, biweeklyScaled, breakdownScaled]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const monthlyHeadlineScaled = breakdownScaled?.monthly ?? 0n;

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

  const handleExportCsv = () => {
    if (!canShowResults || !breakdownScaled || !paymentMath) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Biweekly to Monthly Rent Converter"]));
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Biweekly=14 days",
        "Month=365 ÷ 12 days (average)",
      ]),
    );
    rows.push(buildCsvRow(["Currency formatting", currency]));
    rows.push(
      buildCsvRow([
        "Display",
        roundDisplay
          ? `Rounded to ${displayDecimals} decimals for display`
          : "No display rounding (shows up to 12 decimals)",
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Input (Biweekly)", fmt(biweeklyScaled)]));
    rows.push(buildCsvRow(["Headline (Monthly)", fmt(monthlyHeadlineScaled)]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Period", "Amount"]));
    const items: Array<[Period, bigint]> = [
      ["hourly", breakdownScaled.hourly],
      ["daily", breakdownScaled.daily],
      ["weekly", breakdownScaled.weekly],
      ["biweekly", breakdownScaled.biweekly],
      ["every_4_weeks", breakdownScaled.every4w],
      ["monthly", breakdownScaled.monthly],
      ["annual", breakdownScaled.annual],
    ];
    for (const [p, val] of items)
      rows.push(buildCsvRow([PERIOD_LABEL[p], fmt(val)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["26-payments context (illustrative)"]));
    rows.push(
      buildCsvRow(["Payments per year", String(paymentMath.paymentsPerYear)]),
    );
    rows.push(
      buildCsvRow([
        "Biweekly × 26 (annual)",
        fmt(paymentMath.annualFromPayments),
      ]),
    );
    rows.push(
      buildCsvRow([
        "(Biweekly × 26) ÷ 12 (monthly)",
        fmt(paymentMath.monthlyFromPayments),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Delta vs converter monthly",
        fmt(paymentMath.deltaVsConverter),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Delta (%) vs converter monthly",
        formatPercent(paymentMath.pctVsConverter, 2),
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(
      buildCsvRow([
        "Monthly minus 4-week",
        fmt(breakdownScaled.monthlyMinus4w),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Monthly vs 4-week difference (%)",
        formatPercent(breakdownScaled.monthlyMinus4wPct, 2),
      ]),
    );

    downloadTextFile(
      "biweekly-to-monthly-rent-converter.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does “biweekly rent” mean?",
      a: "Biweekly rent is rent paid every 14 days. That schedule is often summarized as 26 payments per year, which is why it can feel different from paying once per calendar month.",
    },
    {
      q: "How does this convert biweekly rent to a monthly equivalent?",
      a: "It converts the biweekly amount to a daily equivalent (biweekly ÷ 14), then derives a yearly total (daily × 365) and finally expresses that annual total as a monthly equivalent (annual ÷ 12).",
    },
    {
      q: "How many biweekly payments are in a year?",
      a: "A common shortcut is 26 (52 weeks ÷ 2). A day-based annual equivalence uses 365 ÷ 14 ≈ 26.07 biweekly periods, so the totals can differ slightly.",
    },
    {
      q: "Why doesn’t biweekly map neatly to calendar months?",
      a: "Because 14-day intervals drift across the calendar. Some months include two payments, and the timing can create an extra payment relative to a monthly budget.",
    },
    {
      q: "How is biweekly different from rent paid every 4 weeks?",
      a: "Biweekly is every 14 days (about 26 cycles per year). Every 4 weeks is every 28 days (13 cycles per year). Both are non-monthly schedules, but they imply different annual totals.",
    },
    {
      q: "What assumptions does this page use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Your lease may still use different billing rules.",
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
        name: "Biweekly to Monthly Rent Converter",
        item: "https://www.rentconverter.com/biweekly-to-monthly-rent-converter",
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
    name: "Biweekly to Monthly Rent Converter",
    description:
      "Convert rent paid every 14 days (biweekly) into a monthly equivalent using a 365-day year. Includes a full breakdown, 26-payments context, CSV export, and print-to-PDF.",
    url: "https://www.rentconverter.com/biweekly-to-monthly-rent-converter",
  };

  const amountInputId = "rc-btm-amount";

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .rc-tabular { font-variant-numeric: tabular-nums; }
            .rc-amount { font-variant-numeric: tabular-nums; white-space: nowrap; }
            @media print {
              .rc-no-print { display: none !important; }
              .rc-print-block { break-inside: avoid; }
              main { background: #fff !important; }
              a { text-decoration: none !important; color: #000 !important; }
            }
          `,
        }}
      />

      <section className="mt-4 rc-no-print hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm sm:text-[0.95rem] text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            Home
          </a>{" "}
          /{" "}
          <a
            href={safeHref("/rent-converter")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            Rent Converter
          </a>{" "}
          / Biweekly to Monthly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Instant biweekly to monthly conversion
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Biweekly rent amount (every 14 days)
              </label>

              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000 or 1000.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={amount.trim().length > 0 && !parsedBiweekly.ok}
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedBiweekly.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedBiweekly.error}
                </p>
              ) : parsedBiweekly.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedBiweekly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex items-center justify-between  px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.biweekly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.monthly}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block shadow-[0_1px_0_rgba(2,132,199,0.06)] relative overflow-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-sky-200/80" />
            <div className="absolute top-0 left-0 right-0 h-px bg-sky-200/80" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-800">
                  Monthly equivalent
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800 shadow-sm">
                  <div className="font-semibold">No result to show yet</div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid biweekly amount above to see the monthly
                    equivalent and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 rc-tabular leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                      <span className="rc-amount">
                        {fmt(monthlyHeadlineScaled)}
                      </span>
                    </div>
                  </div>

                  <div className=" grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdownScaled!.hourly, "hourly"],
                        ["Daily", breakdownScaled!.daily, "daily"],
                        ["Weekly", breakdownScaled!.weekly, "weekly"],
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
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm min-w-0"
                      >
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900 rc-tabular leading-tight">
                          <span className="rc-amount">{fmt(val)}</span>
                        </div>
                      </div>
                    ))}

                    {paymentMath ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3.5 shadow-sm">
                        <div className="text-xs text-slate-600">
                          26-payments context (common shortcut)
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Payments per year
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {paymentMath.paymentsPerYear}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              Common schedule count (52 weeks ÷ 2)
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Biweekly × 26, then ÷ 12
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.monthlyFromPayments)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              Shortcut monthly = (biweekly × 26) ÷ 12
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Delta vs converter monthly
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.deltaVsConverter)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              ≈{" "}
                              <span className="rc-amount">
                                {formatPercent(paymentMath.pctVsConverter, 2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          This panel is illustrative. Some leases treat biweekly
                          as a schedule count, while others effectively follow
                          day-based proration rules.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-slate-600">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm sm:text-[0.95rem] text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calculations use up to 12 decimals internally. If enabled,
                displayed values are rounded to your chosen decimals.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-600">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) =>
                  setDisplayDecimals(validateDisplayDecimals(e.target.value))
                }
                className={`mt-1 rounded-xl border bg-white px-3 py-2.5 text-sm sm:text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-sky-500 ${
                  roundDisplay
                    ? "border-slate-300"
                    : "border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                aria-label="Displayed decimals"
                disabled={!roundDisplay}
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800">
            <div className="font-semibold">
              What the monthly result represents
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
              Biweekly is treated as a 14-day amount. The tool converts to a
              daily equivalent (biweekly ÷ 14), derives annual equivalence
              (daily × 365), then expresses it as monthly (annual ÷ 12). A
              separate panel shows the common (biweekly × 26) ÷ 12 shortcut so
              you can compare interpretations.
            </p>
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
                    How the biweekly to monthly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a biweekly rent amount into a monthly
                    equivalent by normalizing the input through days, then
                    scaling it to an annual total and dividing by twelve.
                    Biweekly is treated as a fixed 14-day period. Monthly is
                    treated as an average month based on a 365-day year.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Biweekly = 14 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Monthly = annual ÷ 12
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Biweekly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily = ÷ 14
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SCALE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual = × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    FINAL
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Monthly = ÷ 12
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: core model */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    The conversion path used on this page
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The converter follows a single, explicit path so
                      assumptions do not change mid-calculation. Your biweekly
                      input is first converted into a per-day amount, then
                      expanded to an annual total, and finally divided into
                      twelve equal monthly parts.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>Daily</strong> = biweekly ÷ 14
                        </li>
                        <li>
                          <strong>Annual</strong> = daily × 365
                        </li>
                        <li>
                          <strong>Monthly</strong> = annual ÷ 12
                        </li>
                        <li>
                          Combined:{" "}
                          <strong>Monthly = biweekly × 365 ÷ (14 × 12)</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        Monthly corresponds to an average month length of 365 ÷
                        12 days.
                      </p>
                    </div>

                    <p>
                      This approach avoids treating “biweekly” as “twice per
                      month” and avoids treating “monthly” as a fixed 30-day or
                      28-day interval. Each step is derived from time length,
                      not payment counts.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why not divide by 2 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Why monthly is not biweekly × 2
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      A common shortcut is to double a biweekly amount to
                      estimate a monthly cost. That shortcut assumes a month is
                      exactly two biweekly periods (28 days). In reality,
                      calendar months average about 30.42 days.
                    </p>

                    <p>
                      If you doubled a biweekly amount, you would be comparing a
                      28-day value to a monthly label. Over a full year, that
                      shortcut produces drift. This page avoids that by
                      anchoring both sides to the same annual total before
                      computing monthly.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Biweekly definition
                        </div>
                        <p className="mt-2">
                          Biweekly always means 14 days on this page.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Monthly definition
                        </div>
                        <p className="mt-2">
                          Monthly is an average month derived from a 365-day
                          year.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: breakdown behavior */}
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
                      Once the daily rate is established, every other period is
                      derived from that same basis. Weekly uses seven days.
                      4-week uses twenty-eight days. Monthly uses an average
                      month length. Because all lines reconcile to the same
                      annual total, comparisons stay coherent.
                    </p>

                    <p>
                      The breakdown is intentionally derived from daily, not
                      from the monthly value. This prevents rounding drift and
                      avoids a situation where one line looks correct but does
                      not reconcile with the others.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: precision and exports */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Precision, ambiguity handling, and exports
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Inputs are parsed as decimal numbers. Commas are treated
                      as thousands separators. Currency symbols may be present
                      and ignored for numeric parsing. Computation uses
                      fixed-point arithmetic with preserved precision.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is interpreted as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is interpreted as 1.234
                      </li>
                      <li>
                        Edge formats such as <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>

                    <p>
                      If an input could reasonably be interpreted in more than
                      one way, the tool should show a warning or error instead
                      of producing a clean-looking but misleading result.
                    </p>

                    <p>
                      You can export the breakdown to CSV for record-keeping or
                      print the page and save it as a PDF. This section is
                      marked no-print so it does not clutter printed output.
                    </p>
                  </div>
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                    Monthly here is an average, not a billing schedule
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This page produces a monthly equivalent derived from an
                    annual total. It does not attempt to model calendar due
                    dates or payment timing. If your rent is billed every 28
                    days, that is shown as a separate 4-week line, not merged
                    into the monthly value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
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

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-10 rc-no-print">
        <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
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
