import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/monthly-to-annual-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly to Annual Rent Converter" },
  {
    name: "description",
    content:
      "Convert monthly rent into an annual rent total using annual equivalence. See yearly totals, compare 12 monthly payments vs 13 four-week periods, and review a full breakdown across common billing periods.",
  },
  {
    name: "keywords",
    content:
      "monthly to annual rent converter, monthly rent to yearly total, convert rent monthly to annual, yearly rent from monthly, annual rent calculator, 12 payments vs 13 payments rent, 4 week rent vs monthly annual total",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Monthly to Annual Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert monthly rent to an annual total using annual equivalence (365-day year). Includes a 4-week (28-day) comparison and a full period breakdown.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/monthly-to-annual-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Monthly to Annual Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert monthly rent to an annual total using annual equivalence (365-day year). Compare monthly vs 4-week schedules and see a full breakdown.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/monthly-to-annual-rent",
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

export default function MonthlyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("rc_mta_amount");
    return saved ?? "2000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_mta_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_mta_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_mta_amount", amount);
      localStorage.setItem("rc_mta_currency", currency);
      localStorage.setItem("rc_mta_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawAnnual = useMemo(
    () => convert(parsed, "monthly", "annual"),
    [parsed],
  );

  const annualResult = useMemo(() => {
    if (!includeRounding) return rawAnnual;
    return Math.round(rawAnnual * 100) / 100;
  }, [rawAnnual, includeRounding]);

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

  const annualMonthlyDelta = useMemo(() => {
    const annualFromMonthly = breakdown.annualFromMonthly;
    const annualEquiv = breakdown.annual;
    return {
      diff: annualEquiv - annualFromMonthly,
      pct: annualFromMonthly
        ? (annualEquiv - annualFromMonthly) / annualFromMonthly
        : 0,
    };
  }, [breakdown.annual, breakdown.annualFromMonthly]);

  const faqData = [
    {
      q: "What is “annual rent” when a listing is priced monthly?",
      a: "It is the yearly total you would pay if that monthly price were applied consistently over a full year. This page estimates that yearly total so you can compare listings and payment schedules on the same timeline.",
    },
    {
      q: "How does this converter turn monthly rent into an annual total?",
      a: "It uses annual equivalence. A month is treated as an average month length (365 ÷ 12 days). That keeps conversions consistent when comparing monthly pricing to weekly, biweekly, or 4-week schedules.",
    },
    {
      q: "Is yearly rent always monthly rent × 12?",
      a: "For many quick comparisons, yes. This page also shows an annual-equivalence view and related period breakdowns so you can compare monthly pricing to other billing frequencies without mixing assumptions.",
    },
    {
      q: "Why does 4-week (28-day) billing change the annual total?",
      a: "Because 28-day periods fit into a year differently than calendar months. A 4-week schedule can effectively create 13 payment periods in a year, while monthly is typically 12 payments. The annual total can be higher even if each 4-week payment looks similar.",
    },
    {
      q: "Does this match my exact lease or due dates?",
      a: "No. It is for budgeting and comparison. Your actual total depends on the lease start date, billing rules, proration, and whether any weeks or days are handled as partial periods.",
    },
    {
      q: "What does the breakdown section help with?",
      a: "It shows the same rent expressed hourly, daily, weekly, biweekly, every 4 weeks, monthly, and annually. That makes it easier to compare ads that use different price formats and to sanity-check what a rate implies over a year.",
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
        name: "Monthly to Annual Rent Converter",
        item: "https://rentconverter.com/monthly-to-annual-rent",
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
    name: "Monthly to Annual Rent Converter",
    description:
      "Convert monthly rent into an annual rent total using annual equivalence. Includes a full period breakdown and a 4-week (28-day) comparison.",
    url: "https://rentconverter.com/monthly-to-annual-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Monthly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          See what a monthly rent price implies over a full year. This page
          estimates an annual total using annual equivalence so you can compare
          listings priced on different schedules.
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
              Convert monthly rent to a yearly total
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
                Works with inputs like $2,000, 2000.00, or 2000. The value is
                cleaned before conversion.
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
                {money(parsed, currency)} {PERIOD_LABEL.monthly.toLowerCase()}{" "}
                is approximately{" "}
                <strong>{money(annualResult, currency)}</strong>{" "}
                {PERIOD_LABEL.annual.toLowerCase()} using annual equivalence
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
                  Annual totals: “monthly × 12” vs annual equivalence
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Monthly × 12:{" "}
                    <strong className="text-slate-900">
                      {money(breakdown.annualFromMonthly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Weekly × 52:{" "}
                    <strong className="text-slate-900">
                      {money(breakdown.annualFromWeekly, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Annual equiv:{" "}
                    <strong className="text-slate-900">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annual * 100) / 100
                          : breakdown.annual,
                        currency,
                      )}
                    </strong>
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Annual equiv minus (monthly × 12):{" "}
                    <strong className="text-slate-900">
                      {money(annualMonthlyDelta.diff, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {(annualMonthlyDelta.pct * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  If your situation needs strict “12 monthly payments,” use the
                  monthly × 12 figure. If you are comparing to non-monthly
                  schedules, annual equivalence keeps the assumptions
                  consistent.
                </p>
              </div>

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
                  A month is longer than 28 days on average (365 ÷ 12). That is
                  why a 4-week schedule can feel similar per payment but differ
                  over a full year.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14 days,
            4-week rent = 28 days, month = 365 ÷ 12 days (average). Your lease
            rules can produce different totals.
          </p>
        </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Understanding the yearly total
        </h2>

        <p className="text-slate-700 mb-4">
          People usually think of yearly rent as “monthly rent × 12.” That is a
          useful shortcut, but it does not help when one listing is monthly, one
          is weekly, and another is every 4 weeks. This page uses annual
          equivalence so each period is converted through the same consistent
          assumptions.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Where annual differences come from
        </h3>
        <p className="text-slate-700 mb-4">
          Differences typically show up when payment schedules are not calendar
          monthly. A 4-week schedule is based on 28-day cycles, which can create
          an extra payment period in a year. Weekly pricing can also look lower
          but produce a higher annual total once you multiply across the year.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          How to use this page when comparing listings
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Compare annual totals first to see the real scale of the difference.
          </li>
          <li>
            Use the daily or weekly breakdown to understand what the price means
            in everyday terms.
          </li>
          <li>
            Treat results as estimates, then confirm exact billing rules in the
            lease.
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
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            payment schedules, proration, fees, and obligations vary by
            location, landlord, and lease terms. Review your rental agreement
            for the rules that apply to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            actual payment schedule, due dates, and proration rules in your
            lease.
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
