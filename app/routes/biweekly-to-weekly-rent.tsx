import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/biweekly-to-weekly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Biweekly to Weekly Rent Converter" },
  {
    name: "description",
    content:
      "Convert biweekly rent to weekly rent using annual equivalence. Includes a full period breakdown (hourly, daily, weekly, monthly, annual) and a monthly vs 4-week comparison for consistent budgeting.",
  },
  {
    name: "keywords",
    content:
      "biweekly to weekly rent, convert biweekly rent to weekly, biweekly rent weekly equivalent, every 2 weeks to weekly rent, 14 day rent to weekly, biweekly rent calculator, rent converter biweekly to weekly",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Biweekly to Weekly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert biweekly rent to weekly rent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/biweekly-to-weekly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Biweekly to Weekly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert biweekly rent to weekly rent using annual equivalence. Includes a full breakdown and monthly vs 4-week context.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/biweekly-to-weekly-rent",
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

export default function BiweeklyToWeeklyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "900";
    const saved = localStorage.getItem("rc_btw_amount");
    return saved ?? "900";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_btw_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_btw_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_btw_amount", amount);
      localStorage.setItem("rc_btw_currency", currency);
      localStorage.setItem("rc_btw_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawWeekly = useMemo(
    () => convert(parsed, "biweekly", "weekly"),
    [parsed],
  );

  const weeklyResult = useMemo(() => {
    if (!includeRounding) return rawWeekly;
    return Math.round(rawWeekly * 100) / 100;
  }, [rawWeekly, includeRounding]);

  const breakdown = useMemo(() => {
    const biweekly = parsed;
    const weekly = convert(parsed, "biweekly", "weekly");
    const annual = convert(parsed, "biweekly", "annual");
    const monthly = convert(parsed, "biweekly", "monthly");
    const every_4_weeks = convert(parsed, "biweekly", "every_4_weeks");
    const daily = convert(parsed, "biweekly", "daily");
    const hourly = convert(parsed, "biweekly", "hourly");

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
      weeklyTimes2: weekly * 2,
      annualFromWeekly52: weekly * 52,
      annualFromBiweekly26: biweekly * 26,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How is biweekly rent converted to weekly rent on this page?",
      a: "The conversion uses annual equivalence. A biweekly amount is treated as a 14-day amount, converted through an annual basis, then expressed as a 7-day weekly equivalent for consistent comparisons.",
    },
    {
      q: "Is weekly always exactly half of biweekly rent?",
      a: "Under the time-period assumptions used here (biweekly = 14 days and weekly = 7 days), the weekly equivalent is half of the biweekly amount. Real billing calendars and due dates can still vary by agreement.",
    },
    {
      q: "Why show an annual equivalent when converting biweekly to weekly?",
      a: "Annual equivalence is used as the source of truth across the site. Converting through annual cost keeps the breakdown consistent when comparing weekly, monthly, 4-week, and other periods.",
    },
    {
      q: "How many payments are implied by weekly and biweekly billing?",
      a: "Weekly billing is often discussed as 52 payments per year and biweekly as 26 payments per year. This converter uses day-based equivalents (7-day weeks and a 365-day year) to keep conversions consistent across periods.",
    },
    {
      q: "Why does the monthly value differ from the 4-week value in the breakdown?",
      a: "A 4-week period is 28 days. An average month is about 30.42 days (365 ÷ 12). Because these are different lengths, the equivalent amounts can diverge when compared on an annual basis.",
    },
    {
      q: "Does this match exact lease totals if rent is due on specific dates?",
      a: "It estimates period equivalents for comparison. Exact totals depend on the payment schedule, start date, proration, fees, and what is included in the rent.",
    },
    {
      q: "Can this help compare rent listed per pay period?",
      a: "It can help illustrate how a biweekly amount translates into weekly and annual equivalents, which can make comparisons easier when listings use different billing periods.",
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
        name: "Biweekly to Weekly Rent Converter",
        item: "https://rentconverter.com/biweekly-to-weekly-rent",
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
    name: "Biweekly to Weekly Rent Converter",
    description:
      "Convert biweekly rent to weekly rent using annual equivalence. Includes a full period breakdown and monthly vs 4-week context.",
    url: "https://rentconverter.com/biweekly-to-weekly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Biweekly to Weekly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Biweekly to Weekly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a biweekly rent amount into a weekly equivalent using annual
          equivalence as the basis. This helps compare listings that quote rent
          every two weeks against rent quoted per week.
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
              Instant biweekly to weekly conversion
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Biweekly rent amount
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
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Quick check</div>
                <p className="mt-1 text-sm text-slate-700">
                  Under the day-based definitions used here, biweekly is 14 days
                  and weekly is 7 days, so the weekly equivalent is half of the
                  biweekly amount. The annual breakdown is shown so the same
                  annual basis is used across all periods.
                </p>
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
                {money(parsed, currency)} {PERIOD_LABEL.biweekly.toLowerCase()}{" "}
                ≈ <strong>{money(weeklyResult, currency)}</strong>{" "}
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
                  days (365 ÷ 12). These are different periods, so the
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
                  This section illustrates how calendar payment counts can
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
          Biweekly vs weekly: what the conversion represents
        </h2>

        <p className="text-slate-700 mb-4">
          Biweekly and weekly amounts often appear in listings that are tied to
          pay cycles. Converting biweekly to weekly can help compare options
          when one listing quotes rent every two weeks and another quotes rent
          per week.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why the weekly equivalent is half of the biweekly amount here
        </h3>
        <p className="text-slate-700 mb-4">
          This page defines biweekly as 14 days and weekly as 7 days. Under
          those definitions, a weekly equivalent is half of a biweekly amount.
          The converter still resolves through annual equivalence so the full
          breakdown stays consistent across weekly, monthly, and annual
          comparisons.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payment counts per year: calendar framing vs day-based equivalence
        </h3>
        <p className="text-slate-700 mb-4">
          Weekly rent is commonly discussed as 52 payments per year and biweekly
          as 26 payments per year. This calculator also provides a day-based
          annual equivalence using a 365-day year to keep all periods comparable
          within one consistent framework. Depending on the agreement, a real
          schedule may match one framing more closely than the other.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings for biweekly-to-weekly comparisons
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Treating a weekly equivalent as a promise of how rent is charged.
            The weekly number is an equivalence for comparison, not a billing
            rule.
          </li>
          <li>
            Mixing biweekly and 4-week terminology. Biweekly is 14 days, while a
            4-week cycle is 28 days. They imply different annual payment totals.
          </li>
          <li>
            Comparing monthly amounts against 4-week amounts as if they are the
            same period. An average month is longer than 28 days, so the
            equivalents can differ.
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
