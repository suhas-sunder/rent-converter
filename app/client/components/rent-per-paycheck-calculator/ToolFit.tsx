import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When paycheck budgeting helps",
  bestFor: [
    "Deciding how much to reserve from each paycheck for rent.",
    "Comparing biweekly and semi-monthly pay schedules.",
    "Checking whether rent feels manageable after taxes and deductions."
  ],
  notFor: [
    "This does not change the lease due date or account for every bill in your budget."
  ],
  nextSteps: [
    {
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
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
