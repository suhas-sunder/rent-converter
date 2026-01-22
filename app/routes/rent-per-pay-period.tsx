import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-pay-period";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Per Pay Period Calculator – Weekly, Biweekly, Semimonthly, Monthly Pay",
  },
  {
    name: "description",
    content:
      "Calculate the estimated rent amount per pay period. Converts rent to an annual total using standard time-period assumptions, then divides by your pay frequency (weekly, biweekly, semimonthly, monthly). Includes payment counts and clear comparisons.",
  },
  {
    name: "keywords",
    content:
      "rent per pay period, rent per paycheck, rent per paycheque, rent per pay period calculator, biweekly rent per pay period, semimonthly rent per pay period, weekly pay period rent, rent allocation per pay period",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Per Pay Period Calculator – Weekly, Biweekly, Semimonthly, Monthly Pay",
  },
  {
    property: "og:description",
    content:
      "Estimate the rent amount per pay period by converting rent to an annual total and dividing by your pay frequency.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-per-pay-period",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Per Pay Period Calculator",
  },
  {
    name: "twitter:description",
    content:
      "Convert rent to an annual total, then estimate the rent amount per pay period for weekly, biweekly, semimonthly, or monthly pay.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/rent-per-pay-period" },
];

type RentPeriod =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

const RENT_PERIOD_LABEL: Record<RentPeriod, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

const PAY_LABEL: Record<PayFrequency, string> = {
  weekly: "Weekly pay period",
  biweekly: "Biweekly pay period (every 2 weeks)",
  semimonthly: "Semimonthly pay period (twice per month)",
  monthly: "Monthly pay period",
};

const PAY_PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

function money(n: number, currency: string) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: n < 10 ? 2 : 0,
  }).format(n);
}

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function convertRent(value: number, from: RentPeriod, to: RentPeriod): number {
  if (!Number.isFinite(value)) return 0;
  if (from === to) return value;

  const daysPer: Record<Exclude<RentPeriod, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const toDaily = (v: number, p: RentPeriod) => {
    if (p === "hourly") return v * 24;
    return v / (daysPer[p as Exclude<RentPeriod, "hourly">] || 1);
  };

  const fromDaily = (dailyValue: number, p: RentPeriod) => {
    if (p === "hourly") return dailyValue / 24;
    return dailyValue * (daysPer[p as Exclude<RentPeriod, "hourly">] || 1);
  };

  const perDay = toDaily(value, from);
  return fromDaily(perDay, to);
}

export default function RentPerPayPeriod() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpp_amount") ?? "2000";
  });

  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(() => {
    if (typeof window === "undefined") return "monthly";
    return (
      (localStorage.getItem("rpp_rentPeriod") as RentPeriod | null) ?? "monthly"
    );
  });

  const [payFreq, setPayFreq] = useState<PayFrequency>(() => {
    if (typeof window === "undefined") return "biweekly";
    return (
      (localStorage.getItem("rpp_payFreq") as PayFrequency | null) ?? "biweekly"
    );
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    return localStorage.getItem("rpp_currency") ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rpp_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpp_amount", amount);
    localStorage.setItem("rpp_rentPeriod", rentPeriod);
    localStorage.setItem("rpp_payFreq", payFreq);
    localStorage.setItem("rpp_currency", currency);
    localStorage.setItem("rpp_rounding", JSON.stringify(includeRounding));
  }, [amount, rentPeriod, payFreq, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const annualRentRaw = useMemo(
    () => convertRent(parsed, rentPeriod, "annual"),
    [parsed, rentPeriod],
  );

  const annualRent = useMemo(() => {
    if (!includeRounding) return annualRentRaw;
    return Math.round(annualRentRaw * 100) / 100;
  }, [annualRentRaw, includeRounding]);

  const perPayPeriodRaw = useMemo(() => {
    const count = PAY_PERIODS_PER_YEAR[payFreq] || 1;
    return annualRentRaw / count;
  }, [annualRentRaw, payFreq]);

  const perPayPeriod = useMemo(() => {
    if (!includeRounding) return perPayPeriodRaw;
    return Math.round(perPayPeriodRaw * 100) / 100;
  }, [perPayPeriodRaw, includeRounding]);

  const payBreakdown = useMemo(() => {
    const weekly = annualRentRaw / PAY_PERIODS_PER_YEAR.weekly;
    const biweekly = annualRentRaw / PAY_PERIODS_PER_YEAR.biweekly;
    const semimonthly = annualRentRaw / PAY_PERIODS_PER_YEAR.semimonthly;
    const monthly = annualRentRaw / PAY_PERIODS_PER_YEAR.monthly;
    return { weekly, biweekly, semimonthly, monthly };
  }, [annualRentRaw]);

  const rentBreakdown = useMemo(() => {
    const hourly = convertRent(parsed, rentPeriod, "hourly");
    const daily = convertRent(parsed, rentPeriod, "daily");
    const weekly = convertRent(parsed, rentPeriod, "weekly");
    const biweekly = convertRent(parsed, rentPeriod, "biweekly");
    const every_4_weeks = convertRent(parsed, rentPeriod, "every_4_weeks");
    const monthly = convertRent(parsed, rentPeriod, "monthly");
    const annual = convertRent(parsed, rentPeriod, "annual");
    return { hourly, daily, weekly, biweekly, every_4_weeks, monthly, annual };
  }, [parsed, rentPeriod]);

  const annualCounts = useMemo(
    () => ({
      rent: {
        hourly: 365 * 24,
        daily: 365,
        weekly: 52,
        biweekly: 26,
        every_4_weeks: 13,
        monthly: 12,
        annual: 1,
      },
      pay: {
        weekly: 52,
        biweekly: 26,
        semimonthly: 24,
        monthly: 12,
      },
    }),
    [],
  );

  const pageName = "Rent Per Pay Period Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-per-pay-period";

  const faqData = [
    {
      q: "What is a “pay period” in this calculator?",
      a: "A pay period is the payroll cycle used to receive income (weekly, biweekly, semimonthly, or monthly). The calculator divides the annual rent total by the number of pay periods per year.",
    },
    {
      q: "Why does semimonthly produce a different number than biweekly?",
      a: "Semimonthly pay usually means 24 pay periods per year, while biweekly pay usually means 26. Dividing the same annual rent by 24 versus 26 changes the estimated amount per pay period.",
    },
    {
      q: "How does the calculator handle rent that is billed every 4 weeks?",
      a: "A 4-week billing cycle is treated as 28 days, which corresponds to about 13 payments per year. The rent is converted to an annual total before it is split across pay periods.",
    },
    {
      q: "If rent is due monthly, how can a per-pay-period number help?",
      a: "It helps illustrate how a monthly cost spreads across the year when income arrives on a different schedule. Rent due dates and payroll dates can still vary by calendar and employer.",
    },
    {
      q: "Does this include utilities, parking, or other housing costs?",
      a: "No. The calculator converts and allocates the rent amount entered. Other housing costs can be added separately for budgeting comparisons.",
    },
    {
      q: "What assumptions does this calculator use?",
      a: "It uses a 365-day year and an average month length of 365 ÷ 12 days. Weekly is 7 days, biweekly is 14 days, and a 4-week period is 28 days.",
    },
  ];

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="text-sm text-slate-500 mb-4">
          <a href="/" className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
        </nav>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent and Pay Periods Often Do Not Match
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          This calculator estimates the rent amount per pay period when rent is
          listed in one cycle and income arrives in another. It converts rent to
          an annual total first, then divides by the number of pay periods per
          year for consistent comparison.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Rent per pay period
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="AUD">AUD</option>
                  <option value="NZD">NZD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Inputs accept pasted values such as $2,000 or 2000.00. The value
                is cleaned automatically.
              </p>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent is listed as
              </label>
              <select
                value={rentPeriod}
                onChange={(e) => setRentPeriod(e.target.value as RentPeriod)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "hourly",
                    "daily",
                    "weekly",
                    "biweekly",
                    "every_4_weeks",
                    "monthly",
                    "annual",
                  ] as RentPeriod[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {RENT_PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pay frequency
              </label>
              <select
                value={payFreq}
                onChange={(e) => setPayFreq(e.target.value as PayFrequency)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "weekly",
                    "biweekly",
                    "semimonthly",
                    "monthly",
                  ] as PayFrequency[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {PAY_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">
              Estimated rent amount per pay period
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(perPayPeriod, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)}{" "}
                {RENT_PERIOD_LABEL[rentPeriod].toLowerCase()} converts to{" "}
                <strong>{money(annualRent, currency)}</strong> per year, then
                divides by <strong>{PAY_PERIODS_PER_YEAR[payFreq]}</strong> pay
                periods per year.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["Weekly", payBreakdown.weekly, "weekly"],
                  ["Biweekly", payBreakdown.biweekly, "biweekly"],
                  ["Semimonthly", payBreakdown.semimonthly, "semimonthly"],
                  ["Monthly", payBreakdown.monthly, "monthly"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-slate-500">
                    {label} pay period
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(
                      includeRounding ? Math.round(val * 100) / 100 : val,
                      currency,
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">
                Annual total (source of truth)
              </div>
              <div className="mt-1 text-lg font-bold text-slate-800">
                {money(annualRentRaw, currency)}
              </div>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Annual payment count table
            </h3>
            <p className="text-slate-700 mb-4">
              The calculator uses standard counts per year so rent and pay
              cycles can be compared through annual totals.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">Cycle</th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Count per year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent listing</td>
                    <td className="px-4 py-3 text-slate-700">Monthly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rent.monthly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent listing</td>
                    <td className="px-4 py-3 text-slate-700">
                      Every 4 weeks (28 days)
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rent.every_4_weeks}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent listing</td>
                    <td className="px-4 py-3 text-slate-700">Weekly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rent.weekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay period</td>
                    <td className="px-4 py-3 text-slate-700">Weekly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.pay.weekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay period</td>
                    <td className="px-4 py-3 text-slate-700">Biweekly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.pay.biweekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay period</td>
                    <td className="px-4 py-3 text-slate-700">Semimonthly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.pay.semimonthly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay period</td>
                    <td className="px-4 py-3 text-slate-700">Monthly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.pay.monthly}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Visual comparison based on the same annual rent
            </h3>
            <p className="text-slate-700 mb-4">
              These figures represent the same annual rent total expressed in
              different ways. This helps illustrate why biweekly and semimonthly
              allocations differ even when rent is unchanged.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Weekly allocation</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 52, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">Annual ÷ 52</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">
                  Biweekly allocation
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 26, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">Annual ÷ 26</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">
                  Semimonthly allocation
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 24, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">Annual ÷ 24</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Monthly equivalent</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 12, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">Annual ÷ 12</div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Who this mismatch affects most
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Monthly rent with biweekly pay
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Monthly rent collects 12 payments per year while biweekly pay
                  typically produces 26 pay periods. Annual equivalence provides
                  a consistent base for allocation.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Semimonthly pay in shorter months
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Semimonthly pay is usually 24 pay periods per year. The
                  per-period estimate stays consistent by annual total even
                  though calendar months vary in length.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  4-week rent billed against pay cycles
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  A 4-week billing cycle is 28 days and often leads to about 13
                  rent payments per year. Translating both rent and pay into
                  annual terms prevents misleading comparisons.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Rent period breakdown for the entered amount
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Hourly", rentBreakdown.hourly, "hourly"],
                  ["Daily", rentBreakdown.daily, "daily"],
                  ["Weekly", rentBreakdown.weekly, "weekly"],
                  ["Every 2 weeks", rentBreakdown.biweekly, "biweekly"],
                  [
                    "Every 4 weeks (28 days)",
                    rentBreakdown.every_4_weeks,
                    "every_4_weeks",
                  ],
                  ["Monthly", rentBreakdown.monthly, "monthly"],
                  ["Annual", rentBreakdown.annual, "annual"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(
                      includeRounding ? Math.round(val * 100) / 100 : val,
                      currency,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Related pages
            </h3>
            <ul className="list-disc ml-6 text-slate-700">
              <li>
                <a
                  href="/rent-paid-weekly-vs-monthly"
                  className="text-sky-700 hover:underline"
                >
                  Weekly vs monthly rent
                </a>
              </li>
              <li>
                <a
                  href="/rent-converter"
                  className="text-sky-700 hover:underline"
                >
                  Rent converter hub
                </a>
              </li>
              <li>
                <a
                  href="/rent-affordability-calculator"
                  className="text-sky-700 hover:underline"
                >
                  Rent affordability calculator
                </a>
              </li>
              <li>
                <a
                  href="/rent-billed-every-28-days"
                  className="text-sky-700 hover:underline"
                >
                  Rent billed every 28 days
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
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
          </section>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Pay period
            counts use standard definitions (weekly = 52, biweekly = 26,
            semimonthly = 24, monthly = 12). Actual calendars and payroll
            schedules vary.
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
          </em>
        </p>
      </section>

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
