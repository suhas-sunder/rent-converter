import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-per-day-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Per Day Calculator – Daily Rent From Monthly, Weekly, 4-Week, Biweekly, Annual",
  },
  {
    name: "description",
    content:
      "Calculate rent per day from monthly, weekly, every 4 weeks (28 days), biweekly, hourly, or annual amounts. Includes a full breakdown and a daily total estimator for a chosen number of days, using annual equivalence.",
  },
  {
    name: "keywords",
    content:
      "rent per day calculator, daily rent calculator, rent per day from monthly, daily equivalent rent, rent per day from weekly, rent per day from 4 week rent, 28 day rent per day, prorated rent per day",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Rent Per Day Calculator – Daily Equivalent Rent",
  },
  {
    property: "og:description",
    content:
      "Convert rent to a daily equivalent from monthly, weekly, 4-week (28-day), biweekly, hourly, or annual amounts. Includes breakdowns and a daily total estimator based on annual equivalence.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-per-day-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Per Day Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate daily equivalent rent from monthly, weekly, 4-week (28-day), biweekly, hourly, or annual amounts. Includes breakdowns and a daily total estimator.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-per-day-calculator",
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

/**
 * Assumptions:
 * - Year = 365 days
 * - Month = 365/12 days (average month)
 * - Week = 7 days
 * - Biweekly = 14 days
 * - Every 4 weeks = 28 days
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

export default function RentPerDayCalculator() {
  const pageName = "Rent Per Day Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-per-day-calculator";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("rpdc_amount");
    return saved ?? "2000";
  });

  const [from, setFrom] = useState<Exclude<Period, "daily">>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rpdc_from") as Exclude<
      Period,
      "daily"
    > | null;
    return saved ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rpdc_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rpdc_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  const [daysCount, setDaysCount] = useState<string>(() => {
    if (typeof window === "undefined") return "30";
    const saved = localStorage.getItem("rpdc_daysCount");
    return saved ?? "30";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rpdc_amount", amount);
    localStorage.setItem("rpdc_from", from);
    localStorage.setItem("rpdc_currency", currency);
    localStorage.setItem("rpdc_rounding", JSON.stringify(includeRounding));
    localStorage.setItem("rpdc_daysCount", daysCount);
  }, [amount, from, currency, includeRounding, daysCount]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const parsedDays = useMemo(() => {
    const cleaned = daysCount.replace(/[^\d]/g, "");
    const n = parseInt(cleaned || "0", 10);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 3660);
  }, [daysCount]);

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
      annualFromDaily: dailyV * 365,
      weeklyFromDaily: dailyV * 7,
      monthlyFromDailyAvg: dailyV * (365 / 12),
    };
  }, [parsed, from]);

  const totalForDays = useMemo(() => {
    const t = daily * parsedDays;
    if (!Number.isFinite(t)) return 0;
    return includeRounding ? Math.round(t * 100) / 100 : t;
  }, [daily, parsedDays, includeRounding]);

  const faqData = [
    {
      q: "What does “rent per day” mean on this calculator?",
      a: "It is the rent amount converted into a daily equivalent using annual equivalence. This helps compare rent amounts that are quoted on different billing cycles on the same basis.",
    },
    {
      q: "Why is monthly rent divided by 30 not always the same as this result?",
      a: "Months are not a fixed length. This calculator uses an average month of 365 ÷ 12 days, then expresses the implied annual total as a per-day amount. Dividing by 30 assumes a 30-day month and changes the annual total.",
    },
    {
      q: "How does every 4 weeks (28 days) affect daily rent?",
      a: "A 4-week period is exactly 28 days, which makes the daily math straightforward for that billing cycle. The yearly total can still differ from monthly because 4-week billing often implies 13 payments per year rather than 12.",
    },
    {
      q: "Is this the same as a lease proration calculation for a specific move-in date?",
      a: "Not exactly. This is a daily equivalent for comparison. Lease proration depends on the lease wording and how the landlord defines the billing month and due dates.",
    },
    {
      q: "What is this most useful for?",
      a: "It helps compare listings (weekly vs monthly vs 4-week), estimate short time windows, and translate a quoted rent into a consistent per-day rate for budgeting comparisons.",
    },
    {
      q: "What assumptions does the daily calculation use?",
      a: "It uses a 365-day year, a month length of 365 ÷ 12 days (average), and fixed day counts for weekly (7), biweekly (14), and every 4 weeks (28).",
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
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
      },
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
          Rent Per Day Calculator
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          Convert rent into a daily equivalent from monthly, weekly, every 4
          weeks (28 days), biweekly, hourly, or annual amounts. This helps
          compare listings through annual equivalence, then expresses the result
          as rent per day.
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
                    "weekly",
                    "every_4_weeks",
                    "biweekly",
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
                converted into a 1-day amount.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Rent per day</div>

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

            <div className="mt-6 grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
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
                </div>

                <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
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
                    A 4-week period is 28 days. A month averages about 30.42
                    days (365 ÷ 12). The gap changes annual totals.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Total for a chosen number of days
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    This multiplies the daily equivalent by a day count for
                    quick comparisons. Lease proration rules can differ from
                    this estimate.
                  </p>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of days
                  </label>
                  <input
                    inputMode="numeric"
                    value={daysCount}
                    onChange={(e) => setDaysCount(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Estimated total
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-800">
                      {money(totalForDays, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {money(daily, currency)} per day × {parsedDays} days
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-xs text-slate-500">
                        Equivalent per week
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(
                          includeRounding
                            ? Math.round(breakdown.weeklyFromDaily * 100) / 100
                            : breakdown.weeklyFromDaily,
                          currency,
                        )}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-xs text-slate-500">
                        Equivalent average per month
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(
                          includeRounding
                            ? Math.round(breakdown.monthlyFromDailyAvg * 100) /
                                100
                            : breakdown.monthlyFromDailyAvg,
                          currency,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Equivalent per year
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualFromDaily * 100) / 100
                          : breakdown.annualFromDaily,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Daily × 365
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Why daily equivalents can differ from calendar-day expectations
            </h3>
            <p className="text-slate-700 mb-4">
              Rent listings mix billing cycles that do not map cleanly onto a
              calendar. Converting to a daily equivalent helps compare the
              underlying cost, but it does not replace lease-specific proration
              rules.
            </p>
            <p className="text-slate-700 mb-4">
              The common mismatch is monthly rent. A calendar month is not a
              fixed number of days, so dividing by 30 can produce a different
              implied annual total than dividing by an average month length.
              This calculator resolves the billing cycle through annual
              equivalence and then converts back to a 1-day amount.
            </p>

            <h4 className="text-xl font-semibold mt-8 mb-3 text-slate-900">
              Payment counts per year (for comparison)
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
              If the listing is billed every 4 weeks, the daily rate is based on
              28-day periods. That can make the daily number feel similar to
              monthly rent divided by 30, while the annual total still differs
              because the payment count is usually 13 per year.
            </p>

            <p className="text-slate-700 mb-4">
              For weekly comparisons, use{" "}
              <a
                href="/true-cost-of-rent-per-week"
                className="text-sky-700 hover:underline"
              >
                true cost of rent per week
              </a>
              . For broader conversions across time periods, use{" "}
              <a
                href="/rent-converter"
                className="text-sky-700 hover:underline"
              >
                the rent converter hub
              </a>
              .
            </p>

            <p className="text-slate-700 mb-4">
              For pay-cycle context, see{" "}
              <a
                href="/rent-billed-every-28-days"
                className="text-sky-700 hover:underline"
              >
                rent billed every 28 days
              </a>{" "}
              and{" "}
              <a
                href="/rent-paid-weekly-vs-monthly"
                className="text-sky-700 hover:underline"
              >
                weekly vs monthly rent
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
