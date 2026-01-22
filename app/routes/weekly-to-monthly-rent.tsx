import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/weekly-to-monthly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Monthly Rent Converter" },
  {
    name: "description",
    content:
      "Convert weekly rent to monthly rent using annual equivalence (52 weeks per year). Includes a full breakdown, 4-week (28-day) comparison, and related rent affordability tools.",
  },
  {
    name: "keywords",
    content:
      "weekly to monthly rent, weekly rent to monthly, rent converter weekly to monthly, convert weekly rent to monthly, weekly to monthly rent calculator, 4 week rent vs monthly, 28 day rent vs monthly, rent affordability calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },
  { property: "og:type", content: "website" },
  { property: "og:title", content: "Weekly to Monthly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert weekly rent to monthly rent using annual equivalence (52 weeks per year). Includes a full breakdown and a 4-week (28-day) comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/weekly-to-monthly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Monthly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert weekly rent to monthly rent using annual equivalence (52 weeks per year). Includes a full breakdown and a 4-week (28-day) comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },
  {
    rel: "canonical",
    href: "https://rentconverter.com/weekly-to-monthly-rent",
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

export default function WeeklyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    try {
      const saved = localStorage.getItem("rc_wtm_amount");
      return saved ?? "500";
    } catch {
      return "500";
    }
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    try {
      const saved = localStorage.getItem("rc_wtm_currency");
      return saved ?? "CAD";
    } catch {
      return "CAD";
    }
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("rc_wtm_rounding");
      if (saved !== null) return JSON.parse(saved);
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtm_amount", amount);
      localStorage.setItem("rc_wtm_currency", currency);
      localStorage.setItem("rc_wtm_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawMonthly = useMemo(
    () => convert(parsed, "weekly", "monthly"),
    [parsed],
  );

  const monthlyResult = useMemo(() => {
    if (!includeRounding) return rawMonthly;
    return Math.round(rawMonthly * 100) / 100;
  }, [rawMonthly, includeRounding]);

  const breakdown = useMemo(() => {
    const weekly = parsed;
    const monthly = convert(parsed, "weekly", "monthly");
    const annual = convert(parsed, "weekly", "annual");
    const daily = convert(parsed, "weekly", "daily");
    const fourWeeks = convert(parsed, "weekly", "every_4_weeks");
    const hourly = convert(parsed, "weekly", "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly: convert(parsed, "weekly", "biweekly"),
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed]);

  const exampleWeekly = 500;
  const exampleMonthly = (exampleWeekly * 52) / 12;

  const faqData = [
    {
      q: "What is the exact formula for weekly to monthly rent?",
      a: "This page converts through annual equivalence: monthly = weekly × 52 ÷ 12. That keeps comparisons consistent because the year is the common reference point.",
    },
    {
      q: "Why does weekly × 4 not match the monthly result?",
      a: "Four weeks is 28 days, but an average month is about 30.42 days (365 ÷ 12). Weekly × 4 is closer to a 28-day billing cycle, not a calendar month.",
    },
    {
      q: "How is every-4-weeks rent different from monthly rent?",
      a: "Every 4 weeks typically means 13 payments per year (52 ÷ 4). Monthly billing is 12 payments per year. Even if the per-payment amounts look similar, the annual totals can differ.",
    },
    {
      q: "Can weekly rent look cheaper but cost more over a year?",
      a: "Yes. Two listings can look different because one is quoted weekly and the other monthly. Converting both to annual totals helps illustrate whether the pricing is actually equivalent.",
    },
    {
      q: "Does this match the exact day your rent is due?",
      a: "It is an estimate for budgeting and comparison. Actual payment schedules and due dates depend on lease terms and how a landlord defines billing periods.",
    },
    {
      q: "Does the math change by country?",
      a: "The conversion math stays the same. What changes is the wording and what is commonly advertised, such as weekly rent in Australia and New Zealand and PCM in the UK.",
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

  const breadcrumbName = "Weekly to Monthly Rent Converter";

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
        item: "https://rentconverter.com/weekly-to-monthly-rent",
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
    name: "Weekly to Monthly Rent Converter",
    description:
      "Convert weekly rent to monthly rent using annual equivalence (52 weeks per year). Includes a full breakdown and a 4-week (28-day) comparison.",
    url: "https://rentconverter.com/weekly-to-monthly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4 ">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / {breadcrumbName}
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Weekly to Monthly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Convert weekly rent into a monthly equivalent using annual
          equivalence. Weekly listings and monthly listings can only be compared
          cleanly after they are expressed on the same annual basis.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/monthly-to-weekly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Weekly
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
              Instant weekly to monthly conversion
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
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
                Paste values like $650, 650.00, or 1,200. Input is cleaned
                automatically.
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
                    {PERIOD_LABEL.weekly}
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
                {money(parsed, currency)} {PERIOD_LABEL.weekly.toLowerCase()} ≈{" "}
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
                  4-week (28-day) vs monthly comparison
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
                  Monthly uses an average month (365 ÷ 12 days). A 4-week period
                  is 28 days. That gap changes annual totals.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates vary by lease.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Weekly to monthly rent is not weekly × 4
        </h2>

        <p className="text-slate-700 mb-4">
          Weekly rent is a 7-day price. Monthly rent is a calendar-month price,
          and the year does not divide cleanly into 4-week blocks. This page
          converts weekly rent to an annual total (52 payments), then expresses
          that annual total as a monthly equivalent (12 payments).
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          The exact conversion step
        </h3>
        <p className="text-slate-700 mb-4">
          Monthly equivalent = weekly × 52 ÷ 12. For example,{" "}
          {money(exampleWeekly, currency)} per week converts to about{" "}
          <strong>
            {money(
              includeRounding
                ? Math.round(exampleMonthly * 100) / 100
                : exampleMonthly,
              currency,
            )}
          </strong>{" "}
          per month using annual equivalence.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why weekly × 4 is a different billing cycle
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>Weekly × 4 represents 28 days, not a calendar month.</li>
          <li>
            A calendar month averages about 30.42 days (365 ÷ 12), so it is
            longer than 28 days.
          </li>
          <li>
            Every-4-weeks billing often produces 13 payments per year, while
            monthly billing produces 12.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          When this matters most
        </h3>
        <p className="text-slate-700 mb-4">
          This difference is most visible when comparing a listing advertised
          weekly with a listing advertised monthly, or when a tenant is deciding
          between monthly billing and every-4-weeks billing. Converting both
          options to annual totals helps illustrate whether the pricing is truly
          equivalent.
        </p>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="text-sky-700 hover:underline"
          >
            weekly vs monthly rent
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
            href="/monthly-to-weekly-rent"
            className="text-sky-700 hover:underline"
          >
            monthly to weekly rent
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
