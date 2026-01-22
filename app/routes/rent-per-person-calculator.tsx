import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-person-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent Per Person Calculator" },
  {
    name: "description",
    content:
      "Split rent per person (roommates) using annual equivalence (365-day year). See per-person rent by period, annual totals, and a full breakdown including monthly vs every 4 weeks.",
  },
  {
    name: "keywords",
    content:
      "rent per person, split rent calculator, rent split per roommate, rent split equally, rent per roommate, divide rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent Per Person Calculator" },
  {
    property: "og:description",
    content:
      "Split rent per person using annual equivalence. Compare per-person rent across periods, including monthly vs every 4 weeks.",
  },
  { property: "og:url", content: "https://rentconverter.com/rent-per-person" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Per Person Calculator" },
  {
    name: "twitter:description",
    content:
      "Split rent per person using annual equivalence. Compare per-person rent across periods, including monthly vs every 4 weeks.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/rent-per-person" },
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

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function parseMoney(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 1_000_000_000);
}

function parsePeople(input: string) {
  const cleaned = input.replace(/[^\d]/g, "");
  const n = parseInt(cleaned || "0", 10);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 100);
}

function money(n: number, currency: string) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
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

export default function RentPerPerson() {
  const [totalRent, setTotalRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2400";
    return localStorage.getItem("rc_rpp_total") ?? "2400";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rpp_period") as Period) ?? "monthly";
  });

  const [people, setPeople] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rpp_people") ?? "3";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rpp_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rpp_total", totalRent);
      localStorage.setItem("rc_rpp_period", period);
      localStorage.setItem("rc_rpp_people", people);
      localStorage.setItem("rc_rpp_currency", currency);
    } catch {}
  }, [totalRent, period, people, currency]);

  const totalParsed = useMemo(() => parseMoney(totalRent), [totalRent]);
  const peopleParsed = useMemo(() => parsePeople(people), [people]);

  const computed = useMemo(() => {
    const safePeople = peopleParsed > 0 ? peopleParsed : 0;

    const annualTotal = annualize(totalParsed, period);
    const annualPerPerson = safePeople > 0 ? annualTotal / safePeople : 0;

    const perSelected = safePeople > 0 ? totalParsed / safePeople : 0;

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const perPersonBreakdown = periods.map((p) => ({
      p,
      perPerson: fromAnnual(annualPerPerson, p),
      total: fromAnnual(annualTotal, p),
    }));

    const monthlyAvgPerPerson = fromAnnual(annualPerPerson, "monthly");
    const fourWeekPerPerson = fromAnnual(annualPerPerson, "every_4_weeks");

    const avgMonthDays = 365 / 12;
    const leftoverCents =
      safePeople > 0
        ? Math.round(totalParsed * 100) - Math.round(perSelected * 100) * safePeople
        : 0;

    return {
      safePeople,
      annualTotal: Number.isFinite(annualTotal) ? annualTotal : 0,
      annualPerPerson: Number.isFinite(annualPerPerson) ? annualPerPerson : 0,
      perSelected: Number.isFinite(perSelected) ? perSelected : 0,
      perPersonBreakdown,
      monthlyAvgPerPerson,
      fourWeekPerPerson,
      avgMonthDays,
      leftoverCents,
    };
  }, [totalParsed, period, peopleParsed]);

  const faqData = [
    {
      q: "What does “rent per person” mean on this page?",
      a: "It is an equal split of the rent amount you entered. The page also shows annual equivalents so the split stays comparable across different billing cycles.",
    },
    {
      q: "What if the rent is listed monthly but paid every 4 weeks?",
      a: "Monthly and every 4 weeks are different time lengths. This page shows both so the per-person cost can be compared without treating them as interchangeable.",
    },
    {
      q: "Does the calculator handle uneven splits?",
      a: "No. It calculates an equal split only. If one person pays more due to room size, a couple sharing a room, or income differences, the equal split can be used as a baseline and adjusted outside the tool.",
    },
    {
      q: "Why does the tool convert everything through annual totals?",
      a: "Annual equivalence makes the comparisons consistent. It avoids mixing assumptions when the rent is discussed in one period but budgeted in another.",
    },
    {
      q: "What if the split does not divide evenly to the cent?",
      a: "Rent often does not split perfectly. The tool shows the exact per-person estimate; any leftover cents can be handled by rounding and assigning the small remainder to one person or rotating it across months.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. It is rent-only. If shared bills are part of the arrangement, add them to the rent amount first or calculate them separately and combine totals.",
    },
    {
      q: "What assumptions are used for the conversions?",
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rentconverter.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rent Per Person Calculator",
        item: "https://rentconverter.com/rent-per-person",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent Per Person Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Rent Per Person Calculator</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Split a rent amount evenly across roommates and see the per-person cost across common
          billing periods. Results use annual equivalence to keep comparisons consistent.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter hub
          </a>
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly vs monthly rent
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
            <h2 className="text-xl sm:text-2xl font-bold">Split rent equally</h2>
            <p className="text-sm text-slate-600">
              Enter the total rent and number of people. The results update instantly and remain
              visible even when inputs are zero.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total rent</label>
              <input
                inputMode="decimal"
                value={totalRent}
                onChange={(e) => setTotalRent(e.target.value)}
                placeholder="e.g. 2400"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $2,400, 2400.00, or 2400. Input is cleaned before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period (for the total rent)
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
                Conversions are computed by annualizing the rent using a 365-day year.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of people splitting rent
              </label>
              <input
                inputMode="numeric"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="e.g. 3"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter a whole number. If this is 0, the per-person values display as 0.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
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
              <p className="mt-2 text-xs text-slate-500">Currency affects formatting only.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Per-person rent (equal split)</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(computed.perSelected, currency)}
              </div>
              <div className="text-sm text-slate-600">
                Based on {money(totalParsed, currency)} per {PERIOD_LABEL[period].toLowerCase()} split across{" "}
                <strong>{computed.safePeople}</strong> {computed.safePeople === 1 ? "person" : "people"}.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Per-person annual rent (annualized)</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualPerPerson, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Total annual rent (annualized)</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualTotal, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Split remainder after cents rounding</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {computed.safePeople > 0 ? `${computed.leftoverCents}¢` : "0¢"}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Monthly vs every 4 weeks (per person)</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div className="text-sm text-slate-700">
                    Monthly (average):{" "}
                    <strong className="text-slate-900">
                      {money(computed.monthlyAvgPerPerson, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Every 4 weeks (28 days):{" "}
                    <strong className="text-slate-900">
                      {money(computed.fourWeekPerPerson, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Every 4 weeks is 28 days. An average month is {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Full breakdown (total and per person)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              The table annualizes the total rent first, then expresses the total and the per-person
              split across common pay cycles. This avoids mixing periods when comparing options.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Period</th>
                    <th className="py-2 pr-4">Total rent</th>
                    <th className="py-2 pr-4">Per person</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.perPersonBreakdown.map((row) => (
                    <tr key={row.p} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-semibold text-slate-800">
                        {PERIOD_LABEL[row.p]}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">{money(row.total, currency)}</td>
                      <td className="py-2 pr-4 text-slate-800">{money(row.perPerson, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average).
              Exact billing and due dates vary by agreement.
            </p>
          </div>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How to use this rent split calculator
        </h2>

        <p className="text-slate-700 mb-4">
          This page answers a specific question: “If the rent is X for the unit, what is the equal share per person?”
          The calculator splits the rent evenly and then shows what that share looks like across common periods.
          That extra breakdown matters when one listing is monthly, another is weekly, or a lease collects payments every 28 days.
        </p>

        <p className="text-slate-700 mb-4">
          Start by entering the total rent using the same period it is stated in (for example monthly, weekly, or every 4 weeks).
          Then enter the number of people participating in the split. The main result shows the per-person amount in that same period,
          and the table translates both the total and the per-person share into equivalent hourly, daily, weekly, 4-week, monthly-average, and annual values.
        </p>

        <p className="text-slate-700 mb-4">
          The conversions run through annual totals using a 365-day year. That keeps the math consistent and avoids treating “monthly” as a fixed number of weeks.
          If the arrangement is not an equal split (room size differences, couples sharing a room, or different income contributions), this tool still provides a clear baseline:
          the equal-share reference point that can be adjusted outside the calculator.
        </p>

        <p className="text-slate-700 mt-6">
          Related pages:{" "}
          <a href="/rent-paid-weekly-vs-monthly" className="text-sky-700 hover:underline">
            rent paid weekly vs monthly
          </a>
          ,{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
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
            Tools on this site are for budgeting and comparison. Calculations use standard time-period assumptions,
            including a 365-day year and average month length. Always confirm payment schedules and lease terms in your rental agreement.
          </em>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
