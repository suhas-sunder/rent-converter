import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="max-w-5xl mx-auto px-6 pb-12 pt-8 rc-no-print"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-800 tracking-tight text-center">
          Who this tool is for (and not for)
        </h2>

        <p className="mt-3 text-slate-700 leading-relaxed  mx-auto text-center">
          Use this calculator when you want quick rent caps based on your income
          and a chosen pay period, shown consistently across monthly, weekly,
          and 4-week cycles.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4 border-l-4 border-l-sky-200">
            <div className="text-sm font-semibold text-slate-800">
              This tool is for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Estimating affordable rent levels by applying common income-share
              targets to your income, then converting the results into multiple
              billing cycles for easy comparison.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It annualizes your selected income period first, so the monthly,
              weekly, and 28-day outputs stay aligned instead of mixing calendar
              shortcuts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Replacing a full budget or underwriting decision, since utilities,
              debt, childcare, savings goals, and location costs can change what
              is truly workable.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-800 leading-relaxed">
              If you already know your rent and want to see what percentage of
              income it represents, use{" "}
              <Link
                to="/rent-as-percentage-of-income-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent as Percentage of Income Calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
