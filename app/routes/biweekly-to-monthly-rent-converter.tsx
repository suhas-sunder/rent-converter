import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-monthly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/biweekly-to-monthly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/biweekly-to-monthly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/biweekly-to-monthly-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Monthly Rent Converter | Average Monthly Rent";
  const description =
    "Convert biweekly rent to an average monthly amount. Compare 14-day rent cycles with monthly, weekly, and 4-week rent equivalents.";

  const url = `${SITE_URL}${PAGE_PATH}`;
  const ogImage = `${SITE_URL}/og-image.jpg`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "biweekly to monthly rent converter, every 2 weeks to monthly rent, biweekly rent to monthly, biweekly monthly rent calculator, 14-day rent cycle, biweekly vs monthly rent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

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

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
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

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_btm_amount", amount);
      window.localStorage.setItem("rc_btm_currency", currency);
    } catch {
      // ignore
    }
  }, [amount, currency]);

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
    formatCurrencyFromScaled(scaled, currency);

  const monthlyHeadlineScaled = breakdownScaled?.monthly ?? 0n;


  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do you convert biweekly rent to monthly rent?",
      a: "This calculator treats biweekly rent as a 14-day amount. It converts that to a daily amount, annualizes it over 365 days, then divides by 12.",
    },
    {
      q: "Is biweekly rent the same as twice a month?",
      a: "No. Biweekly means every 14 days. Twice a month usually means 24 payments per year, while biweekly is about 26 payments per year.",
    },
    {
      q: "Why can the 26-payment shortcut differ from the main monthly result?",
      a: "The shortcut uses biweekly × 26 ÷ 12. The main result uses a 365-day year, so the two methods can differ slightly.",
    },
    {
      q: "Why does biweekly rent not line up cleanly with calendar months?",
      a: "Fourteen-day periods move across calendar months. Some months can include more payment activity than others.",
    },
    {
      q: "How is biweekly different from rent paid every 4 weeks?",
      a: "Biweekly is every 14 days. Every 4 weeks is every 28 days. The payment timing and yearly totals are different.",
    },
    {
      q: "What assumptions does this converter use?",
      a: "It uses 365 days per year, 14 days per biweekly period, 7 days per week, and 28 days per 4-week period. Monthly uses an average month length.",
    },
    {
      q: "Does display rounding change the calculation?",
      a: "No. Rounding is display-only. The calculator keeps decimal precision through the calculation and only rounds shown or printed values.",
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
      "Convert biweekly rent to monthly rent and compare it with a 26-payment estimate.",
    url: `${SITE_URL}${PAGE_PATH}`,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Biweekly to monthly rent conversion",
    },
  };

  const amountInputId = "rc-btm-amount";

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth">
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 pt-3 sm:pt-6"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 rc-page-eyebrow">
                  Biweekly to monthly rent calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Biweekly to Monthly Rent Converter
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Convert a rent amount paid every 14 days into an average
                  calendar-month amount. Use it when a biweekly lease, pay
                  schedule, or listing needs to be compared with monthly bills.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex flex-wrap gap-2 sm:justify-end"
              >
                <button
                  type="button"
                  onClick={handlePrint}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>

              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label
                  htmlFor={amountInputId}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Biweekly rent amount (every 14 days)
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={amountInputId}
                    inputMode="decimal"
                    value={amountDisplayValue}
                    onFocus={() => setAmountFocused(true)}
                    onBlur={() => setAmountFocused(false)}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1000 or 1000.50"
                    className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Currency"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p id="rc-amount-help" className="mt-2 text-xs text-slate-700">
                  Enter the amount paid every 14 days. Currency symbols,
                  commas, and decimals are accepted.
                </p>

                {!parsedBiweekly.ok ? (
                  <p
                    id="rc-amount-error"
                    className="mt-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {parsedBiweekly.error}
                  </p>
                ) : parsedBiweekly.warnings.length ? (
                  <div className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                    <div className="font-semibold">Input interpretation note</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {parsedBiweekly.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />


              <div className="p-5 sm:px-6">

              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-950">
                  Monthly amount
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-950">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid biweekly amount above to see the monthly
                    amount and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <div>
                      <div className="text-3xl font-extrabold text-emerald-700 sm:text-5xl rc-tabular leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                        <span className="rc-amount">
                          {fmt(monthlyHeadlineScaled)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">
                        Based on a 14-day amount annualized over 365 days, then
                        divided by 12.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                        className="min-w-0 rounded-2xl bg-white px-4 py-3"
                      >
                        <div className="text-xs font-medium text-slate-700">
                          {label}
                        </div>
                        <div className="mt-1 text-lg font-bold leading-tight text-slate-950 sm:text-xl rc-tabular">
                          <span className="rc-amount">{fmt(val)}</span>
                        </div>
                      </div>
                    ))}

                    {paymentMath ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                        <div className="text-xs font-medium text-emerald-700">
                          26-payment comparison
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-700">
                              Payments per year
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-950 rc-tabular">
                              <span className="rc-amount">
                                {paymentMath.paymentsPerYear}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-700">
                              Common count
                            </div>
                          </div>

                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-700">
                              Shortcut monthly
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-950 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.monthlyFromPayments)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-700">
                              Biweekly × 26 ÷ 12
                            </div>
                          </div>

                          <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
                            <div className="text-xs text-slate-700">
                              Difference
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-950 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.deltaVsConverter)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-700">
                              ≈{" "}
                              <span className="rc-amount">
                                {formatPercent(paymentMath.pctVsConverter)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-slate-700">
                          The main result uses the 365-day method. The shortcut
                          uses 26 payments per year.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}


              </div></div>

            <Assumptions />

          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / Biweekly to Monthly Rent Converter
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-700">
          These answers explain how biweekly rent is converted to monthly rent
          and why the 26-payment shortcut can differ slightly.
        </p>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 leading-relaxed text-slate-700">
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
