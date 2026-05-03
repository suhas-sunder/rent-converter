import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When a 28-day rent cycle matters",
  bestFor: [
    "Checking true monthly cost when rent is paid every 4 weeks.",
    "Explaining why 13 payments per year can cost more than 12 monthly payments.",
    "Planning around due dates that move through the calendar."
  ],
  notFor: [
    "A lease with rent due on the same day each month is monthly, not every 4 weeks."
  ],
  nextSteps: [
    {
      to: "/rent-due-date-calculator",
      label: "Rent due date"
    },
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
