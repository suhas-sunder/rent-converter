import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Annual to hourly rent conversion",
  intro: "An annual-to-hourly conversion helps when one rent number is quoted on a different time basis than the number you budget with. The result is an equivalent rent amount for comparison, not a rewrite of the lease payment schedule.",
  steps: [
    {
      title: "What the hourly equivalent means",
      body: "It answers: if $24,000.00 per year continued across the year, what would that look like per hour? That makes unlike rent quotes easier to compare side by side."
    },
    {
      title: "Why the time basis matters",
      body: "Weekly, biweekly, monthly, and annual figures can look deceptively close until they are converted through one consistent day-based model."
    },
    {
      title: "What is outside the result",
      body: "The number is rent-only unless you include extras yourself. Utilities, deposits, parking, move-in fees, pet rent, and proration can change the real affordability picture."
    }
  ],
  examples: [
    {
      title: "Comparing an annual quote with an hourly budget",
      body: "$24,000.00 per year is about $2.74 per hour. That gives you a cleaner way to compare a listing with your normal budget period."
    },
    {
      title: "Checking annual pressure",
      body: "The same rent is about $24,000.00 per year. Annualizing is useful when two options use different billing cycles but both affect the same yearly budget."
    },
    {
      title: "Avoiding a false bargain",
      body: "If a listing looks cheaper only because it is quoted annually, convert it before comparing it with hourly rent. The period label can hide the real cost difference."
    }
  ],
  notes: [
    "Use the result as a comparison amount. Your lease still controls when rent is actually due.",
    "If the rent is paid every 4 weeks or every 28 days, compare it with the dedicated 4-week calculator because that is not the same as monthly rent."
  ],
  relatedLinks: [
    {
      to: "/rent-converter",
      label: "Rent converter"
    },
    {
      to: "/weekly-to-monthly-rent-converter",
      label: "Weekly to monthly"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
