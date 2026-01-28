// routes/contact.tsx
import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = () => [
  { title: "Contact | RentConverter.com" },
  {
    name: "description",
    content:
      "Contact RentConverter.com for feedback, corrections, or questions about our rent conversion tools and assumptions.",
  },
  { name: "robots", content: "index,follow" },
  { rel: "canonical", href: "https://rentconverter.com/contact" },

  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:title", content: "Contact | RentConverter.com" },
  {
    property: "og:description",
    content:
      "Send feedback, corrections, or questions about our rent conversion tools and assumptions.",
  },
  { property: "og:url", content: "https://rentconverter.com/contact" },
  { property: "og:site_name", content: "RentConverter.com" },

  // Twitter
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: "Contact | RentConverter.com" },
  {
    name: "twitter:description",
    content:
      "Send feedback, corrections, or questions about our rent conversion tools and assumptions.",
  },
];

export default function Contact() {
  return (
    <main className="bg-white text-slate-700 antialiased min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-12 flex items-center">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight text-center">
            Contact
          </h1>
          <p className="mt-4 text-slate-700 text-center max-w-2xl mx-auto leading-relaxed">
            This page is for feedback and corrections. If something looks off in
            a conversion, include the rent amount, the “from” period, the “to”
            period, and what you expected.
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Send us a message at:
            </p>

            <p className="mt-4 text-base font-semibold text-slate-900">
              <a
                href="mailto:hello@rentconverter.com"
                className="cursor-pointer text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                hello@rentconverter.com
              </a>
            </p>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">
                What to include
              </h3>
              <ul className="mt-2 list-disc ml-5 text-sm text-slate-700 space-y-1 leading-relaxed">
                <li>Rent amount and currency</li>
                <li>From period and to period</li>
                <li>Your expected result (and why)</li>
                <li>Country/region if relevant</li>
                <li>A screenshot or URL of the page (optional)</li>
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                RentConverter.com uses a time-length model (365-day year and
                average month = 365 ÷ 12 days) for comparison. If your lease
                follows calendar-exact rules, results may differ slightly.
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-600 text-center leading-relaxed">
            Tools on this site are for budgeting and comparison. Always confirm
            payment schedules and lease terms in your agreement.
          </p>
        </div>
      </section>
    </main>
  );
}
