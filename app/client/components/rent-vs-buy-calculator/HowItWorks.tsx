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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Rent vs buy calculator model and outputs
                </h2>
                <div className="mt-2 space-y-3 text-slate-600 leading-7 max-w-2xl">
                  <p>
                    This page exists to answer one decision: over your chosen
                    time horizon, is renting cheaper than buying under the same
                    set of assumptions.
                  </p>
                  <p>
                    Renting is treated as a cash outflow that can step up once
                    per year. Buying is modeled as upfront + ongoing cash
                    outflows, with the mortgage balance tracked over time, then
                    an estimated sale result at the end of the horizon.
                  </p>
                  <p>
                    The output is only as good as the assumptions, so the model
                    is built to show what is driving the gap rather than hiding
                    it behind a single number.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Horizon based
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Assumption driven
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent, home price, rates
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RENT SIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Cash paid over time
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BUY SIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Costs + balance tracking
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Totals + year table
                </div>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>
            <ul className="space-y-2 text-slate-700 leading-relaxed">
              <li>
                <Link
                  to="/rent-affordability-calculator"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent affordability calculator
                </Link>{" "}
                <span className="text-slate-700">
                  helps validate whether a target monthly rent fits your income
                  and fixed obligations before you treat renting as the baseline
                  option.
                </span>
              </li>
              <li>
                <Link
                  to="/rent-converter"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent converter
                </Link>
                <span className="text-slate-700">
                  {" "}
                  is useful when a listing is quoted weekly, biweekly, or
                  annually and you need a clean monthly figure before you
                  compare it to a mortgage payment.
                </span>
              </li>
            </ul>
          </div>

          {/* Examples section (separate) */}
          <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Each example shows a different decision outcome the model can
                surface. Numbers are simplified so the decision driver is
                obvious.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: Short horizon where transaction costs dominate
                  </div>
                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> You may move again in ~3 years
                      and you are choosing flexibility vs ownership.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Numbers:</strong> Horizon 3 years. Rent
                        $2,500/mo (0% increases). Buy a $650,000 home with 10%
                        down, 5.5% rate, 25-year term. Upfront closing costs
                        $18,000. Selling costs 5% of sale price. Appreciation
                        2%/yr. Ongoing owner costs
                        (tax/insurance/maintenance/HOA) $850/mo.
                      </li>
                      <li>
                        <strong>Calculation:</strong> Rent paid = $2,500 × 36 =
                        $90,000. Buy-side cost ≈ (mortgage + owner costs +
                        upfront) − (net sale proceeds), where net sale proceeds
                        = (modeled value − selling costs − remaining balance).
                      </li>
                      <li>
                        <strong>Result:</strong> The buy-side net cost can come
                        out higher than rent over 3 years because closing + 5%
                        selling costs overwhelm the limited principal paydown
                        and modest appreciation.
                      </li>
                      <li className="text-slate-600">
                        <strong>Meaning:</strong> If you are not confident you
                        will stay at least a few years longer, renting is the
                        safer choice because the one-time buy/sell costs are the
                        main risk in this window.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 2: A listing looks affordable monthly, but breaks
                    the long-run budget after rent growth
                  </div>
                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> You can afford today’s rent,
                      but you are trying to avoid being forced to move later if
                      rent rises.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Numbers:</strong> Horizon 10 years. Starting
                        rent $2,200/mo with 4% annual increases. Your personal
                        “comfort cap” for year-10 rent is $3,000/mo.
                      </li>
                      <li>
                        <strong>Calculation:</strong> Year-10 monthly rent ≈
                        $2,200 × (1.04)⁹ ≈ $3,129/mo (steps once per year in the
                        model).
                      </li>
                      <li>
                        <strong>Result:</strong> The rent path crosses the
                        $3,000/mo cap before the end of the horizon, and the
                        cumulative rent paid accelerates because each annual
                        step-up compounds the base.
                      </li>
                      <li className="text-slate-600">
                        <strong>Meaning:</strong> This rental is a “likely move
                        later” scenario. If the cap matters to you, the decision
                        changes from “acceptable” to “reject or pick a cheaper
                        starting rent,” even if the first year feels fine.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 3: Buying looks expensive monthly, but the sale
                    estimate flips the decision
                  </div>
                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> Two options feel close month
                      to month, so you need to know which side wins over a
                      longer hold.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Numbers:</strong> Horizon 15 years. Rent
                        $2,650/mo with 2% annual increases. Buy a $750,000 home
                        with 20% down, 5.0% rate, 25-year term. Owner costs
                        $950/mo. Selling costs 5%. Appreciation 3%/yr.
                      </li>
                      <li>
                        <strong>Calculation:</strong> Buy-side net cost =
                        (upfront + total owner cash outflow over 15 years) −
                        (modeled value at year 15 − selling costs − remaining
                        balance).
                      </li>
                      <li>
                        <strong>Result:</strong> Even if buy-side cash outflow
                        is higher along the way, the modeled sale proceeds can
                        offset a large portion of those costs by year 15, making
                        the buy-side net cost lower than total rent paid.
                      </li>
                      <li className="text-slate-600">
                        <strong>Meaning:</strong> If you expect to hold for the
                        full horizon, the decision can shift from “rent because
                        the monthly payment is lower” to “buy because the
                        end-of-horizon outcome is better under these
                        assumptions.”
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are highlighting
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Short horizons are mostly a transaction-cost question, not
                      a “monthly payment” question.
                    </li>
                    <li>
                      Rent growth is a decision driver because it can break a
                      future budget even when today’s rent fits.
                    </li>
                    <li>
                      Over longer horizons, the sale estimate (appreciation,
                      selling costs, remaining balance) can dominate the final
                      comparison.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h16M4 12h12M4 17h14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      What this calculator returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You get two modeled totals for the same time horizon:{" "}
                    <strong>total rent paid</strong> and a{" "}
                    <strong>buy-side ownership net cost</strong>.
                  </p>

                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>
                      <strong>Total rent paid:</strong> the sum of monthly rent
                      over the horizon, with any annual step-up applied once per
                      year.
                    </li>
                    <li>
                      <strong>Buy-side ownership net cost:</strong> total cash
                      outflow for ownership (upfront + ongoing costs) minus
                      estimated net sale proceeds at the end of the horizon.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Core idea
                    </div>
                    <p className="mt-2">
                      Use the totals to pick the cheaper scenario for the
                      horizon you actually expect. Use the year table to see
                      <span className="font-semibold"> why </span>
                      the totals differ.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      These outputs are scenario estimates based on your inputs,
                      not a promise about future prices, rent, or rates.
                    </p>
                  </div>

                  <p>
                    The year-by-year table is the practical output for decision
                    work. It shows when the comparison starts to favor one side,
                    and which assumptions are responsible (rent growth, owner
                    costs, loan structure, appreciation, selling costs).
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: rent side */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M5 7h14M5 17h10"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Rent side model
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The rent side is intentionally a clean baseline: start with
                    a monthly rent, optionally apply a once-per-year increase,
                    then sum what you pay over the horizon. There is no
                    end-of-horizon value credited back to you.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      How to use the rent total
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Treat it as the “cost of flexibility” benchmark for the
                        horizon you might stay.
                      </li>
                      <li>
                        Focus on rent growth if your decision hinges on whether
                        you can stay put: small annual increases compound into a
                        higher year-10 or year-15 monthly rent.
                      </li>
                      <li>
                        If you are comparing rentals quoted in different
                        periods, normalize them first (weekly vs monthly) before
                        you treat one as “cheaper.”
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-sky-900">
                        What counts on rent
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Monthly rent amount</li>
                        <li>Annual rent increase, if provided</li>
                        <li>Total paid over the horizon</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-sky-900">
                        What does not count
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Investment returns on savings</li>
                        <li>Tax deductions or credits</li>
                        <li>Move costs unless separately entered</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: buy side */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 10V7a5 5 0 0110 0v3M6 10h12l-1 11H7L6 10z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Buy side model
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The buy side builds a mortgage from your home price, down
                    payment, rate, and term. Payments are split into principal
                    and interest so the remaining balance can be tracked each
                    year rather than treated as a flat “monthly cost.”
                  </p>

                  <p>
                    Ownership costs you enter (property tax, insurance,
                    maintenance, HOA) are treated as cash expenses. These often
                    decide the outcome when two scenarios look similar on the
                    mortgage payment alone.
                  </p>

                  <p>
                    Home value is updated once per year using your appreciation
                    rate. That single assumption impacts both the year-table
                    equity line and the end-of-horizon sale estimate.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      End-of-horizon sale estimate
                    </div>
                    <div className="mt-2 space-y-2">
                      <p>
                        Net sale proceeds are computed as:
                        <span className="font-semibold">
                          {" "}
                          modeled home value − selling costs − remaining
                          mortgage balance
                        </span>
                        .
                      </p>
                      <p>
                        The buy-side net cost then compares total rent paid
                        against ownership outflow minus those net sale proceeds.
                      </p>
                      <p className="text-sm text-slate-600">
                        This estimate is the main reason the buy-side result can
                        flip with small changes to appreciation or selling cost
                        assumptions.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Common decision checks on the buy side
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        If you might sell early, scrutinize selling cost % and
                        upfront costs first.
                      </li>
                      <li>
                        If you expect to hold long-term, stress-test
                        appreciation and owner costs because they dominate later
                        years.
                      </li>
                      <li>
                        If the result is close, use the year table to see which
                        year the “cross-over” happens and whether that timing
                        matches your real plan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: table interpretation */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 19V5m0 14h16M8 15V9m4 6V7m4 8v-5"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      How to read the year-by-year table
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Use the table to explain the totals, not the other way
                    around. The rent columns show the annual and cumulative cash
                    you pay. The buy columns show annual ownership outflow,
                    remaining mortgage balance, and estimated equity from the
                    modeled home value.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      A fast way to interpret it
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Look for the cross-over year:</strong> the year
                        when the buy-side net position starts to beat the rent
                        path (or never does).
                      </li>
                      <li>
                        <strong>Check what moved:</strong> if a jump happens, it
                        is usually rent step-ups, owner costs, appreciation, or
                        selling cost assumptions showing up in the model.
                      </li>
                      <li>
                        <strong>Sanity-check the sale mechanics:</strong> late
                        horizon outcomes often hinge on remaining balance and
                        selling costs, not the mortgage payment line.
                      </li>
                    </ul>
                  </div>

                  <p>
                    Summary totals at the top are derived from these same year
                    rows. If something looks off, the table is where you can
                    pinpoint which input is responsible.
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  This is a scenario comparison, not a forecast
                </h3>
                <div className="mt-3 space-y-3 text-slate-200 leading-7">
                  <p>
                    The calculator keeps your assumptions consistent across both
                    sides so you can compare outcomes on the same horizon. It is
                    designed for decision clarity, not market prediction.
                  </p>
                  <p>
                    It does not model tax law, investment returns, refinancing,
                    variable-rate changes, or timing strategies unless the page
                    has explicit fields for those items.
                  </p>
                  <p>
                    If the result is close, treat that as a signal to
                    stress-test the few assumptions that dominate your horizon
                    (rent growth and owner costs for renting, appreciation and
                    selling costs for buying).
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
