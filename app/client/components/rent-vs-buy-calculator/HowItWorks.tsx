import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent vs buy comparison context",
  intro: "Rent-vs-buy math is useful when you want a planning comparison, not a universal answer. Monthly cash flow, upfront costs, time horizon, and risk all matter.",
  steps: [
    {
      title: "Monthly payment is not the whole decision",
      body: "Buying can include taxes, insurance, maintenance, HOA fees, closing costs, and opportunity cost. Renting can include rent increases, deposits, and moving flexibility."
    },
    {
      title: "Time horizon changes the answer",
      body: "Buying costs are front-loaded. Renting can be more flexible in the short term, while ownership may look different over a longer horizon."
    },
    {
      title: "Non-financial factors matter",
      body: "School location, job uncertainty, maintenance responsibility, and lifestyle flexibility can outweigh a narrow monthly comparison."
    }
  ],
  examples: [
    {
      title: "Short stay",
      body: "If you may move within a year or two, transaction costs can make buying harder to justify even when monthly ownership looks close."
    },
    {
      title: "High maintenance risk",
      body: "A mortgage-like payment can still be more expensive than rent if repairs, taxes, and insurance are not included in the estimate."
    },
    {
      title: "Rent increase pressure",
      body: "If rent is rising quickly, compare projected rent against ownership costs over the same time horizon rather than only this month."
    }
  ],
  notes: [
    "Use this as a decision framework, not financial advice.",
    "The rent converter and affordability tools can help normalize the rent side before comparison."
  ],
  relatedLinks: [
    {
      to: "/rent-increase-calculator",
      label: "Rent increase"
    },
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "Affordability"
    },
    {
      to: "/",
      label: "Rent converter"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
