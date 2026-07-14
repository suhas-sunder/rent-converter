import type { Route } from "./+types/prorated-rent-calculator";
import ProratedRentCalculatorPage from "~/client/components/layout/ProratedRentCalculatorPage";
import type { IntentFaq } from "~/client/components/layout/IntentLandingPage";
import { makeBreadcrumbSchema } from "~/client/utils/seo";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/prorated-rent-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "Prorated Rent Calculator | Partial Month Rent";
const description =
  "Calculate prorated rent for a partial rental period. Enter rent, charged days, and days in the period to see the daily rate and prorated amount.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "prorated rent calculator, partial month rent calculator, calculate prorated rent, move in rent calculator, rent for partial month",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f0f9ff" },
  { property: "og:type", content: "website" },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:url", content: PAGE_URL },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: OG_IMAGE_URL },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
  { name: "twitter:image", content: OG_IMAGE_URL },
  { tagName: "link", rel: "canonical", href: PAGE_URL },
];

const faq: IntentFaq[] = [
  {
    q: "How do you calculate prorated rent?",
    a: "Divide the full rent by the number of days in the rental period, then multiply by the number of days owed.",
  },
  {
    q: "Should I use 30 days or the actual days in the month?",
    a: "Use the method stated in the lease, invoice, or local rules. If nothing is stated, ask before assuming a method.",
  },
  {
    q: "Does prorated rent include utilities or fees?",
    a: "Not unless you include them in the rent amount. Some charges may not prorate the same way as base rent.",
  },
  {
    q: "Can this be used for move-out rent?",
    a: "Yes. Enter the number of days owed for the final partial period and the day count used by the lease or invoice.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: title,
  description,
  url: PAGE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  isPartOf: { "@type": "WebSite", name: "RentConverter.com", url: SITE_URL },
};

const breadcrumbSchema = makeBreadcrumbSchema({
  name: "Prorated Rent Calculator",
  url: PAGE_URL,
});

export default function ProratedRentCalculator() {
  return (
    <>
      <ProratedRentCalculatorPage
        faq={faq}
        relatedLinks={[
          {
            to: "/rent-due-date-calculator",
            label: "Rent due date calculator",
            description: "Build upcoming payment dates.",
          },
          {
            to: "/monthly-to-daily-rent-converter",
            label: "Monthly to daily rent",
            description: "Convert monthly rent into a daily equivalent.",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
