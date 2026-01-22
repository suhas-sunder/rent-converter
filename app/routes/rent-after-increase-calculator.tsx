import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-after-increase-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent After Increase Calculator" },
  {
    name: "description",
    content:
      "Calculate your new rent after an increase (percent or fixed amount) using annual equivalence (365-day year). See the updated rent per period, the annual impact, and a full breakdown across pay cycles including monthly vs 4-week.",
  },
  {
    name: "keywords",
    content:
      "rent after increase, rent increase calculator, new rent after increase, rent raise calculator, percent rent increase calculator, rent increase amount calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent After Increase Calculator" },
  {
    property: "og:description",
    content:
      "Calculate your new rent after a percent or fixed increase using annual equivalence. Includes annual impact and pay-cycle breakdowns.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-after-increase",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent After Increase Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate your new rent after a percent or fixed increase using annual equivalence. Includes annual impact and pay-cycle breakdowns.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/rent-after-increase" },
];

type Period =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

type IncreaseMode = "percent" | "amount";

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

function parseAmount(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 1_000_000_000);
}

function parsePercent(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 10_000);
}

function annualize(value: number, period: Period): number {
  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const perDay =
    period === "hourly"
      ? value * 24
      : value / (daysPer[period as Exclude<Period, "hourly">] || 1);

  return perDay * 365;
}

function fromAnnual(annual: number, to: Period): number {
  const daysPer: Record<Exclude<Period, "hourly">, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 14,
    every_4_weeks: 28,
    monthly: 365 / 12,
    annual: 365,
  };

  const daily = annual / 365;
  if (to === "hourly") return daily / 24;
  return daily * (daysPer[to as Exclude<Period, "hourly">] || 1);
}

export default function RentAfterIncrease() {
  const [currentRent, setCurrentRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rc_rai_current") ?? "2000";
  });

  const [mode, setMode] = useState<IncreaseMode>(() => {
    if (typeof window === "undefined") return "percent";
    return (localStorage.getItem("rc_rai_mode") as IncreaseMode) ?? "percent";
  });

  const [increasePercent, setIncreasePercent] = useState<string>(() => {
    if (typeof window === "undefined") return "5";
    return localStorage.getItem("rc_rai_percent") ?? "5";
  });

  const [increaseAmount, setIncreaseAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "100";
    return localStorage.getItem("rc_rai_amount") ?? "100";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_rai_period") as Period) ?? "monthly";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rai_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rai_current", currentRent);
      localStorage.setItem("rc_rai_mode", mode);
      localStorage.setItem("rc_rai_percent", increasePercent);
      localStorage.setItem("rc_rai_amount", increaseAmount);
      localStorage.setItem("rc_rai_period", period);
      localStorage.setItem("rc_rai_currency", currency);
    } catch {}
  }, [currentRent, mode, increasePercent, increaseAmount, period, currency]);

  const currentParsed = useMemo(() => parseAmount(currentRent), [currentRent]);
  const pctParsed = useMemo(
    () => parsePercent(increasePercent),
    [increasePercent],
  );
  const amtParsed = useMemo(
    () => parseAmount(increaseAmount),
    [increaseAmount],
  );

  const computed = useMemo(() => {
    const annualCurrent = annualize(currentParsed, period);

    const annualIncrease =
      mode === "percent"
        ? annualCurrent * (pctParsed / 100)
        : annualize(amtParsed, period);

    const annualNew = annualCurrent + annualIncrease;

    const safeAnnualCurrent = Number.isFinite(annualCurrent)
      ? annualCurrent
      : 0;
    const safeAnnualNew = Number.isFinite(annualNew) ? annualNew : 0;
    const safeAnnualIncrease = Number.isFinite(annualIncrease)
      ? annualIncrease
      : 0;

    const effectivePct =
      safeAnnualCurrent > 0
        ? (safeAnnualIncrease / safeAnnualCurrent) * 100
        : 0;

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => {
      const oldVal = fromAnnual(safeAnnualCurrent, p);
      const newVal = fromAnnual(safeAnnualNew, p);
      const delta = newVal - oldVal;
      return { p, oldVal, newVal, delta };
    });

    const newPerSelected = fromAnnual(safeAnnualNew, period);
    const deltaPerSelected = newPerSelected - currentParsed;

    const oldMonthlyAvg = fromAnnual(safeAnnualCurrent, "monthly");
    const old4w = fromAnnual(safeAnnualCurrent, "every_4_weeks");
    const newMonthlyAvg = fromAnnual(safeAnnualNew, "monthly");
    const new4w = fromAnnual(safeAnnualNew, "every_4_weeks");

    return {
      annualCurrent: safeAnnualCurrent,
      annualNew: safeAnnualNew,
      annualIncrease: safeAnnualIncrease,
      effectivePct,
      breakdown,
      newPerSelected,
      deltaPerSelected,
      oldMonthlyAvg,
      old4w,
      newMonthlyAvg,
      new4w,
      avgMonthDays: 365 / 12,
    };
  }, [currentParsed, pctParsed, amtParsed, period, mode]);

  const faqData = [
    {
      q: "What does this calculator output?",
      a: "It estimates the new rent after an increase and shows the annual impact. It also displays equivalents across common pay cycles so the change is comparable even when listings use different periods.",
    },
    {
      q: "How do I enter the increase?",
      a: "Choose percent if the increase is stated as a rate (for example 5%). Choose amount if the increase is a fixed add-on per billing period (for example $100 per month).",
    },
    {
      q: "What does the billing period apply to?",
      a: "The billing period applies to both the current rent and the increase amount (if you use the fixed amount mode). The page converts values to annual totals to keep comparisons consistent.",
    },
    {
      q: "Why does the page show monthly and every 4 weeks separately?",
      a: "Every 4 weeks is always 28 days. A calendar month is longer on average (365 ÷ 12 days). Showing both avoids treating them as interchangeable when comparing costs.",
    },
    {
      q: "Does this include utilities, fees, or taxes?",
      a: "No. It compares rent amounts only. If one option includes bundled costs, treat the result as a baseline comparison, not a full housing-cost total.",
    },
    {
      q: "Will this match the first payment after an increase takes effect?",
      a: "Not necessarily. This is a full-period estimate. Proration, mid-cycle effective dates, and lease-specific rules can change the first payment after a change.",
    },
    {
      q: "What assumptions are used for the period conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
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
        name: "Rent After Increase Calculator",
        item: "https://rentconverter.com/rent-after-increase",
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
    name: "Rent After Increase Calculator",
    description:
      "Calculate your new rent after an increase (percent or fixed amount) using annual equivalence (365-day year). Includes annual impact and pay-cycle breakdowns.",
    url: "https://rentconverter.com/rent-after-increase",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent After Increase Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent After Increase Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Estimate your new rent after an increase and see the annual impact.
          Results are calculated using annual equivalence so the change remains
          comparable across common billing cycles.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-increase-percentage"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent increase percentage
          </a>
          <a
            href="/rent-increase-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent increase calculator
          </a>
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent affordability calculator
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Calculate the new rent after an increase
            </h2>
            <p className="text-sm text-slate-600">
              Enter the current rent, choose how the increase is stated, and
              select the billing period used by the rent amount.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current rent
              </label>
              <input
                inputMode="decimal"
                value={currentRent}
                onChange={(e) => setCurrentRent(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $2,000, 2000.00, or 2000. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period (for the current rent)
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Billing period"
              >
                {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Conversions are computed by annualizing the rent using a 365-day
                year.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase type
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as IncreaseMode)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Increase type"
              >
                <option value="percent">Percent increase</option>
                <option value="amount">Fixed amount increase</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Percent applies to the annualized rent. Fixed amount is treated
                as an add-on per the selected billing period.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {mode === "percent" ? "Increase percent" : "Increase amount"}
              </label>

              {mode === "percent" ? (
                <input
                  inputMode="decimal"
                  value={increasePercent}
                  onChange={(e) => setIncreasePercent(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              ) : (
                <input
                  inputMode="decimal"
                  value={increaseAmount}
                  onChange={(e) => setIncreaseAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              )}

              <p className="mt-2 text-xs text-slate-500">
                {mode === "percent"
                  ? "Enter a percent like 5 or 2.5. The result is calculated from annual totals."
                  : "Enter the increase as an amount per the same billing period as the rent."}
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Currency"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="NZD">NZD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Currency affects formatting only.
              </p>
            </div>

            <div className="md:col-span-6" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">
              New rent after increase
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(computed.newPerSelected, currency)}
              </div>
              <div className="text-sm text-slate-600">
                {money(currentParsed, currency)} per{" "}
                {PERIOD_LABEL[period].toLowerCase()} becomes{" "}
                <strong>{money(computed.newPerSelected, currency)}</strong> per{" "}
                {PERIOD_LABEL[period].toLowerCase()} based on annual
                equivalence.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Estimated percent change
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {computed.effectivePct.toFixed(2)}%
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Change per selected period
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.deltaPerSelected, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual increase (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualIncrease, currency)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual totals</div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    Current annual rent:{" "}
                    <strong className="text-slate-900">
                      {money(computed.annualCurrent, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    New annual rent:{" "}
                    <strong className="text-slate-900">
                      {money(computed.annualNew, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Difference:{" "}
                    <strong className="text-slate-900">
                      {money(
                        computed.annualNew - computed.annualCurrent,
                        currency,
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Monthly vs every 4 weeks (before and after)
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-sm text-slate-700">
                    Current (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.oldMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Current (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.old4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    New (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.newMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    New (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.new4w, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Every 4 weeks is 28 days. An average month is{" "}
                  {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Full breakdown across periods (annual-equivalent)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This table annualizes the current rent and the new rent first,
              then expresses both as hourly, daily, weekly, 4-week, monthly, and
              annual equivalents. This helps compare the increase across
              different pay cycles without mixing assumptions.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Period</th>
                    <th className="py-2 pr-4">Current</th>
                    <th className="py-2 pr-4">New</th>
                    <th className="py-2 pr-4">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.breakdown.map((row) => (
                    <tr key={row.p} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-semibold text-slate-800">
                        {PERIOD_LABEL[row.p]}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.oldVal, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.newVal, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(row.delta, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks =
              28 days, and month = 365 ÷ 12 days (average). Exact billing and
              due dates vary by agreement.
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This page estimates
            full-period equivalents and does not model fees, proration, or
            effective dates.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How the “new rent” is calculated
        </h2>

        <p className="text-slate-700 mb-4">
          People usually want one of two answers: the updated rent for the next
          billing cycle, and the yearly cost difference after the change. This
          calculator is built around those outputs, so it shows the new rent in
          the same period you entered and also converts the change into an
          annual impact.
        </p>

        <p className="text-slate-700 mb-4">
          If the increase is a percent, the calculator applies that rate to the
          annualized version of your current rent. If the increase is a fixed
          amount, the calculator treats that add-on as an amount per the same
          billing period as the rent, then annualizes both for a consistent
          comparison.
        </p>

        <p className="text-slate-700 mb-4">
          The breakdown table exists for a practical reason: rent changes are
          often discussed monthly, budgets are tracked weekly, and some leases
          bill every 28 days. Converting everything through annual totals keeps
          those views aligned, and the monthly vs 4-week block makes it clear
          that a 28-day cycle and a calendar month are not the same length.
        </p>

        <p className="text-slate-700 mt-6">
          Related pages:{" "}
          <a
            href="/rent-increase-percentage"
            className="text-sky-700 hover:underline"
          >
            rent increase percentage
          </a>
          ,{" "}
          <a
            href="/rent-paid-weekly-vs-monthly"
            className="text-sky-700 hover:underline"
          >
            rent paid weekly vs monthly
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
