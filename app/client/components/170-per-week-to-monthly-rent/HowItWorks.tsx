import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "170 per week to monthly rent",
  intro: "People search this exact number when a listing says 170 per week and they need the real PCM-style monthly equivalent. The important part is separating a 28-day amount from a calendar-month comparison.",
  steps: [
    {
      title: "The monthly equivalent",
      body: "$170.00 per week is about $738.69 per calendar month using a 365-day year. That is the number to compare with PCM listings."
    },
    {
      title: "The 4-week shortcut",
      body: "$170.00 times 4 is $680.00, but that only covers 28 days. It is useful for a 4-week rent cycle, not for a calendar-month equivalent."
    },
    {
      title: "The yearly view",
      body: "The same weekly rent is about $8,864.29 per year before bills, deposits, or fees. This helps show whether a cheap-looking weekly number still fits the annual budget."
    }
  ],
  examples: [
    {
      title: "Monthly budget check",
      body: "If your rent cap is $800.00 pcm, $170.00 per week leaves only about $61.31 before extras."
    },
    {
      title: "Listing comparison",
      body: "Compare $170.00 pw against PCM listings near $738.69 rather than against $680.00. That avoids choosing a place because the weekly label made it look cheaper."
    },
    {
      title: "Bills included vs excluded",
      body: "If the weekly listing includes bills, compare it with monthly listings after adding estimated utilities. If bills are excluded, the converted rent is only the starting point."
    }
  ],
  notes: [
    "Searches like 170 pw to pcm and 170 per week to month are about comparison, not the rent due date.",
    "Always check whether the listing says per week, per calendar month, or every 4 weeks."
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
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
