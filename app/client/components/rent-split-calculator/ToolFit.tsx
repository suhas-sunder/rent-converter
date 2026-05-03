import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent split context helps",
  bestFor: [
    "Splitting rent between roommates before signing a lease.",
    "Comparing equal shares with income-based shares.",
    "Making a room-size or parking adjustment clear before money is due."
  ],
  notFor: [
    "Utilities, deposits, damages, and lease liability may need separate agreements."
  ],
  nextSteps: [
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as income share"
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
