import { Link } from "react-router";

const HowItWorks = () => {
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
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How this rent affordability target calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page turns your income into a single yearly baseline,
                  then shows what rent looks like at 25%, 30%, and 35% of that
                  income, expressed in the billing cycles you actually see on
                  listings.
                </p>
                <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                  The decision it supports is simple: when you see a rent price
                  (weekly, monthly, or otherwise), you can check whether it
                  lands inside the target you want to live by before you waste
                  time on inspections or applications.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Consistent time model
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Targets: 25% / 30% / 35%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Income + period
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  Use the same pay basis you budget with (gross or take-home).
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Convert to daily
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  One time unit prevents “monthly vs weekly” drift.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ANNUALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily × 365
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  A fixed year makes outputs comparable across cycles.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Targets + cycles
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  Read results in the same cycle as the listing or your pay.
                </p>
              </div>
            </div>
          </div>

          {/* SectionCard: related tools */}
          <div className="group relative my-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Related tools
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-slate-700 leading-7">
                  Use these when your next decision is not “what rent target
                  fits my income,” but a different budgeting question you need
                  to answer to move forward.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when two listings are priced in different cycles
                        and you want a clean apples-to-apples comparison.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when you already know the rent and want to see
                        the percentage it consumes.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Useful when you want a single “max rent” number instead
                        of multiple target levels.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-split-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent split calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when the decision depends on how rent is shared
                        between roommates.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-per-paycheck-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent per paycheck calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you budget per pay cycle and want rent
                        expressed as a paycheck line item.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-due-date-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent due date calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Helps when timing is the problem: due date vs pay date,
                        first month pro-rating, or cash-flow gaps.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-after-tax-income-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent after tax income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when your budgeting rule is based on take-home
                        pay, not gross.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-vs-take-home-pay-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent vs take-home pay calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you want to see whether rent is crowding out
                        the money you actually keep.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700">
                  If you’re also comparing rent cycles directly, these help:{" "}
                  <Link
                    to="/weekly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to annual rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to annual rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/annual-to-monthly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    annual to monthly rent converter →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* SectionCard: examples (own section) */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Examples
              </h3>

              <div className="mt-5 space-y-5">
                <p className="text-slate-700 leading-7">
                  Each example ends in a specific decision. Use the target level
                  that matches how conservative you want your rent budget to be,
                  then judge listings in the listing’s billing cycle.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 sm:p-6">
                  <ul className="space-y-6">
                    <li className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4 sm:p-5">
                      <div className="space-y-3">
                        <div className="text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You get paid weekly and you’re deciding whether a
                          weekly listing fits your 30% target.
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Numbers
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Income ={" "}
                              <span className="font-semibold text-slate-900">
                                $1,200/week
                              </span>
                              <br />
                              Listing ={" "}
                              <span className="font-semibold text-slate-900">
                                $400/week
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Calculation
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Target rent = 30% × $1,200/week ={" "}
                              <span className="font-semibold text-slate-900">
                                $360/week
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Result
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Listing ($400/week) is{" "}
                              <span className="font-semibold text-slate-900">
                                $40/week over
                              </span>{" "}
                              your 30% target.
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-sky-50 ring-1 ring-sky-200/60 p-3 text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          You treat this listing as a “stretch” and only proceed
                          if you’re comfortable budgeting closer to the 35% line
                          (or cutting other costs), otherwise you skip it.
                        </div>
                      </div>
                    </li>

                    <li className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4 sm:p-5">
                      <div className="space-y-3">
                        <div className="text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You’re paid monthly and want a hard pass/fail screen
                          on a monthly listing using the conservative 25%
                          target.
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Numbers
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Income ={" "}
                              <span className="font-semibold text-slate-900">
                                $3,000/month
                              </span>
                              <br />
                              Listing ={" "}
                              <span className="font-semibold text-slate-900">
                                $850/month
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Calculation
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Target rent = 25% × $3,000/month ={" "}
                              <span className="font-semibold text-slate-900">
                                $750/month
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Result
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Listing ($850/month) is{" "}
                              <span className="font-semibold text-slate-900">
                                $100/month over
                              </span>{" "}
                              the 25% target.
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-sky-50 ring-1 ring-sky-200/60 p-3 text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If 25% is your non-negotiable cap, this is a reject.
                          If you still like the place, you move the decision to
                          “what needs to change” (income, roommates, location)
                          rather than pretending it fits.
                        </div>
                      </div>
                    </li>

                    <li className="rounded-xl bg-white ring-1 ring-slate-200/70 p-4 sm:p-5">
                      <div className="space-y-3">
                        <div className="text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Two listings look close, but one is weekly and one is
                          monthly. You need a fair comparison before choosing
                          which to inspect first.
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Numbers
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Listing A ={" "}
                              <span className="font-semibold text-slate-900">
                                $2,250/month
                              </span>
                              <br />
                              Listing B ={" "}
                              <span className="font-semibold text-slate-900">
                                $520/week
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3 sm:col-span-2">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Calculation
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              Convert both into the same cycle using the{" "}
                              <Link
                                to="/rent-converter"
                                className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                              >
                                universal rent converter →
                              </Link>
                              .
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Result
                            </div>
                            <div className="mt-1 text-slate-700 leading-7">
                              You end up with a single comparable monthly (or
                              annual) number for each listing, instead of
                              guessing based on the sticker price.
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-sky-50 ring-1 ring-sky-200/60 p-3 text-slate-700 leading-7">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          You pick the genuinely cheaper option to prioritize,
                          or you justify paying more only if the extra cost is
                          worth the features you care about.
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700 leading-7">
                  If you want the rent target expressed per paycheck, use{" "}
                  <Link
                    to="/rent-per-paycheck-calculator"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent per paycheck calculator →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: inputs */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Add your income and choose the pay period
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter the income figure you actually plan with, then pick
                    the period that figure belongs to (hourly, daily, weekly,
                    biweekly, every 4 weeks, monthly, or annual). The output is
                    only as good as the input basis you choose.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What to enter (so the target matches your real budget)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Use{" "}
                        <span className="font-semibold text-slate-900">
                          take-home pay
                        </span>{" "}
                        if your rent decision is constrained by what hits your
                        bank account.
                      </li>
                      <li>
                        Use{" "}
                        <span className="font-semibold text-slate-900">
                          gross pay
                        </span>{" "}
                        if you’re comparing jobs or planning before taxes are
                        known.
                      </li>
                      <li>
                        If your income varies, enter a{" "}
                        <span className="font-semibold text-slate-900">
                          conservative average
                        </span>{" "}
                        so your “pass” decisions stay safe.
                      </li>
                    </ul>
                  </div>

                  <p>
                    The calculator does not “correct” your income or assume what
                    it includes. That is intentional: your rent target should
                    reflect your budgeting reality, not a generic default.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input rules (so the number stays honest)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Commas are treated as thousands separators:{" "}
                        <span className="font-semibold text-slate-900">
                          1,234
                        </span>{" "}
                        → 1234
                      </li>
                      <li>
                        Decimals are supported and preserved (up to 12 places):{" "}
                        <span className="font-semibold text-slate-900">
                          3000.50
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">.5</span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                      <li>
                        If an input format could plausibly mean two different
                        numbers, the page warns instead of guessing.
                      </li>
                    </ul>
                  </div>

                  <p>
                    If you mainly want to convert a known rent amount between
                    billing cycles, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: annualization */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert everything to one yearly income number
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This step exists to stop silent model changes. The
                    calculator converts your chosen pay period into a daily
                    figure, then annualizes it using a fixed 365-day year so
                    every target is based on the same underlying timeline.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Annualization model
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual income
                      </span>{" "}
                      = daily income × 365
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      “Daily income” is derived from the period you chose
                      (weekly ÷ 7, biweekly ÷ 14, hourly × 24, and so on).
                    </p>
                  </div>

                  <p>
                    Why it matters: if two tools use different assumptions
                    (calendar months, pay cycles, or “4 weeks as a month”), they
                    can give different answers for the same input. This page
                    keeps the baseline fixed so your decisions do not shift when
                    you change a dropdown.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: targets */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 3: See your rent budget at common targets
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    These targets are decision thresholds. Pick the one that
                    matches how tight you want rent to be relative to the rest
                    of your budget, then use it to screen listings quickly.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      How to choose a target (practical, not moral)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Choose{" "}
                        <span className="font-semibold text-slate-900">
                          25%
                        </span>{" "}
                        if stability matters more than space, location, or
                        amenities.
                      </li>
                      <li>
                        Choose{" "}
                        <span className="font-semibold text-slate-900">
                          30%
                        </span>{" "}
                        if you want a strong default benchmark for comparing
                        listings.
                      </li>
                      <li>
                        Treat{" "}
                        <span className="font-semibold text-slate-900">
                          35%
                        </span>{" "}
                        as a stress test, especially if you have other fixed
                        monthly obligations.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        25%
                      </div>
                      <p className="mt-2 text-slate-700">
                        Tight screening threshold: fewer listings pass, but the
                        ones that do usually leave room for bills and savings.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        30%
                      </div>
                      <p className="mt-2 text-slate-700">
                        Practical benchmark: good for comparing neighborhoods
                        without overthinking the math.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        35%
                      </div>
                      <p className="mt-2 text-slate-700">
                        Stretch line: useful when you need to know how far
                        you’re pushing your budget.
                      </p>
                    </div>
                  </div>

                  <p>
                    If you have large fixed costs (debt payments, childcare,
                    medical expenses, long commutes), using the lower target as
                    your default “pass” line reduces the chance of a budget that
                    works only on paper.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: cycles */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 4: Convert targets into the cycles you use
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The outputs are shown in common rent cycles so you can apply
                    the target immediately to listings. That matters most when
                    your pay period and the listing cycle do not match.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      How to use the converted targets
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Compare a{" "}
                        <span className="font-semibold text-slate-900">
                          monthly listing
                        </span>{" "}
                        to the monthly target, not the weekly target.
                      </li>
                      <li>
                        When a listing uses{" "}
                        <span className="font-semibold text-slate-900">
                          weekly rent
                        </span>
                        , judge it using the weekly target to avoid mental math.
                      </li>
                      <li>
                        If a landlord quotes “every 4 weeks,” use that specific
                        line, because it is{" "}
                        <span className="font-semibold text-slate-900">
                          not the same as monthly
                        </span>
                        .
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Assumptions used (kept consistent everywhere)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Month = 365 ÷ 12 days (average month)</li>
                      <li>Week = 7 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours/day</li>
                    </ul>
                  </div>

                  <p>
                    For pure cycle conversions, use a dedicated converter like{" "}
                    <Link
                      to="/monthly-to-weekly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      monthly to weekly rent converter →
                    </Link>{" "}
                    or{" "}
                    <Link
                      to="/weekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to monthly rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
