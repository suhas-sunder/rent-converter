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
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
    },
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent percentage"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
