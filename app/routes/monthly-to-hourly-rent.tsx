import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/monthly-to-hourly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly to Hourly Rent Converter" },
  {
    name: "description",
    content:
      "Convert monthly rent to an hourly equivalent using annual equivalence (365-day year and average month length). Includes a full breakdown across periods and a month-length comparison to avoid fixed 30-day assumptions.",
  },
  {
    name: "keywords",
    content:
      "monthly to hourly rent, convert monthly rent to hourly, monthly rent to hourly calculator, rent per month to per hour, hourly equivalent of monthly rent, monthly rent hourly rate, month to hour rent converter",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Monthly to Hourly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert monthly rent to hourly using annual equivalence. Includes full breakdowns and a month-length comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/monthly-to-hourly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Monthly to Hourly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert monthly rent to hourly using annual equivalence. Includes full breakdowns and a month-length comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/monthly-to-hourly-rent",
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

export default function MonthlyToHourlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    const saved = localStorage.getItem("rc_mth_amount");
    return saved ?? "2000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_mth_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_mth_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_mth_amount", amount);
      localStorage.setItem("rc_mth_currency", currency);
      localStorage.setItem("rc_mth_rounding", JSON.stringify(includeRounding));
    } catch {}
  }, [amount, currency, includeRounding]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const rawHourly = useMemo(
    () => convert(parsed, "monthly", "hourly"),
    [parsed],
  );

  const hourlyResult = useMemo(() => {
    if (!includeRounding) return rawHourly;
    return Math.round(rawHourly * 100) / 100;
  }, [rawHourly, includeRounding]);

  const breakdown = useMemo(() => {
    const monthly = parsed;

    const hourly = convert(parsed, "monthly", "hourly");
    const daily = convert(parsed, "monthly", "daily");
    const weekly = convert(parsed, "monthly", "weekly");
    const biweekly = convert(parsed, "monthly", "biweekly");
    const every_4_weeks = convert(parsed, "monthly", "every_4_weeks");
    const annual = convert(parsed, "monthly", "annual");

    // Route-specific: "month length" misconception check (monthly -> hourly)
    // This page uses annual equivalence (365/12). A fixed 30-day month would yield a slightly different hourly.
    const hourly30Day = monthly / (30 * 24);
    const hourlyAvgMonth = monthly / ((365 / 12) * 24);
    const hourDelta = hourlyAvgMonth - hourly30Day;
    const hourDeltaPct = hourly30Day ? hourDelta / hourly30Day : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      hourly30Day,
      hourlyAvgMonth,
      hourDelta,
      hourDeltaPct,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed]);

  const faqData = [
    {
      q: "How does this convert monthly rent to an hourly equivalent?",
      a: "It uses annual equivalence. The monthly amount is first expressed on an annual basis using an average month length (365 ÷ 12 days), then converted to an hourly amount using 24 hours per day.",
    },
    {
      q: "Why is the converter not based on a 30-day month?",
      a: "A fixed 30-day month is a rough estimate. This tool uses an average month length so the hourly result stays consistent with annual, weekly, biweekly, and 4-week equivalents on the same basis.",
    },
    {
      q: "What does an hourly rent equivalent mean for a monthly lease?",
      a: "It is a comparison number. It illustrates what the monthly amount represents per hour when expressed through the same annual equivalence assumptions. Billing and due dates remain defined by the lease.",
    },
    {
      q: "Is the hourly number the same as a short-stay hourly charge?",
      a: "Not necessarily. Short stays often include minimum charges, fees, utilities, or different terms. This tool converts the rent amount only, using time-period equivalence.",
    },
    {
      q: "How does monthly compare to rent billed every 4 weeks (28 days)?",
      a: "A 4-week period is 28 days, while an average month is about 30.42 days (365 ÷ 12). These are different periods, so their annual totals and equivalents can differ even when the amounts look similar.",
    },
    {
      q: "Why can the hourly equivalent look small?",
      a: "Monthly rent is spread across many hours in an average month. The breakdown shows daily and weekly equivalents so the scaling from monthly to hourly is transparent.",
    },
    {
      q: "Does this match exact totals for partial months or specific due dates?",
      a: "It estimates equivalents for comparison. Actual totals for partial periods depend on lease terms, prorating rules, and due dates.",
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
        name: "Monthly to Hourly Rent Converter",
        item: "https://rentconverter.com/monthly-to-hourly-rent",
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
    name: "Monthly to Hourly Rent Converter",
    description:
      "Convert monthly rent to an hourly equivalent using annual equivalence (365-day year and average month length). Includes full breakdowns and a month-length comparison.",
    url: "https://rentconverter.com/monthly-to-hourly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Monthly to Hourly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Monthly to Hourly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a monthly rent amount into an hourly equivalent using annual
          equivalence as the source of truth. This helps compare monthly prices
          to time-based rates using consistent time-period assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/hourly-to-monthly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Hourly → Monthly
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
              Instant monthly to hourly conversion
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
                Paste values like $2,000 or 2000.00. Input is cleaned
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
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Hourly equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(hourlyResult, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.monthly.toLowerCase()} ≈{" "}
                <strong>{money(hourlyResult, currency)}</strong>{" "}
                {PERIOD_LABEL.hourly.toLowerCase()}
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
                          ? Math.round(breakdown.hourly30Day * 100) / 100
                          : breakdown.hourly30Day,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Computed as monthly ÷ (30 × 24)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Average-month equivalence
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.hourlyAvgMonth * 100) / 100
                          : breakdown.hourlyAvgMonth,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Uses (365 ÷ 12) days per month
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.hourDelta * 100) / 100
                          : breakdown.hourDelta,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.hourDeltaPct * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This page uses the average-month approach so monthly amounts
                  convert into hourly values that remain consistent with an
                  annual basis. A fixed 30-day month can shift the hourly
                  equivalent.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs 4-week context
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
                  days (365 ÷ 12). These are different periods, so
                  monthly-equivalent comparisons can differ.
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
          Monthly rent expressed as an hourly equivalent
        </h2>

        <p className="text-slate-700 mb-4">
          A monthly rent amount is commonly used for leases and long-term
          rentals, while hourly pricing can appear in short stays or flexible
          arrangements. Converting monthly to hourly can help compare monthly
          rent to time-based rates using a consistent annual basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why annual equivalence matters for monthly-to-hourly conversion
        </h3>
        <p className="text-slate-700 mb-4">
          This converter treats annual cost as the source of truth. The monthly
          amount is converted to an annual total (12 months on an average-month
          basis), then translated into an hourly value. This keeps the hourly
          equivalent aligned with other conversions on the site, including
          weekly, biweekly, and 4-week comparisons.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and what the hourly number does and does not mean
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Monthly rent typically reflects 12 payments per year, but the month
            length varies on the calendar. The converter uses an average month
            length to keep annual totals consistent.
          </li>
          <li>
            The hourly figure is a comparison number derived from the monthly
            amount. It does not change how rent is billed under a lease.
          </li>
          <li>
            If a real-world pricing model only charges for certain hours, that
            is a different billing structure than this equivalence.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to monthly-to-hourly conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Treating a month as exactly 30 days can shift the hourly equivalent,
            which is why this page shows a month-length comparison.
          </li>
          <li>
            A 4-week period (28 days) can look close to a month but represents a
            shorter time period, which can affect annual totals.
          </li>
          <li>
            Hourly equivalents can look low because monthly rent is spread
            across many hours, including overnight hours, when expressed as pure
            time.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a
            href="/hourly-to-monthly-rent"
            className="text-sky-700 hover:underline"
          >
            hourly to monthly rent
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
