import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-paycheck";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Per Paycheck Calculator – Weekly, Biweekly, Semimonthly, Monthly Pay",
  },
  {
    name: "description",
    content:
      "Calculate how much rent to set aside from each paycheck. Converts rent to an annual total using standard time-period assumptions, then divides by your pay frequency (weekly, biweekly, semimonthly, monthly). Includes payment counts and clear comparisons.",
  },
  {
    name: "keywords",
    content:
      "rent per paycheck, rent per paycheque, rent per paycheck calculator, biweekly paycheck rent, weekly paycheck rent, semimonthly paycheck rent, twice a month pay rent, rent set aside per paycheck, rent budget per paycheck",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Per Paycheck Calculator – Weekly, Biweekly, Semimonthly, Monthly Pay",
  },
  {
    property: "og:description",
    content:
      "Estimate how much rent to allocate from each paycheck. Uses annual equivalence for consistent comparisons and includes payment counts.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-per-paycheck",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Per Paycheck Calculator – Rent Budgeting by Pay Frequency",
  },
  {
    name: "twitter:description",
    content:
      "Convert rent to an annual total, then see the estimated rent amount per paycheck for weekly, biweekly, semimonthly, or monthly pay.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/rent-per-paycheck" },
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
  weekly: "Weekly paycheck",
  biweekly: "Biweekly paycheck (every 2 weeks)",
  semimonthly: "Semimonthly paycheck (twice per month)",
  monthly: "Monthly paycheck",
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

export default function RentPerPaycheck() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rpc_amount") ?? "2000";
  });

  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(() => {
    if (typeof window === "undefined") return "monthly";
    return (
      (localStorage.getItem("rpc_rentPeriod") as RentPeriod | null) ?? "monthly"
    );
  });

  const [payFreq, setPayFreq] = useState<PayFrequency>(() => {
    if (typeof window === "undefined") return "biweekly";
    return (
      (localStorage.getItem("rpc_payFreq") as PayFrequency | null) ?? "biweekly"
    );
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    return localStorage.getItem("rpc_currency") ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rpc_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpc_amount", amount);
    localStorage.setItem("rpc_rentPeriod", rentPeriod);
    localStorage.setItem("rpc_payFreq", payFreq);
    localStorage.setItem("rpc_currency", currency);
    localStorage.setItem("rpc_rounding", JSON.stringify(includeRounding));
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

  const perPaycheckRaw = useMemo(() => {
    const count = PAY_PERIODS_PER_YEAR[payFreq] || 1;
    return annualRentRaw / count;
  }, [annualRentRaw, payFreq]);

  const perPaycheck = useMemo(() => {
    if (!includeRounding) return perPaycheckRaw;
    return Math.round(perPaycheckRaw * 100) / 100;
  }, [perPaycheckRaw, includeRounding]);

  const paycheckBreakdown = useMemo(() => {
    const weekly = annualRentRaw / PAY_PERIODS_PER_YEAR.weekly;
    const biweekly = annualRentRaw / PAY_PERIODS_PER_YEAR.biweekly;
    const semimonthly = annualRentRaw / PAY_PERIODS_PER_YEAR.semimonthly;
    const monthly = annualRentRaw / PAY_PERIODS_PER_YEAR.monthly;

    return {
      weekly,
      biweekly,
      semimonthly,
      monthly,
    };
  }, [annualRentRaw]);

  const rentBreakdown = useMemo(() => {
    const hourly = convertRent(parsed, rentPeriod, "hourly");
    const daily = convertRent(parsed, rentPeriod, "daily");
    const weekly = convertRent(parsed, rentPeriod, "weekly");
    const biweekly = convertRent(parsed, rentPeriod, "biweekly");
    const every_4_weeks = convertRent(parsed, rentPeriod, "every_4_weeks");
    const monthly = convertRent(parsed, rentPeriod, "monthly");
    const annual = convertRent(parsed, rentPeriod, "annual");

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      annualFromMonthly: monthly * 12,
      annualFromWeekly: weekly * 52,
      annualFrom4Weeks: every_4_weeks * 13,
    };
  }, [parsed, rentPeriod]);

  const annualCounts = useMemo(() => {
    return {
      rentPayments: {
        hourly: 365 * 24,
        daily: 365,
        weekly: 52,
        biweekly: 26,
        every_4_weeks: 13,
        monthly: 12,
        annual: 1,
      },
      paychecks: {
        weekly: 52,
        biweekly: 26,
        semimonthly: 24,
        monthly: 12,
      },
    };
  }, []);

  const pageName = "Rent Per Paycheck Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-per-paycheck";

  const faqData = [
    {
      q: "What does “rent per paycheck” mean?",
      a: "It is the estimated amount of rent to allocate from each paycheck so the total adds up to the same annual rent cost across your pay cycle.",
    },
    {
      q: "Why does semimonthly differ from biweekly?",
      a: "Semimonthly pay is typically 24 paychecks per year. Biweekly pay is typically 26 paychecks per year. With the same annual rent, dividing by 24 versus 26 changes the per-paycheck estimate.",
    },
    {
      q: "How does this handle rent that is paid every 4 weeks?",
      a: "Rent paid every 4 weeks is treated as a 28-day cycle, which corresponds to about 13 payments per year. The calculator converts that to an annual total before estimating amounts per paycheck.",
    },
    {
      q: "If rent is due monthly but pay is biweekly, how is the estimate used?",
      a: "The estimate is an allocation amount. Setting aside that amount each paycheck helps spread a monthly rent cost across the year, even though rent due dates and paycheck dates do not always align.",
    },
    {
      q: "Is the result exact for my calendar and due dates?",
      a: "No. The result is based on standard time-period assumptions and annual equivalence. Actual pay schedules, months, and rent due dates can vary.",
    },
    {
      q: "What assumptions does this calculator use?",
      a: "It uses a 365-day year and an average month length of 365 ÷ 12 days. Weekly is 7 days, biweekly is 14 days, and a 4-week period is 28 days.",
    },
    {
      q: "Does this tell whether rent is affordable?",
      a: "No. This calculator converts and allocates rent across pay cycles. For budgeting context, the rent affordability calculator can help estimate ranges based on income inputs.",
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
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
      },
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

        <h1 className="text-4xl font-bold text-slate-800 mb-4">{pageName}</h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          Estimate how much rent to allocate from each paycheck when rent and
          pay cycles do not match. This calculator converts the rent amount to
          an annual total, then divides it by your pay frequency for consistent
          comparison.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
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
              Estimated rent allocation per paycheck
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(perPaycheck, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)}{" "}
                {RENT_PERIOD_LABEL[rentPeriod].toLowerCase()} converts to{" "}
                <strong>{money(annualRent, currency)}</strong> per year, then
                divides by <strong>{PAY_PERIODS_PER_YEAR[payFreq]}</strong>{" "}
                paychecks per year.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["Weekly paycheck", paycheckBreakdown.weekly, "weekly"],
                  ["Biweekly paycheck", paycheckBreakdown.biweekly, "biweekly"],
                  [
                    "Semimonthly paycheck",
                    paycheckBreakdown.semimonthly,
                    "semimonthly",
                  ],
                  ["Monthly paycheck", paycheckBreakdown.monthly, "monthly"],
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

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Equivalent monthly cost
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 12, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Annual total divided by 12 months.
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Equivalent 4-week cost
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw / 13, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Annual total divided by 13 four-week periods.
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual total</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(annualRentRaw, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Source of truth for all comparisons.
                </div>
              </div>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Annual payment counts
            </h3>
            <p className="text-slate-700 mb-4">
              Rent listings and pay schedules often use different cycles. This
              table shows the standard counts per year used for comparison.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Type</th>
                    <th className="text-left px-4 py-3 font-semibold">Cycle</th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Payments per year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent</td>
                    <td className="px-4 py-3 text-slate-700">Monthly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rentPayments.monthly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent</td>
                    <td className="px-4 py-3 text-slate-700">
                      Every 4 weeks (28 days)
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rentPayments.every_4_weeks}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Rent</td>
                    <td className="px-4 py-3 text-slate-700">Weekly</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.rentPayments.weekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay</td>
                    <td className="px-4 py-3 text-slate-700">
                      Biweekly paycheck
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.paychecks.biweekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay</td>
                    <td className="px-4 py-3 text-slate-700">
                      Semimonthly paycheck
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.paychecks.semimonthly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay</td>
                    <td className="px-4 py-3 text-slate-700">
                      Weekly paycheck
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.paychecks.weekly}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Pay</td>
                    <td className="px-4 py-3 text-slate-700">
                      Monthly paycheck
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {annualCounts.paychecks.monthly}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Visual comparison using the same annual total
              </h4>
              <p className="text-slate-700 text-sm mb-4">
                The calculator converts the input rent to an annual total, then
                shows the same annual cost expressed as a per-paycheck
                allocation and as common rent cycles.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Per paycheck allocation
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(perPaycheckRaw, currency)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {PAY_PERIODS_PER_YEAR[payFreq]} paychecks per year.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Monthly equivalent
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(annualRentRaw / 12, currency)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    12 months per year.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Every 4 weeks equivalent
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(annualRentRaw / 13, currency)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    13 four-week periods per year.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Who this pay cycle mismatch affects most
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Biweekly pay with monthly rent
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Monthly rent has 12 payments per year, while biweekly pay has
                  26 paychecks. The per-paycheck allocation divides the annual
                  rent across those 26 paychecks.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Semimonthly pay and rent timing
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Semimonthly pay is usually 24 paychecks per year. The estimate
                  differs from biweekly because the annual rent is being split
                  into fewer paychecks.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Rent billed every 4 weeks
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  A 4-week schedule typically creates 13 rent payments per year.
                  Comparing that cycle to paychecks is clearer when both are
                  translated into annual totals first.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Rent period breakdown for the entered amount
            </h3>
            <p className="text-slate-700 mb-4">
              This breakdown expresses the entered rent in other time periods
              using the same annual equivalence and standard assumptions.
            </p>

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
              Links to related tools
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
                  href="/rent-paid-every-4-weeks"
                  className="text-sky-700 hover:underline"
                >
                  Rent paid every 4 weeks
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
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Pay
            frequency counts use standard definitions (weekly = 52, biweekly =
            26, semimonthly = 24, monthly = 12). Actual calendars and payroll
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
