import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-increase-percentage-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent Increase Percentage Calculator" },
  {
    name: "description",
    content:
      "Calculate the percentage rent increase between an old rent and a new rent using annual equivalence (365-day year). Shows the change per period and the annual impact, with monthly vs 4-week comparisons.",
  },
  {
    name: "keywords",
    content:
      "rent increase percentage, rent increase percent calculator, percentage increase in rent, calculate rent raise percentage, old rent vs new rent percent increase",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent Increase Percentage Calculator" },
  {
    property: "og:description",
    content:
      "Calculate the percentage rent increase between an old rent and a new rent using annual equivalence. Includes per-period equivalents and annual impact.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-increase-percentage",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Increase Percentage Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate the percentage rent increase between old and new rent using annual equivalence. Includes pay-cycle equivalents and annual impact.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-increase-percentage",
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

export default function RentIncreasePercentage() {
  const [oldRent, setOldRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rc_rip_old") ?? "2000";
  });

  const [newRent, setNewRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2100";
    return localStorage.getItem("rc_rip_new") ?? "2100";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rip_period") as Period) ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rip_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rip_old", oldRent);
      localStorage.setItem("rc_rip_new", newRent);
      localStorage.setItem("rc_rip_period", period);
      localStorage.setItem("rc_rip_currency", currency);
    } catch {}
  }, [oldRent, newRent, period, currency]);

  const oldParsed = useMemo(() => parseAmount(oldRent), [oldRent]);
  const newParsed = useMemo(() => parseAmount(newRent), [newRent]);

  const computed = useMemo(() => {
    const annualOld = annualize(oldParsed, period);
    const annualNew = annualize(newParsed, period);

    const annualDelta = annualNew - annualOld;
    const pct =
      annualOld > 0 ? (annualDelta / annualOld) * 100 : annualNew > 0 ? 100 : 0;

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => {
      const oldVal = fromAnnual(annualOld, p);
      const newVal = fromAnnual(annualNew, p);
      const delta = newVal - oldVal;
      return { p, oldVal, newVal, delta };
    });

    const avgMonthDays = 365 / 12;
    const oldMonthlyAvg = fromAnnual(annualOld, "monthly");
    const old4w = fromAnnual(annualOld, "every_4_weeks");
    const newMonthlyAvg = fromAnnual(annualNew, "monthly");
    const new4w = fromAnnual(annualNew, "every_4_weeks");

    return {
      annualOld,
      annualNew,
      annualDelta,
      pct,
      breakdown,
      avgMonthDays,
      oldMonthlyAvg,
      old4w,
      newMonthlyAvg,
      new4w,
      oldMonthMinus4w: oldMonthlyAvg - old4w,
      newMonthMinus4w: newMonthlyAvg - new4w,
      deltaPerSelectedPeriod: newParsed - oldParsed,
    };
  }, [oldParsed, newParsed, period]);

  const faqData = [
    {
      q: "What does “rent increase percentage” mean on this page?",
      a: "It is the percent change between the old rent and the new rent, calculated using annual totals so the result stays consistent across pay cycles.",
    },
    {
      q: "Why does this calculator use annual equivalence instead of a simple percent formula?",
      a: "If both values are entered in the same period, the percent change matches a simple formula. Annualizing is used so the page can also show comparable equivalents across monthly, weekly, and 4-week cycles without mixing assumptions.",
    },
    {
      q: "What if the old rent is zero or blank?",
      a: "A percent increase is not meaningful when the starting value is zero. In that case the page still shows the absolute differences and annual totals.",
    },
    {
      q: "Why are “monthly” and “every 4 weeks” shown separately?",
      a: "A 4-week period is always 28 days. An average month is about 30.42 days (365 ÷ 12). The page shows both so the difference is visible when comparing payment schedules.",
    },
    {
      q: "Does the output include fees, utilities, or taxes?",
      a: "No. It compares rent amounts only. If one option includes bundled costs, treat the result as a baseline comparison.",
    },
    {
      q: "Does this reflect proration or mid-month effective dates?",
      a: "No. The calculation is a full-period comparison. Proration rules and effective dates can change the first payment after a change.",
    },
    {
      q: "What time assumptions are used for conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
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
        name: "Rent Increase Percentage Calculator",
        item: "https://rentconverter.com/rent-increase-percentage",
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
    name: "Rent Increase Percentage Calculator",
    description:
      "Calculate the percentage rent increase between an old rent and a new rent using annual equivalence (365-day year). Includes per-period equivalents and annual impact.",
    url: "https://rentconverter.com/rent-increase-percentage",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent Increase Percentage Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Increase Percentage Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Compare an old rent and a new rent to estimate the percentage change
          and the annual impact. Results are shown using annual equivalence so
          common billing cycles can be compared on the same basis.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-increase-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent increase calculator
          </a>
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent affordability calculator
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Calculate the percentage increase from old rent to new rent
            </h2>
            <p className="text-sm text-slate-600">
              Enter both rent amounts in the same billing period. The page
              annualizes both values to show the percent change and the annual
              difference consistently across periods.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Old rent
              </label>
              <input
                inputMode="decimal"
                value={oldRent}
                onChange={(e) => setOldRent(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $2,000, 2000.00, or 2000. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New rent
              </label>
              <input
                inputMode="decimal"
                value={newRent}
                onChange={(e) => setNewRent(e.target.value)}
                placeholder="e.g. 2100"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Use the same period as the old rent for a like-for-like
                comparison.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period (applies to both amounts)
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Billing period"
              >
                {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                The period selection affects the annualization and the per-cycle
                differences shown below.
              </p>
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
                Currency affects formatting only.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Rent increase percentage</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {Number.isFinite(computed.pct) ? `${computed.pct.toFixed(2)}%` : "—"}
              </div>
              <div className="text-sm text-slate-600">
                {money(oldParsed, currency)} to {money(newParsed, currency)} per{" "}
                {PERIOD_LABEL[period].toLowerCase()} is an estimated{" "}
                <strong>{computed.pct.toFixed(2)}%</strong> change when compared
                on an annual basis.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Change per selected period</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.deltaPerSelectedPeriod, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual rent (old, annualized)</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualOld, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual rent (new, annualized)</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualNew, currency)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual impact</div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Annual difference:{" "}
                    <strong className="text-slate-900">
                      {money(computed.annualDelta, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Monthly (avg) difference:{" "}
                    <strong className="text-slate-900">
                      {money(
                        computed.newMonthlyAvg - computed.oldMonthlyAvg,
                        currency,
                      )}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Weekly difference:{" "}
                    <strong className="text-slate-900">
                      {money(
                        fromAnnual(computed.annualNew, "weekly") -
                          fromAnnual(computed.annualOld, "weekly"),
                        currency,
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs every 4 weeks (old and new)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-sm text-slate-700">
                    Old (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.oldMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Old (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.old4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    New (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.newMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    New (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.new4w, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  A 4-week period is 28 days. An average month is{" "}
                  {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12). The
                  differences shown here are derived from annual totals.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Full breakdown across periods (annual-equivalent)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This table converts both rents into annual totals first, then
              expresses those totals across common pay cycles. This helps compare
              results when listings or budgets are tracked in different periods.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Period</th>
                    <th className="py-2 pr-4">Old</th>
                    <th className="py-2 pr-4">New</th>
                    <th className="py-2 pr-4">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.breakdown.map((row) => (
                    <tr key={row.p} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-semibold text-slate-800">
                        {PERIOD_LABEL[row.p]}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.oldVal, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.newVal, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.delta, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Assumptions used for conversions: 1 year = 365 days, 1 week = 7
              days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average).
              Exact billing and due dates vary by agreement.
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This page compares full
            period equivalents and does not model fees, proration, or effective
            dates.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this calculator interprets the percent change
        </h2>

        <p className="text-slate-700 mb-4">
          The intent on this page is simple: translate “old rent” and “new rent”
          into a percentage increase, plus show what that change means over a
          year. The percent figure is based on annual totals, so the same rent
          change can be viewed as monthly, weekly, or 4-week equivalents without
          switching assumptions.
        </p>

        <p className="text-slate-700 mb-4">
          Enter the rent before the change and the rent after the change, then
          select the billing period that applies to both numbers. The calculator
          converts each value into an annual amount using a 365-day year. The
          percent increase is the difference between those annual totals,
          expressed as a share of the old annual total.
        </p>

        <p className="text-slate-700 mb-4">
          The table below the headline result converts the annual totals back
          into common periods. This helps answer practical questions like “how
          much more is this per week?” and “what is the yearly difference?” If a
          listing or pay schedule is based on 28-day cycles, the monthly vs 4-week
          block makes that distinction explicit rather than implying they are
          interchangeable.
        </p>

        <p className="text-slate-700 mt-6">
          Related pages:{" "}
          <a href="/rent-increase-calculator" className="text-sky-700 hover:underline">
            rent increase calculator
          </a>
          ,{" "}
          <a href="/rent-paid-weekly-vs-monthly" className="text-sky-700 hover:underline">
            rent paid weekly vs monthly
          </a>
          , and{" "}
          <a href="/rent-affordability-calculator" className="text-sky-700 hover:underline">
            rent affordability calculator
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
              <h3 className="font-semibold text-lg text-slate-800 mb-1">{f.q}</h3>
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
            Tools on this site are provided for informational, budgeting, and comparison purposes only. Calculations are based on standard time-period assumptions (including a 365-day year and average month length) and simplified models. Results are estimates, not guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rental costs, affordability, payment schedules, and obligations vary by location, landlord, lease terms, and individual circumstances. Always review your lease agreement and consult qualified professionals before making financial decisions.
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
