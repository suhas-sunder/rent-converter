import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section className="mt-8 mb-12 mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-sky-800 tracking-tight">
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Turning an every-14-days rent number into an annual equivalent so
              you can compare it against monthly listings or yearly totals.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              It shows the “payment-count shortcut” (biweekly × 26) next to a
              true day-based annualization (biweekly ÷ 14 × 365), so you can see
              the gap instead of guessing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is not for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Matching your exact lease ledger to the cent when proration, due
              dates, fees, utilities, or partial periods are involved.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              If your rent is billed every 28 days (not every 14), use{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Rent Paid Every 4 Weeks Calculator
              </Link>{" "}
              instead.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <div className="text-xs text-slate-600">Quick sanity check</div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed ">
            Biweekly and “twice per month” are not the same schedule. Biweekly
            is every 14 days (about 26 payments/year). Twice per month is a
            calendar schedule (24 payments/year). If you mix those up, the
            annual comparison will be off.
          </p>
        </div>
      </div>
    </section>
  );
}
