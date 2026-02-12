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
          Use this page when you want a true 365-day, 24-hours-per-day annual
          equivalent from an hourly rent or rate, with an optional paid-hours
          scenario for comparison.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4 border-l-4 border-l-sky-200">
            <div className="text-sm font-semibold text-slate-800">
              This tool is for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Turning an hourly amount into a yearly rent equivalent that is
              consistent across time periods (hourly, daily, weekly, monthly,
              annual) using a fixed 365-day year.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It keeps exact decimals internally and shows both 24/7 clock-hour
              annualization and a paid-hours-per-week scenario, so you can see
              how assumptions change the annual total.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Predicting what a landlord will bill in real life, since actual
              charges can include minimum stays, proration rules, fees, and
              contract terms that are not time-based.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-800 leading-relaxed">
              If you already know your annual rent and want the hourly
              equivalent instead, use{" "}
              <Link
                to="/annual-to-hourly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Annual to Hourly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
