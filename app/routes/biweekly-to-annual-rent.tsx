import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/biweekly-to-annual-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Biweekly to Annual Rent Converter" },
  {
    name: "description",
    content:
      "Convert biweekly rent (every 2 weeks) to an annual equivalent using a 365-day year. Includes an always-visible breakdown (hourly, daily, weekly, biweekly, 4-week, monthly, annual) plus payment-count context.",
  },
  {
    name: "keywords",
    content:
      "biweekly to annual rent, biweekly rent to yearly, every 2 weeks to annual rent, convert biweekly rent to annual, biweekly rent yearly equivalent, biweekly rent calculator annual",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Biweekly to Annual Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert a biweekly rent amount to an annual equivalent using a 365-day year. Includes a full breakdown and payment-count context.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/biweekly-to-annual-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Biweekly to Annual Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert biweekly rent (every 2 weeks) to an annual equivalent using a 365-day year. Includes an always-visible breakdown.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/biweekly-to-annual-rent",
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

export default function BiweeklyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "900";
    const saved = localStorage.getItem("rc_b2a_amount");
    return saved ?? "900";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_b2a_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_b2a_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_b2a_amount", amount);
      localStorage.setItem("rc_b2a_currency", currency);
      localStorage.setItem("rc_b2a_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawAnnual = useMemo(
    () => convert(parsed, "biweekly", "annual"),
    [parsed],
  );

  const annualResult = useMemo(() => {
    if (!includeRounding) return rawAnnual;
    return Math.round(rawAnnual * 100) / 100;
  }, [rawAnnual, includeRounding]);

  const breakdown = useMemo(() => {
    const biweekly = parsed;

    const annual = convert(parsed, "biweekly", "annual");
    const monthly = convert(parsed, "biweekly", "monthly");
    const every_4_weeks = convert(parsed, "biweekly", "every_4_weeks");
    const weekly = convert(parsed, "biweekly", "weekly");
    const daily = convert(parsed, "biweekly", "daily");
    const hourly = convert(parsed, "biweekly", "hourly");

    // Payment-count context (illustrative comparisons)
    const annualVia26 = biweekly * 26; // common shorthand
    const annualVia365Day = annual; // this tool's 365-day assumption (biweekly/14*365)
    const countBiweeks365 = 365 / 14;

    const annualDiff = annualVia365Day - annualVia26;
    const annualDiffPct = annualVia26 ? annualDiff / annualVia26 : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,

      annualVia26,
      annualVia365Day,
      countBiweeks365,
      annualDiff,
      annualDiffPct,

      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How does this convert biweekly rent to annual rent?",
      a: "The biweekly amount is converted to a daily equivalent, then multiplied by 365 days to produce an annual equivalent. This keeps all period conversions consistent through the same annual basis.",
    },
    {
      q: "Why is the annual result not always exactly biweekly × 26?",
      a: "Biweekly means every 14 days. A 365-day year contains about 26.07 biweekly periods (365 ÷ 14). Some leases or budgets use 26 payments as a simple schedule count, while a day-based annual equivalence can differ slightly.",
    },
    {
      q: "Is biweekly the same as twice per month?",
      a: "No. Twice per month is a calendar schedule (24 payments per year). Biweekly is a 14-day schedule, which is commonly described as about 26 payment cycles per year. The annual totals can differ because the schedules are different.",
    },
    {
      q: "Why does the page show monthly and 4-week amounts too?",
      a: "Monthly and every-4-weeks (28 days) are often mixed in listings even though they are different lengths. Showing both helps illustrate how a biweekly amount relates to common alternatives on the same annual basis.",
    },
    {
      q: "What does the payment-count comparison mean?",
      a: "It shows how different counting shortcuts relate to annual totals, for example biweekly × 26 versus a 365-day annual equivalence. Actual billing schedules can include prorations, partial periods, or specific due-date rules.",
    },
    {
      q: "What assumptions are used for the conversion?",
      a: "This tool uses a 365-day year, weeks as 7 days, biweekly as 14 days, 4-week rent as 28 days, and an average month length of 365 ÷ 12 days.",
    },
    {
      q: "Does this match my exact lease payments?",
      a: "It provides an estimate for budgeting and comparison. The exact amount due can vary based on lease terms, start dates, due dates, prorations, fees, and what is included in rent.",
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
        name: "Biweekly to Annual Rent Converter",
        item: "https://rentconverter.com/biweekly-to-annual-rent",
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
          / Biweekly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Biweekly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a biweekly rent amount (every 2 weeks) into an annual
          equivalent using annual equivalence as the basis. Results update
          instantly and include a full period breakdown.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/rent-paid-every-4-weeks"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent paid every 4 weeks
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
              Instant biweekly to annual conversion
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Biweekly rent amount (every 2 weeks)
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 900"
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
                Paste values like $900, 900, or 900.00. Input is cleaned
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
                    {PERIOD_LABEL.biweekly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">
                  What this represents
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  This expresses the same biweekly amount as an annual
                  equivalent using a 365-day year. It helps compare biweekly
                  quotes against monthly or annual listings.
                </p>
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
                {money(parsed, currency)} {PERIOD_LABEL.biweekly.toLowerCase()}{" "}
                ≈ <strong>{money(annualResult, currency)}</strong>{" "}
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
                  Payment-count context (biweekly to annual)
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Biweekly × 26 (common shortcut)
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualVia26 * 100) / 100
                          : breakdown.annualVia26,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      26 cycles is often used as a schedule count
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      365-day annual equivalence (this tool)
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualVia365Day * 100) / 100
                          : breakdown.annualVia365Day,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Uses 365 ÷ 14 ≈ {breakdown.countBiweeks365.toFixed(2)}{" "}
                      biweekly periods
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Difference (365-day minus 26x)
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualDiff * 100) / 100
                          : breakdown.annualDiff,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.annualDiffPct * 100).toFixed(2)}% of the 26x
                      shortcut
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This comparison is illustrative. Leases may define how many
                  payments occur in a year, whether partial periods are
                  prorated, and whether due dates follow calendar months.
                </p>
              </div>

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
          Why biweekly rent and annual rent can be quoted in different ways
        </h2>

        <p className="text-slate-700 mb-4">
          Biweekly rent is a time-based schedule: every 14 days. Annual rent is
          a yearly total. Converting through a daily equivalent keeps the
          comparison consistent across periods, especially when monthly and
          4-week schedules are also part of the decision.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Biweekly is not the same as twice per month
        </h3>
        <p className="text-slate-700 mb-4">
          Twice per month is a calendar schedule (24 payments per year).
          Biweekly is a 14-day schedule, often described as about 26 cycles per
          year. When comparing listings, it can help to convert to an annual
          equivalent so different schedules can be evaluated on the same basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why “biweekly × 26” may not match a day-based annual equivalence
        </h3>
        <p className="text-slate-700 mb-4">
          A 365-day year contains about 26.07 biweekly periods (365 ÷ 14). A
          26-payment count is often used as a simple schedule shortcut, while a
          day-based annual equivalence reflects the full year length. Lease
          terms can specify how billing is handled when dates do not line up
          perfectly.
        </p>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
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
