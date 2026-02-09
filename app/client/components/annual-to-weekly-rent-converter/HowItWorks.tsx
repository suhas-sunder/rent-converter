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
                  How the annual to weekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This route starts with a single source value (your annual rent
                  total) and expresses it as a weekly amount. The headline
                  weekly result matches “annual ÷ 52” budgeting intent. A second
                  weekly line is shown using a 365-day model (annual × 7 ÷ 365)
                  so you can compare the two definitions without mixing them.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Weekly budget: ÷ 52
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day weekly shown
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
                  HEADLINE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual ÷ 52
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  COMPARE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual × 7 ÷ 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRAS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day + 28-day lines
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: what you enter */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Step 1: Enter an annual rent total
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    “Annual rent” here means the yearly total you want the tool
                    to treat as rent. It is a single source value. The
                    calculator does not guess what the number includes.
                    Utilities, taxes, fees, deposits, and discounts are not
                    added or removed. If you want a different definition of
                    “annual,” change the input, not the settings.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input handling
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Thousands separators (commas) are treated as grouping:{" "}
                        <span className="font-semibold text-slate-900">
                          1,234
                        </span>{" "}
                        → 1234
                      </li>
                      <li>
                        Decimals are supported and preserved:{" "}
                        <span className="font-semibold text-slate-900">
                          30000.50
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">.5</span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                      <li>
                        If an input format is ambiguous, the correct behavior is
                        a warning or an error instead of guessing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: headline weekly */}
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
                        d="M7 7h10v10H7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Step 2: Compute weekly budgeting as annual ÷ 52
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The headline weekly output on this route uses a 52-week
                    budgeting split. That means the annual total is divided into
                    52 equal weekly amounts. This matches the route’s
                    “annual-to-weekly” intent and produces a simple weekly
                    number tied directly to the annual input.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Headline formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly (budgeting)
                      </span>{" "}
                      = annual rent ÷ 52
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is the primary result shown at the top. Any rounding
                      applied is display-only.
                    </p>
                  </div>

                  <p>
                    If you see two weekly values on the page, the labels matter.
                    One is the budgeting weekly (÷ 52). The other is a
                    time-length weekly derived from a 365-day model. They are
                    close, but not identical, and the page shows both so you do
                    not accidentally compare different definitions of “weekly.”
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: 365-day weekly comparison */}
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
                        d="M5 12h14M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      The 365-day weekly equivalent (shown for alignment)
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The tool also shows a weekly value computed by time length
                    so it stays aligned with the day-based breakdown (daily,
                    hourly, and other period lines that come from a 365-day
                    year). This comparison weekly is derived from an annual
                    per-day rate multiplied by seven.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      365-day weekly formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly (365-day)
                      </span>{" "}
                      = annual rent × 7 ÷ 365
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is a comparison line so weekly can be interpreted
                      under the same model as other day-based equivalents.
                    </p>
                  </div>

                  <p>
                    The page keeps both weekly definitions visible because they
                    serve different purposes. The budgeting weekly matches the
                    route’s intent. The 365-day weekly keeps the breakdown
                    consistent with other day-based lines. The calculator should
                    not silently swap one for the other.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: other periods + decimals */}
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
                        d="M4 6h16M9 6v12m6-12v12"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Additional period lines and precision rules
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Beyond weekly, this route can show biweekly (14-day) and
                    4-week (28-day) equivalents so common pay and billing cycles
                    are visible in one place. These are derived from the same
                    annual total, not from the weekly value, so the breakdown
                    remains anchored to a single source number.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly definition
                      </div>
                      <p className="mt-2">
                        Biweekly is treated as{" "}
                        <span className="font-semibold text-slate-900">
                          14 days
                        </span>{" "}
                        when shown as a time-based line.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        4-week definition
                      </div>
                      <p className="mt-2">
                        4-week is treated as{" "}
                        <span className="font-semibold text-slate-900">
                          28 days
                        </span>{" "}
                        and shown explicitly as a distinct cycle.
                      </p>
                    </div>
                  </div>

                  <p>
                    Decimals are preserved in computation. If you enter cents or
                    fractional units, the math should keep them. If the UI
                    formats the display to fewer decimals, that should be
                    presentation only. The underlying precision should not be
                    thrown away early.
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
                  Two weekly definitions can both be correct if they are labeled
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This route’s headline weekly is{" "}
                  <span className="font-semibold text-white">annual ÷ 52</span>.
                  The 365-day weekly line (
                  <span className="font-semibold text-white">
                    annual × 7 ÷ 365
                  </span>
                  ) is shown so weekly can be compared under the same day-based
                  model used in the breakdown. If you are comparing weekly
                  values across pages, make sure you are comparing the same
                  definition.
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
