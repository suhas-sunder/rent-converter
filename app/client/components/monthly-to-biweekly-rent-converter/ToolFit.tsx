import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When this monthly-to-biweekly comparison helps",
  bestFor: [
    "Comparing a monthly rent listing with a biweekly budget or another listing.",
    "Checking whether a rent quote still fits after you put it on the same time basis as your income or budget.",
    "Explaining the difference to a roommate, partner, landlord, or agent without rebuilding the math by hand."
  ],
  notFor: [
    "Exact lease billing can still depend on due dates, proration, local rules, and fees.",
    "This does not decide affordability by itself; it only makes the rent periods comparable."
  ],
  nextSteps: [
    {
      to: "/rent-converter",
      label: "All rent periods"
    },
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
    },
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
