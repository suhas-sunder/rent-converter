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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Weekly to annual rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a weekly rent amount into an annual total
                  so you can compare listings and budget on a yearly basis. It
                  supports two common framings that people mix up:{" "}
                  <span className="font-semibold text-slate-900">
                    a time-based 365-day equivalence
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-slate-900">
                    a 52-payment schedule shortcut
                  </span>
                  . The tool keeps both visible so you can choose the one that
                  matches what you are trying to compare.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Weekly = 7 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual basis shown
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly rent amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365-day equivalence
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CONTEXT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly × 52 (schedule)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You enter a weekly rent amount and the page produces an
                    annual figure in a way that stays consistent with the rest
                    of the breakdown. The primary annual number is computed
                    using a{" "}
                    <span className="font-semibold text-slate-900">
                      365-day model
                    </span>{" "}
                    where a week is treated as{" "}
                    <span className="font-semibold text-slate-900">7 days</span>
                    .
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual (time-based)
                      </span>{" "}
                      = weekly × 7 × 365 ÷ 7 = weekly × 365 ÷ 7
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Equivalent form: daily = weekly ÷ 7, then annual = daily ×
                      365.
                    </p>
                  </div>

                  <p>
                    You may also see{" "}
                    <span className="font-semibold text-slate-900">
                      weekly × 52
                    </span>{" "}
                    shown as a separate line. That is a schedule shortcut that
                    matches how some leases and budgets are framed, but it is
                    not the same as a 365-day equivalence. The tool keeps them
                    separate so you do not accidentally mix schedule counting
                    with time-length conversion.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why there are two answers */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Why weekly to annual can yield two reasonable numbers
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Weekly rent is sometimes treated as a pure rate (a 7-day
                    price), and sometimes treated as a payment schedule (52
                    weekly payments). Both are used in real conversations, and
                    the gap between them is small but real because{" "}
                    <span className="font-semibold text-slate-900">
                      365 days is about 52.14 weeks
                    </span>
                    .
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Time-based equivalence
                      </div>
                      <p className="mt-2">
                        Uses days as the source of truth. Weekly is converted
                        through daily, then scaled to a 365-day year. Best for
                        comparisons across periods in the breakdown.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Payment schedule shortcut
                      </div>
                      <p className="mt-2">
                        Assumes 52 payments. Useful when a lease literally
                        collects a fixed number of weekly payments in a defined
                        year frame.
                      </p>
                    </div>
                  </div>

                  <p>
                    The converter is built to keep the breakdown internally
                    consistent. That means it prefers time-length conversion for
                    the annual basis, and then derives monthly (average), 4-week
                    (28-day), biweekly (14-day), and daily views from the same
                    annual number.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: examples + input formats */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples match the tool’s intent: compute an annual
                    total on a 365-day basis, then show consistent equivalents.
                    Display rounding can change the last few digits, but the
                    math rule is the same.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Weekly rent{" "}
                      <strong className="text-slate-900">$500</strong> →
                      time-based annual{" "}
                      <strong className="text-slate-900">
                        $500 × 365 ÷ 7 ≈ $26,071.43
                      </strong>
                    </li>
                    <li>
                      Weekly rent{" "}
                      <strong className="text-slate-900">$500</strong> →
                      schedule annual{" "}
                      <strong className="text-slate-900">
                        $500 × 52 = $26,000
                      </strong>
                    </li>
                    <li>
                      Input <strong className="text-slate-900">1,234</strong> →
                      comma is treated as thousands grouping (1234). If you
                      meant a decimal, use{" "}
                      <strong className="text-slate-900">1.234</strong>.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input formats supported
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Decimals:{" "}
                        <strong className="text-slate-900">1200.50</strong>,{" "}
                        <strong className="text-slate-900">.5</strong>,{" "}
                        <strong className="text-slate-900">12.</strong>
                      </li>
                      <li>
                        Thousands grouping:{" "}
                        <strong className="text-slate-900">1,200</strong>,{" "}
                        <strong className="text-slate-900">1,200.50</strong>
                      </li>
                      <li>
                        Currency symbols are ignored for parsing:{" "}
                        <strong className="text-slate-900">$1,200.50</strong>
                      </li>
                    </ul>
                  </div>

                  <p>
                    If an input could reasonably be interpreted more than one
                    way, the correct behavior is to warn or block instead of
                    guessing and returning a clean-looking but incorrect result.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                  Equivalent conversion is not a lease billing engine
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page is designed for consistent comparisons across
                  periods. If you need calendar due dates or want to count
                  actual weekly payments over a specific date range, use a
                  due-date schedule tool instead of relying on annual
                  equivalents.
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

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>
              ,{" "}
              <Link
                to="/monthly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                monthly to annual rent
              </Link>
              , and{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
