import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mx-auto max-w-6xl px-6 pb-10 mt-2 scroll-mt-24"
      aria-labelledby="tool-fit-title"
    >
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <h2
            id="tool-fit-title"
            className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight"
          >
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold text-slate-500">
              This tool is for
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              This tool is for estimating your new rent after a percent or
              fixed-amount increase and seeing the impact across common billing
              periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              Why this tool is different: it annualizes first (365-day year),
              then converts, so monthly vs 4-week comparisons stay consistent
              instead of mixing assumptions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              This tool is not for forecasting your first post-increase payment
              when proration, mid-cycle effective dates, utilities, fees, or
              lease rules change what you actually owe.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              When to use another tool: if you already know the increase amount
              and just want the increase as a percentage, use the{" "}
              <Link
                to="/rent-increase-percentage-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
              >
                rent increase percentage calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
