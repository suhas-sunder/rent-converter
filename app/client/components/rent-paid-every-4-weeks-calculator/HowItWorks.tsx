import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";
import { fourWeekExample } from "~/client/data/verifiedPeriodExamples";
import { formatMoney } from "~/client/utils/rentMath";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent paid every 4 weeks",
  intro: "A 4-week payment covers 28 days. Thirteen of those periods cover 364 days, while this calculator compares rent over 365 days. Neither figure tells you the exact number of payment dates in your agreement.",
  steps: [
    {
      title: "A 28-day payment is not a calendar month",
      body: "Every 4 weeks is exactly 28 days. A calendar month averages about 30.42 days, so the monthly equivalent is higher than the 4-week payment."
    },
    {
      title: "A rate equivalent is different from a payment count",
      body: "A 365-day equivalent uses 365 ÷ 28 periods, about 13.04. You cannot make a fraction of a scheduled payment: count actual dates separately. Depending on the first date and the calendar-year boundaries, 13 or 14 payment dates can fall in a year."
    },
    {
      title: "Due dates can drift through the month",
      body: "If rent is due every 28 days, the due date moves earlier on the calendar over time. That is different from rent due on the 1st of each month."
    }
  ],
  examples: [
    {
      title: "$2,000 every 4 weeks",
      body: `${formatMoney(fourWeekExample.payment, "USD")} every 28 days is ${formatMoney(fourWeekExample.annual, "USD")} per 365-day comparison year, or ${formatMoney(fourWeekExample.monthly, "USD")} per average month. Thirteen payments total ${formatMoney(fourWeekExample.thirteenPayments, "USD")} and cover ${fourWeekExample.daysCovered} days.`
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
    "Use the average monthly equivalent to compare listings or plan a budget. Use a dated schedule to count the payments that actually fall within your lease.",
    "If rent is weekly, use weekly to monthly. If rent is due on a fixed calendar date, use the due date calculator."
  ],
  relatedLinks: [
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/rent-schedule-calculator",
      label: "Count payment periods within your lease"
    },
    {
      to: "/methodology",
      label: "Calculation methodology"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
