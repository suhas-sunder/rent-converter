import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-as-percentage-of-income";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent as Percentage of Income Calculator" },
  {
    name: "description",
    content:
      "Calculate rent as a percentage of income using annual equivalence (365-day year). Compare monthly, weekly, 4-week, and annual pay cycles with a clear breakdown of annualized income and rent.",
  },
  {
    name: "keywords",
    content:
      "rent as percentage of income, rent to income ratio calculator, rent income percentage, rent affordability percentage, monthly rent percentage of income, weekly pay rent percentage, 4 week pay rent percentage",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent as Percentage of Income Calculator" },
  {
    property: "og:description",
    content:
      "Calculate rent as a percentage of income using annual equivalence (365-day year). Includes pay-cycle comparisons and annualized breakdowns.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-as-percentage-of-income",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent as Percentage of Income Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate rent as a percentage of income using annual equivalence (365-day year). Includes pay-cycle comparisons and annualized breakdowns.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-as-percentage-of-income",
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

function pct(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
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
  if (!Number.isFinite(value)) return 0;

  // Source of truth: a 365-day year, with an average month length (365 ÷ 12)
  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const daily =
    period === "hourly"
      ? value * 24
      : value / (daysPer[period as Exclude<Period, "hourly">] || 1);

  return daily * 365;
}

function convertAnnualTo(valueAnnual: number, to: Period): number {
  if (!Number.isFinite(valueAnnual)) return 0;

  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const daily = valueAnnual / 365;

  if (to === "hourly") return daily / 24;
  return daily * (daysPer[to as Exclude<Period, "hourly">] || 1);
}

export default function RentAsPercentageOfIncome() {
  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_rpi_rent_amount") ?? "2200";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rpi_rent_period") as Period) ?? "monthly";
  });

  const [incomeAmount, setIncomeAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "6500";
    return localStorage.getItem("rc_rpi_income_amount") ?? "6500";
  });

  const [incomePeriod, setIncomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (
      (localStorage.getItem("rc_rpi_income_period") as Period) ?? "monthly"
    );
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    return localStorage.getItem("rc_rpi_currency") ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_rpi_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rpi_rent_amount", rentAmount);
      localStorage.setItem("rc_rpi_rent_period", rentPeriod);
      localStorage.setItem("rc_rpi_income_amount", incomeAmount);
      localStorage.setItem("rc_rpi_income_period", incomePeriod);
      localStorage.setItem("rc_rpi_currency", currency);
      localStorage.setItem("rc_rpi_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [
    rentAmount,
    rentPeriod,
    incomeAmount,
    incomePeriod,
    currency,
    includeRounding,
  ]);

  const rentParsed = useMemo(() => parseAmount(rentAmount), [rentAmount]);
  const incomeParsed = useMemo(() => parseAmount(incomeAmount), [incomeAmount]);

  const computed = useMemo(() => {
    const annualRent = annualize(rentParsed, rentPeriod);
    const annualIncome = annualize(incomeParsed, incomePeriod);

    const ratio = annualIncome > 0 ? (annualRent / annualIncome) * 100 : 0;

    const ratioRounded = includeRounding
      ? Math.round(ratio * 100) / 100
      : ratio;

    return {
      annualRent,
      annualIncome,
      ratio: ratioRounded,

      rentMonthly: convertAnnualTo(annualRent, "monthly"),
      rentWeekly: convertAnnualTo(annualRent, "weekly"),
      rent4w: convertAnnualTo(annualRent, "every_4_weeks"),

      incomeMonthly: convertAnnualTo(annualIncome, "monthly"),
      incomeWeekly: convertAnnualTo(annualIncome, "weekly"),
      income4w: convertAnnualTo(annualIncome, "every_4_weeks"),

      // A simple illustration of pay-cycle mismatch: rent converted to a 4-week basis
      // and income converted to a 4-week basis (both via annual equivalence).
      ratioOn4wBasis:
        convertAnnualTo(annualIncome, "every_4_weeks") > 0
          ? (convertAnnualTo(annualRent, "every_4_weeks") /
              convertAnnualTo(annualIncome, "every_4_weeks")) *
            100
          : 0,

      // The payment counts implied by each period (for explanation copy)
      paymentsPerYearRent:
        rentPeriod === "annual"
          ? 1
          : rentPeriod === "monthly"
            ? 12
            : rentPeriod === "every_4_weeks"
              ? 365 / 28
              : rentPeriod === "biweekly"
                ? 365 / 14
                : rentPeriod === "weekly"
                  ? 365 / 7
                  : rentPeriod === "daily"
                    ? 365
                    : 365 * 24,

      paymentsPerYearIncome:
        incomePeriod === "annual"
          ? 1
          : incomePeriod === "monthly"
            ? 12
            : incomePeriod === "every_4_weeks"
              ? 365 / 28
              : incomePeriod === "biweekly"
                ? 365 / 14
                : incomePeriod === "weekly"
                  ? 365 / 7
                  : incomePeriod === "daily"
                    ? 365
                    : 365 * 24,
    };
  }, [rentParsed, rentPeriod, incomeParsed, incomePeriod, includeRounding]);

  const faqData = [
    {
      q: "What does “rent as a percentage of income” represent?",
      a: "It is an estimate of how much of your income is associated with rent over the same time horizon. This page annualizes both values first so different pay cycles can be compared consistently.",
    },
    {
      q: "How does this calculator handle weekly pay, biweekly pay, and 4-week pay?",
      a: "Both rent and income are converted to an annual total using a 365-day year, then the ratio is calculated from those annual totals. This avoids mixing 12-month assumptions with 28-day pay cycles.",
    },
    {
      q: "Why does “every 4 weeks” behave differently than “monthly”?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals, which changes the percentage.",
    },
    {
      q: "Can I enter rent as monthly and income as hourly (or any mix)?",
      a: "Yes. The calculation annualizes each input separately using the selected period, then compares them on the same annual basis.",
    },
    {
      q: "Is this based on take-home pay or gross pay?",
      a: "It works with either, as long as the income number matches what you want to compare against. Taxes, deductions, benefits, and irregular income can make real cash flow different from a simple ratio.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. This is a rent-to-income comparison only. If your housing cost includes add-ons, you can include them in the rent input to estimate a combined housing payment percentage.",
    },
    {
      q: "What happens if income is zero or blank?",
      a: "The calculator shows 0% to avoid invalid math. Enter a positive income amount to compute a meaningful percentage.",
    },
    {
      q: "What assumptions does the math use?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Your actual pay dates and billing rules can differ.",
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
        name: "Rent as Percentage of Income Calculator",
        item: "https://rentconverter.com/rent-as-percentage-of-income",
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
    name: "Rent as Percentage of Income Calculator",
    description:
      "Calculate rent as a percentage of income using annual equivalence (365-day year). Compare pay cycles with annualized breakdowns.",
    url: "https://rentconverter.com/rent-as-percentage-of-income",
  };

  const ratioOn4w = includeRounding
    ? Math.round(computed.ratioOn4wBasis * 100) / 100
    : computed.ratioOn4wBasis;

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent as Percentage of Income Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent as Percentage of Income Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Estimate rent as a share of income using a consistent
          annual-equivalence method. This helps compare different rent billing
          cycles and pay cycles on the same basis.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Affordability calculator
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
            Paid every 4 weeks
          </a>
          <a
            href="/true-cost-of-rent-per-day"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            True cost per day
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Calculate rent as a percentage of income
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  placeholder="e.g. 2200"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={rentPeriod}
                  onChange={(e) => setRentPeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Rent period"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="every_4_weeks">Every 4 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $2,200, 2200.00, or 2200. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Income amount
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="e.g. 6500"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={incomePeriod}
                  onChange={(e) => setIncomePeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Income period"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="every_4_weeks">Every 4 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-slate-500">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Estimated rent share</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {pct(computed.ratio)}
              </div>
              <div className="text-sm text-slate-600">
                Based on annualized totals:{" "}
                <strong>{money(computed.annualRent, currency)}</strong> rent per
                year compared with{" "}
                <strong>{money(computed.annualIncome, currency)}</strong> income
                per year.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annualized rent</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualRent, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annualized income</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualIncome, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Rent share (annual basis)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {pct(computed.ratio)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Pay-cycle comparison (monthly vs every 4 weeks)
                </div>
                <div className="mt-2 grid gap-2 lg:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Rent per month (avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.rentMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(computed.rent4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Ratio on 4-week basis:{" "}
                    <strong className="text-slate-900">{pct(ratioOn4w)}</strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This compares rent and income on the same 4-week unit after
                  both are annualized first. A 28-day cycle is not the same
                  length as a calendar month.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Quick breakdown (annualized, then converted)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-sm text-slate-700">
                    Rent per week:{" "}
                    <strong className="text-slate-900">
                      {money(computed.rentWeekly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Income per week:{" "}
                    <strong className="text-slate-900">
                      {money(computed.incomeWeekly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(computed.rent4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Income per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(computed.income4w, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  These figures are derived from the same annual totals to keep
                  comparisons consistent.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            every 4 weeks = 28 days, month = 365 ÷ 12 days (average). Exact pay
            dates, billing dates, and proration rules depend on the agreement.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          What this percentage helps illustrate
        </h2>

        <p className="text-slate-700 mb-4">
          A percentage puts rent and income on one comparable scale. It can help
          compare two rentals when income is stable, or highlight when a pay
          cycle and a rent billing cycle do not line up cleanly.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why annualizing first avoids hidden mismatches
        </h3>
        <p className="text-slate-700 mb-4">
          Rent and income are often described using different time periods. If
          one number is monthly and the other is every 4 weeks, converting both
          to an annual total first keeps the math consistent. That is why this
          calculator treats annual cost as the source of truth.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 mt-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            Payment counts per year implied by your selections
          </h4>
          <p className="text-slate-700 mb-2">
            Rent period: <strong>{PERIOD_LABEL[rentPeriod]}</strong> (about{" "}
            <strong>{computed.paymentsPerYearRent.toFixed(2)}</strong>{" "}
            occurrences per year using a 365-day year)
          </p>
          <p className="text-slate-700">
            Income period: <strong>{PERIOD_LABEL[incomePeriod]}</strong> (about{" "}
            <strong>{computed.paymentsPerYearIncome.toFixed(2)}</strong>{" "}
            occurrences per year using a 365-day year)
          </p>
          <p className="mt-3 text-xs text-slate-500">
            This is a calendar-length estimate. Real pay schedules can include
            leap years, holidays, and employer-specific cutoffs.
          </p>
        </div>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          When the percentage can differ from real cash flow
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Taxes, deductions, and benefits can change take-home pay relative to
            gross pay.
          </li>
          <li>
            Irregular hours, commissions, and seasonal income can make any
            single-period ratio unstable.
          </li>
          <li>
            Upfront costs (deposits, fees, moving costs) are not reflected in an
            ongoing rent percentage.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
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

      <section className="max-w-6xl mx-auto px-6 pb-8 pt-10">
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
