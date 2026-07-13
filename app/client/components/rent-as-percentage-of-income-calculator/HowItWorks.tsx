import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent as a percentage of income",
  intro: "A rent-to-income ratio is rent divided by income. The calculator normalizes both visible periods before applying rent percentage = rent ÷ income × 100.",
  steps: [
    {
      title: "Match the time periods",
      body: "Rent and income must cover equivalent periods. Select each period separately and the calculator annualizes both inputs before comparing them."
    },
    {
      title: "Apply the percentage formula",
      body: "$1,500 monthly rent ÷ $5,000 monthly income × 100 = 30%. The same formula works for mixed periods after normalization."
    },
    {
      title: "Read the result as arithmetic",
      body: "A higher percentage means more of the entered income is allocated to rent. It does not determine affordability, suitability, or application approval."
    }
  ],
  examples: [
    {
      title: "Monthly example",
      body: "$1,500 rent and $5,000 income for the same month produce a 30% rent-to-income ratio. No expenses are inferred or subtracted."
    }
  ],
  notes: [
    "Gross income, take-home income, and after-tax estimates are different inputs and should not be treated as interchangeable.",
    "The result uses only the rent, income, and periods entered; it is not a financial suitability decision."
  ],
  relatedLinks: [
    {
      to: "/how-much-rent-can-i-afford-calculator",
      label: "How much rent can I afford"
    },
    {
      to: "/income-required-for-rent-calculator",
      label: "Income required"
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
