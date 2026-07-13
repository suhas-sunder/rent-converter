import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When weekly-to-monthly context matters",
  bestFor: [
    "Comparing weekly rental listings with monthly or PCM listings.",
    "Checking whether a weekly room, flat, or apartment fits a monthly rent cap.",
    "Explaining why weekly times 4 is not the same as a calendar-month equivalent."
  ],
  notFor: [
    "Market rent data or city-specific price estimates.",
    "Legal rent, tenancy terms, bond requirements, rent-increase limits, or an exact lease payment schedule."
  ],
  nextSteps: [
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/rent-as-percentage-of-income-calculator",
      label: "Rent as percentage of income"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
