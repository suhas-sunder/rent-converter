import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mt-8 mb-12 rc-no-print"
      aria-label="Tool fit"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
                Who this rent per day tool is for
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Converting monthly, weekly, biweekly, 4-week (28-day),
                    hourly, or annual rent into a true rent-per-day number you
                    can compare across listings and budgets.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    Why this tool is different:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    It uses an annualized conversion path (365-day year, average
                    month of 365 ÷ 12) so the daily number stays consistent
                    across all periods instead of relying on “divide by 30”
                    shortcuts.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is not for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Calculating exact lease proration for a specific move-in or
                    move-out date, or matching landlord billing rules for
                    partial months, fees, and due-date policies.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    When to use another tool:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    If you already have a monthly amount and only need a daily
                    conversion (or want to go back to a monthly figure), use{" "}
                    <Link
                      to="/monthly-to-daily-rent-converter"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Monthly to Daily Rent Converter
                    </Link>{" "}
                    or{" "}
                    <Link
                      to="/daily-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Daily to Monthly Rent Converter
                    </Link>
                    . If your comparison is mostly weekly listings,{" "}
                    <Link
                      to="/rent-per-week-calculator"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Rent Per Week Calculator
                    </Link>{" "}
                    can be the more direct view.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">
                  Quick sanity check
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed ">
                  If someone tells you “$2,000 per month is about $66.67 per
                  day,” that assumes a 30-day month. This page keeps the implied
                  annual total consistent first, then derives the daily number
                  from that same basis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
