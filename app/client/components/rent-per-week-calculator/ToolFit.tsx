import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When weekly rent helps",
  bestFor: [
    "Comparing monthly rent with weekly listings.",
    "Turning a large rent number into a period that matches budgeting conversations.",
    "Checking whether the smaller period amount still makes sense annually."
  ],
  notFor: [
    "Official proration can depend on the lease, property manager, and local rules."
  ],
  nextSteps: [
    {
      to: "/",
      label: "Rent converter"
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
