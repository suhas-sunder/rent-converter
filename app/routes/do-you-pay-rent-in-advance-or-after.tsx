import type { Route } from "./+types/do-you-pay-rent-in-advance-or-after";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/do-you-pay-rent-in-advance-or-after";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "Do You Pay Rent in Advance or After? | Rent Timing";
const description =
  "Rent is commonly paid in advance for the upcoming rental period, but your lease controls the exact rule. Learn how timing affects due dates and proration.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "do you pay rent in advance or after, when paying rent what month are you paying for, rent in advance, rent due date, when do you pay rent",
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
    q: "Do you usually pay rent in advance?",
    a: "Many rental agreements require rent in advance, meaning the payment covers the upcoming rental period. The lease controls the exact rule.",
  },
  {
    q: "If rent is due on May 1, what period does it cover?",
    a: "It often covers May 1 through the end of May for monthly rent, but the exact period depends on the lease wording.",
  },
  {
    q: "Can rent be paid after the period?",
    a: "Some arrangements can work differently, but residential rent is commonly due before or at the start of the period being covered.",
  },
  {
    q: "How does this affect prorated rent?",
    a: "If you move in or out partway through a period, proration may be used to charge only the portion of the period you occupy.",
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

export default function RentAdvanceOrAfter() {
  return (
    <>
      <IntentLandingPage
        eyebrow="Rent timing"
        title="Do You Pay Rent in Advance or After?"
        lead="Rent timing can be confusing because the payment date and the period covered are not always explained in plain language. Start with the lease, then use a calendar or proration calculator when dates change."
        answerTitle="Direct answer"
        answer="Rent is commonly paid in advance for the upcoming rental period. If rent is due on the first day of the month, it often covers that month, but your lease controls the exact timing."
        caveat="This is general guidance. For disputes, late fees, or local legal rules, check your lease and local tenant resources."
        primaryCta={{
          to: "/rent-due-date-calculator",
          label: "Calculate due dates",
        }}
        secondaryCta={{
          to: "/prorated-rent-calculator",
          label: "Calculate prorated rent",
        }}
        sections={[
          {
            title: "Rent in advance",
            body: "Paying in advance means you pay before or at the start of the period you are about to occupy. This is common for monthly rent, weekly rent, and 4-week rent cycles.",
          },
          {
            title: "Rent after the period",
            body: "Some agreements can be structured differently, but do not assume rent is paid after the fact unless the lease clearly says so.",
          },
          {
            title: "Move-in and move-out dates",
            body: "Partial periods are where confusion often starts. If you move in mid-month, the first payment may include a prorated amount plus the next full rental period.",
          },
        ]}
        examples={[
          {
            title: "Monthly rent due on the 1st",
            body: "A May 1 payment often covers May rent. If you move in May 15, the lease may charge a prorated May amount plus June rent in advance.",
          },
          {
            title: "Weekly rent",
            body: "If weekly rent is due each Friday, that payment often covers the week starting Friday. Confirm the exact coverage in the agreement.",
          },
        ]}
        relatedLinks={[
          {
            to: "/when-is-rent-due",
            label: "When rent is due",
            description: "Understand due dates and grace-period cautions.",
          },
          {
            to: "/rent-due-date-calculator",
            label: "Rent due date calculator",
            description: "Build upcoming rent payment dates.",
          },
          {
            to: "/prorated-rent-calculator",
            label: "Prorated rent calculator",
            description: "Calculate a partial rent period.",
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
