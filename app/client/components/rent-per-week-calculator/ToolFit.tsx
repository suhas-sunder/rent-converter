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
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-slate-800">Tool fit</p>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
                Who this weekly rent tool is for
              </h2>

              <p className="mt-3 text-slate-600 leading-7 max-w-prose">
                Use this page when you want a clean weekly number you can
                compare across listings that are priced monthly, every 4 weeks,
                biweekly, daily, hourly, or annually.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Converting any rent amount to a weekly equivalent using a
                    consistent annual basis (365-day year), then showing the
                    full breakdown across periods so you can sanity-check the
                    conversion.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    Common mistake it prevents:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Treating “monthly ÷ 4” as weekly. A month is not exactly 4
                    weeks, and “every 4 weeks” is its own cycle that often
                    implies 13 payments per year.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is not for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Exact calendar proration for a specific move-in date or
                    lease month length. Lease proration depends on lease terms,
                    billing months, due dates, and how partial periods are
                    handled.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    When to use another page:
                  </div>
                  <div className="mt-2 text-slate-800 leading-relaxed space-y-2">
                    <p>
                      If the listing is specifically “every 4 weeks,” use{" "}
                      <Link
                        to="/rent-paid-every-4-weeks-calculator"
                        className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Rent Paid Every 4 Weeks Calculator
                      </Link>{" "}
                      for a cycle-first view.
                    </p>
                    <p>
                      If you want a per-day comparison instead, use{" "}
                      <Link
                        to="/rent-per-day-calculator"
                        className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Rent Per Day Calculator
                      </Link>
                      .
                    </p>
                    <p>
                      If you want a full hub-style converter with all periods,
                      start at{" "}
                      <Link
                        to="/rent-calculator"
                        className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Rent Calculator
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">
                  Quick sanity check
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                  “Every 4 weeks” is exactly 28 days. That cadence typically
                  implies 13 payments per year, while monthly implies 12. Weekly
                  sits on a different axis (52 weeks per year). This is why
                  “weekly,” “4-week,” and “monthly” do not map cleanly without
                  an annual basis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
