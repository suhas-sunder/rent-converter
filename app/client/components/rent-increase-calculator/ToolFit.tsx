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
              Calculating your new rent after a percent or fixed increase and
              seeing the annual impact plus equivalent amounts across pay and
              billing cycles.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              It preserves exact decimals end-to-end and compares cycles by
              annualizing first, so weekly, 4-week, and monthly equivalents stay
              consistent.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Checking legal limits, rent-control compliance, notice rules, or
              whether a landlord is allowed to apply a specific increase.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              If you already know both the old rent and the new rent and only
              want the percent change, use the{" "}
              <Link
                to="/rent-increase-percentage-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                rent increase percentage calculator
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Tip: If your rent is billed every 4 weeks (28 days), compare that line
          directly instead of treating it as monthly.
        </p>
      </div>
    </section>
  );
}
