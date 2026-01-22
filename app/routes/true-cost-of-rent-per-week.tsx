import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/true-cost-of-rent-per-week";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "True Cost of Rent Per Week Calculator – Weekly Rent From Monthly, 4-Week, Biweekly, Daily, Annual",
  },
  {
    name: "description",
    content:
      "Calculate the true cost of rent per week from monthly, every 4 weeks (28 days), biweekly, daily, hourly, or annual amounts. Includes full breakdowns and a weekly vs 4-week vs monthly comparison based on annual equivalence.",
  },
  {
    name: "keywords",
    content:
      "true cost of rent per week, rent per week calculator, weekly rent from monthly, weekly equivalent rent, weekly rent from 4 week rent, 28 day rent weekly equivalent, weekly cost of rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "True Cost of Rent Per Week Calculator – Weekly Equivalent Rent",
  },
  {
    property: "og:description",
    content:
      "Convert rent to a weekly equivalent from monthly, 4-week (28-day), biweekly, daily, hourly, and annual billing. Includes full breakdown and comparisons based on annual equivalence.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/true-cost-of-rent-per-week",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "True Cost of Rent Per Week Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate weekly equivalent rent from monthly, 4-week, biweekly, daily, hourly, and annual amounts. Includes breakdowns and comparisons.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/true-cost-of-rent-per-week",
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

export default function TrueCostOfRentPerWeek() {
  const pageName = "True Cost of Rent Per Week Calculator";
  const canonicalUrl = "https://rentconverter.com/true-cost-of-rent-per-week";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("tcrpw_amount");
    return saved ?? "2000";
  });

  const [from, setFrom] = useState<Exclude<Period, "weekly">>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("tcrpw_from") as Exclude<
      Period,
      "weekly"
    > | null;
    return saved ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("tcrpw_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("tcrpw_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tcrpw_amount", amount);
    localStorage.setItem("tcrpw_from", from);
    localStorage.setItem("tcrpw_currency", currency);
    localStorage.setItem("tcrpw_rounding", JSON.stringify(includeRounding));
  }, [amount, from, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawWeekly = useMemo(
    () => convert(parsed, from, "weekly"),
    [parsed, from],
  );

  const weekly = useMemo(() => {
    if (!includeRounding) return rawWeekly;
    return Math.round(rawWeekly * 100) / 100;
  }, [rawWeekly, includeRounding]);

  const breakdown = useMemo(() => {
    const hourly = convert(parsed, from, "hourly");
    const daily = convert(parsed, from, "daily");
    const weeklyV = convert(parsed, from, "weekly");
    const biweekly = convert(parsed, from, "biweekly");
    const every_4_weeks = convert(parsed, from, "every_4_weeks");
    const monthly = convert(parsed, from, "monthly");
    const annual = convert(parsed, from, "annual");

    return {
      hourly,
      daily,
      weekly: weeklyV,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
      weeksPerMonthAvg: 52 / 12,
      monthlyFromWeekly: weeklyV * (52 / 12),
      annualFromWeekly: weeklyV * 52,
    };
  }, [parsed, from]);

  const weeklyFraming = useMemo(() => {
    const m = convert(parsed, from, "monthly");
    const w = convert(parsed, from, "weekly");
    const a = convert(parsed, from, "annual");
    const avgMonthWeeks = 52 / 12;
    const monthlyFromWeekly = w * avgMonthWeeks;

    return {
      monthly: m,
      weekly: w,
      annual: a,
      avgMonthWeeks,
      monthlyFromWeekly,
      calendarFourWeeksAsWeekly: convert(parsed, from, "every_4_weeks") / 4,
      fourWeekAsAnnual: convert(parsed, from, "every_4_weeks") * 13,
    };
  }, [parsed, from]);

  const faqData = [
    {
      q: "What does “true cost per week” mean on this page?",
      a: "It is the rent amount converted into a weekly equivalent through annual equivalence. This helps compare rent amounts quoted on different billing cycles on a consistent basis.",
    },
    {
      q: "Why is weekly rent not the same as “monthly divided by 4”?",
      a: "A year has 52 weeks, so an average month is about 52 ÷ 12 = 4.33 weeks. Dividing by 4 assumes a 4-week month, which changes annual totals.",
    },
    {
      q: "How is 4-week (28-day) rent treated when finding a weekly equivalent?",
      a: "A 4-week period is 28 days, which is exactly 4 weeks. The weekly equivalent for a 4-week rent is that amount ÷ 4, and the annual total typically reflects 13 payments per year.",
    },
    {
      q: "If a listing says “rent due every two weeks,” how does that translate to per week?",
      a: "This converts a 2-week rent (14 days) into a weekly equivalent by dividing across the same annual basis, then expressing the result per 7-day week.",
    },
    {
      q: "Does this weekly number represent the amount paid in a calendar week?",
      a: "Not necessarily. It is an equivalent rate for comparison. Actual payment timing depends on the billing schedule and due dates in the lease.",
    },
    {
      q: "What assumptions are used for the weekly calculation?",
      a: "It uses a 365-day year, weekly = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and a month length of 365 ÷ 12 days (average).",
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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="text-sm text-slate-500 mb-4">
          <a href="/" className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
        </nav>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          True Cost of Rent Per Week Calculator
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          Convert rent into a weekly equivalent from monthly, every 4 weeks (28
          days), biweekly, daily, hourly, or annual amounts. This helps compare
          listings through annual equivalence, then expresses the result as rent
          per week.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Weekly rent equivalent
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent amount
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
                Pasted values like $2,000 or 2000.00 are cleaned automatically.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period for that amount
              </label>
              <select
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value as Exclude<Period, "weekly">)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "daily",
                    "annual",
                    "hourly",
                  ] as Exclude<Period, "weekly">[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                The weekly equivalent is derived through annual equivalence,
                then converted into a 7-day week.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">True cost per week</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(weekly, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL[from].toLowerCase()} ≈{" "}
                <strong>{money(weekly, currency)}</strong>{" "}
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
                  A 4-week period is 28 days. A month averages about 30.42 days
                  (365 ÷ 12). The gap changes annual totals.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Why weekly equivalents reduce billing-cycle confusion
            </h3>
            <p className="text-slate-700 mb-4">
              Weekly numbers are often easier to compare across listings because
              they represent a fixed 7-day period. The challenge is that many
              listings are not billed weekly. This calculator converts different
              billing schedules into a weekly equivalent using annual
              equivalence.
            </p>
            <p className="text-slate-700 mb-4">
              The weekly equivalent is not a claim about when payments occur. It
              is a comparison rate derived by taking the annual total implied by
              the billing cycle and expressing it as a per-week amount over 52
              weeks.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">
                Weekly rate and implied monthly total
              </h4>
              <p className="text-slate-700 text-sm mb-4">
                For planning, it can help to translate the weekly equivalent
                back into an average monthly amount. This uses an average month
                length derived from a 52-week year.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Average weeks per month
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {breakdown.weeksPerMonthAvg.toFixed(4)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">52 ÷ 12</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Weekly equivalent
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(
                      includeRounding
                        ? Math.round(weeklyFraming.weekly * 100) / 100
                        : weeklyFraming.weekly,
                      currency,
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Per 7-day week
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Implied average monthly amount
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-800">
                    {money(
                      includeRounding
                        ? Math.round(breakdown.monthlyFromWeekly * 100) / 100
                        : breakdown.monthlyFromWeekly,
                      currency,
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Weekly × (52 ÷ 12)
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-semibold mt-10 mb-3 text-slate-900">
              Payment counts per year
            </h4>
            <ul className="list-disc ml-6 text-slate-700 mb-4">
              <li>
                Weekly: <strong>52</strong> payments per year
              </li>
              <li>
                Every 2 weeks: <strong>26</strong> payments per year
              </li>
              <li>
                Every 4 weeks (28 days): <strong>13</strong> payments per year
              </li>
              <li>
                Monthly: <strong>12</strong> payments per year
              </li>
            </ul>

            <p className="text-slate-700 mb-4">
              Weekly equivalents are most helpful when comparing a monthly
              listing to a 4-week listing. A 4-week schedule can create a
              different annual total even when the displayed number looks close
              to a monthly rent amount.
            </p>

            <p className="text-slate-700 mb-4">
              For a deeper explanation of the weekly versus monthly mismatch,
              see{" "}
              <a
                href="/rent-paid-weekly-vs-monthly"
                className="text-sky-700 hover:underline"
              >
                weekly vs monthly rent
              </a>
              .
            </p>

            <p className="text-slate-700 mb-4">
              For daily comparisons, use{" "}
              <a
                href="/true-cost-of-rent-per-day"
                className="text-sky-700 hover:underline"
              >
                true cost of rent per day
              </a>
              . For full conversions across all periods, use{" "}
              <a
                href="/rent-converter"
                className="text-sky-700 hover:underline"
              >
                the rent converter hub
              </a>
              .
            </p>

            <p className="text-slate-700 mb-4">
              To evaluate affordability alongside conversion, use{" "}
              <a
                href="/rent-affordability-calculator"
                className="text-sky-700 hover:underline"
              >
                the rent affordability calculator
              </a>
              .
            </p>
          </section>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
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
          </section>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            every 4 weeks = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates and lease terms vary.
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
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
    </main>
  );
}
