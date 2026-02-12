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
              Turning a monthly rent number into a day-by-day cost using a
              consistent 365-day year, so you can compare rentals, short stays,
              and budgets on a per-day basis.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It does not assume a 30-day month. It converts via annual
              equivalence (365 ÷ 12 days per month) and keeps decimals intact,
              so “daily” stays comparable to weekly, biweekly, 4-week, and
              annual outputs.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Computing the exact amount you will be billed on specific calendar
              dates, including proration, move-in timing, lease fees, utilities,
              or rent that is charged strictly as “monthly ÷ days in this
              month.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              If you already know the daily amount and want the comparable
              monthly figure (for a monthly budget or a monthly listing), use{" "}
              <Link
                to="/daily-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Daily to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
