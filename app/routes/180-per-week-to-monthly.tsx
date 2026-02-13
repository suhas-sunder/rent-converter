import { useMemo, useState } from "react";
import type { Route } from "./+types/180-per-week-to-monthly-rent";
import HowItWorks from "~/client/components/180-per-week-to-monthly-rent/HowItWorks";
import ToolFit from "~/client/components/180-per-week-to-monthly-rent/ToolFit";
import FAQ from "~/client/components/180-per-week-to-monthly-rent/FAQ";

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
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  let digits = roundDisplay ? displayDecimals : 12;

  const scaledForDisplay = roundDisplay
    ? roundScaledToDecimals(scaled, digits)
    : scaled;

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    !roundDisplay,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

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
    if (p.type === "decimal") {
      if (digits > 0 && fracStr.length > 0) out += decimal;
      continue;
    }
    if (p.type === "fraction") {
      if (digits > 0 && fracStr.length > 0) out += fracStr;
      continue;
    }
    if (p.type === "group") continue;
    out += p.value;
  }

  return out || "—";
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

export const meta: Route.MetaFunction = () => {
  const url = "https://www.rentconverter.com/180-per-week-to-monthly-rent";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title: "180 per Week to Monthly Rent (Exact Conversion)" },
    {
      name: "description",
      content:
        "Convert 180 per week to a monthly rent equivalent using true calendar-month math. Instant result with exact decimals.",
    },
    { name: "robots", content: "index,follow" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "180 per Week to Monthly Rent" },
    {
      property: "og:description",
      content:
        "Instantly see what 180 per week equals per month using exact calendar-month math.",
    },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "180 per Week to Monthly Rent" },
    {
      name: "twitter:description",
      content:
        "Convert 180 per week to monthly rent using true monthly equivalence.",
    },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
  ];
};

export default function OneEightyPerWeekToMonthlyRent() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [roundDisplay] = useState<boolean>(true);
  const [displayDecimals] = useState<number>(2);

  const weeklyScaled = 180n * SCALE;

  const monthlyScaled = useMemo(() => {
    const annual = annualizeScaled(weeklyScaled, "weekly");
    return fromAnnualScaled(annual, "monthly");
  }, []);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const fmt = (scaled: bigint) =>
    roundDisplay
      ? formatCurrencyFromScaled(scaled, currency, true, displayDecimals)
      : formatCurrencyFromScaled(scaled, currency, false, displayDecimals);

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6">
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4">
            <h1 className="text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              {fmt(weeklyScaled)} per Week to Monthly Rent
            </h1>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f7fbff] p-4 sm:px-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Monthly equivalent (calendar month)
            </div>

            <div className="mt-1 text-3xl sm:text-5xl font-extrabold text-emerald-700">
              {money(monthlyScaled)}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Based on annual equivalence (365-day year)
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="text-xs text-slate-500">4 weeks (28 days)</div>
                <div className="text-sm font-semibold text-slate-800">
                  {money(weeklyScaled * 4n)}
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="text-xs text-emerald-700">
                  True monthly (average)
                </div>
                <div className="text-sm font-semibold text-emerald-900">
                  {money(monthlyScaled)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "USD",
                    )
                  }
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                className="ml-auto inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Convert a different weekly amount →
              </a>
            </div>
          </div>
        </div>
      </section>
      <HowItWorks />
      <ToolFit />
      <FAQ />
    </main>
  );
}
