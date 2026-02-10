import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <>
      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
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
                    How the monthly to weekly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    Use this when you need a monthly rent to behave like a true{" "}
                    <strong>7-day weekly</strong> number so you can compare it
                    directly to weekly listings or plan a weekly budget without
                    a hidden “4 weeks per month” assumption.
                  </p>
                  <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                    The conversion anchors the rent to a single annual cost.
                    Monthly is treated as an average month from a{" "}
                    <strong>365-day year</strong>, and weekly is a fixed{" "}
                    <strong>7-day</strong> period. That means the weekly result
                    reflects the same implied annual rent, not a payment-count
                    shortcut.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Month = 365 ÷ 12 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Week = 7 days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Monthly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ANNUALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Monthly × 12
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual → daily
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DERIVE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily × 7
                  </div>
                </div>
              </div>
            </div>

            {/* Related tools (required) */}
            <div className="rounded-3xl my-8 bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Related tools
                </h3>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  These help when the listing period (weekly, 4-week, biweekly,
                  annual) does not match how you budget or how other options are
                  advertised, and you need one clean basis before you decide.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Useful when you have mixed periods and want one place to
                        standardize all of them before comparing.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/weekly-to-annual-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Weekly to annual rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you want the “year cost” of a weekly listing
                        to check whether it breaks a yearly budget cap.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-annual-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to annual rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Helps when you only need the yearly total for a
                        monthly-priced place (screening affordability fast).
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-biweekly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to biweekly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Relevant if your cash flow is paycheque-based and you
                        need rent aligned to a 14-day view.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-paid-every-4-weeks-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent paid every 4 weeks calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use when an option is billed every 28 days and you need
                        to see how it stacks up against “monthly” pricing.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Fits when the question is not “which listing is cheaper”
                        but “what rent level is safe for my income.”
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you want to validate a rent choice against an
                        income ratio target after you have standardized the rent
                        amount.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  More conversions:{" "}
                  <Link
                    to="/biweekly-to-weekly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    biweekly to weekly →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/annual-to-weekly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    annual to weekly →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-daily-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to daily →
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Examples (required, own section) */}
            <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Examples
                </h3>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  Each example ends in a concrete choice (keep, reject, or rank
                  options). The point is the decision, not the arithmetic.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-6">
                    <li>
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900">
                          Weekly budget cap (accept vs reject)
                        </p>
                        <p>
                          <strong>Situation:</strong> You can spend up to{" "}
                          <strong>$600/week</strong> on rent, and you are
                          screening monthly listings.
                        </p>
                        <p>
                          <strong>Numbers:</strong> Listing is{" "}
                          <strong>$2,600/month</strong>.
                        </p>
                        <p>
                          <strong>Calculation:</strong> Annual = 2,600 × 12 =
                          31,200. Daily = 31,200 ÷ 365 ≈ 85.47945. Weekly =
                          daily × 7 ≈ 598.35616.
                        </p>
                        <p>
                          <strong>Result:</strong> ≈{" "}
                          <strong>$598.36/week</strong>.
                        </p>
                        <p>
                          <strong>Meaning:</strong> It stays under your{" "}
                          <strong>$600/week</strong> cap, so it remains in your
                          shortlist. A “monthly ÷ 4” shortcut would imply
                          $650/week and incorrectly reject it.
                        </p>
                      </div>
                    </li>

                    <li>
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900">
                          A weekly listing looks cheaper until you convert
                        </p>
                        <p>
                          <strong>Situation:</strong> You are comparing two
                          rooms and want the cheaper weekly cost.
                        </p>
                        <p>
                          <strong>Numbers:</strong> Option A is{" "}
                          <strong>$2,450/month</strong>. Option B is{" "}
                          <strong>$560/week</strong>.
                        </p>
                        <p>
                          <strong>Calculation:</strong> Convert A: Annual =
                          2,450 × 12 = 29,400. Daily = 29,400 ÷ 365 ≈ 80.54795.
                          Weekly = daily × 7 ≈ 563.83562.
                        </p>
                        <p>
                          <strong>Result:</strong> Option A ≈{" "}
                          <strong>$563.84/week</strong> vs Option B{" "}
                          <strong>$560/week</strong>.
                        </p>
                        <p>
                          <strong>Meaning:</strong> Option B is still cheaper,
                          but the gap is only about <strong>$3.84/week</strong>,
                          not a “big win.” If A is better located or includes
                          value you care about, this conversion is the
                          difference between dismissing A and treating the two
                          as effectively comparable.
                        </p>
                      </div>
                    </li>

                    <li>
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900">
                          Catching the “monthly ÷ 4” trap (mis-ranks options)
                        </p>
                        <p>
                          <strong>Situation:</strong> You are ranking two
                          monthly apartments by weekly cost because your budget
                          runs week-to-week.
                        </p>
                        <p>
                          <strong>Numbers:</strong> Apartment 1 is{" "}
                          <strong>$2,200/month</strong>. Apartment 2 is{" "}
                          <strong>$2,250/month</strong>.
                        </p>
                        <p>
                          <strong>Calculation:</strong> Apt 1 weekly = 2,200 ×
                          12 ÷ 365 × 7 ≈ 506.30137. Apt 2 weekly = 2,250 × 12 ÷
                          365 × 7 ≈ 517.80685.
                        </p>
                        <p>
                          <strong>Result:</strong> Apt 1 ≈{" "}
                          <strong>$506.30/week</strong>, Apt 2 ≈{" "}
                          <strong>$517.81/week</strong>.
                        </p>
                        <p>
                          <strong>Meaning:</strong> Apt 1 is cheaper by about{" "}
                          <strong>$11.50/week</strong>. If you used “÷ 4,” you
                          would get $550 vs $562.50 and overstate the
                          difference, which can push you into overpaying for
                          “small” weekly gaps that are not actually small.
                        </p>
                      </div>
                    </li>

                    <li>
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-900">
                          Rare rounding pitfall (short, but real)
                        </p>
                        <p>
                          <strong>Situation:</strong> Your maximum is{" "}
                          <strong>$500/week</strong>, and you only looked at a
                          rounded display.
                        </p>
                        <p>
                          <strong>Numbers:</strong> Listing is{" "}
                          <strong>$2,170/month</strong>.
                        </p>
                        <p>
                          <strong>Calculation:</strong> Weekly = 2,170 × 12 ÷
                          365 × 7 ≈ 499.39726.
                        </p>
                        <p>
                          <strong>Result:</strong> ≈{" "}
                          <strong>$499.40/week</strong> (could display as{" "}
                          <strong>$499</strong> if rounded to whole dollars).
                        </p>
                        <p>
                          <strong>Meaning:</strong> It is under the cap, but
                          only barely. If you are right on the line, use the
                          unrounded figure to decide whether you need buffer for
                          fees or other fixed costs instead of assuming the
                          rounded number is “comfortably” below your limit.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  Going the other way? Use{" "}
                  <Link
                    to="/weekly-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to monthly rent converter →
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Step 1 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 1: Enter the monthly rent amount
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Enter the rent value and select “monthly.” The goal is a
                      clean input so the weekly output is trustworthy when you
                      are making a keep-or-skip decision.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Parsing rules
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>1,234</strong> is interpreted as 1234
                        </li>
                        <li>
                          <strong>1.234</strong> is interpreted as 1.234
                        </li>
                        <li>
                          Formats like <strong>.5</strong> and{" "}
                          <strong>12.</strong> are supported
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        If an entry is invalid or ambiguous, the page warns or
                        blocks rather than producing a clean-looking weekly
                        number from bad input.
                      </p>
                    </div>

                    <p>
                      This calculator converts the rent amount only. If a
                      listing bundles utilities, parking, or fees, decide first
                      whether you are comparing <strong>base rent</strong> or{" "}
                      <strong>all-in monthly cost</strong>, then enter the
                      number that matches that decision across every option.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 2: Convert monthly into a weekly equivalent (7-day
                    basis)
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The weekly output is built from a single annual total,
                      then translated into a 7-day number. This is what makes a
                      monthly listing comparable to a weekly listing without
                      inventing a “4-weeks-per-month” month length.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>Annual</strong> = monthly × 12
                        </li>
                        <li>
                          <strong>Daily</strong> = annual ÷ 365
                        </li>
                        <li>
                          <strong>Weekly</strong> = daily × 7
                        </li>
                        <li>
                          Combined:{" "}
                          <strong>Weekly = monthly × 12 ÷ 365 × 7</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        Monthly corresponds to an average month length of 365 ÷
                        12 days. Weekly is fixed at 7 days.
                      </p>
                    </div>

                    <p>
                      Treat the weekly result as a comparison unit and a
                      budgeting unit. It is not attempting to predict billing
                      dates, lease terms, discounts, or how many payments you
                      make in practice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 3: Keep the breakdown consistent and keep rounding
                    separate
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The breakdown (hourly, daily, weekly, biweekly, 4-week,
                      monthly, annual) stays consistent because every line is
                      derived from the same annual basis. That matters when you
                      are comparing listings that mix “monthly” and “every 4
                      weeks.”
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                      <li>
                        <strong>4-week</strong> = daily × 28
                      </li>
                      <li>
                        <strong>Hourly</strong> = daily ÷ 24
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                    </ul>

                    <p>
                      Calculations preserve decimals internally (up to 12
                      places). If rounding is enabled, only the displayed values
                      are rounded. Use the unrounded weekly value when you are
                      right on a cap or comparing two options that are close.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What you can do
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Rank monthly listings by true weekly cost when your
                          budget decisions are made week-to-week
                        </li>
                        <li>
                          Compare weekly and monthly ads without drifting into
                          “28-day month” math
                        </li>
                        <li>
                          Keep 4-week billing separate so a 28-day cycle does
                          not get mislabeled as “monthly”
                        </li>
                      </ul>
                    </div>
                  </div>
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
                    Weekly comparisons work when the year is the anchor
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    Weekly is only meaningful for decisions when it is derived
                    from the same annual basis as your other periods. That is
                    what prevents “weekly,” “biweekly,” and “every 4 weeks” from
                    quietly using different month-length assumptions and giving
                    you numbers that look comparable but are not.
                  </p>
                  <p className="mt-3 text-slate-200 leading-7">
                    If two options are close, decide using the weekly figure as
                    your common unit, then sanity-check with the annual line to
                    confirm the choice does not reverse over a full year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
