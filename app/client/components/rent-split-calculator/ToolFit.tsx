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
              Splitting one rent amount equally across roommates, then comparing
              each person’s share across common billing periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Why this tool is different:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              It normalizes everything through an annual total so monthly and
              4-week billing cycles are not treated as interchangeable.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              This tool is not for:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Uneven splits, shared-room weighting, or mixing rent with
              utilities, parking, or one-off side agreements.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              When to use another tool:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              If you are budgeting the full household rent (not per person), use{" "}
              <Link
                to="/rent-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent Calculator
              </Link>
              . If your rent lines up with paydays, use{" "}
              <Link
                to="/rent-per-paycheck-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent per Paycheck Calculator
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Quick sanity check:
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            If your lease says “monthly” but you actually pay every 4 weeks, the
            per-person amount drifts over a year. This page shows both so the
            split stays comparable across schedules.
          </p>
        </div>
      </div>
    </section>
  );
}
