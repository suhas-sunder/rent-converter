import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent due date planning",
  intro: "Enter the due date or recurring cadence stated in the written rental agreement. The calculator determines dates from that information; it does not decide the legal due date.",
  steps: [
    {
      title: "The lease controls the due rule",
      body: "Choose the monthly, weekly, biweekly, every-4-weeks, or annual cadence that matches the agreement, then enter its required date information."
    },
    {
      title: "Calendar dates affect cash flow",
      body: "A rent amount may be affordable on average but still difficult if the due date lands before income arrives."
    },
    {
      title: "Payment coverage is separate",
      body: "Whether a payment covers a period in advance or in arrears depends on the agreement and applicable rules. This calculator uses the dates entered and does not interpret that coverage."
    }
  ],
  examples: [
    {
      title: "Rent due on the 1st",
      body: "If the written agreement states that rent is due on the 1st, enter day 1 for the monthly calculation."
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
    "Use this for the next due date or recurring due-date cadence. Use the schedule calculator when you need a full table of lease payments.",
    "This page performs date arithmetic, not legal interpretation. Check the written agreement and the relevant official authority for applicable requirements."
  ],
  relatedLinks: [
    {
      to: "/rent-schedule-calculator",
      label: "Rent schedule"
    },
    {
      to: "/lease-date-calculator",
      label: "Lease date"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
