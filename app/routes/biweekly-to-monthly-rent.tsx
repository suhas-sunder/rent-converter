import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/biweekly-to-monthly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Biweekly to Monthly Rent Converter" },
  {
    name: "description",
    content:
      "Convert rent paid every 2 weeks into a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown, a 26-payments-per-year explanation, and a 4-week (28-day) comparison so you can sanity-check listings and budgets.",
  },
  {
    name: "keywords",
    content:
      "biweekly to monthly rent converter, every 2 weeks to monthly rent, convert biweekly rent to monthly, biweekly rent monthly equivalent, 26 payments per year rent, biweekly vs monthly rent, 28 day vs monthly rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Biweekly to Monthly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert biweekly rent to a monthly equivalent using annual equivalence (365-day year). Includes breakdowns and a 4-week (28-day) comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/biweekly-to-monthly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Biweekly to Monthly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert biweekly rent to a monthly equivalent using annual equivalence (365-day year). Includes breakdowns and a 4-week (28-day) comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/biweekly-to-monthly-rent",
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

export default function BiweeklyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1000";
    const saved = localStorage.getItem("rc_btm_amount");
    return saved ?? "1000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_btm_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_btm_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_btm_amount", amount);
      localStorage.setItem("rc_btm_currency", currency);
      localStorage.setItem("rc_btm_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawMonthly = useMemo(
    () => convert(parsed, "biweekly", "monthly"),
    [parsed],
  );

  const monthlyResult = useMemo(() => {
    if (!includeRounding) return rawMonthly;
    return Math.round(rawMonthly * 100) / 100;
  }, [rawMonthly, includeRounding]);

  const breakdown = useMemo(() => {
    const biweekly = parsed;
    const weekly = convert(parsed, "biweekly", "weekly");
    const monthly = convert(parsed, "biweekly", "monthly");
    const annual = convert(parsed, "biweekly", "annual");
    const daily = convert(parsed, "biweekly", "daily");
    const fourWeeks = convert(parsed, "biweekly", "every_4_weeks");
    const hourly = convert(parsed, "biweekly", "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed]);

  const paymentMath = useMemo(() => {
    const biweekly = parsed;
    const paymentsPerYear = 26;
    const annualFromPayments = biweekly * paymentsPerYear;
    const monthlyFromPayments = annualFromPayments / 12;
    const deltaVsConverter = monthlyFromPayments - breakdown.monthly;
    const pctVsConverter = breakdown.monthly
      ? (monthlyFromPayments - breakdown.monthly) / breakdown.monthly
      : 0;
    return {
      paymentsPerYear,
      annualFromPayments,
      monthlyFromPayments,
      deltaVsConverter,
      pctVsConverter,
    };
  }, [parsed, breakdown.monthly]);

  const faqData = [
    {
      q: "What does “biweekly rent” mean?",
      a: "Biweekly rent is rent paid every 14 days. That schedule usually creates 26 payments per year, which is why it can feel different from paying once per calendar month.",
    },
    {
      q: "How does this page convert biweekly rent to a monthly equivalent?",
      a: "It converts the biweekly amount into an annual total using consistent time assumptions, then expresses that annual total as a monthly equivalent using an average month length (365 ÷ 12 days).",
    },
    {
      q: "How many biweekly payments are in a year?",
      a: "Typically 26. That’s the common “every 2 weeks” schedule: 52 weeks ÷ 2. Some agreements may handle exceptions or proration differently.",
    },
    {
      q: "Why doesn’t biweekly map neatly to calendar months?",
      a: "Because 14-day intervals drift across the calendar. Some months will include two payments, and some years you may notice the timing creates an extra payment relative to a monthly budget.",
    },
    {
      q: "How is biweekly different from rent paid every 4 weeks?",
      a: "Biweekly is every 14 days (26 periods per year). Every 4 weeks is every 28 days (13 periods per year). Both are non-monthly schedules, but they imply different annual totals.",
    },
    {
      q: "What assumptions does this page use?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Your lease can still use different billing rules.",
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
        name: "Biweekly to Monthly Rent Converter",
        item: "https://rentconverter.com/biweekly-to-monthly-rent",
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
    name: "Biweekly to Monthly Rent Converter",
    description:
      "Convert rent paid every 2 weeks into a monthly equivalent using annual equivalence (365-day year). Includes a full breakdown and a 4-week (28-day) comparison.",
    url: "https://rentconverter.com/biweekly-to-monthly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Biweekly to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Biweekly to Monthly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          If rent is quoted every two weeks, you probably want to know the
          monthly equivalent for budgeting and comparing listings. This page
          converts a biweekly amount into a monthly figure using a consistent
          year-based method.
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

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Convert biweekly rent into a monthly equivalent
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Biweekly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000"
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
                Paste values like $1,000, 1000.00, or 1000. Input is cleaned
                before calculation.
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
                    {PERIOD_LABEL.biweekly}
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
                {money(parsed, currency)} {PERIOD_LABEL.biweekly.toLowerCase()}{" "}
                is approximately{" "}
                <strong>{money(monthlyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.monthly.toLowerCase()}
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
                  Why biweekly feels “weird” in a monthly budget
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Payments per year:{" "}
                    <strong className="text-slate-900">
                      {paymentMath.paymentsPerYear}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Biweekly × 26:{" "}
                    <strong className="text-slate-900">
                      {money(paymentMath.annualFromPayments, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    ÷ 12 monthly:{" "}
                    <strong className="text-slate-900">
                      {money(paymentMath.monthlyFromPayments, currency)}
                    </strong>
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Difference vs converter monthly:{" "}
                    <strong className="text-slate-900">
                      {money(paymentMath.deltaVsConverter, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {(paymentMath.pctVsConverter * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Quick mental model: biweekly rent often implies 26 payments
                  per year. That is why “every 2 weeks” does not line up cleanly
                  with calendar months.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  4-week (28-day) vs monthly comparison
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
                  A 4-week schedule is 28-day cycles. A month is longer on
                  average (365 ÷ 12 days), so the numbers are not
                  interchangeable.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates and proration rules vary by lease.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How to interpret a biweekly rent price
        </h2>

        <p className="text-slate-700 mb-4">
          Biweekly pricing is common in some markets and employer-linked housing
          arrangements. It is straightforward as a schedule (every 14 days) but
          awkward for monthly budgeting because it creates a different payment
          count across the year.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          The core idea: 26 payments per year
        </h3>
        <p className="text-slate-700 mb-4">
          The reason a monthly equivalent is useful is simple: biweekly implies
          26 periods per year, while monthly implies 12. Converting everything
          to a consistent annual basis is the clean way to compare a biweekly
          listing to a monthly listing without guessing.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Quick comparison tips
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Compare annual totals first if you want the most honest comparison.
          </li>
          <li>
            Use the monthly equivalent for budgeting categories and automatic
            transfers.
          </li>
          <li>
            Confirm whether the agreement has proration, extra fees, or bundled
            utilities that change the real monthly outlay.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href="/weekly-to-monthly-rent"
            className="text-sky-700 hover:underline"
          >
            weekly to monthly rent
          </a>
          ,{" "}
          <a
            href="/rent-paid-every-4-weeks"
            className="text-sky-700 hover:underline"
          >
            rent paid every 4 weeks
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
            payment schedules, proration, fees, and obligations vary by
            location, landlord, and contract terms. Review your agreement for
            the rules that apply to you.
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
