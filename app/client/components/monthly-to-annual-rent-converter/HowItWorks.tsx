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
                  How the monthly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a monthly rent amount into an annual
                  equivalent by committing to a single definition of “monthly.”
                  Monthly is treated as an average month derived from a 365-day
                  year. The result is an annual equivalence that can be compared
                  cleanly against weekly, biweekly, and 4-week pricing.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = average month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual via 365 days
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
                  INTERPRET
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Avg month
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: core model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion model used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The converter treats your monthly input as one average month
                    of rent. That month is not assumed to be 28 days, 30 days,
                    or tied to a specific calendar. Instead, monthly is defined
                    as one-twelfth of a 365-day year. From there, the annual
                    equivalent is computed directly.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>Equivalent view: monthly = annual ÷ 12</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    Because the page commits to this definition, the annual
                    result can be compared against other period labels without
                    silently changing assumptions.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not payment count */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why payment schedules are shown separately
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    A monthly label can describe two different things: a
                    time-based equivalent or a payment schedule. This page
                    separates those ideas. The annual equivalence is based on
                    time length. Payment schedules are shown only as
                    illustrations.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence basis
                      </div>
                      <p className="mt-2">
                        Monthly × 12, derived from an average month.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedule examples
                      </div>
                      <p className="mt-2">
                        Monthly × 12, 4-week × 13 (illustrative only).
                      </p>
                    </div>
                  </div>

                  <p>
                    This prevents a common mistake where a 4-week rent looks
                    cheaper than monthly when compared only by label. The page
                    shows both so the difference is explicit.
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
                  How the full breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the annual equivalence is established, every other
                    period shown on the page is derived from that same annual
                    basis. This keeps all outputs internally consistent and
                    comparable.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily</strong> = annual ÷ 365
                    </li>
                    <li>
                      <strong>Weekly</strong> = daily × 7
                    </li>
                    <li>
                      <strong>Biweekly</strong> = daily × 14
                    </li>
                    <li>
                      <strong>4-week</strong> = daily × 28
                    </li>
                    <li>
                      <strong>Hourly</strong> = daily ÷ 24
                    </li>
                  </ul>

                  <p>
                    No output is chained from a rounded intermediate value. Each
                    line reconciles back to the same annual figure implied by
                    the monthly input.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing, precision, and safeguards
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Monthly inputs are parsed as decimal values. Currency
                    symbols are ignored for numeric parsing. Thousands
                    separators are treated as grouping characters.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>1,234</strong> → 1234
                    </li>
                    <li>
                      <strong>1.234</strong> → 1.234
                    </li>
                    <li>
                      Edge formats such as <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>

                  <p>
                    Computation preserves precision internally, up to twelve
                    decimal places. If an input could reasonably be interpreted
                    more than one way, the page blocks or warns instead of
                    producing a misleading result.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: printing + utility */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Printing and usage notes
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is marked no-print
                    so it does not appear in exported copies.
                  </p>

                  <p>
                    This page is designed for comparison, not scheduling. If
                    your rent is billed on fixed calendar dates, the equivalence
                    here gives you a common baseline before you look at timing
                    details.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                  Monthly labels can hide real differences
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Two listings can both say “monthly” and still imply different
                  annual costs once billing cycles are accounted for. This page
                  gives you a single annual equivalence so you can line numbers
                  up before deciding what actually fits.
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
