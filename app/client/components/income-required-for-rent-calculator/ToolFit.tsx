import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When multiplier arithmetic helps",
  bestFor: [
    "Calculating required income from monthly rent.",
    "Reversing monthly income into a maximum-rent scenario.",
    "Comparing 2x, 2.5x, 3x, and custom multiplier arithmetic."
  ],
  notFor: [
    "This does not determine approval, affordability, credit, debt, deposits, references, or local legal requirements."
  ],
  nextSteps: [
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
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
