import { SeoToolFit } from "~/client/components/layout/SeoSupport";

const toolFit = {
  title: "When weekly-to-monthly context matters",
  bestFor: [
    "Comparing weekly rental listings with monthly or PCM listings.",
    "Checking whether a weekly room, flat, or apartment fits a monthly rent cap.",
    "Explaining why weekly times 4 is not the same as a calendar-month equivalent."
  ],
  notFor: [
    "A lease can still require weekly, fortnightly, 4-weekly, or monthly payments depending on its wording.",
    "Included bills and local rental practices can change the final comparison."
  ],
  nextSteps: [
    {
      to: "/pw-to-pcm-calculator",
      label: "PW to PCM"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/methodology",
      label: "Calculation methodology"
    }
  ]
};

export default function ToolFit() {
  return <SeoToolFit {...toolFit} />;
}
