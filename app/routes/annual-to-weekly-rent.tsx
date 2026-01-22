import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/annual-to-weekly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Annual to Weekly Rent Converter" },
  {
    name: "description",
    content:
      "Convert annual rent to a weekly equivalent using annual equivalence (365-day year). Includes a full breakdown across periods, a 52-weeks comparison, and FAQs focused on annual vs weekly interpretation.",
  },
  {
    name: "keywords",
    content:
      "annual to weekly rent, yearly to weekly rent, convert annual rent to weekly, annual rent weekly equivalent, yearly rent per week, annual to weekly rent calculator, weekly equivalent of annual rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Annual to Weekly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert annual rent to weekly using annual equivalence. Includes a full period breakdown and a 52-weeks comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/annual-to-weekly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Annual to Weekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert annual rent to weekly using annual equivalence. Includes a full breakdown and 52-weeks comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/annual-to-weekly-rent",
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

export default function AnnualToWeeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "26000";
    const saved = localStorage.getItem("rc_atw_amount");
    return saved ?? "26000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_atw_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_atw_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_atw_amount", amount);
      localStorage.setItem("rc_atw_currency", currency);
      localStorage.setItem("rc_atw_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawWeekly = useMemo(
    () => convert(parsed, "annual", "weekly"),
    [parsed],
  );

  const weeklyResult = useMemo(() => {
    if (!includeRounding) return rawWeekly;
    return Math.round(rawWeekly * 100) / 100;
  }, [rawWeekly, includeRounding]);

  const breakdown = useMemo(() => {
    const annual = parsed;

    const weekly = convert(parsed, "annual", "weekly");
    const biweekly = convert(parsed, "annual", "biweekly");
    const every_4_weeks = convert(parsed, "annual", "every_4_weeks");
    const monthly = convert(parsed, "annual", "monthly");
    const daily = convert(parsed, "annual", "daily");
    const hourly = convert(parsed, "annual", "hourly");

    const weeklyFrom52WeeksShortcut = annual / 52;
    const weeklyFrom365DayEquivalence = weekly;

    const delta52 = weeklyFrom365DayEquivalence - weeklyFrom52WeeksShortcut;
    const pct52 = weeklyFrom52WeeksShortcut
      ? delta52 / weeklyFrom52WeeksShortcut
      : 0;

    const annualFromWeeklyPaySchedule = weeklyFrom52WeeksShortcut * 52;
    const annualFromEquivalence = weeklyFrom365DayEquivalence * (365 / 7);

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      weeklyFrom52WeeksShortcut,
      weeklyFrom365DayEquivalence,
      delta52,
      pct52,
      annualFromWeeklyPaySchedule,
      annualFromEquivalence,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How does this convert annual rent to weekly rent?",
      a: "It uses annual equivalence. The annual amount is translated into a daily rate using a 365-day year, then expressed as a weekly equivalent using 7-day weeks.",
    },
    {
      q: "Why is annual ÷ 52 not always identical to the weekly result here?",
      a: "Annual ÷ 52 treats the year as exactly 52 weeks. A 365-day year is about 52.14 weeks, so a time-based weekly equivalent can differ slightly from a 52-weeks shortcut.",
    },
    {
      q: "Which weekly number is better for comparisons: 52-weeks shortcut or 365-day equivalence?",
      a: "They answer slightly different interpretations. A 52-weeks shortcut mirrors a 52-payment framing, while annual equivalence produces a time-based weekly rate that stays consistent with daily, monthly, and 4-week conversions.",
    },
    {
      q: "Does this match the exact weekly payment written in a lease?",
      a: "It estimates a weekly equivalent for comparison. A lease may define payments by exact due dates, proration rules, or an explicit number of payments within a lease term.",
    },
    {
      q: "How does this relate to 4-week (28-day) rent amounts?",
      a: "A 4-week period is 28 days, while a week is 7 days. Converting both through an annual total helps compare weekly rates to 4-week pricing without treating 4 weeks as a calendar month.",
    },
    {
      q: "Does this include utilities, fees, or deposits?",
      a: "No. It converts the rent amount entered. If other costs are included in the annual figure, they will be included in the converted weekly equivalent as well.",
    },
    {
      q: "Can this help compare annual rent offers to weekly listings?",
      a: "Yes. Converting an annual amount into weekly, monthly, and 4-week equivalents helps compare listings that use different billing periods using the same annual basis.",
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
        name: "Annual to Weekly Rent Converter",
        item: "https://rentconverter.com/annual-to-weekly-rent",
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
          / Annual to Weekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Annual to Weekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert an annual rent amount into a weekly equivalent using annual
          equivalence as the source of truth. This helps compare yearly totals
          to weekly listings using consistent time-period assumptions.
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
            href="/weekly-to-annual-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Weekly → Annual
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
              Instant annual to weekly conversion
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Annual rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 26000"
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
                Paste values like $26,000 or 26000.00. Input is cleaned
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
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Weekly equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(weeklyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.annual.toLowerCase()} ≈{" "}
                <strong>{money(weeklyResult, currency)}</strong>{" "}
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
                  Annual-to-week interpretation comparison (365-day basis vs
                  52-week shortcut)
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      52-week shortcut
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(breakdown.weeklyFrom52WeeksShortcut, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Computed as annual ÷ 52
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      365-day annual equivalence
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(
                              breakdown.weeklyFrom365DayEquivalence * 100,
                            ) / 100
                          : breakdown.weeklyFrom365DayEquivalence,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Computed through daily rate then weekly
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(breakdown.delta52, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.pct52 * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  The 52-week shortcut matches a simple “year divided into 52
                  weekly chunks” view. Annual equivalence uses a 365-day year so
                  weekly, daily, monthly, and 4-week conversions remain
                  consistent with each other.
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
                  30.42 days (365 ÷ 12). Converting both through an annual
                  amount helps compare periods without treating 4 weeks as a
                  month.
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
          Annual totals expressed as weekly rent
        </h2>

        <p className="text-slate-700 mb-4">
          Annual rent figures are common in budgeting, summaries, and
          comparisons, while listings and discussions in some markets use weekly
          pricing. Converting an annual amount into a weekly equivalent helps
          compare an annual total to weekly listings using the same basis. This
          page uses annual equivalence (365-day year) so the weekly result is
          consistent with the full breakdown.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why annual-to-weekly is not always identical to “annual ÷ 52”
        </h3>
        <p className="text-slate-700 mb-4">
          Dividing by 52 treats the year as exactly 52 weeks. A 365-day year
          equals about 52.14 weeks. When an annual amount is converted through a
          daily rate and then into weekly, the weekly equivalent can differ
          slightly from the 52-week shortcut. The comparison section above shows
          both numbers so the difference is visible.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and what weekly equivalents represent
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            A weekly equivalent can represent a time-based rate (annual
            equivalence) rather than a literal number of weekly payments.
          </li>
          <li>
            Lease schedules can include proration or non-standard start dates
            that change real totals for partial years.
          </li>
          <li>
            Converting to monthly or 4-week periods through the same annual
            basis avoids mixing calendar months with 28-day periods.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to annual-to-weekly conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            A weekly equivalent is an estimate used for comparison, not a claim
            about how a particular lease collects payments.
          </li>
          <li>
            4-week pricing is a 28-day period and does not represent a calendar
            month.
          </li>
          <li>
            The converted weekly number reflects only the entered annual amount.
            Other costs are not added automatically.
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
