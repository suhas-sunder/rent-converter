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
              Converting a weekly rent amount into a true monthly equivalent
              using a consistent 365-day annual basis, so you can compare weekly
              listings to monthly budgets without guesswork.
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
              It shows the monthly number and a 4-week (28-day) comparison from
              the same annual total and keeps exact decimals internally, so you
              can see where “4 weeks” diverges from “monthly.”
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
              Producing an exact lease billing amount that depends on due dates,
              proration, fees, utilities, or a landlord’s specific “monthly”
              definition.
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
              If you need to compare weekly rent to a true yearly total (for
              example, to benchmark against annual income or an annual lease
              quote), use{" "}
              <Link
                to="/weekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Annual Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
