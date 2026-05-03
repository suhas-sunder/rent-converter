import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent vs take-home pay",
  intro: "Take-home pay is the money rent actually comes out of. Comparing rent with after-tax income can show pressure that a gross-salary rule hides.",
  steps: [
    {
      title: "Gross income can make rent look easier than it feels",
      body: "Taxes, benefits, retirement contributions, and deductions reduce the cash available for rent. A rent-to-take-home comparison starts closer to real monthly cash flow."
    },
    {
      title: "Monthly rent still has to line up with pay timing",
      body: "A rent amount may be affordable on average but stressful if the due date lands before enough take-home pay has arrived."
    },
    {
      title: "The leftover number matters",
      body: "After rent, the remaining take-home pay has to cover utilities, food, transport, debt, savings, insurance, and irregular expenses."
    }
  ],
  examples: [
    {
      title: "$2,000 rent against $5,000 take-home pay",
      body: "Rent uses 40% of take-home pay, leaving $3,000 for every other monthly cost before savings."
    },
    {
      title: "Salary rule vs cash flow",
      body: "A 30% gross-income rule can pass while take-home pay still feels tight, especially with debt, insurance, childcare, or irregular expenses."
    },
    {
      title: "Paycheck timing",
      body: "If rent is due on the 1st and payday is later, you may need to reserve more from the prior pay period even when the average ratio looks fine."
    }
  ],
  notes: [
    "Use this for rent vs take-home pay, what percent of take-home pay for rent, and paycheck budgeting questions.",
    "For biweekly or semi-monthly reserve amounts, use the rent per paycheck calculator."
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
