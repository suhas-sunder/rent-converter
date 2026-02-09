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
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How this rent affordability target calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page takes your income and pay period, annualizes it
                  using one consistent time-length model, then applies common
                  rent-share targets so you can see a rent budget in multiple
                  familiar cycles. It avoids guessing what your income includes
                  and avoids producing “clean” results from ambiguous inputs.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Annualized via daily
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
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Convert to daily
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ANNUALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Targets + cycles
                </div>
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
                  Step 1: Enter income and choose the pay period
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Start with the income figure you want to use for rent
                    planning, then select the period that number belongs to
                    (hourly, daily, weekly, biweekly, 4-week, monthly, or
                    annual). The calculator treats your input as the
                    source-of-truth for the chosen period. It does not adjust
                    for taxes, overtime, bonuses, tips, deductions, benefits, or
                    household size.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input parsing rules
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
                        If a format could reasonably mean two different numbers,
                        the correct outcome is a warning or an error instead of
                        a guessed result
                      </li>
                    </ul>
                  </div>

                  <p>
                    If you want this page to reflect a specific definition of
                    income, use the number that matches your definition. The
                    tool is deliberately conservative about assumptions so the
                    outputs remain interpretable.
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
                  Step 2: Annualize income using a single daily basis
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The calculator converts your selected pay period into a
                    daily equivalent first, then scales that daily number to an
                    annual total using a fixed 365-day year. This keeps the
                    annual number consistent even when you switch the input
                    period. It also prevents the page from mixing “payment
                    counts” with time-length.
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
                      (weekly ÷ 7, biweekly ÷ 14, hourly × 24, etc.).
                    </p>
                  </div>

                  <p>
                    This design matters because it makes the rest of the page
                    mechanical. Once the annual basis exists, the targets and
                    the output cycles can be generated without changing
                    assumptions.
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
                  Step 3: Apply rent-share targets to the annualized income
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The page then applies a set of commonly used rent-share
                    percentages to the annual income figure. Each percentage
                    produces a target rent budget expressed as an annual amount.
                    Showing several targets is the point. It lets you see how
                    sensitive the rent number is to the assumed share, without
                    forcing one “correct” threshold.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        25%
                      </div>
                      <p className="mt-2 text-slate-700">
                        A conservative target for tighter budgets.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        30%
                      </div>
                      <p className="mt-2 text-slate-700">
                        A common benchmark for comparisons.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        35%
                      </div>
                      <p className="mt-2 text-slate-700">
                        A higher target to stress-test fit.
                      </p>
                    </div>
                  </div>

                  <p>
                    The tool does not decide which target is appropriate. It
                    calculates each one from the same annual basis so you can
                    read them as “if rent were X% of income, here is what that
                    implies.”
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: back to cycles + assumptions card */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 4: Convert targets back into familiar pay and billing
                  cycles
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    After the target rent budgets are created on an annual
                    basis, the page converts them into monthly, weekly, and
                    other cycles using the same time-length assumptions used to
                    annualize income. Monthly is computed as annual ÷ 12. Weekly
                    uses 7-day weeks. Every 4 weeks uses 28 days. The point is
                    consistency: every output can be traced back to the same
                    annual target.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Assumptions used
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
                    If you are comparing listings billed on different cycles,
                    these outputs are designed to be comparable. They are not a
                    schedule simulator. They are equivalents derived from one
                    model so you can align numbers before making a decision.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: printing + related */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Printing and related pages
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is marked no-print
                    so it won’t appear in saved copies.
                  </p>

                  <p className="text-slate-700">
                    Related pages:{" "}
                    <Link
                      to="/rent-as-percentage-of-income-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent as percentage of income →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/rent-after-tax-income-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent after tax income →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/rent-vs-take-home-pay-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent vs take-home pay →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Dark utility callout */}
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                  Targets are math, not policy
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page converts your income into an annual basis, applies
                  percentage targets, and converts those targets back into
                  familiar cycles. It does not decide what’s “affordable,” and
                  it does not assume what your income includes. If you want the
                  page to reflect a different definition, change the input so
                  the math stays honest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
