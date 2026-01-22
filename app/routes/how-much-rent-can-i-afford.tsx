import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/how-much-rent-can-i-afford";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "How Much Rent Can I Afford?" },
  {
    name: "description",
    content:
      "Estimate how much rent you can afford based on income using annual equivalence (365-day year). Compare rent amounts across pay cycles and see how income timing affects affordability estimates.",
  },
  {
    name: "keywords",
    content:
      "how much rent can i afford, rent affordability calculator, affordable rent based on income, rent budget calculator, income to rent calculator",
  },
  { name: "robots", content: "index,follow" },
  {
    rel: "canonical",
    href: "https://rentconverter.com/how-much-rent-can-i-afford",
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

export default function HowMuchRentCanIAfford() {
  const [income, setIncome] = useState("6000");
  const [period, setPeriod] = useState<Period>("monthly");
  const [currency, setCurrency] = useState("USD");

  const parsedIncome = useMemo(() => parseAmount(income), [income]);

  const annualIncome = useMemo(
    () => annualize(parsedIncome, period),
    [parsedIncome, period],
  );

  const affordability = useMemo(() => {
    const ranges = [0.25, 0.30, 0.35];

    return ranges.map((ratio) => {
      const annual = annualIncome * ratio;
      return {
        ratio,
        annual,
        monthly: fromAnnual(annual, "monthly"),
        weekly: fromAnnual(annual, "weekly"),
        every4w: fromAnnual(annual, "every_4_weeks"),
      };
    });
  }, [annualIncome]);

  const faqData = [
    {
      q: "What does this calculator estimate?",
      a: "It estimates rent amounts that correspond to different shares of income using annualized income as the comparison base.",
    },
    {
      q: "Is this telling me what rent I should pay?",
      a: "No. The results illustrate how different rent levels relate to income. Actual affordability depends on many factors beyond income alone.",
    },
    {
      q: "Why does the calculator use annual income?",
      a: "Annualizing income allows pay cycles like monthly, weekly, and every 4 weeks to be compared consistently.",
    },
    {
      q: "Why are multiple percentages shown?",
      a: "Different households tolerate different housing costs. Showing multiple ranges illustrates how rent levels change as income share changes.",
    },
    {
      q: "Does this include utilities or other housing costs?",
      a: "No. This calculator only compares rent to income. Additional costs can materially change affordability.",
    },
    {
      q: "Why does every 4 weeks differ from monthly?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days. Over a year, this changes totals.",
    },
    {
      q: "Can this be used with hourly or variable income?",
      a: "It can illustrate estimates, but irregular income can make any fixed-period comparison less representative.",
    },
    {
      q: "What assumptions are used?",
      a: "Assumptions: 1 year = 365 days and 1 month = 365 ÷ 12 days. Actual pay schedules and billing rules vary.",
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
        name: "How Much Rent Can I Afford?",
        item: "https://rentconverter.com/how-much-rent-can-i-afford",
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
    <main className="bg-white text-slate-700">
      <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500 py-4">
        <a href="/" className="hover:underline">
          Home
        </a>{" "}
        / How Much Rent Can I Afford?
      </nav>

      <section className="text-center px-6 pb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          How Much Rent Can I Afford?
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600">
          Estimate rent amounts relative to income using a consistent annual
          comparison. This helps illustrate how rent levels change across pay
          cycles.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-4">Income</h2>

          <div className="grid md:grid-cols-3 gap-3">
            <input
              inputMode="decimal"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="rounded-xl border px-4 py-3"
            />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="rounded-xl border px-4 py-3"
            >
              {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              <option>USD</option>
              <option>CAD</option>
              <option>GBP</option>
              <option>EUR</option>
              <option>AUD</option>
              <option>NZD</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {affordability.map((row) => (
              <div
                key={row.ratio}
                className="rounded-xl border border-slate-200 p-4 bg-slate-50"
              >
                <div className="text-sm text-slate-500">
                  {Math.round(row.ratio * 100)}% of income
                </div>
                <div className="font-bold text-lg">
                  {money(row.monthly, currency)} / month
                </div>
                <div className="text-sm text-slate-600">
                  {money(row.weekly, currency)} / week
                </div>
                <div className="text-sm text-slate-600">
                  {money(row.every4w, currency)} / 4 weeks
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and average month
            length) and simplified models. Results are estimates, not guarantees.
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

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg">{f.q}</h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

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
