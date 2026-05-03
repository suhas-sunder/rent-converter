import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent due date planning",
  intro: "Rent due dates are simple until the due day falls on a weekend, a lease starts mid-month, or a 28-day payment cycle drifts through the calendar. This section explains how to use the date as a planning signal.",
  steps: [
    {
      title: "The lease controls the due rule",
      body: "Most rentals use a fixed monthly due date, but some use weekly, every-4-weeks, or custom schedules. The calculator should match the wording in the lease or notice."
    },
    {
      title: "Calendar dates affect cash flow",
      body: "A rent amount may be affordable on average but still difficult if the due date lands before income arrives."
    },
    {
      title: "Grace periods and late fees are separate",
      body: "A due date calculator can help you plan, but grace periods, late fees, and legal deadlines depend on the lease and local rules."
    }
  ],
  examples: [
    {
      title: "Rent due on the 1st",
      body: "If rent is due on the 1st, plan around the first calendar day of each month unless the lease says weekends or holidays move the date."
    },
    {
      title: "Every 4 weeks",
      body: "A 28-day schedule does not stay on the same calendar date. It can move earlier through the month over time."
    },
    {
      title: "Lease start date",
      body: "A lease that starts mid-month may have a first partial period, then regular rent due dates after that."
    }
  ],
  notes: [
    "Use this for rent due date calculator, rent calendar, lease date calculator, and when is rent due searches.",
    "This page helps with planning, not legal deadlines. Check the lease for exact requirements."
  ],
  relatedLinks: [
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    },
    {
      to: "/rent-converter",
      label: "Rent converter"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
