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
          Use this page when you have a monthly rent number and want a yearly
          total that stays comparable across monthly and 4-week payment styles.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4 border-l-4 border-l-sky-200">
            <div className="text-sm font-semibold text-slate-800">
              This tool is for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Converting monthly rent into an annual total and showing the same
              value across common periods, so you can compare listings that mix
              “per month” with “every 4 weeks”.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It separates “annual equivalence” (365-day basis) from “payment
              schedule totals” (12 monthly payments vs 13 four-week payments),
              so you can see where the difference actually comes from.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Reproducing an exact lease total for a specific start date, since
              proration, due dates, leap years, and billing rules can change the
              real number.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-800 leading-relaxed">
              If you already have the yearly total and want the monthly
              equivalent, use{" "}
              <Link
                to="/annual-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Annual to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
