import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/weekly-to-annual-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/weekly-to-annual-rent-converter/HowItWorks";
import ToolFit from "~/client/components/weekly-to-annual-rent-converter/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Weekly to Annual Rent Converter | Yearly Rent";
  const description =
    "Convert weekly rent into an annual rent amount using a 365-day year. See monthly, 4-week, daily, and hourly breakdowns.";
  const url = "https://www.rentconverter.com/weekly-to-annual-rent-converter";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "weekly to annual rent, convert weekly rent to annual, weekly rent yearly total, weekly rent annualized, weekly rent per year",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { tagName: "link", rel: "canonical", href: url },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
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

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
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
 * Internal link whitelist (only routes you know exist).
 * IMPORTANT: Keep route slugs consistent everywhere (canonical/og/url/schema/whitelist/links).
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

/** Fixed-point math (store up to 12 decimal places exactly) */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
  decimals?: number;
  warnings: string[];
  error?: string;
};

function clampScaled(v: bigint, min: bigint, max: bigint): bigint {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

// JS Number has 53-bit integer precision. Roughly 9e15 for exact integers.
// This is a limit on the unscaled value. We compare against scaled by multiplying by SCALE.
const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n; // ~9e15

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
}

function toNumberSafe(scaled: bigint): number {
  const a = absBigInt(scaled);
  const limit = MAX_SAFE_INT_FOR_NUMBER * SCALE;
  if (a > limit) return Number.NaN;
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

/**
 * Formats a scaled number for the input preview without converting to Number.
 * This prevents "disappearing" values when the scaled bigint is large.
 */
function formatNumberFromScaledForInput(
  scaled: bigint,
  decimals: number,
): string {
  const { group, decimal } = getNumberSeparators();
  const d = Math.max(0, Math.min(12, Math.trunc(decimals)));
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaled,
    d,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  if (d === 0) return `${negative ? "-" : ""}${groupedInt}`;
  // Always show exactly d digits for input preview to reflect what the user typed.
  return `${negative ? "-" : ""}${groupedInt}${decimal}${fracStr.padEnd(
    d,
    "0",
  )}`;
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

function formatPreviewFromParsedScaled(p: ParsedScaled): string {
  if (!p.ok || p.scaled === undefined) return "";
  const dec = Math.max(0, Math.min(12, Math.trunc(p.decimals ?? 0)));
  return formatNumberFromScaledForInput(p.scaled, dec);
}

/**
 * Accepts: $550, 550, 550.00, .5, 12., 550,50 (comma decimal).
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
      error: `Enter a valid ${label} (example: 550 or 550.00).`,
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
  const decimals = fracCapped.length;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxVal = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxVal);
  if (clamped !== scaled)
    warnings.push("Value was clamped to the supported maximum.");

  return { ok: true, scaled: clamped, decimals, warnings };
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

function formatPercentFromRatioScaled(
  deltaScaled: bigint,
  baseScaled: bigint,
  decimals: number,
): string {
  if (baseScaled === 0n) return "-";

  const d = Math.max(0, Math.min(6, Math.trunc(decimals)));
  const factor = 10n ** BigInt(d);

  // percent = (delta/base)*100
  // scaledInt = percent * factor, rounded
  const scaledInt = mulDivRound(deltaScaled * 100n * factor, 1n, baseScaled);

  const negative = scaledInt < 0n;
  const a = absBigInt(scaledInt);
  const intPart = a / factor;
  const fracPart = a % factor;

  if (d === 0) return `${negative ? "-" : ""}${intPart.toString()}`;
  return `${negative ? "-" : ""}${intPart.toString()}.${fracPart
    .toString()
    .padStart(d, "0")}`;
}

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
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return annualScaled / 12n;
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

export default function WeeklyToAnnualRent() {
  const pageName = "Weekly to Annual Rent Converter";
  const canonicalUrl =
    "https://www.rentconverter.com/weekly-to-annual-rent-converter";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "550";
    return localStorage.getItem("rc_wta_amount") ?? "550";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_wta_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wta_amount", amount);
      localStorage.setItem("rc_wta_currency", currency);

      // Optional: keep old key in sync so you do not break any older code paths.
    } catch {}
  }, [amount, currency]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const amountDisplayValue = useMemo(() => {
    if (isAmountFocused) return amount;
    if (parsed.ok) return formatPreviewFromParsedScaled(parsed.p);
    return amount;
  }, [amount, isAmountFocused, parsed.ok, parsed.p]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    // Source of truth: annual equivalence (365-day year), starting from weekly.
    const annual = annualizeScaled(weekly, "weekly");

    // Derive other periods from the same annual total
    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const biweekly = fromAnnualScaled(annual, "biweekly");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");
    const monthly = fromAnnualScaled(annual, "monthly");

    // Payment-count interpretations
    const annualIf52Payments = weekly * 52n;
    const annualIf53Payments = weekly * 53n;

    const delta52 = annual - annualIf52Payments;
    const pct52 =
      annualIf52Payments !== 0n
        ? toNumberSafe(delta52) / toNumberSafe(annualIf52Payments)
        : Number.NaN;

    const delta53 = annual - annualIf53Payments;
    const pct53 =
      annualIf53Payments !== 0n
        ? toNumberSafe(delta53) / toNumberSafe(annualIf53Payments)
        : Number.NaN;

    const monthlyMinus4w = monthly - fourWeeks;

    const impliedWeeksPerYear =
      toNumberSafe(weekly) > 0
        ? toNumberSafe(annual) / toNumberSafe(weekly)
        : Number.NaN;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      annual,
      hourly,
      daily,
      biweekly,
      fourWeeks,
      monthly,
      annualIf52Payments,
      annualIf53Payments,
      delta52,
      pct52,
      delta53,
      pct53,
      monthlyMinus4w,
      impliedWeeksPerYear,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do I convert weekly rent to annual rent?",
      a: "Convert the weekly amount to a daily rate, then multiply by 365. This gives an annual rent amount on a 365-day basis.",
    },
    {
      q: "Why is weekly rent multiplied by 52 sometimes different?",
      a: "Weekly rent multiplied by 52 assumes exactly 52 weekly payments. A 365-day year is about 52.14 weeks, so a day-based annual amount can be slightly higher.",
    },
    {
      q: "What does the 52-payment comparison mean?",
      a: "It shows the simple payment-count method beside the 365-day annual amount. This helps you see the difference between weekly payment counting and day-based annualization.",
    },
    {
      q: "Can I use this to compare weekly rent with monthly rent?",
      a: "Yes. The calculator converts weekly rent to an annual amount first, then derives monthly, 4-week, biweekly, daily, and hourly amounts from the same annual total.",
    },
    {
      q: "Is every 4 weeks the same as monthly rent?",
      a: "No. Every 4 weeks is 28 days. An average month is about 30.42 days based on 365 days divided by 12.",
    },
    {
      q: "Does this match exact lease due dates?",
      a: "No. This is a rent conversion estimate. Exact lease totals can depend on start dates, due dates, proration rules, and lease wording.",
    },
    {
      q: "What costs are included?",
      a: "Only the rent amount you enter. Utilities, parking, insurance, fees, and one-time charges are not included unless you add them to the weekly amount yourself.",
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
      "Convert weekly rent into an annual rent amount using a 365-day year. See monthly, 4-week, daily, and hourly breakdowns.",
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
                  Weekly to Annual Rent Converter
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-700">
                  Convert weekly rent into an annual amount. The calculator also
                  shows monthly, 4-week, daily, and hourly rent breakdowns.
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
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 550"
                  className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-invalid={!parsed.ok}
                  aria-describedby={!parsed.ok ? "rc-wta-errors" : undefined}
                />

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
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
            </div>
          </div>

          {!parsed.ok ? (
            <div
              id="rc-wta-errors"
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
                    Fix the input to calculate annual rent.
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
                      Annual rent
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                      {money(computed.annual)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on weekly rent annualized over a 365-day year.
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
                          computed.fourWeeks,
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
                            {formatPercentFromRatioScaled(
                              computed.monthlyMinus4w,
                              computed.fourWeeks,
                              2,
                            )}
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