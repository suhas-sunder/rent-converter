import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/weekly-to-annual-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Annual Rent Converter" },
  {
    name: "description",
    content:
      "Convert weekly rent to an annual total using annual equivalence (365-day year). Includes a full period breakdown, a 52-payments comparison, 4-week (28-day) context, and FAQs specific to weekly vs annual totals.",
  },
  {
    name: "keywords",
    content:
      "weekly to annual rent, weekly to yearly rent, convert weekly rent to annual, weekly rent annual total, weekly rent to yearly calculator, weekly rent 52 weeks vs 365 days, rent converter weekly to annual",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Weekly to Annual Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert weekly rent to an annual total using annual equivalence. Includes a full breakdown and a 52-payments comparison to clarify weekly-to-yearly totals.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/weekly-to-annual-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Annual Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert weekly rent to an annual total using annual equivalence. Includes a full breakdown and a 52-payments comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/weekly-to-annual-rent",
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

export default function WeeklyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "550";
    const saved = localStorage.getItem("rc_wta_amount");
    return saved ?? "550";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_wta_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_wta_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wta_amount", amount);
      localStorage.setItem("rc_wta_currency", currency);
      localStorage.setItem("rc_wta_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawAnnual = useMemo(
    () => convert(parsed, "weekly", "annual"),
    [parsed],
  );

  const annualResult = useMemo(() => {
    if (!includeRounding) return rawAnnual;
    return Math.round(rawAnnual * 100) / 100;
  }, [rawAnnual, includeRounding]);

  const breakdown = useMemo(() => {
    const weekly = parsed;
    const annual = convert(parsed, "weekly", "annual");
    const monthly = convert(parsed, "weekly", "monthly");
    const daily = convert(parsed, "weekly", "daily");
    const biweekly = convert(parsed, "weekly", "biweekly");
    const fourWeeks = convert(parsed, "weekly", "every_4_weeks");
    const hourly = convert(parsed, "weekly", "hourly");

    const annualIf52Payments = weekly * 52;
    const annualIf53Payments = weekly * 53;
    const annualIf365DayEquivalence = annual;

    const delta52 = annualIf365DayEquivalence - annualIf52Payments;
    const pct52 = annualIf52Payments ? delta52 / annualIf52Payments : 0;

    const delta53 = annualIf365DayEquivalence - annualIf53Payments;
    const pct53 = annualIf53Payments ? delta53 / annualIf53Payments : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks: fourWeeks,
      monthly,
      annual,
      annualIf52Payments,
      annualIf53Payments,
      delta52,
      pct52,
      delta53,
      pct53,
      monthlyMinus4w: monthly - fourWeeks,
      monthlyMinus4wPct: fourWeeks ? (monthly - fourWeeks) / fourWeeks : 0,
      annualFromMonthlyShortcut: monthly * 12,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How does this convert weekly rent to an annual total?",
      a: "It uses annual equivalence: the weekly amount is translated into a daily rate (based on 7-day weeks) and then expressed as a yearly total using a 365-day year.",
    },
    {
      q: "Why is weekly rent × 52 not always the same as the annual result here?",
      a: "Weekly × 52 assumes exactly 52 weekly payments. Annual equivalence uses a 365-day year, which equals about 52.14 weeks. That difference can shift the estimated annual total slightly.",
    },
    {
      q: "What does the “52 payments” comparison represent?",
      a: "It illustrates a common billing interpretation: paying rent once per week for 52 payments. The side-by-side numbers help compare that payment-count view to a 365-day annual basis.",
    },
    {
      q: "How does weekly rent relate to 4-week (28-day) pricing?",
      a: "A 4-week period is 28 days, while a week is 7 days. Converting both to an annual basis helps compare a weekly price to 4-week pricing without treating 4 weeks as a calendar month.",
    },
    {
      q: "Does this match exact lease totals and due dates?",
      a: "It estimates an annual equivalent for comparison. Actual totals depend on identifying the real payment schedule in the lease, the start date, and any proration rules.",
    },
    {
      q: "What costs are included in the conversion?",
      a: "Only the rent amount entered. Utilities, parking, insurance, fees, and one-time charges are not included unless they are added into the amount before conversion.",
    },
    {
      q: "Can this help compare weekly listings to monthly listings?",
      a: "Yes. Converting weekly rent into an annual total and then a monthly equivalent helps compare listings that use different billing periods on a consistent basis.",
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
        name: "Weekly to Annual Rent Converter",
        item: "https://rentconverter.com/weekly-to-annual-rent",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Weekly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Weekly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert weekly rent into an annual total using annual equivalence as
          the source of truth. This helps compare weekly pricing to yearly and
          monthly figures using consistent time-period assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly vs Monthly
          </a>
          <a
            href="/monthly-to-annual-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Annual
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
              Instant weekly to annual conversion
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
                  placeholder="e.g. 550"
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
                Paste values like $550, 550.00, or 550 per week. Input is
                cleaned automatically.
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
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Annual equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(annualResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.weekly.toLowerCase()} ≈{" "}
                <strong>{money(annualResult, currency)}</strong>{" "}
                {PERIOD_LABEL.annual.toLowerCase()}
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
                  Weekly-to-year interpretation comparison (payment count vs
                  365-day basis)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      52 weekly payments
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(breakdown.annualIf52Payments, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Difference to 365-day basis:{" "}
                      <span className="font-semibold text-slate-800">
                        {money(breakdown.delta52, currency)}
                      </span>{" "}
                      ({(breakdown.pct52 * 100).toFixed(2)}%)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      53 weekly payments
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(breakdown.annualIf53Payments, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Difference to 365-day basis:{" "}
                      <span className="font-semibold text-slate-800">
                        {money(breakdown.delta53, currency)}
                      </span>{" "}
                      ({(breakdown.pct53 * 100).toFixed(2)}%)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      365-day annual equivalence
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annual * 100) / 100
                          : breakdown.annual,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Used across all periods on this page
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Weekly rent can be interpreted as a payment schedule (a set
                  number of weekly payments) or as a time-based rate. This page
                  converts through a 365-day year so the breakdown stays
                  consistent across daily, monthly, and 4-week equivalents.
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
                  A 4-week period is 28 days. A calendar month averages about
                  30.42 days (365 ÷ 12). Converting both through an annual total
                  keeps comparisons consistent.
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
          Weekly vs annual totals
        </h2>

        <p className="text-slate-700 mb-4">
          Weekly rent is often listed as a weekly price, while budgets and
          affordability discussions often reference yearly totals. Converting
          weekly rent to an annual amount helps compare listings that use
          different billing periods. This page uses annual equivalence (365-day
          year) so the results line up across the full breakdown.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why weekly to annual can produce multiple "reasonable" answers
        </h3>
        <p className="text-slate-700 mb-4">
          Two interpretations are common: one treats weekly rent as a payment
          schedule (for example, 52 weekly payments), and another treats it as a
          time-based rate that can be expressed over a 365-day year. The
          difference is small in many cases, but it can matter when comparing
          offers or building a consistent budget.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and what they imply
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Weekly payments: often framed as 52 payments, but a 365-day year is
            about 52.14 weeks.
          </li>
          <li>
            Biweekly payments: typically framed as 26 payments (every 14 days).
          </li>
          <li>
            Every 4 weeks: 13 periods per year because 365 days is more than 28
            × 13.
          </li>
          <li>
            Monthly: commonly framed as 12 payments, but month lengths vary, so
            an average month is used for time-based comparisons.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to weekly-to-annual conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Weekly × 52 is a payment-count shortcut, not a universal rule for
            yearly totals.
          </li>
          <li>
            A 4-week amount is not a monthly amount. They represent different
            period lengths.
          </li>
          <li>
            The yearly figure is an estimate for comparison. Lease start dates,
            proration, and included charges can change the real total.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="text-sky-700 hover:underline"
          >
            weekly vs monthly rent
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
