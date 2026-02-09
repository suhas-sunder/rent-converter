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
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this rent increase calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This tool estimates your new rent after one or more increases and
            shows the impact across common pay and billing cycles. You enter a
            current rent amount and its period (monthly, weekly, every 4 weeks,
            etc.), then choose either a percent increase (compounding across
            steps) or a fixed amount increase (added each step in the same
            period as your rent input). Results are computed from annual totals
            so the comparisons are consistent, and decimals are preserved
            end-to-end (up to 12 places) with optional display-only rounding.
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

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Everything is computed from annual totals first
                </h3>
                <p className="mt-4">
                  The calculator starts by converting your rent into an
                  annualized amount using standard assumptions:
                  <span className="font-semibold"> 1 year = 365 days</span>,
                  <span className="font-semibold"> 1 week = 7 days</span>,
                  <span className="font-semibold">
                    {" "}
                    every 4 weeks = 28 days
                  </span>
                  , and
                  <span className="font-semibold">
                    {" "}
                    month = 365 ÷ 12 days (average)
                  </span>
                  . This avoids “mixing” cycle assumptions when showing monthly
                  vs weekly vs 28-day equivalents.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Annualization formula
                  </div>
                  <p className="mt-2 text-slate-700">
                    If your input rent is{" "}
                    <span className="font-semibold">R</span> per period, the
                    annualized base is:
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Monthly</strong>: Annual = R × 12
                    </li>
                    <li>
                      <strong>Weekly</strong>: Annual = R × 52
                    </li>
                    <li>
                      <strong>Biweekly</strong>: Annual = R × 26
                    </li>
                    <li>
                      <strong>Every 4 weeks (28 days)</strong>: Annual = R × 13
                    </li>
                    <li>
                      <strong>Daily</strong>: Annual = R × 365
                    </li>
                    <li>
                      <strong>Hourly</strong>: Annual = R × 24 × 365
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    After computing the annual result, the tool converts back
                    into your chosen period and also into common equivalents
                    (monthly avg, weekly, and 28-day) so the comparisons stay
                    consistent.
                  </p>
                </div>

                <p className="mt-4">
                  This is why the page can show{" "}
                  <span className="font-semibold">Monthly (avg)</span> and{" "}
                  <span className="font-semibold">Every 4 weeks</span>{" "}
                  side-by-side without pretending they are interchangeable. A
                  28-day cycle is always 28 days; a month is not.
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
                  2) Percent mode compounds; fixed mode adds a repeated
                  increment
                </h3>

                <p className="mt-4">You pick one of two increase modes:</p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Percent increase mode
                  </div>
                  <p className="mt-2 text-slate-700">
                    A percent increase compounds across steps. If the annualized
                    base rent is <span className="font-semibold">A</span>, the
                    percent is <span className="font-semibold">p</span>, and the
                    number of steps is <span className="font-semibold">n</span>,
                    then:
                  </p>
                  <p className="mt-2 text-slate-700">
                    <span className="font-semibold">Annual after</span> = A × (1
                    + p/100)
                    <span className="font-semibold">^n</span>
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Step-by-step, the projection table applies the same
                    multiplier each step so you can see the compounding effect
                    rather than only the final total.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Fixed amount increase mode
                  </div>
                  <p className="mt-2 text-slate-700">
                    A fixed increase is treated as an amount added each step in
                    the{" "}
                    <span className="font-semibold">
                      same period as your rent input
                    </span>
                    . The tool annualizes that fixed increment and adds it
                    repeatedly.
                  </p>
                  <p className="mt-2 text-slate-700">
                    If annual base is <span className="font-semibold">A</span>,
                    and the annualized fixed increment is{" "}
                    <span className="font-semibold">F</span>, then:
                  </p>
                  <p className="mt-2 text-slate-700">
                    <span className="font-semibold">Annual after</span> = A + F
                    × n
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Example: if rent is weekly and the fixed increase is “+$25”,
                    the tool treats that as +$25 per week each step, annualizes
                    it as $25 × 52, then adds it each step.
                  </p>
                </div>

                <p className="mt-4">
                  The output “Increase (effective)” is computed from annual
                  totals: it compares the annual after vs annual before, then
                  expresses that change as a percentage. This lets you compare
                  percent mode and fixed mode on the same basis.
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
                  3) Pay-cycle equivalents are derived from the same annual
                  result
                </h3>

                <p className="mt-4">
                  After the tool computes the annualized “before” and “after”,
                  it converts those totals into several equivalents:
                  <span className="font-semibold"> your input period</span>,
                  plus
                  <span className="font-semibold"> monthly (average)</span>,
                  <span className="font-semibold"> weekly</span>, and
                  <span className="font-semibold"> every 4 weeks</span>. These
                  conversions answer a practical question:
                  <span className="font-semibold">
                    “What does this rent look like if I compare it on a
                    different cycle?”
                  </span>
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Why monthly (avg) is not the same as every 4 weeks
                  </div>
                  <p className="mt-2 text-slate-700">
                    A 4-week period is exactly 28 days. The “monthly (avg)”
                    value is computed from annual ÷ 12, which corresponds to an
                    average month length of 365 ÷ 12 days. The tool shows the
                    difference explicitly as “Monthly vs every 4 weeks (before
                    and after)” so you do not have to guess the gap.
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    This is useful if you are comparing listings where one
                    advertises monthly pricing and another effectively behaves
                    like a fixed-day cycle (for example, some payroll-linked
                    housing arrangements).
                  </p>
                </div>

                <p className="mt-4">
                  The “Annual impact” panel breaks the result into the
                  differences you usually care about: annual difference, monthly
                  (avg) difference, and weekly difference. All of those come
                  from the same annual totals, so they stay aligned.
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
                  4) The projection table shows each step and the delta vs prior
                </h3>

                <p className="mt-4">
                  The “Projection by increase step” table starts at step 0 (your
                  current rent) and runs through step n. For each step it shows
                  the annualized total and the key equivalents (your input
                  period, monthly avg, 4-week, weekly). The last column shows
                  the change from the previous step on an annual basis so you
                  can see how the increase behaves over time.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example (percent compounding, simplified)
                  </div>
                  <p className="mt-2 text-slate-700">
                    Suppose your rent is{" "}
                    <span className="font-semibold">$2,000 monthly</span>, and
                    you project <span className="font-semibold">2</span>{" "}
                    increases at <span className="font-semibold">3%</span>.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Annual base = 2000 × 12 = 24000</li>
                    <li>Step 1 annual = 24000 × 1.03</li>
                    <li>Step 2 annual = 24000 × 1.03 × 1.03</li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    Your UI will show the exact currency formatting and the
                    converted equivalents. Internally, decimals are preserved up
                    to 12 places, then optionally rounded only for display.
                  </p>
                </div>

                <p className="mt-4">
                  Percent mode is where this table matters most because
                  compounding changes the step-to-step delta over time. Fixed
                  mode produces the same annual delta each step (because it adds
                  a constant annualized increment).
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  5) Decimals are preserved; rounding is display-only
                </h3>

                <p className="mt-4">
                  Inputs are parsed into a fixed-point decimal representation so
                  the tool can preserve cents and small fractional values
                  without losing precision during conversions and projections.
                  This is especially important when you project multiple steps
                  or compare cycles, because early rounding can compound into
                  noticeable drift.
                </p>

                <p className="mt-4">
                  If you enable “Round displayed values”, rounding only affects
                  what you see on screen (and what you copy/print). The
                  calculations remain based on the exact preserved decimals (up
                  to 12 places).
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Input formats supported
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>$2,000</li>
                    <li>2000.00</li>
                    <li>.5 (interpreted as 0.5)</li>
                    <li>12. (interpreted as 12)</li>
                    <li>2000,50 (comma-decimal formats)</li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    If an input format is ambiguous, the tool warns you or asks
                    you to enter the number in a clearer format.
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
                  Use annualized comparisons to avoid misleading “cycle math”
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A weekly amount is not “monthly” in a fixed way, and a 28-day
                  cycle is not a calendar month. This calculator shows the
                  annual impact first, then derives each equivalent from that
                  same annual total so you can compare increases without hiding
                  the assumptions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">Useful for</div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                <li>Estimating a new rent after a percent or fixed increase</li>
                <li>Projecting multiple increases (1 to 50 steps)</li>
                <li>
                  Comparing monthly (avg), weekly, and 28-day equivalents fairly
                </li>
                <li>
                  Seeing the annual budget impact before and after the increase
                </li>
                <li>Copying or printing a clean summary for budgeting</li>
              </ul>
            </div>

            <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:p-6">
                <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                  Related pages
                </h3>
                <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-2">
                  {[
                    { href: "/rent-converter", text: "Rent converter" },
                    {
                      href: "/rent-after-increase-calculator",
                      text: "Rent after increase calculator",
                    },
                    {
                      href: "/rent-increase-percentage-calculator",
                      text: "Rent increase percentage calculator",
                    },
                    {
                      href: "/how-much-rent-can-i-afford-calculator",
                      text: "How much rent can I afford calculator",
                    },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        to={safeHref(l.href)}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        {l.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
