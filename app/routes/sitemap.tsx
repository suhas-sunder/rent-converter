import type { Route } from "./+types/sitemap";
import { Link } from "react-router";

const SITE_URL = "https://www.rentconverter.com";

type SitemapLink = {
  label: string;
  href: string;
  description?: string;
};

type SitemapSection = {
  title: string;
  description: string;
  links: SitemapLink[];
};

const sitemapSections: SitemapSection[] = [
  {
    title: "Main pages",
    description: "Core RentConverter pages and general site information.",
    links: [
      {
        label: "Home",
        href: "/",
        description: "Start with the main rent converter tools.",
      },
      {
        label: "About",
        href: "/about",
        description: "Learn what RentConverter is built for.",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Contact the RentConverter team.",
      },
    ],
  },
  {
    title: "Rent frequency converters",
    description:
      "Convert rent between weekly, biweekly, monthly, annual, daily, and hourly payment periods.",
    links: [
      {
        label: "Monthly to weekly rent converter",
        href: "/monthly-to-weekly-rent-converter",
      },
      {
        label: "Weekly to monthly rent converter",
        href: "/weekly-to-monthly-rent-converter",
      },
      {
        label: "Weekly to annual rent converter",
        href: "/weekly-to-annual-rent-converter",
      },
      {
        label: "Weekly to biweekly rent converter",
        href: "/weekly-to-biweekly-rent-converter",
      },
      {
        label: "Biweekly to weekly rent converter",
        href: "/biweekly-to-weekly-rent-converter",
      },
      {
        label: "Biweekly to monthly rent converter",
        href: "/biweekly-to-monthly-rent-converter",
      },
      {
        label: "Biweekly to annual rent converter",
        href: "/biweekly-to-annual-rent-converter",
      },
      {
        label: "Monthly to annual rent converter",
        href: "/monthly-to-annual-rent-converter",
      },
      {
        label: "Annual to monthly rent converter",
        href: "/annual-to-monthly-rent-converter",
      },
      {
        label: "Monthly to daily rent converter",
        href: "/monthly-to-daily-rent-converter",
      },
      {
        label: "Daily to monthly rent converter",
        href: "/daily-to-monthly-rent-converter",
      },
      {
        label: "Monthly to hourly rent converter",
        href: "/monthly-to-hourly-rent-converter",
      },
      {
        label: "Hourly to monthly rent converter",
        href: "/hourly-to-monthly-rent-converter",
      },
      {
        label: "Hourly to annual rent converter",
        href: "/hourly-to-annual-rent-converter",
      },
      {
        label: "Annual to hourly rent converter",
        href: "/annual-to-hourly-rent-converter",
      },
      {
        label: "Annual to weekly rent converter",
        href: "/annual-to-weekly-rent-converter",
      },
      {
        label: "Annual to biweekly rent converter",
        href: "/annual-to-biweekly-rent-converter",
      },
      {
        label: "Monthly to biweekly rent converter",
        href: "/monthly-to-biweekly-rent-converter",
      },
    ],
  },
  {
    title: "General rent calculators",
    description:
      "Useful calculators for rent per day, rent per week, paycheck budgeting, splitting rent, and rent due dates.",
    links: [
      {
        label: "Rent per day calculator",
        href: "/rent-per-day-calculator",
      },
      {
        label: "Rent per week calculator",
        href: "/rent-per-week-calculator",
      },
      {
        label: "Rent paid every 4 weeks calculator",
        href: "/rent-paid-every-4-weeks-calculator",
      },
      {
        label: "Rent per paycheck calculator",
        href: "/rent-per-paycheck-calculator",
      },
      {
        label: "Rent split calculator",
        href: "/rent-split-calculator",
      },
      {
        label: "Rent due date calculator",
        href: "/rent-due-date-calculator",
      },
    ],
  },
  {
    title: "Affordability and income calculators",
    description:
      "Estimate affordability, rent-to-income ratios, take-home pay impact, and required income for rent.",
    links: [
      {
        label: "Rent affordability calculator",
        href: "/rent-affordability-calculator",
      },
      {
        label: "Rent as percentage of income calculator",
        href: "/rent-as-percentage-of-income-calculator",
      },
      {
        label: "How much rent can I afford calculator",
        href: "/how-much-rent-can-i-afford-calculator",
      },
      {
        label: "Rent after tax income calculator",
        href: "/rent-after-tax-income-calculator",
      },
      {
        label: "Rent vs take-home pay calculator",
        href: "/rent-vs-take-home-pay-calculator",
      },
      {
        label: "Income required for rent calculator",
        href: "/income-required-for-rent-calculator",
      },
    ],
  },
  {
    title: "Rent increase calculators",
    description:
      "Calculate rent increases, percentage changes, and rent after an increase.",
    links: [
      {
        label: "Rent increase calculator",
        href: "/rent-increase-calculator",
      },
      {
        label: "Rent increase percentage calculator",
        href: "/rent-increase-percentage-calculator",
      },
      {
        label: "Rent after increase calculator",
        href: "/rent-after-increase-calculator",
      },
    ],
  },
  {
    title: "Specific rent answer pages",
    description:
      "Fast answer pages for common weekly-to-monthly rent searches.",
    links: [
      {
        label: "$500 per week to monthly rent",
        href: "/500-per-week-to-monthly-rent",
      },
      {
        label: "$180 per week to monthly rent",
        href: "/180-per-week-to-monthly-rent",
      },
      {
        label: "$170 per week to monthly rent",
        href: "/170-per-week-to-monthly-rent",
      },
    ],
  },
  {
    title: "Country-specific rent tools",
    description:
      "Rent conversion pages tailored to common regional rent payment patterns.",
    links: [
      {
        label: "Weekly to monthly rent UK",
        href: "/weekly-to-monthly-rent-uk",
      },
      {
        label: "Weekly to monthly rent Australia",
        href: "/weekly-to-monthly-rent-australia",
      },
      {
        label: "Rent per paycheck US",
        href: "/rent-per-paycheck-us",
      },
      {
        label: "Rent per paycheck Canada",
        href: "/rent-per-paycheck-canada",
      },
    ],
  },
  {
    title: "Rent vs buy",
    description:
      "Compare renting and buying using a dedicated rent vs buy calculator.",
    links: [
      {
        label: "Rent vs buy calculator",
        href: "/rent-vs-buy-calculator",
      },
    ],
  },
  {
    title: "Legal",
    description: "Policies and terms for using RentConverter.",
    links: [
      {
        label: "Privacy policy",
        href: "/privacy-policy",
      },
      {
        label: "Terms of service",
        href: "/terms-of-service",
      },
      {
        label: "Cookie policy",
        href: "/cookies",
      },
    ],
  },
];

const allLinks = sitemapSections.flatMap((section) => section.links);

export function meta({}: Route.MetaArgs) {
  const title = "HTML Sitemap | RentConverter";
  const description =
    "Browse every RentConverter tool and page in one place, including rent frequency converters, affordability calculators, rent increase calculators, and legal pages.";
  const canonical = `${SITE_URL}/sitemap`;

  return [
    { title },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#0284c7" },

    { rel: "canonical", href: canonical },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

export default function SitemapPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HTML Sitemap",
    description:
      "A complete browsable sitemap of RentConverter tools and pages.",
    url: `${SITE_URL}/sitemap`,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter",
      url: SITE_URL,
    },
    mainEntity: allLinks.map((link) => ({
      "@type": "WebPage",
      name: link.label,
      url: `${SITE_URL}${link.href === "/" ? "" : link.href}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-sky-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-600" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/"
                  className="cursor-pointer font-medium text-sky-700 underline-offset-4 hover:text-sky-900 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-900">HTML Sitemap</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 ring-1 ring-sky-100">
              RentConverter site index
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-sky-950 sm:text-5xl">
              HTML Sitemap
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Browse all RentConverter pages from one place. This sitemap
              includes rent frequency converters, affordability calculators,
              rent increase tools, regional pages, and site information pages.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-sky-950">
            Quick directory
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the sections below to jump to the rent tool or page you need.
            For search engines, the XML sitemap remains available separately;
            this page is built for users who want a readable site index.
          </p>
        </div>

        <div className="grid gap-6">
          {sitemapSections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
              aria-labelledby={section.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}
            >
              <div className="mb-5">
                <h2
                  id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  className="text-2xl font-bold text-sky-950"
                >
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm"
                    >
                      <span className="font-semibold text-slate-950 group-hover:text-sky-800">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="mt-1 text-sm leading-5 text-slate-600">
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

        <section className="mt-10 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-sky-950">
            About this sitemap
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            <p>
              This HTML sitemap is a readable directory of RentConverter pages.
              It helps visitors find related rent tools without needing to use
              the navigation menu or search.
            </p>
            <p>
              The site also uses an XML sitemap for search engines. This page is
              mainly for people browsing the site manually.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
