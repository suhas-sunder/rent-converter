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
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight text-center">
            How to calculate rent as a percentage of income
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            This page calculates rent as a percentage of income, even when rent
            and income are expressed on different schedules. You enter a rent
            amount, an income amount, and the period each one applies to. The
            calculator converts both numbers into annual totals using explicit
            day-count assumptions, computes the rent share from those annual
            totals, then derives monthly, weekly, and 4-week views from the same
            annual basis. The point is consistency, so the percentage does not
            change just because you switch the view.
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
                    <strong>Validate your entries.</strong> If rent or income is
                    invalid, ambiguous, or income annualizes to 0, results stay
                    hidden instead of showing a misleading value.
                  </li>
                  <li>
                    <strong>Convert both to annual totals.</strong> This creates
                    one shared baseline before any comparisons are made.
                  </li>
                  <li>
                    <strong>Compute rent share from annual totals.</strong>{" "}
                    Rent % = (annual rent ÷ annual income) × 100.
                  </li>
                  <li>
                    <strong>Derive period views from the same annual basis.</strong>{" "}
                    Monthly, weekly, and 4-week views are generated from the
                    same annual totals so the percentage is stable.
                  </li>
                  <li>
                    <strong>Keep rounding separate.</strong> If rounding is
                    enabled, it affects display only, not the underlying math.
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

                <p className="mt-4">
                  The calculator accepts currency symbols, commas, and decimals.
                  If an input cannot be interpreted as a single number, results
                  are suppressed. That avoids the classic failure where a bad
                  entry quietly becomes 0 and produces a “0% rent share” that
                  looks legitimate.
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

                <p className="mt-4">
                  Rent and income are often on different cycles (weekly rent,
                  monthly income; biweekly income, monthly rent). Comparing them
                  directly is unreliable unless both are expressed on one shared
                  basis. This page uses annual totals as that shared basis,
                  derived from explicit time lengths.
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

                <p className="mt-4">
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
                      <strong>{fmtMoney(computed.paymentsPerYearRent, 2)}</strong>{" "}
                      occurrences per year)
                    </div>
                    <div className="mt-1 text-slate-600">
                      Income period:{" "}
                      <strong>{PERIOD_LABEL[incomePeriod]}</strong> (about{" "}
                      <strong>{fmtMoney(computed.paymentsPerYearIncome, 2)}</strong>{" "}
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

                <p className="mt-4">
                  Here are examples that match what people actually do with this
                  tool. If you have results on screen, the first block uses your
                  current numbers.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example A: Your current inputs (when results are available)
                  </div>

                  {has ? (
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Rent period: <strong>{PERIOD_LABEL[rentPeriod]}</strong>{" "}
                        and income period:{" "}
                        <strong>{PERIOD_LABEL[incomePeriod]}</strong>
                      </li>
                      <li>
                        Annual rent (derived):{" "}
                        <strong>${fmtMoney(computed.annualRent, 2)}</strong>
                      </li>
                      <li>
                        Annual income (derived):{" "}
                        <strong>${fmtMoney(computed.annualIncome, 2)}</strong>
                      </li>
                      <li>
                        Rent share:{" "}
                        <strong>{fmtPct(computed.rentSharePct, 1)}%</strong>
                      </li>
                      <li>
                        Monthly view (derived): rent{" "}
                        <strong>${fmtMoney(computed.monthlyRent, 2)}</strong>{" "}
                        vs income{" "}
                        <strong>${fmtMoney(computed.monthlyIncome, 2)}</strong>
                      </li>
                      <li>
                        4-week view (derived): rent{" "}
                        <strong>${fmtMoney(computed.fourWeekRent, 2)}</strong>{" "}
                        vs income{" "}
                        <strong>${fmtMoney(computed.fourWeekIncome, 2)}</strong>
                      </li>
                    </ul>
                  ) : (
                    <p className="mt-3 text-slate-700">
                      Enter rent and income above to populate this block with
                      your own annual totals and rent share.
                    </p>
                  )}
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example B: Weekly rent vs monthly income
                  </div>
                  <p className="mt-3 text-slate-700">
                    Suppose rent is <strong>$525/week</strong> and income is{" "}
                    <strong>$5,000/month</strong>. This page annualizes both
                    (weekly through a 365-day year and monthly through × 12),
                    then computes rent share from the annual totals, and finally
                    shows the weekly, monthly, and 4-week equivalents from that
                    same annual basis.
                  </p>
                  <p className="mt-3 text-slate-700">
                    If you want to convert the rent label first (for example,
                    weekly to monthly) before comparing, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter
                    </Link>
                    .
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example C: “Every 4 weeks” rent (28 days) vs biweekly income
                  </div>
                  <p className="mt-3 text-slate-700">
                    Suppose rent is <strong>$2,100 every 4 weeks</strong> and
                    income is <strong>$2,000 biweekly</strong>. “Every 4 weeks”
                    is always 28 days, and biweekly is always 14 days. The page
                    converts both to annual totals via day counts, then
                    calculates rent share. This is exactly the situation where
                    shortcuts like “monthly ÷ 4” cause confusion.
                  </p>
                </div>
              </div>
            </div>

            {/* Related tools (required) */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
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
                      Convert between weekly, monthly, biweekly, every 4 weeks,
                      daily, hourly, and annual.
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford →
                      </Link>{" "}
                      Turn income into an affordability range.
                    </li>
                    <li>
                      <Link
                        to="/rent-after-tax-income-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent after tax income →
                      </Link>{" "}
                      Estimate take-home pay and compare rent against it.
                    </li>
                    <li>
                      <Link
                        to="/rent-vs-take-home-pay-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent vs take-home pay →
                      </Link>{" "}
                      Another view of rent pressure against net pay.
                    </li>
                    <li>
                      <Link
                        to="/rent-paid-every-4-weeks-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent paid every 4 weeks →
                      </Link>{" "}
                      Useful when your listing is billed in 28-day cycles.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card: rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Rounding and precision
                </h3>

                <p className="mt-4">
                  Internally, values are computed with decimal-safe arithmetic
                  up to 12 decimal places. If rounding is enabled, it is applied
                  only to the displayed outputs. This keeps the percentage and
                  annual totals stable.
                </p>
              </div>
            </div>

            {/* Dark callout */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
              </div>

              <div className="relative">
                <div className="text-sm font-semibold text-sky-300">
                  Utility note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-300">
                  The percentage stays the same across views because the annual
                  basis stays the same
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Rent share is computed from annual totals derived from explicit
                  day-count assumptions. The monthly, weekly, and 4-week views
                  are just different ways of expressing the same underlying
                  annual numbers.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                affordability calculator
              </Link>
              ,{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent paid every 4 weeks
              </Link>
              ,{" "}
              <Link
                to="/weekly-to-monthly-rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                weekly to monthly converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
