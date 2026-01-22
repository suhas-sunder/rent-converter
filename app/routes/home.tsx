import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/home";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Converter – Weekly to Monthly, Monthly to Weekly, 4-Week Rent, Annual & More",
  },
  {
    name: "description",
    content:
      "Convert rent between weekly, monthly, biweekly, 4-week (28-day), daily, hourly, and annual amounts. Includes full breakdowns, 4-week vs monthly comparisons, and links to rent affordability and renter checklists.",
  },
  {
    name: "keywords",
    content:
      "rent converter, weekly to monthly rent, monthly to weekly rent, 4 week rent, 28 day rent, rent paid every 4 weeks, rent billed every 28 days, biweekly to monthly rent, monthly to annual rent, annual to monthly rent, rent per day, rent per week, rent affordability calculator, rent as percentage of income",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  // Open Graph
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Converter – Weekly ↔ Monthly, 4-Week (28-Day), Annual, Daily & More",
  },
  {
    property: "og:description",
    content:
      "Convert rent between weekly, monthly, biweekly, daily, hourly, and annual amounts. Includes 4-week (28-day) rent math and clear comparisons.",
  },
  { property: "og:url", content: "https://rentconverter.com" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  // Twitter
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content:
      "Rent Converter – Weekly to Monthly, 4-Week Rent, Annual, Daily & More",
  },
  {
    name: "twitter:description",
    content:
      "Convert rent between weekly, monthly, biweekly, daily, hourly, and annual. Includes 4-week (28-day) rent comparisons and full breakdowns.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },
  { rel: "canonical", href: "https://rentconverter.com" },
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

/**
 * Convert a value in `from` period to an equivalent `to` period.
 *
 * Assumptions:
 * - Year = 365 days
 * - Month = 365/12 days (average month)
 * - Week = 7 days
 * - Biweekly = 14 days
 * - 4-week rent = 28 days
 * - Hour = 1/24 day
 */
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

export default function Home() {
  // ---------------------------
  // State (localStorage)
  // ---------------------------
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    const saved = localStorage.getItem("rc_amount");
    return saved ?? "500";
  });

  const [from, setFrom] = useState<Period>(() => {
    if (typeof window === "undefined") return "weekly";
    const saved = localStorage.getItem("rc_from") as Period | null;
    return saved ?? "weekly";
  });

  const [to, setTo] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_to") as Period | null;
    return saved ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rc_amount", amount);
    localStorage.setItem("rc_from", from);
    localStorage.setItem("rc_to", to);
    localStorage.setItem("rc_currency", currency);
    localStorage.setItem("rc_rounding", JSON.stringify(includeRounding));
  }, [amount, from, to, currency, includeRounding]);

  // ---------------------------
  // Robust parsing
  // ---------------------------
  const parsed = useMemo(() => {
    // Keep only digits and a single dot.
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  // ---------------------------
  // Derived results
  // ---------------------------
  const rawResult = useMemo(
    () => convert(parsed, from, to),
    [parsed, from, to],
  );

  const result = useMemo(() => {
    if (!includeRounding) return rawResult;
    return Math.round(rawResult * 100) / 100;
  }, [rawResult, includeRounding]);

  const breakdown = useMemo(() => {
    const weekly = convert(parsed, from, "weekly");
    const monthly = convert(parsed, from, "monthly");
    const annual = convert(parsed, from, "annual");
    const daily = convert(parsed, from, "daily");
    const fourWeeks = convert(parsed, from, "every_4_weeks");
    const hourly = convert(parsed, from, "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly: convert(parsed, from, "biweekly"),
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed, from]);

  // ---------------------------
  // SEO: FAQ + schemas
  // ---------------------------
  const faqData = [
    {
      q: "How do you convert weekly rent to monthly rent?",
      a: "This site uses an average-month method: monthly = weekly × 52 ÷ 12. That reflects 52 weeks per year, which is why monthly is not simply weekly × 4.",
    },
    {
      q: "Why is 4-week rent different from monthly rent?",
      a: "A 4-week period is 28 days. A month averages about 30.42 days (365 ÷ 12). Paying every 4 weeks usually creates 13 payments per year, while monthly is 12 payments per year.",
    },
    {
      q: "What assumptions does RentConverter.com use?",
      a: "We use a 365-day year, 7-day weeks, biweekly = 14 days, and a month length of 365 ÷ 12 days (average). This is reliable for budgeting comparisons, but exact calendars and due dates vary.",
    },
    {
      q: "Is weekly or monthly rent cheaper?",
      a: "Neither is automatically cheaper. Compare annual totals. Weekly can look lower but add up to more over a year, depending on how the listing is priced.",
    },
    {
      q: "Can I use this in Canada, the UK, Australia, or New Zealand?",
      a: "Yes. The math is the same everywhere, but the common wording differs. Weekly rent is common in Australia and New Zealand, while PCM (per calendar month) is common in the UK.",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rent Converter – Weekly to Monthly, Monthly to Weekly, 4-Week Rent, Annual & More",
    description:
      "Convert rent between weekly, monthly, biweekly, daily, hourly, and annual. Includes 4-week (28-day) comparisons and full breakdowns.",
    url: "https://rentconverter.com/",
  };

  // ---------------------------
  // Page
  // ---------------------------
  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      {/* Hero */}
      <section className="pb-10 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Convert rent between weekly, monthly, biweekly, every 4 weeks (28
          days), daily, hourly, and annual amounts. See a full breakdown so you
          can compare listings and budget with confidence.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/weekly-to-monthly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly → Monthly
          </a>
          <a
            href="/monthly-to-weekly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Weekly
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

      {/* Converter */}
      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant rent conversion
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {/* Amount */}
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
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
                You can paste values like $650 or 650.00. We will clean the
                input automatically.
              </p>
            </div>

            {/* From */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as Period)}
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
                  ] as Period[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as Period)}
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
                  ] as Period[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex md:items-end">
              <button
                type="button"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold hover:bg-sky-50 hover:border-sky-200 transition"
                aria-label="Swap from and to"
              >
                ⇄
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Converted rent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(result, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL[from].toLowerCase()} ≈{" "}
                <strong>{money(result, currency)}</strong>{" "}
                {PERIOD_LABEL[to].toLowerCase()}
              </div>
            </div>

            {/* Breakdown always visible */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    {money(
                      includeRounding ? Math.round(val * 100) / 100 : val,
                      currency,
                    )}
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  4-week vs monthly comparison
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
                  We use average months (365 ÷ 12 days). A 4-week period is 28
                  days. That gap adds up over a year.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). For exact
            due dates, use the rent due date calculator.
          </p>
        </div>
      </section>

      {/* SEO-rich home content */}
      <section id="overview" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          What this site helps you do
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Compare listings fairly
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              Weekly, monthly, and 4-week pricing can hide the real annual cost.
              Convert everything to the same period before you decide.
            </p>
            <div className="mt-3 text-sm">
              <a
                href="/weekly-to-monthly-rent"
                className="text-sky-700 hover:underline font-semibold"
              >
                Weekly to monthly →
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Understand 4-week and 28-day rent
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              Paying every 4 weeks usually means 13 payments per year. That is
              why it often feels higher than monthly, even when the number looks
              similar.
            </p>
            <div className="mt-3 text-sm">
              <a
                href="/rent-paid-every-4-weeks"
                className="text-sky-700 hover:underline font-semibold"
              >
                Rent paid every 4 weeks →
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Check affordability, not just conversion
            </h3>
            <p className="mt-2 text-slate-700 text-sm">
              Conversion tells you what rent means across time periods.
              Affordability tells you whether it fits your income and budget.
            </p>
            <div className="mt-3 text-sm">
              <a
                href="/rent-affordability-calculator"
                className="text-sky-700 hover:underline font-semibold"
              >
                Rent affordability calculator →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How rent conversion works
        </h2>

        <p className="text-slate-700 mb-4">
          Most rent confusion comes from mixing time periods that do not line
          up. A calendar month is not exactly four weeks. Over a year, small
          differences can become meaningful. This site compares periods through
          annual equivalence, then converts back into the time period you want
          to view.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Weekly vs monthly vs every 4 weeks (28 days)
        </h3>
        <p className="text-slate-700 mb-4">
          A simple way to compare is payments per year:
        </p>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            <strong>Weekly</strong>: 52 payments per year
          </li>
          <li>
            <strong>Monthly</strong>: 12 payments per year (average month
            length)
          </li>
          <li>
            <strong>Every 4 weeks</strong>: 13 payments per year
          </li>
        </ul>
        <p className="text-slate-700 mb-4">
          That is why 4-week rent often feels higher than monthly. For deeper
          explanations and examples, see{" "}
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="text-sky-700 hover:underline"
          >
            weekly vs monthly rent
          </a>{" "}
          and{" "}
          <a
            href="/rent-billed-every-28-days"
            className="text-sky-700 hover:underline"
          >
            rent billed every 28 days
          </a>
          .
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          True cost per day and per week
        </h3>
        <p className="text-slate-700 mb-4">
          If you are comparing listings, converting everything to a daily or
          weekly equivalent removes ambiguity. Use{" "}
          <a
            href="/true-cost-of-rent-per-day"
            className="text-sky-700 hover:underline"
          >
            true cost per day
          </a>{" "}
          and{" "}
          <a
            href="/true-cost-of-rent-per-week"
            className="text-sky-700 hover:underline"
          >
            true cost per week
          </a>{" "}
          to sanity-check pricing quickly.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Rent affordability and income ratios
        </h3>
        <p className="text-slate-700 mb-4">
          A popular budgeting approach is to compare rent to income as a
          percentage. Start with{" "}
          <a
            href="/rent-as-percentage-of-income"
            className="text-sky-700 hover:underline"
          >
            rent as a percentage of income
          </a>{" "}
          and then use{" "}
          <a
            href="/how-much-rent-can-i-afford"
            className="text-sky-700 hover:underline"
          >
            how much rent can I afford
          </a>{" "}
          to explore comfortable ranges.
        </p>

        <p className="text-slate-700 mb-4">
          If you want a country-specific explanation of weekly vs monthly
          conventions, see{" "}
          <a
            href="/why-rent-is-billed-weekly-in-some-countries"
            className="text-sky-700 hover:underline"
          >
            why rent is billed weekly in some countries
          </a>
          .
        </p>
      </section>

      {/* FAQ */}
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

      {/* Bottom navigation blocks */}
      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. They use
            standard time-period assumptions (365-day year and average month
            length). Always confirm payment schedules and lease terms in your
            agreement.
          </em>
        </p>
      </section>

      {/* JSON-LD */}
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
