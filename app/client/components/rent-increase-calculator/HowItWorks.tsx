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
            etc.), then choose either a percent increase (compounds each step)
            or a fixed amount increase (added each step in the same period as
            your rent input). Results are computed from a single annual time
            basis so comparisons stay consistent. Decimals are preserved
            end-to-end (up to 12 places), with optional display-only rounding.
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
                  1) Everything is computed from one annual time basis
                </h3>

                <p className="mt-4">
                  The calculator first converts your input rent into an annual
                  amount using explicit day-count assumptions:
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
                  . This avoids mixing “payment counts” with “time lengths” when
                  comparing monthly vs weekly vs 28-day equivalents.
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
                  This is why the page can show{" "}
                  <span className="font-semibold">Monthly (avg)</span> and{" "}
                  <span className="font-semibold">Every 4 weeks</span>{" "}
                  side-by-side without pretending they are interchangeable. A
                  28-day cycle is always 28 days. A month is not.
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
                  You pick one increase mode and a number of steps. The tool
                  applies the increase to the annualized baseline, then converts
                  back to the breakdown periods.
                </p>

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
                    Each step multiplies the prior step, so the increase amount
                    grows over time.
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
                    The per-step change stays constant on an annual basis (no
                    compounding).
                  </p>
                </div>

                <p className="mt-4">
                  The “effective increase” is computed from annual totals: it
                  compares annual after vs annual before, then expresses that
                  change as a percentage so percent mode and fixed mode can be
                  compared on the same basis.
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
                  After the tool computes annual “before” and “after,” it
                  converts those totals into multiple views:
                  <span className="font-semibold"> your input period</span>,
                  plus
                  <span className="font-semibold"> monthly (average)</span>,
                  <span className="font-semibold"> weekly</span>, and
                  <span className="font-semibold"> every 4 weeks</span>. These
                  are time-based equivalents, derived from the same annual
                  totals so they stay aligned.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Monthly (avg) vs every 4 weeks
                  </div>
                  <p className="mt-2 text-slate-700">
                    “Every 4 weeks” is always 28 days. “Monthly (avg)” is annual
                    ÷ 12, which corresponds to an average month length of 365 ÷
                    12 days. The tool shows both so you can see the gap directly
                    instead of assuming they match.
                  </p>
                </div>

                <p className="mt-4">
                  The annual impact panel is the anchor: annual difference
                  first, then the derived monthly average, weekly, and 28-day
                  differences from that same annual change.
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
                  The “Projection by increase step” table starts at step 0 (your
                  current rent) and runs through step n. Each row shows the
                  annualized total and key equivalents. The step delta is shown
                  on an annual basis so you can see compounding vs fixed adds
                  clearly.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example A (percent mode, real numbers)
                  </div>
                  <p className="mt-2 text-slate-700">
                    Input rent:{" "}
                    <span className="font-semibold">$2,000 monthly</span>.
                    Increase:
                    <span className="font-semibold"> 3%</span>. Steps:
                    <span className="font-semibold"> 2</span>.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Annual baseline A = 2,000 × 12 = <strong>$24,000</strong>
                    </li>
                    <li>
                      Step 1 annual = 24,000 × 1.03 = <strong>$24,720</strong>
                    </li>
                    <li>
                      Step 2 annual = 24,720 × 1.03 ={" "}
                      <strong>$25,461.60</strong>
                    </li>
                    <li>
                      Monthly (avg) after step 2 = 25,461.60 ÷ 12 ={" "}
                      <strong>$2,121.80</strong>
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    The UI shows the full breakdown (weekly, 28-day, etc.)
                    derived from the same annual totals.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example B (fixed mode, period-aware)
                  </div>
                  <p className="mt-2 text-slate-700">
                    Input rent:{" "}
                    <span className="font-semibold">$500 weekly</span>. Fixed
                    increase:
                    <span className="font-semibold"> +$25</span> per week.
                    Steps:
                    <span className="font-semibold"> 3</span>.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Annual baseline A = (500 ÷ 7) × 365 ={" "}
                      <strong>$26,071.428571</strong>
                    </li>
                    <li>
                      Annual increment per step F = (25 ÷ 7) × 365 ={" "}
                      <strong>$1,303.571428</strong>
                    </li>
                    <li>
                      Annual after (3 steps) = A + 3F ={" "}
                      <strong>$29,982.142855</strong>
                    </li>
                    <li>
                      Weekly equivalent after = annual after ÷ 365 × 7 ={" "}
                      <strong>$575</strong>
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    Fixed mode keeps the step-to-step annual delta constant
                    because it adds the same period-based increment each step.
                  </p>
                </div>
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
                  Inputs are parsed into a decimal-safe representation so cents
                  and fractional values are not lost during conversion and
                  projection. This matters when you run multiple steps, because
                  early rounding would compound into drift.
                </p>

                <p className="mt-4">
                  If you enable “Round displayed values”, rounding changes only
                  what is shown on screen (and what you copy or print). The
                  underlying computations still use preserved decimals up to 12
                  places.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Input formats supported (examples)
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>$2,000</li>
                    <li>2000.00</li>
                    <li>.5 (interpreted as 0.5)</li>
                    <li>12. (interpreted as 12)</li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    If an input format is ambiguous, the tool should block the
                    result and prompt for a clearer entry rather than guessing.
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
                  not a calendar month. This calculator anchors everything to
                  one annual time basis and derives each equivalent from that
                  same annual total so comparisons do not hide assumptions.
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
                <li>Seeing the annual budget impact before and after</li>
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
