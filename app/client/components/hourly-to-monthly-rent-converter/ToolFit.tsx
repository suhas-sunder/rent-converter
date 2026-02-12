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
          Use this page when you have an hourly rent or rate and want a monthly
          equivalent that stays consistent with a 365-day year and an average
          month length.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4 border-l-4 border-l-sky-200">
            <div className="text-sm font-semibold text-slate-800">
              This tool is for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Converting an hourly amount into a monthly rent equivalent using
              annual equivalence (24 hours per day, 365 days per year), plus a
              period breakdown so you can sanity-check the scaling.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It uses decimal-safe math and makes the month definition explicit,
              so you can compare average-month results against 30-day thinking
              without rounding artifacts or hidden assumptions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Estimating what a property will actually charge over a month when
              pricing includes minimum stays, block-based billing, fees, or
              non-hourly rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-800 leading-relaxed">
              If you already have a monthly rent and want the hourly equivalent,
              use{" "}
              <Link
                to="/monthly-to-hourly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Monthly to Hourly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
