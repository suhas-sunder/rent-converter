import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent paid every 4 weeks",
  intro: "A 4-week rent cycle creates 13 payments per year, not 12. That is why a 28-day payment can feel monthly but still convert to a different average monthly cost.",
  steps: [
    {
      title: "A 28-day payment is not a calendar month",
      body: "Every 4 weeks is exactly 28 days. A calendar month averages about 30.42 days, so the monthly equivalent is higher than the 4-week payment."
    },
    {
      title: "The annual count changes the comparison",
      body: "A 4-week schedule has 13 payments per year. Monthly rent has 12 payments per year. That one extra payment is the reason comparisons can feel surprising."
    },
    {
      title: "Due dates can drift through the month",
      body: "If rent is due every 28 days, the due date moves earlier on the calendar over time. That is different from rent due on the 1st of each month."
    }
  ],
  examples: [
    {
      title: "$2,000 every 4 weeks",
      body: "$2,000 every 28 days is $26,000 per year, or about $2,166.67 per month on average."
    },
    {
      title: "Monthly budget mismatch",
      body: "Someone budgeting for $2,000 per month may be short over the year if the lease is actually $2,000 every 4 weeks."
    },
    {
      title: "Pay cycle planning",
      body: "A 28-day rent cycle can line up with a 4-week pay rhythm, but it does not line up with monthly bills like utilities or subscriptions."
    }
  ],
  notes: [
    "Use this for 4 weekly to monthly calculator, 28 day billing cycle calculator, and rent paid every 4 weeks searches.",
    "If rent is weekly, use weekly to monthly. If rent is due on a fixed calendar date, use the due date calculator."
  ],
  relatedLinks: [
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/rent-due-date-calculator",
      label: "Rent due date"
    },
    {
      to: "/",
      label: "Rent converter"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
