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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight leading-tight">
                  How the annual to biweekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts an annual rent total into a biweekly
                  equivalent using a fixed time-length model. The output is an
                  equivalent amount that represents the same annual cost under a
                  defined year basis. It is not a billing rule engine, not a due
                  date tool, and not a lease-terms interpreter.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day model
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DEFINITION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day equivalent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  annual × 14 ÷ 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <p>
                    Input: one annual rent total (a currency amount per year).
                    Output: a biweekly equivalent (a currency amount per 14-day
                    period), plus a breakdown table for other periods derived
                    from the same annual basis. Every value shown is an
                    equivalent under one fixed model, so the annual total is the
                    anchor and all rows reconcile back to that same annual cost.
                  </p>
                  <p>
                    This page is not a payment schedule generator. It does not
                    decide due dates, it does not interpret lease language, and
                    it does not decide whether a landlord charges 26 payments,
                    24 payments, or any other schedule. It converts amounts by
                    time length only.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      One-line summary
                    </div>
                    <p className="mt-2">
                      Biweekly equivalent = annual rent × 14 ÷ 365 (using a
                      365-day year and 14-day biweekly period).
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Definitions used on this page
                  </h3>
                  <p>
                    Period definitions here are fixed and explicit. These
                    definitions are used for all conversions and for the
                    breakdown table.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">Day</span>:
                      1 day.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Week</span>
                      : 7 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Biweekly
                      </span>
                      : 14 days (not twice per month).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        4-week
                      </span>
                      : 28 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Year</span>
                      : 365 days (fixed year basis on this page).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Month
                      </span>
                      : average calendar month length implied by the year model,
                      which is 365 ÷ 12 days per month. This is not 4 weeks.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Hour</span>{" "}
                      (when shown): 1 hour, with a time-length yearly basis of
                      8,760 hours (365 × 24). This exists so hourly rows can
                      reconcile to the same annual basis as daily and weekly
                      rows.
                    </li>
                  </ul>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Core formula and conversion basis
                  </h3>
                  <p>
                    The converter uses a single annual basis and derives all
                    other periods from that basis. This avoids mixing shortcuts
                    like "weekly × 4" with calendar-month math, which do not
                    reconcile.
                  </p>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Exact formulas (annual as input)
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2">
                      <li>Daily = annual ÷ 365</li>
                      <li>Weekly = annual × 7 ÷ 365</li>
                      <li>Biweekly = annual × 14 ÷ 365</li>
                      <li>4-week = annual × 28 ÷ 365</li>
                      <li>
                        Monthly = annual ÷ 12 (equivalently: annual × (365 ÷ 12)
                        ÷ 365)
                      </li>
                      <li>Hourly (when shown) = annual ÷ 8,760</li>
                    </ul>

                    <div className="mt-4 text-sm text-slate-700">
                      <div className="font-bold text-slate-900">
                        Stepwise version (annual → daily → biweekly)
                      </div>
                      <div className="mt-2">Daily = annual ÷ 365</div>
                      <div>Biweekly = daily × 14 = (annual ÷ 365) × 14</div>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                      This basis is used for internal consistency: every row is
                      anchored to the same annual total, so comparisons across
                      periods remain coherent.
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    What the breakdown table represents
                  </h3>
                  <p>
                    The breakdown table shows multiple period equivalents for
                    the same underlying annual total. Each row is derived from
                    the same annual basis, not from the headline row. For
                    example, the weekly row is not computed as biweekly ÷ 2 and
                    the monthly row is not computed as weekly × 4. They are all
                    derived from the same annual anchor.
                  </p>
                  <p>
                    This matters when comparing listings that mix weekly
                    pricing, 28-day cycles, and calendar-month figures. Under a
                    consistent basis, weekly and 4-week values can differ from
                    monthly values even when they look "close." These rows are
                    equivalents, not payment schedules and not statements about
                    how many payments happen inside a given month.
                  </p>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Common mismatches and how this page treats them
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Weekly × 4 vs monthly
                      </div>
                      <p className="mt-2">
                        "Weekly × 4" is a 28-day amount. A calendar month is not
                        always 28 days, and this page defines monthly as annual
                        ÷ 12 under a 365-day year. That difference is why weekly
                        × 4 does not match monthly on this page.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        4-week vs calendar month
                      </div>
                      <p className="mt-2">
                        A 4-week period is fixed at 28 days. A month on this
                        page is the average month implied by the year model (365
                        ÷ 12 days). The tool keeps these separate, so 4-week and
                        monthly are different rows with different definitions.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        "26 payments" vs time-length conversion
                      </div>
                      <p className="mt-2">
                        "26 payments" is a scheduling statement (every 14 days
                        across 52 weeks). This page does not assume a payment
                        count. It converts by time length using 14-day blocks
                        over a 365-day year so every period stays anchored to
                        the same annual total.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Hourly: paid-hours vs time-based hourly (when shown)
                      </div>
                      <p className="mt-2">
                        If an hourly row is shown, it is time-based: annual ÷
                        8,760 (365 × 24). It is not based on paid working hours,
                        shifts, or an assumed work week. This keeps hourly,
                        daily, and weekly rows internally consistent under the
                        same year model.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Examples you can cross-check
                  </h3>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 1
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Annual = 24,000
                    </div>
                    <div className="mt-1">
                      Biweekly = 24,000 × 14 ÷ 365 = 920.5479… ≈{" "}
                      <span className="font-semibold text-slate-900">
                        920.55
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 2
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Annual = 30,000.50
                    </div>
                    <div className="mt-1">
                      Biweekly = 30,000.50 × 14 ÷ 365 = 1,150.7038… ≈{" "}
                      <span className="font-semibold text-slate-900">
                        1,150.70
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 3
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Annual = 18,200
                    </div>
                    <div className="mt-1">Daily = 18,200 ÷ 365 = 49.8630…</div>
                    <div className="mt-1">
                      Biweekly = Daily × 14 = 49.8630… × 14 = 698.0821… ≈{" "}
                      <span className="font-semibold text-slate-900">
                        698.08
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 4
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Annual = 52,000
                    </div>
                    <div className="mt-1">
                      Weekly = 52,000 × 7 ÷ 365 = 997.2602… ≈{" "}
                      <span className="font-semibold text-slate-900">
                        997.26
                      </span>
                    </div>
                    <div className="mt-1">
                      Monthly = 52,000 ÷ 12 = 4,333.3333… ≈{" "}
                      <span className="font-semibold text-slate-900">
                        4,333.33
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Input formats and parsing rules
                  </h3>
                  <p>
                    The calculator accepts common numeric formats and rejects or
                    warns on ambiguous formats rather than guessing.
                  </p>

                  <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Format
                          </th>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Examples accepted
                          </th>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-white">
                          <td className="px-4 py-3">Decimals</td>
                          <td className="px-4 py-3">1200.50, .5, 12.</td>
                          <td className="px-4 py-3">
                            Decimal point is supported. Trailing dot is treated
                            as a decimal with no fractional digits.
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3">Thousands grouping</td>
                          <td className="px-4 py-3">1,200; 1,200.50</td>
                          <td className="px-4 py-3">
                            Commas are treated as thousands separators.
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3">Currency symbols</td>
                          <td className="px-4 py-3">$1,200.50; €1200</td>
                          <td className="px-4 py-3">
                            Currency symbols are ignored for numeric parsing.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    Ambiguous input behavior: if a value can reasonably be read
                    in more than one way, the tool should warn or block instead
                    of guessing. Examples of ambiguity include mixed separators
                    like "1.200,50" (locale-dependent) or malformed grouping
                    like "1,200,50". The goal is to avoid producing
                    clean-looking numbers from a misread input.
                  </p>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Rounding and calculation precision
                  </h3>
                  <p>
                    Decimals are preserved internally end to end. Rounding is
                    display-only. If the UI shows fewer decimals, the underlying
                    calculations still use the full parsed value and the fixed
                    formulas above. Changing display precision changes
                    formatting, not the math.
                  </p>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Scope and limits of this tool
                  </h3>
                  <p>
                    This converter does not include fees, utilities, deposits,
                    taxes, insurance, discounts, or proration. It converts only
                    the rent amount you enter. Outputs are equivalents under a
                    fixed time-length model, not a schedule of due dates or a
                    statement about how many payments occur in any calendar
                    month. For due dates or invoice timing, use a due-date tool
                    instead of relying on period equivalents.
                  </p>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Related tools (short contextual references only)
                  </h3>
                  <p>
                    If you need to switch between other rent periods without
                    changing the conversion basis, the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter hub
                    </Link>{" "}
                    links the full set of period converters. For the reverse of
                    this page, use the{" "}
                    <Link
                      to="/biweekly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to annual converter
                    </Link>{" "}
                    so the same year basis is applied in the opposite direction.
                    For a nearby frequency comparison, the{" "}
                    <Link
                      to="/weekly-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      weekly to biweekly converter
                    </Link>{" "}
                    keeps weekly and 14-day equivalents on the same footing.
                    Monthly comparisons can be checked against{" "}
                    <Link
                      to="/annual-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to monthly
                    </Link>{" "}
                    to avoid the "weekly × 4" shortcut.
                  </p>
                </div>
              </div>
            </div>

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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  Equivalents are not due dates
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The biweekly result is a 14-day equivalent derived from a
                  365-day year model. It does not determine which dates rent is
                  due, how many payments land inside a specific calendar month,
                  or how invoices are scheduled. If you need actual due dates,
                  use a due-date calculator.
                </p>
                <div className="mt-4">
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
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
