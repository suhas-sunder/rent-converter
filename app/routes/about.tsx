import { useMemo } from "react";
import type { Route } from "./+types/about";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/about";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const meta: Route.MetaFunction = () => [
  { title: "About RentConverter.com" },
  {
    name: "description",
    content:
      "RentConverter.com is a free, privacy-first set of rent and housing calculators that convert between weekly, 4-week (28-day), biweekly, daily, hourly, monthly, and annual with decimal-safe math and clear assumptions.",
  },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "About RentConverter.com" },
  {
    property: "og:description",
    content:
      "Learn what RentConverter.com is, how the conversion math works, and who built it. Decimal-safe calculations and clear assumptions.",
  },
  { property: "og:url", content: PAGE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "About RentConverter.com" },
  {
    name: "twitter:description",
    content:
      "A free, privacy-first set of rent calculators with decimal-safe math and clear assumptions.",
  },
  { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

  { tagName: "link", rel: "canonical", href: PAGE_URL },
];

export default function About() {
  const highlightCards = useMemo(
    () => [
      {
        title: "Free and private",
        body: "No signup. No account required. Designed to be fast and simple.",
      },
      {
        title: "True monthly math",
        body: "Uses a day-rate model (365 ÷ 12 days per month) to avoid misleading shortcuts.",
      },
      {
        title: "Decimal-safe",
        body: "Preserves decimals end-to-end. Rounding is display-only and clearly labeled.",
      },
    ],
    [],
  );

  const includedNotIncluded = useMemo(
    () => ({
      included: [
        "Recurring rent amounts for the selected period",
        "Conversions across daily, weekly, biweekly, 4-week (28-day), monthly, hourly, and annual",
        "Side-by-side comparisons to help you spot pricing differences",
      ],
      notIncluded: [
        "Utilities, parking, internet, storage",
        "One-time fees, deposits, move-in incentives",
        "Taxes or local legal rules unless you include them in your number",
      ],
    }),
    [],
  );

  const faqData = useMemo(
    () => [
      {
        q: "What is RentConverter.com?",
        a: "RentConverter.com is a free set of rent and housing tools that help you compare prices across time periods using clear assumptions and decimal-safe math.",
      },
      {
        q: "Why does weekly or 4-week rent differ from monthly?",
        a: "Because a true month averages about 30.42 days (365 ÷ 12). Weekly is 7 days and a 4-week period is 28 days. Multiplying weekly rent by 4 can understate the true monthly equivalent.",
      },
      {
        q: "Do you round the math?",
        a: "Calculations preserve decimals end-to-end (up to 6 decimal places internally). Any rounding is display-only and clearly labeled so you can choose how many decimals to show.",
      },
      {
        q: "Do you store my inputs?",
        a: "No account is required. Your browser may store your last-used settings locally for convenience (for example, last selected period, currency, and rounding settings).",
      },
      {
        q: "Is this financial or legal advice?",
        a: "No. These calculators provide informational calculations only.",
      },
    ],
    [],
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [faqData],
  );

  const websiteSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    }),
    [],
  );

  const webPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About RentConverter.com",
      description:
        "RentConverter.com is a free, privacy-first set of rent and housing calculators that convert between periods using decimal-safe math and clear assumptions.",
      url: PAGE_URL,
    }),
    [],
  );

  const orgSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "RentConverter.com",
      url: SITE_URL,
      sameAs: ["https://suhassunder.com/"],
    }),
    [],
  );

  const personSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Suhas Sunder",
      jobTitle: "Software Developer",
      url: "https://suhassunder.com/",
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Ontario Tech University",
        },
      ],
      knowsAbout: [
        "Full-stack web development",
        "React",
        "TypeScript",
        "Remix",
        "Node.js",
        "PostgreSQL",
        "Prisma",
        "Web accessibility",
        "Performance engineering",
      ],
      sameAs: ["https://suhassunder.com/"],
    }),
    [],
  );

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              a[href]:after { content: ""; }
              #top-links, #bottom-nav, #export-controls { display: none !important; }
              .shadow-sm { box-shadow: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `,
        }}
      />

      <section className="mx-auto max-w-6xl px-6 pb-10 mt-2 sm:mt-6">
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col gap-3">
            <h1 className="text-center sm:text-left text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight">
              About RentConverter.com
            </h1>

            <p className="text-slate-700 leading-relaxed max-w-prose">
              RentConverter.com helps you compare rent and housing costs across
              different payment frequencies using clear assumptions and
              decimal-safe math. If a listing quotes a weekly, 4-week (28-day),
              biweekly, daily, hourly, or annual price, this site shows the true
              monthly equivalent so you can compare options fairly.
            </p>

            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {highlightCards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-sky-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-900">
                      {c.title}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 tracking-tight">
                  What the site does
                </h2>

                <ul className="mt-3 space-y-2 text-slate-700 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-600 flex-none" />
                    <span>
                      Converts rent between daily, weekly, every 2 weeks, every
                      4 weeks (28 days), monthly, hourly, and annual periods.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-600 flex-none" />
                    <span>
                      Shows true monthly equivalents using a consistent day-rate
                      model.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-600 flex-none" />
                    <span>
                      Includes calculators for common rent math: splits, due
                      dates, increases, affordability, and comparisons.
                    </span>
                  </li>
                </ul>

                <div className="mt-5 rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    What’s included (and not included)
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-slate-600">
                        Included
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 leading-relaxed">
                        {includedNotIncluded.included.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-none" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-slate-600">
                        Not included by default
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 leading-relaxed">
                        {includedNotIncluded.notIncluded.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-600 flex-none" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    If you want utilities or fees included, add them into the
                    amount you enter.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 shadow-sm relative">
                <div
                  className="absolute inset-x-0 top-0 h-0.5 bg-sky-200 rounded-t-2xl"
                  aria-hidden="true"
                />
                <h2 className="text-xl font-bold text-sky-800 tracking-tight">
                  How the conversion math works
                </h2>

                <p className="mt-3 text-slate-700 leading-relaxed max-w-prose">
                  RentConverter uses a consistent day-rate model. We convert
                  your input into a daily rate, then convert that daily rate
                  into the target period using fixed day counts:
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-medium text-slate-600">
                      Day counts used
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 leading-relaxed">
                      <li className="flex items-center justify-between gap-3">
                        <span>Daily</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          1 day
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Weekly</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          7 days
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Every 2 weeks</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          14 days
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Every 4 weeks</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          28 days
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Monthly</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          365 ÷ 12 days
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Annual</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          365 days
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-3">
                        <span>Hourly</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          24 hours/day
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-medium text-slate-600">
                      Why this matters
                    </div>
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                      The common shortcut “weekly × 4” assumes a month is always
                      28 days. A true month averages about{" "}
                      <strong className="text-slate-900 tabular-nums">
                        30.42 days
                      </strong>
                      . That gap is why 4-week pricing can look cheaper than
                      monthly but annualized costs can differ.
                    </p>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-emerald-50 px-3 py-3">
                      <div className="text-xs font-medium text-slate-600">
                        Practical takeaway
                      </div>
                      <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                        Compare listings on the same time basis (usually true
                        monthly). This tool makes that comparison consistent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="text-xs font-medium text-slate-600">
                    Precision and rounding
                  </div>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    Internally, conversions preserve decimals end-to-end (up to
                    6 decimal places). If rounding is enabled, it only affects
                    how numbers are displayed, not the underlying math.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 tracking-tight">
                  Built and maintained by
                </h2>

                <div className="mt-3">
                  <div className="text-lg font-bold text-slate-900">
                    Suhas Sunder
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    Software Developer
                  </div>

                  <p className="mt-3 text-slate-700 leading-relaxed">
                    I’m a software developer with professional experience
                    building and maintaining production web applications across
                    full-time, freelance, and consulting roles. I recently
                    completed a Master’s degree in Electrical and Computer
                    Engineering (December 2025) at Ontario Tech University, with
                    a strong focus on software engineering and applied,
                    project-based development.
                  </p>

                  <p className="mt-3 text-slate-700 leading-relaxed">
                    My work centers on reliable, user-friendly tools with an
                    emphasis on clean architecture, maintainability,
                    performance, and accessibility. RentConverter is actively
                    developed and improved over time.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://suhassunder.com/"
                      className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      suhasSunder.com
                    </a>
                    <a
                      href="/contact"
                      className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Contact
                    </a>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-3">
                    <div className="text-xs font-medium text-slate-600">
                      Note on accuracy
                    </div>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                      These tools are provided for informational purposes only.
                      While every effort is made to ensure accuracy, outputs may
                      not reflect fees, utilities, deposits, taxes, or local
                      rules unless you include them in your inputs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 tracking-tight">
                  Privacy-first by design
                </h2>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  RentConverter does not require an account. Some settings may
                  be stored locally in your browser for convenience (for
                  example, your last selected period, currency, and rounding
                  settings). For details, see the{" "}
                  <a
                    href="/privacy-policy"
                    className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-emerald-50 p-5 sm:p-6 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 tracking-tight">
                  Want to suggest a calculator?
                </h2>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  If you have a rent math use-case you want covered, send it via
                  the contact form. Practical requests drive what gets built
                  next.
                </p>
                <div className="mt-4">
                  <a
                    href="/contact"
                    className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-50"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </main>
  );
}
