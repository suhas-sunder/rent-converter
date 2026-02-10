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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this rent per day calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            You enter rent as it is advertised (amount + period). This page
            converts it into a <strong>daily equivalent</strong> so you can make
            day-based decisions without guessing, especially when listings use
            different billing periods.
          </p>

          <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-600 leading-7">
            <li>
              Use <strong>$/day</strong> when you have a fixed stay length (for
              example: 10, 30, 45, or 90 days) and need a clean budget check.
            </li>
            <li>
              Use <strong>$/day</strong> when comparing “monthly” vs “every 4
              weeks” vs “weekly” so the cheaper option is obvious without mental
              math.
            </li>
            <li>
              Treat the daily number as a <strong>comparison baseline</strong>.
              It is designed to rank options fairly, not to predict your exact
              invoice.
            </li>
          </ul>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Amount + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual total
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CONVERT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Daily equivalent
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                EXTRA
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Days total box
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>
            {/* Related tools (kept) */}
            <p className="text-slate-700 leading-relaxed">
              <ul>
                <li className="mb-2 list-disc ml-5">
                  <Link
                    to="/rent-converter"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent converter
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for when you want the full set of equivalents (daily,
                    weekly, 28-day, monthly average, annual) from one input, not
                    just the daily baseline
                  </span>
                </li>

                <li className="mb-2 list-disc ml-5">
                  <Link
                    to="/monthly-to-daily-rent-converter"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Monthly to daily
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for when the listing is clearly monthly and you only need
                    the $/day number for a stay-length budget check
                  </span>
                </li>

                <li className="mb-2 list-disc ml-5">
                  <Link
                    to="/rent-paid-every-4-weeks-calculator"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent paid every 4 weeks
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for when a 28-day cycle is being marketed as “monthly” and
                    you need a fair apples-to-apples comparison before choosing
                    a lease option
                  </span>
                  .
                </li>
              </ul>
            </p>
          </div>

          {/* Examples section (separate) */}
          <div className="mb-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Each example ends with a decision that changes. Calculations
                keep decimals so close calls do not get “rounded into” the wrong
                choice.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                {/* Example A: Monthly */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: $2,400 monthly
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You have a 30-day placement
                      and a short-stay option advertised at $79/day. You need to
                      know if the “$2,400/month” lease is actually under that
                      daily baseline.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,400/month (CAD), with month
                      treated as an average month (365 ÷ 12 days).
                    </li>
                    <li>
                      <strong>Calculation:</strong> Annual ={" "}
                      <strong>$28,800</strong> (2400 × 12). Daily ={" "}
                      <strong>$78.904110</strong> (28,800 ÷ 365).
                    </li>
                    <li>
                      <strong>Result:</strong> Daily equivalent is{" "}
                      <strong>$78.90/day</strong> (rounded for display).
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> The $79/day option is not
                      automatically “more expensive.” At this baseline, they are
                      effectively tied on rent. Your decision shifts to fees,
                      utilities, and cancellation rules instead of assuming the
                      monthly listing wins on price.
                    </li>
                  </ul>
                </div>

                {/* Example B: Every 4 weeks */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 2: $2,000 every 4 weeks (28 days)
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> Two ads both show “$2,000,”
                      but one is billed every 4 weeks and the other is monthly.
                      You want the fair comparison unit before ranking them.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,000 per 28 days (CAD).
                    </li>
                    <li>
                      <strong>Calculation:</strong> Daily ={" "}
                      <strong>$71.428571</strong> (2000 ÷ 28). Annual ={" "}
                      <strong>$26,071.428571</strong> (daily × 365).
                    </li>
                    <li>
                      <strong>Result:</strong> Daily equivalent is{" "}
                      <strong>$71.43/day</strong> (rounded for display).
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> If the “$2,000 monthly” listing
                      is otherwise similar, it becomes the more expensive option
                      per day. Your shortlist changes: the 28-day listing should
                      be prioritized because it is cheaper on the unit that
                      matters for comparing value.
                    </li>
                  </ul>
                </div>

                {/* Example C: Weekly + days-total */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 3: $700 weekly, plus a 45-day total
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You are booking a 45-day stay
                      and your rent-only limit is $4,200. You need a fast accept
                      vs reject check.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $700/week (CAD) for 45 days.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Daily ={" "}
                      <strong>$100.000000</strong> (700 ÷ 7). Annual ={" "}
                      <strong>$36,500</strong> (100 × 365). Total for 45 days ={" "}
                      <strong>$4,500</strong> (100 × 45).
                    </li>
                    <li>
                      <strong>Result:</strong> 45-day total is{" "}
                      <strong>$4,500</strong>.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> This is a reject on rent alone
                      because it exceeds the cap by $300. The only way it
                      becomes viable is a lower weekly rate, a shorter stay, or
                      a negotiated discount tied to the 45-day length.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are doing
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      They convert different listing styles into one comparison
                      unit: <strong>cost per day</strong>.
                    </li>
                    <li>
                      They surface pricing gaps that headline numbers hide,
                      especially between <strong>monthly</strong> and{" "}
                      <strong>28-day</strong> billing.
                    </li>
                    <li>
                      They end with a specific next action: reprioritize,
                      negotiate, or reject based on a budget constraint.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) The daily value is derived from an annual basis
                </h3>

                <p className="mt-4">
                  The daily number is built to keep comparisons consistent when
                  listings use different periods. One rule is applied to every
                  input:
                  <strong>
                    {" "}
                    convert your period into a single annual total, then divide
                    by 365 to get the daily equivalent
                  </strong>
                  . That means the daily value stays aligned with any other
                  equivalent shown elsewhere on the site because they all share
                  the same annual base.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    When this matters in real choices
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Ranking two listings:</strong> daily makes
                      “weekly” and “monthly” directly comparable, so you do not
                      overpay because of a misleading period label.
                    </li>
                    <li>
                      <strong>Checking a short-stay cost:</strong> multiply the
                      daily number by your stay length to see if you are over or
                      under a hard cap.
                    </li>
                    <li>
                      <strong>Spotting a disguised premium:</strong> a “monthly”
                      headline price can look fine until it is normalized into
                      $/day beside a 28-day cycle.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  Use the daily equivalent as the baseline you trust. Scale from
                  it only after you have confirmed the input period matches the
                  listing’s wording.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  2) Period definitions used on this page
                </h3>

                <p className="mt-4">
                  Period labels here are treated as time lengths so the
                  comparison stays stable. This is important because rental ads
                  often blur “monthly” and “every 4 weeks,” even though they are
                  not the same cost over a year.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
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

                <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Common user mistakes this prevents
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Selecting <strong>monthly</strong> when the listing is
                      actually <strong>every 4 weeks</strong>, which can make a
                      worse deal look “equivalent.”
                    </li>
                    <li>
                      Using a shortcut like “monthly ÷ 30,” which changes the
                      implied annual cost and can flip a close decision.
                    </li>
                    <li>
                      Mixing a calendar billing schedule with a fixed-day cycle
                      without noticing, then budgeting the wrong total for a
                      defined stay length.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  3) What the “total for a chosen number of days” box does
                </h3>

                <p className="mt-4">
                  This box turns the daily equivalent into a decision-ready
                  total for a specific stay length. You enter a day count, and
                  it returns a single number you can compare against a cap, a
                  reimbursement limit, or another quote for the same window.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Estimator behavior
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Base = the <strong>computed daily equivalent</strong> from
                      this page.
                    </li>
                    <li>
                      Total = daily × your day count (no extra assumptions are
                      added).
                    </li>
                    <li>
                      Best for: “Is this under my limit for N days?” decisions,
                      not lease billing details.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  Treat the result as a planning total. If a lease or host uses
                  special proration rules, minimum charges, or additional fees,
                  your billed total can differ even if the daily comparison is
                  still the right way to rank options.
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  This is an equivalence calculator, not a billing simulator
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The outputs are comparison values derived from explicit time
                  assumptions. Use them to rank listings fairly, sanity-check
                  the implied annual cost behind a headline price, and estimate
                  a rent-only total for a defined number of days. They do not
                  model lease-specific proration methods, due-date rules,
                  partial periods, deposits, utilities, or fees.
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
