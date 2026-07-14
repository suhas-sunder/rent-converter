import {
  australiaLinks,
  conversionPageConfigs,
  dateToolConfigs,
  incomeToolConfigs,
  increaseToolConfigs,
  infoPageConfigs,
  moveInCostConfigs,
  prorationToolConfigs,
  splitToolConfigs,
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
];

const generalCalculators: RegistryLink[] = [
  item("/rent-per-day-calculator", "Rent per day calculator", "Find the daily rent behind a weekly, monthly, 4-week, or annual amount.", ["daily", "per day"]),
  item("/rent-per-week-calculator", "Rent per week calculator", "Convert rent into a weekly amount using a 365-day daily-rate model.", ["weekly", "per week"]),
  item("/rent-paid-every-4-weeks-calculator", "Rent paid every 4 weeks calculator", "Compare 28-day rent cycles with calendar months.", ["4 weeks", "28 day"]),
  item("/rent-per-paycheck-calculator", "Rent per paycheck calculator", "Plan rent around biweekly, semi-monthly, weekly, or monthly pay.", ["paycheck", "pay"]),
  item("/prorated-rent-calculator", "Prorated rent calculator", "Estimate partial-period rent for a move-in, move-out, or mid-cycle change.", ["prorated", "partial"]),
];

const affordabilitySection = [
  item("/how-much-rent-can-i-afford-calculator", "How much rent can I afford calculator", "Estimate rent targets from income, monthly costs, and common affordability rules.", ["afford", "income"]),
  item("/rent-as-percentage-of-income-calculator", "Rent as percentage of income calculator", "Normalize rent and income periods, then calculate rent as a percentage of income.", ["percentage", "income", "ratio"]),
  item("/rent-after-tax-income-calculator", "Rent after tax income calculator", "Compare rent with after-tax income instead of gross salary alone.", ["after tax", "income"]),
  item("/rent-vs-take-home-pay-calculator", "Rent vs take-home pay calculator", "Check how much of take-home pay is left after rent.", ["take home", "pay"]),
  item("/income-required-for-rent-calculator", "Income required for rent calculator", "Calculate required income or reverse the direction to maximum rent using preset or custom multipliers.", ["required income", "multiplier"]),
  ...Object.values(incomeToolConfigs).map((config) => fromConfig(config)),
];

const increaseSection = [
  item("/rent-increase-calculator", "Rent increase calculator", "Calculate new rent, monthly change, and yearly impact after an increase.", ["increase"]),
  item("/rent-increase-percentage-calculator", "Rent increase percentage calculator", "Calculate the percent change between old and new rent.", ["increase", "percentage"]),
  ...Object.values(increaseToolConfigs).map((config) => fromConfig(config)),
];

const splitSection = [
  item("/rent-split-calculator", "Rent split calculator", "Split rent and optional shared monthly costs equally across participants.", ["split", "roommate"]),
  ...Object.values(splitToolConfigs).map((config) => fromConfig(config)),
];

const australiaSection = [
  item("/weekly-to-monthly-rent-australia", "Weekly to monthly rent Australia", "Convert Australian weekly rent into a calendar-month amount and 4-week comparison.", ["australia", "weekly", "monthly"]),
  ...Object.values(conversionPageConfigs).filter((config) => australiaLinks.some((related) => related.to === config.path)).map((config) => fromConfig(config)),
  ...Object.values(moveInCostConfigs).map((config) => fromConfig(config)),
  ...Object.values(prorationToolConfigs).map((config) => fromConfig(config)),
];

const dateSection = [
  item("/rent-due-date-calculator", "Rent due date calculator", "Calculate upcoming rent due dates.", ["due date"]),
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
      item("/methodology", "Calculation methodology", "See the formulas, validation, rounding, and testing approach used by RentConverter."),
      item("/contact", "Contact", "Contact the RentConverter team."),
    ],
  },
  {
    title: "Rent converters",
    description: "Convert rent between weekly, biweekly, monthly, annual, daily, hourly, and 4-week payment periods.",
    links: frequencyConverters,
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
    description: "Calculate one-step, reverse-percentage, and compound rent increase arithmetic.",
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
  { from: "/australia-rent-calculator", to: "/weekly-to-monthly-rent-australia" },
  { from: "/weekly-to-monthly-rent-melbourne", to: "/weekly-to-monthly-rent-australia" },
  { from: "/weekly-to-monthly-rent-sydney", to: "/weekly-to-monthly-rent-australia" },
  { from: "/rent-per-paycheck-us", to: "/rent-per-paycheck-calculator" },
  { from: "/rent-per-paycheck-canada", to: "/rent-per-paycheck-calculator" },
  { from: "/pcm-rent-calculator", to: "/pw-to-pcm-calculator" },
  { from: "/weekly-to-monthly-rent-uk", to: "/pw-to-pcm-calculator" },
  { from: "/convert-weekly-rent-to-monthly-uk", to: "/pw-to-pcm-calculator" },
  { from: "/weekly-to-monthly-rent-formula-uk", to: "/pw-to-pcm-calculator" },
  { from: "/pw-rent-calculator", to: "/pcm-to-pw-calculator" },
  { from: "/4-weekly-to-monthly-rent-uk", to: "/rent-paid-every-4-weeks-calculator" },
  { from: "/pcm-vs-pw-rent", to: "/what-does-pcm-mean-rent" },
  { from: "/per-calendar-month-rent", to: "/what-does-pcm-mean-rent" },
  { from: "/per-calendar-month-rent-uk", to: "/what-does-pcm-mean-rent" },
  { from: "/150-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/160-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/170-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/180-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/200-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/220-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/230-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/250-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/300-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/320-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/350-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/370-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/400-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/450-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/500-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/550-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/600-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/650-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/750-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/500-euros-per-week-to-monthly-rent", to: "/weekly-to-monthly-rent-converter" },
  { from: "/190-pounds-per-week-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/60-pounds-per-night-to-monthly-rent", to: "/daily-to-monthly-rent-converter" },
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
  { from: "/roommate-rent-split-calculator", to: "/rent-split-calculator" },
  { from: "/rent-due-date", to: "/rent-due-date-calculator" },
  { from: "/lease-start-and-end-date-calculator", to: "/lease-date-calculator" },
  { from: "/12-month-lease-date-calculator", to: "/lease-date-calculator" },
  { from: "/rent-as-percentage-of-income", to: "/rent-as-percentage-of-income-calculator" },
  { from: "/rent-to-income-ratio-calculator", to: "/rent-as-percentage-of-income-calculator" },
  { from: "/2x-rent-calculator", to: "/income-required-for-rent-calculator" },
  { from: "/2-5x-rent-calculator", to: "/income-required-for-rent-calculator" },
  { from: "/3x-rent-calculator", to: "/income-required-for-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-50k", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-60k", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-65k", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-70k", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-80k", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford-on-100k", to: "/salary-to-rent-calculator" },
  { from: "/rent-calculator-by-salary", to: "/salary-to-rent-calculator" },
  { from: "/rent-calculator-by-income", to: "/salary-to-rent-calculator" },
  { from: "/max-rent-calculator", to: "/salary-to-rent-calculator" },
  { from: "/30-percent-rent-rule-calculator", to: "/salary-to-rent-calculator" },
  { from: "/40-percent-rent-rule-calculator", to: "/salary-to-rent-calculator" },
  { from: "/how-much-rent-can-i-afford", to: "/how-much-rent-can-i-afford-calculator" },
  { from: "/rent-after-tax-income", to: "/rent-after-tax-income-calculator" },
  { from: "/rent-vs-take-home-pay", to: "/rent-vs-take-home-pay-calculator" },
  { from: "/rent-affordability-calculator", to: "/how-much-rent-can-i-afford-calculator" },
  { from: "/rent-increase", to: "/rent-increase-calculator" },
  { from: "/rent-increase-percentage", to: "/rent-increase-percentage-calculator" },
  { from: "/rent-after-increase", to: "/rent-increase-calculator" },
  { from: "/rent-after-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/annual-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/monthly-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/rent-increase-formula", to: "/rent-increase-calculator" },
  { from: "/cpi-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/bc-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/ontario-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/quebec-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/california-rent-increase-calculator", to: "/rent-increase-calculator" },
  { from: "/rent-escalation-calculator", to: "/compound-rent-increase-calculator" },
  { from: "/bond-and-rent-in-advance-australia", to: "/rent-in-advance-australia" },
  { from: "/when-is-rent-due", to: "/rent-due-date-calculator" },
  { from: "/do-you-pay-rent-in-advance-or-after", to: "/rent-due-date-calculator" },
  { from: "/rent-vs-buy", to: "/rent-vs-buy-calculator" },
  { from: "/pw-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pcw-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pw-to-pm", to: "/pw-to-pcm-calculator" },
  { from: "/per-week-to-pcm", to: "/pw-to-pcm-calculator" },
  { from: "/pcm-to-pcw", to: "/pcm-to-pw-calculator" },
  { from: "/pcm-calculator", to: "/pw-to-pcm-calculator" },
  { from: "/rent-pcm-calculator", to: "/pw-to-pcm-calculator" },
  { from: "/pw-calculator", to: "/pcm-to-pw-calculator" },
  { from: "/rent-split-by-income-calculator", to: "/split-rent-based-on-income-calculator" },
  { from: "/rent-calculator-split-based-on-income", to: "/split-rent-based-on-income-calculator" },
];

export const redirectAliasPaths = new Set(redirectAliases.map((entry) => entry.from));

export const navItems = [
  item("/", "Rent Converter", "Convert rent across daily, weekly, monthly, annual, and 4-week periods.", ["rent", "converter", "frequency"]),
  item("/weekly-to-monthly-rent-converter", "Weekly to Monthly", "Compare weekly rent with a true calendar-month budget.", ["weekly", "monthly", "pw", "pcm"]),
  item("/how-much-rent-can-i-afford-calculator", "Affordability", "Estimate rent targets from income and budget rules.", ["afford", "income"]),
  item("/rent-increase-calculator", "Rent Increase", "Calculate one-step rent increases and their yearly effect.", ["increase"]),
  item("/rent-split-calculator", "Split Rent", "Split rent and optional shared monthly costs equally.", ["split", "roommate"]),
  item("/pw-to-pcm-calculator", "PW to PCM", "Convert weekly rent to per calendar month without the 4-week shortcut.", ["pw", "pcm"]),
  ...canonicalRouteEntries.filter((entry) => !["/", "/weekly-to-monthly-rent-converter", "/how-much-rent-can-i-afford-calculator", "/rent-increase-calculator", "/rent-split-calculator", "/pw-to-pcm-calculator"].includes(entry.href)),
];

const canonicalLinkByPath = new Map(
  canonicalRouteEntries.map((entry) => [entry.href, entry]),
);

const compactNavSections = [
  {
    title: "Rent conversion",
    description: "Compare rent periods, paycheck allocations, and PW or PCM listings.",
    paths: ["/monthly-to-weekly-rent-converter", "/rent-paid-every-4-weeks-calculator", "/rent-per-paycheck-calculator", "/pw-to-pcm-calculator", "/pcm-to-pw-calculator", "/what-does-pcm-mean-rent", "/what-does-pw-mean-rent"],
  },
  {
    title: "Affordability and income",
    description: "Compare rent with income, budgets, and pay periods.",
    paths: ["/how-much-rent-can-i-afford-calculator", "/salary-to-rent-calculator", "/income-required-for-rent-calculator", "/rent-as-percentage-of-income-calculator", "/rent-after-tax-income-calculator", "/rent-vs-take-home-pay-calculator", "/hourly-pay-to-rent-calculator", "/rent-budget-calculator"],
  },
  {
    title: "Rent changes",
    description: "Calculate one-step, reverse-percentage, and compound rent changes.",
    paths: ["/rent-increase-calculator", "/rent-increase-percentage-calculator", "/compound-rent-increase-calculator"],
  },
  {
    title: "Sharing and dates",
    description: "Split rent and plan proration, due dates, schedules, and lease dates.",
    paths: ["/rent-split-calculator", "/split-rent-based-on-income-calculator", "/rent-split-percentage-calculator", "/prorated-rent-calculator", "/rent-due-date-calculator", "/rent-schedule-calculator", "/lease-date-calculator"],
  },
  {
    title: "Australia",
    description: "Use the retained Australian conversion and proration tools.",
    paths: ["/weekly-to-monthly-rent-australia", "/weekly-to-fortnightly-rent-australia", "/fortnightly-to-monthly-rent-australia", "/prorated-rent-calculator-australia"],
  },
];

export const navSections: SitemapSection[] = compactNavSections.map((section) => ({
  title: section.title,
  description: section.description,
  links: section.paths
    .map((path) => canonicalLinkByPath.get(path))
    .filter((linkEntry): linkEntry is RegistryLink => Boolean(linkEntry)),
}));

export const footerCategories = sitemapSections.filter((section) =>
  ["Rent converters", "Affordability and income", "Rent increase", "Australia rent tools", "Lease and date tools"].includes(section.title),
);

const toolDirectorySectionTitles = new Set([
  "Rent converters",
  "PW and PCM glossary",
  "General rent calculators",
  "Affordability and income",
  "Rent increase",
  "Rent split",
  "Australia rent tools",
  "Lease and date tools",
  "Rent vs buy",
]);

export const toolDirectorySections: SitemapSection[] = [
  ...sitemapSections
    .filter((section) => toolDirectorySectionTitles.has(section.title))
    .map((section) => ({ ...section, links: Array.from(new Map(section.links.map((linkEntry) => [linkEntry.href, linkEntry])).values()) })),
].reduce<SitemapSection[]>((sections, section) => {
  const alreadyListed = new Set(sections.flatMap((entry) => entry.links.map((linkEntry) => linkEntry.href)));
  const links = section.links.filter((linkEntry) => !alreadyListed.has(linkEntry.href));
  if (links.length > 0) sections.push({ ...section, links });
  return sections;
}, []);
