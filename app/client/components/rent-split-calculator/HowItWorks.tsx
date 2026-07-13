import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "How the equal split works",
  intro: "The calculator divides rent and any visible shared monthly costs equally across the selected participant count.",
  steps: [
    {
      title: "Start with rent",
      body: "Shared costs default to zero, so the first result splits rent only. Add monthly costs only when they should use the same equal split."
    },
    {
      title: "Divide the displayed total",
      body: "Total shared cost = rent + the visible shared-cost equivalent for that rent period. The calculator divides that total by the whole-number participant count."
    },
    {
      title: "Reconcile cent remainders",
      body: "When the total does not divide evenly to the cent, the guidance shows how many participants pay one cent more so the allocation matches exactly."
    }
  ],
  examples: [
    {
      title: "Rent only",
      body: "$2,400 rent with shared costs left at zero is $800 each across three participants."
    },
    {
      title: "Rent plus shared costs",
      body: "$2,400 monthly rent plus $150 in shared monthly costs produces a $2,550 total before the equal split."
    }
  ],
  notes: [
    "Equal splitting is one method, not an objective determination of fairness.",
    "Use the separate income-based or custom-percentage calculator when the shares should differ."
  ],
  relatedLinks: [
    {
      to: "/split-rent-based-on-income-calculator",
      label: "Split rent based on income"
    },
    {
      to: "/rent-split-percentage-calculator",
      label: "Split rent by custom percentage"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
