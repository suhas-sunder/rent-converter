import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent calendar context helps",
  bestFor: [
    "Planning the next rent payment date.",
    "Checking a fixed monthly due date against paydays.",
    "Understanding a 28-day rent cycle that moves through the calendar."
  ],
  notFor: [
    "Late-fee rules, legal deadlines, and grace periods depend on the lease and local rules."
  ],
  nextSteps: [
    {
      to: "/when-is-rent-due",
      label: "When rent is due"
    },
    {
      to: "/do-you-pay-rent-in-advance-or-after",
      label: "Rent in advance"
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
