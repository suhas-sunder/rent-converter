export const SITE_URL = "https://www.rentconverter.com";
const OG_IMAGE = "https://www.rentconverter.com/og-image.jpg";

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  breadcrumbName?: string;
  includeBreadcrumb?: boolean;
  pageType?: string;
  calculator?: boolean;
  faq?: Array<{ q: string; a: string }>;
};

export type BreadcrumbListSchema = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  "@id"?: string;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function cleanBreadcrumbName(name: string): string {
  return name.split("|")[0]?.trim() || name.trim();
}

export function makeBreadcrumbSchema({
  name,
  url,
  id,
}: {
  name: string;
  url: string;
  id?: string;
}): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
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
        name: cleanBreadcrumbName(name),
        item: url,
      },
    ],
  };
}

export function buildMeta(config: SeoConfig) {
  const canonical = absoluteUrl(config.path);
  return [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: OG_IMAGE },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: OG_IMAGE },
    { tagName: "link", rel: "canonical", href: canonical },
  ];
}

export function makePageSchemas(config: SeoConfig) {
  const url = absoluteUrl(config.path);
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: config.title,
      description: config.description,
      url,
      isPartOf: {
        "@type": "WebSite",
        name: "RentConverter.com",
        url: SITE_URL,
      },
    },
  ];

  if (config.includeBreadcrumb !== false && config.path !== "/") {
    schemas.push(makeBreadcrumbSchema({
      name: config.breadcrumbName ?? config.title,
      url,
    }));
  }

  if (config.calculator) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: config.title,
      description: config.description,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    });
  }

  if (config.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return schemas;
}

export function JsonLd({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
