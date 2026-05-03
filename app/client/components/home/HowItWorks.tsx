import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "How rent conversion helps in real decisions",
  intro: "Rent listings use weekly, monthly, every-4-weeks, biweekly, daily, hourly, and annual language. The main converter gives one shared comparison surface so the period label does not hide the real cost.",
  steps: [
    {
      title: "Different rent periods can describe the same housing cost",
      body: "A weekly listing and a monthly listing can only be compared fairly after both are put on the same time basis."
    },
    {
      title: "4-week rent is the common trap",
      body: "Every 4 weeks creates 13 payments per year. Monthly rent creates 12. The converter highlights that difference instead of treating 28 days as a month."
    },
    {
      title: "The best output depends on the decision",
      body: "Monthly helps with budgets, weekly helps with listings and pay cycles, annual helps with long-term cost, and 4-week output helps with 28-day billing."
    }
  ],
  examples: [
    {
      title: "Weekly listing vs monthly budget",
      body: "A $500/week listing is about $2,172.62/month, not $2,000/month. That difference can decide whether the place fits."
    },
    {
      title: "Every 4 weeks vs monthly",
      body: "$2,000 every 4 weeks is $26,000/year, or about $2,166.67/month on average."
    },
    {
      title: "Paycheck planning",
      body: "A monthly rent number may still need to be broken into biweekly or semi-monthly paycheck reserves so cash is ready before rent is due."
    }
  ],
  notes: [
    "Use the more specific calculator when your question is about affordability, paycheck budgeting, rent increases, due dates, or rent splitting.",
    "The converter is strongest when the main problem is period mismatch."
  ],
  relatedLinks: [
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    },
    {
      to: "/rent-per-paycheck-calculator",
      label: "Rent per paycheck"
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
