import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent per paycheck in Canada",
  intro: "Paycheck budgeting helps when rent is monthly but income arrives biweekly, semi-monthly, weekly, or on another schedule. The key is matching rent to the way cash actually arrives.",
  steps: [
    {
      title: "Biweekly is not semi-monthly",
      body: "Biweekly pay usually means 26 paychecks per year. Semi-monthly pay usually means 24. That difference changes the amount you need to reserve from each paycheck."
    },
    {
      title: "Rent due date still matters",
      body: "Spreading rent across paychecks is a budgeting method. It does not change when rent is due or whether one paycheck needs to cover more of the payment."
    },
    {
      title: "Take-home pay is often the better comparison",
      body: "Rent is paid with after-tax money. Comparing against take-home pay can reveal pressure that a gross-salary calculation misses."
    }
  ],
  examples: [
    {
      title: "$2,000 rent with biweekly pay",
      body: "Spread across 26 paychecks, $2,000 monthly rent is about $923.08 per biweekly paycheck on average."
    },
    {
      title: "$2,000 rent with semi-monthly pay",
      body: "Spread across 24 paychecks, the same rent is $1,000 per semi-monthly paycheck. Same rent, different cash-flow rhythm."
    },
    {
      title: "First paycheck problem",
      body: "If rent is due before the second paycheck arrives, you may need to hold more from the prior paycheck even if the average per-paycheck number looks manageable."
    }
  ],
  notes: [
    "Use this for how much of paycheck should go to rent and rent per paycheck calculator searches.",
    "Irregular income, overtime, commissions, and benefit deductions can change the practical answer."
  ],
  relatedLinks: [
    {
      to: "/rent-vs-take-home-pay-calculator",
      label: "Rent vs take-home pay"
    },
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
