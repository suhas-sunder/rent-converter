import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mx-auto max-w-6xl px-6 pb-10 mt-8 scroll-mt-24"
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
              This tool is for estimating how much of your take-home pay goes to
              rent when you only have pre-tax income and a single effective tax
              rate.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              Why this tool is different: it annualizes both income and rent
              first, then converts across pay cycles, so the rent percentage is
              comparable even when your inputs use different periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              This tool is not for calculating true net pay from real tax
              brackets, deductions, benefits, payroll timing, or local
              withholding rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              When to use another tool: if you already know your monthly
              take-home pay and just want a quick rent share check, use the{" "}
              <Link
                to="/rent-vs-take-home-pay-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
              >
                rent vs take-home pay calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
