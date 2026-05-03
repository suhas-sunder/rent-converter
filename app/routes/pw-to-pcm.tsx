import type { Route } from "./+types/pw-to-pcm";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/pw-to-pcm";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "PW to PCM Calculator | Weekly Rent to Monthly";
const description =
  "Convert PW rent to PCM using a 365-day year. See why weekly rent times 4 is not the same as a true calendar-month rent equivalent.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "pw to pcm, pw to pcm calculator, rent pw to pcm, weekly rent to pcm, price per week to month, rent per week to month",
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
    q: "How do you convert PW to PCM?",
    a: "Use weekly rent x 365 / 7 / 12. This annualizes the weekly rent, then divides by 12 calendar months.",
  },
  {
    q: "What is $500 PW in PCM?",
    a: "$500 PW is about $2,172.62 PCM using a 365-day year.",
  },
  {
    q: "Is PW x 4 the same as PCM?",
    a: "No. PW x 4 is a 28-day amount. PCM is based on a calendar month, which averages about 30.42 days.",
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

export default function PwToPcm() {
  return (
    <>
      <IntentLandingPage
        eyebrow="PW to PCM"
        title="PW to PCM Calculator"
        lead="Convert price per week into a per-calendar-month rent equivalent. This is the comparison you want when one listing is weekly and another listing is monthly."
        answerTitle="PW to PCM formula"
        answer="To convert PW to PCM, multiply weekly rent by 365, divide by 7, then divide by 12. That gives the average calendar-month equivalent."
        formula="PCM = PW x 365 / 7 / 12"
        caveat="The result is a comparison amount. Your lease may still require rent to be paid weekly."
        primaryCta={{
          to: "/weekly-to-monthly-rent-converter",
          label: "Open the full converter",
        }}
        secondaryCta={{
          to: "/what-does-pcm-mean-rent",
          label: "What PCM means",
        }}
        sections={[
          {
            title: "Why this formula is used",
            body: "A week is 7 days. A year is treated as 365 days. Dividing annual rent by 12 gives a monthly average that is better for comparing weekly and monthly listings.",
          },
          {
            title: "When this matters most",
            body: "PW to PCM matters when you are comparing listings, setting a monthly cap, checking affordability, or deciding whether a weekly price is really cheaper than a monthly one.",
          },
        ]}
        examples={[
          {
            title: "$180 PW",
            body: "$180 x 365 / 7 / 12 = $782.14 PCM.",
          },
          {
            title: "$500 PW",
            body: "$500 x 365 / 7 / 12 = $2,172.62 PCM.",
          },
          {
            title: "$650 PW",
            body: "$650 x 365 / 7 / 12 = $2,824.40 PCM.",
          },
        ]}
        relatedLinks={[
          {
            to: "/pcw-to-pcm",
            label: "PCW to PCM",
            description: "Use the same weekly-to-monthly comparison.",
          },
          {
            to: "/rent-paid-every-4-weeks-calculator",
            label: "4-week rent calculator",
            description: "Use this when rent is billed every 28 days.",
          },
          {
            to: "/how-much-rent-can-i-afford-calculator",
            label: "Rent affordability",
            description: "Check the converted rent against income.",
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
