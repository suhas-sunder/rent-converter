import { Link } from "react-router";
import { JsonLd, buildMeta, makePageSchemas } from "~/client/utils/seo";

const config = {
  path: "/methodology",
  title: "Calculation Methodology | RentConverter",
  description:
    "See how RentConverter handles rent-period normalization, validation, dates, rounding, browser storage, and testing.",
  breadcrumbName: "Calculation methodology",
};

export const meta = () => buildMeta(config);

const sections = [
  {
    title: "Purpose and scope",
    body: "This page documents how RentConverter implements its calculators: the formulas and period assumptions they use, how inputs are checked, and the limits of the results. It describes software behavior, not legal or financial rules.",
  },
  {
    title: "Rent-period normalization",
    body: "Many rent comparisons first normalize a stated amount to an annual or daily basis, then convert it to the requested period. Weekly values use a 365-day year divided into 7-day weeks; calendar-month values use 12 months per year. Fortnightly and biweekly rent are 14-day periods, while a four-week amount is a 28-day cycle. Biweekly and semimonthly are different schedules and are not treated as interchangeable.",
  },
  {
    title: "Currency behavior",
    body: "The selected currency controls symbols and number formatting. It does not convert one currency into another, and RentConverter does not use a live exchange-rate feed. Amounts remain in the currency the user selects.",
  },
  {
    title: "Precision and display rounding",
    body: "Several core rent conversions store money in cents and use integer arithmetic before formatting a displayed amount. Other focused calculators use validated numeric inputs where that fits their calculation. Displayed money is rounded to cents, so independently rounded values can differ slightly from an unrounded intermediate value. Where an equal split leaves cents over, the allocation guidance identifies how many participants pay one cent more so the displayed allocation reconciles to the displayed total.",
  },
  {
    title: "Input validation",
    body: "Inputs are checked before dependent results are shown. Malformed values are rejected, whole-number fields reject decimals, and negative values are rejected when they are not meaningful. Relevant controls show visible errors. Some tools restore saved browser values only after hydration; invalid stored values are ignored rather than applied.",
  },
  {
    title: "Dates and schedules",
    body: "Date tools use date-only values so their calculations do not depend on a visitor’s time zone. Lease terms use calendar-month arithmetic, and month-end dates are clamped when the same numbered day does not exist in a later month. Leap-day and month-end cases are covered by permanent tests. A written lease or agreement remains the authority for a contractual date.",
  },
  {
    title: "Saved browser state",
    body: "Some calculators use localStorage to restore values in the same browser. Restoration happens after hydration and saved values are validated before use. This storage is not an account and does not synchronize between devices; clearing browser storage can reset saved calculator values.",
  },
  {
    title: "Testing and release checks",
    body: "The repository includes permanent calculation tests, TypeScript checks, production builds, route and redirect audits, breadcrumb and sitemap checks, raw server-rendered response checks, and selected browser, hydration, and console checks. These practices help catch regressions, but they are not a promise that every result or page is free from error.",
  },
  {
    title: "Regional information and corrections",
    body: "Arithmetic results do not establish legal permission, lease meaning, or eligibility. Regional rules, exemptions, notices, and guidelines can change and need current primary-source review. Report calculation errors, unclear assumptions, broken pages, or outdated information through the contact page.",
  },
];

export default function MethodologyPage() {
  const schemas = makePageSchemas(config);

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <JsonLd schemas={schemas} />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="rc-page-eyebrow">RentConverter transparency</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            Calculation methodology
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            How RentConverter turns rental formulas into browser-based tools,
            including period assumptions, rounding, validation, dates, saved
            state, testing, and limitations.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-50 px-5 py-4">
              <h2 className="text-lg font-bold text-sky-900">Representative formulas</h2>
              <p className="mt-3 break-words font-mono text-sm font-semibold text-slate-950">
                weekly to monthly = weekly amount × 365 ÷ 7 ÷ 12
              </p>
              <p className="mt-3 break-words font-mono text-sm font-semibold text-slate-950">
                monthly to weekly = monthly amount × 12 × 7 ÷ 365
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-5 py-4">
              <h2 className="text-lg font-bold text-sky-900">A useful distinction</h2>
              <p className="mt-3 leading-7">
                Weekly rent × 4 is a 28-day amount. It is not the same as an
                average calendar-month equivalent.
              </p>
            </div>
          </div>

          <div className="mt-9 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-bold tracking-tight text-sky-800">
                  {section.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-700">{section.body}</p>
                {section.title === "Saved browser state" ? (
                  <p className="mt-3 leading-7 text-slate-700">
                    See the <Link to="/privacy-policy" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">privacy policy</Link>{" "}
                    and <Link to="/cookies" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">cookie and storage page</Link>{" "}
                    for the implemented browser-storage and analytics behavior.
                  </p>
                ) : null}
                {section.title === "Regional information and corrections" ? (
                  <p className="mt-3">
                    <Link to="/contact" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                      Contact RentConverter about a correction or issue.
                    </Link>
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
