import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto px-6 pt-6 pb-12">
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
              Converting a monthly rent quote into a true 14-day biweekly amount
              so you can budget by pay cycle and compare against biweekly-priced
              listings without guessing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              Why this tool is different:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              It uses annual equivalence (average month length) and keeps
              decimals end-to-end, so the biweekly value is not a vague “monthly
              ÷ 2” shortcut and the monthly vs 4-week gap is made explicit.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              This tool is not for:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Calculating your exact lease billing totals on specific calendar
              dates, including proration, fees, utilities, or a landlord’s
              payment schedule rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              When to use another tool:
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              If you already have a biweekly number and need the comparable
              monthly figure (for a monthly budget, listings, or reporting), use{" "}
              <Link
                to="/biweekly-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Biweekly to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
