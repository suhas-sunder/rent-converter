// routes/contact.tsx
import type { Route } from "./+types/contact";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/contact";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const meta: Route.MetaFunction = () => [
  { title: "Contact | RentConverter.com" },
  {
    name: "description",
    content:
      "Contact RentConverter.com with feedback, corrections, or questions about rent conversion tools and assumptions.",
  },
  { name: "robots", content: "index,follow" },
  { tagName: "link", rel: "canonical", href: PAGE_URL },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Contact | RentConverter.com" },
  {
    property: "og:description",
    content:
      "Send feedback, corrections, or questions about RentConverter.com tools and assumptions.",
  },
  { property: "og:url", content: PAGE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Contact | RentConverter.com" },
  {
    name: "twitter:description",
    content:
      "Send feedback, corrections, or questions about RentConverter.com tools and assumptions.",
  },
  { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
];

export default function Contact() {
  const pageName = "Contact";
  const canonicalUrl = PAGE_URL;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: pageName,
    url: canonicalUrl,
    description:
      "Contact RentConverter.com with feedback, corrections, or questions about rent conversion tools and assumptions.",
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 antialiased">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-3 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              Contact RentConverter.com
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
              Contact
            </h1>

            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-600">
              Send feedback, corrections, or questions about the rent
              conversion tools.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-sky-800">Email</h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Send a message to:
            </p>

            <p className="mt-4 text-base font-semibold text-slate-900">
              <a
                href="mailto:hello@rentconverter.com"
                className="cursor-pointer rounded text-sky-800 underline underline-offset-2 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                hello@rentconverter.com
              </a>
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-sky-50/60 px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-900">
                What to include
              </h3>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                <li>Rent amount and currency</li>
                <li>From period and to period</li>
                <li>Your expected result</li>
                <li>Country or region if relevant</li>
                <li>Page URL or screenshot if useful</li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Note</h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                RentConverter.com uses a 365-day year and average month length
                for comparison. Actual lease payments can differ based on due
                dates, prorations, fees, utilities, and local rules.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-600">
            Tools on this site are for budgeting and comparison. Always confirm
            payment schedules and lease terms in your agreement.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}