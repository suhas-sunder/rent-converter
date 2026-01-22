import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/monthly-to-daily-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly to Daily Rent Converter" },
  {
    name: "description",
    content:
      "Convert a monthly rent price into a daily equivalent using annual equivalence (365-day year). See hourly, weekly, biweekly, 4-week (28-day), monthly, and annual breakdowns plus a 4-week vs monthly comparison.",
  },
  {
    name: "keywords",
    content:
      "monthly to daily rent converter, monthly rent per day, convert monthly rent to daily, daily equivalent rent, rent per day from monthly, 28 day rent vs monthly, 4 week rent comparison, annual equivalence rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Monthly to Daily Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert monthly rent to a daily equivalent using annual equivalence (365-day year) and view breakdowns across common billing periods, including a 4-week (28-day) comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/monthly-to-daily-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Monthly to Daily Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert monthly rent to a daily equivalent using annual equivalence (365-day year). Includes full period breakdowns and a 4-week (28-day) comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/monthly-to-daily-rent",
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

export default function MonthlyToDailyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("rc_mtd_amount");
    return saved ?? "2000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_mtd_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_mtd_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_mtd_amount", amount);
      localStorage.setItem("rc_mtd_currency", currency);
      localStorage.setItem("rc_mtd_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawDaily = useMemo(() => convert(parsed, "monthly", "daily"), [parsed]);

  const dailyResult = useMemo(() => {
    if (!includeRounding) return rawDaily;
    return Math.round(rawDaily * 100) / 100;
  }, [rawDaily, includeRounding]);

  const breakdown = useMemo(() => {
    const monthly = parsed;
    const weekly = convert(parsed, "monthly", "weekly");
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

  const faqData = [
    {
      q: "What does “monthly to daily rent” mean?",
      a: "It is the same rent expressed as a per-day amount. This page converts a monthly figure into a daily equivalent so costs can be compared on one consistent time basis.",
    },
    {
      q: "How is the daily equivalent calculated?",
      a: "The tool uses annual equivalence. Monthly is treated as an average month (365 ÷ 12 days), converted to an annual amount, then divided by 365 to produce a daily equivalent.",
    },
    {
      q: "Why not just divide monthly rent by 30?",
      a: "Dividing by 30 is a quick estimate, but it does not match annual equivalence. Using 365 ÷ 12 days per month keeps conversions consistent across daily, weekly, monthly, and annual views.",
    },
    {
      q: "Why does every 4 weeks (28 days) look different from monthly?",
      a: "A 4-week period is 28 days, while an average month is about 30.42 days (365 ÷ 12). Over a year, paying every 4 weeks can line up with 13 payment periods instead of 12 monthly payments, which changes the annual total.",
    },
    {
      q: "What time assumptions are used on this page?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Results are estimates for comparison and budgeting.",
    },
    {
      q: "Does this include utilities, parking, or other fees?",
      a: "No. It converts the rent amount only. Additional housing costs depend on the lease and the property.",
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
        name: "Monthly to Daily Rent Converter",
        item: "https://rentconverter.com/monthly-to-daily-rent",
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
    name: "Monthly to Daily Rent Converter",
    description:
      "Convert a monthly rent price into a daily equivalent using annual equivalence (365-day year). Includes breakdowns across billing periods and a 4-week (28-day) comparison.",
    url: "https://rentconverter.com/monthly-to-daily-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Monthly to Daily Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Daily Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Enter your monthly rent and get a daily equivalent using annual
          equivalence. This format helps compare listings and budgets when rent
          is advertised using different billing periods.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/monthly-to-weekly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Weekly
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
              Monthly rent converted to a daily equivalent
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
                Paste values like $2,000 or 2000.00. The input is cleaned before
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
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.daily}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Daily equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(dailyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.monthly.toLowerCase()}{" "}
                is approximately <strong>{money(dailyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.daily.toLowerCase()} using annual equivalence
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
                  This uses an average month length (365 ÷ 12 days). A 4-week
                  period is 28 days, so the totals diverge over time.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Lease
            schedules and due dates vary.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Method used on this page
        </h2>

        <p className="text-slate-700 mb-4">
          This converter treats the annual total as the reference point. Your
          monthly rent is mapped to an annual equivalent using an average month
          length, then converted into a daily rate using a 365-day year. Keeping
          one consistent annual basis makes period-to-period comparisons more
          stable.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why a daily figure is useful
        </h3>
        <p className="text-slate-700 mb-4">
          Listings can be priced monthly, weekly, or every 4 weeks. A daily
          equivalent makes it easier to compare costs without relying on rough
          shortcuts. It is also helpful for budgeting when you want to estimate
          what a move, a rent increase, or a pricing difference means over time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          4-week billing compared with monthly billing
        </h3>
        <p className="text-slate-700 mb-4">
          A 4-week period is exactly 28 days. A month is longer on average (365
          ÷ 12 days). That difference can lead to a different annual total,
          especially when a schedule effectively produces 13 periods in a year
          rather than 12.
        </p>

        <p className="text-slate-700 mb-4">
          Related tools:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
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
            href="/true-cost-of-rent-per-day"
            className="text-sky-700 hover:underline"
          >
            true cost of rent per day
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
            payment schedules, fees, and obligations vary by location, landlord,
            and lease terms. Always review your rental agreement and consider
            qualified guidance for decisions that depend on your specific
            situation.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            These tools support budgeting comparisons. Time-period assumptions
            include a 365-day year and an average month length. Confirm your
            exact payment dates and terms in your lease agreement.
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
