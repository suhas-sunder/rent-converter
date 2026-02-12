import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto pb-12 pt-8 px-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#f7fbff] border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight">
              Who this tool is for (and not for)
            </h2>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            Use this page when you want an annual price expressed as a clean
            month-by-month number.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:p-8">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Turning a yearly rent total into a monthly equivalent (annual ÷
              12) so you can compare listings and budget in “per-month” terms.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              It keeps the annual total as the source of truth, preserves exact
              decimals, and makes the “monthly vs 4-week” and “12 vs 13
              payments” mismatch obvious instead of hiding it behind rounding or
              shortcuts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is not for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Reproducing your exact rent due dates or lease proration rules.
              It’s a conversion and comparison view, not a billing calendar.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              When to use another tool
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              If you already know the monthly number and want to see what that
              implies over a full year, use the{" "}
              <Link
                to="/monthly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
              >
                monthly to annual rent converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
