import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="max-w-5xl mx-auto pb-12 pt-8 px-6 rc-no-print"
      aria-labelledby="tool-fit-title"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2
          id="tool-fit-title"
          className="text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight text-center"
        >
          Is this the right tool for you?
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is for
            </div>
            <p className="mt-1 text-slate-700">
              converting a weekly rent amount into a true annual equivalent so
              you can compare weekly listings against yearly budgets or housing
              costs.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-1 text-slate-700">
              it uses time-based annualization (365 days) and shows
              payment-count shortcuts side by side, so you see real cost
              differences instead of implied totals.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is not for
            </div>
            <p className="mt-1 text-slate-700">
              calculating your exact lease total or payment schedule, which
              depends on start dates, due dates, and proration rules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              When to use another tool
            </div>
            <p className="mt-1 text-slate-700">
              if you already know your yearly rent and need the weekly figure,
              use the{" "}
              <Link
                to="/annual-to-weekly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                annual to weekly rent converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
