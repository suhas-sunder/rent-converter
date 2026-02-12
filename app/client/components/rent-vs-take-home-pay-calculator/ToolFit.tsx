import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mx-auto max-w-6xl px-6 pb-12 mt-8"
      aria-label="Tool fit"
    >
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              This tool is for:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Measuring how much of your take-home pay goes to rent and what you
              keep after rent, even when pay and rent use different periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Why this tool is different:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              It annualizes both numbers on a 365-day basis first, so “monthly,”
              “weekly,” and “every 4 weeks” stay comparable instead of being
              mixed as if they’re the same length of time.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              This tool is not for:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Estimating taxes or gross-to-net pay, and it is not a full budget
              tool for utilities, debt payments, or other expenses beyond rent.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              When to use another tool:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              If you want rent as a percentage of income without focusing on
              take-home pay, use{" "}
              <Link
                to="/rent-as-percentage-of-income-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent as Percentage of Income
              </Link>
              . If you need to estimate take-home pay from gross income, use{" "}
              <Link
                to="/rent-after-tax-income-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent After-Tax Income
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Quick check:
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            If you’re paid every 2 weeks or every 4 weeks, the “monthly” number
            that feels right can drift across the year. The monthly, weekly, and
            4-week rows help you compare rent pressure in the same units.
          </p>
        </div>
      </div>
    </section>
  );
}
