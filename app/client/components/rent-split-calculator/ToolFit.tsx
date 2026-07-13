import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When to use this equal split",
  bestFor: [
    "Dividing rent equally across the selected number of participants.",
    "Including visible shared monthly costs in the same equal split.",
    "Reconciling a total that does not divide evenly to the cent."
  ],
  notFor: [
    "Income-based and custom-percentage shares use the separate calculators below.",
    "The result does not determine legal responsibility or an objectively fair arrangement."
  ],
  nextSteps: [
    {
      to: "/split-rent-based-on-income-calculator",
      label: "Split by income"
    },
    {
      to: "/rent-split-percentage-calculator",
      label: "Use custom percentages"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
