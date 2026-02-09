import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm"
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
                <h2 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the rent conversion calculator works
                </h2>
                <p className="text-center sm:text-left mt-2 text-slate-600 leading-7 max-w-2xl">
                  This tool converts a rent amount from one billing period into
                  equivalent amounts for other periods using a consistent
                  day-based model. It is designed for direct comparison. You
                  enter the number as written, select the period it applies to,
                  and get conversions plus a full breakdown.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Day-based model
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Decimals preserved
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  MODEL
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Period → per-day
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Converted values
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DETAILS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: What it does */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
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
                      What this rent conversion tool gives you
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You provide a rent amount and select the period it applies
                    to (weekly, monthly, every 4 weeks, biweekly, daily, hourly,
                    or annual). The tool returns a headline conversion to your
                    selected target and a breakdown across common periods so you
                    can compare values without switching calculators.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      A consistent conversion model across weekly vs monthly
                      rent, 28-day rent, and annual equivalents
                    </li>
                    <li>
                      Decimals preserved end-to-end so $1,234.56 stays $1,234.56
                      throughout the math
                    </li>
                    <li>
                      Display rounding only, when shown, with the underlying
                      precision retained in the calculations
                    </li>
                    <li>
                      A readable breakdown you can print and save as a PDF from
                      your browser
                    </li>
                  </ul>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Quick converters
                      </div>
                      <p className="mt-2">
                        If you only need one direction, use a dedicated page for
                        faster input and cleaner output.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <Link
                          to="/weekly-to-monthly-rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Weekly to monthly →
                        </Link>
                        <Link
                          to="/rent-billed-every-4-weeks-calculator"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Rent billed every 28 days →
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Due date planning
                      </div>
                      <p className="mt-2">
                        If you need calendar dates (not just equivalents), use
                        the due-date tool.
                      </p>
                      <div className="mt-3 text-sm">
                        <Link
                          to="/rent-due-date-calculator"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Rent due date calculator →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Inputs */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
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
                      Inputs and accepted formats
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter the rent exactly as shown in the listing. You can
                    include decimals. If you paste values that include commas or
                    currency symbols, the input is interpreted as a number and
                    converted.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Examples of valid input
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>1200</li>
                      <li>1200.50</li>
                      <li>1,200.50</li>
                      <li>$1,200.50</li>
                      <li>.5 (interpreted as 0.5)</li>
                    </ul>
                  </div>

                  <p>
                    Then select the period the number applies to. If the listing
                    says “every 4 weeks” or “every 28 days,” choose the 4-week
                    option. If it says “biweekly,” choose biweekly. If the
                    listing is monthly, choose monthly.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Assumptions */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
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
                      Assumptions used in conversions
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Conversions are calculated through a per-day rate. Period
                    lengths are fixed so the model stays consistent across every
                    conversion on the site.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Period lengths
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Week:
                        </span>{" "}
                        7 days
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Every 4 weeks:
                        </span>{" "}
                        28 days
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Year:
                        </span>{" "}
                        365 days
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Average month:
                        </span>{" "}
                        365 ÷ 12 ≈ 30.42 days
                      </li>
                    </ul>
                  </div>

                  <p>
                    If you need calendar-specific schedules (for example, “due
                    on the 1st”), conversions are still useful for comparing
                    value, but dates come from the due-date calculator instead
                    of the conversion model.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Output + rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
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
                      Output you get and how rounding is handled
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You get a primary converted result plus a breakdown across
                    other periods. The breakdown is meant for comparison across
                    listings that quote different billing cycles.
                  </p>

                  <p>
                    Rounding is display-only. The underlying calculation keeps
                    your decimals, then formats the final values for
                    readability. If a value is shown with fewer decimals, it is
                    not because precision was discarded during the math. This
                    avoids “looks clean but compares wrong” outputs.
                  </p>

                  <div className="mt-4 rounded-2xl bg-sky-50 ring-1 ring-sky-200/70 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Practical note for 4-week (28-day) listings
                    </div>
                    <p className="mt-2">
                      “Every 4 weeks” is a fixed 28-day cycle. When you convert
                      it to a monthly equivalent, you are comparing on the
                      monthly scale using the model’s average month length. That
                      is the intended use of the conversion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark callout block like the reference file */}
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
                  Conversions are equivalents, not calendar promises
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This tool converts amounts by time coverage using fixed period
                  lengths. It does not generate or predict calendar payment
                  dates. If you need the exact sequence of due dates for a lease
                  schedule, use the due-date calculator.
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
