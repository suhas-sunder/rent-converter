import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-paid-every-4-weeks-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Paid Every 4 Weeks (28 Days) Calculator - Monthly and Annual Equivalents",
  },
  {
    name: "description",
    content:
      "Understand rent paid every 4 weeks (28 days). Convert a 4-week rent amount to monthly (average) and annual equivalents using a consistent 365-day annual basis. Includes payment-count context and a 13-payments comparison.",
  },
  {
    name: "keywords",
    content:
      "rent paid every 4 weeks, 28 day rent, 4 week rent calculator, rent every 28 days, 4 week rent vs monthly, convert 4 week rent to monthly, convert 4 week rent to annual",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Paid Every 4 Weeks (28 Days) Calculator",
  },
  {
    property: "og:description",
    content:
      "Convert 4-week (28-day) rent to monthly and annual equivalents and see how payment counts differ from monthly billing.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-paid-every-4-weeks-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Paid Every 4 Weeks (28 Days) Calculator",
  },
  {
    name: "twitter:description",
    content:
      "Convert 4-week rent to monthly and annual equivalents and compare totals on the same annual basis.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-paid-every-4-weeks-calculator",
  },
];

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
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average)",
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
 * Only include routes you are sure exist.
 * If you do not have a whitelist here, replace safeHref() usage with plain hrefs.
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

/** Fixed-point decimals preserved end-to-end (up to 12 decimals). */
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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";

  if (roundDisplay) {
    const digits = displayDecimals;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(n);
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 12,
  }).format(n);
}

function formatNumberPreviewFromParsed(
  parsed: ParsedScaled,
  locale = "en-US",
): string | null {
  if (!parsed.ok || typeof parsed.scaled === "undefined") return null;

  const n = toNumberSafe(parsed.scaled);
  if (!Number.isFinite(n)) return null;

  const normalized = parsed.normalized ?? "";
  const dot = normalized.indexOf(".");
  const decimals = dot >= 0 ? Math.max(0, normalized.length - dot - 1) : 0;

  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Accepts: $650, 650, 650.00, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 650 or 650.00).",
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
  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }

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

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

/**
 * Source of truth: annual equivalence with fixed day counts.
 * Year = 365 days, week = 7, biweekly = 14, every 4 weeks = 28, month = 365/12 (average).
 * We use fixed-point BigInt to preserve decimals end-to-end.
 */
function annualizeFromScaled(valueScaled: bigint, from: Period): bigint {
  if (from === "annual") return valueScaled;
  if (from === "monthly") return valueScaled * 12n;
  if (from === "weekly") return (valueScaled * 365n) / 7n;
  if (from === "biweekly") return (valueScaled * 365n) / 14n;
  if (from === "every_4_weeks") return (valueScaled * 365n) / 28n;
  if (from === "daily") return valueScaled * 365n;
  return valueScaled * 24n * 365n; // hourly
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "annual") return annualScaled;
  if (to === "monthly") return annualScaled / 12n;
  if (to === "weekly") return (annualScaled / 365n) * 7n;
  if (to === "biweekly") return (annualScaled / 365n) * 14n;
  if (to === "every_4_weeks") return (annualScaled / 365n) * 28n;
  if (to === "daily") return annualScaled / 365n;
  return annualScaled / 365n / 24n; // hourly
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

function sanitizeRawAmountKeepCaret(raw: string, caret: number | null) {
  const before = caret === null ? raw : raw.slice(0, Math.max(0, caret));
  const commasBefore = (before.match(/,/g) || []).length;
  const sanitized = raw.replace(/,/g, "");
  const nextCaret = caret === null ? null : Math.max(0, caret - commasBefore);
  return { sanitized, nextCaret };
}

function coerceDisplayDecimalsFromStorage(raw: string | null): number {
  const allowed = new Set([0, 2, 4, 6]);
  const n = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return allowed.has(t) ? t : 2;
}

export default function RentPaidEvery4Weeks() {
  const pageName = "Rent Paid Every 4 Weeks (28 Days) Calculator";
  const canonicalUrl =
    "https://rentconverter.com/rent-paid-every-4-weeks-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "650";
    const saved = localStorage.getItem("rc_4w_amount") ?? "650";
    return saved.replace(/,/g, "");
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_4w_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (do not affect computation)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_4w_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return coerceDisplayDecimalsFromStorage(
      localStorage.getItem("rc_4w_display_decimals"),
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_4w_amount", amount);
      localStorage.setItem("rc_4w_currency", currency);
      localStorage.setItem("rc_4w_round_display", JSON.stringify(roundDisplay));
      localStorage.setItem("rc_4w_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsed.ok) errors.push(parsed.error ?? "Enter a valid 4-week amount.");
    if (parsed.warnings.length) warnings.push(...parsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const every4wScaled = parsed.scaled as bigint;

    const annualScaled = annualizeFromScaled(every4wScaled, "every_4_weeks");
    const monthlyScaled = fromAnnualScaled(annualScaled, "monthly");
    const weeklyScaled = fromAnnualScaled(annualScaled, "weekly");
    const biweeklyScaled = fromAnnualScaled(annualScaled, "biweekly");
    const dailyScaled = fromAnnualScaled(annualScaled, "daily");
    const hourlyScaled = fromAnnualScaled(annualScaled, "hourly");

    // Counts (context)
    const paymentsPer52WeekYear = 13; // 52 / 4
    const periodsPer365DayYear = 365 / 28; // ~13.04
    const monthlyPayments = 12;

    // Comparison: 13 payments vs 365-day annual equivalence (this tool)
    const annualVia13Scaled = every4wScaled * 13n;
    const diffAnnualScaled = annualScaled - annualVia13Scaled;

    const diffAnnualPct = (() => {
      if (annualVia13Scaled === 0n) return 0;
      const num = toNumberSafe(diffAnnualScaled);
      const den = toNumberSafe(annualVia13Scaled);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
      return (num / den) * 100;
    })();

    // Monthly vs 4-week difference (same annual basis)
    const monthlyMinus4wScaled = monthlyScaled - every4wScaled;
    const monthlyMinus4wPct = (() => {
      if (every4wScaled === 0n) return 0;
      const num = toNumberSafe(monthlyMinus4wScaled);
      const den = toNumberSafe(every4wScaled);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
      return (num / den) * 100;
    })();

    return {
      ok: true as const,
      warnings,

      every4wScaled,
      hourlyScaled,
      dailyScaled,
      weeklyScaled,
      biweeklyScaled,
      monthlyScaled,
      annualScaled,

      paymentsPer52WeekYear,
      periodsPer365DayYear,
      monthlyPayments,

      annualVia13Scaled,
      diffAnnualScaled,
      diffAnnualPct,

      monthlyMinus4wScaled,
      monthlyMinus4wPct,
    };
  }, [parsed]);

  const amountPreviewValue = useMemo(() => {
    const preview = formatNumberPreviewFromParsed(parsed, "en-US");
    return preview ?? amount;
  }, [parsed, amount]);

  const amountDisplayValue = amountFocused
    ? amount
    : parsed.ok
      ? amountPreviewValue
      : amount;

  const faqData = [
    {
      q: "What does “rent paid every 4 weeks” mean?",
      a: "It means rent is due on a fixed 28-day cycle instead of a calendar month. The due date moves through the calendar because 28 days is shorter than most months.",
    },
    {
      q: "How many rent payments happen in a year on a 4-week schedule?",
      a: "A 4-week schedule is often described as 13 payments in a 52-week year (52 ÷ 4 = 13). Using a 365-day year, there are about 13.04 28-day periods (365 ÷ 28). Lease terms determine how billing is handled in practice.",
    },
    {
      q: "Why can 4-week rent feel higher than monthly rent?",
      a: "Monthly billing implies 12 payments per year. A 4-week schedule is closer to 13 cycles per year, so the annual total can be higher even when each 4-week payment looks similar to a monthly payment.",
    },
    {
      q: "Is 4-week rent the same as paying rent monthly?",
      a: "No. A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Because the periods are different lengths, the annual equivalents differ.",
    },
    {
      q: "Does this calculator match my exact due dates?",
      a: "It provides an estimate for budgeting and comparison. Exact due dates and totals can vary with lease rules, start dates, prorations, fees, and what is included in rent.",
    },
    {
      q: "Why does the calculator use an average month?",
      a: "Months have different lengths (28 to 31 days). Using 365 ÷ 12 creates a consistent monthly average that allows comparisons across hourly, daily, weekly, 4-week, monthly, and annual periods.",
    },
    {
      q: "How can this help when comparing listings?",
      a: "It converts a 4-week amount into monthly and annual equivalents so different listings can be compared on the same annual basis.",
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
        item: "https://rentconverter.com/",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Convert rent paid every 4 weeks (28 days) into monthly (average), weekly, and annual equivalents using a consistent 365-day annual basis. Includes schedule comparisons.",
    url: canonicalUrl,
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

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

  const amountHelpId = "rc-4w-amount-help";
  const amountErrorId = "rc-4w-amount-error";

  return (
    <main className="bg-white text-slate-700 scroll-smooth text-[15px] sm:text-base leading-relaxed">
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

      {/* Breadcrumbs */}
      <section className="pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Home
          </a>{" "}
          / {pageName}
        </nav>
      </section>

      {/* Header */}
      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl sm:text-[2.6rem] leading-tight font-bold text-slate-900 mb-4">
          {pageName}
        </h1>
        <p className="text-slate-600 max-w-5xl mx-auto text-lg leading-relaxed">
          A 4-week rent schedule is a 28-day cycle, not a calendar month. This
          page converts a 4-week rent amount into monthly (average) and annual
          equivalents so you can compare listings and budgets on the same annual
          basis.
        </p>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Convert 4-week rent to monthly and annual
              </h2>
            </div>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor="rc-4w-amount"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                4-week rent amount (every 28 days)
              </label>

              <div className="flex gap-2">
                <input
                  id="rc-4w-amount"
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => {
                    const caret = e.currentTarget.selectionStart;
                    const next = sanitizeRawAmountKeepCaret(
                      e.target.value,
                      caret,
                    );
                    setAmount(next.sanitized);
                    if (next.nextCaret !== null) {
                      queueMicrotask(() => {
                        try {
                          e.currentTarget.setSelectionRange(
                            next.nextCaret as number,
                            next.nextCaret as number,
                          );
                        } catch {
                          // ignore
                        }
                      });
                    }
                  }}
                  placeholder="e.g. 650 or 650.00"
                  className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    parsed.ok
                      ? "border-slate-300 focus:border-sky-600"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsed.ok}
                  aria-describedby={
                    parsed.ok
                      ? amountHelpId
                      : `${amountHelpId} ${amountErrorId}`
                  }
                />

                <label htmlFor="rc-4w-currency" className="sr-only">
                  Currency
                </label>
                <select
                  id="rc-4w-currency"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3.5 py-3.5 text-sm font-semibold outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsed.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsed.error}
                </p>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div
            className="mt-6 rounded-2xl border border-slate-200 border-l-4 border-l-sky-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
          >
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-900">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Fix the input to calculate equivalents.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
                <div className="text-sm text-slate-700">
                  4-week rent equivalents (annual basis)
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "summary",
                        `Every 4 weeks: ${fmtMoney(computed.every4wScaled)}; Weekly: ${fmtMoney(
                          computed.weeklyScaled,
                        )}; Monthly: ${fmtMoney(computed.monthlyScaled)}; Annual: ${fmtMoney(
                          computed.annualScaled,
                        )} (365-day basis)`,
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {copiedKey === "summary" ? "Copied" : "Copy summary"}
                  </button>

                  <span className="sr-only" aria-live="polite">
                    {copiedKey === "summary"
                      ? "Copied"
                      : copiedKey === "copy_failed"
                        ? "Copy failed"
                        : ""}
                  </span>

                  {copiedKey === "copy_failed" ? (
                    <span className="self-center text-sm font-semibold text-rose-700">
                      Copy failed
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourlyScaled, "hourly"],
                      ["Daily", computed.dailyScaled, "daily"],
                      ["Weekly", computed.weeklyScaled, "weekly"],
                      ["Every 2 weeks", computed.biweeklyScaled, "biweekly"],
                      [
                        "Every 4 weeks (28 days)",
                        computed.every4wScaled,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", computed.monthlyScaled, "monthly"],
                      ["Annual", computed.annualScaled, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 border-t-2 border-t-sky-100 bg-white px-4 py-3.5 shadow-sm"
                    >
                      <div className="text-xs text-slate-600">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {fmtMoney(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      4-week vs monthly (same annual basis)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">
                          4-week amount
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.every4wScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Fixed 28-day period
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">
                          Monthly equivalent
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.monthlyScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Average month (365 ÷ 12)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">Difference</div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.monthlyMinus4wScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums">
                          ≈ {computed.monthlyMinus4wPct.toFixed(2)}% of the
                          4-week amount
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600">
                      A 4-week period is 28 days. An average month is about
                      30.42 days (365 ÷ 12). The difference comes from period
                      length.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Annual comparison: 13 payments vs 365-day equivalence
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">
                          4-week × 13
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.annualVia13Scaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          52-week framing
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">
                          Annual (365-day basis)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.annualScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          This tool’s basis
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-600">Difference</div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.diffAnnualScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 tabular-nums">
                          ≈ {computed.diffAnnualPct.toFixed(2)}% vs the 13x
                          framing
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600">
                      This comparison is illustrative. Lease terms can define
                      specific payment counts or date rules.
                    </p>
                  </div>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 rc-no-print">
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

          {/* Disclaimer */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 rc-print-block shadow-sm">
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong>
              <br />
              Tools on this site are provided for informational, budgeting, and
              comparison purposes only. Calculations are based on standard
              time-period assumptions (including a 365-day year and average
              month length) and simplified models. Results are estimates, not
              guarantees.
              <br />
              <br />
              This website does not provide financial, legal, or tax advice.
              Rental costs, affordability, payment schedules, and obligations
              vary by location, landlord, lease terms, and individual
              circumstances. Always review your lease agreement and consult
              qualified professionals before making financial decisions.
            </p>
          </div>
        </div>

        <div className="md:col-span-6 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">
                  Displayed decimals
                </span>
                <select
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(
                      coerceDisplayDecimalsFromStorage(e.target.value),
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:border-sky-600"
                  aria-label="Displayed decimals"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Calculations preserve decimals internally (up to 12). Only display
              rounding changes.
            </p>
          </div>
        </div>
      </section>

      {/* Annual payment count table */}
      <section
        id="payment-counts"
        className="max-w-6xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Annual payment counts for common rent schedules
        </h2>
        <p className="text-slate-700 mb-6">
          The confusion usually comes from mixing calendar months with fixed-day
          cycles. A 4-week schedule is a repeating 28-day period, so it does not
          line up cleanly with months.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Schedule
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Length
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Payments per 52-week year
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Periods per 365-day year (approx.)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900 font-semibold">
                  Monthly
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  Calendar month
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  12 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  12 months
                </td>
              </tr>
              <tr className="border-t border-slate-200 bg-slate-50/40">
                <td className="px-4 py-3 text-sm text-slate-900 font-semibold">
                  Every 4 weeks (28 days)
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  28 days
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  13 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  {(365 / 28).toFixed(2)} periods
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900 font-semibold">
                  Biweekly (every 2 weeks)
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  14 days
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  26 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  {(365 / 14).toFixed(2)} periods
                </td>
              </tr>
              <tr className="border-t border-slate-200 bg-slate-50/40">
                <td className="px-4 py-3 text-sm text-slate-900 font-semibold">
                  Weekly
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  7 days
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  52 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 tabular-nums">
                  {(365 / 7).toFixed(2)} weeks
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          These counts are for comparison. Actual billing can depend on the
          lease start date, due-date rules, prorations, and how partial periods
          are handled.
        </p>
      </section>

      {/* Required explanation section above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700 mb-4">
            A 4-week rent schedule means rent is due every 28 days. Because
            calendar months are usually longer than 28 days, the due date moves
            through the calendar rather than staying on the same day each month.
          </p>

          <p className="text-slate-700 mb-4">
            This calculator converts your 28-day rent amount to an annual total
            first using a 365-day year. It then converts that annual total back
            into monthly (average), weekly, and other equivalents. Using the
            annual total as the source of truth keeps comparisons consistent
            across periods.
          </p>

          <p className="text-slate-700 mb-4">
            The page also compares “4-week × 13” (a common shorthand for a
            52-week framing) with the 365-day annual equivalence used for the
            conversions. The difference is small, but it exists, and it can
            matter for budgeting.
          </p>

          <p className="text-slate-600 text-sm">
            Outputs are estimates. Exact totals can change based on lease terms,
            start dates, proration, fees, and what the agreement defines as
            “rent.”
          </p>

          <p className="text-slate-700 mt-6">
            Related pages:{" "}
            <a
              href={safeHref("/rent-converter")}
              className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            >
              rent converter
            </a>
            ,{" "}
            <a
              href={safeHref("/weekly-to-monthly-rent-converter")}
              className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            >
              weekly to monthly
            </a>
            ,{" "}
            <a
              href={safeHref("/monthly-to-annual-rent-converter")}
              className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            >
              monthly to annual
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
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

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-10 rc-no-print">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
          </em>
        </p>
      </section>

      {/* JSON-LD */}
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
