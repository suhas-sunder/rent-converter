import { SeoHowItWorks } from "~/client/components/layout/SeoSupport";

type HowItWorksProps = Record<string, unknown>;

const howItWorks = {
  title: "Weekly to monthly rent conversion",
  intro: "Weekly rent, PW, PCW, and PCM listings are easy to misread because four weeks is only 28 days. This section explains what the monthly equivalent means and where the calculation shows up in real rental decisions.",
  steps: [
    {
      title: "PCM is a calendar-month comparison",
      body: "A per-calendar-month equivalent spreads the weekly rent across a 365-day year and divides by 12. It is meant for comparing listings and budgets, not for changing a weekly payment schedule."
    },
    {
      title: "Multiplying by 4 understates the cost",
      body: "Weekly rent times 4 gives a 28-day amount. An average calendar month is about 30.42 days, so the true monthly equivalent is usually higher."
    },
    {
      title: "The result still needs local context",
      body: "Listings may include or exclude utilities, council rates, parking, internet, strata fees, or other charges. Convert the rent first, then compare what is actually included."
    }
  ],
  examples: [
    {
      title: "$180 per week example",
      body: "$180 per week x 365 / 7 / 12 is about $782.14 per calendar month. Multiplying by 4 gives $720.00 for 28 days, not the average monthly equivalent."
    },
    {
      title: "$500 pw vs $2,150 pcm",
      body: "$500 per week is about $2,172.62 pcm. On rent alone, the weekly listing is about $22.62 more per calendar month than a $2,150 pcm listing."
    },
    {
      title: "$410 pw against an $1,800 pcm filter",
      body: "$410 per week is about $1,781.55 pcm. It fits the cap on rent alone, but utilities or parking could still push the real monthly cost over budget."
    },
    {
      title: "A 4-week mistake",
      body: "$500 per week times 4 is $2,000, but the calendar-month equivalent is $2,172.62. That gap matters when comparing weekly listings with monthly ones."
    }
  ],
  notes: [
    "Use this for PW to PCM, PCW to PCM, price per week to month, and rent per week to month comparisons.",
    "If the listing says rent is paid every 4 weeks, use the 28-day or 4-week calculator instead of assuming it is monthly."
  ],
  relatedLinks: [
    {
      to: "/pw-to-pcm-calculator",
      label: "PW to PCM"
    },
    {
      to: "/what-does-pcm-mean-rent",
      label: "What PCM means"
    },
    {
      to: "/monthly-to-weekly-rent-converter",
      label: "Monthly to weekly"
    },
    {
      to: "/rent-paid-every-4-weeks-calculator",
      label: "4-week rent"
    },
    {
      to: "/methodology",
      label: "Calculation methodology"
    }
  ]
};

export default function HowItWorks(_props: HowItWorksProps = {}) {
  return <SeoHowItWorks {...howItWorks} />;
}
