import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-vs-take-home-pay";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent vs Take-Home Pay Calculator" },
  {
    name: "description",
    content:
      "Compare rent to take-home pay (after-tax income) using annual equivalence (365-day year). See rent as a percentage of net pay, plus estimated take-home pay left after rent across monthly, weekly, and 4-week cycles.",
  },
  {
    name: "keywords",
    content:
      "rent vs take home pay, rent percentage of take home pay, rent to net income, rent vs after tax income, take home pay rent calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent vs Take-Home Pay Calculator" },
  {
    property: "og:description",
    content:
      "Compare rent to take-home pay using annual equivalence. See rent as a percent of net pay and estimated net pay left after rent across pay cycles.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-vs-take-home-pay",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent vs Take-Home Pay Calculator" },
  {
    name: "twitter:description",
    content:
      "Compare rent to take-home pay using annual equivalence. See rent as a percent of net pay and estimated net pay left after rent across pay cycles.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-vs-take-home-pay",
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
  monthly: "Monthly",
  annual: "Annual",
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

function parseAmount(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 1_000_000_000);
}

function annualize(value: number, period: Period): number {
  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const perDay =
    period === "hourly"
      ? value * 24
      : value / (daysPer[period as Exclude<Period, "hourly">] || 1);

  return perDay * 365;
}

function fromAnnual(annual: number, to: Period): number {
  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const daily = annual / 365;
  if (to === "hourly") return daily / 24;
  return daily * (daysPer[to as Exclude<Period, "hourly">] || 1);
}

export default function RentVsTakeHomePay() {
  const [takeHomePay, setTakeHomePay] = useState<string>(() => {
    if (typeof window === "undefined") return "5000";
    return localStorage.getItem("rc_rvt_takehome") ?? "5000";
  });

  const [takeHomePeriod, setTakeHomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (
      (localStorage.getItem("rc_rvt_takehome_period") as Period) ?? "monthly"
    );
  });

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1800";
    return localStorage.getItem("rc_rvt_rent") ?? "1800";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rvt_rent_period") as Period) ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rvt_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rvt_takehome", takeHomePay);
      localStorage.setItem("rc_rvt_takehome_period", takeHomePeriod);
      localStorage.setItem("rc_rvt_rent", rentAmount);
      localStorage.setItem("rc_rvt_rent_period", rentPeriod);
      localStorage.setItem("rc_rvt_currency", currency);
    } catch {}
  }, [takeHomePay, takeHomePeriod, rentAmount, rentPeriod, currency]);

  const takeHomeParsed = useMemo(() => parseAmount(takeHomePay), [takeHomePay]);
  const rentParsed = useMemo(() => parseAmount(rentAmount), [rentAmount]);

  const result = useMemo(() => {
    const annualTakeHome = annualize(takeHomeParsed, takeHomePeriod);
    const annualRent = annualize(rentParsed, rentPeriod);

    const rentPct =
      annualTakeHome > 0 ? (annualRent / annualTakeHome) * 100 : 0;
    const annualLeft = annualTakeHome - annualRent;

    const avgMonthDays = 365 / 12;

    return {
      annualTakeHome,
      annualRent,
      rentPct,
      annualLeft,

      takeHomeMonthly: fromAnnual(annualTakeHome, "monthly"),
      rentMonthly: fromAnnual(annualRent, "monthly"),
      leftMonthly: fromAnnual(annualLeft, "monthly"),

      takeHomeWeekly: fromAnnual(annualTakeHome, "weekly"),
      rentWeekly: fromAnnual(annualRent, "weekly"),
      leftWeekly: fromAnnual(annualLeft, "weekly"),

      takeHome4w: fromAnnual(annualTakeHome, "every_4_weeks"),
      rent4w: fromAnnual(annualRent, "every_4_weeks"),
      left4w: fromAnnual(annualLeft, "every_4_weeks"),

      avgMonthDays,
      monthMinus4wRent:
        fromAnnual(annualRent, "monthly") -
        fromAnnual(annualRent, "every_4_weeks"),
      monthMinus4wRentPct:
        fromAnnual(annualRent, "every_4_weeks") > 0
          ? (fromAnnual(annualRent, "monthly") -
              fromAnnual(annualRent, "every_4_weeks")) /
            fromAnnual(annualRent, "every_4_weeks")
          : 0,
    };
  }, [takeHomeParsed, takeHomePeriod, rentParsed, rentPeriod]);

  const faqData = [
    {
      q: "What is “take-home pay” on this page?",
      a: "Take-home pay refers to income after payroll deductions, such as taxes and other withholdings. This calculator treats the input as a net amount.",
    },
    {
      q: "What does this tool calculate?",
      a: "It calculates annualized take-home pay, annualized rent, rent as a percentage of take-home pay, and an estimated amount of take-home pay left after rent. It also shows equivalents across monthly, weekly, and 4-week cycles derived from the same annual totals.",
    },
    {
      q: "Why does the comparison convert everything to an annual total?",
      a: "Annualizing both numbers keeps the comparison consistent when rent and pay use different time periods. It prevents mixing calendar months with 4-week cycles.",
    },
    {
      q: "Why do monthly and every-4-weeks amounts differ?",
      a: "Every 4 weeks is always 28 days. An average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals.",
    },
    {
      q: "If my rent is monthly, can I enter take-home pay weekly (or any mix)?",
      a: "Yes. Each input is annualized based on its selected period, then the percentage and remaining income are calculated from annual totals.",
    },
    {
      q: "Does “take-home pay left after rent” include utilities or other bills?",
      a: "No. The remaining amount is take-home pay minus rent only. Other costs are not included in this estimate.",
    },
    {
      q: "What assumptions are used for the time periods?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and 1 month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
    },
    {
      q: "Can this be used for budgeting comparisons across listings?",
      a: "It helps compare rent levels against take-home pay on a consistent basis. Actual affordability varies by household, location, and other expenses.",
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Rent vs Take-Home Pay Calculator",
        item: "https://rentconverter.com/rent-vs-take-home-pay",
      },
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
    name: "Rent vs Take-Home Pay Calculator",
    description:
      "Compare rent to take-home pay using annual equivalence (365-day year). See rent as a percentage of net pay and estimated net pay left after rent.",
    url: "https://rentconverter.com/rent-vs-take-home-pay",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent vs Take-Home Pay Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent vs Take-Home Pay Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Compare rent to take-home pay using a consistent annual basis. This
          helps illustrate the rent share and the remaining net pay after rent,
          even when rent and pay use different cycles.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent affordability calculator
          </a>
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/rent-paid-every-4-weeks"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent paid every 4 weeks
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Compare rent to take-home pay
            </h2>
            <p className="text-sm text-slate-600">
              Both inputs are annualized first using a 365-day year, then the
              rent share and remaining take-home pay are calculated from those
              annual totals.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Take-home pay (net)
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={takeHomePay}
                  onChange={(e) => setTakeHomePay(e.target.value)}
                  placeholder="e.g. 5000"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={takeHomePeriod}
                  onChange={(e) => setTakeHomePeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Take-home pay period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $5,000, 5000.00, or 5000. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  placeholder="e.g. 1800"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={rentPeriod}
                  onChange={(e) => setRentPeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Rent period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Currency"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="NZD">NZD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Currency affects formatting only. The comparison is based on
                annual totals.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">
              Rent share of take-home pay
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {result.rentPct.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-600">
                Annualized rent:{" "}
                <strong>{money(result.annualRent, currency)}</strong> and
                annualized take-home pay:{" "}
                <strong>{money(result.annualTakeHome, currency)}</strong>.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Take-home pay (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(result.annualTakeHome, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Rent (annualized)</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(result.annualRent, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Take-home pay left after rent (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(result.annualLeft, currency)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly, weekly, and 4-week equivalents (from annual totals)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Take-home per month (avg):{" "}
                    <strong className="text-slate-900">
                      {money(result.takeHomeMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per month (avg):{" "}
                    <strong className="text-slate-900">
                      {money(result.rentMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Left per month (avg):{" "}
                    <strong className="text-slate-900">
                      {money(result.leftMonthly, currency)}
                    </strong>
                  </div>

                  <div className="text-sm text-slate-700">
                    Take-home per week:{" "}
                    <strong className="text-slate-900">
                      {money(result.takeHomeWeekly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per week:{" "}
                    <strong className="text-slate-900">
                      {money(result.rentWeekly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Left per week:{" "}
                    <strong className="text-slate-900">
                      {money(result.leftWeekly, currency)}
                    </strong>
                  </div>

                  <div className="text-sm text-slate-700">
                    Take-home per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(result.takeHome4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(result.rent4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Left per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(result.left4w, currency)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs every 4 weeks (rent)
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly rent (avg) minus 4-week rent:{" "}
                    <strong className="text-slate-900">
                      {money(result.monthMinus4wRent, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {(result.monthMinus4wRentPct * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  A 4-week period is 28 days. An average month is{" "}
                  {result.avgMonthDays.toFixed(2)} days (365 ÷ 12), so the
                  amounts are not interchangeable.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). Exact pay dates and rent
            due dates vary by employer and agreement.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <p className="text-slate-700 mb-4">
          This calculator compares rent to take-home pay by converting both
          inputs to annual totals first. That allows a consistent comparison
          even if rent is monthly and take-home pay is weekly, biweekly, or
          every 4 weeks.
        </p>

        <p className="text-slate-700 mb-4">
          Enter the take-home pay amount you receive, pick the period it applies
          to, then enter rent using its billing period. The main result shows
          rent as a percentage of annualized take-home pay and an estimated
          amount of take-home pay left after rent.
        </p>

        <p className="text-slate-700 mb-4">
          The monthly, weekly, and 4-week figures shown below are derived from
          the same annual totals. This keeps the math consistent and makes the
          monthly versus 4-week differences visible.
        </p>

        <p className="text-slate-600 text-sm">
          The output is an estimate intended for comparison. Real cash flow
          depends on pay timing, rent due dates, and other household costs.
        </p>

        <p className="text-slate-700 mt-6">
          Related pages:{" "}
          <a
            href="/rent-affordability-calculator"
            className="text-sky-700 hover:underline"
          >
            rent affordability calculator
          </a>
          ,{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          , and{" "}
          <a
            href="/rent-paid-every-4-weeks"
            className="text-sky-700 hover:underline"
          >
            rent paid every 4 weeks
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6">
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

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and average month
            length) and simplified models. Results are estimates, not
            guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice.
            Rental costs, affordability, payment schedules, and obligations vary
            by location, landlord, lease terms, and individual circumstances.
            Always review your lease agreement and consult qualified
            professionals before making financial decisions.
          </p>
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
