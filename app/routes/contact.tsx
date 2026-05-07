// routes/contact.tsx
import type { Route } from "./+types/contact";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/contact";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const meta: Route.MetaFunction = () => [
  { title: "Contact RentConverter.com | Feedback and Corrections" },
  {
    name: "description",
    content:
      "Contact RentConverter.com with calculator feedback, corrections, or questions about rent conversion assumptions and rental math pages.",
  },
  { name: "robots", content: "index,follow" },
  { tagName: "link", rel: "canonical", href: PAGE_URL },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Contact RentConverter.com | Feedback and Corrections" },
  {
    property: "og:description",
    content:
      "Send feedback, corrections, or questions about RentConverter.com tools and assumptions.",
  },
  { property: "og:url", content: PAGE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Contact RentConverter.com | Feedback and Corrections" },
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
      "Contact RentConverter.com with calculator feedback, corrections, or questions about rent conversion assumptions and rental math pages.",
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 antialiased">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
          <div className="mx-auto text-center">
            <div className="mx-auto mb-3 rc-page-eyebrow">
              Contact RentConverter.com
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
              Contact
            </h1>

            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-700">
              Send feedback, corrections, or questions about the rent
              conversion tools.
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-2xl rounded-[1.5rem] bg-sky-50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-sky-800">Email</h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Send a message to:
            </p>

            <p className="mt-4 text-base font-semibold text-slate-950">
              <a
                href="mailto:hello@rentconverter.com"
                className="cursor-pointer rounded text-sky-800 underline underline-offset-2 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                hello@rentconverter.com
              </a>
            </p>

            <div className="mt-6 rounded-xl bg-white px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-950">
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

            <div className="mt-6 rounded-xl bg-white px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-950">Note</h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                RentConverter.com uses a 365-day year and average month length
                for comparison. Actual lease payments can differ based on due
                dates, prorations, fees, utilities, and local rules.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-700">
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
