import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-after-tax-income";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent After-Tax Income Calculator" },
  {
    name: "description",
    content:
      "Estimate after-tax (net) income from a pre-tax income and an effective tax rate, then compare rent to that net income using annual equivalence (365-day year). Includes net income after rent and pay-cycle comparisons.",
  },
  {
    name: "keywords",
    content:
      "rent after tax income, rent percentage of net income, after tax income rent calculator, rent to net income, take home pay rent percentage",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },
  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent After-Tax Income Calculator" },
  {
    property: "og:description",
    content:
      "Estimate net income from pre-tax income and an effective tax rate, then compare rent to net income using annual equivalence. Includes income left after rent.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-after-tax-income",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent After-Tax Income Calculator" },
  {
    name: "twitter:description",
    content:
      "Estimate net income from pre-tax income and an effective tax rate, then compare rent to net income using annual equivalence. Includes income left after rent.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },
  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-after-tax-income",
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

function parsePercent(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 100);
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

  const daily =
    period === "hourly"
      ? value * 24
      : value / (daysPer[period as Exclude<Period, "hourly">] || 1);

  return daily * 365;
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

export default function RentAfterTaxIncome() {
  const [grossIncome, setGrossIncome] = useState<string>(() => {
    if (typeof window === "undefined") return "60000";
    return localStorage.getItem("rc_rati_gross") ?? "60000";
  });

  const [incomePeriod, setIncomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "annual";
    return (
      (localStorage.getItem("rc_rati_income_period") as Period) ?? "annual"
    );
  });

  const [taxRate, setTaxRate] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    return localStorage.getItem("rc_rati_tax_rate") ?? "25";
  });

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_rati_rent") ?? "2200";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rati_rent_period") as Period) ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rati_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rati_gross", grossIncome);
      localStorage.setItem("rc_rati_income_period", incomePeriod);
      localStorage.setItem("rc_rati_tax_rate", taxRate);
      localStorage.setItem("rc_rati_rent", rentAmount);
      localStorage.setItem("rc_rati_rent_period", rentPeriod);
      localStorage.setItem("rc_rati_currency", currency);
    } catch {}
  }, [grossIncome, incomePeriod, taxRate, rentAmount, rentPeriod, currency]);

  const grossParsed = useMemo(() => parseAmount(grossIncome), [grossIncome]);
  const rentParsed = useMemo(() => parseAmount(rentAmount), [rentAmount]);
  const taxParsed = useMemo(() => parsePercent(taxRate), [taxRate]);

  const computed = useMemo(() => {
    const annualGross = annualize(grossParsed, incomePeriod);
    const effectiveTax = taxParsed / 100;

    const annualNet = annualGross * (1 - effectiveTax);
    const annualRent = annualize(rentParsed, rentPeriod);

    const rentShareNet = annualNet > 0 ? (annualRent / annualNet) * 100 : 0;

    const annualNetAfterRent = annualNet - annualRent;

    return {
      annualGross,
      annualNet,
      annualRent,
      annualNetAfterRent,
      rentShareNet,

      grossMonthly: fromAnnual(annualGross, "monthly"),
      netMonthly: fromAnnual(annualNet, "monthly"),
      rentMonthly: fromAnnual(annualRent, "monthly"),
      netAfterRentMonthly: fromAnnual(annualNetAfterRent, "monthly"),

      net4w: fromAnnual(annualNet, "every_4_weeks"),
      rent4w: fromAnnual(annualRent, "every_4_weeks"),
      netAfterRent4w: fromAnnual(annualNetAfterRent, "every_4_weeks"),

      netWeekly: fromAnnual(annualNet, "weekly"),
      rentWeekly: fromAnnual(annualRent, "weekly"),
      netAfterRentWeekly: fromAnnual(annualNetAfterRent, "weekly"),

      avgMonthDays: 365 / 12,
      fourWeekCyclesPerYear: 365 / 28,
    };
  }, [grossParsed, incomePeriod, taxParsed, rentParsed, rentPeriod]);

  const faqData = [
    {
      q: "What is an “effective tax rate” in this calculator?",
      a: "It is a single percentage used to estimate take-home income from pre-tax income. It is a simplified estimate and can differ from actual withholding and year-end taxes.",
    },
    {
      q: "What numbers does this page calculate?",
      a: "It estimates annual after-tax income, annual rent, rent as a percentage of after-tax income, and estimated after-tax income left after rent. It also shows monthly, weekly, and 4-week equivalents derived from the same annual totals.",
    },
    {
      q: "Why does the calculator use annual equivalence?",
      a: "Annualizing both income and rent keeps comparisons consistent across time periods. It avoids mixing 12-month assumptions with 4-week cycles.",
    },
    {
      q: "Why does “every 4 weeks” differ from “monthly”?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, the totals differ.",
    },
    {
      q: "Does this include utilities, parking, or other housing costs?",
      a: "No. It compares rent to income. If you want a combined housing payment estimate, those amounts can be added to the rent input.",
    },
    {
      q: "Is the result the same as a budgeting recommendation?",
      a: "No. The results illustrate relationships between rent and estimated take-home income. Actual affordability depends on debts, household size, location, and other expenses.",
    },
    {
      q: "Can I enter monthly rent but annual income (or any mix)?",
      a: "Yes. Each input is annualized based on its own selected period before the percentage is calculated.",
    },
    {
      q: "What assumptions are used for time periods?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and 1 month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
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
        name: "Rent After-Tax Income Calculator",
        item: "https://rentconverter.com/rent-after-tax-income",
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
    name: "Rent After-Tax Income Calculator",
    description:
      "Estimate take-home income from pre-tax income and an effective tax rate, then compare rent to after-tax income using annual equivalence (365-day year).",
    url: "https://rentconverter.com/rent-after-tax-income",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent After-Tax Income Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent After-Tax Income Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Enter pre-tax income, an effective tax rate, and rent. This page
          estimates after-tax income and shows rent as a share of that take-home
          amount using a consistent annual basis.
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
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Estimate rent share using after-tax income
            </h2>
            <p className="text-sm text-slate-600">
              Income is converted to an annual amount first, then reduced by the
              effective tax rate to estimate take-home income. Rent is also
              annualized, and the percentage is calculated from those annual
              totals.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pre-tax income
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(e.target.value)}
                  placeholder="e.g. 60000"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={incomePeriod}
                  onChange={(e) => setIncomePeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Income period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $60,000, 60000.00, or 60000. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Effective tax rate
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                  %
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This is a simplified estimate. Actual withholding and deductions
                vary.
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
                  placeholder="e.g. 2200"
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
                Currency affects formatting only. The math uses the same annual
                assumptions.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">
              Rent share of estimated after-tax income
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {computed.rentShareNet.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-600">
                Estimated after-tax income:{" "}
                <strong>{money(computed.annualNet, currency)}</strong> per year.
                Annualized rent:{" "}
                <strong>{money(computed.annualRent, currency)}</strong> per
                year.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual pre-tax income (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualGross, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual after-tax income (estimated)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualNet, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual after-tax income left after rent
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualNetAfterRent, currency)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs every 4 weeks (derived from annual totals)
                </div>
                <div className="mt-2 grid gap-2 lg:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Net per month (avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.netMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Net per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(computed.net4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Rent per 4 weeks:{" "}
                    <strong className="text-slate-900">
                      {money(computed.rent4w, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  A 4-week period is 28 days. An average month is{" "}
                  {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12), so the
                  amounts are not interchangeable.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Net income after rent across common cycles
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Net after rent (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.netAfterRentMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Net after rent (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.netAfterRent4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Net after rent (weekly):{" "}
                    <strong className="text-slate-900">
                      {money(computed.netAfterRentWeekly, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  These are estimates computed from the same annual after-tax
                  income and annualized rent.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). The tax rate is an input
            estimate and does not model tax brackets, deductions, or credits.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <p className="text-slate-700 mb-4">
          This page estimates after-tax income by taking your pre-tax income and
          applying a single effective tax rate. It then compares rent to that
          estimated take-home income by converting both numbers to annual totals
          first.
        </p>

        <p className="text-slate-700 mb-4">
          Enter the income figure you have available, choose the income period,
          and set an effective tax rate that reflects your situation. Then enter
          rent using its billing period. The results show the estimated rent
          share of after-tax income and an estimated amount of after-tax income
          left after rent.
        </p>

        <p className="text-slate-700 mb-4">
          The monthly, weekly, and 4-week figures shown here are derived from
          the same annual totals. That is why a 4-week amount differs from a
          calendar-month amount, even when they look similar at a glance.
        </p>

        <p className="text-slate-600 text-sm">
          The output is an estimate intended for comparison. Real pay timing,
          deductions, and housing costs vary by household, employer, and lease
          terms.
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
