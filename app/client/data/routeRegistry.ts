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
  item("/monthly-to-weekly-rent-converter", "Monthly to weekly rent converter", "Convert monthly rent to weekly rent.", ["monthly", "weekly", "pcm", "pw"]),
  item("/weekly-to-monthly-rent-converter", "Weekly to monthly rent converter", "Convert weekly rent to monthly rent.", ["weekly", "monthly", "pw", "pcm"]),
  item("/weekly-to-annual-rent-converter", "Weekly to annual rent converter", "Convert weekly rent to annual rent.", ["weekly", "annual"]),
  item("/weekly-to-biweekly-rent-converter", "Weekly to biweekly rent converter", "Convert weekly rent to biweekly rent.", ["weekly", "biweekly"]),
  item("/biweekly-to-weekly-rent-converter", "Biweekly to weekly rent converter", "Convert biweekly rent to weekly rent.", ["biweekly", "weekly"]),
  item("/biweekly-to-monthly-rent-converter", "Biweekly to monthly rent converter", "Convert biweekly rent to monthly rent.", ["biweekly", "monthly"]),
  item("/biweekly-to-annual-rent-converter", "Biweekly to annual rent converter", "Convert biweekly rent to annual rent.", ["biweekly", "annual"]),
  item("/monthly-to-annual-rent-converter", "Monthly to annual rent converter", "Convert monthly rent to annual rent.", ["monthly", "annual"]),
  item("/annual-to-monthly-rent-converter", "Annual to monthly rent converter", "Convert annual rent to monthly rent.", ["annual", "monthly"]),
  item("/monthly-to-daily-rent-converter", "Monthly to daily rent converter", "Convert monthly rent to daily rent.", ["monthly", "daily"]),
  item("/daily-to-monthly-rent-converter", "Daily to monthly rent converter", "Convert daily rent to monthly rent.", ["daily", "monthly"]),
  item("/monthly-to-hourly-rent-converter", "Monthly to hourly rent converter", "Convert monthly rent to hourly rent.", ["monthly", "hourly"]),
  item("/hourly-to-monthly-rent-converter", "Hourly to monthly rent converter", "Convert hourly rent to monthly rent.", ["hourly", "monthly"]),
  item("/hourly-to-annual-rent-converter", "Hourly to annual rent converter", "Convert hourly rent to annual rent.", ["hourly", "annual"]),
  item("/annual-to-hourly-rent-converter", "Annual to hourly rent converter", "Convert annual rent to hourly rent.", ["annual", "hourly"]),
  item("/annual-to-weekly-rent-converter", "Annual to weekly rent converter", "Convert annual rent to weekly rent.", ["annual", "weekly"]),
  item("/annual-to-biweekly-rent-converter", "Annual to biweekly rent converter", "Convert annual rent to biweekly rent.", ["annual", "biweekly"]),
  item("/monthly-to-biweekly-rent-converter", "Monthly to biweekly rent converter", "Convert monthly rent to biweekly rent.", ["monthly", "biweekly"]),
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
  item("/rent-per-day-calculator", "Rent per day calculator", "Convert rent into a daily amount.", ["daily", "per day"]),
  item("/rent-per-week-calculator", "Rent per week calculator", "Convert rent into a weekly amount.", ["weekly", "per week"]),
  item("/rent-paid-every-4-weeks-calculator", "Rent paid every 4 weeks calculator", "Compare 28-day rent cycles with calendar months.", ["4 weeks", "28 day"]),
  item("/rent-per-paycheck-calculator", "Rent per paycheck calculator", "Plan rent around biweekly, semi-monthly, weekly, or monthly pay.", ["paycheck", "pay"]),
  item("/rent-split-calculator", "Rent split calculator", "Split rent between roommates.", ["split", "roommate"]),
  item("/rent-due-date-calculator", "Rent due date calculator", "Calculate upcoming rent due dates.", ["due date", "calendar"]),
  item("/prorated-rent-calculator", "Prorated rent calculator", "Estimate partial-period rent.", ["prorated", "partial"]),
  fromConfig(dateToolConfigs["/rent-schedule-calculator"], "Rent schedule calculator", ["schedule", "dates"]),
];

const affordabilitySection = [
  item("/how-much-rent-can-i-afford-calculator", "How much rent can I afford calculator", "Estimate rent affordability from income.", ["afford", "income"]),
  item("/rent-as-percentage-of-income-calculator", "Rent as percentage of income calculator", "Calculate rent as a percent of income.", ["percentage", "income"]),
  item("/rent-after-tax-income-calculator", "Rent after tax income calculator", "Compare rent with after-tax income.", ["after tax", "income"]),
  item("/rent-vs-take-home-pay-calculator", "Rent vs take-home pay calculator", "Compare rent with take-home pay.", ["take home", "pay"]),
  item("/income-required-for-rent-calculator", "Income required for rent calculator", "Estimate income needed for rent.", ["required income"]),
  ...Object.values(incomeToolConfigs).map((config) => fromConfig(config)),
  ...Object.values(salaryAnswerConfigs).map((config) => fromConfig(config)),
];

const increaseSection = [
  item("/rent-increase-calculator", "Rent increase calculator", "Calculate a rent increase.", ["increase"]),
  item("/rent-increase-percentage-calculator", "Rent increase percentage calculator", "Calculate the percent change between old and new rent.", ["increase", "percentage"]),
  item("/rent-after-increase-calculator", "Rent after increase calculator", "Calculate rent after an increase.", ["after increase"]),
  ...Object.values(increaseToolConfigs).map((config) => fromConfig(config)),
];

const splitSection = [
  item("/rent-split-calculator", "Rent split calculator", "Split rent between roommates.", ["split", "roommate"]),
  ...Object.values(splitToolConfigs).map((config) => fromConfig(config)),
];

const australiaSection = [
  item("/weekly-to-monthly-rent-australia", "Weekly to monthly rent Australia", "Convert Australian weekly rent to monthly rent.", ["australia", "weekly", "monthly"]),
  ...Object.values(conversionPageConfigs).filter((config) => australiaLinks.some((related) => related.to === config.path)).map((config) => fromConfig(config)),
  ...Object.values(moveInCostConfigs).map((config) => fromConfig(config)),
  ...Object.values(prorationToolConfigs).map((config) => fromConfig(config)),
];

const ukSection = [
  item("/weekly-to-monthly-rent-uk", "Weekly to monthly rent UK", "Convert UK weekly rent to monthly rent.", ["uk", "weekly", "monthly"]),
  ...Object.values(conversionPageConfigs)
    .filter((config) => ["/pcm-rent-calculator", "/pw-rent-calculator", "/weekly-to-monthly-rent-formula-uk", "/convert-weekly-rent-to-monthly-uk", "/4-weekly-to-monthly-rent-uk"].includes(config.path))
    .map((config) => fromConfig(config)),
  fromConfig(infoPageConfigs["/per-calendar-month-rent-uk"], "Per calendar month rent UK", ["uk", "pcm"]),
];

const answerSection = Object.values(weeklyAnswerPageConfigs).map((config) => fromConfig(config));

const dateSection = [
  item("/rent-due-date-calculator", "Rent due date calculator", "Calculate upcoming rent due dates.", ["due date"]),
  item("/when-is-rent-due", "When is rent due?", "Understand rent due dates and timing.", ["due", "timing"]),
  item("/do-you-pay-rent-in-advance-or-after", "Do you pay rent in advance or after?", "Understand what rent payments usually cover.", ["advance", "after"]),
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
  item("/", "Universal Rent Converter", "Convert rent across common periods.", ["rent", "converter", "frequency"]),
  item("/weekly-to-monthly-rent-converter", "Weekly to Monthly", "Convert weekly rent to monthly rent.", ["weekly", "monthly", "pw", "pcm"]),
  item("/pw-to-pcm-calculator", "PW to PCM", "Convert weekly rent to per calendar month.", ["pw", "pcm"]),
  item("/rent-per-paycheck-calculator", "Rent Per Paycheck", "Plan rent around paycheck timing.", ["paycheck", "biweekly"]),
  item("/how-much-rent-can-i-afford-calculator", "Affordability", "Estimate rent affordability.", ["afford", "income"]),
  ...canonicalRouteEntries.filter((entry) => !["/", "/weekly-to-monthly-rent-converter", "/rent-per-paycheck-calculator", "/how-much-rent-can-i-afford-calculator"].includes(entry.href)),
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
