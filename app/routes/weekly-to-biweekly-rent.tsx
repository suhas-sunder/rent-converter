import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/weekly-to-biweekly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Biweekly Rent Converter" },
  {
    name: "description",
    content:
      "Convert weekly rent to biweekly rent using annual equivalence. Includes a full breakdown (hourly, daily, weekly, monthly, annual) and a monthly vs 4-week comparison for consistent budgeting.",
  },
  {
    name: "keywords",
    content:
      "weekly to biweekly rent, convert weekly rent to biweekly, weekly rent biweekly equivalent, weekly to every 2 weeks rent, 7 day rent to 14 day rent, weekly rent calculator, rent converter weekly to biweekly",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Weekly to Biweekly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert weekly rent to biweekly rent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/weekly-to-biweekly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Biweekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert weekly rent to biweekly rent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/weekly-to-biweekly-rent",
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

export default function WeeklyToBiweeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "450";
    const saved = localStorage.getItem("rc_wtbw_amount");
    return saved ?? "450";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_wtbw_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_wtbw_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtbw_amount", amount);
      localStorage.setItem("rc_wtbw_currency", currency);
      localStorage.setItem("rc_wtbw_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawBiweekly = useMemo(
    () => convert(parsed, "weekly", "biweekly"),
    [parsed],
  );

  const biweeklyResult = useMemo(() => {
    if (!includeRounding) return rawBiweekly;
    return Math.round(rawBiweekly * 100) / 100;
  }, [rawBiweekly, includeRounding]);

  const breakdown = useMemo(() => {
    const weekly = parsed;
    const biweekly = convert(parsed, "weekly", "biweekly");
    const annual = convert(parsed, "weekly", "annual");
    const monthly = convert(parsed, "weekly", "monthly");
    const every_4_weeks = convert(parsed, "weekly", "every_4_weeks");
    const daily = convert(parsed, "weekly", "daily");
    const hourly = convert(parsed, "weekly", "hourly");

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
      biweeklyDiv2: biweekly / 2,
      annualFromWeekly52: weekly * 52,
      annualFromBiweekly26: biweekly * 26,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How do you convert weekly rent to biweekly rent?",
      a: "This converter uses annual equivalence. Weekly rent is treated as a 7-day amount, converted through an annual basis, then expressed as a 14-day biweekly equivalent for consistent comparison.",
    },
    {
      q: "Is biweekly rent always exactly double weekly rent?",
      a: "Under the time-period assumptions used here (weekly = 7 days and biweekly = 14 days), the biweekly equivalent is double the weekly amount. Actual billing schedules can vary by agreement and due dates.",
    },
    {
      q: "Why use an annual basis if the conversion is weekly to biweekly?",
      a: "Annual equivalence is used as the source of truth across RentConverter.com. Converting through annual cost keeps the breakdown consistent across weekly, monthly, 4-week, and annual values.",
    },
    {
      q: "How many payments per year are implied by weekly and biweekly rent?",
      a: "Weekly is often discussed as 52 payments per year and biweekly as 26 payments per year. This page also shows a day-based annual equivalence (365-day year) so period comparisons remain consistent.",
    },
    {
      q: "Why does the monthly equivalent differ from the 4-week equivalent?",
      a: "A 4-week cycle is 28 days. An average month is about 30.42 days (365 ÷ 12). Because these periods are different lengths, the annual-equivalent amounts differ.",
    },
    {
      q: "Does this match exact lease totals when rent is due on specific dates?",
      a: "It estimates period equivalents for comparison. Exact totals depend on the payment schedule, start date, proration, fees, and what is included in rent.",
    },
    {
      q: "Can this help compare weekly listings to rent quoted per pay period?",
      a: "It illustrates how a weekly amount translates to biweekly and annual equivalents, which helps compare listings that use different rent periods.",
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
        name: "Weekly to Biweekly Rent Converter",
        item: "https://rentconverter.com/weekly-to-biweekly-rent",
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
    name: "Weekly to Biweekly Rent Converter",
    description:
      "Convert weekly rent to biweekly rent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
    url: "https://rentconverter.com/weekly-to-biweekly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Weekly to Biweekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Weekly to Biweekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a weekly rent amount into a biweekly equivalent using annual
          equivalence as the basis. This helps compare weekly listings with rent
          quoted every two weeks (often aligned to pay cycles).
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
              Instant weekly to biweekly conversion
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
                  placeholder="e.g. 450"
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
                Paste values like $450, 450, or 450.00. Input is cleaned
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
                    {PERIOD_LABEL.biweekly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Quick check</div>
                <p className="mt-1 text-sm text-slate-700">
                  Under the day-based definitions used here, weekly is 7 days
                  and biweekly is 14 days, so the biweekly equivalent is double
                  the weekly amount. The annual breakdown is shown so all
                  periods remain comparable.
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
                {money(parsed, currency)} {PERIOD_LABEL.weekly.toLowerCase()} ≈{" "}
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
                  Monthly vs 4-week context (same annual basis)
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
                  days (365 ÷ 12). These are different lengths, so the
                  equivalents can diverge.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Payment-count comparison (illustrative)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Weekly × 52</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualFromWeekly52 * 100) / 100
                          : breakdown.annualFromWeekly52,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Common calendar count (52 payments)
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
                      Common calendar count (26 payments)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual (day-based)
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
                      365-day annual equivalence
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  This illustrates how calendar payment counts (52 and 26) can
                  differ from day-based equivalence. Exact totals depend on the
                  agreement and due dates.
                </p>
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
          Weekly vs biweekly: what changes and what stays consistent
        </h2>

        <p className="text-slate-700 mb-4">
          Weekly and biweekly rent can both be used to describe the same housing
          cost, just expressed over different time windows. Converting weekly to
          biweekly can help compare rent listings and budgets when one amount is
          quoted per week and another is quoted every two weeks.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why weekly-to-biweekly is different from weekly-to-4-week
        </h3>
        <p className="text-slate-700 mb-4">
          Biweekly is a 14-day period. A 4-week period is 28 days. Because they
          are different lengths, they can imply different annual totals
          depending on how payments are scheduled. This page focuses on weekly
          to biweekly. The 4-week value is shown only as additional context in
          the full breakdown so the same annual basis is visible across periods.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why the annual basis is still shown
        </h3>
        <p className="text-slate-700 mb-4">
          Even when the conversion looks straightforward (weekly to biweekly),
          the annual breakdown helps keep comparisons consistent across monthly,
          4-week, and annual values. This matters when a budget mixes multiple
          rent expressions, or when a listing uses one period while a paycheck
          or affordability view uses another.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings when comparing weekly and biweekly rent
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Assuming a converted biweekly amount describes how a landlord bills
            rent. The output is an equivalence for comparison, not a billing
            commitment.
          </li>
          <li>
            Treating “biweekly” and “twice per month” as the same concept.
            Biweekly is tied to 14-day periods, while twice per month is a
            monthly schedule and can align differently across a year.
          </li>
          <li>
            Comparing monthly and 4-week amounts as if they represent the same
            time period. An average month is longer than 28 days, so the
            equivalents differ on an annual basis.
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
