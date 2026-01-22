import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/hourly-to-annual-rent";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Hourly to Annual Rent Converter" },
  {
    name: "description",
    content:
      "Convert an hourly rent or rate into an annual rent equivalent using annual equivalence. Includes a full breakdown across time periods and a paid-hours comparison to illustrate how assumed hours affect annual totals.",
  },
  {
    name: "keywords",
    content:
      "hourly to annual rent, convert hourly rent to yearly, hourly rate to annual rent, hourly rent to annual calculator, hourly to yearly rent converter, annual rent equivalent from hourly, hourly rent annualized",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Hourly to Annual Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert an hourly amount to an annual rent equivalent using annual equivalence. Includes full breakdowns and a paid-hours comparison.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/hourly-to-annual-rent",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Hourly to Annual Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert an hourly amount to an annual rent equivalent using annual equivalence. Includes full breakdowns and a paid-hours comparison.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/hourly-to-annual-rent",
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

export default function HourlyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    const saved = localStorage.getItem("rc_hta_amount");
    return saved ?? "25";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = localStorage.getItem("rc_hta_currency");
    return saved ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rc_hta_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  // Route-specific input: whether hourly rate is treated as "per clock hour" (24/7) or "paid hours" only
  // Default is 24/7 equivalence so the annual result is purely time-based and consistent with other periods.
  const [hourMode, setHourMode] = useState<"clock" | "paid">(() => {
    if (typeof window === "undefined") return "clock";
    const saved = localStorage.getItem("rc_hta_hour_mode");
    return saved === "paid" || saved === "clock" ? saved : "clock";
  });

  const [paidHoursPerWeek, setPaidHoursPerWeek] = useState<string>(() => {
    if (typeof window === "undefined") return "40";
    const saved = localStorage.getItem("rc_hta_paid_hours_week");
    return saved ?? "40";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_hta_amount", amount);
      localStorage.setItem("rc_hta_currency", currency);
      localStorage.setItem("rc_hta_rounding", JSON.stringify(includeRounding));
      localStorage.setItem("rc_hta_hour_mode", hourMode);
      localStorage.setItem("rc_hta_paid_hours_week", paidHoursPerWeek);
    } catch {}
  }, [amount, currency, includeRounding, hourMode, paidHoursPerWeek]);

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
    return clampNum(n, 0, 168); // 7 * 24
  }, [paidHoursPerWeek]);

  const rawAnnual = useMemo(
    () => convert(parsed, "hourly", "annual"),
    [parsed],
  );

  const annualResult = useMemo(() => {
    if (!includeRounding) return rawAnnual;
    return Math.round(rawAnnual * 100) / 100;
  }, [rawAnnual, includeRounding]);

  const breakdown = useMemo(() => {
    const hourly = parsed;

    const daily = convert(parsed, "hourly", "daily");
    const weekly = convert(parsed, "hourly", "weekly");
    const biweekly = convert(parsed, "hourly", "biweekly");
    const every_4_weeks = convert(parsed, "hourly", "every_4_weeks");
    const monthly = convert(parsed, "hourly", "monthly");
    const annual = convert(parsed, "hourly", "annual");

    // Route-specific comparison: if hourly is interpreted as paid hours only, annual depends on assumed paid hours.
    // This is not a different conversion basis, it is a scenario illustration.
    const annualClock = annual; // 24/7 equivalence
    const annualPaid = hourly * parsedPaidHours * 52; // hours/week * weeks/year
    const annualPaidMinusClock = annualPaid - annualClock;
    const annualPaidMinusClockPct = annualClock
      ? annualPaidMinusClock / annualClock
      : 0;

    // Helpful context: monthly equivalents under each scenario
    const monthlyClock = annualClock / 12;
    const monthlyPaid = annualPaid / 12;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every_4_weeks,
      monthly,
      annual,
      annualClock,
      annualPaid,
      annualPaidMinusClock,
      annualPaidMinusClockPct,
      monthlyClock,
      monthlyPaid,
      monthlyMinus4w: monthly - every_4_weeks,
      monthlyMinus4wPct: every_4_weeks
        ? (monthly - every_4_weeks) / every_4_weeks
        : 0,
    };
  }, [parsed, parsedPaidHours]);

  const displayedAnnual = useMemo(() => {
    if (hourMode === "clock") return breakdown.annualClock;
    return breakdown.annualPaid;
  }, [hourMode, breakdown.annualClock, breakdown.annualPaid]);

  const displayedAnnualRounded = useMemo(() => {
    if (!includeRounding) return displayedAnnual;
    return Math.round(displayedAnnual * 100) / 100;
  }, [displayedAnnual, includeRounding]);

  const displayedMonthly = useMemo(() => {
    if (hourMode === "clock") return breakdown.monthlyClock;
    return breakdown.monthlyPaid;
  }, [hourMode, breakdown.monthlyClock, breakdown.monthlyPaid]);

  const displayedMonthlyRounded = useMemo(() => {
    if (!includeRounding) return displayedMonthly;
    return Math.round(displayedMonthly * 100) / 100;
  }, [displayedMonthly, includeRounding]);

  const faqData = [
    {
      q: "How does this convert an hourly amount to annual rent?",
      a: "The conversion uses annual equivalence. An hourly amount is expressed as a daily amount (24 hours), then scaled to an annual total using a 365-day year so comparisons stay consistent across periods.",
    },
    {
      q: "Why does hourly-to-annual depend on assumptions about hours?",
      a: "There are two common interpretations: a pure time-based equivalence (24 hours per day) and a paid-hours interpretation (only certain hours count). This page shows both to illustrate how the interpretation changes annual totals.",
    },
    {
      q: "What is the difference between 24/7 equivalence and paid-hours mode?",
      a: "24/7 equivalence treats the amount as per clock hour across all hours in a year. Paid-hours mode treats the amount as applying to a chosen number of hours per week and annualizes using weeks per year. Both are comparison tools; real billing terms can differ.",
    },
    {
      q: "Does this represent what a landlord will actually charge in a year?",
      a: "It estimates an annual equivalent for comparison. Actual charges can depend on minimum stays, prorating rules, included utilities, fees, and the specific agreement.",
    },
    {
      q: "Why is there a monthly and 4-week amount on a page about annual conversion?",
      a: "Many listings mix periods. Showing monthly and every-4-weeks equivalents alongside annual totals helps compare the same value across common billing cycles using one annual basis.",
    },
    {
      q: "What does an annual equivalent help with in practice?",
      a: "It helps compare options that quote prices in different ways. Converting everything through annual totals can make differences visible when periods do not align cleanly.",
    },
    {
      q: "Does this use leap years or a 365-day year?",
      a: "It uses a 365-day year, 7-day weeks, and an average month length of 365 ÷ 12 days. This keeps the math consistent for budgeting comparisons.",
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
        name: "Hourly to Annual Rent Converter",
        item: "https://rentconverter.com/hourly-to-annual-rent",
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
    name: "Hourly to Annual Rent Converter",
    description:
      "Convert an hourly rent or rate into an annual rent equivalent using annual equivalence. Includes a full breakdown across periods and a paid-hours comparison.",
    url: "https://rentconverter.com/hourly-to-annual-rent",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className=" pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Hourly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Hourly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert an hourly amount into an annual rent equivalent using annual
          equivalence as the source of truth. This helps compare hourly quotes
          to weekly, monthly, and annual pricing using consistent time-period
          assumptions.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/monthly-to-hourly-rent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Monthly → Hourly
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
              Instant hourly to annual conversion
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Hour interpretation
                </span>
                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setHourMode("clock")}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                      hourMode === "clock"
                        ? "bg-sky-600 text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    aria-label="Use 24/7 clock-hour equivalence"
                  >
                    24/7 hours
                  </button>
                  <button
                    onClick={() => setHourMode("paid")}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                      hourMode === "paid"
                        ? "bg-sky-600 text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    aria-label="Use paid-hours per week scenario"
                  >
                    Paid hours
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hourly amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 25"
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
                Paste values like $25 or 25.00. Input is cleaned automatically.
              </p>

              {hourMode === "paid" && (
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
                    Used only for the paid-hours scenario. 168 hours per week is
                    the maximum for a full 24/7 week.
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
                    {PERIOD_LABEL.hourly}
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
                <div className="text-xs text-slate-500">Mode summary</div>
                {hourMode === "clock" ? (
                  <p className="mt-1 text-sm text-slate-700">
                    24/7 hours treats the amount as applying to every hour in
                    the year (time-based equivalence).
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-700">
                    Paid hours annualizes using paid hours per week × 52 weeks,
                    which illustrates how assumed hours affect annual totals.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">Annual equivalent</div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(displayedAnnualRounded, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(parsed, currency)} {PERIOD_LABEL.hourly.toLowerCase()} ≈{" "}
                <strong>{money(displayedAnnualRounded, currency)}</strong>{" "}
                {PERIOD_LABEL.annual.toLowerCase()}
              </div>
              <div className="text-sm text-slate-600">
                Implied monthly equivalent:{" "}
                <strong>{money(displayedMonthlyRounded, currency)}</strong>{" "}
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
                  ["Monthly (average)", breakdown.monthly, "monthly"],
                  [
                    "Annual (24/7 equivalence)",
                    breakdown.annualClock,
                    "annual",
                  ],
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
                  Paid-hours scenario comparison (annual totals)
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      24/7 equivalence
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualClock * 100) / 100
                          : breakdown.annualClock,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Uses 365 days × 24 hours
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Paid hours annualized
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualPaid * 100) / 100
                          : breakdown.annualPaid,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Hours per week × 52
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Difference</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {money(
                        includeRounding
                          ? Math.round(breakdown.annualPaidMinusClock * 100) /
                              100
                          : breakdown.annualPaidMinusClock,
                        currency,
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ≈ {(breakdown.annualPaidMinusClockPct * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This comparison is included because hourly quotes can be used
                  in different contexts. The main conversion on this page is
                  time-based annual equivalence. Paid-hours mode illustrates how
                  annual totals change when the hourly amount applies only to a
                  limited set of hours.
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
                  days (365 ÷ 12). These are different periods, so their
                  equivalents can diverge when expressed on an annual basis.
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
          How hourly-to-annual conversion works in rent comparisons
        </h2>

        <p className="text-slate-700 mb-4">
          Hourly pricing can appear in flexible arrangements, short stays, or
          situations where a time-based rate is quoted. Annual conversion can
          help compare an hourly amount to rent expressed weekly, monthly, or
          per year by translating everything to an annual total on the same
          basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why the conversion resolves through annual cost
        </h3>
        <p className="text-slate-700 mb-4">
          This converter uses annual equivalence as the source of truth. An
          hourly value is converted into a daily amount using 24 hours per day,
          then extended to an annual total using a 365-day year. Once the annual
          amount is established, the other breakdown periods (weekly, monthly,
          every 4 weeks) remain consistent because they are derived from the
          same annual basis.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and why hourly can be ambiguous
        </h3>
        <p className="text-slate-700 mb-4">
          Weekly, monthly, and biweekly rent typically imply a payment schedule.
          Hourly does not always imply how many hours apply. A clock-hour view
          treats all hours equally, while many real-world hourly quotes apply to
          a smaller set of hours. This page includes a paid-hours comparison to
          illustrate how annual totals change when the number of applicable
          hours changes.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to hourly-to-annual conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Assuming an hourly quote automatically implies 40 hours per week.
            That may be true in some contexts, but not in others, so the page
            separates time-based equivalence from a paid-hours scenario.
          </li>
          <li>
            Treating a 4-week period as a month. A 4-week period is 28 days,
            while an average month is about 30.42 days, which can change annual
            totals.
          </li>
          <li>
            Interpreting the annual equivalent as a guaranteed charge. The
            conversion illustrates equivalence under standard assumptions; real
            billing can include minimums, fees, or different rules.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a
            href="/monthly-to-hourly-rent"
            className="text-sky-700 hover:underline"
          >
            monthly to hourly rent
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
