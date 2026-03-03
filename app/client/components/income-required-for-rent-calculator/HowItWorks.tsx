// app/client/components/income-required-for-rent-calculator/HowItWorks.tsx
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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight leading-tight">
                  How the income required for rent calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use a rent-to-income multiple (2x, 2.5x, 3x, or custom) to get
                  a clean gross-income requirement for a monthly rent, or flip
                  it to estimate your maximum rent from income. This is a quick
                  qualification check, not a full application decision. If you
                  want to convert rent between billing periods instead, use the{" "}
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent converter
                  </Link>
                  .
                </p>

                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    Rent to income: get required monthly and annual gross income
                    from a rent amount.
                  </li>
                  <li>
                    Income to rent: estimate the maximum monthly rent implied by
                    the same rule.
                  </li>
                  <li>
                    Treat outputs as screening equivalents, not a guarantee of
                    approval or invoice timing.
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Gross income
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  2x, 2.5x, 3x, custom
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent or income
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RULE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Income multiple
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  rent × multiple
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly + annual
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
              Related tools
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                If you want a broader affordability view beyond a simple gross
                multiple, the{" "}
                <Link
                  to="/how-much-rent-can-i-afford-calculator"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  how much rent can I afford calculator
                </Link>{" "}
                is a better fit.
              </li>
              <li>
                If a listing frames rent as a share of income, the{" "}
                <Link
                  to="/rent-as-percentage-of-income-calculator"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent as percentage of income calculator
                </Link>{" "}
                makes that comparison directly.
              </li>
              <li>
                If you need a quick net-based check, the{" "}
                <Link
                  to="/rent-after-tax-income-calculator"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent after-tax income calculator
                </Link>{" "}
                is closer to take-home budgeting.
              </li>
            </ul>

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
                      What this calculator returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <p>
                    You enter a monthly rent and a multiple, and you get the
                    required gross income per month and per year. In reverse
                    mode, you enter monthly gross income and get the maximum
                    rent allowed per month and per year.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      One-line summary
                    </div>
                    <p className="mt-2">
                      Required income = rent × multiple (monthly). Annual values
                      are the monthly results × 12. Reverse mode divides income
                      by the multiple to estimate max rent.
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Examples you can cross-check
                  </h3>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 1
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        $1,500 rent at 3x income
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Required monthly gross income: $4,500</li>
                        <li>Required annual gross income: $54,000</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 2 (reverse mode)
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        $6,000 monthly gross income at 2.5x rule
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Maximum monthly rent: $2,400</li>
                        <li>Maximum annual rent: $28,800</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    This tool does not interpret lease terms, debt ratios,
                    credit, guarantors, or what a landlord counts as “rent.” Use
                    it to screen and compare quickly, then match your inputs to
                    the rule being applied.
                  </p>
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
