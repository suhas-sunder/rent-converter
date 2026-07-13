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
  SplitToolConfig,
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
  link("/rent-as-percentage-of-income-calculator", "Rent as percentage of income", "See what share of income goes to rent."),
  link("/income-required-for-rent-calculator", "Income required for rent", "Test 2x, 2.5x, 3x, or a custom multiplier."),
  link("/salary-to-rent-calculator", "Salary to rent", "Compare rent targets from annual salary."),
  link("/rent-budget-calculator", "Rent budget calculator", "Include bills, savings, and other costs."),
];

export const australiaLinks = [
  link("/weekly-to-monthly-rent-australia", "Weekly to monthly Australia", "Compare Australian weekly listings with monthly budgets."),
  link("/weekly-to-fortnightly-rent-australia", "Weekly to fortnightly", "Convert weekly rent into fortnightly rent."),
  link("/fortnightly-to-monthly-rent-australia", "Fortnightly to monthly", "Convert fortnightly rent into calendar monthly rent."),
  link("/bond-and-rent-in-advance-australia", "Bond and rent in advance", "Estimate common move-in costs."),
  link("/prorated-rent-calculator-australia", "Prorated rent Australia", "Estimate partial rent for a move-in or move-out."),
];

export const increaseLinks = [
  link("/rent-increase-calculator", "Rent increase calculator", "Calculate a simple rent increase."),
  link("/rent-increase-percentage-calculator", "Rent increase percentage", "Find the percent change between old and new rent."),
  link("/compound-rent-increase-calculator", "Compound rent increase", "Model repeated annual increases."),
];

export const splitLinks = [
  link("/split-rent-based-on-income-calculator", "Split rent by income", "Divide rent by each roommate income."),
  link("/rent-split-percentage-calculator", "Percentage rent split", "Use exact custom percentages."),
  link("/rent-split-calculator", "Rent split calculator", "Use the main split tool."),
  link("/rent-as-percentage-of-income-calculator", "Rent as percentage of income", "Check rent burden after splitting."),
];

export const dateLinks = [
  link("/rent-due-date-calculator", "Rent due date calculator", "Find upcoming payment dates."),
  link("/rent-schedule-calculator", "Rent schedule calculator", "Build a payment schedule."),
  link("/lease-date-calculator", "Lease date calculator", "Calculate lease start and end dates."),
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
    q: "How do I compare PCM with PW?",
    a: "Convert PW to PCM with weekly rent x 365 / 7 / 12, or convert PCM to an average weekly amount with monthly rent x 12 x 7 / 365.",
  },
  {
    q: "Does PCM define the lease terms or included costs?",
    a: "No. PCM describes the rent period only. The listing or written agreement controls payment terms and any other charges.",
  },
];

const pwFaq: FaqItem[] = [
  {
    q: "What does PW mean in rent?",
    a: "PW means per week. It describes a 7-day rent amount.",
  },
  {
    q: "Should I multiply PW rent by 4?",
    a: "Multiplying by 4 only gives a 28-day amount. A true monthly comparison uses annual rent divided by 12.",
  },
  {
    q: "Is PW the same as every 4 weeks?",
    a: "No. PW is one 7-day amount. Every 4 weeks is a 28-day cycle, while PCM is a calendar-month amount.",
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
    answer: "Per calendar month rent uses calendar months, which vary from 28 to 31 days. It is different from weekly rent and from an every-4-weeks cycle, which repeats every 28 days.",
    formula: "weekly rent to PCM = weekly rent x 365 / 7 / 12",
    caveat: "PCM describes a rent period. It does not interpret lease terms, fees, included costs, or legal obligations.",
    tableTitle: "Rent listing terms compared",
    tableRows: glossaryRows,
    ctaLinks: [link("/pw-to-pcm-calculator", "Convert PW to PCM"), link("/pcm-to-pw-calculator", "Convert PCM to PW")],
    sections: [
      {
        title: "Calendar month vs 4 weeks",
        body: "A calendar month is not the same length as 4 weeks. Four weeks is always 28 days, while calendar months run from 28 to 31 days. Over a year, PCM means 12 monthly payments, while a repeating 28-day cycle falls on a different rhythm.",
      },
      {
        title: "PW compared with PCM",
        body: "PW means per week and PCM means per calendar month. Multiplying PW by 4 gives only a 28-day amount. Annualizing the weekly rent and dividing by 12 gives the average PCM comparison.",
      },
      {
        title: "Which calculator to use",
        body: "Use the PW-to-PCM calculator when the listing is weekly and the budget is monthly. Use the PCM-to-PW calculator when a monthly amount needs an average weekly equivalent.",
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
    caveat: "PW describes a 7-day rent period. It does not interpret lease terms, included costs, fees, or legal obligations.",
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

function conversionDefaultExamples(input: Omit<ConversionPageConfig, "faq" | "examples" | "sections">): ConversionPageConfig["examples"] {
  if (input.path === "/weekly-to-fortnightly-rent-australia") {
    return [
      { title: "$500 weekly to fortnightly", body: "$500/week becomes $1,000 per fortnight. The calendar-month equivalent is still higher than two fortnightly payments." },
      { title: "Pay cycle check", body: "Use the fortnightly result when rent or income is planned every two weeks, then keep the monthly number for bills and affordability." },
    ];
  }
  if (input.path === "/fortnightly-to-monthly-rent-australia") {
    return [
      { title: "$1,000 fortnightly rent", body: "$1,000 per fortnight is about $2,172.62 per average calendar month, not $2,000." },
      { title: "Monthly budget check", body: "Two fortnightly payments cover 28 days. Use the monthly equivalent for salary, bills, and move-in planning." },
    ];
  }
  return [
    { title: "Listing comparison", body: "Put a weekly, biweekly, 4-week, or monthly listing on the same time basis before deciding which place is actually cheaper." },
    { title: "Monthly budget check", body: "Use the calendar-month result when salary, bills, savings, and rent caps are planned monthly." },
  ];
}

function conversionConfig(input: Omit<ConversionPageConfig, "faq" | "examples" | "sections"> & Partial<Pick<ConversionPageConfig, "faq" | "examples" | "sections">>): ConversionPageConfig {
  return {
    faq: input.faq ?? [
      { q: "What assumption does this calculator use?", a: "It uses a 365-day year, 7-day weeks, 14-day biweekly or fortnightly periods, 28-day four-week periods, and 12 calendar months." },
      { q: "Does this include bills or move-in costs?", a: "No. The calculator converts the rent amount only. Add utilities, parking, internet, deposits, service charges, or other fees separately." },
    ],
    examples: input.examples ?? conversionDefaultExamples(input),
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
    sections: [
      {
        title: "PW, PCM, and four-week rent",
        body: "PW means per week and PCM means per calendar month. Multiplying weekly rent by 4 gives a 28-day amount, not a calendar-month amount. This calculator annualizes PW rent, then divides by 12.",
      },
      {
        title: "Scope of the result",
        body: "GBP is available in the currency selector. The result is rent arithmetic only and does not determine lease terms, included costs, fees, or legal obligations.",
      },
    ],
    examples: [
      {
        title: "GBP 190 PW example",
        body: "GBP 190 per week is about GBP 825.60 PCM using 190 x 365 / 7 / 12. Multiplying by 4 gives only GBP 760 for 28 days.",
      },
    ],
    faq: [
      {
        q: "What do PW and PCM mean?",
        a: "PW means per week. PCM means per calendar month.",
      },
      {
        q: "What formula converts PW to PCM?",
        a: "Multiply weekly rent by 365, divide by 7, then divide by 12.",
      },
      {
        q: "Why is weekly rent times 4 different?",
        a: "Weekly rent times 4 covers 28 days. A calendar month varies in length and averages about 30.42 days on a 365-day basis.",
      },
    ],
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
    sections: [
      {
        title: "PCM to an average PW amount",
        body: "PCM means per calendar month and PW means per week. The reverse formula is monthly rent x 12 x 7 / 365, which preserves the annual rent before finding a 7-day equivalent.",
      },
      {
        title: "Why dividing by 4 is inaccurate",
        body: "Dividing monthly rent by 4 treats a calendar month as exactly 28 days. The result here is an average weekly equivalent based on the full annual rent.",
      },
    ],
    examples: [
      {
        title: "GBP 1,200 PCM example",
        body: "GBP 1,200 PCM is about GBP 276.16 PW using 1,200 x 12 x 7 / 365.",
      },
    ],
    faq: [
      {
        q: "What do PCM and PW mean?",
        a: "PCM means per calendar month. PW means per week.",
      },
      {
        q: "What formula converts PCM to PW?",
        a: "Multiply monthly rent by 12, multiply by 7, then divide by 365.",
      },
      {
        q: "Is PCM divided by 4 an accurate weekly rent?",
        a: "No. That assumes every calendar month is exactly 4 weeks. This calculator returns an average weekly equivalent from annual rent.",
      },
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
};

function incomeDefaultExamples(input: Omit<IncomeToolConfig, "faq" | "examples" | "sections">): IncomeToolConfig["examples"] {
  if (input.path === "/rent-budget-calculator") {
    return [
      { title: "Visible expense check", body: "Enter planned rent and one aggregate non-rent expense amount to see what remains from gross monthly income." },
      { title: "Reference amounts stay income-based", body: "Changing expenses changes the remaining amount, but it does not change the 30%, 40%, or 3x comparison amounts." },
    ];
  }
  if (input.path === "/salary-to-rent-calculator") {
    return [
      { title: "$65,000 salary", body: "A $65,000 salary gives a gross monthly income basis before the calculator compares 30%, 40%, and screening-style targets." },
      { title: "Salary is not take-home pay", body: "Use the salary result as a benchmark, then check net income if payroll deductions, debt, or local costs are high." },
    ];
  }
  if (input.mode === "hourly") {
    return [
      { title: "$18 to $22 per hour", body: "Small hourly wage differences can change the rent target quickly when hours are steady." },
      { title: "Variable hours", body: "A higher hourly rate still needs a check against taxes, debt, utilities, and hours that may vary." },
    ];
  }
  return [
    { title: "Apartment screening", body: "A listing may ask for 2.5x or 3x rent in gross income. The calculator shows that screening number before you spend time on an application." },
    { title: "Real monthly pressure", body: "A rent amount can pass a simple income rule but still leave too little after utilities, debt, insurance, transport, groceries, and savings." },
  ];
}

function incomeDefaultFaq(input: Omit<IncomeToolConfig, "faq" | "examples" | "sections">): IncomeToolConfig["faq"] {
  if (input.mode === "hourly") {
    return [
      { q: "How is hourly pay converted to income?", a: "Hourly pay is multiplied by weekly hours and 52 paid weeks for estimated annual gross income, then divided by 12 for monthly gross income." },
      { q: "Does this calculate take-home pay?", a: "No. Taxes, payroll deductions, overtime changes, and unpaid time are not deducted." },
    ];
  }
  if (input.mode === "budget") {
    return [
      { q: "What belongs in non-rent expenses?", a: "Enter one aggregate monthly amount. It may include debt, utilities, savings, or other recurring non-rent costs you want subtracted." },
      { q: "Do expenses change the 30%, 40%, or 3x amounts?", a: "No. Those are gross-income reference amounts. Expenses affect only the displayed amount remaining after planned rent and non-rent expenses." },
    ];
  }
  if (input.mode === "salary") {
    return [
      { q: "Does this use gross or take-home salary?", a: "It uses annual gross salary. Taxes, deductions, expenses, and take-home pay are not calculated." },
      { q: "What does the planned-rent percentage show?", a: "It divides the visible planned monthly rent by calculated monthly gross income." },
    ];
  }
  return [
    { q: "Should I use gross or take-home income?", a: "Many qualification rules use gross income. A personal budget should also check take-home pay, debt, utilities, savings, and local costs." },
    { q: "Does this guarantee approval?", a: "No. Landlords may consider credit, savings, guarantors, household income, local rules, and their own criteria." },
  ];
}

function incomeDefaultSections(input: Omit<IncomeToolConfig, "faq" | "examples" | "sections">): IncomeToolConfig["sections"] {
  if (input.mode === "budget") {
    return [
      { title: "What the expense field changes", body: "The aggregate non-rent expense amount is subtracted only in the remaining-amount result. It does not create an expense-adjusted rent recommendation." },
      { title: "What the reference amounts mean", body: "The 30%, 40%, and 3x amounts are gross-income comparisons. They do not separately model debt, savings, utilities, taxes, or approval criteria." },
    ];
  }
  return [
    { title: "Qualification max vs comfort max", body: "A rent amount can pass a landlord income rule and still feel too tight in a real budget. Compare the rule result with your take-home pay and fixed expenses." },
    { title: "What a rent rule leaves out", body: "Income rules do not know your credit profile, guarantor options, deposits, utilities, insurance, childcare, car payments, local application rules, or how variable your income is." },
  ];
}

function incomeConfig(input: Omit<IncomeToolConfig, "faq" | "examples" | "sections"> & Partial<Pick<IncomeToolConfig, "faq" | "examples" | "sections">>): IncomeToolConfig {
  return {
    faq: input.faq ?? incomeDefaultFaq(input),
    examples: input.examples ?? incomeDefaultExamples(input),
    sections: input.sections ?? incomeDefaultSections(input),
    ...input,
  };
}

export const incomeToolConfigs: Record<string, IncomeToolConfig> = {
  "/rent-budget-calculator": incomeConfig({
    path: "/rent-budget-calculator",
    title: "Rent Budget Calculator | Compare Rent, Income and Expenses",
    description: "Compare planned monthly rent with annual gross income and aggregate non-rent expenses. See the remaining amount and income-based reference rules.",
    eyebrow: "Rent budget calculator",
    h1: "Rent Budget Calculator",
    lead: "Compare planned rent with gross monthly income and one aggregate non-rent expense amount, then review common income-based reference rules.",
    mode: "budget",
    defaultIncome: "60000",
    defaultRent: "1500",
    defaultExpenses: "900",
    relatedLinks: affordabilityLinks,
  }),
  "/hourly-pay-to-rent-calculator": incomeConfig({
    path: "/hourly-pay-to-rent-calculator",
    title: "Hourly Pay to Rent Calculator | Rent Budget from Hourly Wage",
    description: "Convert hourly pay and weekly hours into estimated gross income, then compare 30%, 40%, and 3x monthly rent reference amounts.",
    eyebrow: "Hourly pay rent calculator",
    h1: "Hourly Pay to Rent Calculator",
    lead: "Convert hourly pay and weekly hours into estimated annual and monthly gross income, then compare income-based rent reference amounts.",
    mode: "hourly",
    defaultIncome: "21",
    defaultRent: "1200",
    defaultHours: "40",
    relatedLinks: affordabilityLinks,
    examples: [
      { title: "$18 to $22 per hour", body: "Small hourly wage differences can change the rent target quickly when hours are steady." },
      { title: "$30 per hour", body: "A higher hourly rate still needs a check against taxes, debt, utilities, and hours that may vary." },
    ],
  }),
  "/salary-to-rent-calculator": incomeConfig({
    path: "/salary-to-rent-calculator",
    title: "Salary to Rent Calculator | Monthly Rent from Income",
    description: "Enter annual gross salary or income to calculate monthly income, compare 30%, 40%, and 3x rent references, and check a planned monthly rent.",
    eyebrow: "Salary and income rent calculator",
    h1: "Salary to Rent Calculator",
    lead: "Enter annual gross salary or annual gross income, then compare 30%, 40%, and 3x monthly rent references with your planned rent.",
    mode: "salary",
    defaultIncome: "60000",
    defaultRent: "1500",
    relatedLinks: [
      link("/rent-as-percentage-of-income-calculator", "Rent as percentage of income", "Compare a specific rent with income over matching periods."),
      link("/income-required-for-rent-calculator", "Income required for rent", "Reverse rent and income with preset or custom multipliers."),
      link("/rent-budget-calculator", "Rent budget calculator", "Add visible non-rent costs to a separate budget check."),
    ],
    faq: [
      {
        q: "How does the salary-to-rent calculator calculate the monthly references?",
        a: "It divides annual gross salary by 12 for monthly gross income. The 30% and 40% references multiply annual salary by 0.30 or 0.40 and divide by 12. The 3x reference divides annual salary by 3 and then by 12.",
      },
      {
        q: "Are the 30% and 40% figures affordability rules?",
        a: "No. The 30% figure is a commonly discussed arithmetic reference, and 40% is a larger share of gross income. Neither is a universal rule, approval threshold, or personalized affordability decision.",
      },
      {
        q: "Does this use gross salary or take-home pay?",
        a: "It uses annual gross salary or gross income. Take-home pay can differ substantially after taxes and deductions, and the calculator does not automatically subtract debt, utilities, insurance, transportation, childcare, medical costs, or savings.",
      },
    ],
    sections: [
      {
        title: "Salary-to-rent formulas",
        body: "Each result is an arithmetic reference calculated from the annual gross salary or income entered.",
        bullets: [
          "Monthly gross income = annual salary ÷ 12.",
          "30% monthly reference = annual salary × 0.30 ÷ 12.",
          "40% monthly reference = annual salary × 0.40 ÷ 12.",
          "3x income reference = annual salary ÷ 3 ÷ 12.",
          "Planned rent percentage = planned monthly rent ÷ monthly gross income × 100.",
        ],
      },
      {
        title: "How to compare 30% and 40%",
        body: "Thirty percent is a commonly discussed reference, not a universal rule. Forty percent represents a larger share of gross income and is not a recommendation. Neither percentage includes a complete household budget, and both can look very different when compared with take-home pay.",
        bullets: [
          "Debt, childcare, transportation, medical costs, utilities, insurance, and savings can change a practical personal limit.",
          "The results do not determine affordability, financial suitability, or application approval.",
        ],
      },
      {
        title: "Representative salary examples",
        body: "These USD figures are formula examples, not guaranteed maximums or personalized rent conclusions.",
        bullets: [
          "$50,000 salary: $1,250.00 at 30%, $1,666.67 at 40%, and $1,388.89 under the 3x comparison.",
          "$60,000 salary: $1,500.00 at 30%, $2,000.00 at 40%, and $1,666.67 under the 3x comparison.",
          "$80,000 salary: $2,000.00 at 30%, $2,666.67 at 40%, and $2,222.22 under the 3x comparison.",
          "$100,000 salary: $2,500.00 at 30%, $3,333.33 at 40%, and $2,777.78 under the 3x comparison.",
        ],
      },
    ],
    examples: [
      {
        title: "$60,000 annual gross income",
        body: "$60,000 ÷ 12 gives $5,000 monthly gross income. The calculator shows $1,500 at 30%, $2,000 at 40%, and $1,666.67 under the 3x comparison.",
      },
      {
        title: "Planned-rent comparison",
        body: "With $60,000 annual gross income, $1,500 planned monthly rent is 30% of monthly gross income. The percentage is arithmetic only and does not include other expenses.",
      },
    ],
  }),
};

function increaseDefaultExamples(input: Omit<IncreaseToolConfig, "faq" | "examples">): IncreaseToolConfig["examples"] {
  if (input.mode === "regional") {
    return [
      { title: "Math check only", body: "Enter the current rent and the percentage you want to test. The result shows the new rent and annual impact, but it does not decide whether that percentage is allowed." },
      { title: "Notice review", body: "Compare the calculated monthly change with the rent notice, then verify dates, exemptions, lease wording, and official guidance separately." },
    ];
  }
  if (input.mode === "compound") {
    return [
      { title: "Annual percentage escalation", body: "Some leases describe repeated percentage increases as rent escalation. Each year applies the entered rate to the prior year’s rent, so the fifth-year rent is higher than one flat increase on the starting rent." },
      { title: "Scope of the schedule", body: "Use the year-by-year rows to inspect starting rent, final rent, and total increase. The calculator does not model fixed-dollar, irregular, or custom annual schedules, interpret lease clauses, or calculate cumulative rent paid." },
    ];
  }
  return [];
}

function increaseConfig(input: Omit<IncreaseToolConfig, "faq" | "examples"> & Partial<Pick<IncreaseToolConfig, "faq" | "examples">>): IncreaseToolConfig {
  const defaultFaq = input.mode === "regional"
    ? [
        { q: "Is the starting percentage an official current limit?", a: "No. It is an editable arithmetic scenario, not automatically updated legal data. Verify current rules with the relevant official authority." },
        { q: "Does the result determine whether an increase is permitted?", a: "No. Exemptions, notice requirements, local rules, and lease terms can affect whether an increase is allowed." },
      ]
    : input.mode === "compound"
        ? [
            { q: "How is the multi-year rent calculated?", a: "The entered annual percentage is applied to the prior year’s rent once per year for the whole-number term entered. This repeated compounding is sometimes described as annual rent escalation." },
            { q: "What schedules are not supported?", a: "The calculator does not model fixed-dollar, irregular, or custom year-by-year percentages, interpret lease clauses, decide enforceability, or calculate cumulative rent paid." },
          ]
        : [];
  return {
    faq: input.faq ?? defaultFaq,
    examples: input.examples ?? increaseDefaultExamples(input),
    ...input,
  };
}

export const increaseToolConfigs: Record<string, IncreaseToolConfig> = {
  "/compound-rent-increase-calculator": increaseConfig({
    path: "/compound-rent-increase-calculator",
    title: "Compound Rent Increase Calculator | Multi-Year Rent Growth",
    description: "Calculate rent after repeated annual percentage increases. See rent by year, final monthly rent, and the total increase.",
    eyebrow: "Rent growth calculator",
    h1: "Compound Rent Increase Calculator",
    lead: "Model annual percentage escalation with repeated compounding and see starting rent, each yearly result, final rent, and total increase.",
    mode: "compound",
    defaultRate: "4",
    relatedLinks: increaseLinks,
  }),
  "/ontario-rent-increase-calculator": increaseConfig({
    path: "/ontario-rent-increase-calculator",
    title: "Ontario Rent Increase Calculator | Estimate New Rent",
    description: "Test an editable Ontario rent-increase percentage scenario. See the increase amount and estimated new rent, then verify current official rules.",
    eyebrow: "Ontario rent increase",
    h1: "Ontario Rent Increase Calculator",
    lead: "Check the arithmetic for an Ontario rent-increase percentage scenario that you enter.",
    mode: "regional",
    defaultRate: "2.5",
    relatedLinks: increaseLinks,
    regionNote: "Not all Ontario units are covered by guideline rules. Check the LTB or official Ontario source before relying on an increase notice.",
  }),
  "/bc-rent-increase-calculator": increaseConfig({
    path: "/bc-rent-increase-calculator",
    title: "BC Rent Increase Calculator | Estimate New Rent",
    description: "Test an editable BC rent-increase percentage scenario. See the increase amount and estimated new rent, then verify current official rules.",
    eyebrow: "BC rent increase",
    h1: "BC Rent Increase Calculator",
    lead: "Check the arithmetic for a BC rent-increase percentage scenario that you enter.",
    mode: "regional",
    defaultRate: "3",
    relatedLinks: increaseLinks,
    regionNote: "BC rent rules and annual limits can change. Check the Residential Tenancy Branch for official requirements.",
  }),
  "/quebec-rent-increase-calculator": increaseConfig({
    path: "/quebec-rent-increase-calculator",
    title: "Quebec Rent Increase Calculator | Estimate New Rent",
    description: "Test an editable Quebec rent-increase percentage scenario. See the increase amount and estimated new rent, then verify current official rules.",
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
    description: "Test an editable California rent-increase percentage scenario. See the increase amount and estimated new rent, then verify current official rules.",
    eyebrow: "California rent increase",
    h1: "California Rent Increase Calculator",
    lead: "Check the arithmetic for a California rent-increase percentage scenario that you enter.",
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
    description: "Split rent and optional shared monthly costs between two people in proportion to each person’s entered monthly income.",
    eyebrow: "Rent split calculator",
    h1: "Split Rent Based on Income Calculator",
    lead: "Split visible rent and optional shared costs between two people in proportion to their entered incomes.",
    mode: "income",
    relatedLinks: splitLinks,
    faq: [
      { q: "What happens when one income is zero?", a: "If the other income is positive, the person with positive income receives 100% of the calculated shared cost. Both incomes cannot be zero." },
      { q: "Does this decide a fair or legally binding split?", a: "No. It calculates the proportions entered so the people involved can discuss and agree on them." },
    ],
  },
  "/rent-split-percentage-calculator": {
    path: "/rent-split-percentage-calculator",
    title: "Rent Split Percentage Calculator | Custom Shares",
    description: "Split rent and optional shared monthly costs between two people. Enter Person A’s percentage and Person B receives the remainder.",
    eyebrow: "Rent split calculator",
    h1: "Rent Split Percentage Calculator",
    lead: "Enter Person A’s share from 0% to 100%; Person B receives the remainder.",
    mode: "percentage",
    relatedLinks: splitLinks,
    faq: [
      { q: "Do I enter both percentages?", a: "No. Enter Person A’s percentage and the calculator assigns the remainder to Person B so the two percentages total 100%." },
      { q: "Do optional shared costs have to be included?", a: "No. They default to zero, so the initial result splits base rent only." },
    ],
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
    description: "Calculate a lease end date from a start date and a term of 1 to 120 calendar months, with explicit month-end handling.",
    eyebrow: "Lease date calculator",
    h1: "Lease Date Calculator",
    lead: "Calculate a lease end date from a start date and a whole-number term in calendar months.",
    mode: "lease",
    relatedLinks: dateLinks,
    faq: [
      { q: "How does the calculator handle month-end starts?", a: "It uses calendar months. If the original numbered day does not exist in the target month, the result uses that month’s final calendar day." },
      { q: "Can I calculate a 12-month lease?", a: "Yes. Enter 12 as the term in calendar months. Under this convention, a term starting June 1 ends May 31 the next year." },
      { q: "Does this determine the legal lease end date?", a: "No. It applies the stated calendar-month convention for planning. The written agreement and applicable local rules control the contractual date." },
    ],
  },
  "/rent-schedule-calculator": {
    path: "/rent-schedule-calculator",
    title: "Rent Schedule Calculator | Payment Dates and Totals",
    description: "Generate rent payment dates from a lease start, calendar-month term, rent amount, and monthly, weekly, biweekly, or 4-week frequency.",
    eyebrow: "Rent schedule calculator",
    h1: "Rent Schedule Calculator",
    lead: "Generate each rent payment date from the lease start, calendar-month term, rent amount, and selected frequency.",
    mode: "schedule",
    relatedLinks: dateLinks,
    faq: [
      { q: "How is the payment count calculated?", a: "The calculator generates each date individually and counts the displayed rows. It excludes dates on or after the calculated lease end." },
      { q: "Can I print the schedule?", a: "Yes. Use Print / Save PDF after the inputs are valid. The printed count and dates match the visible table." },
    ],
  },
};
