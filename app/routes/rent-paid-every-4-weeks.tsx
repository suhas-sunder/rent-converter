import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-paid-every-4-weeks";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent Paid Every 4 Weeks (28 Days) Calculator" },
  {
    name: "description",
    content:
      "Understand rent paid every 4 weeks (28 days). Convert a 4-week rent amount to monthly and annual equivalents, see payment counts per year, and compare 4-week vs monthly totals.",
  },
  {
    name: "keywords",
    content:
      "rent paid every 4 weeks, 28 day rent, 4 week rent calculator, rent every 28 days, 4 week rent vs monthly, convert 4 week rent to monthly, convert 4 week rent to annual",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent Paid Every 4 Weeks (28 Days) Calculator" },
  {
    property: "og:description",
    content:
      "Convert 4-week (28-day) rent to monthly and annual equivalents and see how payment counts differ from monthly billing.",
  },
  { property: "og:url", content: "https://rentconverter.com/rent-paid-every-4-weeks" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Paid Every 4 Weeks (28 Days) Calculator" },
  {
    name: "twitter:description",
    content:
      "Convert 4-week rent to monthly and annual equivalents and compare totals on the same annual basis.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-paid-every-4-weeks",
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
  monthly: "Monthly (average)",
  annual: "Annual",
};

function money(n: number, currency: string, forceCents = false) {
  if (!Number.isFinite(n)) return "—";
  const cents = forceCents || n < 10;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

// Source of truth: daily equivalence using fixed day counts.
// month = 365/12, 4-week = 28, biweekly = 14, week = 7, year = 365.
function convert(value: number, from: Period, to: Period): number {
  if (!Number.isFinite(value)) return 0;
  if (from === to) return value;

  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const toDaily = (v: number, p: Period) => {
    if (p === "hourly") return v * 24;
    return v / (daysPer[p as Exclude<Period, "hourly">] || 1);
  };

  const fromDaily = (dailyValue: number, p: Period) => {
    if (p === "hourly") return dailyValue / 24;
    return dailyValue * (daysPer[p as Exclude<Period, "hourly">] || 1);
  };

  return fromDaily(toDaily(value, from), to);
}

export default function RentPaidEvery4Weeks() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "650";
    const saved = localStorage.getItem("rc_4w_amount");
    return saved ?? "650";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_4w_currency");
    return saved ?? "CAD";
  });

  const [roundToCents, setRoundToCents] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_4w_rounding");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_4w_amount", amount);
      localStorage.setItem("rc_4w_currency", currency);
      localStorage.setItem("rc_4w_rounding", JSON.stringify(roundToCents));
    } catch {}
  }, [amount, currency, roundToCents]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const breakdown = useMemo(() => {
    const every_4_weeks = parsed;

    const annual = convert(parsed, "every_4_weeks", "annual");
    const monthly = convert(parsed, "every_4_weeks", "monthly");
    const weekly = convert(parsed, "every_4_weeks", "weekly");
    const biweekly = convert(parsed, "every_4_weeks", "biweekly");
    const daily = convert(parsed, "every_4_weeks", "daily");
    const hourly = convert(parsed, "every_4_weeks", "hourly");

    // Counts (illustrative context)
    const paymentsPer52WeekYear = 52 / 4; // 13 exact in a 52-week framing
    const paymentsPer365DayYear = 365 / 28; // ~13.04 in a day-based framing
    const monthlyPayments = 12;

    // Compare annual totals using two common perspectives:
    // - 13 payments per 52-week year
    // - day-based annual equivalence (this tool)
    const annualVia13 = every_4_weeks * 13;
    const annualVia365 = annual;
    const diffAnnual = annualVia365 - annualVia13;
    const diffAnnualPct = annualVia13 ? diffAnnual / annualVia13 : 0;

    // Monthly vs 4-week difference for the same annual basis
    const monthlyMinus4w = monthly - every_4_weeks;
    const monthlyMinus4wPct = every_4_weeks ? monthlyMinus4w / every_4_weeks : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      paymentsPer52WeekYear,
      paymentsPer365DayYear,
      monthlyPayments,
      annualVia13,
      annualVia365,
      diffAnnual,
      diffAnnualPct,
      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [parsed]);

  const fmt = (n: number) => (roundToCents ? Math.round(n * 100) / 100 : n);

  const faqData = [
    {
      q: "What does “rent paid every 4 weeks” mean?",
      a: "It means rent is due on a fixed 28-day cycle instead of a calendar month. The due date moves earlier each calendar month because 28 days is shorter than an average month.",
    },
    {
      q: "How many rent payments happen in a year on a 4-week schedule?",
      a: "A 4-week schedule is often described as 13 payments in a 52-week year (52 ÷ 4 = 13). Using a 365-day year, there are about 13.04 28-day periods (365 ÷ 28). Lease terms determine how billing is handled in practice.",
    },
    {
      q: "Why can 4-week rent feel higher than monthly rent?",
      a: "Monthly billing is 12 payments per year. A 4-week schedule is closer to 13 cycles per year, so the annual total can be higher even when each 4-week payment looks similar to a monthly payment.",
    },
    {
      q: "Is 4-week rent the same as paying rent monthly?",
      a: "No. A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Because the periods are different lengths, the annual equivalents differ.",
    },
    {
      q: "Does this calculator match my exact due dates?",
      a: "It provides an estimate for budgeting and comparison. Exact due dates and totals can vary with lease rules, start dates, prorations, fees, and what is included in rent.",
    },
    {
      q: "Why does the calculator use an average month?",
      a: "Months have different lengths (28 to 31 days). Using 365 ÷ 12 creates a consistent monthly average that allows comparisons across hourly, daily, weekly, 4-week, monthly, and annual periods.",
    },
    {
      q: "How can this help when comparing listings?",
      a: "It converts a 4-week amount into monthly and annual equivalents so different listings can be compared on the same annual basis.",
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
        name: "Rent Paid Every 4 Weeks (28 Days) Calculator",
        item: "https://rentconverter.com/rent-paid-every-4-weeks",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      {/* Breadcrumbs */}
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent Paid Every 4 Weeks (28 Days) Calculator
        </nav>
      </section>

      {/* Header */}
      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Paid Every 4 Weeks (28 Days) Calculator
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          A 4-week rent schedule is a 28-day cycle, not a calendar month. This page
          converts a 4-week rent amount into monthly and annual equivalents and
          shows why the totals can differ.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
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
            Affordability
          </a>
        </div>
      </section>

      {/* Calculator / Explainer immediately */}
      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Convert 4-week rent to monthly and annual
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                4-week rent amount (every 28 days)
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 650"
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
                Paste values like $650, 650, or 650.00. The input is cleaned automatically.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">What is being compared</div>
                <p className="mt-1 text-sm text-slate-700">
                  This converts a 28-day rent amount into monthly and annual equivalents by
                  using the same annual basis (365 days). This helps compare a 4-week listing
                  to a monthly listing without mixing time periods.
                </p>
              </div>
            </div>
          </div>

          {/* Results (always visible) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Hourly", breakdown.hourly, "hourly"],
                  ["Daily", breakdown.daily, "daily"],
                  ["Weekly", breakdown.weekly, "weekly"],
                  ["Every 2 weeks", breakdown.biweekly, "biweekly"],
                  ["Every 4 weeks (28 days)", breakdown.every_4_weeks, "every_4_weeks"],
                  ["Monthly (average)", breakdown.monthly, "monthly"],
                  ["Annual", breakdown.annual, "annual"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {money(fmt(val), currency, true)}
                  </div>
                </div>
              ))}

              {/* Visual comparison (numbers, not charts) */}
              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">4-week vs monthly comparison (same annual basis)</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">4-week amount</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(fmt(breakdown.every_4_weeks), currency, true)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Fixed 28-day period</div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Monthly equivalent</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(fmt(breakdown.monthly), currency, true)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Average month (365 ÷ 12)</div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(fmt(breakdown.monthlyMinus4w), currency, true)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.monthlyMinus4wPct * 100).toFixed(2)}% of the 4-week amount
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12).
                  The difference comes from the length of the periods, not from a special rule.
                </p>
              </div>
            </div>
          </div>

          {/* Required visible disclaimer (strong, verbatim) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong>
              <br />
              Tools on this site are provided for informational, budgeting, and comparison purposes only.
              Calculations are based on standard time-period assumptions (including a 365-day year and average
              month length) and simplified models. Results are estimates, not guarantees.
              <br />
              <br />
              This website does not provide financial, legal, or tax advice. Rental costs, affordability,
              payment schedules, and obligations vary by location, landlord, lease terms, and individual
              circumstances. Always review your lease agreement and consult qualified professionals before
              making financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Annual payment count table */}
      <section id="payment-counts" className="max-w-6xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Annual payment counts for common rent schedules
        </h2>
        <p className="text-slate-700 mb-6">
          The confusion usually comes from mixing calendar months with fixed-day cycles. A 4-week schedule is a
          repeating 28-day period, so it does not line up cleanly with months.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Schedule</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Length</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Payments per 52-week year</th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Periods per 365-day year (approx.)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Monthly</td>
                <td className="px-4 py-3 text-sm text-slate-800">Calendar month</td>
                <td className="px-4 py-3 text-sm text-slate-800">12 payments</td>
                <td className="px-4 py-3 text-sm text-slate-800">12 months</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Every 4 weeks (28 days)</td>
                <td className="px-4 py-3 text-sm text-slate-800">28 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {breakdown.paymentsPer52WeekYear.toFixed(0)} payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {breakdown.paymentsPer365DayYear.toFixed(2)} periods
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Weekly</td>
                <td className="px-4 py-3 text-sm text-slate-800">7 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">52 payments</td>
                <td className="px-4 py-3 text-sm text-slate-800">{(365 / 7).toFixed(2)} weeks</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Biweekly (every 2 weeks)</td>
                <td className="px-4 py-3 text-sm text-slate-800">14 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">26 payments</td>
                <td className="px-4 py-3 text-sm text-slate-800">{(365 / 14).toFixed(2)} periods</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          These counts are for comparison. Actual billing can depend on the lease start date, due-date rules,
          prorations, and how partial periods are handled.
        </p>
      </section>

      {/* Explanation sections (unique to this route) */}
      <section id="why-it-feels-weird" className="max-w-6xl mx-auto px-6 pt-14">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Why a 4-week rent due date moves each month
        </h2>
        <p className="text-slate-700 mb-4">
          With a calendar-month schedule, rent is typically due on the same date each month. With a 28-day schedule,
          each payment is due 28 days after the last one. Since most months are longer than 28 days, the due date
          will shift earlier over time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3 text-slate-900">
          Why annual totals can differ from “12 payments”
        </h3>
        <p className="text-slate-700 mb-4">
          Monthly rent implies 12 payments per year. A 4-week schedule fits 13 payments into a 52-week year.
          Converting to an annual equivalent can make these schedules comparable without assuming they are the same.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Annual total comparison for your entered amount
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">4-week × 13 (52-week framing)</div>
              <div className="mt-1 text-base font-bold text-slate-900">
                {money(fmt(breakdown.annualVia13), currency, true)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">365-day annual equivalence (this tool)</div>
              <div className="mt-1 text-base font-bold text-slate-900">
                {money(fmt(breakdown.annualVia365), currency, true)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">Difference</div>
              <div className="mt-1 text-base font-bold text-slate-900">
                {money(fmt(breakdown.diffAnnual), currency, true)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                ≈ {(breakdown.diffAnnualPct * 100).toFixed(2)}% vs the 13x framing
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This comparison is illustrative. Some agreements may define a fixed number of payments per year or use
            specific calendar rules that differ from a day-based equivalence.
          </p>
        </div>
      </section>

      {/* Who this affects most */}
      <section id="who-this-affects" className="max-w-6xl mx-auto px-6 pt-14">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Who this billing style affects most
        </h2>
        <ul className="list-disc pl-6 text-slate-700 space-y-2">
          <li>
            Renters comparing a 4-week listing to a monthly listing and trying to understand the true annual cost.
          </li>
          <li>
            Anyone budgeting by calendar month, where a 28-day due date can shift across pay cycles and bill due dates.
          </li>
          <li>
            People moving between markets where monthly rent is the standard and 4-week rent is less common.
          </li>
        </ul>

        <p className="mt-6 text-slate-700">
          Related tools:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a href="/rent-paid-weekly-vs-monthly" className="text-sky-700 hover:underline">
            weekly vs monthly explainer
          </a>
          ,{" "}
          <a href="/rent-affordability-calculator" className="text-sky-700 hover:underline">
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      {/* FAQ (rendered, not hidden) */}
      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">{f.q}</h3>
              <p className="text-slate-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer disclaimer (standardized) */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations use standard time-period assumptions,
            including a 365-day year and average month length. Always confirm payment schedules and lease terms in
            your rental agreement.
          </em>
        </p>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      {/* JSON-LD at bottom (required) */}
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
