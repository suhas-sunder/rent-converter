import { Link } from "react-router";

const HowItWorks = ({
  computed,
  rentPeriod,
  incomePeriod,
  PERIOD_LABEL,
  safeToFixed,
}: any) => {
  const has = Boolean(computed && computed.ok);

  const fmtMoney = (v: any, d = 2) => {
    if (v === null || v === undefined) return "—";
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return safeToFixed(n, d);
  };

  const fmtPct = (v: any, d = 1) => {
    if (v === null || v === undefined) return "—";
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return safeToFixed(n, d);
  };

  const rentShareN = has ? Number(computed?.rentSharePct) : NaN;
  const rentShareOk = Number.isFinite(rentShareN);

  const annualRentN = has ? Number(computed?.annualRent) : NaN;
  const annualIncomeN = has ? Number(computed?.annualIncome) : NaN;
  const annualOk =
    Number.isFinite(annualRentN) && Number.isFinite(annualIncomeN);

  const derivedMonthlyRentOk = has
    ? Number.isFinite(Number(computed?.monthlyRent))
    : false;
  const derivedMonthlyIncomeOk = has
    ? Number.isFinite(Number(computed?.monthlyIncome))
    : false;

  const showDecision = rentShareOk && annualOk;

  const decisionLabel =
    showDecision && rentShareN <= 30
      ? "Shortlist"
      : showDecision && rentShareN <= 40
        ? "Caution"
        : showDecision
          ? "Reject"
          : null;

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight text-center">
            How to calculate rent as a percentage of income
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            Use this when you are deciding whether a rent payment is realistic
            for your income, especially when the rent and income are stated on
            different schedules (weekly rent vs monthly pay, 4-week rent vs
            biweekly pay, and so on).
          </p>
          <p className="mt-3 text-slate-600 leading-7">
            The calculator converts both numbers to the same annual baseline
            first, then calculates the rent share from those annual totals. The
            monthly, weekly, and 4-week breakdowns are just alternate views of
            the same annual math, so the percentage is consistent across views.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Income + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual totals
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent % + breakdown
              </div>
            </div>
          </div>

          {/* Related tools (required) */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                Related tools
              </h3>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Universal rent converter →
                    </Link>{" "}
                    Useful when you want the rent itself restated in a different
                    period before you discuss pricing (for example, converting a
                    weekly listing into a monthly figure for a lease
                    comparison).
                  </li>
                  <li>
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      How much rent can I afford →
                    </Link>{" "}
                    Useful when you want a target rent range from your income
                    before you start evaluating listings.
                  </li>
                  <li>
                    <Link
                      to="/rent-after-tax-income-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent after tax income →
                    </Link>{" "}
                    Useful when your headline income is not what you actually
                    take home and you want the percentage based on net pay.
                  </li>
                  <li>
                    <Link
                      to="/rent-vs-take-home-pay-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent vs take-home pay →
                    </Link>{" "}
                    Useful when the decision hinges on net cash flow pressure
                    rather than gross-income ratios.
                  </li>
                  <li>
                    <Link
                      to="/rent-paid-every-4-weeks-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent paid every 4 weeks →
                    </Link>{" "}
                    Useful when a listing is billed on 28-day cycles and you
                    need the real monthly/annual impact (not a “monthly ÷ 4”
                    shortcut).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Examples (required) */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                Examples
              </h3>

              <p className="mt-4 text-slate-700 leading-7">
                Each example ends with a decision that changes. They use
                realistic, fixed numbers so you can sanity-check outcomes
                without depending on what is currently on screen.
              </p>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example A: Your current inputs (when results are available)
                </div>

                {has ? (
                  <div className="mt-3 space-y-3 text-slate-700">
                    <div className="text-sm font-semibold text-slate-900">
                      Situation
                    </div>
                    <p className="text-slate-700 leading-7">
                      You already have a rent number and an income number, but
                      they may not be stated on the same schedule. The decision
                      is whether this listing stays within your rent-to-income
                      screening limit.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Numbers
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Rent: <strong>$2,200/month</strong>
                      </li>
                      <li>
                        Income: <strong>$6,500/month</strong>
                      </li>
                      <li>
                        Screening rule:{" "}
                        <strong>keep rent at or below 35%</strong>
                      </li>
                    </ul>

                    <div className="text-sm font-semibold text-slate-900">
                      Calculation
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Annual rent = $2,200 × 12 = <strong>$26,400</strong>
                      </li>
                      <li>
                        Annual income = $6,500 × 12 = <strong>$78,000</strong>
                      </li>
                      <li>
                        Rent share = 26,400 ÷ 78,000 × 100 ={" "}
                        <strong>33.8%</strong>
                      </li>
                    </ul>

                    <div className="text-sm font-semibold text-slate-900">
                      Result
                    </div>
                    <p className="text-slate-700 leading-7">
                      Rent share is <strong>33.8%</strong>, which is under the
                      35% screening limit.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Meaning
                    </div>
                    <p className="text-slate-700 leading-7">
                      This changes the decision from “not sure, keep browsing”
                      to “this is worth pursuing.” The rent passes your
                      screening rule, so the next decision shifts to location,
                      commute, and lease terms.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3 text-slate-700">
                    <div className="text-sm font-semibold text-slate-900">
                      Situation
                    </div>
                    <p className="text-slate-700 leading-7">
                      You want a rent-to-income percentage that stays consistent
                      even if rent and income are entered on different
                      schedules.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Numbers
                    </div>
                    <p className="text-slate-700 leading-7">
                      Enter rent and income above to see your rent share and the
                      matching monthly/weekly/4-week breakdowns.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Calculation
                    </div>
                    <p className="text-slate-700 leading-7">
                      The calculator normalizes both values to annual totals and
                      computes rent share from that shared baseline.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Result
                    </div>
                    <p className="text-slate-700 leading-7">
                      You will see a single percentage that stays consistent
                      across the different views.
                    </p>

                    <div className="text-sm font-semibold text-slate-900">
                      Meaning
                    </div>
                    <p className="text-slate-700 leading-7">
                      Once the percentage is visible, the decision becomes
                      clear: keep the listing in your range or rule it out
                      because it consumes too much of your income.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example B: Weekly rent vs monthly income
                </div>

                <div className="mt-3 space-y-3 text-slate-700">
                  <div className="text-sm font-semibold text-slate-900">
                    Situation
                  </div>
                  <p className="text-slate-700 leading-7">
                    A weekly-billed listing looks manageable at first glance.
                    You need to decide whether it actually stays under your
                    maximum rent-share cutoff.
                  </p>

                  <div className="text-sm font-semibold text-slate-900">
                    Numbers
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Rent: <strong>$525/week</strong>
                    </li>
                    <li>
                      Income: <strong>$5,000/month</strong>
                    </li>
                    <li>
                      Cutoff: <strong>30%</strong> maximum rent share
                    </li>
                  </ul>

                  <div className="text-sm font-semibold text-slate-900">
                    Calculation
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Annual rent ≈ $525 × (365 ÷ 7) = <strong>$27,375</strong>
                    </li>
                    <li>
                      Annual income = $5,000 × 12 = <strong>$60,000</strong>
                    </li>
                    <li>
                      Rent share = 27,375 ÷ 60,000 × 100 ={" "}
                      <strong>45.6%</strong>
                    </li>
                  </ul>

                  <div className="text-sm font-semibold text-slate-900">
                    Result
                  </div>
                  <p className="text-slate-700 leading-7">
                    The rent share is <strong>45.6%</strong>, which exceeds the
                    30% cutoff.
                  </p>

                  <div className="text-sm font-semibold text-slate-900">
                    Meaning
                  </div>
                  <p className="text-slate-700 leading-7">
                    This changes the decision from “keep it on the shortlist” to
                    “reject it and move on.” The weekly label makes the number
                    feel smaller, but the normalized percentage shows it would
                    dominate your income.
                  </p>

                  <p className="text-slate-700 leading-7">
                    If you want the rent restated in another period for a
                    side-by-side listing comparison, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example C: “Every 4 weeks” rent (28 days) vs biweekly income
                </div>

                <div className="mt-3 space-y-3 text-slate-700">
                  <div className="text-sm font-semibold text-slate-900">
                    Situation
                  </div>
                  <p className="text-slate-700 leading-7">
                    Two rentals look close in price, but one is billed every 4
                    weeks. You need to decide which option actually produces
                    less rent pressure relative to biweekly pay.
                  </p>

                  <div className="text-sm font-semibold text-slate-900">
                    Numbers
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Option 1 rent: <strong>$2,100 every 4 weeks</strong>
                    </li>
                    <li>
                      Option 2 rent: <strong>$2,200/month</strong>
                    </li>
                    <li>
                      Income: <strong>$2,000 biweekly</strong>
                    </li>
                  </ul>

                  <div className="text-sm font-semibold text-slate-900">
                    Calculation
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Annual income (biweekly) ≈ $2,000 × (365 ÷ 14) ={" "}
                      <strong>$52,142.86</strong>
                    </li>
                    <li>
                      Annual rent (4-week) ≈ $2,100 × (365 ÷ 28) ={" "}
                      <strong>$27,375</strong>
                    </li>
                    <li>
                      Option 1 rent share = 27,375 ÷ 52,142.86 × 100 ={" "}
                      <strong>52.5%</strong>
                    </li>
                    <li>
                      Annual rent (monthly) = $2,200 × 12 ={" "}
                      <strong>$26,400</strong>
                    </li>
                    <li>
                      Option 2 rent share = 26,400 ÷ 52,142.86 × 100 ={" "}
                      <strong>50.6%</strong>
                    </li>
                  </ul>

                  <div className="text-sm font-semibold text-slate-900">
                    Result
                  </div>
                  <p className="text-slate-700 leading-7">
                    Option 2 (<strong>$2,200/month</strong>) produces a lower
                    rent share (<strong>50.6%</strong>) than Option 1 billed{" "}
                    <strong>every 4 weeks</strong> (<strong>52.5%</strong>),
                    even though the 4-week sticker price looks lower.
                  </p>

                  <div className="text-sm font-semibold text-slate-900">
                    Meaning
                  </div>
                  <p className="text-slate-700 leading-7">
                    This changes the decision from “the 4-week listing is
                    cheaper” to “the monthly listing is actually less rent
                    pressure over the year.” If you are choosing one to reduce
                    financial strain, Option 2 is the rational choice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card: steps */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  What the calculator does
                </h3>

                <ol className="mt-4 list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Validate your entries.</strong> If rent or income
                    cannot be read as a single number, or if income annualizes
                    to 0, results stay hidden so you do not act on a meaningless
                    percentage.
                  </li>
                  <li>
                    <strong>Normalize both numbers to annual totals.</strong>{" "}
                    One baseline prevents “weekly vs monthly” comparisons from
                    drifting based on the view you pick.
                  </li>
                  <li>
                    <strong>Compute rent share from the annual totals.</strong>{" "}
                    Rent % = (annual rent ÷ annual income) × 100.
                  </li>
                  <li>
                    <strong>
                      Derive the breakdown views from the same base.
                    </strong>{" "}
                    Monthly, weekly, and 4-week amounts come from the same
                    annual totals so the percentage does not change across tabs.
                  </li>
                  <li>
                    <strong>Keep rounding separate.</strong> Rounding affects
                    display only, so you are not comparing two listings where
                    one is “helped” by rounding behavior.
                  </li>
                </ol>
              </div>
            </div>

            {/* Card: validation and parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Input rules (so you do not get fake results)
                </h3>

                <p className="mt-4 text-slate-700 leading-7">
                  This section exists for one reason: preventing “0%” or other
                  clean-looking nonsense caused by a malformed entry. If the
                  input is ambiguous or not a single number, the calculator
                  suppresses results instead of guessing.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Formatting behavior
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>1,234</strong> is treated as 1234 (comma as
                      thousands grouping)
                    </li>
                    <li>
                      <strong>1.234</strong> is treated as 1.234 (decimal point)
                    </li>
                    <li>
                      Edge formats like <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                    <li>
                      Currency symbols are allowed, but the value still must
                      resolve to one number
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    If a value could reasonably be read more than one way, the
                    page surfaces an error or warning rather than choosing for
                    you.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: annual basis + periods */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Why everything goes through annual totals
                </h3>

                <p className="mt-4 text-slate-700 leading-7">
                  The decision you are making is “what share of my income will
                  rent consume?” That question only has one reliable answer when
                  rent and income are on different cycles: express both on a
                  shared time basis first, then compute the ratio.
                </p>

                <p className="mt-3 text-slate-700 leading-7">
                  Annual totals work well because they make “monthly” and “every
                  4 weeks” correctly different. Those two labels are close, but
                  they are not the same length of time, and the difference shows
                  up over a year.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Assumptions used
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Hourly conversions assume 24 hours per day</li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700 leading-7">
                  This is why “monthly” and “every 4 weeks” are kept distinct.
                  They are close, but not the same time length.
                </p>
              </div>
            </div>

            {/* Conditional block, styled */}
            {has ? (
              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700">
                    <div className="font-semibold text-sky-800">
                      Payment counts per year implied by your selections
                    </div>
                    <div className="mt-2 text-slate-600">
                      Rent period: <strong>{PERIOD_LABEL[rentPeriod]}</strong>{" "}
                      (about{" "}
                      <strong>
                        {fmtMoney(computed.paymentsPerYearRent, 2)}
                      </strong>{" "}
                      occurrences per year)
                    </div>
                    <div className="mt-1 text-slate-600">
                      Income period:{" "}
                      <strong>{PERIOD_LABEL[incomePeriod]}</strong> (about{" "}
                      <strong>
                        {fmtMoney(computed.paymentsPerYearIncome, 2)}
                      </strong>{" "}
                      occurrences per year)
                    </div>
                  </div>

                  <p className="mt-4 text-slate-600 leading-7">
                    These counts are shown for clarity. They are not used as
                    shortcuts to compute the percentage. The percentage comes
                    from annual totals derived from the time-length assumptions
                    above.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
