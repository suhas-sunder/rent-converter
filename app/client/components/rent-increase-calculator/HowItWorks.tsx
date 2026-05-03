import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent increase calculator",
  intro: "Rent increases are easier to judge when you can see the new rent, the monthly difference, and the annual impact together. This is useful for renewal notices, negotiation, and budget planning.",
  steps: [
    {
      title: "Percent and fixed increases behave differently",
      body: "A percentage increase scales with the current rent. A fixed increase adds the same dollar amount. Over multiple years, percentage increases can compound."
    },
    {
      title: "Annual impact is often clearer than monthly change",
      body: "A small monthly increase can become a larger yearly cost. Annual impact helps you compare renewing, moving, or negotiating."
    },
    {
      title: "Rules and caps are outside the math",
      body: "Local rent rules, notice periods, CPI caps, lease terms, and exemptions can matter. The calculator gives the math, not legal permission."
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
      body: "If rent rises by the same dollar amount each year, the pattern is linear. If it rises by a percent each year, the pattern compounds and later years increase more."
    }
  ],
  notes: [
    "Use this for rent increase calculator, rent increase percentage calculator, annual rent increase calculator, and calculating rent increase searches when they match the page.",
    "If you only know the old and new rent, use the percentage calculator. If you know the percentage and need the new rent, use rent after increase."
  ],
  relatedLinks: [
    {
      to: "/rent-increase-percentage-calculator",
      label: "Rent increase percentage"
    },
    {
      to: "/rent-after-increase-calculator",
      label: "Rent after increase"
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
