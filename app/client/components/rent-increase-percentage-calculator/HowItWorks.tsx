import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent increase percentage calculator",
  intro: "Enter the starting rent and new rent for the same payment period to find the arithmetic percentage change and the absolute difference.",
  steps: [
    {
      title: "Start with old and new rent",
      body: "The starting rent is the comparison base. The new rent is the amount after the change; both inputs must use the same payment period."
    },
    {
      title: "Reverse percentage formula",
      body: "Percentage increase = (new rent − old rent) ÷ old rent × 100. The calculator also shows the absolute and annualized differences."
    },
    {
      title: "A zero starting rent has no meaningful percentage",
      body: "When old rent is zero, it cannot be used as the divisor for a percentage comparison. The calculator reports the absolute change instead."
    }
  ],
  examples: [
    {
      title: "$2,000 to $2,100",
      body: "The change is $100. Dividing $100 by the $2,000 starting rent and multiplying by 100 gives a 5% increase."
    },
    {
      title: "Use matching periods",
      body: "Compare monthly rent with monthly rent, or weekly rent with weekly rent. Mixing periods would produce a misleading percentage."
    },
    {
      title: "Arithmetic, not permission",
      body: "The percentage describes the numeric change between the amounts. It does not determine whether that change is legally permitted."
    }
  ],
  notes: [
    "Use the forward rent increase calculator when you know a percentage or fixed amount and need the resulting rent.",
    "This route does not add a proposed increase to rent; it measures the change between two entered amounts."
  ],
  relatedLinks: [
    {
      to: "/rent-increase-calculator",
      label: "Calculate new rent after an increase"
    },
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "Affordability"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
