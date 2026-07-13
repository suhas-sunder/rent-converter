import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent increase context helps",
  bestFor: [
    "Finding the percentage change when old and new rent are known.",
    "Checking the absolute and annualized difference between two rent amounts.",
    "Comparing like-for-like rent amounts that use the same payment period."
  ],
  notFor: [
    "Local law and lease terms can control whether an increase is allowed. This page only calculates the numbers."
  ],
  nextSteps: [
    {
      to: "/rent-increase-calculator",
      label: "Calculate new rent"
    },
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent percentage of income"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
