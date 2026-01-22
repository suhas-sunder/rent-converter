import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/annual-to-hourly-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Annual to Hourly Rent Converter" },
  {
    name: "description",
    content:
      "Convert an annual rent amount into an hourly equivalent using annual equivalence. Includes a full period breakdown and an optional paid-hours scenario to illustrate how assumed hours affect the implied hourly cost.",
  },
  {
    name: "keywords",
    content:
      "annual to hourly rent, yearly to hourly rent, convert annual rent to hourly, annual rent to hourly calculator, yearly rent hourly equivalent, annual rent per hour, annual cost to hourly rate",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Annual to Hourly Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert an annual rent amount into an hourly equivalent using annual equivalence. Includes a full breakdown and a paid-hours scenario.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/annual-to-hourly-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Annual to Hourly Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert an annual rent amount into an hourly equivalent using annual equivalence. Includes a full breakdown and a paid-hours scenario.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/annual-to-hourly-rent",
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

export default function AnnualToHourlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "30000";
    const saved = localStorage.getItem("rc_ath_amount");
    return saved ?? "30000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_ath_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_ath_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  // Optional scenario: spread the annual total over only a subset of hours (for comparison use cases).
  const [showPaidHoursScenario, setShowPaidHoursScenario] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      const saved = localStorage.getItem("rc_ath_paid_hours_show");
      if (saved !== null) return JSON.parse(saved);
      return false;
    },
  );

  const [paidHoursPerWeek, setPaidHoursPerWeek] = useState<string>(() => {
    if (typeof window === "undefined") return "40";
    const saved = localStorage.getItem("rc_ath_paid_hours_week");
    return saved ?? "40";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_ath_amount", amount);
      localStorage.setItem("rc_ath_currency", currency);
      localStorage.setItem("rc_ath_rounding", JSON.stringify(includeRounding));
      localStorage.setItem(
        "rc_ath_paid_hours_show",
        JSON.stringify(showPaidHoursScenario),
      );
      localStorage.setItem("rc_ath_paid_hours_week", paidHoursPerWeek);
    } catch {}
  }, [
    amount,
    currency,
    includeRounding,
    showPaidHoursScenario,
    paidHoursPerWeek,
  ]);

  const parsed = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 0;
    return clampNum(n, 0, 1_000_000_000);
  }, [amount]);

  const parsedPaidHours = useMemo(() => {
    const cleaned = paidHoursPerWeek
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) return 40;
    return clampNum(n, 0, 168);
  }, [paidHoursPerWeek]);

  const rawHourly = useMemo(
    () => convert(parsed, "annual", "hourly"),
    [parsed],
  );

  const hourlyResult = useMemo(() => {
    if (!includeRounding) return rawHourly;
    return Math.round(rawHourly * 100) / 100;
  }, [rawHourly, includeRounding]);

  const breakdown = useMemo(() => {
    const annual = parsed;
    const monthly = convert(parsed, "annual", "monthly");
    const every_4_weeks = convert(parsed, "annual", "every_4_weeks");
    const biweekly = convert(parsed, "annual", "biweekly");
    const weekly = convert(parsed, "annual", "weekly");
    const daily = convert(parsed, "annual", "daily");
    const hourly = convert(parsed, "annual", "hourly");

    // Scenario: allocate annual over paid hours only (hours/week * 52).
    const hoursPerYearPaid = parsedPaidHours * 52;
    const hourlyPaid = hoursPerYearPaid > 0 ? annual / hoursPerYearPaid : 0;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      hourlyPaid,
      hourlyPaidMinusClock: hourlyPaid - hourly,
      hourlyPaidMinusClockPct: hourly ? (hourlyPaid - hourly) / hourly : 0,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed, parsedPaidHours]);

  const faqData = [
    {
      q: "How does this convert annual rent to an hourly amount?",
      a: "It uses annual equivalence as the source of truth. The annual total is converted into a daily amount using a 365-day year, then converted into an hourly amount by dividing the daily equivalent across 24 hours.",
    },
    {
      q: "Is this the same as dividing annual rent by 8,760 hours?",
      a: "Yes for the time-based equivalence shown as the primary result. A 365-day year has 8,760 hours (365 × 24), so the hourly equivalent matches annual ÷ 8,760 under these assumptions.",
    },
    {
      q: "Why can an hourly equivalent feel surprisingly small?",
      a: "Annual totals are spread across every hour in the year. Because the denominator is large, the implied per-hour amount can be much lower than a rate that applies only to certain hours.",
    },
    {
      q: "What is the paid-hours scenario and when is it useful?",
      a: "Some comparisons allocate an annual total across a limited number of hours (for example, paid hours per week). The paid-hours scenario illustrates how the implied hourly amount changes when the annual cost is spread over fewer hours.",
    },
    {
      q: "Why are monthly and 4-week amounts shown on an annual-to-hourly page?",
      a: "Listings often mix billing cycles. Showing monthly and every-4-weeks equivalents alongside hourly helps compare the same annual total across common periods using one consistent basis.",
    },
    {
      q: "Does the hourly result match a real lease payment schedule?",
      a: "It estimates an equivalent for comparison. Real payment schedules depend on lease terms, due dates, proration rules, fees, and what is included in the rent.",
    },
    {
      q: "Does this use leap years?",
      a: "No. The calculator uses a 365-day year and an average month length of 365 ÷ 12 days to keep comparisons consistent.",
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
        name: "Annual to Hourly Rent Converter",
        item: "https://rentconverter.com/annual-to-hourly-rent",
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
    name: "Annual to Hourly Rent Converter",
    description:
      "Convert an annual rent amount into an hourly equivalent using annual equivalence. Includes a full period breakdown and an optional paid-hours scenario.",
    url: "https://rentconverter.com/annual-to-hourly-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pt-6 pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Annual to Hourly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Annual to Hourly Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert an annual rent amount into an hourly equivalent using annual
          equivalence as the source of truth. This helps compare yearly totals
          to pricing shown in shorter periods, including hourly, daily, weekly,
          and monthly amounts.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/hourly-to-annual-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Hourly → Annual
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
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant annual to hourly conversion
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Paid-hours scenario
                </span>
                <button
                  onClick={() => setShowPaidHoursScenario((v) => !v)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition cursor-pointer ${
                    showPaidHoursScenario ? "bg-sky-600" : "bg-slate-300"
                  }`}
                  aria-label="Toggle paid-hours scenario"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      showPaidHoursScenario ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
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
                  placeholder="e.g. 30000"
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
                Paste values like $30,000 or 30000.00. Input is cleaned
                automatically.
              </p>

              {showPaidHoursScenario && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Paid hours per week (scenario)
                  </label>
                  <input
                    inputMode="decimal"
                    value={paidHoursPerWeek}
                    onChange={(e) => setPaidHoursPerWeek(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    This scenario spreads the annual total across paid hours per
                    week × 52 weeks. It is shown to illustrate how assumed hours
                    change the implied hourly amount.
                  </p>
                </div>
              )}
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
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">What this means</div>
                <p className="mt-1 text-sm text-slate-700">
                  The primary result is a time-based hourly equivalent that
                  spreads the annual total across every hour in a 365-day year.
                  If the paid-hours scenario is enabled, it also shows an
                  alternative hourly equivalent for comparison.
                </p>
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
                {money(parsed, currency)} {PERIOD_LABEL.annual.toLowerCase()} ≈{" "}
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

              {showPaidHoursScenario && (
                <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">
                    Paid-hours hourly comparison
                  </div>

                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">
                        Time-based hourly
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {money(
                          includeRounding
                            ? Math.round(breakdown.hourly * 100) / 100
                            : breakdown.hourly,
                          currency,
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Annual ÷ (365 × 24)
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">
                        Paid-hours hourly
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {money(
                          includeRounding
                            ? Math.round(breakdown.hourlyPaid * 100) / 100
                            : breakdown.hourlyPaid,
                          currency,
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Annual ÷ (hours per week × 52)
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">Difference</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {money(
                          includeRounding
                            ? Math.round(breakdown.hourlyPaidMinusClock * 100) /
                                100
                            : breakdown.hourlyPaidMinusClock,
                          currency,
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        ≈ {(breakdown.hourlyPaidMinusClockPct * 100).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    This scenario does not replace the main conversion. It
                    illustrates how an annual total looks when spread across
                    fewer hours.
                  </p>
                </div>
              )}

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
                  equivalents can diverge on an annual basis.
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
          How annual-to-hourly conversion works
        </h2>

        <p className="text-slate-700 mb-4">
          Annual pricing is common for total-cost summaries, while hourly
          pricing can appear in flexible arrangements or short-term contexts.
          Converting an annual amount into an hourly equivalent can help compare
          the same cost across a range of billing periods.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why the conversion spreads the annual total across all hours
        </h3>
        <p className="text-slate-700 mb-4">
          The primary hourly result is time-based annual equivalence. The annual
          total is first converted into a daily equivalent using a 365-day year.
          That daily amount is then divided across 24 hours. This produces an
          hourly equivalent that aligns with the same annual basis used for the
          weekly, monthly, and 4-week breakdowns.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Hours in a year and why the interpretation matters
        </h3>
        <p className="text-slate-700 mb-4">
          A 365-day year contains 8,760 hours. Spreading an annual total across
          8,760 hours produces an implied hourly amount that can look small.
          That does not imply an agreement bills hourly. It is an equivalence
          that helps comparisons across periods.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to annual-to-hourly conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Treating the hourly equivalent as a real billing rate. The hourly
            number is an annual equivalence, not a promise of how charges are
            applied.
          </li>
          <li>
            Assuming hourly must be based on a workweek. Some comparisons use
            paid-hours scenarios, but the main conversion spreads cost across
            all hours to keep the annual basis consistent.
          </li>
          <li>
            Treating 4-week and monthly periods as interchangeable. A 4-week
            period is 28 days, while an average month is about 30.42 days (365 ÷
            12).
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href="/hourly-to-annual-rent"
            className="text-sky-700 hover:underline"
          >
            hourly to annual rent
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
