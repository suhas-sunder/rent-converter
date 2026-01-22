import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-paid-every-2-weeks";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent Paid Every 2 Weeks (Biweekly) Calculator" },
  {
    name: "description",
    content:
      "Understand rent paid every 2 weeks (biweekly). Convert a biweekly rent amount to weekly, monthly, and annual equivalents using the same annual basis.",
  },
  {
    name: "keywords",
    content:
      "rent paid every 2 weeks, biweekly rent, rent every 14 days, biweekly rent calculator, convert biweekly rent to monthly, convert biweekly rent to annual, biweekly vs monthly rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Paid Every 2 Weeks (Biweekly) Calculator",
  },
  {
    property: "og:description",
    content:
      "Convert biweekly (14-day) rent to weekly, monthly, and annual equivalents and compare totals on the same annual basis.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-paid-every-2-weeks",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Rent Paid Every 2 Weeks (Biweekly) Calculator",
  },
  {
    name: "twitter:description",
    content:
      "Convert biweekly rent to monthly and annual equivalents and compare rent schedules using the same annual basis.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-paid-every-2-weeks",
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

export default function RentPaidEvery2Weeks() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "650";
    const saved = localStorage.getItem("rc_2w_amount");
    return saved ?? "650";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_2w_currency");
    return saved ?? "CAD";
  });

  const [roundToCents, setRoundToCents] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_2w_rounding");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_2w_amount", amount);
      localStorage.setItem("rc_2w_currency", currency);
      localStorage.setItem("rc_2w_rounding", JSON.stringify(roundToCents));
    } catch {}
  }, [amount, currency, roundToCents]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const breakdown = useMemo(() => {
    const biweekly = parsed;

    const annual = convert(parsed, "biweekly", "annual");
    const monthly = convert(parsed, "biweekly", "monthly");
    const weekly = convert(parsed, "biweekly", "weekly");
    const every_4_weeks = convert(parsed, "biweekly", "every_4_weeks");
    const daily = convert(parsed, "biweekly", "daily");
    const hourly = convert(parsed, "biweekly", "hourly");

    // Counts (context)
    const paymentsPer52WeekYear = 52 / 2; // 26
    const periodsPer365DayYear = 365 / 14; // ~26.07
    const monthlyPayments = 12;

    // Compare annual totals: 26 payments vs day-based annual equivalence (this tool)
    const annualVia26 = biweekly * 26;
    const annualVia365 = annual;
    const diffAnnual = annualVia365 - annualVia26;
    const diffAnnualPct = annualVia26 ? diffAnnual / annualVia26 : 0;

    // Monthly vs biweekly difference (same annual basis)
    const monthlyMinusBiweekly = monthly - biweekly;
    const monthlyMinusBiweeklyPct = biweekly
      ? monthlyMinusBiweekly / biweekly
      : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      paymentsPer52WeekYear,
      periodsPer365DayYear,
      monthlyPayments,
      annualVia26,
      annualVia365,
      diffAnnual,
      diffAnnualPct,
      monthlyMinusBiweekly,
      monthlyMinusBiweeklyPct,
    };
  }, [parsed]);

  const fmt = (n: number) => (roundToCents ? Math.round(n * 100) / 100 : n);

  const faqData = [
    {
      q: "What does “rent paid every 2 weeks” mean?",
      a: "It means rent is due on a fixed 14-day cycle (biweekly) rather than once per calendar month. The due date can shift across months because months are not exactly two weeks long.",
    },
    {
      q: "How many biweekly rent payments happen in a year?",
      a: "Biweekly is often described as 26 payments in a 52-week year (52 ÷ 2 = 26). Using a 365-day year, there are about 26.07 14-day periods (365 ÷ 14). Lease terms determine how billing is handled in practice.",
    },
    {
      q: "Why doesn’t biweekly rent line up with a monthly budget?",
      a: "A calendar month is longer than 14 days, and months vary in length. A 14-day schedule repeats on the same interval, so payment dates move through the calendar.",
    },
    {
      q: "Is biweekly rent the same as half of monthly rent?",
      a: "Not reliably. Monthly billing is 12 payments per year. Biweekly billing is closer to 26 cycles per year. Converting both to an annual total makes the schedules comparable.",
    },
    {
      q: "How does this calculator convert biweekly rent to monthly?",
      a: "It converts through an annual basis first using a 365-day year. It then converts that annual amount into an average month (365 ÷ 12) so all periods stay consistent.",
    },
    {
      q: "Does this match my exact rent due dates?",
      a: "It estimates equivalents for budgeting and comparison. Exact totals can vary with lease rules, start dates, prorations, fees, and what is included in rent.",
    },
    {
      q: "How can this help compare listings?",
      a: "It converts a biweekly amount into weekly, monthly, and annual equivalents so different listings can be compared on the same annual basis.",
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
        name: "Rent Paid Every 2 Weeks (Biweekly) Calculator",
        item: "https://rentconverter.com/rent-paid-every-2-weeks",
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
          / Rent Paid Every 2 Weeks (Biweekly) Calculator
        </nav>
      </section>

      {/* Header */}
      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Paid Every 2 Weeks (Biweekly) Calculator
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Biweekly rent is a 14-day cycle, not a calendar month. This page
          converts a biweekly rent amount into weekly, monthly, and annual
          equivalents using the same annual basis.
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
            href="/rent-paid-every-4-weeks"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent paid every 4 weeks
          </a>
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Affordability
          </a>
        </div>
      </section>

      {/* Calculator immediately */}
      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Convert biweekly rent to monthly and annual
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Biweekly rent amount (every 14 days)
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
                Paste values like $650, 650, or 650.00. The input is cleaned
                automatically.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">
                  What is being compared
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  This converts a 14-day rent amount into weekly, monthly, and
                  annual equivalents by using the same annual basis (365 days).
                  This helps compare a biweekly listing to a monthly listing
                  without assuming the schedules are interchangeable.
                </p>
              </div>
            </div>
          </div>

          {/* Results always visible */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Hourly", breakdown.hourly, "hourly"],
                  ["Daily", breakdown.daily, "daily"],
                  ["Weekly", breakdown.weekly, "weekly"],
                  ["Every 2 weeks", breakdown.biweekly, "biweekly"],
                  [
                    "Every 4 weeks (28 days)",
                    breakdown.every_4_weeks,
                    "every_4_weeks",
                  ],
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
                <div className="text-xs text-slate-500">
                  Biweekly vs monthly comparison (same annual basis)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Biweekly amount
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(fmt(breakdown.biweekly), currency, true)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Fixed 14-day period
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Monthly equivalent
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(fmt(breakdown.monthly), currency, true)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Average month (365 ÷ 12)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {money(
                        fmt(breakdown.monthlyMinusBiweekly),
                        currency,
                        true,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.monthlyMinusBiweeklyPct * 100).toFixed(2)}%
                      of the biweekly amount
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  A biweekly period is 14 days. An average month is about 30.42
                  days (365 ÷ 12). The difference comes from the length of the
                  periods, not from a special rule.
                </p>
              </div>
            </div>
          </div>

          {/* Required strong disclaimer (verbatim) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs text-slate-700 leading-relaxed">
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
          </div>
        </div>
      </section>

      {/* Annual payment count table */}
      <section id="payment-counts" className="max-w-6xl mx-auto px-6 pt-8">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Annual payment counts for biweekly rent
        </h2>
        <p className="text-slate-700 mb-6">
          The mismatch usually comes from comparing a fixed 14-day cycle to
          calendar months. Converting to an annual equivalent helps keep the
          comparison consistent.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Schedule
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Length
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Payments per 52-week year
                </th>
                <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">
                  Periods per 365-day year (approx.)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Monthly</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  Calendar month
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  12 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">12 months</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">
                  Every 2 weeks (biweekly)
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">14 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {breakdown.paymentsPer52WeekYear.toFixed(0)} payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {breakdown.periodsPer365DayYear.toFixed(2)} periods
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">Weekly</td>
                <td className="px-4 py-3 text-sm text-slate-800">7 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  52 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {(365 / 7).toFixed(2)} weeks
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-800">
                  Every 4 weeks (28 days)
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">28 days</td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  13 payments
                </td>
                <td className="px-4 py-3 text-sm text-slate-800">
                  {(365 / 28).toFixed(2)} periods
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          These counts are for comparison. Actual billing can depend on the
          lease start date, due-date rules, prorations, and how partial periods
          are handled.
        </p>
      </section>

      {/* Route-specific explanation (unique) */}
      <section id="why-biweekly" className="max-w-6xl mx-auto px-6 pt-14">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Why biweekly rent can look “off” next to monthly rent
        </h2>
        <p className="text-slate-700 mb-4">
          Biweekly rent is anchored to a 14-day interval. Monthly rent is
          anchored to calendar months, which vary from 28 to 31 days. Even if
          the numbers look similar, the schedules imply different payment counts
          per year.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-3 text-slate-900">
          Annual totals: 26 payments vs a 365-day equivalence
        </h3>
        <p className="text-slate-700 mb-4">
          A common shorthand is “26 biweekly payments per year.” This tool also
          shows a day-based annual equivalence (365 days) so that hourly, daily,
          weekly, biweekly, monthly, and annual amounts can be compared
          consistently.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Annual total comparison for your entered amount
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">
                Biweekly × 26 (52-week framing)
              </div>
              <div className="mt-1 text-base font-bold text-slate-900">
                {money(fmt(breakdown.annualVia26), currency, true)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs text-slate-500">
                365-day annual equivalence (this tool)
              </div>
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
                ≈ {(breakdown.diffAnnualPct * 100).toFixed(2)}% vs the 26x
                framing
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This comparison is illustrative. Some agreements may define a fixed
            number of payments per year or use specific calendar rules that
            differ from a day-based equivalence.
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
            Renters comparing a biweekly listing to a monthly listing and trying
            to compare annual cost.
          </li>
          <li>
            Anyone budgeting by calendar month where a 14-day due date shifts
            across pay cycles and bills.
          </li>
          <li>
            People moving between markets where monthly rent is standard and
            biweekly billing is less common.
          </li>
        </ul>

        <p className="mt-6 text-slate-700">
          Related tools:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a
            href="/rent-paid-every-4-weeks"
            className="text-sky-700 hover:underline"
          >
            rent paid every 4 weeks
          </a>
          ,{" "}
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="text-sky-700 hover:underline"
          >
            weekly vs monthly explainer
          </a>
          ,{" "}
          <a
            href="/rent-affordability-calculator"
            className="text-sky-700 hover:underline"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer disclaimer (standardized) */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
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
