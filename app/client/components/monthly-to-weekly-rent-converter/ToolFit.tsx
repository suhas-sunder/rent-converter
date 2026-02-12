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
              Converting a monthly rent price into a true 7-day weekly amount so
              you can compare weekly-advertised listings to monthly rent without
              accidentally treating 4-week pricing as “weekly.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It uses annual equivalence (365 ÷ 12 average-month length) and
              keeps decimals intact, then explicitly contrasts weekly with
              4-week (28-day) pricing so the “4 weeks is not a month” issue is
              impossible to miss.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Producing the exact amount your landlord will bill in a given
              month, including proration, fees, utilities, or schedules like
              “rent is due on the 1st” and “four payments equals a month.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              If you already have a weekly number and need the comparable
              monthly figure for a monthly budget or listing, use{" "}
              <Link
                to="/weekly-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
