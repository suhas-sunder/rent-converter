import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/rent-increase-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent Increase Calculator" },
  {
    name: "description",
    content:
      "Calculate a new rent after an increase (percent or fixed amount) using annual equivalence (365-day year). Shows the increase impact across monthly, weekly, and 4-week equivalents and can project multiple increases.",
  },
  {
    name: "keywords",
    content:
      "rent increase calculator, calculate rent increase, rent increase percentage, rent raise calculator, new rent after increase, rent increase projection",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent Increase Calculator" },
  {
    property: "og:description",
    content:
      "Calculate a new rent after a percent or fixed increase using annual equivalence. See monthly, weekly, and 4-week equivalents and multi-increase projections.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-increase-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Increase Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate a new rent after a percent or fixed increase using annual equivalence. Includes pay-cycle equivalents and multi-increase projections.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-increase-calculator",
  },
];

type Period =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
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
  return clampNum(n, 0, 1000);
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

type IncreaseMode = "percent" | "fixed";

export default function RentIncreaseCalculator() {
  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_ri_rent") ?? "2200";
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    return (localStorage.getItem("rc_ri_rent_period") as Period) ?? "monthly";
  });

  const [mode, setMode] = useState<IncreaseMode>(() => {
    if (typeof window === "undefined") return "percent";
    return (localStorage.getItem("rc_ri_mode") as IncreaseMode) ?? "percent";
  });

  const [percentIncrease, setPercentIncrease] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_ri_pct") ?? "3";
  });

  const [fixedIncrease, setFixedIncrease] = useState<string>(() => {
    if (typeof window === "undefined") return "100";
    return localStorage.getItem("rc_ri_fixed") ?? "100";
  });

  const [numIncreases, setNumIncreases] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return localStorage.getItem("rc_ri_n") ?? "1";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_ri_currency") ?? "USD";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_ri_rent", rentAmount);
      localStorage.setItem("rc_ri_rent_period", rentPeriod);
      localStorage.setItem("rc_ri_mode", mode);
      localStorage.setItem("rc_ri_pct", percentIncrease);
      localStorage.setItem("rc_ri_fixed", fixedIncrease);
      localStorage.setItem("rc_ri_n", numIncreases);
      localStorage.setItem("rc_ri_currency", currency);
    } catch {}
  }, [
    rentAmount,
    rentPeriod,
    mode,
    percentIncrease,
    fixedIncrease,
    numIncreases,
    currency,
  ]);

  const rentParsed = useMemo(() => parseAmount(rentAmount), [rentAmount]);
  const pctParsed = useMemo(
    () => parsePercent(percentIncrease),
    [percentIncrease],
  );
  const fixedParsed = useMemo(
    () => parseAmount(fixedIncrease),
    [fixedIncrease],
  );

  const nParsed = useMemo(() => {
    const n = Math.floor(parseAmount(numIncreases));
    return clampNum(n, 1, 50);
  }, [numIncreases]);

  const computed = useMemo(() => {
    const annualBase = annualize(rentParsed, rentPeriod);

    const annualFixedIncrement = annualize(fixedParsed, rentPeriod);
    const factor = 1 + pctParsed / 100;

    const annualNew =
      mode === "percent"
        ? annualBase * Math.pow(factor, nParsed)
        : annualBase + annualFixedIncrement * nParsed;

    const annualDelta = annualNew - annualBase;
    const effectivePct = annualBase > 0 ? (annualDelta / annualBase) * 100 : 0;

    const avgMonthDays = 365 / 12;

    // Projection table: show each step, including step 0 (current)
    const steps = Array.from({ length: nParsed + 1 }, (_, i) => {
      const annualAtStep =
        i === 0
          ? annualBase
          : mode === "percent"
            ? annualBase * Math.pow(factor, i)
            : annualBase + annualFixedIncrement * i;

      const annualPrev =
        i === 0
          ? annualBase
          : mode === "percent"
            ? annualBase * Math.pow(factor, i - 1)
            : annualBase + annualFixedIncrement * (i - 1);

      const deltaFromPrev = annualAtStep - annualPrev;

      return {
        step: i,
        annual: annualAtStep,
        perPeriod: fromAnnual(annualAtStep, rentPeriod),
        monthlyAvg: fromAnnual(annualAtStep, "monthly"),
        every4w: fromAnnual(annualAtStep, "every_4_weeks"),
        weekly: fromAnnual(annualAtStep, "weekly"),
        deltaAnnualFromPrev: deltaFromPrev,
      };
    });

    return {
      annualBase,
      annualNew,
      annualDelta,
      effectivePct,
      avgMonthDays,
      basePerPeriod: fromAnnual(annualBase, rentPeriod),
      newPerPeriod: fromAnnual(annualNew, rentPeriod),
      baseMonthlyAvg: fromAnnual(annualBase, "monthly"),
      newMonthlyAvg: fromAnnual(annualNew, "monthly"),
      base4w: fromAnnual(annualBase, "every_4_weeks"),
      new4w: fromAnnual(annualNew, "every_4_weeks"),
      baseWeekly: fromAnnual(annualBase, "weekly"),
      newWeekly: fromAnnual(annualNew, "weekly"),
      monthMinus4wBase:
        fromAnnual(annualBase, "monthly") -
        fromAnnual(annualBase, "every_4_weeks"),
      monthMinus4wNew:
        fromAnnual(annualNew, "monthly") -
        fromAnnual(annualNew, "every_4_weeks"),
      steps,
      annualFixedIncrement,
      factor,
    };
  }, [rentParsed, rentPeriod, mode, pctParsed, fixedParsed, nParsed]);

  const faqData = [
    {
      q: "What does this rent increase calculator output?",
      a: "It estimates a new rent after a percent or fixed increase, plus the annual and monthly impact. The results are derived from annual totals so different pay and billing cycles can be compared consistently.",
    },
    {
      q: "How is a percent increase applied when there are multiple increases?",
      a: "Percent increases are compounded in the projection. For example, two increases of 3% are applied as (1.03 × 1.03) on the annualized rent total.",
    },
    {
      q: "How is a fixed increase applied when there are multiple increases?",
      a: "A fixed increase is treated as an amount added each time, in the same billing period as the rent input. The calculator annualizes that fixed amount and applies it repeatedly for the number of increases selected.",
    },
    {
      q: "Why do the monthly and 4-week equivalents differ?",
      a: "A 4-week period is always 28 days. An average month is about 30.42 days (365 ÷ 12). This calculator shows both so the difference is visible instead of implied away.",
    },
    {
      q: "Does this reflect proration, mid-lease changes, or partial months?",
      a: "No. It estimates full-period equivalents. Lease proration rules and effective dates can change the first payment after an increase.",
    },
    {
      q: "Can this be used to compare two different rent listings after an increase?",
      a: "It helps compare estimated totals on a consistent basis. Actual costs can differ if utilities, fees, parking, or incentives are included in one listing and not the other.",
    },
    {
      q: "What assumptions are used for the time conversions?",
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
        name: "Rent Increase Calculator",
        item: "https://rentconverter.com/rent-increase-calculator",
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
    name: "Rent Increase Calculator",
    description:
      "Calculate a new rent after a percent or fixed increase using annual equivalence (365-day year). Includes cycle equivalents and multi-increase projection.",
    url: "https://rentconverter.com/rent-increase-calculator",
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent Increase Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Increase Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Estimate a new rent after an increase and see the annual impact. This
          page compares results using an annual basis so monthly, weekly, and
          4-week equivalents stay consistent.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href="/rent-affordability-calculator"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent affordability calculator
          </a>
          <a
            href="/rent-vs-take-home-pay"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent vs take-home pay
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              Calculate a new rent after an increase
            </h2>
            <p className="text-sm text-slate-600">
              This tool converts the current rent to an annual total, applies
              the increase, then converts back to common cycles. That keeps
              comparisons consistent across monthly, weekly, and 4-week views.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current rent
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  placeholder="e.g. 2200"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={rentPeriod}
                  onChange={(e) => setRentPeriod(e.target.value as Period)}
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Rent period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Paste values like $2,200, 2200.00, or 2200. Input is cleaned
                before calculation.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase type
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("percent")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    mode === "percent"
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    Percent increase
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("fixed")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    mode === "fixed"
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-slate-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    Fixed amount increase
                  </div>
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Fixed amount increases are treated as an increase in the same
                period as the rent input.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Increase value
              </label>

              {mode === "percent" ? (
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={percentIncrease}
                    onChange={(e) => setPercentIncrease(e.target.value)}
                    placeholder="e.g. 3"
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                    %
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-2">
                  <input
                    inputMode="decimal"
                    value={fixedIncrease}
                    onChange={(e) => setFixedIncrease(e.target.value)}
                    placeholder="e.g. 100"
                    className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                    {PERIOD_LABEL[rentPeriod]}
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Percent increases can compound when projecting multiple
                increases.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of increases to project
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="numeric"
                  value={numIncreases}
                  onChange={(e) => setNumIncreases(e.target.value)}
                  placeholder="e.g. 1"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                  steps (1–50)
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This is a projection count only. It does not assume any specific
                legal schedule or notice rules.
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
                Currency affects formatting only. Calculations use standard
                time-period assumptions.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="text-sm text-slate-600">
              New rent after increase
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                {money(computed.newPerPeriod, currency)}
              </div>
              <div className="text-sm text-slate-600">
                Current rent:{" "}
                <strong>{money(computed.basePerPeriod, currency)}</strong> (
                {PERIOD_LABEL[rentPeriod].toLowerCase()}). New rent after{" "}
                <strong>
                  {mode === "percent"
                    ? `${pctParsed.toFixed(2)}%`
                    : `${money(fixedParsed, currency)} per ${PERIOD_LABEL[rentPeriod].toLowerCase()}`}
                </strong>{" "}
                × <strong>{nParsed}</strong>.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Increase (effective)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {computed.effectivePct.toFixed(2)}%
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual rent before (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualBase, currency)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Annual rent after (annualized)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(computed.annualNew, currency)}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">Annual impact</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="text-sm text-slate-700">
                    Annual difference:{" "}
                    <strong className="text-slate-900">
                      {money(computed.annualDelta, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Monthly (avg) difference:{" "}
                    <strong className="text-slate-900">
                      {money(
                        computed.newMonthlyAvg - computed.baseMonthlyAvg,
                        currency,
                      )}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Weekly difference:{" "}
                    <strong className="text-slate-900">
                      {money(
                        computed.newWeekly - computed.baseWeekly,
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
                    Before (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.baseMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    Before (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.base4w, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    After (monthly avg):{" "}
                    <strong className="text-slate-900">
                      {money(computed.newMonthlyAvg, currency)}
                    </strong>
                  </div>
                  <div className="text-sm text-slate-700">
                    After (4 weeks):{" "}
                    <strong className="text-slate-900">
                      {money(computed.new4w, currency)}
                    </strong>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  A 4-week period is 28 days. An average month is{" "}
                  {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12), so the two
                  cycles are not interchangeable.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Projection by increase step
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This table shows the rent at each step and the annualized total
              used for comparisons. Percent mode compounds; fixed mode adds the
              same annualized increment each step.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Step</th>
                    <th className="py-2 pr-4">
                      Rent ({PERIOD_LABEL[rentPeriod]})
                    </th>
                    <th className="py-2 pr-4">Annualized</th>
                    <th className="py-2 pr-4">Monthly (avg)</th>
                    <th className="py-2 pr-4">Every 4 weeks</th>
                    <th className="py-2 pr-4">Δ vs prior (annual)</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.steps.map((s) => (
                    <tr key={s.step} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-semibold text-slate-800">
                        {s.step === 0 ? "Current" : `+${s.step}`}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(s.perPeriod, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(s.annual, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(s.monthlyAvg, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {money(s.every4w, currency)}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">
                        {s.step === 0
                          ? "—"
                          : money(s.deltaAnnualFromPrev, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Assumptions used for conversions: 1 year = 365 days, 1 week = 7
              days, every 4 weeks = 28 days, and month = 365 ÷ 12 days
              (average). Exact billing rules, effective dates, and proration can
              change real payments.
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This tool estimates
            full-period equivalents and does not model legal limits, notice
            requirements, or proration.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <p className="text-slate-700 mb-4">
          Rent increases are often expressed as either a percentage or a fixed
          amount. This page estimates the new rent by converting the current
          rent to an annual total first, applying the increase, then converting
          back to common cycles for comparison.
        </p>

        <p className="text-slate-700 mb-4">
          Enter your current rent and select the billing period it is priced in.
          Choose whether the increase is a percent change or a fixed amount
          change. If you are projecting more than one increase, the tool applies
          the change repeatedly: percent increases compound, while fixed
          increases add the same annualized increment each step.
        </p>

        <p className="text-slate-700 mb-4">
          The results show the new rent in the same period you entered, plus the
          annual difference. The monthly, weekly, and 4-week equivalents shown
          here are derived from annual totals so the differences between
          calendar-month pricing and 28-day cycles are visible rather than
          implied.
        </p>

        <p className="text-slate-600 text-sm">
          The output is an estimate intended for budgeting and comparison. Real
          payments can change based on effective dates, proration rules,
          included fees, and what the lease defines as “rent.”
        </p>

        <p className="text-slate-700 mt-6">
          Related pages:{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          ,{" "}
          <a
            href="/rent-affordability-calculator"
            className="text-sky-700 hover:underline"
          >
            rent affordability calculator
          </a>
          , and{" "}
          <a
            href="/rent-vs-take-home-pay"
            className="text-sky-700 hover:underline"
          >
            rent vs take-home pay
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
