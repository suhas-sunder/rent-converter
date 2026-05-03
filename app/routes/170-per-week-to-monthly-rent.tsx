import { useMemo, useState } from "react";
import type { Route } from "./+types/170-per-week-to-monthly-rent";
import HowItWorks from "~/client/components/170-per-week-to-monthly-rent/HowItWorks";
import ToolFit from "~/client/components/170-per-week-to-monthly-rent/ToolFit";
import FAQ from "~/client/components/170-per-week-to-monthly-rent/FAQ";

export const meta: Route.MetaFunction = () => {
  const url = "https://www.rentconverter.com/170-per-week-to-monthly-rent";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";
  const title = "170 Per Week to Monthly Rent | True Monthly Equivalent";
  const description =
    "Convert $170 per week to a true monthly rent amount using a 365-day year. See the calendar-month result, 4-week comparison, and cents-rounded display.";

  return [
    { title },
    {
      name: "description",
      content: description,
    },
    { name: "robots", content: "index,follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#0284c7" },

    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },

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

/** Fixed-point: store up to 12 decimals exactly */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
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
) {
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

function groupInt(intStr: string, groupSep: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
}

function getNumberSeparators() {
  const parts = new Intl.NumberFormat(undefined, {
    useGrouping: true,
  }).formatToParts(1000.1);
  return {
    group: parts.find((p) => p.type === "group")?.value ?? ",",
    decimal: parts.find((p) => p.type === "decimal")?.value ?? ".",
  };
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
  if (period === "weekly") return mulDivRound(valueScaled, 365n, 7n);
  return 0n;
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "monthly") return mulDivRound(annualScaled, 1n, 12n);
  return annualScaled;
}

export default function OneSeventyPerWeekToMonthlyRent() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const weeklyScaled = 170n * SCALE;

  const monthlyScaled = useMemo(() => {
    const annual = annualizeScaled(weeklyScaled, "weekly");
    return fromAnnualScaled(annual, "monthly");
  }, []);

  const fourWeekScaled = weeklyScaled * 4n;

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const pageUrl = "https://www.rentconverter.com/170-per-week-to-monthly-rent";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "$170 Per Week to Monthly Rent",
    description:
      "Convert $170 per week to monthly rent using annual equivalence and compare it with a simple 4-week rent calculation.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: "https://www.rentconverter.com",
    },
    about: {
      "@type": "Thing",
      name: "Weekly to monthly rent conversion",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is $170 per week per month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "$170 per week is about $738.21 per calendar month using annual equivalence: weekly rent multiplied by 365, divided by 7, then divided by 12.",
        },
      },
      {
        "@type": "Question",
        name: "Why is $170 per week not just $680 per month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "$680 is four weeks of rent, but most calendar months are longer than exactly four weeks. A calendar-month equivalent spreads weekly rent across the full year and divides it by 12.",
        },
      },
      {
        "@type": "Question",
        name: "What formula does this page use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The page uses weekly rent × 365 ÷ 7 ÷ 12 to estimate the true monthly equivalent. The displayed result is rounded for readability, while the calculation preserves decimal precision internally.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-8">
        <div className="rounded-[1.75rem] bg-white p-5 sm:p-8">
          <div className="max-w-6xl">
            <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              Weekly to monthly rent answer
            </p>

            <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-sky-900 sm:text-left sm:text-4xl">
              {fmt(weeklyScaled)} per Week to Monthly Rent
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-700 sm:text-lg">
              A rent of {fmt(weeklyScaled)} per week is equivalent to{" "}
              <strong className="font-semibold text-slate-950">
                {money(monthlyScaled)} per calendar month
              </strong>{" "}
              using the standard annual-equivalence method.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-4 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Monthly equivalent, calendar month
              </div>

              <div className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">
                {money(monthlyScaled)}
              </div>

              <div className="mt-2 text-sm text-slate-700">
                Calculations preserve precision internally, while displayed money values are rounded to cents. The calculation uses annual equivalence based on a 365-day year.
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <div className="text-xs font-medium text-slate-700">
                    4 weeks only, 28 days
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">
                    {money(fourWeekScaled)}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    This is a simple four-week total, not a true calendar-month
                    equivalent.
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3">
                  <div className="text-xs font-medium text-emerald-700">
                    True monthly average
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">
                    {money(monthlyScaled)}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    This accounts for the fact that a year has more than 48
                    weeks.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="currency"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        isCurrency(e.target.value)
                          ? (e.target.value as Currency)
                          : "USD",
                      )
                    }
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-950 outline-none transition hover:border-sky-400 hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <a
                  href="/weekly-to-monthly-rent-converter"
                  className="inline-flex cursor-pointer items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:ml-auto"
                >
                  Convert a different weekly amount →
                </a>
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-2xl bg-white p-4 sm:p-5">
            <h2 className="text-xl font-bold text-sky-800">
              How the monthly amount is calculated
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This page converts weekly rent to monthly rent by first converting
              the weekly amount into an annual amount, then dividing by 12. For{" "}
              <strong className="font-semibold text-slate-950">
                {fmt(weeklyScaled)} per week
              </strong>
              , the calculation is{" "}
              <strong className="font-semibold text-slate-950">
                {fmt(weeklyScaled)} × 365 ÷ 7 ÷ 12 = {money(monthlyScaled)}
              </strong>
              .
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This is different from multiplying by four. Four weeks is only 28
              days, while most calendar months are about 30 or 31 days. That is
              why the true monthly equivalent is higher than{" "}
              {money(fourWeekScaled)}.
            </p>
          </section>
        </div>
      </section>

      <HowItWorks />
      <ToolFit />
      <FAQ />
    </main>
  );
}
