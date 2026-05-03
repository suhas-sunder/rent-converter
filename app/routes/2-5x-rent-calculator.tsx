import type { Route } from "./+types/2-5x-rent-calculator";
import RentMultiplierRulePage from "~/client/components/layout/RentMultiplierRulePage";
import type { IntentFaq } from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/2-5x-rent-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "2.5x Rent Calculator | Income Required for Rent";
const description =
  "Calculate income required for the 2.5x rent rule and estimate max rent from monthly gross income. Compare rental qualification numbers.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "2.5x rent calculator, 2.5 times the rent calculator, calculate 2.5 times rent, income required for rent, rent qualification calculator",
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
    q: "What is the 2.5x rent rule?",
    a: "The 2.5x rent rule means monthly gross income is expected to be at least 2.5 times the monthly rent.",
  },
  {
    q: "How much income do I need for $2,000 rent under 2.5x?",
    a: "Under a 2.5x rule, $2,000 rent requires about $5,000 in monthly gross income, or about $60,000 per year.",
  },
  {
    q: "Is 2.5x rent more flexible than 3x rent?",
    a: "Yes. A 2.5x screen allows a higher rent for the same income than a 3x screen, but it may leave less room in the budget.",
  },
  {
    q: "Does this decide whether a landlord will approve me?",
    a: "No. Landlords may also review credit, savings, debts, guarantors, employment, rental history, and local rules.",
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

export default function TwoPointFiveTimesRentCalculator() {
  return (
    <>
      <RentMultiplierRulePage
        eyebrow="Rent qualification tool"
        title="2.5x Rent Calculator"
        lead="Use the 2.5x rent rule to estimate income required for a rental application, or calculate the rent cap implied by monthly gross income."
        multiplierLabel="2.5x"
        multiplierNumerator={5n}
        multiplierDenominator={2n}
        defaultRent="2000"
        defaultIncome="5000"
        explanation="The 2.5x rent rule is a rental screening shortcut. It compares monthly rent with monthly gross income. If rent is $2,000, a 2.5x rule points to $5,000 in monthly gross income."
        examples={[
          {
            title: "$1,500 rent",
            body: "A 2.5x rule points to $3,750 in monthly gross income, or about $45,000 per year.",
          },
          {
            title: "$2,500 rent",
            body: "A 2.5x rule points to $6,250 in monthly gross income, or about $75,000 per year.",
          },
        ]}
        relatedLinks={[
          {
            to: "/3x-rent-calculator",
            label: "3x rent calculator",
            description: "Use the more common 3x screening rule.",
          },
          {
            to: "/income-required-for-rent-calculator",
            label: "Income required for rent",
            description: "Compare 2x, 2.5x, 3x, and custom multipliers.",
          },
          {
            to: "/rent-as-percentage-of-income-calculator",
            label: "Rent percentage of income",
            description: "See rent as a share of income.",
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
