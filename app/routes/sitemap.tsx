import type { Route } from "./+types/sitemap";
import { Link } from "react-router";
import {
  canonicalRouteEntries,
  sitemapSections,
} from "~/client/data/routeRegistry";

const SITE_URL = "https://www.rentconverter.com";
const SITEMAP_URL = `${SITE_URL}/sitemap`;

export function meta({}: Route.MetaArgs) {
  const title = "HTML Sitemap | RentConverter";
  const description =
    "Browse every RentConverter tool and page in one place, including rent frequency converters, affordability calculators, rent increase calculators, and legal pages.";

  return [
    { title },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#0284c7" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITEMAP_URL },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function links() {
  return [{ rel: "canonical", href: SITEMAP_URL }];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function SitemapPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HTML Sitemap",
    description: "A complete browsable sitemap of RentConverter tools and pages.",
    url: SITEMAP_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter",
      url: SITE_URL,
    },
    mainEntity: canonicalRouteEntries.map((link) => ({
      "@type": "WebPage",
      name: link.label,
      url: `${SITE_URL}${link.href === "/" ? "" : link.href}`,
    })),
  };

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
          <nav className="mb-6 text-sm text-slate-700" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/"
                  className="cursor-pointer font-semibold text-sky-700 underline-offset-4 hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-slate-950">HTML Sitemap</li>
            </ol>
          </nav>

          <p className="rc-page-eyebrow">RentConverter site index</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            HTML Sitemap
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Browse all canonical RentConverter pages from one place. Redirect
            aliases are intentionally excluded so this sitemap points only to
            the pages users and search engines should use.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-6">
          {sitemapSections.map((section) => (
            <section
              key={section.title}
              className="rounded-[1.5rem] bg-white px-5 py-6 sm:px-6"
              aria-labelledby={section.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}
            >
              <div className="mb-5">
                <h2
                  id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  className="text-2xl font-bold tracking-tight text-sky-900"
                >
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {section.description}
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group flex h-full cursor-pointer flex-col rounded-2xl bg-sky-50 px-4 py-4 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <span className="font-semibold text-sky-900 group-hover:text-sky-950">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="mt-1 text-sm leading-5 text-slate-700">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
