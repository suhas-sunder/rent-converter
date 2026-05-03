import type { Route } from "./+types/what-does-pw-mean-rent";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/what-does-pw-mean-rent";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "What Does PW Mean in Rent? | Per Week Rent";
const description =
  "PW means per week in rent listings. Learn how PW rent compares with PCM, monthly rent, and 4-week rent, then convert weekly rent to monthly.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "what does pw mean rent, pw rent meaning, rent pw, per week rent, pw to pcm, weekly rent meaning",
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
    q: "What does PW mean in rent?",
    a: "PW means per week. A listing shown as $500 PW means the rent is $500 each week before any bills or fees not included in the listing.",
  },
  {
    q: "Is PW the same as weekly rent?",
    a: "Yes. PW is a shorthand for weekly rent.",
  },
  {
    q: "How do I convert PW to PCM?",
    a: "Annualize the weekly rent over 365 days, then divide by 12. The formula is weekly rent x 365 / 7 / 12.",
  },
  {
    q: "Why not multiply weekly rent by 4?",
    a: "Four weeks is 28 days. A calendar month averages about 30.42 days, so weekly rent times 4 is not a true monthly equivalent.",
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

export default function WhatDoesPwMeanRent() {
  return (
    <>
      <IntentLandingPage
        eyebrow="Rent glossary"
        title="What Does PW Mean in Rent?"
        lead="PW is a rent-listing abbreviation for weekly rent. It is common in room, flat, and apartment listings where rent is advertised by the week instead of by the month."
        answerTitle="Direct answer"
        answer="PW means per week. If a listing says $500 PW, the listed rent is $500 each week before any bills, deposits, or recurring fees that are not included."
        formula="PCM equivalent = weekly rent x 365 / 7 / 12"
        caveat="Use the formula for comparison. The lease may still require weekly payments."
        primaryCta={{
          to: "/weekly-to-monthly-rent-converter",
          label: "Convert weekly rent",
        }}
        secondaryCta={{
          to: "/what-does-pcm-mean-rent",
          label: "Learn PCM",
        }}
        sections={[
          {
            title: "PW tells you the rent period",
            body: "PW only says the rent is priced by week. It does not tell you whether the landlord expects weekly, fortnightly, 4-weekly, or monthly payments after the lease starts.",
          },
          {
            title: "Why PW can look cheaper than PCM",
            body: "Weekly prices often look smaller because the number is for 7 days. To compare fairly with a monthly listing, convert it into a calendar-month equivalent and then compare what is included.",
          },
        ]}
        examples={[
          {
            title: "$180 PW",
            body: "$180 per week is about $782.14 per calendar month. That is the number to compare against a monthly cap.",
          },
          {
            title: "$500 PW",
            body: "$500 per week is about $2,172.62 PCM. The 4-week shortcut would show $2,000, which is not a calendar-month equivalent.",
          },
        ]}
        tableTitle="PW compared with other terms"
        tableRows={[
          {
            term: "PW",
            meaning: "Per week",
            note: "The rent is quoted for one week.",
          },
          {
            term: "PCW",
            meaning: "Per calendar week",
            note: "Usually used like PW, meaning one calendar week.",
          },
          {
            term: "PCM",
            meaning: "Per calendar month",
            note: "The rent is quoted for one calendar month.",
          },
        ]}
        relatedLinks={[
          {
            to: "/pw-to-pcm",
            label: "PW to PCM",
            description: "Convert weekly rent into monthly rent.",
          },
          {
            to: "/pcw-to-pcm",
            label: "PCW to PCM",
            description: "Convert per-calendar-week rent into PCM.",
          },
          {
            to: "/rent-per-week-calculator",
            label: "Rent per week calculator",
            description: "Find the weekly equivalent of another rent period.",
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
