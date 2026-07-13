import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Income required for rent",
  intro: "A multiplier compares income with rent. Choose the visible direction, then select 2x, 2.5x, 3x, or enter a custom multiplier.",
  steps: [
    {
      title: "Calculate required income",
      body: "Required income = rent × selected multiplier. For example, $1,500 rent at 3x produces $4,500 required monthly income."
    },
    {
      title: "Reverse the calculation",
      body: "Maximum rent = income ÷ selected multiplier. Reverse mode changes the visible input and output without changing the multiplier arithmetic."
    },
    {
      title: "Choose a scenario",
      body: "The 2x, 2.5x, and 3x presets are arithmetic scenarios. Custom input supports another positive multiplier when a listing uses one."
    }
  ],
  examples: [
    {
      title: "2x",
      body: "$1,500 monthly rent × 2 = $3,000 required monthly income."
    },
    {
      title: "2.5x",
      body: "$1,500 monthly rent × 2.5 = $3,750 required monthly income."
    },
    {
      title: "3x",
      body: "$1,500 monthly rent × 3 = $4,500 required monthly income."
    }
  ],
  notes: [
    "Multiplier rules may be screening references, but this calculator does not determine application approval.",
    "Actual qualification can depend on the landlord or property manager, jurisdiction, lease, income definition, and other requirements. Credit, debt, references, deposits, and local law are not evaluated."
  ],
  relatedLinks: [
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
    },
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "How much rent can I afford"
    },
    {
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
