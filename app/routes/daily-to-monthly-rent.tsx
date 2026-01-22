import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/daily-to-monthly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Daily to Monthly Rent Converter" },
  {
    name: "description",
    content:
      "Convert a daily rent price into a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown across periods and a 28-day (4-week) comparison that shows why “monthly” is not “every 4 weeks.”",
  },
  {
    name: "keywords",
    content:
      "daily to monthly rent converter, daily rent to monthly equivalent, rent per day to monthly, convert daily rent into monthly, daily rate rent monthly, 28 day rent vs monthly, 4 week vs monthly rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Daily to Monthly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert a daily rent price to a monthly equivalent using annual equivalence (365-day year). See period breakdowns and a 4-week (28-day) comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/daily-to-monthly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Daily to Monthly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert a daily rent price to a monthly equivalent using annual equivalence (365-day year). Includes breakdowns and 4-week (28-day) comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/daily-to-monthly-rent",
  },
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

export default function DailyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "70";
    const saved = localStorage.getItem("rc_dtm_amount");
    return saved ?? "70";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_dtm_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_dtm_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_dtm_amount", amount);
      localStorage.setItem("rc_dtm_currency", currency);
      localStorage.setItem("rc_dtm_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawMonthly = useMemo(
    () => convert(parsed, "daily", "monthly"),
    [parsed],
  );

  const monthlyResult = useMemo(() => {
    if (!includeRounding) return rawMonthly;
    return Math.round(rawMonthly * 100) / 100;
  }, [rawMonthly, includeRounding]);

  const breakdown = useMemo(() => {
    const daily = parsed;
    const weekly = convert(parsed, "daily", "weekly");
    const monthly = convert(parsed, "daily", "monthly");
    const annual = convert(parsed, "daily", "annual");
    const fourWeeks = convert(parsed, "daily", "every_4_weeks");
    const hourly = convert(parsed, "daily", "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly: convert(parsed, "daily", "biweekly"),
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed]);

  const quickContext = useMemo(() => {
    const daily = parsed;
    const averageMonthDays = 365 / 12;
    return {
      averageMonthDays,
      monthByThirty: daily * 30,
      monthByAverage: daily * averageMonthDays,
      monthByThirtyDiff: daily * averageMonthDays - daily * 30,
      yearByDaily: daily * 365,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "If rent is priced per day, what does “monthly rent” mean?",
      a: "It is an estimated monthly equivalent so you can compare a daily rate to a typical monthly listing. This page converts daily rent into a monthly figure using consistent year-based assumptions.",
    },
    {
      q: "How is daily rent converted into a monthly equivalent on this page?",
      a: "We convert the daily amount into an annual total using a 365-day year, then convert that annual total into a monthly figure using an average month length (365 ÷ 12 days).",
    },
    {
      q: "Why not just multiply the daily rate by 30?",
      a: "Thirty days is a common shortcut, but it changes the assumptions. This tool uses an average month length so the conversion stays consistent when you compare daily, weekly, 4-week, monthly, and annual rates.",
    },
    {
      q: "Why does a 4-week (28-day) amount differ from the monthly equivalent?",
      a: "A 4-week period is always 28 days, while an average month is about 30.42 days. Over time, 28-day cycles can change annual totals compared with calendar-month pricing.",
    },
    {
      q: "Can I use this to compare short-stay pricing to normal rentals?",
      a: "It helps with the rate comparison, but short stays often include cleaning fees, taxes, parking, or bundled utilities. Treat the result as a baseline, not a final cost estimate.",
    },
    {
      q: "What assumptions are used for the math?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Your actual agreement can differ.",
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
        name: "Daily to Monthly Rent Converter",
        item: "https://rentconverter.com/daily-to-monthly-rent",
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
    name: "Daily to Monthly Rent Converter",
    description:
      "Convert a daily rent price into a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown and a 4-week (28-day) comparison.",
    url: "https://rentconverter.com/daily-to-monthly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Daily to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Daily to Monthly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Turn a daily rent price into a monthly equivalent you can compare
          against typical listings. This page uses a year-based method so daily,
          weekly, 4-week, and monthly numbers come from the same assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/monthly-to-daily-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Daily
          </a>
          <a
            href="/true-cost-of-rent-per-day"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            True cost per day
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
              Convert a daily rate into a monthly equivalent
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Daily rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 70"
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
                Paste values like $70, 70.00, or 70. Input is cleaned before
                calculation.
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
                    {PERIOD_LABEL.daily}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Monthly equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(monthlyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.daily.toLowerCase()} is
                approximately <strong>{money(monthlyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.monthly.toLowerCase()} using annual equivalence
              </div>
            </div>

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
                  “30-day month” vs average month
                </div>
                <div className="mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    30-day month estimate:{" "}
                    <strong className="text-slate-900">
                      {money(quickContext.monthByThirty, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Average month (365 ÷ 12):{" "}
                    <strong className="text-slate-900">
                      {money(quickContext.monthByAverage, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {money(quickContext.monthByThirtyDiff, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This page uses the average month to keep daily, weekly, and
                  annual conversions consistent.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  4-week (28-day) and monthly comparison
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Monthly minus 4-week amount:{" "}
                    <strong className="text-slate-900">
                      {money(breakdown.monthlyMinus4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {(breakdown.monthlyMinus4wPct * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  A 4-week period is 28 days. A month is longer on average, so
                  the amounts are not interchangeable.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Exact
            billing depends on the agreement.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          What this “monthly equivalent” represents
        </h2>

        <p className="text-slate-700 mb-4">
          Daily pricing shows up in short stays, furnished rentals, and some
          flexible housing arrangements. Converting it to a monthly equivalent
          helps you compare it to standard long-term listings and understand
          what the rate implies over time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          The method: year first, then month
        </h3>
        <p className="text-slate-700 mb-4">
          This page converts the daily amount to a yearly total using 365 days,
          then spreads that total across an average month length (365 ÷ 12).
          That avoids mixing “30-day months” with 52-week years, which can
          quietly skew comparisons.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          When the result can be misleading
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Short-stay pricing may include cleaning fees, taxes, utilities, or
            bundled services.
          </li>
          <li>
            Long-term leases can include proration rules, free days, or
            incentives that a simple conversion does not model.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href="/true-cost-of-rent-per-day"
            className="text-sky-700 hover:underline"
          >
            true cost of rent per day
          </a>
          ,{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          , and{" "}
          <a
            href="/rent-affordability-calculator"
            className="text-sky-700 hover:underline"
          >
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
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            fees, proration, taxes, and obligations vary by location, landlord,
            and contract terms. Review your agreement for the rules that apply
            to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            real payment schedule, due dates, and fees in your agreement.
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
