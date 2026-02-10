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
                  How the hourly to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this when a price is quoted “per hour” and you need a
                  monthly anchor to make a decision. The page annualizes your
                  hourly rate using a full-time clock basis (24 hours per day,
                  365 days per year), then converts that annual total into an
                  average monthly amount by dividing by 12.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    Best for comparing an hourly quote against a monthly listing
                    using one consistent assumption set.
                  </li>
                  <li>
                    Not a billing calendar. It produces an average month value,
                    not a due date prediction.
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Hourly → annual
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Monthly = annual ÷ 12
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hourly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXPAND
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 24 × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DIVIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: related tools (near top) */}
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
                        d="M5 12h14"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-[1.65rem] leading-tight font-extrabold text-sky-800 tracking-tight">
                      Related tools
                    </h3>
                    <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-slate-700">
                      Use these when you need to convert in the opposite
                      direction, or when you want one place to normalize
                      different billing periods under the same assumptions.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-slate-700">
                    <li>
                      <strong className="text-slate-900">
                        Monthly to hourly
                      </strong>{" "}
                      helps when a lease is monthly but you want to compare it
                      to an hourly quote.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Hourly to annual
                      </strong>{" "}
                      helps when you are planning yearly totals (grants,
                      reimbursements, caps).
                    </li>
                    <li>
                      <strong className="text-slate-900">Rent converter</strong>{" "}
                      helps when your “hourly” assumption is not 24 hours per
                      day and you need custom hours or day counts.
                    </li>
                  </ul>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <Link
                      to="/monthly-to-hourly-rent-converter"
                      className="group/link cursor-pointer inline-flex items-center justify-between gap-2 rounded-xl bg-sky-50/60 px-4 py-2 text-sm font-semibold text-sky-800 ring-1 ring-sky-200/60 transition hover:bg-sky-100/70 hover:ring-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <span>Monthly to hourly</span>
                      <span className="transition-transform group-hover/link:translate-x-0.5">
                        →
                      </span>
                    </Link>

                    <Link
                      to="/hourly-to-annual-rent-converter"
                      className="group/link cursor-pointer inline-flex items-center justify-between gap-2 rounded-xl bg-sky-50/60 px-4 py-2 text-sm font-semibold text-sky-800 ring-1 ring-sky-200/60 transition hover:bg-sky-100/70 hover:ring-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <span>Hourly to annual</span>
                      <span className="transition-transform group-hover/link:translate-x-0.5">
                        →
                      </span>
                    </Link>

                    <Link
                      to="/rent-converter"
                      className="group/link cursor-pointer inline-flex items-center justify-between gap-2 rounded-xl bg-sky-50/60 px-4 py-2 text-sm font-semibold text-sky-800 ring-1 ring-sky-200/60 transition hover:bg-sky-100/70 hover:ring-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <span>Rent converter</span>
                      <span className="transition-transform group-hover/link:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: examples (directly under related tools) */}
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-2xl sm:text-[1.65rem] leading-tight font-extrabold text-sky-800 tracking-tight">
                        Examples
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 transition-shadow group-hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Example 1
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
                        Budget cap check
                      </span>
                    </div>

                    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
                      <div>
                        <strong className="text-slate-900">Situation:</strong> A
                        short-term room ad says “$2.75 per hour” and your hard
                        limit is{" "}
                        <span className="font-semibold text-slate-900">
                          $2,100/month
                        </span>
                        .
                      </div>

                      <div className="rounded-xl bg-slate-50/60 p-3 ring-1 ring-slate-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
                          Numbers
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Hourly ={" "}
                          <span className="font-semibold text-slate-900">
                            2.75
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-sky-50/70 p-3 ring-1 ring-sky-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-sky-800">
                          Calculation
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Annual = 2.75 × 24 × 365 ={" "}
                          <span className="font-extrabold text-slate-900">
                            24,090
                          </span>
                          <br />
                          Monthly = 24,090 ÷ 12 ={" "}
                          <span className="font-extrabold text-slate-900">
                            2,007.50
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
                        <div className="text-sm font-semibold text-slate-700">
                          Result
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          2,007.50{" "}
                          <span className="text-sm font-bold text-slate-700">
                            /month
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900">Meaning:</strong> It
                        stays under your $2,100 cap, so it’s a{" "}
                        <span className="font-semibold text-slate-900">
                          viable option
                        </span>{" "}
                        rather than an automatic reject.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 transition-shadow group-hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Example 2
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
                        Compare listings
                      </span>
                    </div>

                    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
                      <div>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        One option is “$3.00 per hour,” another is advertised as{" "}
                        <span className="font-semibold text-slate-900">
                          $2,150/month
                        </span>
                        . You want the cheaper monthly.
                      </div>

                      <div className="rounded-xl bg-slate-50/60 p-3 ring-1 ring-slate-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
                          Numbers
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Hourly ={" "}
                          <span className="font-semibold text-slate-900">
                            3.00
                          </span>
                          , Monthly listing ={" "}
                          <span className="font-semibold text-slate-900">
                            2,150
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-sky-50/70 p-3 ring-1 ring-sky-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-sky-800">
                          Calculation
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Annual = 3.00 × 24 × 365 ={" "}
                          <span className="font-extrabold text-slate-900">
                            26,280
                          </span>
                          <br />
                          Monthly = 26,280 ÷ 12 ={" "}
                          <span className="font-extrabold text-slate-900">
                            2,190
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
                        <div className="text-sm font-semibold text-slate-700">
                          Result
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          2,190{" "}
                          <span className="text-sm font-bold text-slate-700">
                            /month
                          </span>{" "}
                          <span className="text-sm font-semibold text-slate-600">
                            vs 2,150/month
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900">Meaning:</strong> The
                        hourly option is actually higher on a monthly basis, so
                        the{" "}
                        <span className="font-semibold text-slate-900">
                          $2,150
                        </span>{" "}
                        lease is the cheaper choice.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 transition-shadow group-hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Example 3
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
                        Pass/fail threshold
                      </span>
                    </div>

                    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
                      <div>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        You’re checking an hourly storage unit price against a
                        target of{" "}
                        <span className="font-semibold text-slate-900">
                          under $900/month
                        </span>
                        .
                      </div>

                      <div className="rounded-xl bg-slate-50/60 p-3 ring-1 ring-slate-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
                          Numbers
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Hourly ={" "}
                          <span className="font-semibold text-slate-900">
                            1.35
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-sky-50/70 p-3 ring-1 ring-sky-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-sky-800">
                          Calculation
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Annual = 1.35 × 24 × 365 ={" "}
                          <span className="font-extrabold text-slate-900">
                            11,826
                          </span>
                          <br />
                          Monthly = 11,826 ÷ 12 ={" "}
                          <span className="font-extrabold text-slate-900">
                            985.50
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
                        <div className="text-sm font-semibold text-slate-700">
                          Result
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          985.50{" "}
                          <span className="text-sm font-bold text-slate-700">
                            /month
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900">Meaning:</strong> It
                        crosses your $900 target, so you’d{" "}
                        <span className="font-semibold text-slate-900">
                          reject or negotiate
                        </span>{" "}
                        instead of moving forward.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 transition-shadow group-hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Quick check
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
                        Rounding risk
                      </span>
                    </div>

                    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
                      <div>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        Two hourly quotes differ by a few cents. You don’t want
                        rounding to hide the gap.
                      </div>

                      <div className="rounded-xl bg-slate-50/60 p-3 ring-1 ring-slate-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
                          Numbers
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Option A ={" "}
                          <span className="font-semibold text-slate-900">
                            2.99
                          </span>
                          /hr, Option B ={" "}
                          <span className="font-semibold text-slate-900">
                            3.01
                          </span>
                          /hr
                        </div>
                      </div>

                      <div className="rounded-xl bg-sky-50/70 p-3 ring-1 ring-sky-200/60">
                        <div className="text-xs font-bold uppercase tracking-wide text-sky-800">
                          Calculation
                        </div>
                        <div className="mt-1 text-sm text-slate-800">
                          Monthly difference = (3.01 − 2.99) × 24 × 365 ÷ 12 ={" "}
                          <span className="font-extrabold text-slate-900">
                            14.60
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
                        <div className="text-sm font-semibold text-slate-700">
                          Result
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          14.60{" "}
                          <span className="text-sm font-bold text-slate-700">
                            more /month
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900">Meaning:</strong> If
                        your UI rounds to whole dollars, both may look
                        “basically the same,” but the higher quote costs
                        meaningfully more over time.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: core path */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion path used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The page converts by time length, then reports an average
                    month. That gives you a single monthly number you can use to
                    compare against monthly caps, leases, or budgets.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Daily</strong> = hourly × 24
                      </li>
                      <li>
                        <strong>Annual</strong> = daily × 365
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                      <li>
                        Combined:{" "}
                        <strong>Monthly = hourly × 24 × 365 ÷ 12</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      The “monthly” result is based on a 365-day year averaged
                      across 12 months (365 ÷ 12 days per month).
                    </p>
                  </div>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      If you multiply the monthly result by 12, you get back the
                      same annual total used for every other period line.
                    </li>
                    <li>
                      If you need a different assumption (for example, only
                      certain hours are billable), this page is not the right
                      model for that decision.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SectionCard: what hourly means */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  What “hourly” means on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    “Hourly” is interpreted as a continuous clock-hour rate that
                    applies to every hour of the day. That is the only meaning
                    that makes the conversion internally consistent across all
                    the output periods shown on this page.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Good use cases
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        An hourly quote that is genuinely “always running” (for
                        example, a space, spot, or unit priced by time).
                      </li>
                      <li>
                        Sanity-checking whether an hourly number is compatible
                        with your monthly budget before you spend time on the
                        listing.
                      </li>
                      <li>
                        Normalizing an hourly price so you can compare it
                        against monthly rent without switching assumptions
                        mid-table.
                      </li>
                    </ul>
                  </div>

                  <p>
                    If your hourly rate only applies to a limited schedule (only
                    daytime hours, only weekdays, only occupied hours), the
                    monthly equivalent from this page will overstate your cost.
                    In that case, use the rent converter page so the comparison
                    matches your real usage.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown stays consistent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown is meant for comparison, not storytelling. All
                    period lines come from the same implied daily and annual
                    basis, so you can compare periods without the table drifting
                    due to mixed assumptions.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Weekly</strong> = daily × 7 (useful for weekly
                      caps or weekly pay-cycle checks)
                    </li>
                    <li>
                      <strong>Biweekly</strong> = daily × 14 (useful when you
                      pay every two weeks)
                    </li>
                    <li>
                      <strong>4-week</strong> = daily × 28 (useful when
                      something is quoted per 4-week cycle)
                    </li>
                    <li>
                      <strong>Monthly</strong> = annual ÷ 12 (useful for
                      comparing against monthly rent or a monthly budget)
                    </li>
                  </ul>

                  <p>
                    If two listings are quoted in different periods, compare
                    them on one line (monthly is usually easiest) and use the
                    other lines only if your budget is actually set in that
                    period.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing and precision */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing rules and precision handling
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are treated as decimals. The goal is to accept common
                    ways people type money so you can get to a decision without
                    fighting formatting.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Thousands separators are supported: <strong>1,234</strong>{" "}
                      is interpreted as 1234
                    </li>
                    <li>
                      Decimal points are supported: <strong>1.234</strong> is
                      interpreted as 1.234
                    </li>
                    <li>
                      Common edge formats are supported: <strong>.5</strong> and{" "}
                      <strong>12.</strong>
                    </li>
                    <li>
                      Currency symbols may be present and are ignored during
                      numeric parsing
                    </li>
                  </ul>

                  <p>
                    Decimals are preserved in computation. If the UI rounds
                    values, that should only be display formatting. When cents
                    matter for your decision, rely on the unrounded value or
                    increase displayed precision.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  Monthly here is an average month
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page uses fixed time lengths (24 hours per day and 365
                  days per year) and then divides by 12. Use it to compare value
                  across periods with one consistent basis. Do not use it to
                  predict a specific billing month length or due date behavior.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-200 leading-7">
                  <li>
                    If you are deciding between two listings, compare them on
                    the monthly line and decide from that number.
                  </li>
                  <li>
                    If the hourly quote is only for some hours, switch tools so
                    your assumptions match reality.
                  </li>
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
