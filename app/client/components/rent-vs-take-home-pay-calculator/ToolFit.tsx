import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When take-home pay gives the better signal",
  bestFor: [
    "Checking whether rent still feels workable after taxes and deductions.",
    "Comparing a rent number with monthly cash flow instead of gross salary.",
    "Spotting when a rent-to-income ratio looks fine but leaves too little money for bills."
  ],
  notFor: [
    "This does not replace a full budget or decide whether a landlord will approve an application."
  ],
  nextSteps: [
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "Affordability"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
