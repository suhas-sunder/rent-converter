import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent per week context",
  intro: "Weekly rent is useful when listings, roommates, or budgets are easier to compare on a week-by-week basis.",
  steps: [
    {
      title: "It is an equivalent planning number",
      body: "A weekly equivalent helps compare monthly or annual rent with PW listings, but it does not change the lease billing period."
    },
    {
      title: "Proration can use different rules",
      body: "Some leases prorate by actual days in the month, a 30-day month, or another stated method. Check the lease if the number is for a move-in or move-out charge."
    },
    {
      title: "Small period changes add up",
      body: "A daily or weekly number can look small, but the annual total shows the full housing cost."
    }
  ],
  examples: [
    {
      title: "Monthly to weekly",
      body: "$2,000 per month is about $460.27 per week using a 365-day year."
    },
    {
      title: "Partial period planning",
      body: "If your income is weekly, a weekly rent equivalent can be easier to compare with paychecks than a monthly number."
    },
    {
      title: "Compare against annual cost",
      body: "Always sanity-check the annual amount so the smaller period label does not hide the real cost."
    }
  ],
  notes: [
    "Use the lease method for official prorated rent.",
    "Use the converter when you need the same rent shown across several periods."
  ],
  relatedLinks: [
    {
      to: "/rent-converter",
      label: "Rent converter"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/daily-to-monthly-rent-converter",
      label: "Daily to monthly"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
