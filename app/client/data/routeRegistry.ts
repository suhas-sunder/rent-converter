import {
  australiaLinks,
  conversionPageConfigs,
  dateToolConfigs,
  incomeToolConfigs,
  increaseToolConfigs,
  infoPageConfigs,
  moveInCostConfigs,
  prorationToolConfigs,
  salaryAnswerConfigs,
  splitToolConfigs,
  weeklyAnswerPageConfigs,
} from "~/client/data/generatedRouteConfigs";

export type RegistryLink = {
  label: string;
  href: string;
  description?: string;
  keywords?: string[];
};

export type SitemapSection = {
  title: string;
  description: string;
  links: RegistryLink[];
};

export type RedirectAlias = {
  from: string;
  to: string;
};

const item = (
  href: string,
  label: string,
  description?: string,
  keywords: string[] = [],
): RegistryLink => ({
  href,
  label,
  description,
  keywords,
});

const fromConfig = (
  config: { path: string; title: string; description: string },
  label?: string,
  keywords: string[] = [],
): RegistryLink =>
  item(
    config.path,
    label ?? config.title.split("|")[0].trim(),
    config.description,
    keywords,
  );

const frequencyConverters: RegistryLink[] = [
  item("/monthly-to-weekly-rent-converter", "Monthly to weekly rent converter", "Turn a monthly rent budget into a 7-day weekly equivalent.", ["monthly", "weekly", "pcm", "pw"]),
  item("/weekly-to-monthly-rent-converter", "Weekly to monthly rent converter", "Annualize weekly rent over 365 days and compare it with a calendar-month budget.", ["weekly", "monthly", "pw", "pcm"]),
  item("/weekly-to-annual-rent-converter", "Weekly to annual rent converter", "Convert weekly rent into a 365-day yearly total with monthly and 4-week context.", ["weekly", "annual"]),
  item("/weekly-to-biweekly-rent-converter", "Weekly to biweekly rent converter", "Convert weekly rent into a 14-day biweekly amount and annual equivalent.", ["weekly", "biweekly"]),
  item("/biweekly-to-weekly-rent-converter", "Biweekly to weekly rent converter", "Turn a 14-day rent amount into a weekly equivalent for side-by-side comparison.", ["biweekly", "weekly"]),
  item("/biweekly-to-monthly-rent-converter", "Biweekly to monthly rent converter", "Convert a 14-day rent amount into true calendar-month rent.", ["biweekly", "monthly"]),
  item("/biweekly-to-annual-rent-converter", "Biweekly to annual rent converter", "Annualize biweekly rent from a 14-day cycle using the 365-day model.", ["biweekly", "annual"]),
  item("/monthly-to-annual-rent-converter", "Monthly to annual rent converter", "Multiply monthly rent across 12 calendar months for yearly rent planning.", ["monthly", "annual"]),
  item("/annual-to-monthly-rent-converter", "Annual to monthly rent converter", "Split annual rent into a calendar-month amount and related period equivalents.", ["annual", "monthly"]),
  item("/monthly-to-daily-rent-converter", "Monthly to daily rent converter", "Convert monthly rent into a daily rate using 365 divided by 12 days per month.", ["monthly", "daily"]),
  item("/daily-to-monthly-rent-converter", "Daily to monthly rent converter", "Turn a daily rent or nightly rate into a calendar-month equivalent.", ["daily", "monthly"]),
  item("/monthly-to-hourly-rent-converter", "Monthly to hourly rent converter", "Break monthly rent into hourly and daily equivalents for cost comparison.", ["monthly", "hourly"]),
  item("/hourly-to-monthly-rent-converter", "Hourly to monthly rent converter", "Convert an hourly rent amount into daily, monthly, and annual equivalents.", ["hourly", "monthly"]),
  item("/hourly-to-annual-rent-converter", "Hourly to annual rent converter", "Annualize hourly rent over 24 hours and 365 days.", ["hourly", "annual"]),
  item("/annual-to-hourly-rent-converter", "Annual to hourly rent converter", "Break annual rent into hourly, daily, weekly, and monthly equivalents.", ["annual", "hourly"]),
  item("/annual-to-weekly-rent-converter", "Annual to weekly rent converter", "Convert yearly rent into a 7-day weekly equivalent using the 365-day model.", ["annual", "weekly"]),
  item("/annual-to-biweekly-rent-converter", "Annual to biweekly rent converter", "Convert annual rent into a 14-day biweekly equivalent.", ["annual", "biweekly"]),
  item("/monthly-to-biweekly-rent-converter", "Monthly to biweekly rent converter", "Convert monthly rent into a 14-day biweekly amount for paycheck planning.", ["monthly", "biweekly"]),
];

const pwPcmSection = [
  fromConfig(conversionPageConfigs["/pw-to-pcm-calculator"], "PW to PCM calculator", ["pw", "pcm", "weekly", "monthly"]),
  fromConfig(conversionPageConfigs["/pcm-to-pw-calculator"], "PCM to PW calculator", ["pcm", "pw", "monthly", "weekly"]),
  fromConfig(infoPageConfigs["/what-does-pcm-mean-rent"], "What does PCM mean in rent?", ["pcm", "meaning"]),
  fromConfig(infoPageConfigs["/what-does-pw-mean-rent"], "What does PW mean in rent?", ["pw", "meaning"]),
  fromConfig(infoPageConfigs["/pcm-vs-pw-rent"], "PCM vs PW rent", ["pcm", "pw", "compare"]),
  fromConfig(infoPageConfigs["/per-calendar-month-rent"], "Per calendar month rent", ["calendar month", "pcm"]),
];

const generalCalculators: RegistryLink[] = [
  item("/rent-per-day-calculator", "Rent per day calculator", "Find the daily rent behind a weekly, monthly, 4-week, or annual amount.", ["daily", "per day"]),
  item("/rent-per-week-calculator", "Rent per week calculator", "Convert rent into a weekly amount using a 365-day daily-rate model.", ["weekly", "per week"]),
  item("/rent-paid-every-4-weeks-calculator", "Rent paid every 4 weeks calculator", "Compare 28-day rent cycles with calendar months.", ["4 weeks", "28 day"]),
  item("/rent-per-paycheck-calculator", "Rent per paycheck calculator", "Plan rent around biweekly, semi-monthly, weekly, or monthly pay.", ["paycheck", "pay"]),
  item("/rent-split-calculator", "Rent split calculator", "Split rent between roommates with equal-share planning.", ["split", "roommate"]),
  item("/rent-due-date-calculator", "Rent due date calculator", "Calculate upcoming rent due dates from a start date and payment schedule.", ["due date", "calendar"]),
  item("/prorated-rent-calculator", "Prorated rent calculator", "Estimate partial-period rent for a move-in, move-out, or mid-cycle change.", ["prorated", "partial"]),
  fromConfig(dateToolConfigs["/rent-schedule-calculator"], "Rent schedule calculator", ["schedule", "dates"]),
];

const affordabilitySection = [
  item("/how-much-rent-can-i-afford-calculator", "How much rent can I afford calculator", "Estimate rent targets from income, monthly costs, and common affordability rules.", ["afford", "income"]),
  item("/rent-as-percentage-of-income-calculator", "Rent as percentage of income calculator", "Calculate rent as a share of income and compare it with common affordability bands.", ["percentage", "income"]),
  item("/rent-after-tax-income-calculator", "Rent after tax income calculator", "Compare rent with after-tax income instead of gross salary alone.", ["after tax", "income"]),
  item("/rent-vs-take-home-pay-calculator", "Rent vs take-home pay calculator", "Check how much of take-home pay is left after rent.", ["take home", "pay"]),
  item("/income-required-for-rent-calculator", "Income required for rent calculator", "Estimate income needed for a target rent under common screening rules.", ["required income"]),
  ...Object.values(incomeToolConfigs).map((config) => fromConfig(config)),
  ...Object.values(salaryAnswerConfigs).map((config) => fromConfig(config)),
];

const increaseSection = [
  item("/rent-increase-calculator", "Rent increase calculator", "Calculate new rent, monthly change, and yearly impact after an increase.", ["increase"]),
  item("/rent-increase-percentage-calculator", "Rent increase percentage calculator", "Calculate the percent change between old and new rent.", ["increase", "percentage"]),
  item("/rent-after-increase-calculator", "Rent after increase calculator", "See the new monthly rent after a fixed or percentage increase.", ["after increase"]),
  ...Object.values(increaseToolConfigs).map((config) => fromConfig(config)),
];

const splitSection = [
  item("/rent-split-calculator", "Rent split calculator", "Split rent between roommates and compare each monthly share.", ["split", "roommate"]),
  ...Object.values(splitToolConfigs).map((config) => fromConfig(config)),
];

const australiaSection = [
  item("/weekly-to-monthly-rent-australia", "Weekly to monthly rent Australia", "Convert Australian weekly rent into a calendar-month amount and 4-week comparison.", ["australia", "weekly", "monthly"]),
  ...Object.values(conversionPageConfigs).filter((config) => australiaLinks.some((related) => related.to === config.path)).map((config) => fromConfig(config)),
  ...Object.values(moveInCostConfigs).map((config) => fromConfig(config)),
  ...Object.values(prorationToolConfigs).map((config) => fromConfig(config)),
];

const ukSection = [
  item("/weekly-to-monthly-rent-uk", "Weekly to monthly rent UK", "Convert UK PW rent into PCM using the annualized 365-day method.", ["uk", "weekly", "monthly"]),
  ...Object.values(conversionPageConfigs)
    .filter((config) => ["/pcm-rent-calculator", "/pw-rent-calculator", "/weekly-to-monthly-rent-formula-uk", "/convert-weekly-rent-to-monthly-uk", "/4-weekly-to-monthly-rent-uk"].includes(config.path))
    .map((config) => fromConfig(config)),
  fromConfig(infoPageConfigs["/per-calendar-month-rent-uk"], "Per calendar month rent UK", ["uk", "pcm"]),
];

const answerSection = Object.values(weeklyAnswerPageConfigs).map((config) => fromConfig(config));

const dateSection = [
  item("/rent-due-date-calculator", "Rent due date calculator", "Calculate upcoming rent due dates.", ["due date"]),
  item("/when-is-rent-due", "When is rent due?", "Understand lease due dates, grace periods, payment cutoffs, and timing.", ["due", "timing"]),
  item("/do-you-pay-rent-in-advance-or-after", "Do you pay rent in advance or after?", "Understand what rental period a rent payment usually covers.", ["advance", "after"]),
  fromConfig(infoPageConfigs["/is-rent-due-on-the-first"], "Is rent due on the first?", ["first", "due"]),
  fromConfig(infoPageConfigs["/is-rent-paid-for-the-current-month-or-next-month"], "Current month or next month rent", ["current month", "next month"]),
  ...Object.values(dateToolConfigs).map((config) => fromConfig(config)),
];

export const sitemapSections: SitemapSection[] = [
  {
    title: "RentConverter Sitemap",
    description: "Browse RentConverter calculators and supporting pages for rent conversion, affordability, increases, splits, due dates, and paycheck planning.",
    links: [
      item("/", "Home", "Start with the main rent converter."),
      item("/about", "About", "Learn what RentConverter is built for."),
      item("/contact", "Contact", "Contact the RentConverter team."),
    ],
  },
  {
    title: "Rent converters",
    description: "Convert rent between weekly, biweekly, monthly, annual, daily, hourly, and 4-week payment periods.",
    links: [...frequencyConverters, ...pwPcmSection],
  },
  {
    title: "PW and PCM glossary",
    description: "Understand weekly, monthly, and per-calendar-month rent listing terms.",
    links: pwPcmSection,
  },
  {
    title: "General rent calculators",
    description: "Tools for paycheck planning, due dates, prorated rent, schedules, and rent splits.",
    links: generalCalculators,
  },
  {
    title: "Affordability and income",
    description: "Estimate affordability, income ratios, rent rules, salary-based rent, and hourly-pay rent targets.",
    links: affordabilitySection,
  },
  {
    title: "Rent increase",
    description: "Calculate simple, percentage, compound, CPI, scheduled, and regional rent increase estimates.",
    links: increaseSection,
  },
  {
    title: "Rent split",
    description: "Split rent equally, by income, or by custom percentages.",
    links: splitSection,
  },
  {
    title: "Australia rent tools",
    description: "Australian rent conversion, fortnightly rent, bond, rent in advance, and proration tools.",
    links: australiaSection,
  },
  {
    title: "UK rent tools",
    description: "UK PW, PCM, 4-weekly, and per-calendar-month rent tools.",
    links: ukSection,
  },
  {
    title: "Exact answer pages",
    description: "Direct answers for common weekly-to-monthly rent searches.",
    links: answerSection,
  },
  {
    title: "Lease and date tools",
    description: "Lease dates, due dates, payment schedules, and rent timing guides.",
    links: dateSection,
  },
  {
    title: "Rent vs buy",
    description: "Compare renting and buying using a dedicated rent vs buy calculator.",
    links: [item("/rent-vs-buy-calculator", "Rent vs buy calculator", "Compare renting with buying.")],
  },
  {
    title: "Legal",
    description: "Policies and terms for using RentConverter.",
    links: [
      item("/privacy-policy", "Privacy policy"),
      item("/terms-of-service", "Terms of service"),
      item("/cookies", "Cookie policy"),
    ],
  },
];

export const canonicalRouteEntries = Array.from(
  new Map(
    sitemapSections
      .flatMap((section) => section.links)
      .map((entry) => [entry.href, entry]),
  ).values(),
);

export const canonicalPaths = new Set(canonicalRouteEntries.map((entry) => entry.href));

export const redirectAliases: RedirectAlias[] = [
  { from: "/rent-converter", to: "/" },
  { from: "/rent-calculator", to: "/" },
  { from: "/monthly-to-weekly-rent", to: "/monthly-to-weekly-rent-converter" },
  { from: "/weekly-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/weekly-to-annual-rent", to: "/weekly-to-annual-rent-converter" },
  { from: "/weekly-to-biweekly-rent", to: "/weekly-to-biweekly-rent-converter" },
  { from: "/biweekly-to-weekly-rent", to: "/biweekly-to-weekly-rent-converter" },
  { from: "/biweekly-to-monthly-rent", to: "/biweekly-to-monthly-rent-converter" },
  { from: "/biweekly-to-annual-rent", to: "/biweekly-to-annual-rent-converter" },
  { from: "/monthly-to-annual-rent", to: "/monthly-to-annual-rent-converter" },
  { from: "/annual-to-monthly-rent", to: "/annual-to-monthly-rent-converter" },
  { from: "/monthly-to-daily-rent", to: "/monthly-to-daily-rent-converter" },
  { from: "/daily-to-monthly-rent", to: "/daily-to-monthly-rent-converter" },
  { from: "/monthly-to-hourly-rent", to: "/monthly-to-hourly-rent-converter" },
  { from: "/hourly-to-monthly-rent", to: "/hourly-to-monthly-rent-converter" },
  { from: "/hourly-to-annual-rent", to: "/hourly-to-annual-rent-converter" },
  { from: "/annual-to-hourly-rent", to: "/annual-to-hourly-rent-converter" },
  { from: "/annual-to-weekly-rent", to: "/annual-to-weekly-rent-converter" },
  { from: "/annual-to-biweekly-rent", to: "/annual-to-biweekly-rent-converter" },
  { from: "/monthly-to-biweekly-rent", to: "/monthly-to-biweekly-rent-converter" },
  { from: "/rent-per-day", to: "/rent-per-day-calculator" },
  { from: "/rent-per-week", to: "/rent-per-week-calculator" },
  { from: "/rent-paid-every-4-weeks", to: "/rent-paid-every-4-weeks-calculator" },
  { from: "/rent-per-paycheck", to: "/rent-per-paycheck-calculator" },
  { from: "/rent-split", to: "/rent-split-calculator" },
  { from: "/rent-due-date", to: "/rent-due-date-calculator" },
  { from: "/rent-as-percentage-of-income", to: "/rent-as-percentage-of-income-calculator" },
  { from: "/how-much-rent-can-i-afford", to: "/how-much-rent-can-i-afford-calculator" },
  { from: "/rent-after-tax-income", to: "/rent-after-tax-income-calculator" },
  { from: "/rent-vs-take-home-pay", to: "/rent-vs-take-home-pay-calculator" },
  { from: "/rent-affordability-calculator", to: "/how-much-rent-can-i-afford-calculator" },
  { from: "/rent-increase", to: "/rent-increase-calculator" },
  { from: "/rent-increase-percentage", to: "/rent-increase-percentage-calculator" },
  { from: "/rent-after-increase", to: "/rent-after-increase-calculator" },
  { from: "/rent-vs-buy", to: "/rent-vs-buy-calculator" },
  { from: "/pw-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pcw-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pw-to-pm", to: "/pw-to-pcm-calculator" },
  { from: "/per-week-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pcm-to-pcw", to: "/pcm-to-pw-calculator" },
  { from: "/pcm-calculator", to: "/pcm-rent-calculator" },
  { from: "/rent-pcm-calculator", to: "/pcm-rent-calculator" },
  { from: "/pw-calculator", to: "/pw-rent-calculator" },
  { from: "/rent-split-by-income-calculator", to: "/split-rent-based-on-income-calculator" },
  { from: "/rent-calculator-split-based-on-income", to: "/split-rent-based-on-income-calculator" },
];

export const redirectAliasPaths = new Set(redirectAliases.map((entry) => entry.from));

export const navItems = [
  item("/", "Universal Rent Converter", "Convert rent across daily, weekly, monthly, annual, and 4-week periods.", ["rent", "converter", "frequency"]),
  item("/weekly-to-monthly-rent-converter", "Weekly to Monthly", "Compare weekly rent with a true calendar-month budget.", ["weekly", "monthly", "pw", "pcm"]),
  item("/pw-to-pcm-calculator", "PW to PCM", "Convert weekly rent to per calendar month without the 4-week shortcut.", ["pw", "pcm"]),
  item("/rent-per-paycheck-calculator", "Rent Per Paycheck", "Plan rent around paycheck timing.", ["paycheck", "biweekly"]),
  item("/how-much-rent-can-i-afford-calculator", "Affordability", "Estimate rent targets from income and budget rules.", ["afford", "income"]),
  ...canonicalRouteEntries.filter((entry) => !["/", "/weekly-to-monthly-rent-converter", "/pw-to-pcm-calculator", "/rent-per-paycheck-calculator", "/how-much-rent-can-i-afford-calculator"].includes(entry.href)),
];

const navSectionTitles = new Set([
  "Rent converters",
  "PW and PCM glossary",
  "General rent calculators",
  "Affordability and income",
  "Rent increase",
  "Rent split",
  "Australia rent tools",
  "UK rent tools",
  "Exact answer pages",
  "Lease and date tools",
  "Rent vs buy",
]);

export const navSections: SitemapSection[] = sitemapSections
  .filter((section) => navSectionTitles.has(section.title))
  .map((section) => ({
    ...section,
    links: Array.from(
      new Map(section.links.map((linkEntry) => [linkEntry.href, linkEntry])).values(),
    ),
  }));

export const footerCategories = sitemapSections.filter((section) =>
  ["Rent converters", "Affordability and income", "Rent increase", "Australia rent tools", "UK rent tools", "Lease and date tools"].includes(section.title),
);

const toolDirectorySectionTitles = new Set([
  "Rent converters",
  "PW and PCM glossary",
  "General rent calculators",
  "Affordability and income",
  "Rent increase",
  "Rent split",
  "Australia rent tools",
  "UK rent tools",
  "Exact answer pages",
  "Lease and date tools",
  "Rent vs buy",
]);

export const toolDirectorySections: SitemapSection[] = [
  ...sitemapSections
    .filter((section) => toolDirectorySectionTitles.has(section.title))
    .map((section) => ({
      ...section,
      links: Array.from(
        new Map(
          section.links.map((linkEntry) => [linkEntry.href, linkEntry]),
        ).values(),
      ),
    })),
];
