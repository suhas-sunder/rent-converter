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
              Finding the real rent increase percentage between an old rent and
              a new rent, and seeing how that change looks across common billing
              periods.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              It computes the percent change from annual-equivalent totals using
              fixed-point math, so the percentage stays stable while the table
              cleanly compares monthly vs 4-week and other cycles.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Estimating your new rent from a proposed increase, projecting
              multiple increases, or checking whether an increase is legal in a
              specific location.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool:
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              If you have the current rent and want to calculate the new rent
              after a percent or fixed increase (and optionally project multiple
              steps), use the{" "}
              <Link
                to="/rent-increase-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                rent increase calculator
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Note: “Monthly” and “every 4 weeks” are different time lengths. This
          page shows both so you do not accidentally treat them as equivalent.
        </p>
      </div>
    </section>
  );
}
