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
              Turning a US monthly rent due date into a simple{" "}
              <span className="font-semibold text-slate-900">
                “set aside this much per paycheck”
              </span>{" "}
              number, based on how you’re paid (weekly, biweekly, semi-monthly,
              or monthly). It’s built for renters who want rent fully covered
              before it’s due without relying on one big paycheck.
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
              It uses the{" "}
              <span className="font-semibold text-slate-900">
                actual paycheck count per year
              </span>{" "}
              (52, 26, 24, or 12), so biweekly and semi-monthly don’t get mixed
              up. That matters in the US because “every two weeks” creates{" "}
              <span className="font-semibold text-slate-900">
                two extra paychecks per year
              </span>{" "}
              compared with twice-a-month pay, which changes how much you should
              earmark each check.
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
              Predicting what your landlord will charge per paycheck. Most US
              leases are billed monthly, and exact cash flow depends on your pay
              dates, rent due date, proration, late fees, and add-ons like
              utilities or parking.
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
              If you’re trying to sanity-check your rent against a yearly budget
              (or compare it to annual income), use{" "}
              <Link
                to="/weekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Annual Rent Converter
              </Link>
              . If your rent is advertised weekly and you need a monthly
              equivalent first, start with{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                rent converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
