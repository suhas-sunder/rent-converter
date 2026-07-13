import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent increase calculator",
  intro: "Enter the current rent, choose a percentage or fixed-amount increase, and see the resulting rent. The calculator also shows the difference for the selected payment period and its annualized impact.",
  steps: [
    {
      title: "Percentage increase formula",
      body: "Increase amount = current rent × percentage ÷ 100. The resulting rent is the current rent plus that calculated increase."
    },
    {
      title: "Fixed increase formula",
      body: "New rent = current rent + fixed increase. The fixed amount uses the same payment period as the current rent you enter."
    },
    {
      title: "CPI is an entered scenario",
      body: "The calculator does not retrieve official CPI data. Any percentage is supplied by you, the result is arithmetic only, and no jurisdictional cap is applied automatically. Verify any applicable CPI figure or legal rule separately."
    }
  ],
  examples: [
    {
      title: "$1,538 with a 7.5% increase",
      body: "$1,538 increased by 7.5% becomes $1,653.35. The monthly change is $115.35, and the annualized change is $1,384.20."
    },
    {
      title: "$800 rent with a $70 increase",
      body: "$800 plus $70 becomes $870. Over a year, that fixed increase adds $840 before any later changes."
    },
    {
      title: "Checking a projection",
      body: "One increase is one-step arithmetic. If you enter more than one percentage increase, each step applies to the prior result; use the compound calculator for a dedicated year-by-year annual view."
    }
  ],
  notes: [
    "Monthly and annualized differences follow the visible payment-period assumptions; they do not determine whether an increase is permitted.",
    "If you know only the starting and new rent, use the percentage calculator to find the arithmetic percentage change."
  ],
  relatedLinks: [
    {
      to: "/rent-increase-percentage-calculator",
      label: "Rent increase percentage"
    },
    {
      to: "/compound-rent-increase-calculator",
      label: "Compound rent increase"
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
