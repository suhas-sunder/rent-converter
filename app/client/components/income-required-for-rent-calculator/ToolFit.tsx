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
      to: "/3x-rent-calculator",
      label: "3x rent"
    },
    {
      to: "/2-5x-rent-calculator",
      label: "2.5x rent"
    },
    {
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
