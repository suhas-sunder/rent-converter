import type { Route } from "./+types/when-is-rent-due";
import IntentLandingPage, {
  type IntentFaq,
} from "~/client/components/layout/IntentLandingPage";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/when-is-rent-due";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

const title = "When Is Rent Due? | Rent Due Date Guide";
const description =
  "Rent is usually due on the date stated in the lease. Learn common due-date patterns, grace-period cautions, and how to calculate upcoming rent dates.";

export const meta: Route.MetaFunction = () => [
  { title },
  { name: "description", content: description },
  {
    name: "keywords",
    content:
      "when is rent due, what time is rent due, rent due date, when do you pay rent, rent due on the 1st, rent calendar",
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
    q: "When is rent usually due?",
    a: "Rent is usually due on the date stated in the lease. For monthly rent, that is often the first day of the month, but the lease controls the actual due date.",
  },
  {
    q: "What time of day is rent due?",
    a: "The lease or local rules may define the time. If no time is stated, many renters treat the due date as a full calendar day and pay before the end of that day, but you should confirm with the lease or landlord.",
  },
  {
    q: "Is a grace period the same as the due date?",
    a: "No. A grace period may delay late fees or enforcement, but the rent can still be due on the original due date.",
  },
  {
    q: "How can I calculate future rent due dates?",
    a: "Use the rent due date calculator to build a monthly, weekly, biweekly, annual, or 28-day rent schedule.",
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

export default function WhenIsRentDue() {
  return (
    <>
      <IntentLandingPage
        eyebrow="Rent calendar"
        title="When Is Rent Due?"
        lead="Rent due dates are usually simple once you know the lease date and billing cycle. The important part is separating the due date from grace periods, late fees, and payment processing time."
        answerTitle="Direct answer"
        answer="Rent is due on the date stated in your lease or rental agreement. Monthly rent is often due on the first day of the month, but weekly, biweekly, 4-week, and custom schedules can use different dates."
        caveat="This page is general information, not legal advice. Local rules and lease wording can change what happens after rent is late."
        primaryCta={{
          to: "/rent-due-date-calculator",
          label: "Calculate rent due dates",
        }}
        secondaryCta={{
          to: "/rent-per-paycheck-calculator",
          label: "Plan by paycheck",
        }}
        sections={[
          {
            title: "How this page works",
            body: "The lease usually sets the due date, such as the 1st of each month or every Friday. If the lease names a date, use that date before relying on a general rule.",
          },
          {
            title: "Grace period is different",
            body: "A grace period may give extra time before a late fee or other consequence. It usually does not move the actual due date unless the lease or local rule says so.",
          },
          {
            title: "Payment timing still matters",
            body: "Bank transfers, card payments, checks, and online portals can process at different speeds. If a payment needs time to clear, schedule it before the due date.",
          },
        ]}
        examples={[
          {
            title: "Rent due on the 1st",
            body: "If your lease says rent is due on the 1st, the safest budget plan is to have the money ready before that date, even if a grace period exists.",
          },
          {
            title: "Rent paid every 4 weeks",
            body: "A 28-day schedule moves through the calendar instead of staying on one day of the month. That is why a rent calendar is useful.",
          },
        ]}
        relatedLinks={[
          {
            to: "/rent-due-date-calculator",
            label: "Rent due date calculator",
            description: "Create upcoming due dates from a start date.",
          },
          {
            to: "/do-you-pay-rent-in-advance-or-after",
            label: "Rent in advance or after",
            description: "Understand what period a rent payment covers.",
          },
          {
            to: "/rent-paid-every-4-weeks-calculator",
            label: "Every 4 weeks rent",
            description: "Compare 28-day rent with monthly rent.",
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
