import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="max-w-6xl mx-auto px-6 pb-12 pt-8 rc-no-print"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-sky-800 tracking-tight">
          Who this tool is for
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                This tool is for
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Converting a weekly rent amount into a true 14-day biweekly
              equivalent for budgeting, comparing listings, or planning pay
              periods.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-emerald-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Why this tool is different
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              It anchors every result to one consistent annual total (365-day
              basis) and preserves exact decimals internally, so the breakdown
              stays coherent across weekly, biweekly, 4-week, and monthly views.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-rose-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                This tool is not for
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Calculating an exact lease invoice total that depends on due
              dates, proration rules, fees, utilities, or a landlord’s specific
              billing schedule.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-sky-50 p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-700"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                When to use another tool
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              If you already have a biweekly number and need to reverse it back
              to a 7-day weekly equivalent, use{" "}
              <Link
                to="/biweekly-to-weekly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Biweekly to Weekly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
