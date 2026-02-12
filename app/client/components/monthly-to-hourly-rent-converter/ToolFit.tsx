import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto px-6 pb-12 pt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight">
          Who this tool is for (and not for)
        </h2>

        <div className="mt-5 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900">
              This tool is for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Converting a monthly rent amount into a true per-hour equivalent
              so you can sanity-check costs and compare rent to other time-based
              numbers using the same assumptions across periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It converts via annual equivalence (365-day year and 365 ÷ 12
              average-month length) and preserves decimals end-to-end, plus it
              shows the 30-day-month hourly comparison so the assumption gap is
              visible instead of hidden.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Pricing short stays or calculating an exact bill for a specific
              lease month, including proration, fees, utilities, or “hours in
              this calendar month” math.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              If you already have an hourly figure and want the comparable
              monthly number (for a monthly budget or listing), use{" "}
              <Link
                to="/hourly-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Hourly to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
