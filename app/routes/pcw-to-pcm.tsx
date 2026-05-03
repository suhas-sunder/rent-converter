import type { Route } from "./+types/pcw-to-pcm";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/pcw-to-pcm";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "PCW to PCM Calculator | Per Calendar Week to Month";
const description =
  "Convert PCW rent to PCM using a calendar-month equivalent. Compare per-calendar-week rent with monthly rent without using the 4-week shortcut.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "pcw to pcm, pcw to pcm calculator, per calendar week to per calendar month, weekly rent to monthly, pcm rent calculator",
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
    q: "What does PCW mean in rent?",
    a: "PCW usually means per calendar week. In rent listings, it is commonly used like PW, meaning rent for one week.",
  },
  {
    q: "How do you convert PCW to PCM?",
    a: "Use PCW rent x 365 / 7 / 12. That converts one week of rent into an average calendar-month equivalent.",
  },
  {
    q: "Is PCW to PCM different from PW to PCM?",
    a: "For normal rent comparison, no. Both treat the input as a weekly rent amount.",
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

export default function PcwToPcm() {
  return (
    <>
      <IntentLandingPage
        eyebrow="PCW to PCM"
        title="PCW to PCM Calculator"
        lead="PCW usually means per calendar week. Convert that weekly amount into a per-calendar-month comparison before deciding whether a listing fits your monthly budget."
        answerTitle="PCW to PCM formula"
        answer="To convert PCW to PCM, treat the PCW figure as weekly rent, annualize it over 365 days, then divide by 12."
        formula="PCM = PCW x 365 / 7 / 12"
        caveat="If a lease says rent is billed every 4 weeks or every 28 days, use a 4-week rent calculator instead."
        primaryCta={{
          to: "/weekly-to-monthly-rent-converter",
          label: "Open the full converter",
        }}
        secondaryCta={{
          to: "/pw-to-pcm",
          label: "PW to PCM",
        }}
        sections={[
          {
            title: "Why PCW appears in listings",
            body: "PCW is common in rental markets where weekly prices are normal, especially for rooms, shared houses, and some flat listings. It helps landlords show a smaller weekly price, but renters often still need a monthly comparison.",
          },
          {
            title: "How to compare PCW with PCM",
            body: "Convert the PCW rent to PCM, then compare the result with monthly listings. After that, check what each listing includes, because bills and fees can change the real monthly cost.",
          },
        ]}
        examples={[
          {
            title: "170 PCW",
            body: "170 per calendar week is about 738.69 PCM.",
          },
          {
            title: "500 PCW",
            body: "500 per calendar week is about 2,172.62 PCM.",
          },
        ]}
        relatedLinks={[
          {
            to: "/what-does-pw-mean-rent",
            label: "What PW means",
            description: "Understand the weekly rent abbreviation.",
          },
          {
            to: "/what-does-pcm-mean-rent",
            label: "What PCM means",
            description: "Understand per calendar month rent.",
          },
          {
            to: "/rent-paid-every-4-weeks-calculator",
            label: "4-week rent",
            description: "Use this if payments repeat every 28 days.",
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
