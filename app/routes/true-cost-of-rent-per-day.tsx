import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/true-cost-of-rent-per-day";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "True Cost of Rent Per Day Calculator – Daily Rent From Weekly, Monthly, 4-Week, Biweekly",
  },
  {
    name: "description",
    content:
      "Calculate the true cost of rent per day from weekly, monthly, biweekly, or every 4 weeks (28 days). Shows daily equivalent, full breakdown, and clear comparisons based on annual equivalence.",
  },
  {
    name: "keywords",
    content:
      "true cost of rent per day, rent per day calculator, daily rent from monthly, daily rent from weekly, daily rent from 4 week rent, 28 day rent per day, daily rent equivalent, rent daily cost",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "True Cost of Rent Per Day Calculator – Daily Equivalent Rent",
  },
  {
    property: "og:description",
    content:
      "Convert rent to a daily equivalent from weekly, monthly, biweekly, and 4-week (28-day) billing. Includes full breakdown and comparisons.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/true-cost-of-rent-per-day",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "True Cost of Rent Per Day Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate the daily equivalent of rent from weekly, monthly, biweekly, and 4-week rent. Includes breakdowns and comparisons.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/true-cost-of-rent-per-day",
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

export default function TrueCostOfRentPerDay() {
  const pageName = "True Cost of Rent Per Day Calculator";
  const canonicalUrl = "https://rentconverter.com/true-cost-of-rent-per-day";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("tcrpd_amount");
    return saved ?? "2000";
  });

  const [from, setFrom] = useState<Exclude<Period, "daily">>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("tcrpd_from") as Exclude<
      Period,
      "daily"
    > | null;
    return saved ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("tcrpd_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("tcrpd_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tcrpd_amount", amount);
    localStorage.setItem("tcrpd_from", from);
    localStorage.setItem("tcrpd_currency", currency);
    localStorage.setItem("tcrpd_rounding", JSON.stringify(includeRounding));
  }, [amount, from, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawDaily = useMemo(
    () => convert(parsed, from, "daily"),
    [parsed, from],
  );

  const daily = useMemo(() => {
    if (!includeRounding) return rawDaily;
    return Math.round(rawDaily * 100) / 100;
  }, [rawDaily, includeRounding]);

  const breakdown = useMemo(() => {
    const hourly = convert(parsed, from, "hourly");
    const dailyV = convert(parsed, from, "daily");
    const weekly = convert(parsed, from, "weekly");
    const biweekly = convert(parsed, from, "biweekly");
    const every_4_weeks = convert(parsed, from, "every_4_weeks");
    const monthly = convert(parsed, from, "monthly");
    const annual = convert(parsed, from, "annual");

    return {
      hourly,
      daily: dailyV,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
      annualFromWeekly: weekly * 52,
      annualFromMonthly: monthly * 12,
    };
  }, [parsed, from]);

  const comparisonCards = useMemo(() => {
    const base = parsed;
    return [
      {
        key: "monthly",
        label: "If this is monthly rent",
        daily: convert(base, "monthly", "daily"),
        annual: convert(base, "monthly", "annual"),
      },
      {
        key: "every_4_weeks",
        label: "If this is 4-week (28-day) rent",
        daily: convert(base, "every_4_weeks", "daily"),
        annual: convert(base, "every_4_weeks", "annual"),
      },
      {
        key: "weekly",
        label: "If this is weekly rent",
        daily: convert(base, "weekly", "daily"),
        annual: convert(base, "weekly", "annual"),
      },
    ] as const;
  }, [parsed]);

  const faqData = [
    {
      q: "What does “true cost per day” mean here?",
      a: "It is the rent amount converted into a daily equivalent using annual equivalence. This helps compare listings that quote rent on different billing cycles.",
    },
    {
      q: "Why can two rents that look similar have different per-day costs?",
      a: "The billing cycle changes how many payments occur over a year. A 28-day cycle typically creates 13 payments per year, while monthly creates 12 payments per year.",
    },
    {
      q: "Is a daily equivalent the same as dividing monthly rent by 30?",
      a: "No. This calculator uses an average-month method based on a 365-day year, so the daily equivalent is consistent with annual totals rather than a fixed 30-day month.",
    },
    {
      q: "Does this include utilities, parking, or other fees?",
      a: "No. It converts the rent amount entered. Additional costs can be compared separately by converting them to daily or annual equivalents as well.",
    },
    {
      q: "How should weekly, biweekly, and 4-week rents be compared to monthly rents?",
      a: "A reliable comparison converts each to an annual total, then derives the equivalent daily, weekly, or monthly amount. This avoids assuming calendar months match fixed-week cycles.",
    },
    {
      q: "What assumptions are used for the daily conversion?",
      a: "It uses a 365-day year, a month length of 365 ÷ 12 days (average), weekly = 7 days, biweekly = 14 days, and every 4 weeks = 28 days.",
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
          True Cost of Rent Per Day Calculator
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          Convert rent into a daily equivalent from monthly, weekly, biweekly,
          or every 4 weeks (28 days). This helps compare listings through annual
          equivalence, then expresses the result as rent per day.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Daily rent equivalent
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
                  setFrom(e.target.value as Exclude<Period, "daily">)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "weekly",
                    "annual",
                    "hourly",
                  ] as Exclude<Period, "daily">[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                The daily equivalent is derived through annual equivalence, then
                converted into a per-day number.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">True cost per day</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(daily, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL[from].toLowerCase()} ≈{" "}
                <strong>{money(daily, currency)}</strong>{" "}
                {PERIOD_LABEL.daily.toLowerCase()}
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
              Why “rent per day” is useful for comparisons
            </h3>
            <p className="text-slate-700 mb-4">
              Listings can quote rent on different schedules. A daily equivalent
              helps compare two prices that are not naturally aligned, such as
              weekly rent versus monthly rent, or 28-day rent versus monthly
              rent.
            </p>
            <p className="text-slate-700 mb-4">
              The daily number comes from annual equivalence. The entered rent
              is converted into an annual amount using its payment count, then
              expressed as a daily equivalent from a 365-day year. This keeps
              comparisons consistent across billing cycles.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">
                Same number, different daily cost (illustration)
              </h4>
              <p className="text-slate-700 text-sm mb-4">
                This uses the entered amount and shows how the daily and annual
                equivalents change if that amount is treated as monthly, 4-week,
                or weekly rent.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonCards.map((c) => {
                  const d = includeRounding
                    ? Math.round(c.daily * 100) / 100
                    : c.daily;
                  const a = includeRounding
                    ? Math.round(c.annual * 100) / 100
                    : c.annual;
                  return (
                    <div
                      key={c.key}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{c.label}</div>
                      <div className="mt-2 text-sm text-slate-700">
                        Per day:{" "}
                        <strong className="text-slate-900">
                          {money(d, currency)}
                        </strong>
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        Annual:{" "}
                        <strong className="text-slate-900">
                          {money(a, currency)}
                        </strong>
                      </div>
                    </div>
                  );
                })}
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
              For related comparisons, see{" "}
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

            <p className="text-slate-700 mb-4">
              This page focuses on daily equivalents. For full period-to-period
              conversions, use{" "}
              <a
                href="/rent-converter"
                className="text-sky-700 hover:underline"
              >
                the rent converter hub
              </a>
              .
            </p>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Related tools
            </h3>
            <ul className="list-disc ml-6 text-slate-700">
              <li>
                <a
                  href="/true-cost-of-rent-per-week"
                  className="text-sky-700 hover:underline"
                >
                  True cost of rent per week
                </a>
              </li>
              <li>
                <a
                  href="/rent-affordability-calculator"
                  className="text-sky-700 hover:underline"
                >
                  Rent affordability calculator
                </a>
              </li>
              <li>
                <a
                  href="/rent-paid-every-4-weeks"
                  className="text-sky-700 hover:underline"
                >
                  Rent paid every 4 weeks
                </a>
              </li>
            </ul>
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
