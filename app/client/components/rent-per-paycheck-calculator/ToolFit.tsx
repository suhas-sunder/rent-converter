import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When paycheck budgeting helps",
  bestFor: [
    "Deciding how much to reserve from each paycheck for rent.",
    "Comparing biweekly and semi-monthly pay schedules.",
    "Checking whether rent feels manageable after taxes and deductions."
  ],
  notFor: [
    "Payroll deductions, tax withholding, paycheck dates, or legal affordability. This also does not change the lease due date."
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
