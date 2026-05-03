import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When the main converter is the right tool",
  bestFor: [
    "Normalizing rent periods before comparing listings.",
    "Seeing monthly, weekly, 4-week, annual, daily, and hourly equivalents in one place.",
    "Printing a clean breakdown for budgeting or a rental discussion."
  ],
  notFor: [
    "Use a specialized page for affordability, rent increases, paycheck budgeting, due dates, or roommate splits."
  ],
  nextSteps: [
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
    },
    {
      to: "/rent-increase-calculator",
      label: "Rent increase"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
