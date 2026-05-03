import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent vs buy context helps",
  bestFor: [
    "Comparing monthly rent with estimated ownership costs.",
    "Testing how long you need to stay for buying to make sense.",
    "Spotting missing costs before relying on a simple monthly payment comparison."
  ],
  notFor: [
    "Mortgage approval, taxes, investment return, and legal advice need separate professional review."
  ],
  nextSteps: [
    {
      to: "/rent-increase-calculator",
      label: "Rent increase"
    },
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "Affordability"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
