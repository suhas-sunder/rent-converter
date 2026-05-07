import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-paycheck-us";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-per-paycheck-us/HowItWorks";
import ToolFit from "~/client/components/rent-per-paycheck-us/ToolFit";
import FAQ from "~/client/components/rent-per-paycheck-us/FAQ";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const url = "https://www.rentconverter.com/rent-per-paycheck-us";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";
  const title = "Rent Per Paycheck Calculator US | Pay Schedule Budget";
  const description =
    "Calculate rent per paycheck in the US from monthly rent and common pay schedules. Compare weekly, biweekly, semi-monthly, and monthly pay.";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    {
      name: "description",
      content: description,
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },

    { tagName: "link", rel: "canonical", href: url },
  ];
};

type Period = "weekly" | "biweekly" | "semi_monthly" | "monthly";

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
  if (a > MAX_SAFE_INT_FOR_NUMBER) return Number.NaN;
  return Number(scaled) / Number(SCALE);
}

function groupInt(intStr: string, groupSep: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
}

function getNumberSeparators(): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat("en-US", {
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

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
}

function paychecksPerYear(period: Period): bigint {
  if (period === "weekly") return 52n;
  if (period === "biweekly") return 26n;
  if (period === "semi_monthly") return 24n;
  return 12n;
}

function labelForPeriod(period: Period): string {
  if (period === "weekly") return "Weekly pay";
  if (period === "biweekly") return "Every 2 weeks";
  if (period === "semi_monthly") return "Twice a month";
  return "Monthly pay";
}

export default function RentPerPaycheckUS() {
  const pageName = "Rent Per Paycheck Calculator (US)";
  const canonicalUrl = "https://www.rentconverter.com/rent-per-paycheck-us";

  const [monthlyRent, setMonthlyRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rc_rpc_us_monthly_rent") ?? "2000";
  });

  const [payPeriod, setPayPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "biweekly";
    const saved = localStorage.getItem("rc_rpc_us_pay_period") as Period | null;
    return saved === "weekly" ||
      saved === "biweekly" ||
      saved === "semi_monthly" ||
      saved === "monthly"
      ? saved
      : "biweekly";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);
  const [amountTouched, setAmountTouched] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rpc_us_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rpc_us_monthly_rent", monthlyRent);
      localStorage.setItem("rc_rpc_us_pay_period", payPeriod);
      localStorage.setItem("rc_rpc_us_currency", currency);
    } catch {}
  }, [monthlyRent, payPeriod, currency]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(monthlyRent, "monthly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a monthly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [monthlyRent]);

  const amountPreviewValue = useMemo(() => {
    if (!parsed.ok || parsed.p.scaled === undefined) return monthlyRent;
    return formatPlainNumberFromScaled(parsed.p.scaled, 12);
  }, [monthlyRent, parsed]);

  const amountInputValue = isAmountFocused
    ? monthlyRent
    : parsed.ok
      ? amountPreviewValue
      : monthlyRent;

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const monthly = parsed.p.scaled as bigint;
    const annual = monthly * 12n;

    const perPaycheckFor = (p: Period) =>
      mulDivRound(annual, 1n, paychecksPerYear(p));

    const selected = perPaycheckFor(payPeriod);

    const weekly = perPaycheckFor("weekly");
    const biweekly = perPaycheckFor("biweekly");
    const semiMonthly = perPaycheckFor("semi_monthly");
    const monthlyPay = perPaycheckFor("monthly");

    const selectedPctOfMonthly =
      monthly !== 0n
        ? toNumberSafe(selected) / toNumberSafe(monthly)
        : Number.NaN;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      monthly,
      annual,
      payPeriod,
      selected,
      weekly,
      biweekly,
      semi_monthly: semiMonthly,
      monthly_pay: monthlyPay,
      selectedPctOfMonthly,
    };
  }, [parsed, payPeriod]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const monthlyRentInputId = "rc-rpc-us-monthly-rent";
  const currencySelectId = "rc-rpc-us-currency";
  const payPeriodSelectId = "rc-rpc-us-pay-period";
  const amountHelpId = "rc-rpc-us-monthly-rent-help";
  const amountErrorId = "rc-rpc-us-monthly-rent-error";

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
      "Calculate rent per paycheck in the US from monthly rent and common pay schedules. Compare weekly, biweekly, semi-monthly, and monthly pay.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
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

      <section id="converter" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  US paycheck rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Per Paycheck Calculator (US)
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Convert monthly rent into a per-paycheck amount for common US
                  pay schedules, including weekly, biweekly, semi-monthly, and
                  monthly paychecks.
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

          <div className="mt-5 grid gap-x-5 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label
                htmlFor={monthlyRentInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Monthly rent amount
              </label>

              <input
                id={monthlyRentInputId}
                inputMode="decimal"
                value={amountInputValue}
                onChange={(e) => setMonthlyRent(e.target.value)}
                onFocus={() => setIsAmountFocused(true)}
                onBlur={() => {
                  setIsAmountFocused(false);
                  setAmountTouched(true);
                }}
                placeholder="e.g. 2000"
                className="w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-sky-200"
                aria-invalid={amountTouched && !parsed.ok}
                aria-describedby={`${amountHelpId}${amountTouched && !parsed.ok ? ` ${amountErrorId}` : ""}`}
              />

              <p id={amountHelpId} className="mt-1 text-xs text-slate-700">
                Enter the monthly rent amount you want to split across
                paychecks.
              </p>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor={currencySelectId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Currency
              </label>

              <select
                id={currencySelectId}
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value)
                      ? (e.target.value as Currency)
                      : "USD",
                  )
                }
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-5">
              <label
                htmlFor={payPeriodSelectId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Pay schedule
              </label>

              <select
                id={payPeriodSelectId}
                value={payPeriod}
                onChange={(e) => {
                  const v = e.target.value as Period;
                  setPayPeriod(
                    v === "weekly" ||
                      v === "biweekly" ||
                      v === "semi_monthly" ||
                      v === "monthly"
                      ? v
                      : "biweekly",
                  );
                }}
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Pay schedule"
              >
                <option value="weekly">Weekly (52 paychecks/year)</option>
                <option value="biweekly">
                  Every 2 weeks (26 paychecks/year)
                </option>
                <option value="semi_monthly">
                  Twice a month (24 paychecks/year)
                </option>
                <option value="monthly">Monthly (12 paychecks/year)</option>
              </select>
            </div>
          </div>

          {amountTouched && !parsed.ok ? (
            <div
              id={amountErrorId}
              className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800"
              role="alert"
            >
              <div className="font-semibold">Invalid amount</div>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {!parsed.ok ? (
            <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block">
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

              <div className="p-5 sm:px-6">
                <div className="rounded-2xl bg-white p-4">
                  <div className="font-semibold text-slate-950">
                    No results to show
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Fix the input to calculate rent per paycheck.
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
                      Rent per paycheck
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                      {money(computed.selected)}
                    </div>
                    <div className="text-sm text-slate-700">
                      {labelForPeriod(computed.payPeriod)}
                      {Number.isFinite(computed.selectedPctOfMonthly) ? (
                        <>
                          {" "}
                          (about{" "}
                          <span className="font-semibold text-slate-950">
                            {safeToFixed(
                              computed.selectedPctOfMonthly * 100,
                              2,
                            )}
                            %
                          </span>{" "}
                          of monthly rent)
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">Monthly rent</div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {money(computed.monthly)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs text-slate-700">Annual rent</div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {money(computed.annual)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 px-4 py-2 sm:col-span-2 lg:col-span-1">
                      <div className="text-xs text-emerald-800">
                        Selected schedule
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {labelForPeriod(computed.payPeriod)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:col-span-2 lg:col-span-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Per-paycheck comparison
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                          [
                            ["Weekly (52/yr)", computed.weekly, "weekly"],
                            [
                              "Every 2 weeks (26/yr)",
                              computed.biweekly,
                              "biweekly",
                            ],
                            [
                              "Twice a month (24/yr)",
                              computed.semi_monthly,
                              "semi_monthly",
                            ],
                            [
                              "Monthly (12/yr)",
                              computed.monthly_pay,
                              "monthly_pay",
                            ],
                          ] as const
                        ).map(([label, val, key]) => (
                          <div
                            key={key}
                            className="rounded-xl bg-white/70 px-4 py-2"
                          >
                            <div className="text-xs text-slate-700">
                              {label}
                            </div>
                            <div className="mt-1 text-lg font-bold text-slate-950">
                              {money(val)}
                            </div>
                          </div>
                        ))}
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
        <nav aria-label="Breadcrumb" className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / Rent Per Paycheck Calculator (US)
        </nav>
      </section>

      <ToolFit />

      <FAQ />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
