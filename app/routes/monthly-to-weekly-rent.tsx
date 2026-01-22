import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/monthly-to-weekly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly to Weekly Rent Converter" },
  {
    name: "description",
    content:
      "Convert monthly rent to a weekly equivalent using annual equivalence (12 months per year ÷ 52 weeks). Includes full period breakdowns and a monthly vs 28-day (4-week) comparison.",
  },
  {
    name: "keywords",
    content:
      "monthly to weekly rent, monthly rent to weekly, rent converter monthly to weekly, convert monthly rent to weekly, weekly equivalent of monthly rent, rent per week from monthly, monthly vs 4 week rent, 28 day rent vs monthly, rent affordability calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Monthly to Weekly Rent Converter" },
  {
    property: "og:description",
    content:
      "Monthly to weekly conversion using annual equivalence (monthly × 12 ÷ 52). Shows weekly, 4-week, and annual totals for consistent rent comparisons.",
  },
  { property: "og:url", content: "https://rentconverter.com/monthly-to-weekly-rent" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Monthly to Weekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert monthly rent to a weekly equivalent via annual equivalence (12 ÷ 52). Includes a 4-week (28-day) comparison and full breakdowns.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/monthly-to-weekly-rent" },
];

type Period =
  | "weekly"
  | "monthly"
  | "biweekly"
  | "every_4_weeks"
  | "daily"
  | "hourly"
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

  const perDay = toDaily(value, from);
  return fromDaily(perDay, to);
}

export default function MonthlyToWeeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    try {
      const saved = localStorage.getItem("rc_mtw_amount");
      return saved ?? "2000";
    } catch {
      return "2000";
    }
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    try {
      const saved = localStorage.getItem("rc_mtw_currency");
      return saved ?? "CAD";
    } catch {
      return "CAD";
    }
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("rc_mtw_rounding");
      if (saved !== null) return JSON.parse(saved);
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_mtw_amount", amount);
      localStorage.setItem("rc_mtw_currency", currency);
      localStorage.setItem("rc_mtw_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawWeekly = useMemo(() => convert(parsed, "monthly", "weekly"), [parsed]);

  const weeklyResult = useMemo(() => {
    if (!includeRounding) return rawWeekly;
    return Math.round(rawWeekly * 100) / 100;
  }, [rawWeekly, includeRounding]);

  const breakdown = useMemo(() => {
    const weekly = convert(parsed, "monthly", "weekly");
    const monthly = parsed;
    const annual = convert(parsed, "monthly", "annual");
    const daily = convert(parsed, "monthly", "daily");
    const fourWeeks = convert(parsed, "monthly", "every_4_weeks");
    const hourly = convert(parsed, "monthly", "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly: convert(parsed, "monthly", "biweekly"),
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed]);

  // Route-specific example to keep this page distinct
  const exampleMonthly = 2000;
  const exampleWeekly = (exampleMonthly * 12) / 52;

  const faqData = [
    {
      q: "What is the formula to convert monthly rent to weekly rent?",
      a: "This page converts through annual equivalence: weekly = monthly × 12 ÷ 52. Using the year as the reference avoids confusing months with 4-week blocks.",
    },
    {
      q: "What does “weekly equivalent” mean on a monthly rent listing?",
      a: "It is a comparison number. It expresses the same annual total as a weekly amount, so you can compare weekly-advertised listings and monthly-advertised listings on the same basis.",
    },
    {
      q: "Why isn’t monthly rent just divided by 4 to get weekly?",
      a: "Dividing by 4 assumes a month is exactly 4 weeks (28 days). A calendar month averages about 30.42 days (365 ÷ 12), so the yearly totals do not line up with that shortcut.",
    },
    {
      q: "How is every-4-weeks (28-day) rent different from monthly rent?",
      a: "Every 4 weeks often means 13 payments per year, while monthly billing is 12 payments per year. Even small differences per period can add up across a year.",
    },
    {
      q: "Will this match what I actually pay each week?",
      a: "Not necessarily. Many leases are billed monthly with specific due dates. This weekly number is an estimate used for comparison, not a schedule of actual weekly charges.",
    },
    {
      q: "Does the conversion change by country?",
      a: "The math stays the same. What changes is common wording and how rent is advertised, such as weekly rent in some countries and PCM (per calendar month) in others.",
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

  const breadcrumbName = "Monthly to Weekly Rent Converter";

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
        name: breadcrumbName,
        item: "https://rentconverter.com/monthly-to-weekly-rent",
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
    name: "Monthly to Weekly Rent Converter",
    description:
      "Convert monthly rent to a weekly equivalent using annual equivalence (monthly × 12 ÷ 52). Includes period breakdowns and 4-week (28-day) comparisons.",
    url: "https://rentconverter.com/monthly-to-weekly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4 pt-6">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / {breadcrumbName}
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Weekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Convert monthly rent into a weekly equivalent using annual equivalence.
          This helps compare a monthly-advertised listing against weekly-advertised listings using consistent annual totals.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/weekly-to-monthly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly → Monthly
          </a>
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly vs Monthly
          </a>
          <a
            href="/rent-paid-every-4-weeks"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Every 4 weeks
          </a>
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Affordability
          </a>
        </div>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant monthly to weekly conversion
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly rent amount
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
                Paste values like $2,000, 2000.00, or 1,850. Input is cleaned automatically.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Conversion
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Weekly equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(weeklyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.monthly.toLowerCase()} ≈{" "}
                <strong>{money(weeklyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.weekly.toLowerCase()}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Hourly", breakdown.hourly, "hourly"],
                  ["Daily", breakdown.daily, "daily"],
                  ["Weekly", breakdown.weekly, "weekly"],
                  ["Every 2 weeks", breakdown.biweekly, "biweekly"],
                  ["Every 4 weeks (28 days)", breakdown.every_4_weeks, "every_4_weeks"],
                  ["Monthly", breakdown.monthly, "monthly"],
                  ["Annual", breakdown.annual, "annual"],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(includeRounding ? Math.round(val * 100) / 100 : val, currency)}
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs 4-week (28-day) comparison
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week ={" "}
                    <strong className="text-slate-900">
                      {money(breakdown.monthlyMinus4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference ≈{" "}
                    <strong className="text-slate-900">
                      {(breakdown.monthlyMinus4wPct * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Monthly uses an average month (365 ÷ 12 days). A 4-week period is 28 days. Annual totals can diverge.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, 4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due dates vary by lease.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Monthly to weekly is monthly × 12 ÷ 52
        </h2>

        <p className="text-slate-700 mb-4">
          This conversion treats the year as the shared reference point. It converts your monthly amount into an annual total (monthly × 12),
          then expresses that annual total as a weekly equivalent (÷ 52).
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          A quick example
        </h3>
        <p className="text-slate-700 mb-4">
          {money(exampleMonthly, currency)} per month converts to about{" "}
          <strong>{money(includeRounding ? Math.round(exampleWeekly * 100) / 100 : exampleWeekly, currency)}</strong>{" "}
          per week using annual equivalence. This is a comparison number, not a billing schedule.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          What the weekly equivalent does and does not tell you
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>It helps compare a monthly-advertised listing against weekly-advertised listings using the same annual total.</li>
          <li>It does not imply the landlord will charge you weekly if the lease is monthly.</li>
          <li>Short-term timing can differ because monthly billing uses calendar due dates, not 7-day cycles.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why 4-week (28-day) billing creates confusion
        </h3>
        <p className="text-slate-700 mb-4">
          A 4-week period is 28 days, not a month. Many 4-week schedules result in 13 payments per year, while monthly schedules result in 12 payments per year.
          That payment-count difference is why “monthly” and “every 4 weeks” can produce different annual totals.
        </p>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a href="/weekly-to-monthly-rent" className="text-sky-700 hover:underline">
            weekly to monthly rent
          </a>
          ,{" "}
          <a href="/rent-paid-every-4-weeks" className="text-sky-700 hover:underline">
            rent paid every 4 weeks
          </a>
          ,{" "}
          <a href="/rent-paid-weekly-vs-monthly" className="text-sky-700 hover:underline">
            weekly vs monthly rent
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
            Tools on this site are for budgeting and comparison. Calculations use standard time-period assumptions, including a 365-day year and average month length. Always confirm payment schedules and lease terms in your rental agreement.
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
