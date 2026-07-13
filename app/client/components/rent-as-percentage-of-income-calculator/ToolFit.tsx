import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When a rent-to-income ratio helps",
  bestFor: [
    "Comparing rent and income entered for the same period.",
    "Normalizing mixed rent and income periods before calculating a percentage.",
    "Seeing how much of the selected income input is allocated to rent."
  ],
  notFor: [
    "This arithmetic result is not an affordability decision, approval rule, legal threshold, or full household budget."
  ],
  nextSteps: [
    {
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
