import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mt-8 mb-12 rc-no-print"
      aria-label="Who this tool is for"
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
                Who this tool is for and when to use something else
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Comparing a rent amount billed every 4 weeks (28 days) to a
                    true monthly and annual equivalent for budgeting and listing
                    comparisons.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    Why this tool is different:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    It keeps a single annual “source of truth” (365-day year) so
                    the 4-week, weekly, monthly, and annual numbers stay
                    consistent instead of mixing calendar-month math with
                    fixed-day cycles.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is not for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Predicting your exact lease billing schedule, due dates,
                    prorations, fees, or what your landlord will do in months
                    where the 28-day cycle “drifts” across the calendar.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    When to use another tool:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    If you already have a monthly rent number and want the
                    weekly equivalent (or the reverse), use{" "}
                    <Link
                      to="/monthly-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Monthly to Weekly Rent Converter
                    </Link>{" "}
                    or{" "}
                    <Link
                      to="/weekly-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Weekly to Monthly Rent Converter
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">
                  Quick rule of thumb
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed ">
                  Use this page when the input is a fixed 28-day payment. If
                  your input is a calendar-month amount (like “$2,000 per
                  month”), switch to a monthly-to-annual or monthly-to-weekly
                  converter so you do not accidentally compare unlike schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
