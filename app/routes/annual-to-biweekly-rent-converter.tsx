import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-biweekly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import HowItWorks from "~/client/components/annual-to-biweekly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/annual-to-biweekly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/annual-to-biweekly-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Annual to Biweekly Rent Converter | 14-Day Rent Amount";
  const description =
    "Convert annual rent into a biweekly 14-day amount. See monthly, weekly, 4-week, and annual comparisons with printable cents-rounded results.";

  const url = `${SITE_URL}${PAGE_PATH}`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to biweekly rent, yearly to biweekly rent, every 2 weeks rent, annual rent biweekly calculator, convert annual rent to biweekly, biweekly rent budgeting, rent converter annual to biweekly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#0284c7" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

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
  daily: "Daily",
  weekly: "Weekly",
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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n;

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

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return (n * 100).toFixed(2) + "%";
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) {
    return { ok: false, error: "Enter an annual rent amount.", warnings };
  }

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
      const after = parts[1] ?? "";
      const before = parts[0] ?? "";

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

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
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

export default function AnnualToBiweeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "24000";
    const saved = window.localStorage.getItem("rc_atbw_amount");
    return saved ?? "24000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_atbw_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_atbw_amount", amount);
      window.localStorage.setItem("rc_atbw_currency", currency);
    } catch {
      // ignore storage failures
    }
  }, [amount, currency]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsed = useMemo(() => parseMoneyInputToScaled(amount), [amount]);

  const annualScaled = parsed.ok ? (parsed.scaled as bigint) : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const interpretationLine = useMemo(() => {
    if (!parsed.ok) return null;
    return fmt(annualScaled);
  }, [parsed.ok, annualScaled, currency]);

  const amountPreview = useMemo(() => {
    if (!parsed.ok) return null;
    const normalized = parsed.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsed.ok, parsed.normalized]);

  const amountInputValue = amountFocused
    ? amount
    : parsed.ok && amountPreview
      ? amountPreview
      : amount;

  const breakdownScaled = useMemo(() => {
    if (!parsed.ok) return null;

    const annual = annualScaled;
    const monthly = annualToPeriodScaled(annual, "monthly");
    const biweekly = annualToPeriodScaled(annual, "biweekly");
    const weekly = annualToPeriodScaled(annual, "weekly");
    const every4w = annualToPeriodScaled(annual, "every_4_weeks");
    const daily = annualToPeriodScaled(annual, "daily");
    const hourly = annualToPeriodScaled(annual, "hourly");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    const annualFromMonthly12 = monthly * 12n;
    const annualFromBiweekly26 = biweekly * 26n;
    const annualFrom4w13 = every4w * 13n;

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
      annualFromBiweekly26,
      annualFrom4w13,
    };
  }, [parsed.ok, annualScaled]);

  const headlineBiweeklyScaled = breakdownScaled?.biweekly ?? 0n;

  const canShowResults = parsed.ok && breakdownScaled !== null;

  const faqData = [
    {
      q: "How is annual rent converted to biweekly rent on this page?",
      a: "Your annual total is treated as the source of truth for a 365-day year. The biweekly result is the 14-day amount that matches the same annual total (annual × 14 ÷ 365). This avoids shortcuts like dividing by 26, which can misstate the true equivalent.",
    },
    {
      q: "Does biweekly always mean 26 payments per year?",
      a: "Not exactly. Biweekly here means a 14-day period. While people often say “26 payments per year,” real lease schedules vary by start date, billing rules, and prorations, so the actual count in a calendar year can differ.",
    },
    {
      q: "Why do monthly and 4-week amounts differ?",
      a: "A 4-week period is 28 days. A true average month is about 30.42 days (365 ÷ 12). Because the time lengths differ, the equivalent amounts differ even when the annual total is the same.",
    },
    {
      q: "What does “annual rent” mean here?",
      a: "It means the total rent paid over one year using consistent assumptions. The calculator does not guess what is included. Only enter what you personally treat as rent (exclude utilities, parking, fees, or taxes unless you want them included).",
    },
    {
      q: "Will this match the exact amount due on my calendar dates?",
      a: "Not necessarily. This tool is for budgeting and comparing quotes across billing periods. Real leases can include partial periods, specific due dates, or fees that change the exact amount due.",
    },
    {
      q: "Why show daily and hourly equivalents?",
      a: "They help you compare rent to time-based budgets or offers quoted per day or per week. Hourly values assume 24 hours per day and a 365-day year for consistency.",
    },
    {
      q: "Does this tool convert currencies or exchange rates?",
      a: "No. Currency selection only changes formatting. Convert exchange rates externally first, then use this calculator with the converted amount.",
    },
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Annual to Biweekly Rent Converter",
    description:
      "Convert annual rent to biweekly rent using a 14-day equivalent, with monthly, weekly, daily, hourly, and 4-week comparisons.",
    url: `${SITE_URL}${PAGE_PATH}`,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Annual to biweekly rent conversion",
    },
  };

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
        name: "Annual to Biweekly Rent Converter",
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700">
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
        className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-8"
      >
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-5 pb-5 pt-5 shadow-sm sm:px-8 sm:pb-8 sm:pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                Annual to biweekly rent converter
              </p>

              <div id="export-controls" className="rc-no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-center text-2xl font-bold tracking-tight text-sky-900 sm:text-left sm:text-4xl">
                Annual to Biweekly Rent Converter
              </h1>

              <p className="mt-2 max-w-5xl text-base leading-7 text-slate-700 sm:text-lg">
                Convert an annual rent total into a biweekly rent amount based
                on a true 14-day period. The breakdown also shows weekly,
                monthly, 4-week, daily, and hourly equivalents for easier rent
                comparison.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5">
            <label
              htmlFor="annual-rent-total"
              className="block text-sm font-semibold text-slate-700"
            >
              Annual rent total
            </label>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="annual-rent-total"
                inputMode="decimal"
                value={amountInputValue}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                placeholder="e.g. 24000 or 24000.50"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-invalid={!parsed.ok}
                aria-describedby="rc-amount-error rc-amount-note"
              />

              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value)
                      ? (e.target.value as Currency)
                      : "CAD",
                  )
                }
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-400 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {interpretationLine ? (
              <p id="rc-amount-note" className="mt-2 text-sm text-slate-600">
                Interpreting annual rent as{" "}
                <strong className="font-semibold text-slate-900">
                  {interpretationLine}
                </strong>
                .
              </p>
            ) : (
              <p id="rc-amount-note" className="mt-2 text-sm text-slate-600">
                Enter the total rent for one year. Currency changes formatting
                only.
              </p>
            )}

            {!parsed.ok ? (
              <p
                id="rc-amount-error"
                className="mt-2 text-sm font-semibold text-rose-700"
              >
                {parsed.error}
              </p>
            ) : parsed.warnings.length ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <div className="font-semibold">Input interpretation note</div>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {parsed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm rc-print-block">
            <div className="h-1.5 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-emerald-800">
                  Biweekly rent equivalent, 14-day period
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-900">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Enter a valid annual rent total above to see the biweekly
                    equivalent and the full breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 text-4xl font-extrabold tracking-tight text-emerald-800 sm:text-5xl">
                    {fmt(headlineBiweeklyScaled)}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Based on annual rent spread across 14 days using a 365-day
                    year.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdownScaled!.hourly, "hourly"],
                        ["Daily", breakdownScaled!.daily, "daily"],
                        ["Weekly", breakdownScaled!.weekly, "weekly"],
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
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm"
                      >
                        <div className="text-xs font-medium text-slate-600">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-bold text-slate-900">
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
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="rc-no-print mt-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-xs leading-relaxed text-slate-600 shadow-sm" data-nosnippet>
            Calculations preserve precision internally, while displayed money values are rounded to cents.
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-bold text-sky-800">
              How this annual to biweekly conversion works
            </h2>
            <div className="mt-2 space-y-3 text-sm leading-6 text-slate-700">
              <p>
                This calculator treats your annual rent total as the source
                amount, then converts it into a 14-day equivalent. The core
                formula is{" "}
                <strong className="font-semibold text-slate-900">
                  annual rent × 14 ÷ 365
                </strong>
                .
              </p>
              <p>
                This is different from simply dividing annual rent by 26. A
                14-day period is precise for comparison, while calendar payment
                schedules can vary by lease start date, due date, and proration
                rules.
              </p>
            </div>
          </section>

          <Assumptions />
        </div>

        <div className="rc-no-print mt-4 flex flex-wrap items-center gap-3">
          <SafeLink
            href="/annual-to-weekly-rent-converter"
            className="inline-flex cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Convert annual to weekly →
          </SafeLink>

          <SafeLink
            href="/annual-to-monthly-rent-converter"
            className="inline-flex cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Convert annual to monthly →
          </SafeLink>
        </div>
      </section>

      <HowItWorks />

      <section className="rc-no-print mt-8 mb-4 hidden sm:block">
        <nav className="mx-auto max-w-6xl px-6 text-sm text-slate-600">
          {ROUTE_WHITELIST.has("/") ? (
            <SafeLink
              href="/"
              className="cursor-pointer text-sky-700 underline-offset-4 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Home
            </SafeLink>
          ) : (
            <span>Home</span>
          )}{" "}
          / Annual to Biweekly Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section
        id="faq"
        className="mx-auto max-w-5xl px-4 pb-16 sm:px-6"
        aria-labelledby="faq-heading"
      >
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-8">
          <h2
            id="faq-heading"
            className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800"
          >
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-slate-200">
            {faqData.map((f, i) => (
              <details key={i} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                  <span>{f.q}</span>
                  <span
                    className="ml-4 text-slate-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </summary>

                <div className="mt-2 max-w-prose leading-relaxed text-slate-700">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
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
