import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent as a percentage of income",
  intro: "A rent-to-income ratio shows how much of your income is absorbed by rent before utilities and other living costs. It is a simple pressure test, not a complete budget.",
  steps: [
    {
      title: "Income rules are shortcuts, not approvals",
      body: "A 30% rule, 2.5x rent rule, or 3x rent rule can screen a rental budget quickly, but landlords and personal budgets can use different standards."
    },
    {
      title: "Rent is only one housing cost",
      body: "Utilities, renters insurance, parking, deposits, moving costs, debt payments, and savings goals can all change what feels affordable."
    },
    {
      title: "Gross and take-home income tell different stories",
      body: "Gross income is useful for common qualification rules. Take-home income is often better for monthly cash-flow planning."
    }
  ],
  examples: [
    {
      title: "$60k income at 30%",
      body: "$60,000 per year gives a rough rent target of $1,500 per month at 30% of gross income. That still needs to be checked against take-home pay and bills."
    },
    {
      title: "3x rent qualification",
      body: "For $1,800 rent, a 3x rule points to about $5,400 monthly income, or $64,800 per year. Some landlords may calculate this before tax."
    },
    {
      title: "Paycheck reality check",
      body: "A rent that looks fine against salary can feel tight if take-home pay is lower because of taxes, benefits, debt, or irregular hours."
    }
  ],
  notes: [
    "Use the result as a planning number before you apply, not as a guarantee of approval.",
    "If you are comparing rent to paychecks, the paycheck calculator may be more practical than an annual salary rule."
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
