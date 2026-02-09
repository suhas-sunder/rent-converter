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
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                    How the monthly to weekly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a monthly rent amount into a weekly
                    equivalent using one time-length model. Monthly is treated
                    as an average month derived from a 365-day year. Weekly is
                    defined as a fixed 7-day period. The weekly figure you see
                    is the 7-day equivalent of the same implied annual cost, not
                    a “payments per year” shortcut.
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

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Step 1 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 1: Enter the monthly rent amount
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Enter the rent value and select “monthly.” The parser
                      accepts currency symbols, grouping commas, and decimal
                      formats, including edge inputs. It avoids producing a
                      clean weekly result from an invalid entry.
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
                    </div>

                    <p>
                      The calculator converts the rent amount only. It does not
                      guess included costs like utilities, fees, deposits, or
                      taxes.
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
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 2: Convert monthly into a weekly equivalent (7-day
                    basis)
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The weekly figure is derived by first establishing an
                      annual total implied by the monthly amount, then
                      converting that annual total into a daily rate, then into
                      a 7-day week. This keeps weekly aligned with the same
                      assumptions used elsewhere in the breakdown.
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
                      This is a time-length conversion. It’s not attempting to
                      infer how your lease is billed or how many payment dates
                      occur in a calendar year.
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
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 3: Keep the breakdown consistent and keep rounding
                    separate
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The breakdown (hourly, daily, weekly, biweekly, 4-week,
                      monthly, annual) is generated from the same annual basis
                      so period values don’t drift from mixed assumptions. The
                      4-week line uses exactly 28 days.
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
                      are rounded. The underlying equivalents are unchanged.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What you can do
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Compare weekly-advertised and monthly-advertised
                          listings on one annual basis
                        </li>
                        <li>
                          Keep 28-day and monthly pricing distinct instead of
                          treating them as the same
                        </li>
                        <li>
                          Copy weekly and summary numbers for sharing or
                          documentation
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    Weekly comparisons are easiest when the year is the anchor
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    If you compare “weekly” and “monthly” by eyeballing labels,
                    you end up mixing time lengths. This route forces a single
                    annual basis, then derives weekly as a 7-day equivalent.
                    That keeps the weekly number compatible with the 14-day and
                    28-day lines in the same breakdown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm mt-6 rc-no-print">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center leading-tight">
              Monthly rent expressed as a weekly equivalent
            </h2>

            <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    What the weekly number represents
                  </h3>
                  <p className="mt-4">
                    Weekly is a 7-day unit. Monthly is not a fixed day count,
                    which is why a direct “monthly ÷ 4” shortcut is usually
                    wrong. This page produces a weekly equivalent that matches
                    the same implied annual cost as the monthly amount, under
                    one explicit time model.
                  </p>
                  <p className="mt-4">
                    Practically, that means you can line up listings that use
                    different labels. Convert each one and compare the weekly
                    values, then scan the breakdown to see whether the 14-day
                    and 28-day equivalents are in the same range.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Why 28-day billing creates “almost monthly” prices
                  </h3>
                  <p className="mt-4">
                    A 4-week period is always 28 days. An average month is
                    longer than 28 days (365 ÷ 12 days). That’s why a listing
                    billed “every 4 weeks” can imply a different annual total
                    even when the number looks close to the monthly price. This
                    route keeps those time lengths explicit by converting
                    through the same annual and daily basis.
                  </p>

                  <p className="mt-5 text-slate-700 leading-relaxed">
                    Related pages:{" "}
                    <Link
                      to="/weekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to monthly rent
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/rent-paid-every-4-weeks-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent paid every 4 weeks
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      how much rent can I afford
                    </Link>
                    .
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
