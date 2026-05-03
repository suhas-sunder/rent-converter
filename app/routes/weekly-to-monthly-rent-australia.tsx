import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/weekly-to-monthly-rent-australia";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/weekly-to-monthly-rent-australia/HowItWorks";
import ToolFit from "~/client/components/weekly-to-monthly-rent-australia/ToolFit";
import FAQ from "~/client/components/weekly-to-monthly-rent-australia/FAQ";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Weekly to Monthly Rent Calculator Australia | PW to PCM";
  const description =
    "Convert weekly rent to monthly rent in Australia using a true 365-day year. Compare PW rent with monthly and 4-week totals.";
  const url = "https://www.rentconverter.com/weekly-to-monthly-rent-australia";
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
        "weekly to monthly rent Australia, weekly rent to monthly rent, Australian weekly rent calculator, rent per calendar month Australia, weekly rent monthly equivalent",
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
  "AUD",
  "USD",
  "CAD",
  "EUR",
  "GBP",
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
  "/rent-affordability-calculator",
  "/rent-as-percentage-of-income-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",
  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",
  "/rent-vs-buy-calculator",
  "/rent-paid-weekly-vs-monthly",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n;

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
  const parts = new Intl.NumberFormat("en-AU", {
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
    if (trimTrailingZeros) fracStr = fracStr.replace(/0+$/g, "");
  }
  return { negative, intStr: intPart.toString(), fracStr };
}

function formatPlainNumberFromScaled(
  scaled: bigint,
  maxFractionDigits: number,
): string {
  const digitsCap = Math.max(0, Math.min(12, maxFractionDigits));
  const { group, decimal } = getNumberSeparators();

  const negative = scaled < 0n;
  const a = absBigInt(scaled);
  const fracPart = a % SCALE;

  let digits = 0;
  if (digitsCap > 0 && fracPart !== 0n) {
    const fracFull = fracPart.toString().padStart(12, "0");
    const trimmed = fracFull.replace(/0+$/g, "");
    digits = Math.min(digitsCap, Math.max(0, trimmed.length));
  }

  const { intStr, fracStr } = scaledToDecimalStrings(scaled, digits, true);
  const groupedInt = groupInt(intStr, group);

  if (digits > 0 && fracStr.length > 0) {
    return `${negative ? "-" : ""}${groupedInt}${decimal}${fracStr}`;
  }

  return `${negative ? "-" : ""}${groupedInt}`;
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

function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 650 or 650.00).`,
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
      const after = parts[1] ?? "";
      if (/^\d{1,2}$/.test(after)) {
        decimalSep = ",";
      } else {
        decimalSep = null;
      }
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

  return { ok: true, scaled: clamped, warnings };
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

export default function WeeklyToMonthlyRentAustralia() {
  const pageName = "Weekly to Monthly Rent Converter Australia";
  const canonicalUrl =
    "https://www.rentconverter.com/weekly-to-monthly-rent-australia";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    return localStorage.getItem("rc_wtm_amount_au") ?? "500";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);
  const [amountTouched, setAmountTouched] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "AUD";
    const saved = localStorage.getItem("rc_wtm_currency_au") ?? "AUD";
    return isCurrency(saved) ? saved : "AUD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtm_amount_au", amount);
      localStorage.setItem("rc_wtm_currency_au", currency);
    } catch {}
  }, [amount, currency]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const amountPreviewValue = useMemo(() => {
    if (!parsed.ok || parsed.p.scaled === undefined) return amount;
    return formatPlainNumberFromScaled(parsed.p.scaled, 12);
  }, [amount, parsed]);

  const amountInputValue = isAmountFocused
    ? amount
    : parsed.ok
      ? amountPreviewValue
      : amount;

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    const annual = annualizeScaled(weekly, "weekly");
    const monthly = fromAnnualScaled(annual, "monthly");
    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const biweekly = fromAnnualScaled(annual, "biweekly");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? toNumberSafe(monthlyMinus4w) / toNumberSafe(fourWeeks)
        : Number.NaN;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      monthly,
      annual,
      hourly,
      daily,
      biweekly,
      every_4_weeks: fourWeeks,
      monthlyMinus4w,
      monthlyMinus4wPct,
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
      q: "How do you convert weekly rent to monthly rent in Australia?",
      a: "Convert weekly rent to an annual amount, then divide by 12. This gives a calendar-month estimate instead of simply multiplying weekly rent by 4.",
    },
    {
      q: "Why is weekly rent times 4 different from monthly rent?",
      a: "Four weeks is 28 days. An average calendar month is about 30.42 days based on 365 days divided by 12, so the monthly amount is usually higher than a 4-week amount.",
    },
    {
      q: "Is Australian rent usually listed weekly?",
      a: "Many Australian rental listings show weekly rent. This calculator helps estimate the calendar-month amount so you can compare it with monthly budgets.",
    },
    {
      q: "Does this calculate exact lease payments?",
      a: "No. It gives a rent conversion estimate. Exact payments can depend on lease wording, due dates, bond rules, proration, and agency processes.",
    },
    {
      q: "What costs are included?",
      a: "Only the rent amount you enter. Utilities, parking, internet, insurance, and fees are not included unless you add them to the weekly amount.",
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
      "Convert weekly rent to monthly rent in Australia using a true 365-day year. Compare PW rent with monthly and 4-week totals.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const amountInputId = "rc-wtm-au-weekly-rent";
  const amountHelpId = "rc-wtm-au-weekly-rent-help";
  const amountErrorId = "rc-wtm-au-weekly-rent-error";
  const currencySelectId = "rc-wtm-au-currency";

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
                  Australia rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Weekly to Monthly Rent Converter Australia
                </h1>

                <p className="mt-2 max-w-4xl text-base text-slate-700">
                  Convert weekly rent into a monthly amount in Australia. The
                  calculator also shows the 4-week comparison.
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
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Weekly rent amount
              </label>

              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountInputValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => {
                    setIsAmountFocused(false);
                    setAmountTouched(true);
                  }}
                  placeholder="e.g. 500"
                  className={`w-full min-w-0 rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    amountTouched && !parsed.ok
                      ? "border-rose-300"
                      : "border-slate-300"
                  }`}
                  aria-invalid={amountTouched && !parsed.ok}
                  aria-describedby={`${amountHelpId}${amountTouched && !parsed.ok ? ` ${amountErrorId}` : ""}`}
                />

                <select
                  id={currencySelectId}
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "AUD",
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

              <p id={amountHelpId} className="mt-1 text-xs text-slate-700">
                Enter the weekly rent shown on the listing.
              </p>

              {amountTouched && !parsed.ok ? (
                <p
                  id={amountErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsed.errors.join(" ")}
                </p>
              ) : null}
            </div>
          </div>

          {!computed.ok ? (
            <div
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
                    Fix the input to calculate monthly rent.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                    {computed.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                  {computed.warnings.length ? (
                    <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {computed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
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
                      Monthly rent
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                      {money(computed.monthly)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Based on weekly rent annualized over 365 days, then
                      divided by 12.
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
                        4-week vs monthly comparison
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
          )}
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

      <FAQ />

      <ToolFit />

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
