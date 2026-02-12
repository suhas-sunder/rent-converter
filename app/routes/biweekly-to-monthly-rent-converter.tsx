import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-monthly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/biweekly-to-monthly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/biweekly-to-monthly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/biweekly-to-monthly-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Monthly Rent Converter (True Monthly Cost)";
  const description =
    "See your true monthly rent from any biweekly amount. Compare 26 payments per year vs monthly and 28-day pricing with exact decimals. Free, private. Export CSV or PDF.";

  const url = `${SITE_URL}${PAGE_PATH}`;
  const ogImage = `${SITE_URL}/og-image.jpg`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "biweekly to monthly rent converter, every 2 weeks to monthly rent, true monthly rent from biweekly, 26 payments per year rent, biweekly vs monthly rent, 28 day vs monthly rent, rent biweekly to monthly",
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

  // Allow ".5" when a decimal separator exists
  if (decimalSep && intPart === "") intPart = "0";

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

    function ratioToNumber(
      numer: bigint,
      denom: bigint,
      precision = 8,
    ): number {
      if (denom === 0n) return 0;
      const p = Math.max(0, Math.min(12, Math.trunc(precision)));
      const factor = 10n ** BigInt(p);
      const scaled = (numer * factor) / denom;
      return Number(scaled) / 10 ** p;
    }

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = ratioToNumber(monthlyMinus4w, every4w, 8);

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

    function ratioToNumber(
      numer: bigint,
      denom: bigint,
      precision = 8,
    ): number {
      if (denom === 0n) return 0;
      const p = Math.max(0, Math.min(12, Math.trunc(precision)));
      const factor = 10n ** BigInt(p);
      const scaled = (numer * factor) / denom;
      return Number(scaled) / 10 ** p;
    }

    // Use mulDiv to avoid any implied rounding beyond integer division.
    const monthlyFromPayments = mulDivScaled(annualFromPayments, 1n, 12n);

    const converterMonthly = breakdownScaled.monthly;
    const deltaVsConverter = monthlyFromPayments - converterMonthly;
    const pctVsConverter = ratioToNumber(deltaVsConverter, converterMonthly, 8);

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

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does “biweekly rent” mean?",
      a: "Biweekly rent means rent due every 14 days. People often summarize this as 26 payments per year, which is why biweekly billing can feel different from paying once per calendar month.",
    },
    {
      q: "How does this convert biweekly rent to a monthly equivalent?",
      a: "The calculator converts biweekly to a daily rate (biweekly ÷ 14), annualizes it (daily × 365), then expresses that same annual total as a monthly equivalent (annual ÷ 12).",
    },
    {
      q: "How many biweekly payments are in a year?",
      a: "A common shortcut is 26 (52 weeks ÷ 2). A day-based annual equivalence uses 365 ÷ 14 ≈ 26.07 biweekly periods, so totals can differ slightly depending on which method you use.",
    },
    {
      q: "Why doesn’t biweekly map neatly to calendar months?",
      a: "Because 14-day intervals drift across the calendar. Some months include two payments, and over a year this timing can create an extra payment relative to a monthly budget.",
    },
    {
      q: "How is biweekly different from rent paid every 4 weeks?",
      a: "Biweekly is every 14 days (about 26 cycles per year). Every 4 weeks is every 28 days (13 cycles per year). Both are non-monthly schedules, but they imply different annual totals.",
    },
    {
      q: "What assumptions does this page use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month uses an average length of 365 ÷ 12 days. Results are for budgeting and comparison, not exact billing dates.",
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
        name: "Biweekly to Monthly Rent Converter",
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL, // no trailing slash
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Biweekly to Monthly Rent Converter",
    description:
      "Convert rent paid every 14 days (biweekly) into a monthly equivalent using a 365-day year. Includes a full breakdown, 26-payments context, CSV export, and print-to-PDF.",
    url: `${SITE_URL}${PAGE_PATH}`,
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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Biweekly to monthly conversion
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedBiweekly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block shadow-[0_1px_0_rgba(2,132,199,0.06)] relative overflow-hidden"
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
                          "2 weeks (14 days)",
                          breakdownScaled!.biweekly,
                          "biweekly",
                        ],
                        [
                          "4 weeks (28 days)",
                          breakdownScaled!.every4w,
                          "every_4_weeks",
                        ],
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm min-w-0"
                      >
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900 rc-tabular leading-tight">
                          <span className="rc-amount">{fmt(val)}</span>
                        </div>
                      </div>
                    ))}

                    {paymentMath ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-3 py-2">
                        <div className="text-[11px] text-slate-600">
                          26-payments context
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                            <div className="text-[11px] text-slate-600">
                              Payments per year
                            </div>
                            <div className="mt-0.5 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {paymentMath.paymentsPerYear}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-600">
                              Common count (52 ÷ 2)
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                            <div className="text-[11px] text-slate-600">
                              Shortcut monthly
                            </div>
                            <div className="mt-0.5 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.monthlyFromPayments)}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-600">
                              (Biweekly × 26) ÷ 12
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white/50 px-3 py-2">
                            <div className="text-[11px] text-slate-600">
                              Delta vs converter
                            </div>
                            <div className="mt-0.5 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.deltaVsConverter)}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-600">
                              ≈{" "}
                              <span className="rc-amount">
                                {formatPercent(paymentMath.pctVsConverter, 2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-1.5 text-[11px] text-slate-600">
                          Illustrative only. Some leases treat biweekly as a
                          schedule count; others use day-based proration.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>

          <Assumptions />
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
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

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm sm:text-[0.95rem] text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            Home
          </a>{" "}
          / Biweekly to Monthly Rent Converter
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
