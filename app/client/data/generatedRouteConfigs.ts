import type {
  ConversionPageConfig,
  DateToolConfig,
  FaqItem,
  IncomeToolConfig,
  InfoPageConfig,
  IncreaseToolConfig,
  MoveInCostConfig,
  ProrationToolConfig,
  RelatedLink,
  SalaryAnswerConfig,
  SplitToolConfig,
  WeeklyAnswerPageConfig,
} from "~/client/components/generated/GeneratedPages";
import type { Currency } from "~/client/utils/rentMath";

const link = (to: string, label: string, description?: string): RelatedLink => ({
  to,
  label,
  description,
});

export const pwPcmLinks = [
  link("/pw-to-pcm-calculator", "PW to PCM calculator", "Convert weekly rent into per-calendar-month rent."),
  link("/pcm-to-pw-calculator", "PCM to PW calculator", "Turn monthly rent into a weekly equivalent."),
  link("/what-does-pcm-mean-rent", "PCM meaning", "Understand per calendar month rent."),
  link("/what-does-pw-mean-rent", "PW meaning", "Understand weekly rent listings."),
  link("/weekly-to-monthly-rent-converter", "Weekly to monthly converter", "Compare weekly rent with a monthly budget."),
  link("/rent-paid-every-4-weeks-calculator", "4-week rent calculator", "Compare 28-day rent cycles with calendar months."),
];

export const affordabilityLinks = [
  link("/rent-to-income-ratio-calculator", "Rent-to-income ratio", "See what percent of income goes to rent."),
  link("/3x-rent-calculator", "3x rent calculator", "Estimate income needed to qualify."),
  link("/2-5x-rent-calculator", "2.5x rent calculator", "Use a lower multiplier rule."),
  link("/30-percent-rent-rule-calculator", "30% rent rule", "Turn income into a rent target."),
  link("/salary-to-rent-calculator", "Salary to rent", "Compare rent targets from annual salary."),
  link("/rent-budget-calculator", "Rent budget calculator", "Include bills, savings, and other costs."),
];

export const australiaLinks = [
  link("/australia-rent-calculator", "Australia rent calculator", "Convert weekly, fortnightly, monthly, and annual rent."),
  link("/weekly-to-monthly-rent-australia", "Weekly to monthly Australia", "Compare Australian weekly listings with monthly budgets."),
  link("/weekly-to-fortnightly-rent-australia", "Weekly to fortnightly", "Convert weekly rent into fortnightly rent."),
  link("/fortnightly-to-monthly-rent-australia", "Fortnightly to monthly", "Convert fortnightly rent into calendar monthly rent."),
  link("/bond-and-rent-in-advance-australia", "Bond and rent in advance", "Estimate common move-in costs."),
  link("/prorated-rent-calculator-australia", "Prorated rent Australia", "Estimate partial rent for a move-in or move-out."),
];

export const ukLinks = [
  link("/pcm-rent-calculator", "PCM rent calculator", "Convert PW to PCM or PCM to PW."),
  link("/pw-rent-calculator", "PW rent calculator", "Convert weekly and monthly UK rent."),
  link("/weekly-to-monthly-rent-uk", "Weekly to monthly UK", "Compare PW rent with a monthly budget."),
  link("/weekly-to-monthly-rent-formula-uk", "PW to PCM formula", "See the annualized formula."),
  link("/4-weekly-to-monthly-rent-uk", "4-weekly to monthly", "Compare 28-day rent with PCM."),
  link("/per-calendar-month-rent-uk", "Per calendar month UK", "Understand PCM wording in UK listings."),
];

export const increaseLinks = [
  link("/rent-increase-calculator", "Rent increase calculator", "Calculate a simple rent increase."),
  link("/rent-increase-percentage-calculator", "Rent increase percentage", "Find the percent change between old and new rent."),
  link("/rent-after-increase-calculator", "Rent after increase", "See the new rent after an increase."),
  link("/rent-increase-formula", "Rent increase formula", "Check percent, fixed, and reverse formulas."),
  link("/compound-rent-increase-calculator", "Compound rent increase", "Model repeated annual increases."),
  link("/cpi-rent-increase-calculator", "CPI rent increase", "Estimate a CPI-linked increase from an entered rate."),
];

export const splitLinks = [
  link("/split-rent-based-on-income-calculator", "Split rent by income", "Divide rent by each roommate income."),
  link("/roommate-rent-split-calculator", "Roommate rent split", "Compare equal, income, and custom shares."),
  link("/rent-split-percentage-calculator", "Percentage rent split", "Use exact custom percentages."),
  link("/rent-split-calculator", "Rent split calculator", "Use the main split tool."),
  link("/rent-to-income-ratio-calculator", "Rent-to-income ratio", "Check rent burden after splitting."),
];

export const dateLinks = [
  link("/rent-due-date-calculator", "Rent due date calculator", "Find upcoming payment dates."),
  link("/rent-schedule-calculator", "Rent schedule calculator", "Build a payment schedule."),
  link("/lease-date-calculator", "Lease date calculator", "Calculate lease start and end dates."),
  link("/lease-start-and-end-date-calculator", "Lease start and end", "Find an end date or lease length."),
  link("/12-month-lease-date-calculator", "12-month lease date", "Check common one-year lease dates."),
];

const pcmFaq: FaqItem[] = [
  {
    q: "Is PCM the same as monthly rent?",
    a: "Usually yes. PCM means per calendar month, so the listed amount is normally paid once each calendar month unless the lease says something different.",
  },
  {
    q: "Is PCM every 4 weeks?",
    a: "No. Every 4 weeks is a 28-day cycle. PCM is 12 calendar-month payments per year.",
  },
  {
    q: "Does PCM include bills?",
    a: "Only if the listing or lease says bills are included. Council tax, utilities, internet, parking, and service charges can be separate.",
  },
  {
    q: "Is PCM common in the UK?",
    a: "Yes. UK rental listings commonly use PCM for monthly rent and PW for weekly rent.",
  },
];

const pwFaq: FaqItem[] = [
  {
    q: "What does PW mean in rent?",
    a: "PW means per week. It is common in UK, Australian, student, room, and shared-housing listings.",
  },
  {
    q: "Should I multiply PW rent by 4?",
    a: "Multiplying by 4 only gives a 28-day amount. A true monthly comparison uses annual rent divided by 12.",
  },
  {
    q: "Does PW include bills?",
    a: "Only when the listing says so. Many PW listings show rent only, with utilities or other charges handled separately.",
  },
];

const glossaryRows = [
  { term: "PCM", meaning: "Per calendar month", note: "Usually 12 fixed monthly rent payments per year." },
  { term: "PW", meaning: "Per week", note: "Weekly rent. Convert by annualizing, then dividing by 12 for PCM." },
  { term: "PCW", meaning: "Per calendar week", note: "Often used like PW in rental listings." },
  { term: "PA", meaning: "Per annum", note: "Annual rent for a full year." },
  { term: "Every 4 weeks", meaning: "28-day rent cycle", note: "A 28-day cycle is shorter than an average calendar month." },
];

export const infoPageConfigs: Record<string, InfoPageConfig> = {
  "/what-does-pcm-mean-rent": {
    path: "/what-does-pcm-mean-rent",
    title: "What Does PCM Mean in Rent? | Per Calendar Month Explained",
    description: "Learn what PCM means in rent listings, how it differs from weekly and 4-week rent, and how to convert PW rent to a true monthly amount.",
    eyebrow: "Rent glossary",
    h1: "What Does PCM Mean in Rent?",
    lead: "PCM means per calendar month. A rent listing of GBP 1,200 PCM means GBP 1,200 for one calendar month, not one 4-week period.",
    answerTitle: "PCM means per calendar month",
    answer: "Per calendar month rent is usually paid 12 times per year. It is different from weekly rent and different from every-4-weeks rent, which creates 13 payment cycles over a year.",
    formula: "weekly rent to PCM = weekly rent x 365 / 7 / 12",
    caveat: "Bills, council tax, parking, internet, and service charges are included only when the listing or lease says they are included.",
    tableTitle: "Rent listing terms compared",
    tableRows: glossaryRows,
    ctaLinks: [link("/pw-to-pcm-calculator", "Convert PW to PCM"), link("/weekly-to-monthly-rent-converter", "Weekly to monthly converter")],
    sections: [
      {
        title: "Calendar month vs 4 weeks",
        body: "A calendar month is not the same length as 4 weeks. Four weeks is always 28 days, while calendar months run from 28 to 31 days. Over a year, PCM means 12 monthly payments, while a repeating 28-day cycle falls on a different rhythm.",
      },
      {
        title: "Why this matters in listings",
        body: "A weekly listing can look cheaper when someone multiplies it by 4. That shortcut misses the extra days in an average month and can understate the rent you need in a monthly budget.",
      },
    ],
    examples: [
      {
        title: "GBP 1,200 PCM listing",
        body: "GBP 1,200 PCM means GBP 1,200 per calendar month. It does not mean GBP 1,200 every 4 weeks unless the lease says payments are on a 28-day cycle.",
      },
      {
        title: "Weekly listing comparison",
        body: "A place listed weekly should be annualized first, then divided by 12. That gives a cleaner comparison with a PCM listing.",
      },
    ],
    relatedLinks: pwPcmLinks,
    faq: pcmFaq,
  },
  "/what-does-pw-mean-rent": {
    path: "/what-does-pw-mean-rent",
    title: "What Does PW Mean in Rent? | Weekly Rent Explained",
    description: "PW means per week in rent listings. Learn how weekly rent compares with monthly rent and why PW x 4 understates the real monthly cost.",
    eyebrow: "Rent glossary",
    h1: "What Does PW Mean in Rent?",
    lead: "PW means per week. A weekly rent should be converted to a monthly equivalent using annual rent, not by multiplying by 4.",
    answerTitle: "PW means per week",
    answer: "$500 PW is about $2,172.62 per calendar month with the 365-day model used on this site, not $2,000. The 4-week shortcut only covers 28 days.",
    formula: "PCM = weekly rent x 365 / 7 / 12",
    caveat: "PW appears often in UK listings, Australian listings, rooms, student housing, and weekly-paid renter budgets.",
    tableTitle: "PW, PCM, and 4-week rent",
    tableRows: [
      { term: "PW", meaning: "Per week", note: "A weekly amount that should be annualized for monthly comparison." },
      { term: "PCM", meaning: "Per calendar month", note: "A monthly amount usually paid 12 times per year." },
      { term: "Every 4 weeks", meaning: "28-day cycle", note: "Not the same as PCM because there are 13 cycles in a year." },
    ],
    ctaLinks: [link("/pw-to-pcm-calculator", "PW to PCM calculator")],
    sections: [
      {
        title: "Where PW shows up",
        body: "Weekly rent is common in shared housing, rooms, student rentals, and markets where listings often quote a weekly price. It is useful, but it needs conversion when your bills and income are planned monthly.",
      },
      {
        title: "The monthly budget issue",
        body: "The gap between weekly x 4 and true monthly rent can decide whether a listing fits. On a $500 weekly listing, the 4-week amount is $2,000, but the calendar-month equivalent is higher.",
      },
    ],
    examples: [
      {
        title: "$500 PW listing",
        body: "$500 per week is $2,000 every 4 weeks, but it is about $2,172.62 per average calendar month on a 365-day basis.",
      },
      {
        title: "Weekly-paid renter",
        body: "If you are paid weekly, PW feels natural. If rent is due monthly or you compare monthly listings, converting PW to PCM avoids a budget surprise.",
      },
    ],
    relatedLinks: pwPcmLinks,
    faq: pwFaq,
  },
  "/pcm-vs-pw-rent": {
    path: "/pcm-vs-pw-rent",
    title: "PCM vs PW Rent | Monthly and Weekly Rent Compared",
    description: "Compare PCM and PW rent, see how monthly and weekly rental prices differ, and convert between them accurately.",
    eyebrow: "Rent comparison",
    h1: "PCM vs PW Rent",
    lead: "PCM rent is priced per calendar month. PW rent is priced per week. The two can be compared accurately only when the weekly amount is annualized.",
    answerTitle: "PCM and PW answer different budgeting questions",
    answer: "PCM tells you the monthly payment. PW tells you the weekly price. If you compare them using weekly x 4, you leave out the extra days in an average month.",
    formula: "PW to PCM = PW x 365 / 7 / 12. PCM to PW = PCM x 12 / 365 x 7.",
    tableTitle: "PCM vs PW",
    tableRows: [
      { term: "Payment timing", meaning: "PCM is monthly, PW is weekly", note: "The lease controls when payment is actually due." },
      { term: "Budget impact", meaning: "PCM maps to monthly bills", note: "PW can look lower until you convert it over a year." },
      { term: "Listing context", meaning: "PW appears often in rooms and UK/AU listings", note: "PCM is common for full monthly rentals." },
      { term: "Conversion", meaning: "Use annual rent first", note: "That avoids treating 4 weeks as a full month." },
    ],
    ctaLinks: [link("/pw-to-pcm-calculator", "Convert PW to PCM"), link("/pcm-to-pw-calculator", "Convert PCM to PW")],
    sections: [
      {
        title: "Why $500 per week is not $2,000 per month",
        body: "$2,000 covers exactly 4 weeks. An average calendar month is about 30.42 days, so the true monthly equivalent is about $2,172.62 with the 365-day model.",
      },
    ],
    examples: [
      {
        title: "Two listings side by side",
        body: "A $500 PW listing and a $2,150 PCM listing are close. The weekly place is about $2,172.62 PCM, so the monthly listing is slightly cheaper before bills.",
      },
    ],
    relatedLinks: pwPcmLinks,
    faq: pwFaq,
  },
  "/per-calendar-month-rent": {
    path: "/per-calendar-month-rent",
    title: "Per Calendar Month Rent Meaning | PCM Rent Explained",
    description: "Learn what per calendar month means in rent listings, how PCM differs from weekly and 4-week rent, and how to compare rental prices.",
    eyebrow: "Rent glossary",
    h1: "Per Calendar Month Rent Meaning",
    lead: "Per calendar month means the rent amount for one calendar month. The amount usually stays the same in February and March unless the lease says otherwise.",
    answerTitle: "Per calendar month means a calendar-month rent period",
    answer: "A calendar month can have 28, 29, 30, or 31 days, but PCM rent is normally a fixed monthly payment. That is why PCM is not the same as every 4 weeks.",
    formula: "weekly rent to calendar month = weekly rent x 365 / 7 / 12",
    tableTitle: "Calendar month compared with other periods",
    tableRows: glossaryRows,
    ctaLinks: [link("/pcm-to-pw-calculator", "PCM to PW calculator"), link("/weekly-to-monthly-rent-converter", "Weekly to monthly converter")],
    sections: [
      {
        title: "Why monthly rent does not change every month",
        body: "A fixed PCM rent generally stays fixed even when February is shorter than March. The rent period changes length, but the monthly charge does not unless the lease states another method.",
      },
      {
        title: "When this gets confusing",
        body: "Confusion usually appears when a renter compares a weekly listing with a monthly budget. The correct comparison uses annualized rent, not weekly x 4.",
      },
    ],
    examples: [
      {
        title: "February and March",
        body: "If rent is GBP 1,200 PCM, February is not usually cheaper than March. The lease defines one monthly rent amount.",
      },
    ],
    relatedLinks: pwPcmLinks,
    faq: pcmFaq,
  },
  "/per-calendar-month-rent-uk": {
    path: "/per-calendar-month-rent-uk",
    title: "Per Calendar Month Rent UK | PCM Meaning",
    description: "Learn what per calendar month means in UK rent listings and how PCM compares with PW and 4-week rent.",
    eyebrow: "UK rent glossary",
    h1: "Per Calendar Month Rent UK",
    lead: "In UK listings, per calendar month usually means PCM rent paid monthly. It is different from PW rent and from a 4-week payment cycle.",
    answerTitle: "PCM is the common UK monthly rent term",
    answer: "A GBP 1,200 PCM listing means GBP 1,200 for one calendar month. Bills, council tax, and internet are separate unless the listing says they are included.",
    formula: "PW to PCM = PW x 365 / 7 / 12",
    tableTitle: "UK rent terms",
    tableRows: glossaryRows,
    ctaLinks: [link("/pcm-rent-calculator", "PCM rent calculator"), link("/weekly-to-monthly-rent-uk", "Weekly to monthly UK")],
    sections: [
      {
        title: "PCM vs PW in UK listings",
        body: "PCM is common for full monthly rentals. PW is often used for rooms, student housing, or listings where weekly rent is easier to compare.",
      },
      {
        title: "Bills and council tax",
        body: "PCM describes the rent period, not what is included. Check whether council tax, utilities, service charges, broadband, or parking are included before comparing listings.",
      },
    ],
    examples: [
      {
        title: "GBP 190 PW comparison",
        body: "GBP 190 per week is more than GBP 760 PCM when annualized, because 4 weeks is shorter than an average calendar month.",
      },
    ],
    relatedLinks: ukLinks,
    faq: pcmFaq,
  },
  "/is-rent-due-on-the-first": {
    path: "/is-rent-due-on-the-first",
    title: "Is Rent Due on the First? | Rent Due Date Explained",
    description: "Learn whether rent is due on the first of the month, how lease due dates work, and how to calculate upcoming rent payment dates.",
    eyebrow: "Rent due date guide",
    h1: "Is Rent Due on the First?",
    lead: "Rent is often due on the first for monthly leases, but the lease controls the actual due date, grace period, cutoff time, and payment method.",
    answerTitle: "Often yes, but the lease decides",
    answer: "Many monthly leases set rent due on the first day of the month. Some leases use a different date, weekly schedule, or rent cycle. Weekends, holidays, grace periods, and online payment cutoffs can also matter.",
    caveat: "This is general planning information, not legal advice. Check your lease and local rules for exact requirements.",
    ctaLinks: [link("/rent-due-date-calculator", "Rent due date calculator"), link("/rent-schedule-calculator", "Rent schedule calculator")],
    sections: [
      {
        title: "First of month rent",
        body: "A common monthly lease says rent is due on the first and covers that rental month. If the first falls on a weekend or holiday, the lease or local rules may say whether payment must arrive before, on, or after that date.",
      },
      {
        title: "Grace periods and cutoff times",
        body: "A grace period can delay late fees, but it usually does not change the actual due date. Online portals may also have same-day cutoff times.",
      },
    ],
    examples: [
      {
        title: "Due April 1",
        body: "If rent is due April 1, paying April 3 may still be late unless your lease or local rule allows a grace period.",
      },
    ],
    relatedLinks: dateLinks,
    faq: [
      { q: "Is rent always due on the first?", a: "No. It is common, but your lease can set a different due date or payment frequency." },
      { q: "Does a grace period change the due date?", a: "Usually no. It can affect late fees, but the due date remains the date stated in the lease." },
    ],
  },
  "/is-rent-paid-for-the-current-month-or-next-month": {
    path: "/is-rent-paid-for-the-current-month-or-next-month",
    title: "Is Rent Paid for the Current Month or Next Month?",
    description: "Understand what period rent usually covers, how rent in advance works, and how to check your lease payment dates.",
    eyebrow: "Rent payment guide",
    h1: "Is Rent Paid for the Current Month or Next Month?",
    lead: "Rent is commonly paid in advance for the upcoming rental period, but your lease controls what the payment covers.",
    answerTitle: "Rent usually pays for the upcoming rental period",
    answer: "For a monthly tenancy, rent paid on April 1 commonly covers April 1 through April 30. First month rent, last month rent, deposits, and rent in advance can change what is due at move-in.",
    caveat: "Check your lease wording if your payment date, move-in date, or rent cycle is not standard.",
    ctaLinks: [link("/rent-schedule-calculator", "Rent schedule calculator"), link("/rent-due-date-calculator", "Rent due date calculator")],
    sections: [
      {
        title: "Rent in advance",
        body: "Paying in advance means you pay before or at the start of the period you are about to occupy. It is different from paying a separate fee.",
      },
      {
        title: "Move-in payments",
        body: "At move-in, a landlord may collect first month rent, last month rent, bond, deposit, or rent in advance depending on location and lease terms. Those labels matter because they cover different things.",
      },
    ],
    examples: [
      {
        title: "April rent paid April 1",
        body: "In a typical monthly setup, rent paid April 1 covers April occupancy, not March. If the lease says otherwise, follow the lease.",
      },
    ],
    relatedLinks: dateLinks,
    faq: [
      { q: "Is rent usually paid ahead of time?", a: "Yes, rent is commonly paid at the start of the rental period, but the lease controls the details." },
      { q: "Is last month rent the same as a deposit?", a: "No. Last month rent is usually meant to cover the final rental period. A deposit or bond is usually security for damage or unpaid obligations." },
    ],
  },
};

const commonWeeklyAmounts = [150, 160, 170, 180, 200, 220, 230, 250, 300, 320, 350, 370, 400, 450, 500, 550, 600, 650, 750];

function conversionConfig(input: Omit<ConversionPageConfig, "faq" | "examples" | "sections"> & Partial<Pick<ConversionPageConfig, "faq" | "examples" | "sections">>): ConversionPageConfig {
  return {
    faq: input.faq ?? [
      { q: "What assumption does this calculator use?", a: "It uses a 365-day year, 7-day weeks, 14-day biweekly or fortnightly periods, 28-day four-week periods, and 12 calendar months." },
      { q: "Does this include bills or move-in costs?", a: "No. The calculator converts the rent amount only. Add utilities, parking, internet, deposits, service charges, or other fees separately." },
    ],
    examples: input.examples ?? [
      { title: "Listing comparison", body: "Put a weekly, biweekly, 4-week, or monthly listing on the same time basis before deciding which place is actually cheaper." },
      { title: "Monthly budget check", body: "Use the calendar-month result when salary, bills, savings, and rent caps are planned monthly." },
    ],
    sections: input.sections ?? [
      { title: "Calendar month vs payment cycle", body: "A calendar month is not always the same as a repeated payment cycle. Weekly, fortnightly, biweekly, and 4-week rent should be annualized before comparing with monthly rent." },
      { title: "Costs that can change the decision", body: "If two listings are close, utilities, deposits, parking, pet rent, service charges, internet, and move-in costs can matter more than the converted rent difference." },
    ],
    ...input,
  };
}

export const conversionPageConfigs: Record<string, ConversionPageConfig> = {
  "/pw-to-pcm-calculator": conversionConfig({
    path: "/pw-to-pcm-calculator",
    title: "PW to PCM Calculator | Weekly Rent to Monthly Rent",
    description: "Convert rent per week to rent per calendar month. See the true monthly amount, annual rent, and why weekly rent times 4 is usually too low.",
    eyebrow: "PW to PCM calculator",
    h1: "PW to PCM Calculator",
    lead: "Convert weekly rent into a per-calendar-month amount and compare it with the 4-week shortcut.",
    inputLabel: "Weekly rent",
    defaultAmount: "500",
    defaultCurrency: "USD",
    mode: "weekly-to-monthly",
    resultLabel: "PCM rent",
    formulaLabel: "PCM = weekly rent x 365 / 7 / 12",
    context: "Weekly rent is annualized over 365 days and divided by 12 so the monthly result matches a calendar-month budget.",
    commonAmounts: commonWeeklyAmounts,
    relatedLinks: pwPcmLinks,
  }),
  "/pcm-to-pw-calculator": conversionConfig({
    path: "/pcm-to-pw-calculator",
    title: "PCM to PW Calculator | Monthly Rent to Weekly Rent",
    description: "Convert per calendar month rent to weekly rent. See the weekly equivalent, annual cost, and formula used for monthly-to-weekly rent.",
    eyebrow: "PCM to PW calculator",
    h1: "PCM to PW Calculator",
    lead: "Convert monthly or PCM rent into a weekly equivalent so you can compare it with PW listings.",
    inputLabel: "PCM rent",
    defaultAmount: "1200",
    defaultCurrency: "GBP",
    mode: "monthly-to-weekly",
    resultLabel: "Weekly rent",
    formulaLabel: "PW = PCM x 12 / 365 x 7",
    context: "Monthly rent is multiplied by 12 to get annual rent, then divided into 7-day weekly periods.",
    commonAmounts: [800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 3000],
    relatedLinks: pwPcmLinks,
  }),
  "/australia-rent-calculator": conversionConfig({
    path: "/australia-rent-calculator",
    title: "Australia Rent Calculator | Weekly, Fortnightly, Monthly",
    description: "Convert Australian rent between weekly, fortnightly, calendar monthly, 4-week, daily, and yearly amounts. See true monthly cost and rent-in-advance context.",
    eyebrow: "Australia rent calculator",
    h1: "Australia Rent Calculator",
    lead: "Convert Australian rent between weekly, fortnightly, calendar monthly, 4-week, daily, and annual amounts in AUD.",
    inputLabel: "Weekly rent",
    defaultAmount: "500",
    defaultCurrency: "AUD",
    mode: "weekly-to-monthly",
    resultLabel: "Calendar monthly rent",
    formulaLabel: "monthly = weekly rent x 365 / 7 / 12",
    context: "Australian listings often use weekly rent. This converts it to a calendar-month budget and shows the 4-week comparison.",
    commonAmounts: commonWeeklyAmounts,
    relatedLinks: australiaLinks,
    sections: [
      { title: "Weekly, fortnightly, and calendar monthly", body: "Weekly and fortnightly rent are common in Australia. Calendar monthly rent is a different comparison because two fortnightly payments cover 28 days, not an average month." },
      { title: "Bond and rent in advance", body: "Move-in costs can include bond and rent in advance. Rules vary by state and territory, so use this calculator for budgeting and check your state tenancy authority for exact requirements." },
    ],
  }),
  "/weekly-to-fortnightly-rent-australia": conversionConfig({
    path: "/weekly-to-fortnightly-rent-australia",
    title: "Weekly to Fortnightly Rent Australia | Rent Calculator",
    description: "Convert weekly rent to fortnightly rent in Australia and see the true monthly and annual equivalent.",
    eyebrow: "Australia rent calculator",
    h1: "Weekly to Fortnightly Rent Australia",
    lead: "Convert weekly rent into fortnightly rent and see the monthly and annual equivalents in AUD.",
    inputLabel: "Weekly rent",
    defaultAmount: "500",
    defaultCurrency: "AUD",
    mode: "weekly-to-fortnightly",
    resultLabel: "Fortnightly rent",
    formulaLabel: "fortnightly rent = weekly rent x 2",
    context: "Fortnightly means every two weeks. Calendar monthly rent is still higher than two fortnightly payments because a month is longer than 28 days on average.",
    commonAmounts: commonWeeklyAmounts,
    relatedLinks: australiaLinks,
  }),
  "/fortnightly-to-monthly-rent-australia": conversionConfig({
    path: "/fortnightly-to-monthly-rent-australia",
    title: "Fortnightly to Monthly Rent Australia | Rent Calculator",
    description: "Convert fortnightly rent to true monthly rent in Australia. See annual cost and why two fortnightly payments are not the same as a calendar month.",
    eyebrow: "Australia rent calculator",
    h1: "Fortnightly to Monthly Rent Australia",
    lead: "Convert fortnightly rent into calendar monthly rent, weekly rent, annual rent, and the 28-day comparison.",
    inputLabel: "Fortnightly rent",
    defaultAmount: "1000",
    defaultCurrency: "AUD",
    mode: "fortnightly-to-monthly",
    resultLabel: "Calendar monthly rent",
    formulaLabel: "monthly = fortnightly rent x 365 / 14 / 12",
    context: "Fortnightly rent is a 14-day amount. Two fortnightly payments cover 28 days, not a full average calendar month.",
    commonAmounts: [700, 800, 900, 1000, 1100, 1200, 1300, 1500],
    relatedLinks: australiaLinks,
  }),
  "/weekly-to-monthly-rent-melbourne": conversionConfig({
    path: "/weekly-to-monthly-rent-melbourne",
    title: "Weekly to Monthly Rent Melbourne | Rent Calculator",
    description: "Convert Melbourne weekly rent listings into true monthly rent. Compare weekly, fortnightly, 4-week, monthly, and annual cost in AUD.",
    eyebrow: "Melbourne rent calculator",
    h1: "Weekly to Monthly Rent Melbourne",
    lead: "Convert a Melbourne weekly rent listing into a true calendar-month amount before comparing it with your monthly budget.",
    inputLabel: "Weekly rent",
    defaultAmount: "550",
    defaultCurrency: "AUD",
    mode: "weekly-to-monthly",
    resultLabel: "Monthly rent",
    formulaLabel: "monthly = weekly rent x 365 / 7 / 12",
    context: "Weekly listing prices are common in Melbourne. Convert to monthly before comparing with salary, bills, bond, or rent-in-advance planning.",
    commonAmounts: commonWeeklyAmounts,
    relatedLinks: australiaLinks,
  }),
  "/weekly-to-monthly-rent-sydney": conversionConfig({
    path: "/weekly-to-monthly-rent-sydney",
    title: "Weekly to Monthly Rent Sydney | Rent Calculator",
    description: "Convert Sydney weekly rent listings into true monthly rent. Compare weekly, fortnightly, 4-week, monthly, and annual cost in AUD.",
    eyebrow: "Sydney rent calculator",
    h1: "Weekly to Monthly Rent Sydney",
    lead: "Convert a Sydney weekly rent listing into a calendar-month amount before comparing it with a monthly budget.",
    inputLabel: "Weekly rent",
    defaultAmount: "650",
    defaultCurrency: "AUD",
    mode: "weekly-to-monthly",
    resultLabel: "Monthly rent",
    formulaLabel: "monthly = weekly rent x 365 / 7 / 12",
    context: "A weekly rent number can look manageable until it is converted across a full year and divided into monthly planning.",
    commonAmounts: commonWeeklyAmounts,
    relatedLinks: australiaLinks,
  }),
  "/pcm-rent-calculator": conversionConfig({
    path: "/pcm-rent-calculator",
    title: "PCM Rent Calculator | PW to PCM and PCM to PW",
    description: "Convert UK rent between per week and per calendar month. See PW to PCM, PCM to PW, annual rent, and the formula.",
    eyebrow: "UK rent calculator",
    h1: "PCM Rent Calculator",
    lead: "Convert UK rent between weekly and per-calendar-month amounts with the annualized formula.",
    inputLabel: "Weekly rent",
    defaultAmount: "190",
    defaultCurrency: "GBP",
    mode: "weekly-to-monthly",
    resultLabel: "PCM rent",
    formulaLabel: "PCM = PW x 365 / 7 / 12",
    context: "This page uses the 365-day method rather than a loose 52/12 shortcut, so the result matches the sitewide rent model.",
    commonAmounts: [150, 190, 200, 250, 300, 350, 400, 450, 500],
    relatedLinks: ukLinks,
  }),
  "/pw-rent-calculator": conversionConfig({
    path: "/pw-rent-calculator",
    title: "PW Rent Calculator | Weekly Rent from Monthly Rent",
    description: "Convert rent to PW or from PW to PCM. See weekly, monthly, and annual rent equivalents with clear formulas.",
    eyebrow: "UK rent calculator",
    h1: "PW Rent Calculator",
    lead: "Convert PCM rent into PW rent or use the related PW to PCM calculator for the reverse direction.",
    inputLabel: "PCM rent",
    defaultAmount: "1200",
    defaultCurrency: "GBP",
    mode: "monthly-to-weekly",
    resultLabel: "PW rent",
    formulaLabel: "PW = PCM x 12 / 365 x 7",
    context: "Monthly rent is annualized, then converted into a 7-day weekly equivalent.",
    commonAmounts: [800, 1000, 1200, 1500, 1800, 2000, 2500],
    relatedLinks: ukLinks,
  }),
  "/weekly-to-monthly-rent-formula-uk": conversionConfig({
    path: "/weekly-to-monthly-rent-formula-uk",
    title: "Weekly to Monthly Rent Formula UK | PW to PCM",
    description: "See the weekly to monthly rent formula for UK listings and convert PW rent to PCM using an annualized method.",
    eyebrow: "PW to PCM formula",
    h1: "Weekly to Monthly Rent Formula UK",
    lead: "The UK weekly-to-monthly rent formula annualizes PW rent first, then divides by 12 calendar months.",
    inputLabel: "Weekly rent",
    defaultAmount: "190",
    defaultCurrency: "GBP",
    mode: "weekly-to-monthly",
    resultLabel: "PCM rent",
    formulaLabel: "PCM = weekly rent x 365 / 7 / 12",
    context: "The formula avoids weekly x 4 because 4 weeks is only 28 days.",
    commonAmounts: [150, 190, 200, 250, 300, 350, 400, 450, 500],
    relatedLinks: ukLinks,
  }),
  "/convert-weekly-rent-to-monthly-uk": conversionConfig({
    path: "/convert-weekly-rent-to-monthly-uk",
    title: "Convert Weekly Rent to Monthly UK | PW to PCM",
    description: "Convert weekly rent to monthly rent in the UK. See the PW to PCM formula, annual cost, and 4-week comparison.",
    eyebrow: "UK rent converter",
    h1: "Convert Weekly Rent to Monthly UK",
    lead: "Convert a UK weekly rent listing into a per-calendar-month amount before comparing it with a monthly rent cap.",
    inputLabel: "Weekly rent",
    defaultAmount: "190",
    defaultCurrency: "GBP",
    mode: "weekly-to-monthly",
    resultLabel: "Monthly rent",
    formulaLabel: "monthly = weekly rent x 365 / 7 / 12",
    context: "The result is the average calendar-month equivalent, not the 4-week amount.",
    commonAmounts: [150, 190, 200, 250, 300, 350, 400, 450, 500],
    relatedLinks: ukLinks,
  }),
  "/4-weekly-to-monthly-rent-uk": conversionConfig({
    path: "/4-weekly-to-monthly-rent-uk",
    title: "4-Weekly to Monthly Rent UK | 28-Day Rent Calculator",
    description: "Convert 4-weekly rent to true monthly rent. See why 28-day rent cycles differ from PCM.",
    eyebrow: "UK rent converter",
    h1: "4-Weekly to Monthly Rent UK",
    lead: "Convert a 28-day rent amount into true calendar monthly rent, weekly rent, and annual rent.",
    inputLabel: "Rent paid every 4 weeks",
    defaultAmount: "2000",
    defaultCurrency: "GBP",
    mode: "four-week-to-monthly",
    resultLabel: "Monthly equivalent",
    formulaLabel: "monthly = 4-week rent x 365 / 28 / 12",
    context: "A 4-week payment cycle is 28 days, so it is not the same as PCM.",
    commonAmounts: [600, 800, 1000, 1200, 1600, 2000, 2400],
    relatedLinks: ukLinks,
  }),
};

function incomeConfig(input: Omit<IncomeToolConfig, "faq" | "examples" | "sections"> & Partial<Pick<IncomeToolConfig, "faq" | "examples" | "sections">>): IncomeToolConfig {
  return {
    faq: input.faq ?? [
      { q: "Should I use gross or take-home income?", a: "Many qualification rules use gross income. A personal budget should also check take-home pay, debt, utilities, savings, and local costs." },
      { q: "Does this guarantee approval?", a: "No. Landlords may consider credit, savings, guarantors, household income, local rules, and their own criteria." },
    ],
    examples: input.examples ?? [
      { title: "Apartment screening", body: "A listing may ask for 2.5x or 3x rent in gross income. The calculator shows that screening number before you spend time on an application." },
      { title: "Real monthly pressure", body: "A rent amount can pass a simple income rule but still leave too little after utilities, debt, insurance, transport, groceries, and savings." },
    ],
    sections: input.sections ?? [
      { title: "Qualification max vs comfort max", body: "A rent amount can pass a landlord income rule and still feel too tight in a real budget. Compare the rule result with your take-home pay and fixed expenses." },
      { title: "What a rent rule leaves out", body: "Income rules do not know your credit profile, guarantor options, deposits, utilities, insurance, childcare, car payments, local application rules, or how variable your income is." },
    ],
    ...input,
  };
}

export const incomeToolConfigs: Record<string, IncomeToolConfig> = {
  "/3x-rent-calculator": incomeConfig({
    path: "/3x-rent-calculator",
    title: "3x Rent Calculator | Income Needed to Qualify",
    description: "Calculate the income needed for the 3x rent rule or find the maximum rent you may qualify for from gross monthly or annual income.",
    eyebrow: "Income qualification",
    h1: "3x Rent Calculator",
    lead: "Estimate the gross income needed under a 3x rent rule, or compare rent with common affordability targets.",
    mode: "multiplier",
    multiplier: 3,
    defaultRent: "2000",
    relatedLinks: affordabilityLinks,
    examples: [
      { title: "$2,000 monthly rent", body: "A $2,000/month apartment usually requires about $6,000/month or $72,000/year in gross income under a 3x rule." },
      { title: "Roommates", body: "If household income is combined, compare the total rent against combined gross income, then decide how the rent should be split." },
    ],
  }),
  "/2-5x-rent-calculator": incomeConfig({
    path: "/2-5x-rent-calculator",
    title: "2.5x Rent Calculator | Required Income for Rent",
    description: "Calculate required gross income under the 2.5x rent rule and see the maximum rent supported by your income.",
    eyebrow: "Income qualification",
    h1: "2.5x Rent Calculator",
    lead: "Estimate the income needed when a landlord uses a 2.5x rent rule instead of a 3x rule.",
    mode: "multiplier",
    multiplier: 2.5,
    defaultRent: "2000",
    relatedLinks: affordabilityLinks,
  }),
  "/2x-rent-calculator": incomeConfig({
    path: "/2x-rent-calculator",
    title: "2x Rent Calculator | Required Income and Max Rent",
    description: "Use the 2x rent calculator to estimate required gross income or maximum rent based on a two-times-rent rule.",
    eyebrow: "Income qualification",
    h1: "2x Rent Calculator",
    lead: "Estimate required gross income under a 2x rent rule. This is less conservative than 3x and is not universal.",
    mode: "multiplier",
    multiplier: 2,
    defaultRent: "2000",
    relatedLinks: affordabilityLinks,
  }),
  "/rent-to-income-ratio-calculator": incomeConfig({
    path: "/rent-to-income-ratio-calculator",
    title: "Rent-to-Income Ratio Calculator | What Percent Goes to Rent?",
    description: "Calculate what percentage of your income goes to rent. Compare rent against gross income, take-home pay, hourly pay, salary, and common affordability rules.",
    eyebrow: "Affordability calculator",
    h1: "Rent-to-Income Ratio Calculator",
    lead: "Calculate what percent of income goes to rent and compare the result with common affordability bands.",
    mode: "ratio",
    defaultRent: "1500",
    defaultIncome: "5000",
    relatedLinks: affordabilityLinks,
  }),
  "/30-percent-rent-rule-calculator": incomeConfig({
    path: "/30-percent-rent-rule-calculator",
    title: "30% Rent Rule Calculator | Maximum Rent from Income",
    description: "Estimate monthly rent using the 30 percent rule. Convert income into a rent budget and compare monthly, weekly, and annual rent.",
    eyebrow: "Rent rule calculator",
    h1: "30% Rent Rule Calculator",
    lead: "Estimate a monthly rent target using the 30% income guideline.",
    mode: "rent-rule",
    percent: 30,
    defaultIncome: "60000",
    relatedLinks: affordabilityLinks,
    examples: [{ title: "$60,000 salary", body: "On $60,000/year, 30% gives about $1,500/month before tax, debt, savings, utilities, and local rent prices." }],
  }),
  "/40-percent-rent-rule-calculator": incomeConfig({
    path: "/40-percent-rent-rule-calculator",
    title: "40% Rent Rule Calculator | Rent Budget from Income",
    description: "Estimate rent using a 40 percent income rule and compare it with 30 percent and 35 percent rent targets.",
    eyebrow: "Rent rule calculator",
    h1: "40% Rent Rule Calculator",
    lead: "Estimate rent using a 40% income rule and compare it with more conservative targets.",
    mode: "rent-rule",
    percent: 40,
    defaultIncome: "60000",
    relatedLinks: affordabilityLinks,
  }),
  "/max-rent-calculator": incomeConfig({
    path: "/max-rent-calculator",
    title: "Max Rent Calculator | How Much Rent Can I Afford?",
    description: "Estimate your maximum rent from income using 30%, 40%, 2.5x, and 3x rent rules. Compare monthly, weekly, and annual rent targets.",
    eyebrow: "Max rent calculator",
    h1: "Max Rent Calculator",
    lead: "Estimate a maximum rent from income, expenses, and common rent rules.",
    mode: "max-rent",
    defaultIncome: "60000",
    defaultRent: "1500",
    relatedLinks: affordabilityLinks,
  }),
  "/rent-budget-calculator": incomeConfig({
    path: "/rent-budget-calculator",
    title: "Rent Budget Calculator | Estimate a Realistic Monthly Rent",
    description: "Build a rent budget from income, expenses, debt, savings, and utilities. See a realistic monthly rent range instead of a single rough rule.",
    eyebrow: "Rent budget calculator",
    h1: "Rent Budget Calculator",
    lead: "Build a rent budget from income, expenses, debt, savings, and utility planning rather than one rule of thumb.",
    mode: "budget",
    defaultIncome: "60000",
    defaultRent: "1500",
    relatedLinks: affordabilityLinks,
  }),
  "/hourly-pay-to-rent-calculator": incomeConfig({
    path: "/hourly-pay-to-rent-calculator",
    title: "Hourly Pay to Rent Calculator | Rent Budget from Hourly Wage",
    description: "Convert hourly pay into monthly income and estimate how much rent may fit your budget using 30%, 40%, and 3x rent rules.",
    eyebrow: "Hourly pay rent calculator",
    h1: "Hourly Pay to Rent Calculator",
    lead: "Convert hourly wage and weekly hours into monthly income, then compare rent targets.",
    mode: "hourly",
    defaultIncome: "21",
    defaultRent: "1200",
    relatedLinks: affordabilityLinks,
    examples: [
      { title: "$18 to $22 per hour", body: "Small hourly wage differences can change the rent target quickly when hours are steady." },
      { title: "$30 per hour", body: "A higher hourly rate still needs a check against taxes, debt, utilities, and hours that may vary." },
    ],
  }),
  "/salary-to-rent-calculator": incomeConfig({
    path: "/salary-to-rent-calculator",
    title: "Salary to Rent Calculator | Rent Budget from Annual Income",
    description: "Convert salary into monthly rent targets. Compare 30%, 40%, 2.5x, and 3x rent rules from annual income.",
    eyebrow: "Salary rent calculator",
    h1: "Salary to Rent Calculator",
    lead: "Convert annual salary into monthly rent targets and qualification-style rent limits.",
    mode: "salary",
    defaultIncome: "60000",
    defaultRent: "1500",
    relatedLinks: affordabilityLinks,
  }),
  "/rent-calculator-by-income": incomeConfig({
    path: "/rent-calculator-by-income",
    title: "Rent Calculator by Income | Estimate Rent from Pay",
    description: "Estimate monthly rent from income, pay frequency, expenses, and common rent rules. Compare comfortable, moderate, and stretched budgets.",
    eyebrow: "Income rent calculator",
    h1: "Rent Calculator by Income",
    lead: "Estimate a rent range from income, target rent, and common affordability rules.",
    mode: "budget",
    defaultIncome: "60000",
    defaultRent: "1500",
    relatedLinks: affordabilityLinks,
  }),
  "/rent-calculator-by-salary": incomeConfig({
    path: "/rent-calculator-by-salary",
    title: "Rent Calculator by Salary | Monthly Rent from Annual Pay",
    description: "Estimate rent from annual salary. See monthly rent targets, weekly equivalents, and rent-to-income percentages.",
    eyebrow: "Salary rent calculator",
    h1: "Rent Calculator by Salary",
    lead: "Start with annual salary and compare monthly rent targets, rent percentage, and qualification-style limits.",
    mode: "salary",
    defaultIncome: "65000",
    defaultRent: "1600",
    relatedLinks: affordabilityLinks,
  }),
};

function salaryAnswer(salary: number): SalaryAnswerConfig {
  const suffix = salary >= 100000 ? "100k" : `${salary / 1000}k`;
  const salaryLabel = `$${salary.toLocaleString()}`;
  return {
    path: `/how-much-rent-can-i-afford-on-${suffix}`,
    salary,
    title: `How much rent can I afford on ${salaryLabel}?`,
    description: `See rent targets for a ${salaryLabel} income using 30%, 40%, and 3x rules. Compare gross monthly income, weekly equivalent, and annual rent impact.`,
    eyebrow: "Salary answer",
    h1: `How much rent can I afford on ${salaryLabel}?`,
    relatedLinks: [link("/salary-to-rent-calculator", "Salary to rent calculator"), link("/rent-budget-calculator", "Rent budget calculator"), link("/rent-to-income-ratio-calculator", "Rent-to-income ratio")],
  };
}

export const salaryAnswerConfigs: Record<string, SalaryAnswerConfig> = Object.fromEntries(
  [50000, 60000, 65000, 70000, 80000, 100000].map((salary) => {
    const config = salaryAnswer(salary);
    return [config.path, config];
  }),
);

function increaseConfig(input: Omit<IncreaseToolConfig, "faq" | "examples"> & Partial<Pick<IncreaseToolConfig, "faq" | "examples">>): IncreaseToolConfig {
  return {
    faq: input.faq ?? [
      { q: "Does this decide whether an increase is legal?", a: "No. It estimates the math only. Check your lease and official local tenancy source for legal rules." },
      { q: "Can I use a fixed dollar increase?", a: "Use the related rent increase calculator for fixed-dollar changes, or enter a percentage here when the page is percentage based." },
    ],
    examples: input.examples ?? [
      { title: "Lease renewal decision", body: "A small monthly increase becomes a larger yearly cost once it repeats for 12 payments. That yearly number is easier to compare with moving costs or a salary change." },
      { title: "Before and after rent", body: "Use the old rent, new rent, and percentage change together when checking whether a notice, renewal offer, or budget worksheet matches the math." },
    ],
    ...input,
  };
}

export const increaseToolConfigs: Record<string, IncreaseToolConfig> = {
  "/rent-increase-formula": increaseConfig({
    path: "/rent-increase-formula",
    title: "Rent Increase Formula | Calculate New Rent",
    description: "Learn the rent increase formula and calculate new rent from a percentage increase, fixed increase, or old and new rent.",
    eyebrow: "Rent increase formula",
    h1: "Rent Increase Formula",
    lead: "Calculate new rent from a percentage increase, a fixed increase, or old and new monthly rent.",
    mode: "formula",
    defaultRate: "5",
    defaultFixed: "100",
    relatedLinks: increaseLinks,
  }),
  "/compound-rent-increase-calculator": increaseConfig({
    path: "/compound-rent-increase-calculator",
    title: "Compound Rent Increase Calculator | Multi-Year Rent Growth",
    description: "Calculate rent after repeated annual increases. See rent by year, final monthly rent, total increase, and total paid.",
    eyebrow: "Rent growth calculator",
    h1: "Compound Rent Increase Calculator",
    lead: "Model repeated annual rent increases and see the rent by year.",
    mode: "compound",
    defaultRate: "4",
    relatedLinks: increaseLinks,
  }),
  "/cpi-rent-increase-calculator": increaseConfig({
    path: "/cpi-rent-increase-calculator",
    title: "CPI Rent Increase Calculator | Estimate CPI-Based Rent",
    description: "Estimate a CPI-based rent increase from current rent and CPI percentage. Compare increase amount, new rent, and optional cap.",
    eyebrow: "CPI rent increase",
    h1: "CPI Rent Increase Calculator",
    lead: "Estimate a CPI-linked rent increase from a current rent and an entered CPI percentage.",
    mode: "cpi",
    defaultRate: "3",
    relatedLinks: increaseLinks,
    regionNote: "CPI-based rent clauses and legal limits vary by lease and jurisdiction. Enter the CPI or cap you want to test.",
  }),
  "/annual-rent-increase-calculator": increaseConfig({
    path: "/annual-rent-increase-calculator",
    title: "Annual Rent Increase Calculator | Monthly and Yearly Impact",
    description: "Calculate the yearly impact of a rent increase. See new monthly rent, annual rent before and after, and total yearly difference.",
    eyebrow: "Rent increase calculator",
    h1: "Annual Rent Increase Calculator",
    lead: "Calculate the yearly effect of a monthly rent increase.",
    mode: "simple",
    defaultRate: "5",
    relatedLinks: increaseLinks,
  }),
  "/monthly-rent-increase-calculator": increaseConfig({
    path: "/monthly-rent-increase-calculator",
    title: "Monthly Rent Increase Calculator | Before and After Rent",
    description: "Calculate a monthly rent increase from old and new rent, or from a percentage increase. See monthly and annual impact.",
    eyebrow: "Rent increase calculator",
    h1: "Monthly Rent Increase Calculator",
    lead: "Compare old and new monthly rent, or test a percentage or fixed monthly increase.",
    mode: "formula",
    defaultRate: "5",
    defaultFixed: "100",
    relatedLinks: increaseLinks,
  }),
  "/rent-escalation-calculator": increaseConfig({
    path: "/rent-escalation-calculator",
    title: "Rent Escalation Calculator | Scheduled Rent Increases",
    description: "Calculate scheduled rent escalation over time. Build a rent increase schedule from percent, fixed, or custom yearly changes.",
    eyebrow: "Rent escalation calculator",
    h1: "Rent Escalation Calculator",
    lead: "Build a scheduled rent increase table from a starting rent and annual escalation rate.",
    mode: "escalation",
    defaultRate: "3",
    relatedLinks: increaseLinks,
  }),
  "/ontario-rent-increase-calculator": increaseConfig({
    path: "/ontario-rent-increase-calculator",
    title: "Ontario Rent Increase Calculator | Estimate New Rent",
    description: "Estimate an Ontario rent increase from current rent and guideline percentage. See new monthly rent, annual impact, and key assumptions.",
    eyebrow: "Ontario rent increase",
    h1: "Ontario Rent Increase Calculator",
    lead: "Estimate the math for an Ontario rent increase from current rent and an entered guideline percentage.",
    mode: "regional",
    defaultRate: "2.5",
    relatedLinks: increaseLinks,
    regionNote: "Not all Ontario units are covered by guideline rules. Check the LTB or official Ontario source before relying on an increase notice.",
  }),
  "/bc-rent-increase-calculator": increaseConfig({
    path: "/bc-rent-increase-calculator",
    title: "BC Rent Increase Calculator | Estimate New Rent",
    description: "Estimate a BC rent increase from current rent and annual limit percentage. See new rent, increase amount, and timing assumptions.",
    eyebrow: "BC rent increase",
    h1: "BC Rent Increase Calculator",
    lead: "Estimate a BC rent increase from current rent and an entered annual limit percentage.",
    mode: "regional",
    defaultRate: "3",
    relatedLinks: increaseLinks,
    regionNote: "BC rent rules and annual limits can change. Check the Residential Tenancy Branch for official requirements.",
  }),
  "/quebec-rent-increase-calculator": increaseConfig({
    path: "/quebec-rent-increase-calculator",
    title: "Quebec Rent Increase Calculator | Estimate New Rent",
    description: "Estimate a Quebec rent increase from current rent and an entered increase amount or percentage. Includes assumptions and official-source disclaimer.",
    eyebrow: "Quebec rent increase",
    h1: "Quebec Rent Increase Calculator",
    lead: "Estimate the math for a Quebec rent increase from an entered percentage.",
    mode: "regional",
    defaultRate: "4",
    relatedLinks: increaseLinks,
    regionNote: "Quebec rent increases can involve multiple factors. This does not replace TAL guidance or official calculation tools.",
  }),
  "/california-rent-increase-calculator": increaseConfig({
    path: "/california-rent-increase-calculator",
    title: "California Rent Increase Calculator | Estimate New Rent",
    description: "Estimate a California rent increase from current rent and a percentage increase. Compare new rent, annual impact, and cap assumptions.",
    eyebrow: "California rent increase",
    h1: "California Rent Increase Calculator",
    lead: "Estimate a California rent increase from current rent and an entered percentage or cap assumption.",
    mode: "regional",
    defaultRate: "5",
    relatedLinks: increaseLinks,
    regionNote: "California state and local rent rules can vary. Check official local and state sources before acting on a notice.",
  }),
};

export const splitToolConfigs: Record<string, SplitToolConfig> = {
  "/split-rent-based-on-income-calculator": {
    path: "/split-rent-based-on-income-calculator",
    title: "Split Rent Based on Income Calculator",
    description: "Split rent by income across roommates. Add rent, utilities, and each person’s income to calculate a proportional rent share.",
    eyebrow: "Rent split calculator",
    h1: "Split Rent Based on Income Calculator",
    lead: "Split rent and utilities proportionally from each roommate's income.",
    mode: "income",
    relatedLinks: splitLinks,
    faq: [{ q: "When is income-based splitting fair?", a: "It can help when incomes differ a lot and roommates agree that rent should follow ability to pay." }],
  },
  "/roommate-rent-split-calculator": {
    path: "/roommate-rent-split-calculator",
    title: "Roommate Rent Split Calculator | Rent and Utilities",
    description: "Split rent and utilities between roommates equally, by income, by room size, or by custom percentages.",
    eyebrow: "Roommate rent split",
    h1: "Roommate Rent Split Calculator",
    lead: "Compare equal, income-based, and custom rent shares for roommates.",
    mode: "roommate",
    relatedLinks: splitLinks,
    faq: [{ q: "Should utilities be split the same way as rent?", a: "Not always. Some roommates split rent by room size but utilities equally because everyone uses shared services." }],
  },
  "/rent-split-percentage-calculator": {
    path: "/rent-split-percentage-calculator",
    title: "Rent Split Percentage Calculator | Custom Shares",
    description: "Split rent by custom percentages. Enter total rent and each roommate’s percentage to calculate exact monthly shares.",
    eyebrow: "Rent split calculator",
    h1: "Rent Split Percentage Calculator",
    lead: "Split rent by custom percentages when equal or income-based shares do not fit the arrangement.",
    mode: "percentage",
    relatedLinks: splitLinks,
    faq: [{ q: "Do percentages need to add to 100?", a: "Yes. A custom percentage split should add to 100% across all roommates." }],
  },
};

export const moveInCostConfigs: Record<string, MoveInCostConfig> = {
  "/rent-in-advance-australia": {
    path: "/rent-in-advance-australia",
    title: "Rent in Advance Australia | Estimate Upfront Rent",
    description: "Estimate rent in advance from weekly, fortnightly, or monthly rent in Australia and understand how upfront rent affects move-in costs.",
    eyebrow: "Australia rent in advance",
    h1: "Rent in Advance Australia",
    lead: "Estimate rent in advance from weekly rent and understand how it affects move-in cash needed.",
    mode: "advance",
    defaultCurrency: "AUD",
    relatedLinks: australiaLinks,
    faq: [{ q: "Is rent in advance an extra fee?", a: "Usually no. It normally pays for future occupancy. Local rules and the lease control the exact treatment." }],
    examples: [{ title: "$500 per week", body: "$500/week means 2 weeks in advance is $1,000 before separate costs such as bond or moving expenses." }],
    sections: [
      { title: "What rent in advance means", body: "Rent in advance is usually money paid before or at the start of the period it covers. It is different from a bond or security deposit." },
      { title: "State and territory rules", body: "Australian rental rules vary by state and territory. Use this as a budgeting estimate, then check your lease and official tenancy authority." },
    ],
  },
  "/bond-and-rent-in-advance-australia": {
    path: "/bond-and-rent-in-advance-australia",
    title: "Bond and Rent in Advance Australia | Move-In Cost Calculator",
    description: "Estimate Australian rental move-in costs from weekly rent, including bond, rent in advance, and total upfront amount.",
    eyebrow: "Australia move-in costs",
    h1: "Bond and Rent in Advance Australia",
    lead: "Estimate bond, rent in advance, and total upfront rental costs from weekly rent.",
    mode: "bond-advance",
    defaultCurrency: "AUD",
    relatedLinks: australiaLinks,
    faq: [{ q: "Are bond and rent in advance the same?", a: "No. Bond is usually security. Rent in advance normally pays for upcoming occupancy." }],
    examples: [{ title: "$500 per week", body: "At $500/week, 4 weeks bond plus 2 weeks rent in advance equals $3,000 before moving costs." }],
    sections: [
      { title: "Bond vs rent in advance", body: "Bond and rent in advance are separate move-in costs. The bond is held as security, while rent in advance usually covers future rent." },
      { title: "Use as an estimate", body: "Rules vary by state and lease. This calculator helps plan cash needed, not decide what a landlord can legally request." },
    ],
  },
};

export const prorationToolConfigs: Record<string, ProrationToolConfig> = {
  "/prorated-rent-calculator-australia": {
    path: "/prorated-rent-calculator-australia",
    title: "Prorated Rent Calculator Australia | Partial Rent",
    description: "Calculate partial rent in Australia for a mid-month or mid-period move-in or move-out using weekly, fortnightly, or monthly rent.",
    eyebrow: "Australia prorated rent",
    h1: "Prorated Rent Calculator Australia",
    lead: "Estimate partial rent for a mid-period move-in or move-out using monthly, weekly, or fortnightly rent.",
    defaultCurrency: "AUD",
    relatedLinks: australiaLinks,
    faq: [{ q: "Which proration method should I use?", a: "Use the method stated in your lease or required by local rules. This calculator lets you enter the period and day count." }],
    examples: [{ title: "March 10 through March 31", body: "$1,500 monthly rent for 22 occupied days in a 31-day month is about $1,064.52." }],
    sections: [
      { title: "How partial rent is estimated", body: "The calculator divides the rent by the days in the selected period, then multiplies by the number of days charged." },
      { title: "Lease and state rules", body: "Some leases or local rules may specify a different daily-rate method. Check the lease before relying on the estimate." },
    ],
  },
};

export const dateToolConfigs: Record<string, DateToolConfig> = {
  "/lease-date-calculator": {
    path: "/lease-date-calculator",
    title: "Lease Date Calculator | Start and End Dates",
    description: "Calculate lease start and end dates from a move-in date and lease length. See renewal reminders and key rental dates.",
    eyebrow: "Lease date calculator",
    h1: "Lease Date Calculator",
    lead: "Calculate lease end dates, final days, and renewal reminder dates from a start date and lease length.",
    mode: "lease",
    relatedLinks: dateLinks,
    faq: [{ q: "Is the end date inclusive?", a: "This calculator treats the final day as the day before the same date after the lease length. Your lease wording controls the actual date." }],
  },
  "/lease-start-and-end-date-calculator": {
    path: "/lease-start-and-end-date-calculator",
    title: "Lease Start and End Date Calculator",
    description: "Calculate a lease end date from a start date, or find the lease length between two rental dates.",
    eyebrow: "Lease date calculator",
    h1: "Lease Start and End Date Calculator",
    lead: "Calculate a lease end date from a start date and lease length.",
    mode: "lease-range",
    relatedLinks: dateLinks,
    faq: [{ q: "Can I calculate length between two dates?", a: "Use this as a planning check, then compare it with the exact lease language." }],
  },
  "/12-month-lease-date-calculator": {
    path: "/12-month-lease-date-calculator",
    title: "12-Month Lease Date Calculator",
    description: "Calculate the end date for a 12-month lease from any start date and understand common lease-date assumptions.",
    eyebrow: "Lease date calculator",
    h1: "12-Month Lease Date Calculator",
    lead: "Calculate the likely final day of a 12-month lease from any start date.",
    mode: "twelve-month",
    relatedLinks: dateLinks,
    faq: [{ q: "When does a 12-month lease starting June 1 end?", a: "It often ends May 31 the next year, but lease wording controls the final day." }],
  },
  "/rent-schedule-calculator": {
    path: "/rent-schedule-calculator",
    title: "Rent Schedule Calculator | Payment Dates and Totals",
    description: "Generate a rent payment schedule from rent amount, frequency, first due date, and lease length. See payment dates and totals.",
    eyebrow: "Rent schedule calculator",
    h1: "Rent Schedule Calculator",
    lead: "Generate rent payment dates and totals from a first due date, lease length, rent amount, and frequency.",
    mode: "schedule",
    relatedLinks: dateLinks,
    faq: [{ q: "Can I print the schedule?", a: "Yes. Use Print / Save PDF from your browser after generating the payment table." }],
  },
};

function answerConfig(path: string, amount: number, currency: Currency, title?: string, description?: string, daily = false): WeeklyAnswerPageConfig {
  const label = currency === "EUR" ? "euros" : currency === "GBP" ? "pounds" : "dollars";
  return {
    path,
    amount,
    currency,
    daily,
    eyebrow: daily ? "Daily to monthly answer" : "Weekly to monthly answer",
    h1: daily ? `£${amount} per night is how much per month?` : `${currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$"}${amount} per week is how much per month?`,
    title: title ?? `${currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$"}${amount} Per Week to Monthly Rent`,
    description: description ?? `Convert ${currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}${amount} per week to monthly rent. See the true monthly amount, annual cost, and 4-week comparison.`,
    labelPrefix: label,
    relatedLinks: [link("/weekly-to-monthly-rent-converter", "Weekly to monthly converter"), link("/pw-to-pcm-calculator", "PW to PCM calculator"), link("/rent-paid-every-4-weeks-calculator", "4-week rent calculator")],
  };
}

const weeklyAnswerAmounts = [150, 160, 170, 180, 200, 220, 230, 250, 300, 320, 350, 370, 400, 450, 500, 550, 600, 650, 750];

export const weeklyAnswerPageConfigs: Record<string, WeeklyAnswerPageConfig> = {
  ...Object.fromEntries(
    weeklyAnswerAmounts.map((amount) => {
      const config = answerConfig(`/${amount}-per-week-to-monthly-rent`, amount, "USD");
      return [config.path, config];
    }),
  ),
  "/500-euros-per-week-to-monthly-rent": answerConfig(
    "/500-euros-per-week-to-monthly-rent",
    500,
    "EUR",
    "€500 Per Week to Monthly Rent | Weekly to Monthly",
    "Convert €500 per week to monthly rent. See the true monthly amount, annual cost, and 4-week comparison.",
  ),
  "/190-pounds-per-week-to-pcm": answerConfig(
    "/190-pounds-per-week-to-pcm",
    190,
    "GBP",
    "£190 Per Week to PCM | Weekly Rent to Monthly",
    "Convert £190 per week to per calendar month rent. See the PCM amount, annual rent, and 4-week comparison.",
  ),
  "/60-pounds-per-night-to-monthly-rent": answerConfig(
    "/60-pounds-per-night-to-monthly-rent",
    60,
    "GBP",
    "£60 Per Night to Monthly Rent | Daily to Monthly",
    "Convert £60 per night to monthly rent. See daily, weekly, monthly, and annual equivalents.",
    true,
  ),
};

function answerAmountLabel(config: WeeklyAnswerPageConfig) {
  return config.currency === "USD" ? `$${config.amount}` : `${config.currency} ${config.amount}`;
}

for (const config of Object.values(weeklyAnswerPageConfigs)) {
  const amountLabel = answerAmountLabel(config);
  if (config.daily) {
    config.title = `${amountLabel} per night to monthly rent`;
    config.h1 = `${amountLabel} per night to monthly rent`;
    config.description = `Convert ${amountLabel} per night into average monthly rent. See daily, weekly, monthly, and annual equivalents with clear assumptions.`;
  } else {
    config.title = `${amountLabel} per week to monthly rent`;
    config.h1 = `${amountLabel} per week to monthly rent`;
    config.description = `Convert ${amountLabel} per week into average monthly rent, 4-week rent, and annual rent. See why weekly rent times 4 is not the same as calendar-month rent.`;
  }
}
