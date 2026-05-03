// weekly-to-biweekly-rent-converter.tsx
import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/weekly-to-biweekly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/weekly-to-biweekly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/weekly-to-biweekly-rent-converter/ToolFit";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Weekly to Biweekly Rent Converter | Every 2 Weeks";
  const description =
    "Convert weekly rent into rent every two weeks. See biweekly, monthly, 4-week, daily, and annual rent breakdowns.";
  const url = "https://www.rentconverter.com/weekly-to-biweekly-rent-converter";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    {
      name: "description",
      content: description,
    },
    {
      name: "keywords",
      content:
        "weekly to biweekly rent, convert weekly rent to biweekly, weekly rent every 2 weeks, weekly rent biweekly equivalent, 7 day to 14 day rent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { tagName: "link", rel: "canonical", href: url },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: url },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },
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
 * Internal link whitelist (only routes you know exist).
 * Add more only if they exist in your app.
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
  "/rent-affordability-calculator",
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

  // Context pages
  "/rent-paid-weekly-vs-monthly",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

/** Fixed-point: store up to 12 decimals exactly */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
  warnings: string[];
  error?: string;
};

function clampScaled(v: bigint, min: bigint, max: bigint): bigint {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
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

function formatPlainNumberFromScaled(
  scaled: bigint,
  fractionDigits: number,
  trimTrailingZeros: boolean,
): string {
  const digits = Math.max(0, Math.min(12, Math.trunc(fractionDigits)));
  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaled,
    digits,
    trimTrailingZeros,
  );
  const groupedInt = groupInt(intStr, group);

  let out = negative ? "-" : "";
  out += groupedInt;

  if (digits > 0 && fracStr.length > 0) {
    out += decimal + fracStr;
  } else if (!trimTrailingZeros && digits > 0) {
    out += decimal + "0".repeat(digits);
  }

  return out;
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

/**
 * Accepts: $450, 450, 450.00, .5, 12., 450,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 450 or 450.00).`,
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: `Enter a valid ${label} (misplaced minus sign).`,
        warnings,
      };
    }
    return { ok: false, error: `${label} must be 0 or greater.`, warnings };
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
    if (split.length > 2)
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };

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
    warnings.push("Value was clamped to the supported maximum.");

  return { ok: true, scaled: clamped, warnings };
}

function isAmbiguousRawOnBlur(raw: string): boolean {
  const s0 = (raw ?? "").trim();
  if (!s0) return true;

  const s = s0.replace(/\s+/g, "");
  if (/[.,]$/.test(s)) return true;

  const cleaned = s.replace(/[^\d.,]/g, "");
  if (!cleaned) return true;
  if (/[.,]$/.test(cleaned)) return true;

  return false;
}

function getRawFractionDigitsForPreview(raw: string): number | null {
  const s0 = (raw ?? "").trim();
  if (!s0) return null;

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");
  if (!s) return null;
  if (s.includes("-")) return null;

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
      if (/^\d{1,2}$/.test(after)) decimalSep = ",";
      else if (/^\d{3}$/.test(after) && /^\d{1,3}$/.test(before))
        decimalSep = null;
      else return null;
    } else {
      decimalSep = null;
    }
  }

  if (!decimalSep) return 0;

  const split = s.split(decimalSep);
  if (split.length !== 2) return null;

  const frac = split[1] ?? "";
  if (frac.length === 0) return null;

  const maxDec = Number(MAX_DECIMALS);
  return Math.max(0, Math.min(maxDec, frac.length));
}

function mulDivRound(a: bigint, num: bigint, den: bigint): bigint {
  if (den === 0n) return 0n;
  const sign =
    (a < 0n ? -1n : 1n) * (num < 0n ? -1n : 1n) * (den < 0n ? -1n : 1n);
  const aa = a < 0n ? -a : a;
  const nn = num < 0n ? -num : num;
  const dd = den < 0n ? -den : den;

  const prod = aa * nn;
  const half = dd / 2n;
  const q = (prod + half) / dd;
  return sign < 0n ? -q : q;
}

/**
 * Annual equivalence with a 365-day year.
 * For weekly/biweekly/4-week, treat as 7/14/28 day blocks.
 */
function annualizeScaled(valueScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return valueScaled;
    case "monthly":
      return valueScaled * 12n;
    case "every_4_weeks":
      return mulDivRound(valueScaled, 365n, 28n);
    case "biweekly":
      return mulDivRound(valueScaled, 365n, 14n);
    case "weekly":
      return mulDivRound(valueScaled, 365n, 7n);
    case "daily":
      return valueScaled * 365n;
    case "hourly":
      return valueScaled * 24n * 365n;
    default:
      return 0n;
  }
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "hourly") return mulDivRound(annualScaled, 1n, 365n * 24n);
  if (to === "daily") return mulDivRound(annualScaled, 1n, 365n);
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return mulDivRound(annualScaled, 1n, 12n);
  return annualScaled;
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

export default function WeeklyToBiweeklyRent() {
  const pageName = "Weekly to Biweekly Rent Converter";
  const canonicalUrl =
    "https://www.rentconverter.com/weekly-to-biweekly-rent-converter";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "450";
    return localStorage.getItem("rc_wtbw_amount") ?? "450";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_wtbw_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtbw_amount", amount);
      localStorage.setItem("rc_wtbw_currency", currency);

      // keep legacy key in sync
    } catch {}
  }, [amount, currency]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    // Source of truth: annual equivalence (365-day year)
    const annual = annualizeScaled(weekly, "weekly");

    // Target: biweekly from annual (keeps one consistent pipeline)
    const biweekly = fromAnnualScaled(annual, "biweekly");

    // Other derived values from the same annual total
    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");
    const monthly = fromAnnualScaled(annual, "monthly");

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? Number(monthlyMinus4w) / Number(fourWeeks)
        : Number.NaN;

    // Payment-count illustrations (calendar counts) vs day-based annual equivalence
    const annualFromWeekly52 = weekly * 52n;
    const annualFromBiweekly26 = biweekly * 26n;

    // Day-block expectation: biweekly ~= 2x weekly; compute exact delta
    const biweeklyDouble = weekly * 2n;
    const biweeklyDelta = biweekly - biweeklyDouble;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      biweekly,
      annual,
      hourly,
      daily,
      every_4_weeks: fourWeeks,
      monthly,
      monthlyMinus4w,
      monthlyMinus4wPct,
      annualFromWeekly52,
      annualFromBiweekly26,
      biweeklyDouble,
      biweeklyDelta,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const [amountFocused, setAmountFocused] = useState(false);
  const [amountBlurred, setAmountBlurred] = useState(false);
  const [amountBlurError, setAmountBlurError] = useState<string | null>(null);

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (!amountBlurred) return amount;
    if (amountBlurError) return amount;
    if (!parsed.ok) return amount;

    const scaled = parsed.p.scaled;
    if (scaled === undefined) return amount;

    const fd = getRawFractionDigitsForPreview(amount);
    if (fd === null) return amount;

    // bigint formatting so large values never become "" (disappear)
    return formatPlainNumberFromScaled(scaled, fd, fd === 0);
  }, [amountFocused, amountBlurred, amountBlurError, amount, parsed]);

  useEffect(() => {
    if (!amountBlurred) return;

    const trimmed = (amount ?? "").trim();
    if (!trimmed) {
      setAmountBlurError("Enter weekly rent amount.");
      return;
    }

    if (isAmbiguousRawOnBlur(amount)) {
      setAmountBlurError("That value is incomplete or ambiguous.");
      return;
    }

    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    if (!p.ok) {
      setAmountBlurError(p.error ?? "Enter a valid weekly rent amount.");
      return;
    }

    const fd = getRawFractionDigitsForPreview(amount);
    if (fd === null) {
      setAmountBlurError("That value is incomplete or ambiguous.");
      return;
    }

    setAmountBlurError(null);
  }, [amount, amountBlurred]);

  const faqData = [
    {
      q: "How do you convert weekly rent to biweekly rent?",
      a: "Weekly rent covers 7 days. Biweekly rent covers 14 days, so the basic 14-day amount is two times the weekly rent.",
    },
    {
      q: "Is biweekly rent always exactly double weekly rent?",
      a: "For a simple 7-day to 14-day conversion, yes. Lease billing, start dates, fees, or proration can still change actual payments.",
    },
    {
      q: "Why does this page also show monthly and 4-week amounts?",
      a: "Weekly, biweekly, 4-week, and monthly rent use different time periods. Showing them from the same annual basis helps compare listings clearly.",
    },
    {
      q: "Why does the monthly amount differ from the 4-week amount?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days based on 365 days divided by 12.",
    },
    {
      q: "Does this match exact lease totals when rent is due on specific dates?",
      a: "No. These are rent conversions for comparison and budgeting. Exact totals depend on payment schedules, start dates, proration rules, fees, and lease wording.",
    },
    {
      q: "What costs are included?",
      a: "Only the rent amount you enter. Utilities, parking, insurance, fees, and one-time charges are excluded unless you include them in the weekly amount.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl,
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Convert weekly rent into rent every two weeks. See biweekly, monthly, 4-week, daily, and annual rent breakdowns.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
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
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Weekly rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Weekly to Biweekly Rent Converter
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Convert weekly rent into a biweekly amount. The calculator
                  also shows monthly, 4-week, daily, and annual rent breakdowns.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
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

          <div className="mt-5 grid gap-x-5 gap-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
              </label>

              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue || amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => {
                    setAmountFocused(false);
                    setAmountBlurred(true);
                  }}
                  placeholder="e.g. 450"
                  className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-invalid={amountBlurred && !!amountBlurError}
                  aria-describedby={
                    amountBlurred && amountBlurError
                      ? "rc-wtbw-amount-error"
                      : !parsed.ok
                        ? "rc-wtbw-errors"
                        : undefined
                  }
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
                  className="cursor-pointer rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-1 text-xs text-slate-700">
                Enter the weekly rent amount you want to convert.
              </p>

              {amountBlurred && amountBlurError ? (
                <div
                  id="rc-wtbw-amount-error"
                  className="mt-2 text-sm text-rose-700 font-semibold"
                  role="alert"
                >
                  {amountBlurError}
                </div>
              ) : null}
            </div>
          </div>

          {!parsed.ok ? (
            <div
              id="rc-wtbw-errors"
              className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              role="region"
              aria-label="Results"
              aria-live="polite"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="p-5 sm:px-6">
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Fix the input to calculate biweekly rent.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                    {parsed.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                  {parsed.warnings.length ? (
                    <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {parsed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Notes</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
                role="region"
                aria-label="Results"
                aria-live="polite"
              >
                <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

                <div className="p-5 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Biweekly rent
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                      {money(computed.biweekly)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on weekly rent converted to a 14-day amount.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", computed.hourly, "hourly"],
                        ["Daily", computed.daily, "daily"],
                        ["Weekly", computed.weekly, "weekly"],
                        ["2 weeks", computed.biweekly, "biweekly"],
                        [
                          "4 weeks (28 days)",
                          computed.every_4_weeks,
                          "every_4_weeks",
                        ],
                        ["Monthly (average)", computed.monthly, "monthly"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs text-slate-700">{label}</div>
                        <div className="mt-1 text-lg font-bold text-slate-950">
                          {money(val)}
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Monthly vs every 4 weeks
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm text-slate-700">
                          Monthly minus 4-week:{" "}
                          <strong className="text-slate-950">
                            {money(computed.monthlyMinus4w)}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-700">
                          Difference:{" "}
                          <strong className="text-slate-950">
                            {Number.isFinite(computed.monthlyMinus4wPct)
                              ? safeToFixed(
                                  computed.monthlyMinus4wPct * 100,
                                  2,
                                )
                              : "N/A"}
                            %
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Assumptions />
            </>
          ) : null}
        </div>

      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav

          aria-label="Breadcrumb"
         className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
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
