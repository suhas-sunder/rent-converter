import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When affordability context helps",
  bestFor: [
    "Setting a rent cap before touring or applying.",
    "Comparing a rent number with salary, monthly income, or take-home pay.",
    "Understanding whether rent leaves enough room for bills, savings, and debt."
  ],
  notFor: [
    "This is not a landlord approval decision, legal advice, or a full household budget."
  ],
  nextSteps: [
    {
      to: "/salary-to-rent-calculator",
      label: "Salary to rent"
    },
    {
      to: "/income-required-for-rent-calculator",
      label: "Income required"
    },
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent percentage"
    },
    {
      to: "/rent-budget-calculator",
      label: "Rent budget"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
