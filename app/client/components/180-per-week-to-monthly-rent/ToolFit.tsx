import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When 180 per week needs more context",
  bestFor: [
    "Checking whether $180.00 per week fits a monthly rent cap.",
    "Comparing an exact weekly listing with nearby PCM listings.",
    "Showing why the 4-week amount and monthly equivalent are different."
  ],
  notFor: [
    "Bills, deposits, moving costs, and local lease rules are not included unless you add them yourself."
  ],
  nextSteps: [
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
