import type { Route } from "./+types/what-does-pcm-mean-rent";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/what-does-pcm-mean-rent";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "What Does PCM Mean in Rent? | Per Calendar Month";
const description =
  "PCM means per calendar month in rent listings. Learn how PCM compares with PW, PCW, and 4-week rent, then convert weekly rent to a monthly amount.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "what does pcm mean rent, pcm rent, per calendar month rent, pcm meaning rent, rent pcm, pcm vs pw rent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f0f9ff" },
  { property: "og:type", content: "article" },
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
    q: "What does PCM mean in rent?",
    a: "PCM means per calendar month. A rent listing shown as $1,200 PCM means the rent is $1,200 for each calendar month before any bills, fees, or deposits not included in the listing.",
  },
  {
    q: "Is PCM the same as monthly rent?",
    a: "Usually yes. PCM is the common listing abbreviation for per calendar month, which is the same monthly comparison basis used by RentConverter.",
  },
  {
    q: "Is PCM the same as four weeks of rent?",
    a: "No. Four weeks is 28 days. An average calendar month is about 30.42 days, so weekly rent times 4 is usually lower than a true PCM equivalent.",
  },
  {
    q: "How do I compare PW and PCM listings?",
    a: "Convert the weekly rent into an annual amount, then divide by 12. RentConverter does this with the weekly to monthly rent converter.",
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
  "@type": "WebPage",
  name: title,
  description,
  url: PAGE_URL,
  isPartOf: { "@type": "WebSite", name: "RentConverter.com", url: SITE_URL },
};

export default function WhatDoesPcmMeanRent() {
  return (
    <>
      <IntentLandingPage
        eyebrow="Rent glossary"
        title="What Does PCM Mean in Rent?"
        lead="PCM is one of the most common rent abbreviations in UK, Australian, and international listings. The important detail is that it refers to a calendar month, not a 4-week period."
        answerTitle="Direct answer"
        answer="PCM means per calendar month. If a listing says rent is $1,200 PCM, the rent is $1,200 for each calendar month before any extra bills or fees that are not included."
        caveat="Always check whether utilities, council tax, internet, parking, or service charges are included separately."
        primaryCta={{
          to: "/weekly-to-monthly-rent-converter",
          label: "Convert PW to PCM",
        }}
        secondaryCta={{
          to: "/rent-paid-every-4-weeks-calculator",
          label: "Compare 4-week rent",
        }}
        sections={[
          {
            title: "Why PCM matters",
            body: "PCM gives you a calendar-month rent number, which is often the easiest way to compare listings against a monthly budget. The problem is that some listings use weekly rent instead, and multiplying weekly rent by 4 understates the monthly equivalent.",
            bullets: [
              "Use PCM when comparing monthly budgets or monthly listings.",
              "Use PW or PCW when the listing is priced by week.",
              "Use a 4-week rent calculator if the rent is actually billed every 28 days.",
            ],
          },
          {
            title: "What to check in the listing",
            body: "The abbreviation only explains the billing period. It does not tell you what is included. A lower PCM listing may still cost more after utilities, parking, internet, or other recurring charges.",
          },
        ]}
        examples={[
          {
            title: "$1,200 PCM listing",
            body: "The listing is quoting $1,200 for a calendar month. If bills are not included, add them separately before comparing it with another listing.",
          },
          {
            title: "$500 PW compared with PCM",
            body: "$500 per week is about $2,172.62 PCM on a 365-day year. Multiplying by 4 would show only $2,000, which misses the extra days in an average month.",
          },
        ]}
        tableTitle="Neighboring rent terms"
        tableRows={[
          {
            term: "PCM",
            meaning: "Per calendar month",
            note: "A monthly rent figure based on calendar months.",
          },
          {
            term: "PW",
            meaning: "Per week",
            note: "A weekly rent figure that needs conversion for monthly comparison.",
          },
          {
            term: "PCW",
            meaning: "Per calendar week",
            note: "Usually used like PW, meaning rent for each week.",
          },
          {
            term: "4-week rent",
            meaning: "Every 28 days",
            note: "This creates 13 payments per year, so it is not the same as monthly rent.",
          },
        ]}
        relatedLinks={[
          {
            to: "/pw-to-pcm",
            label: "PW to PCM",
            description: "Convert weekly rent into a calendar-month amount.",
          },
          {
            to: "/what-does-pw-mean-rent",
            label: "What PW means",
            description: "Learn the weekly rent abbreviation.",
          },
          {
            to: "/weekly-to-monthly-rent-converter",
            label: "Weekly to monthly converter",
            description: "Use the full calculator with currency support.",
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
