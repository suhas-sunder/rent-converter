import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/monthly-to-biweekly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly to Biweekly Rent Converter" },
  {
    name: "description",
    content:
      "Convert monthly rent to biweekly rent using annual equivalence. Includes an always-visible breakdown (hourly, daily, weekly, 4-week, monthly, annual) and clear notes on biweekly vs twice-monthly timing.",
  },
  {
    name: "keywords",
    content:
      "monthly to biweekly rent, convert monthly rent to biweekly, monthly rent biweekly equivalent, biweekly rent from monthly, monthly to every 2 weeks rent, twice monthly vs biweekly rent, rent converter monthly to biweekly",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Monthly to Biweekly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert monthly rent to a biweekly equivalent using annual equivalence. Includes a full breakdown and a monthly vs 4-week comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/monthly-to-biweekly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Monthly to Biweekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert monthly rent to a biweekly equivalent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/monthly-to-biweekly-rent",
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

export default function MonthlyToBiweeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("rc_mtbw_amount");
    return saved ?? "2000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_mtbw_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_mtbw_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_mtbw_amount", amount);
      localStorage.setItem("rc_mtbw_currency", currency);
      localStorage.setItem("rc_mtbw_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawBiweekly = useMemo(
    () => convert(parsed, "monthly", "biweekly"),
    [parsed],
  );

  const biweeklyResult = useMemo(() => {
    if (!includeRounding) return rawBiweekly;
    return Math.round(rawBiweekly * 100) / 100;
  }, [rawBiweekly, includeRounding]);

  const breakdown = useMemo(() => {
    const monthly = parsed;

    const annual = convert(parsed, "monthly", "annual");
    const biweekly = convert(parsed, "monthly", "biweekly");
    const weekly = convert(parsed, "monthly", "weekly");
    const every_4_weeks = convert(parsed, "monthly", "every_4_weeks");
    const daily = convert(parsed, "monthly", "daily");
    const hourly = convert(parsed, "monthly", "hourly");

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,

      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,

      annualFromMonthly12: monthly * 12,
      annualFromBiweekly26: biweekly * 26,
      annualFrom4w13: every_4_weeks * 13,

      biweeklyTimes2: biweekly * 2,
      monthlyDiv2: monthly / 2,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How is monthly rent converted to biweekly rent?",
      a: "This converter uses annual equivalence. It converts a monthly amount to an annual equivalent using an average month length, then expresses that annual amount as a 14-day biweekly equivalent.",
    },
    {
      q: "Is biweekly the same as twice per month?",
      a: "No. Biweekly refers to a 14-day cycle. Twice per month is tied to calendar months. Over a year, biweekly schedules often imply a different number of payment cycles than monthly schedules.",
    },
    {
      q: "Why is the biweekly amount not exactly monthly rent ÷ 2?",
      a: "A calendar month is not 28 days and not a fixed number of weeks. This page uses an average month length (365 ÷ 12 days) to estimate a comparable biweekly value on the same annual basis.",
    },
    {
      q: "Why does the page show a 4-week (28-day) value on a monthly converter?",
      a: "Many rent comparisons mix monthly and 4-week amounts. A 4-week period is 28 days, while an average month is about 30.42 days. Showing both helps illustrate the annual-equivalent difference.",
    },
    {
      q: "How many payment cycles are implied by monthly and biweekly rent?",
      a: "Monthly is commonly described as 12 payments per year. Biweekly is often described as 26 payments per year. This tool also shows a day-based annual equivalence so periods remain comparable across the breakdown.",
    },
    {
      q: "Does this match a lease that bills on specific calendar dates?",
      a: "It estimates equivalents for budgeting and comparison. Exact totals depend on the lease terms, start date, prorations, fees, and what is included in rent.",
    },
    {
      q: "Can the results be used to compare listings across different rent periods?",
      a: "Yes. Converting everything to consistent equivalents can help compare a monthly quote to a biweekly or weekly quote without treating different time windows as the same.",
    },
    {
      q: "What month length does the converter assume?",
      a: "The converter uses an average month length of 365 ÷ 12 days. This helps keep conversions consistent across periods, even though actual months vary in length.",
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
        name: "Monthly to Biweekly Rent Converter",
        item: "https://rentconverter.com/monthly-to-biweekly-rent",
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
    name: "Monthly to Biweekly Rent Converter",
    description:
      "Convert monthly rent to biweekly rent using annual equivalence. Includes an always-visible breakdown and monthly vs 4-week context.",
    url: "https://rentconverter.com/monthly-to-biweekly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Monthly to Biweekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Biweekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a monthly rent amount into a biweekly equivalent using annual
          equivalence as the basis. This helps compare a monthly quote with rent
          expressed every two weeks, including pay-cycle style listings.
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
              Instant monthly to biweekly conversion
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
                Paste values like $2,000, 2000, or 2000.00. Input is cleaned
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
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.biweekly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Key distinction</div>
                <p className="mt-1 text-sm text-slate-700">
                  Biweekly means every 14 days. Twice per month is a monthly
                  schedule. This page converts a monthly amount to a biweekly
                  equivalent for comparison, using the same annual basis as the
                  full breakdown.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Biweekly equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(biweeklyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.monthly.toLowerCase()} ≈{" "}
                <strong>{money(biweeklyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.biweekly.toLowerCase()}
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
                  ["Monthly (average)", breakdown.monthly, "monthly"],
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
                  Monthly vs 4-week comparison
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
                  days (365 ÷ 12). Because the periods are different lengths,
                  the equivalents differ on an annual basis.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual payment-count context (illustrative)
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Monthly × 12</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualFromMonthly12 * 100) /
                              100
                          : breakdown.annualFromMonthly12,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Common schedule count (12 payments)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Biweekly × 26</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualFromBiweekly26 * 100) /
                              100
                          : breakdown.annualFromBiweekly26,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Common schedule count (26 payments)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">4-week × 13</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualFrom4w13 * 100) / 100
                          : breakdown.annualFrom4w13,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Calendar cycle count (13 payments)
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This illustrates how payment-count schedules (12, 26, 13)
                  relate to annual totals. The tool also uses day-based annual
                  equivalence (365-day year) across the breakdown so periods
                  remain comparable.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Why "divide by 2" can be misleading
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Monthly ÷ 2 produces a “half-month” number, but a month is not
                  a fixed number of weeks. This page shows both monthly ÷ 2 and
                  the biweekly equivalent so the difference is visible.
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Monthly ÷ 2</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.monthlyDiv2 * 100) / 100
                          : breakdown.monthlyDiv2,
                        currency,
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Biweekly equivalent
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.biweekly * 100) / 100
                          : breakdown.biweekly,
                        currency,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Actual due
            dates and billing terms vary by agreement.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Monthly to biweekly conversion: what it represents
        </h2>

        <p className="text-slate-700 mb-4">
          A monthly rent figure is usually tied to a calendar month in a lease,
          while a biweekly figure is tied to a 14-day cycle. Converting monthly
          to biweekly is a way to express the same overall cost in a different
          time unit so comparisons are easier.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why month length matters when converting to biweekly
        </h3>
        <p className="text-slate-700 mb-4">
          The main source of confusion is that a month does not map cleanly to a
          whole number of weeks. Some months have 28, 29, 30, or 31 days. This
          converter uses an average month length (365 ÷ 12 days) so the result
          aligns with the same annual basis used for all other periods in the
          breakdown.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Biweekly vs twice-monthly: a timing mismatch
        </h3>
        <p className="text-slate-700 mb-4">
          Biweekly is every 14 days, which often produces 26 cycles in a year.
          Twice-monthly is a monthly schedule that stays inside calendar months.
          These can be close in a short comparison window, but they can drift
          over longer periods because the cycles do not align the same way
          across a year.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          When this comparison is most useful
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            A listing is advertised monthly, but a budget or pay cycle tracks
            costs every two weeks.
          </li>
          <li>
            Two rental options use different rent periods and need a common
            comparison view.
          </li>
          <li>
            A rent quote is monthly, but a separate cost breakdown (utilities,
            parking, fees) is tracked biweekly.
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
