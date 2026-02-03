import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Annual to Monthly Rent Converter (Exact ÷ 12 + 28-Day Check)";
  const description =
    "Instantly convert annual rent to a true monthly amount (annual ÷ 12). Compare against 4-week (28-day) rent, 12 vs 13 payments per year, with exact decimals, CSV export, and print-to-PDF. Free and private.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to monthly rent, yearly to monthly rent, annual ÷ 12, annual rent to monthly calculator, 4 week rent vs monthly, 28 day rent vs monthly, 12 vs 13 payments per year, rent converter annual to monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/annual-to-monthly-rent-converter",
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
      href: "https://www.rentconverter.com/annual-to-monthly-rent-converter",
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
  monthly: "Monthly (annual ÷ 12)",
  annual: "Annual",
};

// Whitelist rule (single source of truth)
//
// Use this everywhere you create internal links.
// If a link is not in ROUTE_WHITELIST, it must not appear anywhere in the UI.
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

/**
 * Decimal-safe fixed-point representation
 * - Parse money-like inputs into scaled integers (BigInt).
 * - Do not round during computation.
 * - Allow display rounding only (explicit and labeled).
 */
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
    return { ok: false, error: "Enter an annual rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 24000 or 24000.50).",
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
      // Intent of this route: monthly budgeting view = annual ÷ 12
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
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  if (t === 0 || t === 2 || t === 4 || t === 6) return t;
  return 2;
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

export default function AnnualToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "24000";
    const saved = window.localStorage.getItem("rc_atm_amount");
    return saved ?? "24000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_atm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    return validateDisplayDecimals(
      window.localStorage.getItem("rc_atm_display_decimals"),
    );
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_atm_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_atm_amount", amount);
      window.localStorage.setItem("rc_atm_currency", currency);
      window.localStorage.setItem(
        "rc_atm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_atm_round_display",
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

  const canShowResults = parsedAnnual.ok;

  const breakdownScaled = useMemo(() => {
    if (!parsedAnnual.ok) return null;

    const hourly = annualToPeriodScaled(annualScaled, "hourly");
    const daily = annualToPeriodScaled(annualScaled, "daily");
    const weekly = annualToPeriodScaled(annualScaled, "weekly");
    const biweekly = annualToPeriodScaled(annualScaled, "biweekly");
    const every4w = annualToPeriodScaled(annualScaled, "every_4_weeks");
    const monthly = annualToPeriodScaled(annualScaled, "monthly");
    const annual = annualScaled;

    // 12 vs 13 payment schedule context
    const annualFromMonthly12 = monthly * 12n;
    const annualFrom4w13 = every4w * 13n;
    const annualFromWeekly52 = weekly * 52n;

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    const annualDiff_13vs12 = annualFrom4w13 - annualFromMonthly12;
    const annualDiff_13vs12Pct =
      annualFromMonthly12 === 0n
        ? 0
        : Number(annualDiff_13vs12) / Number(annualFromMonthly12);

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

      annualFromMonthly12,
      annualFrom4w13,
      annualFromWeekly52,

      annualDiff_13vs12,
      annualDiff_13vs12Pct,
    };
  }, [parsedAnnual.ok, annualScaled]);

  const fmt = (scaled: bigint) =>
    roundDisplay
      ? formatCurrencyFromScaled(scaled, currency, true, displayDecimals)
      : formatCurrencyFromScaled(scaled, currency, false, displayDecimals);

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
    if (!canShowResults || !breakdownScaled) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Annual to Monthly Rent Converter"]));
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Month=annual ÷ 12 (budgeting view)",
        "4-week=28 days (13 cycles/year)",
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

    rows.push(buildCsvRow(["Input (Annual)", fmt(annualScaled)]));
    rows.push(buildCsvRow(["Headline (Monthly)", fmt(monthlyHeadlineScaled)]));
    rows.push(buildCsvRow(["Monthly definition", "Annual ÷ 12"]));
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
    for (const [p, val] of items) {
      rows.push(buildCsvRow([PERIOD_LABEL[p], fmt(val)]));
    }

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

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Annualization context (illustrative)"]));
    rows.push(
      buildCsvRow(["Monthly × 12", fmt(breakdownScaled.annualFromMonthly12)]),
    );
    rows.push(
      buildCsvRow(["4-week × 13", fmt(breakdownScaled.annualFrom4w13)]),
    );
    rows.push(
      buildCsvRow(["Weekly × 52", fmt(breakdownScaled.annualFromWeekly52)]),
    );
    rows.push(
      buildCsvRow([
        "13 vs 12 difference",
        fmt(breakdownScaled.annualDiff_13vs12),
      ]),
    );
    rows.push(
      buildCsvRow([
        "13 vs 12 difference (%)",
        formatPercent(breakdownScaled.annualDiff_13vs12Pct, 2),
      ]),
    );

    downloadTextFile(
      "annual-to-monthly-rent-converter.csv",
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
      q: "How do you convert annual rent to monthly rent on this page?",
      a: "This page uses a monthly budgeting view: monthly = annual ÷ 12. It treats your annual total as the source of truth and shows the equivalent monthly amount for comparison.",
    },
    {
      q: "Is monthly rent always annual rent ÷ 12?",
      a: "It’s a common way to compare costs. Real leases can be based on calendar dates, prorations, and due-date rules. This calculator shows the annual-equivalent monthly amount (annual ÷ 12) for budgeting and comparison.",
    },
    {
      q: "Why does 4-week (28-day) rent differ from monthly rent?",
      a: "A 4-week cycle is 28 days and often results in 13 payments per year, while monthly is typically 12 payments per year. Different period lengths lead to different annual totals even if a listing sounds similar.",
    },
    {
      q: "What assumptions does this converter use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, 4-week = 28 days, and monthly uses annual ÷ 12 as the budgeting equivalent. Outputs are for comparison, not a promise of exact due dates.",
    },
    {
      q: "Does this tool include utilities, fees, taxes, or deposits?",
      a: "No. It does not guess what is included. Enter the annual total you want to treat as rent for your budgeting comparison.",
    },
    {
      q: "Does this convert currencies or exchange rates?",
      a: "No. Currency selection only changes formatting. Convert currencies elsewhere before using this tool if needed.",
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
        name: "Annual to Monthly Rent Converter",
        item: "https://www.rentconverter.com/annual-to-monthly-rent-converter",
      },
    ],
  };

  const annualInterpreted = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    return fmt(annualScaled);
  }, [parsedAnnual.ok, annualScaled, currency, roundDisplay, displayDecimals]);

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

      <section className="mt-4 rc-no-print hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <SafeLink href="/" className="hover:underline">
            Home
          </SafeLink>{" "}
          / Annual to Monthly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:px-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl capitalize sm:text-4xl text-sky-800 font-bold">
              Instant annual to monthly converter
            </h2>

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
                Annual rent total
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountInputValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  placeholder="e.g. 24000 or 24000.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

              {!parsedAnnual.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedAnnual.error}
                </p>
              ) : parsedAnnual.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAnnual.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {parsedAnnual.ok && annualInterpreted ? (
                <p className="mt-2 text-xs text-slate-600">
                  Interpreting your annual total as{" "}
                  <span className="font-semibold text-slate-800">
                    {annualInterpreted}
                  </span>
                </p>
              ) : null}

              {!amountFocused && parsedAnnual.ok && amountPreview ? (
                <p className="mt-1 text-xs text-slate-500">
                  Preview (grouped){" "}
                  <span className="font-semibold text-slate-700">
                    {amountPreview}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display settings
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            <div className="text-sm text-slate-600">Monthly equivalent</div>

            {!canShowResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid annual rent total above to see the monthly
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(monthlyHeadlineScaled)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(annualScaled)} annual ≈{" "}
                    <strong>{fmt(monthlyHeadlineScaled)}</strong> per month
                    (annual ÷ 12)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("monthly", fmt(monthlyHeadlineScaled))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "monthly"
                        ? "Copied"
                        : "Copy monthly amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Annual: ${fmt(annualScaled)} | Monthly (annual ÷ 12): ${fmt(
                            monthlyHeadlineScaled,
                          )} | Assumptions: 365-day year, monthly=annual/12`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
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
                        "Monthly (annual ÷ 12)",
                        breakdownScaled!.monthly,
                        "monthly",
                      ],
                      ["Annual", breakdownScaled!.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      4-week vs monthly comparison
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week{" "}
                        <strong className="text-slate-900">
                          {fmt(breakdownScaled!.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference{" "}
                        <strong className="text-slate-900">
                          {formatPercent(breakdownScaled!.monthlyMinus4wPct, 2)}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      4-week is 28 days. “Monthly” here is annual ÷ 12.
                      Different lengths lead to different equivalents and can
                      change annual totals.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annualization context (12 vs 13 payments)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Monthly × 12
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualFromMonthly12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Typical monthly schedule
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          4-week × 13
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualFrom4w13)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common 28-day schedule
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Difference</div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualDiff_13vs12)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {formatPercent(
                            breakdownScaled!.annualDiff_13vs12Pct,
                            2,
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      This panel is illustrative. It shows how “monthly” (12)
                      and “every 4 weeks” (13) schedules can imply different
                      annual totals even when a listing feels similar.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Avoid misleading interpretations
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      This tool shows equivalents for budgeting and comparison.
                      It does not predict your lease due dates, prorations, or
                      what is included in rent. If your annual total includes
                      fees or utilities, the equivalents include them too.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: year = 365 days, week = 7 days, biweekly = 14 days,
            4-week = 28 days. This page defines monthly as annual ÷ 12
            (budgeting equivalent). Actual due dates and totals can differ by
            lease schedule, proration rules, fees, and what is included in rent.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 rc-no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Calculations use up to 12 decimals internally. If enabled,
                displayed values are rounded to your chosen decimals.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-500">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value));
                  setDisplayDecimals(
                    v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                  );
                }}
                className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Displayed decimals"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold">
              What “monthly” means on this page
            </div>
            <p className="mt-1 text-xs text-slate-600">
              This route is a monthly budgeting view{" "}
              <strong>monthly = annual ÷ 12</strong>. It is not a calendar-date
              proration tool. If your lease charges every 28 days (4-week
              cycle), the annual total can differ because that schedule usually
              has 13 payments per year.
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
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    How the annual to monthly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page answers one simple input-to-output question: you
                    enter an annual rent total and get the monthly budgeting
                    equivalent using{" "}
                    <span className="font-semibold text-slate-900">
                      annual ÷ 12
                    </span>
                    . A full breakdown is also shown so you can compare the same
                    annual basis against weekly, biweekly, daily, hourly, and a
                    4-week (28-day) schedule without switching tools.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Monthly = annual ÷ 12
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    28-day comparison shown
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual total
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    PRIMARY
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual ÷ 12
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    BREAKDOWN
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Same annual basis
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    EXTRA
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    28-day schedule line
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: what it does */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        What the monthly result represents
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The monthly number on this route is the simplest budgeting
                      interpretation: the annual total divided into twelve equal
                      parts. If you enter{" "}
                      <span className="font-semibold text-slate-900">
                        $24,000
                      </span>
                      , the monthly equivalent is{" "}
                      <span className="font-semibold text-slate-900">
                        $24,000 ÷ 12 = $2,000
                      </span>
                      .
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Primary formula
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Monthly equivalent
                        </span>{" "}
                        = annual rent ÷ 12
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is the primary result on this page. It is a
                        budgeting split, not a day-based equivalence.
                      </p>
                    </div>

                    <p>
                      The breakdown is there so you can compare the same annual
                      basis against other listing periods. Weekly, daily, and
                      hourly lines are shown as time-length equivalents derived
                      from a 365-day year so the breakdown stays internally
                      consistent.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: 28-day clarification */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M12 5v14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        4-week (28-day) versus monthly, kept visible on purpose
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      If a listing is billed “every 4 weeks” or “every 28 days,”
                      it is not a monthly schedule. A 28-day cycle repeats 13
                      times in a year. That can produce a different implied
                      annual total than a monthly price that looks similar at a
                      glance.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Example annualization
                        </div>
                        <p className="mt-2">
                          If a listing says{" "}
                          <span className="font-semibold text-slate-900">
                            $2,000 every 4 weeks
                          </span>
                          , a simple annualization is{" "}
                          <span className="font-semibold text-slate-900">
                            $2,000 × 13 = $26,000
                          </span>
                          .
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Why it’s separate
                        </div>
                        <p className="mt-2">
                          The 4-week line is labeled explicitly so it is not
                          confused with the monthly budgeting split (annual ÷
                          12).
                        </p>
                      </div>
                    </div>

                    <p>
                      This page does not try to pick the “right” schedule. It
                      keeps the 28-day interval visible so comparisons stay
                      honest.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: parsing + decimals */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Input parsing rules and precision behavior
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Inputs are treated as numeric amounts. Thousands
                      separators (commas) are interpreted as grouping, not
                      decimals. If you type{" "}
                      <span className="font-semibold text-slate-900">
                        1,234
                      </span>
                      , it is interpreted as 1234. If you meant one point two
                      three four, type{" "}
                      <span className="font-semibold text-slate-900">
                        1.234
                      </span>
                      .
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Accepted numeric formats
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Decimals:{" "}
                          <span className="font-semibold text-slate-900">
                            1200.50
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            .5
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            12.
                          </span>
                        </li>
                        <li>
                          Grouping:{" "}
                          <span className="font-semibold text-slate-900">
                            1,200
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            1,200.50
                          </span>
                        </li>
                        <li>
                          Currency symbols may be present and ignored for
                          parsing:{" "}
                          <span className="font-semibold text-slate-900">
                            $1,200.50
                          </span>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        If an input format is ambiguous, the correct behavior is
                        a warning or error instead of a guessed value.
                      </p>
                    </div>

                    <p>
                      Decimals are preserved through the calculation. Any
                      rounding you see should be display-only so comparisons do
                      not collapse into identical results.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: step-by-step + related tool */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        How it works on this route
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong className="text-slate-900">
                          Enter an annual rent total.
                        </strong>{" "}
                        The tool treats your number as the single source value
                        and does not add or remove anything.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Compute monthly as annual ÷ 12.
                        </strong>{" "}
                        This is the primary output and matches the page title
                        and intent.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Compute breakdown lines from the same annual basis.
                        </strong>{" "}
                        Time-length equivalents use a 365-day model so daily,
                        weekly, and hourly reconcile back to the same annual
                        number.
                      </li>
                      <li>
                        <strong className="text-slate-900">
                          Show 4-week (28-day) explicitly.
                        </strong>{" "}
                        A 28-day schedule is a different interval and is not
                        merged into “monthly.”
                      </li>
                    </ol>

                    <div className="mt-5 rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Related tool
                      </div>
                      <p className="mt-2">
                        If you need conversions in other directions, use the
                        general converter.
                      </p>
                      <div className="mt-3 text-sm">
                        <SafeLink
                          href="/rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Rent converter →
                        </SafeLink>
                      </div>
                    </div>
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    Monthly here is a budgeting split, not a 30-day assumption
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The monthly headline result is annual ÷ 12. Day-based
                    equivalents in the breakdown use a 365-day model for
                    consistency. A 4-week (28-day) schedule is shown separately
                    because it is a different billing interval and often
                    annualizes differently.
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

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and simplified
            models). Results are estimates, not guarantees.
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
            use standard time-period assumptions, including a 365-day year.
            Always confirm payment schedules and lease terms in your rental
            agreement.
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
    </main>
  );
}
