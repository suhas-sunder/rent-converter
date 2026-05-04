import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Rent per day context",
  intro: "Daily rent is useful for proration, short stays, and comparing monthly rent with a partial-month cost.",
  steps: [
    {
      title: "It is an equivalent planning number",
      body: "A daily rent equivalent spreads the rent across a consistent year or month model. It is not automatically the same as a legal prorated daily charge."
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
      title: "Monthly to daily",
      body: "$2,000 per month is about $65.75 per day using an average calendar month."
    },
    {
      title: "Partial period planning",
      body: "If you only need to estimate a short stay or partial month, daily rent gives a quick planning number before lease-specific proration."
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
      to: "/",
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
