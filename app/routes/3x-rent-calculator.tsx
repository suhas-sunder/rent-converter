import type { Route } from "./+types/3x-rent-calculator";
import RentMultiplierRulePage from "~/client/components/layout/RentMultiplierRulePage";
import type { IntentFaq } from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/3x-rent-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "3x Rent Calculator | Income Required for Rent";
const description =
  "Calculate income required for the 3x rent rule and estimate max rent from monthly gross income. Compare rent qualification numbers quickly.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "3x rent calculator, three times the rent calculator, 3 times rent, income required for rent, rent qualification calculator, income to rent ratio calculator",
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
    q: "What is the 3x rent rule?",
    a: "The 3x rent rule means monthly gross income is expected to be at least three times the monthly rent.",
  },
  {
    q: "How much income do I need for $2,000 rent under 3x?",
    a: "Under a 3x rule, $2,000 rent requires about $6,000 in monthly gross income, or about $72,000 per year.",
  },
  {
    q: "Is 3x rent based on gross or net income?",
    a: "Many landlord screens use gross income, but policies vary. Check the listing, landlord, or application requirements.",
  },
  {
    q: "Does passing 3x rent mean the rent is affordable?",
    a: "Not necessarily. A 3x screen does not include debts, utilities, savings, transport, childcare, or other costs.",
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

export default function ThreeTimesRentCalculator() {
  return (
    <>
      <RentMultiplierRulePage
        eyebrow="Rent qualification tool"
        title="3x Rent Calculator"
        lead="Use the 3x rent rule to estimate the monthly income needed for a rental application, or work backward from income to a rent cap."
        multiplierLabel="3x"
        multiplierNumerator={3n}
        multiplierDenominator={1n}
        defaultRent="2000"
        defaultIncome="6000"
        explanation="The 3x rent rule is a common rental screening shortcut. It compares monthly rent with monthly gross income. If rent is $2,000, a 3x rule points to $6,000 in monthly gross income."
        examples={[
          {
            title: "$1,500 rent",
            body: "A 3x rule points to $4,500 in monthly gross income, or about $54,000 per year.",
          },
          {
            title: "$2,500 rent",
            body: "A 3x rule points to $7,500 in monthly gross income, or about $90,000 per year.",
          },
        ]}
        relatedLinks={[
          {
            to: "/2-5x-rent-calculator",
            label: "2.5x rent calculator",
            description: "Use a slightly lower income multiplier.",
          },
          {
            to: "/income-required-for-rent-calculator",
            label: "Income required for rent",
            description: "Compare 2x, 2.5x, 3x, and custom multipliers.",
          },
          {
            to: "/how-much-rent-can-i-afford-calculator",
            label: "Rent affordability",
            description: "Estimate rent targets from income ratio.",
          },
        ]}
        faq={faq}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
