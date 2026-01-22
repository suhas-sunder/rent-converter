import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/hourly-to-monthly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Hourly to Monthly Rent Converter" },
  {
    name: "description",
    content:
      "Convert hourly rent to a monthly equivalent using annual equivalence (365-day year). Includes a full period breakdown and a month-length comparison that avoids fixed 30-day assumptions.",
  },
  {
    name: "keywords",
    content:
      "hourly to monthly rent, convert hourly rent to monthly, hourly rent to monthly calculator, hourly rate to monthly rent equivalent, rent per hour to monthly, monthly equivalent of hourly rent, hour to month rent converter",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Hourly to Monthly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert hourly rent to monthly using annual equivalence. Includes a full breakdown across periods and a month-length comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/hourly-to-monthly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Hourly to Monthly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert hourly rent to monthly using annual equivalence. Includes full breakdowns and month-length comparisons.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/hourly-to-monthly-rent",
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

export default function HourlyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2.5";
    const saved = localStorage.getItem("rc_htm_amount");
    return saved ?? "2.5";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_htm_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_htm_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_htm_amount", amount);
      localStorage.setItem("rc_htm_currency", currency);
      localStorage.setItem("rc_htm_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawMonthly = useMemo(
    () => convert(parsed, "hourly", "monthly"),
    [parsed],
  );

  const monthlyResult = useMemo(() => {
    if (!includeRounding) return rawMonthly;
    return Math.round(rawMonthly * 100) / 100;
  }, [rawMonthly, includeRounding]);

  const breakdown = useMemo(() => {
    const hourly = parsed;

    const daily = convert(parsed, "hourly", "daily");
    const weekly = convert(parsed, "hourly", "weekly");
    const biweekly = convert(parsed, "hourly", "biweekly");
    const every_4_weeks = convert(parsed, "hourly", "every_4_weeks");
    const monthly = convert(parsed, "hourly", "monthly");
    const annual = convert(parsed, "hourly", "annual");

    // Route-specific: month-length interpretation check
    const monthly30Day = hourly * 24 * 30; // not used as truth, only for comparison
    const monthlyAvgMonth = hourly * 24 * (365 / 12); // aligns with annual equivalence
    const monthDelta = monthlyAvgMonth - monthly30Day;
    const monthDeltaPct = monthly30Day ? monthDelta / monthly30Day : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      monthly30Day,
      monthlyAvgMonth,
      monthDelta,
      monthDeltaPct,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How does this convert hourly rent to monthly rent?",
      a: "It uses annual equivalence. The hourly amount is converted into a daily amount (24 hours per day), then expressed as a monthly equivalent using an average month length based on a 365-day year.",
    },
    {
      q: "Why does this not treat a month as exactly 30 days?",
      a: "A fixed 30-day month is a rough estimate. This converter uses an average month length (365 ÷ 12 days) so the monthly result stays consistent with annual, weekly, and 4-week equivalents.",
    },
    {
      q: "What does an hourly rent number represent in practice?",
      a: "It can represent a time-based rate used for comparison, budgeting, or short-stay pricing. The monthly equivalent here illustrates what that hourly amount would look like when scaled to an average month on the same annual basis.",
    },
    {
      q: "Does this include assumptions about occupancy or usage?",
      a: "No. It applies time-period assumptions only (hours per day, days per year, and average month length). If an hourly rate is only charged for certain hours or days, that is a different structure than this equivalence.",
    },
    {
      q: "How is hourly conversion related to 4-week (28-day) rent?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Converting both through annual equivalence helps compare 28-day pricing to monthly pricing without treating 4 weeks as a calendar month.",
    },
    {
      q: "Why can the monthly equivalent look high compared with expectations?",
      a: "Hourly amounts scale quickly when expressed over an average month because a month contains many hours. The full breakdown shows the intermediate daily and weekly equivalents so the scaling is visible.",
    },
    {
      q: "Does this match exact totals for a specific contract or lease?",
      a: "It estimates equivalents for comparison. Real totals depend on contract terms, billing rules, minimum charges, and due dates.",
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
        name: "Hourly to Monthly Rent Converter",
        item: "https://rentconverter.com/hourly-to-monthly-rent",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Hourly to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Hourly to Monthly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert an hourly rent amount into a monthly equivalent using annual
          equivalence as the source of truth. This helps compare hourly pricing
          to monthly rent using consistent time-period assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/daily-to-monthly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Daily → Monthly
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
              Instant hourly to monthly conversion
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hourly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2.5"
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
                Paste values like $2.50 or 2.5. Input is cleaned automatically.
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
                    {PERIOD_LABEL.hourly}
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
                {money(parsed, currency)} {PERIOD_LABEL.hourly.toLowerCase()} ≈{" "}
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
                  Month length comparison (average month vs 30-day month)
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      30-day month estimate
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.monthly30Day * 100) / 100
                          : breakdown.monthly30Day,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Computed as hourly × 24 × 30
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Average-month equivalence
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.monthlyAvgMonth * 100) / 100
                          : breakdown.monthlyAvgMonth,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Uses 365 ÷ 12 days per month
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.monthDelta * 100) / 100
                          : breakdown.monthDelta,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.monthDeltaPct * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This page uses the average-month approach so the monthly
                  amount aligns with annual equivalence. A fixed 30-day month
                  can drift because it is shorter than an average month.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  4-week vs monthly context
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
                  A 4-week period is 28 days. An average month is about 30.42
                  days (365 ÷ 12). These are different periods, so their
                  monthly-equivalent totals can diverge.
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
          Hourly amounts expressed as monthly rent
        </h2>

        <p className="text-slate-700 mb-4">
          Hourly pricing is sometimes used for short stays, flexible occupancy,
          or time-based agreements. Converting an hourly amount into monthly
          rent helps compare hourly pricing to listings expressed as monthly
          rent, using the same annual basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why the converter uses an average month length
        </h3>
        <p className="text-slate-700 mb-4">
          A month is not a fixed number of days. Using an average month length
          (365 ÷ 12 days) keeps the monthly figure consistent with the annual
          total and avoids drift when comparing to weekly, biweekly, and 4-week
          prices. The month-length comparison above shows how a fixed 30-day
          estimate can diverge from annual equivalence.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and what the monthly equivalent represents
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            The monthly equivalent represents a time-based monthly rate derived
            from the hourly amount, not a claim about how billing is collected.
          </li>
          <li>
            If an hourly rate only applies to certain hours or days, that is a
            different structure than annual equivalence.
          </li>
          <li>
            The full breakdown provides intermediate daily and weekly amounts so
            the scale-up from hourly to monthly is transparent.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to hourly-to-monthly conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Hourly amounts can appear small but convert into large monthly
            totals because a month contains many hours.
          </li>
          <li>
            A “30-day month” assumption can understate an average-month
            equivalent when comparisons are made across a full year.
          </li>
          <li>
            A 4-week period (28 days) is not a month, even though it is often
            close in casual conversation.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a
            href="/daily-to-monthly-rent"
            className="text-sky-700 hover:underline"
          >
            daily to monthly rent
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
    </main>
  );
}
