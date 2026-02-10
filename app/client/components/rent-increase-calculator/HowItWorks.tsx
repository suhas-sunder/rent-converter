import { Link } from "react-router";

const HowItWorks = ({ safeHref }: { safeHref: (href: string) => string }) => {
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
            How this rent increase calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            Use this when you need to decide whether a proposed rent increase is
            acceptable, and you want the answer in the same terms you budget in.
            Enter your current rent and its period, choose percent (compounding)
            or fixed (same add-on each step), and set the number of increases.
            The tool anchors everything to one annual total so the “after” rent,
            the annual impact, and the monthly or weekly equivalents stay
            comparable. Decimals are preserved end-to-end (up to 12 places), and
            rounding is optional and display-only.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Current rent + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                MODE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Percent or fixed
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                STEPS
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                1 to 50 increases
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                New rent + impact
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Related pages
              </h3>

              <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-2">
                <li className="mb-2 list-disc ml-5">
                  <Link
                    to={safeHref("/rent-converter")}
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent converter
                  </Link>
                  <span className="text-slate-700">
                    {" "}
                    When the rent is quoted in a different period than your
                    budget (weekly vs monthly vs every 4 weeks) and you need a
                    clean conversion before judging the increase.
                  </span>
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to={safeHref("/rent-after-increase-calculator")}
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent after increase calculator
                  </Link>
                  <span className="text-slate-700">
                    {" "}
                    When you already know the increase amount and just want the
                    new rent for a single change, without multi-step projection.
                  </span>
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to={safeHref("/rent-increase-percentage-calculator")}
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent increase percentage calculator
                  </Link>
                  <span className="text-slate-700">
                    {" "}
                    When you have “before” and “after” rent and need the percent
                    increase to check what you are actually being asked to pay.
                  </span>
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to={safeHref("/how-much-rent-can-i-afford-calculator")}
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    How much rent can I afford calculator
                  </Link>
                  <span className="text-slate-700">
                    {" "}
                    When the decision is about your maximum safe rent, and you
                    want a budget-based cap to compare the post-increase number
                    against.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Everything is computed from one annual time basis
                </h3>

                <p className="mt-4">
                  Rent increases become hard to evaluate when the rent is paid
                  on a cycle that is not a calendar month. This tool converts
                  your input into an annual amount first, using explicit
                  day-count assumptions:
                  <span className="font-semibold"> year = 365 days</span>,
                  <span className="font-semibold"> week = 7 days</span>,
                  <span className="font-semibold"> biweekly = 14 days</span>,
                  <span className="font-semibold">
                    {" "}
                    every 4 weeks = 28 days
                  </span>
                  , and
                  <span className="font-semibold">
                    {" "}
                    month = 365 ÷ 12 days (average)
                  </span>
                  .
                </p>

                <p className="mt-4">
                  That single annual anchor prevents a common mistake: treating
                  “monthly” as “4 weeks” or treating weekly rent as if it fits
                  cleanly into 12 equal monthly payments.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Annualization (time-length model)
                  </div>
                  <p className="mt-2 text-slate-700">
                    If your input is <span className="font-semibold">R</span>{" "}
                    per period, the tool converts via a daily rate and then to
                    annual:
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Monthly (average)</strong>: Annual = R × 12
                    </li>
                    <li>
                      <strong>Weekly</strong>: Daily = R ÷ 7, Annual = (R ÷ 7) ×
                      365
                    </li>
                    <li>
                      <strong>Biweekly (14 days)</strong>: Daily = R ÷ 14,
                      Annual = (R ÷ 14) × 365
                    </li>
                    <li>
                      <strong>Every 4 weeks (28 days)</strong>: Daily = R ÷ 28,
                      Annual = (R ÷ 28) × 365
                    </li>
                    <li>
                      <strong>Daily</strong>: Annual = R × 365
                    </li>
                    <li>
                      <strong>Hourly</strong>: Annual = (R × 24) × 365
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    After computing the annual result, the tool converts back
                    into your input period and also into common equivalents
                    (monthly average, weekly, and 28-day) using the same day
                    counts.
                  </p>
                </div>

                <p className="mt-4">
                  If you are comparing two options with different billing
                  cycles, treat the annual impact as the deciding baseline, and
                  use the monthly or weekly views only to map that decision back
                  to your budget rhythm.
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
                  2) Percent mode compounds, fixed mode adds the same increment
                  each step
                </h3>

                <p className="mt-4">
                  Pick the mode that matches the notice you received.
                  <span className="font-semibold"> Percent</span> is for “rent
                  increases by X% each time.”{" "}
                  <span className="font-semibold">Fixed</span> is for “rent
                  increases by $Y each time” in the same period as your input.
                </p>

                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong>Percent</strong>: later steps cost more than earlier
                    steps because each step applies to the prior step.
                  </li>
                  <li>
                    <strong>Fixed</strong>: the step-to-step change is constant
                    on an annual basis because the add-on is repeated.
                  </li>
                </ul>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Percent increase mode (compounding)
                  </div>
                  <p className="mt-2 text-slate-700">
                    Let <span className="font-semibold">A</span> be the annual
                    baseline rent, <span className="font-semibold">p</span> the
                    percent, and <span className="font-semibold">n</span> the
                    number of steps:
                  </p>
                  <p className="mt-2 text-slate-700">
                    <span className="font-semibold">Annual after</span> = A × (1
                    + p/100)<span className="font-semibold">^n</span>
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Use this when the increase is stated as a percentage each
                    time, not a one-time adjustment.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Fixed amount increase mode (repeated add-on)
                  </div>
                  <p className="mt-2 text-slate-700">
                    A fixed increase is treated as “per the same period as your
                    rent input,” repeated each step. The tool converts that
                    fixed add-on into an annual increment, then adds it each
                    step.
                  </p>
                  <p className="mt-2 text-slate-700">
                    Let <span className="font-semibold">F</span> be the
                    annualized fixed add-on per step:
                  </p>
                  <p className="mt-2 text-slate-700">
                    <span className="font-semibold">Annual after</span> = A + F
                    × n
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Use this when the notice is a flat amount per period per
                    increase.
                  </p>
                </div>

                <p className="mt-4">
                  The “effective increase” is based on annual totals: it answers
                  “what percent higher is the year after all steps compared to
                  the year before,” even when you choose a fixed add-on.
                </p>
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
                  3) Equivalents are derived from the same annual result
                </h3>

                <p className="mt-4">
                  The calculator produces one “before” annual total and one
                  “after” annual total. Every displayed equivalent is derived
                  from those same annual totals:
                  <span className="font-semibold"> your input period</span>,
                  plus
                  <span className="font-semibold"> monthly (average)</span>,
                  <span className="font-semibold"> weekly</span>, and
                  <span className="font-semibold"> every 4 weeks</span>.
                </p>

                <p className="mt-4">
                  Use the equivalents to compare offers on the same footing and
                  to sanity-check whether an increase looks smaller only because
                  it is quoted in a different cycle.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Monthly (avg) vs every 4 weeks
                  </div>
                  <p className="mt-2 text-slate-700">
                    “Every 4 weeks” is always 28 days. “Monthly (avg)” is annual
                    ÷ 12, which corresponds to an average month length of 365 ÷
                    12 days. The tool shows both so you can see the difference
                    directly instead of assuming they match.
                  </p>
                </div>

                <p className="mt-4">
                  If two listings are “$X every 4 weeks” vs “$Y per month,” the
                  annual totals are the clean comparison. The monthly or 28-day
                  views are just different lenses on that same decision.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  4) The projection table shows each step and the step-to-step
                  change
                </h3>

                <p className="mt-4">
                  The “Projection by increase step” table is where the decision
                  becomes clear over time. Step 0 is your current rent, and each
                  next row is one more increase applied. The step delta is shown
                  on an annual basis so you can see whether costs accelerate
                  (percent) or stay flat per step (fixed).
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example A (listing looks fine until you check the budget
                    cap)
                  </div>

                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You can handle up to{" "}
                      <span className="font-semibold">$2,100/month</span>. Your
                      rent is{" "}
                      <span className="font-semibold">$2,000 monthly</span> and
                      the landlord plans{" "}
                      <span className="font-semibold">3%</span> increases{" "}
                      <span className="font-semibold">twice</span> (two steps).
                    </li>
                    <li>
                      <strong>Numbers:</strong> R = 2,000 monthly, p = 3, n = 2.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Annual baseline A = 2,000 ×
                      12 = <strong>$24,000</strong>. Annual after = 24,000 ×
                      1.03^2 = <strong>$25,461.60</strong>. Monthly (avg) after
                      = 25,461.60 ÷ 12 = <strong>$2,121.80</strong>.
                    </li>
                    <li>
                      <strong>Result:</strong> After two steps, the monthly
                      (avg) equivalent is <strong>$2,121.80</strong>.
                    </li>
                    <li>
                      <strong>Meaning:</strong> This crosses your $2,100/month
                      cap, so you would negotiate, plan to move, or budget for a
                      different ceiling rather than assuming “3% is small.”
                    </li>
                  </ul>

                  <p className="mt-3 text-sm text-slate-600">
                    The projection table makes the threshold crossing obvious,
                    and the annual impact shows what it costs over a full year.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example B (two quotes become comparable only after
                    conversion)
                  </div>

                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You are choosing between a new
                      place quoted at{" "}
                      <span className="font-semibold">$560/week</span> and your
                      current place at{" "}
                      <span className="font-semibold">$500 weekly</span> with{" "}
                      <span className="font-semibold">+$25/week</span> increases
                      planned for <span className="font-semibold">3</span>{" "}
                      steps. You want to know if staying becomes as expensive as
                      moving.
                    </li>
                    <li>
                      <strong>Numbers:</strong> Current R = 500 weekly, fixed
                      add-on = +25 weekly, n = 3. Alternative = 560 weekly.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Annual baseline A = (500 ÷
                      7) × 365 = <strong>$26,071.428571</strong>. Annual
                      increment per step F = (25 ÷ 7) × 365 ={" "}
                      <strong>$1,303.571428</strong>. Annual after (3 steps) = A
                      + 3F = <strong>$29,982.142855</strong>. Weekly equivalent
                      after = annual after ÷ 365 × 7 = <strong>$575</strong>.
                    </li>
                    <li>
                      <strong>Result:</strong> After three fixed increases,
                      staying becomes <strong>$575/week</strong>.
                    </li>
                    <li>
                      <strong>Meaning:</strong> Since $575/week is higher than
                      the $560/week alternative, staying is no longer the
                      cheaper option after the planned steps, so moving becomes
                      the financially better choice if all else is equal.
                    </li>
                  </ul>

                  <p className="mt-3 text-sm text-slate-600">
                    Fixed mode keeps each step’s annual delta steady, which is
                    why the step-to-step changes look uniform in the table.
                  </p>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  Use annualized comparisons to avoid misleading cycle shortcuts
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Weekly is not monthly in a fixed way, and a 28-day cycle is
                  not a calendar month. Anchor the decision on the annual impact
                  first, then use the monthly (avg), weekly, and 28-day views to
                  translate that same cost into the terms you actually plan
                  with.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">Useful for</div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  Checking whether a proposed increase fits your maximum rent
                  threshold after one step or many steps
                </li>
                <li>
                  Testing “what if” scenarios (percent compounding vs fixed
                  add-on) before you commit to a renewal
                </li>
                <li>
                  Comparing options quoted in different cycles by using the
                  annual impact as the shared baseline
                </li>
                <li>
                  Spotting when a small-sounding percent increase becomes a
                  budget problem after repeated steps
                </li>
                <li>
                  Producing a clean before-and-after summary you can paste into
                  a budget or negotiation note
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
