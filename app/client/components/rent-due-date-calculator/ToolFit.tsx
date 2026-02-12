import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-6xl mx-auto px-6 pb-12 pt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-sky-800 tracking-tight text-center">
          Who this tool is for (and not for)
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              This tool is for:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Estimating upcoming rent due dates and visualizing how many
              payments fall into each month or year for monthly, weekly,
              biweekly, and 28-day billing cycles.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              It models real calendar placement of payments instead of
              flattening rent into averages, so timing distortions from 28-day
              and weekly cycles are visible.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Calculating affordability, budgeting thresholds, or validating
              lease terms such as grace periods or holiday adjustments.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              If you only need to compare how a 28-day billing cycle maps to a
              monthly amount (without dates or schedules), use the{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                rent paid every 4 weeks calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
