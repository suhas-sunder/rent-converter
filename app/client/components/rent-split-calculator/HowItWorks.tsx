import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent split scenarios",
  intro: "A rent split is not always just total rent divided by roommates. Income, room size, parking, private bathrooms, and utilities can all change what feels fair.",
  steps: [
    {
      title: "Equal split is the clean baseline",
      body: "Start with equal shares when rooms and incomes are similar. It gives everyone a simple number to compare against other methods."
    },
    {
      title: "Income-based split can reduce pressure",
      body: "When incomes differ a lot, splitting by income can make the rent burden more balanced, even if the dollar amounts are not equal."
    },
    {
      title: "Room adjustments should be explicit",
      body: "If one room is larger or includes parking, agree on the adjustment before calculating shares so the result does not feel arbitrary."
    }
  ],
  examples: [
    {
      title: "Equal roommates",
      body: "$2,400 split between three roommates is $800 each before utilities or room adjustments."
    },
    {
      title: "Income share",
      body: "If one roommate earns 60% of the household income and another earns 40%, an income-based split applies those same shares to the rent."
    },
    {
      title: "Room premium",
      body: "A larger bedroom might carry a fixed premium first, then the remaining rent can be split equally or by income."
    }
  ],
  notes: [
    "Use this for rent split calculator, split rent by income calculator, and rent calculator split based on income searches.",
    "The calculator gives a transparent starting point. The final agreement still needs roommate consent."
  ],
  relatedLinks: [
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
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
