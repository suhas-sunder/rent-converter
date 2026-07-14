import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When rent calendar context helps",
  bestFor: [
    "Planning the next rent payment date.",
    "Checking a fixed monthly due date against paydays.",
    "Understanding a 28-day rent cycle that moves through the calendar."
  ],
  notFor: [
    "Determining legal due dates, payment coverage, or enforcement rules; check the written agreement and relevant official authority."
  ],
  nextSteps: [
    {
      to: "/rent-schedule-calculator",
      label: "Rent schedule"
    },
    {
      to: "/lease-date-calculator",
      label: "Lease date"
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
