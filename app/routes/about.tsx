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
      "Learn what RentConverter.com does, how the rent conversion math works, and what assumptions the calculators use.",
  },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "About RentConverter.com" },
  {
    property: "og:description",
    content:
      "Learn what RentConverter.com does, how the rent conversion math works, and what assumptions the calculators use.",
  },
  { property: "og:url", content: PAGE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "About RentConverter.com" },
  {
    name: "twitter:description",
    content:
      "Learn what RentConverter.com does, how the rent conversion math works, and what assumptions the calculators use.",
  },
  { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

  { tagName: "link", rel: "canonical", href: PAGE_URL },
];

export default function About() {
  const highlightCards = useMemo(
    () => [
      {
        title: "Free to use",
        body: "No signup required. Open the calculator, enter an amount, and compare rent periods.",
      },
      {
        title: "Clear assumptions",
        body: "The tools use consistent day counts so weekly, biweekly, 4-week, monthly, hourly, and annual amounts can be compared.",
      },
      {
        title: "Display-only rounding",
        body: "Calculations preserve decimals. Rounding only changes what is shown on screen.",
      },
    ],
    [],
  );

  const includedNotIncluded = useMemo(
    () => ({
      included: [
        "Recurring rent amounts for the selected period",
        "Conversions across daily, weekly, biweekly, 4-week, monthly, hourly, and annual periods",
        "Side-by-side breakdowns for comparing different rent periods",
      ],
      notIncluded: [
        "Utilities, parking, internet, or storage",
        "One-time fees, deposits, or move-in incentives",
        "Taxes or local legal rules unless you include them in your input",
      ],
    }),
    [],
  );

  const faqData = useMemo(
    () => [
      {
        q: "What is RentConverter.com?",
        a: "RentConverter.com is a set of rent calculators for converting rent between common payment periods.",
      },
      {
        q: "Why does weekly or 4-week rent differ from monthly rent?",
        a: "Weekly rent is based on 7 days. A 4-week amount is based on 28 days. An average month is about 30.42 days, so the amounts do not match exactly.",
      },
      {
        q: "Do the calculators round the math?",
        a: "Rounding is display-only. The calculators keep decimal precision through the calculation, then round only the values shown on screen when rounding is enabled.",
      },
      {
        q: "Do you store my inputs?",
        a: "No account is required. Your browser may store last-used settings locally, such as currency and rounding preferences.",
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
        "Learn what RentConverter.com does, how the rent conversion math works, and what assumptions the calculators use.",
      url: PAGE_URL,
      isPartOf: {
        "@type": "WebSite",
        name: "RentConverter.com",
        url: SITE_URL,
      },
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 antialiased scroll-smooth">
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10 pt-3 sm:pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-5 shadow-sm sm:px-8 sm:py-7">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              About the site
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
              About RentConverter.com
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-slate-600">
              RentConverter.com helps compare rent across different payment
              periods. Enter a rent amount, choose the period, and see the
              matching daily, weekly, biweekly, 4-week, monthly, hourly, or
              annual amount.
            </p>

            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {highlightCards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-slate-200 bg-sky-50/60 p-4 shadow-sm"
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
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold tracking-tight text-sky-800">
                  What the site does
                </h2>

                <ul className="mt-3 space-y-2 leading-relaxed text-slate-700">
                  <li className="flex gap-2">
                    <span
                      className="mt-2 h-2 w-2 flex-none rounded-full bg-sky-600"
                      aria-hidden="true"
                    />
                    <span>
                      Converts rent between daily, weekly, every 2 weeks, every
                      4 weeks, monthly, hourly, and annual periods.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span
                      className="mt-2 h-2 w-2 flex-none rounded-full bg-sky-600"
                      aria-hidden="true"
                    />
                    <span>
                      Uses consistent day counts so different rent periods can
                      be compared on the same basis.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span
                      className="mt-2 h-2 w-2 flex-none rounded-full bg-sky-600"
                      aria-hidden="true"
                    />
                    <span>
                      Includes tools for rent splits, due dates, increases,
                      affordability, and related rent comparisons.
                    </span>
                  </li>
                </ul>

                <div className="mt-5 rounded-xl border border-slate-200 bg-sky-50/60 px-4 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    What’s included
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-slate-600">
                        Included
                      </div>
                      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                        {includedNotIncluded.included.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span
                              className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-600"
                              aria-hidden="true"
                            />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                      <div className="text-xs font-medium text-slate-600">
                        Not included by default
                      </div>
                      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                        {includedNotIncluded.notIncluded.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span
                              className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-400"
                              aria-hidden="true"
                            />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    If you want utilities or fees included, add them into the
                    amount you enter.
                  </p>
                </div>
              </div>

              <div className="relative mt-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
                <div
                  className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-sky-500 to-emerald-400"
                  aria-hidden="true"
                />

                <h2 className="text-xl font-bold tracking-tight text-sky-800">
                  How the conversion math works
                </h2>

                <p className="mt-3 max-w-prose leading-relaxed text-slate-700">
                  The calculators use a consistent day-rate model. Your input is
                  converted to a daily amount, then converted into the target
                  period.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-medium text-slate-600">
                      Day counts used
                    </div>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
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
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      The shortcut “weekly × 4” assumes a month is 28 days. An
                      average month is about{" "}
                      <strong className="tabular-nums text-slate-900">
                        30.42 days
                      </strong>
                      , so a 4-week amount and a monthly amount are not the
                      same.
                    </p>

                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                      <div className="text-xs font-medium text-emerald-700">
                        Practical use
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        Compare listings using the same period, usually monthly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="text-xs font-medium text-slate-600">
                    Precision and rounding
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    Calculations preserve decimals end-to-end. If rounding is
                    enabled, it only affects the displayed value.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold tracking-tight text-sky-800">
                  Built and maintained by
                </h2>

                <div className="mt-3">
                  <div className="text-lg font-bold text-slate-900">
                    Suhas Sunder
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    Software Developer
                  </div>

                  <p className="mt-3 leading-relaxed text-slate-700">
                    I’m a software developer with professional experience
                    building and maintaining production web applications across
                    full-time, freelance, and consulting roles.
                  </p>

                  <p className="mt-3 leading-relaxed text-slate-700">
                    I built RentConverter to make rent comparisons easier to
                    check without relying on rough shortcuts.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://suhassunder.com/"
                      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      suhasSunder.com
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      Contact
                    </a>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-sky-50/60 px-4 py-3">
                    <div className="text-xs font-medium text-slate-600">
                      Accuracy note
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      These tools are for informational calculations. Results
                      may differ from a lease if fees, deposits, utilities,
                      taxes, prorations, or local rules apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold tracking-tight text-sky-800">
                  Privacy
                </h2>
                <p className="mt-3 leading-relaxed text-slate-700">
                  RentConverter does not require an account. Some settings may
                  be stored locally in your browser for convenience, such as
                  currency and rounding settings. For details, see the{" "}
                  <a
                    href="/privacy-policy"
                    className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-2 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold tracking-tight text-sky-800">
                  Suggest a calculator
                </h2>
                <p className="mt-3 leading-relaxed text-slate-700">
                  Have a rent calculation you want covered? Send the use case
                  through the contact page.
                </p>
                <div className="mt-4">
                  <a
                    href="/contact"
                    className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-3xl text-center text-slate-600">
          These answers cover the site’s assumptions, rounding behavior, and
          intended use.
        </p>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 max-w-prose leading-relaxed text-slate-700">
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
