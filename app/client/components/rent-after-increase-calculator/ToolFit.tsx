import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent increase context helps",
  bestFor: [
    "Checking a renewal notice before responding.",
    "Comparing the new rent with your affordability limit.",
    "Understanding whether a fixed increase or percent increase changes the yearly budget more."
  ],
  notFor: [
    "Local law and lease terms can control whether an increase is allowed. This page only calculates the numbers."
  ],
  nextSteps: [
    {
      to: "/rent-increase-percentage-calculator",
      label: "Percentage increase"
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
