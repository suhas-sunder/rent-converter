import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-vs-buy-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent vs Buy Calculator" },
  {
    name: "description",
    content:
      "Compare renting vs buying using a simple cost model over a chosen time horizon. See total rent cost, total ownership cost, estimated equity, and an estimated break-even year.",
  },
  {
    name: "keywords",
    content:
      "rent vs buy calculator, renting vs buying, rent or buy, break even rent vs buy, home ownership cost calculator, total cost of owning",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent vs Buy Calculator" },
  {
    property: "og:description",
    content:
      "Compare renting vs buying over time with a clear breakdown of rent costs, ownership costs, and estimated equity.",
  },
  { property: "og:url", content: "https://rentconverter.com/rent-vs-buy-calculator" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent vs Buy Calculator" },
  {
    name: "twitter:description",
    content:
      "Compare renting vs buying over time with a clear breakdown of rent costs, ownership costs, and estimated equity.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/rent-vs-buy-calculator" },
];

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function parseMoney(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 1_000_000_000);
}

function parsePercent(input: string) {
  const cleaned = input.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 100);
}

function parseIntSafe(input: string) {
  const cleaned = input.replace(/[^\d]/g, "");
  const n = parseInt(cleaned || "0", 10);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 100);
}

function money(n: number, currency: string) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function pctToRate(p: number) {
  return (Number.isFinite(p) ? p : 0) / 100;
}

function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r <= 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return principal * ((r * pow) / (pow - 1));
}

type YearRow = {
  year: number;
  rentAnnual: number;
  rentCumulative: number;

  homeValue: number;
  mortgageBalanceEnd: number;
  principalPaidThisYear: number;
  interestPaidThisYear: number;

  ownershipAnnualOutflow: number;
  ownershipCumulativeOutflow: number;

  equityEnd: number;
};

export default function RentVsBuyCalculator() {
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem("rc_rvb_currency") ?? "USD";
  });

  // Renting
  const [monthlyRent, setMonthlyRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_rvb_rent") ?? "2200";
  });
  const [rentIncreasePct, setRentIncreasePct] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rvb_rent_increase") ?? "3";
  });

  // Buying
  const [homePrice, setHomePrice] = useState<string>(() => {
    if (typeof window === "undefined") return "550000";
    return localStorage.getItem("rc_rvb_price") ?? "550000";
  });
  const [downPaymentPct, setDownPaymentPct] = useState<string>(() => {
    if (typeof window === "undefined") return "20";
    return localStorage.getItem("rc_rvb_down") ?? "20";
  });
  const [mortgageRatePct, setMortgageRatePct] = useState<string>(() => {
    if (typeof window === "undefined") return "5.5";
    return localStorage.getItem("rc_rvb_rate") ?? "5.5";
  });
  const [mortgageTermYears, setMortgageTermYears] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    return localStorage.getItem("rc_rvb_term") ?? "25";
  });

  const [propertyTaxPct, setPropertyTaxPct] = useState<string>(() => {
    if (typeof window === "undefined") return "1.0";
    return localStorage.getItem("rc_rvb_tax") ?? "1.0";
  });
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<string>(() => {
    if (typeof window === "undefined") return "1200";
    return localStorage.getItem("rc_rvb_ins") ?? "1200";
  });
  const [maintenancePct, setMaintenancePct] = useState<string>(() => {
    if (typeof window === "undefined") return "1.0";
    return localStorage.getItem("rc_rvb_maint") ?? "1.0";
  });
  const [hoaMonthly, setHoaMonthly] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("rc_rvb_hoa") ?? "0";
  });

  const [buyClosingCosts, setBuyClosingCosts] = useState<string>(() => {
    if (typeof window === "undefined") return "8000";
    return localStorage.getItem("rc_rvb_buy_close") ?? "8000";
  });
  const [sellCostPct, setSellCostPct] = useState<string>(() => {
    if (typeof window === "undefined") return "5";
    return localStorage.getItem("rc_rvb_sell_cost") ?? "5";
  });

  const [homeAppreciationPct, setHomeAppreciationPct] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rvb_app") ?? "3";
  });

  // Horizon
  const [horizonYears, setHorizonYears] = useState<string>(() => {
    if (typeof window === "undefined") return "7";
    return localStorage.getItem("rc_rvb_years") ?? "7";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rvb_currency", currency);

      localStorage.setItem("rc_rvb_rent", monthlyRent);
      localStorage.setItem("rc_rvb_rent_increase", rentIncreasePct);

      localStorage.setItem("rc_rvb_price", homePrice);
      localStorage.setItem("rc_rvb_down", downPaymentPct);
      localStorage.setItem("rc_rvb_rate", mortgageRatePct);
      localStorage.setItem("rc_rvb_term", mortgageTermYears);

      localStorage.setItem("rc_rvb_tax", propertyTaxPct);
      localStorage.setItem("rc_rvb_ins", homeInsuranceAnnual);
      localStorage.setItem("rc_rvb_maint", maintenancePct);
      localStorage.setItem("rc_rvb_hoa", hoaMonthly);

      localStorage.setItem("rc_rvb_buy_close", buyClosingCosts);
      localStorage.setItem("rc_rvb_sell_cost", sellCostPct);

      localStorage.setItem("rc_rvb_app", homeAppreciationPct);
      localStorage.setItem("rc_rvb_years", horizonYears);
    } catch {}
  }, [
    currency,
    monthlyRent,
    rentIncreasePct,
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyTaxPct,
    homeInsuranceAnnual,
    maintenancePct,
    hoaMonthly,
    buyClosingCosts,
    sellCostPct,
    homeAppreciationPct,
    horizonYears,
  ]);

  const inputs = useMemo(() => {
    const rent = parseMoney(monthlyRent);
    const rentIncrease = pctToRate(parsePercent(rentIncreasePct));

    const price = parseMoney(homePrice);
    const downPct = pctToRate(parsePercent(downPaymentPct));
    const rate = pctToRate(parsePercent(mortgageRatePct));
    const termYears = parseIntSafe(mortgageTermYears);

    const propTax = pctToRate(parsePercent(propertyTaxPct));
    const insAnnual = parseMoney(homeInsuranceAnnual);
    const maint = pctToRate(parsePercent(maintenancePct));
    const hoa = parseMoney(hoaMonthly);

    const buyClose = parseMoney(buyClosingCosts);
    const sellPct = pctToRate(parsePercent(sellCostPct));
    const app = pctToRate(parsePercent(homeAppreciationPct));

    const years = parseIntSafe(horizonYears);

    return {
      rent,
      rentIncrease,
      price,
      downPct,
      rate,
      termYears,
      propTax,
      insAnnual,
      maint,
      hoa,
      buyClose,
      sellPct,
      app,
      years,
    };
  }, [
    monthlyRent,
    rentIncreasePct,
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyTaxPct,
    homeInsuranceAnnual,
    maintenancePct,
    hoaMonthly,
    buyClosingCosts,
    sellCostPct,
    homeAppreciationPct,
    horizonYears,
  ]);

  const results = useMemo(() => {
    const years = inputs.years;
    const horizon = clampNum(years, 0, 60);

    const price = inputs.price;
    const downPayment = price * inputs.downPct;
    const loanPrincipal = Math.max(0, price - downPayment);

    const termMonths = Math.max(0, inputs.termYears * 12);
    const payment = monthlyPayment(loanPrincipal, inputs.rate, termMonths);

    const rows: YearRow[] = [];

    let rentMonthly = inputs.rent;
    let rentCum = 0;

    let homeValue = price;

    let balance = loanPrincipal;
    let ownCumOutflow = 0;

    const hoaAnnual = inputs.hoa * 12;

    for (let y = 1; y <= horizon; y++) {
      // Rent
      const rentAnnual = rentMonthly * 12;
      rentCum += rentAnnual;

      // Home value
      if (y > 1) {
        homeValue = homeValue * (1 + inputs.app);
      }

      // Mortgage amortization for the year
      let interestThisYear = 0;
      let principalThisYear = 0;

      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const i = balance * (inputs.rate / 12);
        const p = Math.max(0, payment - i);
        interestThisYear += i;
        principalThisYear += Math.min(p, balance);
        balance = Math.max(0, balance - p);
      }

      // Ownership annual outflow (cash leaving pocket)
      const propertyTaxAnnual = homeValue * inputs.propTax;
      const maintenanceAnnual = homeValue * inputs.maint;

      const mortgageOutflowAnnual = payment * 12; // includes principal + interest
      const ownershipAnnualOutflow =
        mortgageOutflowAnnual + propertyTaxAnnual + inputs.insAnnual + maintenanceAnnual + hoaAnnual;

      ownCumOutflow += ownershipAnnualOutflow;

      const equityEnd = Math.max(0, homeValue - balance);

      rows.push({
        year: y,
        rentAnnual,
        rentCumulative: rentCum,
        homeValue,
        mortgageBalanceEnd: balance,
        principalPaidThisYear: principalThisYear,
        interestPaidThisYear: interestThisYear,
        ownershipAnnualOutflow,
        ownershipCumulativeOutflow: ownCumOutflow,
        equityEnd,
      });

      // Next year's rent
      rentMonthly = rentMonthly * (1 + inputs.rentIncrease);
    }

    // End-of-horizon sale estimate (simple model)
    const last = rows[rows.length - 1];
    const endingHomeValue = last ? last.homeValue : price * (1 + inputs.app * 0);
    const endingBalance = last ? last.mortgageBalanceEnd : loanPrincipal;

    const estimatedSellCosts = endingHomeValue * inputs.sellPct;
    const estimatedNetSaleProceeds = Math.max(0, endingHomeValue - estimatedSellCosts - endingBalance);

    const totalRentCost = rentCum;

    // Total ownership outflow includes closing costs at purchase
    const totalOwnershipOutflow = ownCumOutflow + inputs.buyClose + downPayment;

    // Ownership "net cost" here is outflow minus estimated sale proceeds
    const ownershipNetCost = Math.max(0, totalOwnershipOutflow - estimatedNetSaleProceeds);

    // Rent "net cost" is rent paid (no asset)
    const rentNetCost = totalRentCost;

    // Break-even year: first year where ownership net cost to that point <= rent cost to that point
    // For ownership to that point, approximate as cumulative outflow + down payment + closing costs minus estimated equity (not sale proceeds).
    let breakEvenYear: number | null = null;
    for (const r of rows) {
      const ownApproxNetToDate = Math.max(
        0,
        (r.ownershipCumulativeOutflow + downPayment + inputs.buyClose) - r.equityEnd
      );
      if (ownApproxNetToDate <= r.rentCumulative) {
        breakEvenYear = r.year;
        break;
      }
    }

    const firstYear = rows[0];
    const firstYearRentAnnual = firstYear ? firstYear.rentAnnual : inputs.rent * 12;
    const firstYearOwnOutflow = firstYear ? firstYear.ownershipAnnualOutflow : 0;

    const annualCashGap = firstYearOwnOutflow - firstYearRentAnnual;

    return {
      downPayment,
      loanPrincipal,
      monthlyMortgagePayment: payment,
      totalRentCost,
      totalOwnershipOutflow,
      estimatedNetSaleProceeds,
      ownershipNetCost,
      rentNetCost,
      breakEvenYear,
      annualCashGap,
      rows,
      endingHomeValue,
      endingBalance,
      estimatedSellCosts,
    };
  }, [inputs]);

  const faqData = [
    {
      q: "What does this rent vs buy calculator estimate?",
      a: "It estimates total rent paid over a chosen time horizon and compares it to a simplified ownership model that includes mortgage payments, property tax, insurance, maintenance, HOA, and estimated selling costs, then subtracts estimated sale proceeds.",
    },
    {
      q: "Why does the calculator include both “outflow” and a “net cost” for buying?",
      a: "Ownership has cash leaving the household (payments and expenses) and also builds an asset through equity. Net cost is a way to compare ownership outflow after accounting for estimated sale proceeds at the end of the horizon.",
    },
    {
      q: "Does the mortgage payment include property tax and insurance?",
      a: "No. The mortgage payment shown is principal and interest only. Property tax, insurance, maintenance, and HOA are added separately so the ownership total is visible.",
    },
    {
      q: "How are rent increases applied?",
      a: "Rent is grown once per year by the annual rent increase percentage. The model uses a 12-month year for rent budgeting and comparison.",
    },
    {
      q: "How is home appreciation applied?",
      a: "Home value is grown once per year by the home appreciation percentage. This affects property tax, maintenance (if set as a percent of value), and the estimated sale proceeds.",
    },
    {
      q: "What does “break-even year” mean here?",
      a: "It is the first year where the ownership estimate becomes less expensive than renting in this model, using cumulative ownership outflow plus upfront costs, minus estimated equity, compared against cumulative rent paid.",
    },
    {
      q: "Are closing costs and selling costs always required?",
      a: "They are optional inputs, but they can materially change the comparison for short time horizons. Setting them to 0 is allowed if the goal is a simplified baseline.",
    },
    {
      q: "Does this include income tax effects or deductions?",
      a: "No. Tax impacts are not modeled. This keeps the tool focused on cash costs and a basic equity estimate rather than jurisdiction-specific tax rules.",
    },
    {
      q: "Does it include utilities or renter’s insurance?",
      a: "No. The rent side is rent-only. Utilities and renter’s insurance vary widely and can be added separately if needed.",
    },
    {
      q: "How accurate are the results?",
      a: "They are estimates based on simplified assumptions. Real outcomes depend on mortgage terms, fees, maintenance realities, vacancy or move timing, market changes, and the exact terms of rent and sale.",
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rentconverter.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rent vs Buy Calculator",
        item: "https://rentconverter.com/rent-vs-buy-calculator",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="pb-4">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href="/" className="hover:underline">
            Home
          </a>{" "}
          / Rent vs Buy Calculator
        </nav>
      </section>

      <section className="pb-8 text-center bg-white">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Rent vs Buy Calculator</h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Compare rent costs to an estimated cost of ownership over a time horizon. The model shows both cash outflow
          and an equity-based comparison to support like-for-like budgeting.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href="/rent-converter"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter hub
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

      {/* Tool above the fold */}
      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Compare costs over time</h2>
            <p className="text-sm text-slate-600 mt-2">
              Inputs accept pasted values. Results update instantly and remain visible even when inputs are zero.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Rent inputs */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">Rent assumptions</h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly rent</label>
              <input
                inputMode="decimal"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 2200"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">Examples: 2200, $2,200, 2200.00</p>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Annual rent increase</label>
                <input
                  inputMode="decimal"
                  value={rentIncreasePct}
                  onChange={(e) => setRentIncreasePct(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <p className="mt-2 text-xs text-slate-500">Applied once per year in the model.</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="NZD">NZD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">Currency affects formatting only.</p>
              </div>
            </div>

            {/* Buy inputs */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">Buy assumptions</h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">Home price</label>
              <input
                inputMode="decimal"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                placeholder="e.g. 550000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">Examples: 550000, $550,000</p>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Down payment (%)</label>
                  <input
                    inputMode="decimal"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mortgage rate (%)</label>
                  <input
                    inputMode="decimal"
                    value={mortgageRatePct}
                    onChange={(e) => setMortgageRatePct(e.target.value)}
                    placeholder="e.g. 5.5"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mortgage term (years)</label>
                  <input
                    inputMode="numeric"
                    value={mortgageTermYears}
                    onChange={(e) => setMortgageTermYears(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Home appreciation (%)</label>
                  <input
                    inputMode="decimal"
                    value={homeAppreciationPct}
                    onChange={(e) => setHomeAppreciationPct(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Property tax (% of value per year)</label>
                  <input
                    inputMode="decimal"
                    value={propertyTaxPct}
                    onChange={(e) => setPropertyTaxPct(e.target.value)}
                    placeholder="e.g. 1.0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Maintenance (% of value per year)</label>
                  <input
                    inputMode="decimal"
                    value={maintenancePct}
                    onChange={(e) => setMaintenancePct(e.target.value)}
                    placeholder="e.g. 1.0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Home insurance (annual)</label>
                  <input
                    inputMode="decimal"
                    value={homeInsuranceAnnual}
                    onChange={(e) => setHomeInsuranceAnnual(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">HOA (monthly)</label>
                  <input
                    inputMode="decimal"
                    value={hoaMonthly}
                    onChange={(e) => setHoaMonthly(e.target.value)}
                    placeholder="e.g. 0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Buy closing costs (one-time)</label>
                  <input
                    inputMode="decimal"
                    value={buyClosingCosts}
                    onChange={(e) => setBuyClosingCosts(e.target.value)}
                    placeholder="e.g. 8000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Selling costs (% of sale price)</label>
                  <input
                    inputMode="decimal"
                    value={sellCostPct}
                    onChange={(e) => setSellCostPct(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>

            {/* Horizon + headline results */}
            <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">Time horizon</h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">Compare over (years)</label>
              <input
                inputMode="numeric"
                value={horizonYears}
                onChange={(e) => setHorizonYears(e.target.value)}
                placeholder="e.g. 7"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">Used for totals and the year-by-year table.</p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Estimated mortgage payment (monthly)</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {money(results.monthlyMortgagePayment, currency)}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Principal + interest only. Taxes, insurance, maintenance, and HOA are added separately.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Upfront cash at purchase (down payment + closing)</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {money(results.downPayment + parseMoney(buyClosingCosts), currency)}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This is treated as cash outflow in the ownership estimate.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-700">Rent total (estimated)</div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">{money(results.totalRentCost, currency)}</div>
              <p className="mt-2 text-xs text-slate-500">
                Total rent paid over {inputs.years} years with the modeled annual increase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-700">Ownership net cost (estimated)</div>
              <div className="mt-2 text-3xl font-extrabold text-sky-800">{money(results.ownershipNetCost, currency)}</div>
              <p className="mt-2 text-xs text-slate-500">
                Ownership outflow (including upfront costs) minus estimated net sale proceeds at the end of the horizon.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-700">Estimated break-even year</div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {results.breakEvenYear === null ? "—" : results.breakEvenYear}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                First year where the ownership estimate becomes less expensive than renting in this model.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-2">What the comparison is doing</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Ownership outflow (total)</div>
                <div className="mt-1 font-bold text-slate-800">{money(results.totalOwnershipOutflow, currency)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Estimated net sale proceeds</div>
                <div className="mt-1 font-bold text-slate-800">{money(results.estimatedNetSaleProceeds, currency)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Ending home value (modeled)</div>
                <div className="mt-1 font-bold text-slate-800">{money(results.endingHomeValue, currency)}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Ending mortgage balance (modeled)</div>
                <div className="mt-1 font-bold text-slate-800">{money(results.endingBalance, currency)}</div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Notes: Rent is modeled monthly with an annual increase applied once per year. Home value is grown annually. Mortgage amortization uses a standard
              monthly payment formula. Property tax and maintenance can scale with home value.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Year-by-year comparison</h3>
            <p className="text-sm text-slate-600 mb-4">
              This table makes the trade-offs visible: rent paid, ownership cash outflow, and the equity estimate as the mortgage balance falls and home value changes.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Year</th>
                    <th className="py-2 pr-4">Rent (annual)</th>
                    <th className="py-2 pr-4">Rent (cumulative)</th>
                    <th className="py-2 pr-4">Ownership outflow (annual)</th>
                    <th className="py-2 pr-4">Ownership outflow (cumulative)</th>
                    <th className="py-2 pr-4">Interest paid (year)</th>
                    <th className="py-2 pr-4">Principal paid (year)</th>
                    <th className="py-2 pr-4">Equity (end of year)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((r) => (
                    <tr key={r.year} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-semibold text-slate-800">{r.year}</td>
                      <td className="py-2 pr-4">{money(r.rentAnnual, currency)}</td>
                      <td className="py-2 pr-4">{money(r.rentCumulative, currency)}</td>
                      <td className="py-2 pr-4">{money(r.ownershipAnnualOutflow, currency)}</td>
                      <td className="py-2 pr-4">{money(r.ownershipCumulativeOutflow, currency)}</td>
                      <td className="py-2 pr-4">{money(r.interestPaidThisYear, currency)}</td>
                      <td className="py-2 pr-4">{money(r.principalPaidThisYear, currency)}</td>
                      <td className="py-2 pr-4">{money(r.equityEnd, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              The year-by-year ownership outflow excludes the end-of-horizon sale event. Upfront costs (down payment and buying closing costs) are included in the
              totals shown above.
            </p>
          </div>
        </div>
      </section>

      {/* Required explanation section above FAQ (unique to rent vs buy intent) */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">How this rent vs buy tool works</h2>

        <p className="text-slate-700 mb-4">
          Rent vs buy comparisons often fail because they mix different kinds of numbers. Renting is mostly a cash expense. Buying has cash expenses and it also
          converts part of the payment into an asset through equity. This tool keeps those pieces separate, then recombines them into an apples-to-apples estimate.
        </p>

        <p className="text-slate-700 mb-4">
          On the rent side, the calculator takes a monthly rent and grows it once per year by the rent increase percentage. It then totals rent paid over the chosen
          time horizon. This produces a single “total rent paid” number that matches common budgeting questions.
        </p>

        <p className="text-slate-700 mb-4">
          On the buy side, the calculator estimates a standard mortgage payment (principal + interest), then adds major ownership costs: property tax, insurance,
          maintenance, and HOA. Upfront costs (down payment and buying closing costs) are treated as cash outflow. Home value is grown once per year by the
          appreciation percentage, and mortgage balance is reduced using a simple amortization schedule. At the end of the horizon, the tool estimates sale proceeds
          by subtracting selling costs and the remaining mortgage balance from the modeled home value.
        </p>

        <p className="text-slate-700 mb-4">
          The headline comparison “ownership net cost” is the ownership outflow minus estimated net sale proceeds. It is not a guarantee of what would happen in a
          real market. It is a structured way to see how sensitive the decision is to time horizon, fees, appreciation, and financing terms.
        </p>

        <p className="text-slate-700 mt-6">
          Related tools:{" "}
          <a href="/rent-increase-calculator" className="text-sky-700 hover:underline">
            rent increase calculator
          </a>
          ,{" "}
          <a href="/rent-affordability-calculator" className="text-sky-700 hover:underline">
            rent affordability calculator
          </a>
          , and{" "}
          <a href="/rent-converter" className="text-sky-700 hover:underline">
            rent converter
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">{f.q}</h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strong disclaimer (visible, verbatim, before the very end) */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and comparison purposes only. Calculations are based on standard time-period assumptions
            (including a 365-day year and average month length) and simplified models. Results are estimates, not guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rental costs, affordability, payment schedules, and obligations vary by location, landlord,
            lease terms, and individual circumstances. Always review your lease agreement and consult qualified professionals before making financial decisions.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      {/* Standardized footer disclaimer (global) */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations use standard time-period assumptions, including a 365-day year and average month length.
            Always confirm payment schedules and lease terms in your rental agreement.
          </em>
        </p>
      </section>

      {/* Required JSON-LD placement: bottom of page component */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
