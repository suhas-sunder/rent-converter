import { route, index, type RouteConfig } from "@react-router/dev/routes";

export default [
  // Home
  index("routes/home.tsx"),

  // Rent converter hub
  route("rent-converter", "routes/rent-converter.tsx"),

  // Frequency converters (canonical)
  route(
    "monthly-to-weekly-rent-converter",
    "routes/monthly-to-weekly-rent-converter.tsx",
  ),
  route(
    "weekly-to-monthly-rent-converter",
    "routes/weekly-to-monthly-rent-converter.tsx",
  ),
  route(
    "weekly-to-annual-rent-converter",
    "routes/weekly-to-annual-rent-converter.tsx",
  ),
  route(
    "weekly-to-biweekly-rent-converter",
    "routes/weekly-to-biweekly-rent-converter.tsx",
  ),

  route(
    "biweekly-to-weekly-rent-converter",
    "routes/biweekly-to-weekly-rent-converter.tsx",
  ),
  route(
    "biweekly-to-monthly-rent-converter",
    "routes/biweekly-to-monthly-rent-converter.tsx",
  ),
  route(
    "biweekly-to-annual-rent-converter",
    "routes/biweekly-to-annual-rent-converter.tsx",
  ),

  route(
    "monthly-to-annual-rent-converter",
    "routes/monthly-to-annual-rent-converter.tsx",
  ),
  route(
    "annual-to-monthly-rent-converter",
    "routes/annual-to-monthly-rent-converter.tsx",
  ),

  route(
    "monthly-to-daily-rent-converter",
    "routes/monthly-to-daily-rent-converter.tsx",
  ),
  route(
    "daily-to-monthly-rent-converter",
    "routes/daily-to-monthly-rent-converter.tsx",
  ),

  route(
    "monthly-to-hourly-rent-converter",
    "routes/monthly-to-hourly-rent-converter.tsx",
  ),
  route(
    "hourly-to-monthly-rent-converter",
    "routes/hourly-to-monthly-rent-converter.tsx",
  ),

  route(
    "hourly-to-annual-rent-converter",
    "routes/hourly-to-annual-rent-converter.tsx",
  ),
  route(
    "annual-to-hourly-rent-converter",
    "routes/annual-to-hourly-rent-converter.tsx",
  ),

  route(
    "annual-to-weekly-rent-converter",
    "routes/annual-to-weekly-rent-converter.tsx",
  ),
  route(
    "annual-to-biweekly-rent-converter",
    "routes/annual-to-biweekly-rent-converter.tsx",
  ),
  route(
    "monthly-to-biweekly-rent-converter",
    "routes/monthly-to-biweekly-rent-converter.tsx",
  ),

  // Frequency converters (redirect aliases, no "-converter")
  route("monthly-to-weekly-rent", "routes/monthly-to-weekly-rent.tsx"),
  route("weekly-to-monthly-rent", "routes/weekly-to-monthly-rent.tsx"),
  route("weekly-to-annual-rent", "routes/weekly-to-annual-rent.tsx"),
  route("weekly-to-biweekly-rent", "routes/weekly-to-biweekly-rent.tsx"),

  route("biweekly-to-weekly-rent", "routes/biweekly-to-weekly-rent.tsx"),
  route("biweekly-to-monthly-rent", "routes/biweekly-to-monthly-rent.tsx"),
  route("biweekly-to-annual-rent", "routes/biweekly-to-annual-rent.tsx"),

  route("monthly-to-annual-rent", "routes/monthly-to-annual-rent.tsx"),
  route("annual-to-monthly-rent", "routes/annual-to-monthly-rent.tsx"),

  route("monthly-to-daily-rent", "routes/monthly-to-daily-rent.tsx"),
  route("daily-to-monthly-rent", "routes/daily-to-monthly-rent.tsx"),

  route("monthly-to-hourly-rent", "routes/monthly-to-hourly-rent.tsx"),
  route("hourly-to-monthly-rent", "routes/hourly-to-monthly-rent.tsx"),

  route("hourly-to-annual-rent", "routes/hourly-to-annual-rent.tsx"),
  route("annual-to-hourly-rent", "routes/annual-to-hourly-rent.tsx"),

  route("annual-to-weekly-rent", "routes/annual-to-weekly-rent.tsx"),
  route("annual-to-biweekly-rent", "routes/annual-to-biweekly-rent.tsx"),
  route("monthly-to-biweekly-rent", "routes/monthly-to-biweekly-rent.tsx"),

  // Rent calculators (canonical)
  route("rent-calculator", "routes/rent-calculator.tsx"),
  route("rent-per-day-calculator", "routes/rent-per-day-calculator.tsx"),
  route("rent-per-week-calculator", "routes/rent-per-week-calculator.tsx"),
  route(
    "rent-paid-every-4-weeks-calculator",
    "routes/rent-paid-every-4-weeks-calculator.tsx",
  ),
  route(
    "rent-per-paycheck-calculator",
    "routes/rent-per-paycheck-calculator.tsx",
  ),
  route("rent-split-calculator", "routes/rent-split-calculator.tsx"),
  route("rent-due-date-calculator", "routes/rent-due-date-calculator.tsx"),

  // Rent calculators (redirect aliases, no "-calculator")
  route("rent-per-day", "routes/rent-per-day.tsx"),
  route("rent-per-week", "routes/rent-per-week.tsx"),
  route("rent-paid-every-4-weeks", "routes/rent-paid-every-4-weeks.tsx"),
  route("rent-per-paycheck", "routes/rent-per-paycheck.tsx"),
  route("rent-split", "routes/rent-split.tsx"),
  route("rent-due-date", "routes/rent-due-date.tsx"),

  // Affordability and income (canonical)
  route(
    "rent-as-percentage-of-income-calculator",
    "routes/rent-as-percentage-of-income-calculator.tsx",
  ),
  route(
    "how-much-rent-can-i-afford-calculator",
    "routes/how-much-rent-can-i-afford-calculator.tsx",
  ),
  route(
    "rent-after-tax-income-calculator",
    "routes/rent-after-tax-income-calculator.tsx",
  ),
  route(
    "rent-vs-take-home-pay-calculator",
    "routes/rent-vs-take-home-pay-calculator.tsx",
  ),

  // Affordability and income (redirect aliases)
  route(
    "rent-as-percentage-of-income",
    "routes/rent-as-percentage-of-income.tsx",
  ),
  route("how-much-rent-can-i-afford", "routes/how-much-rent-can-i-afford.tsx"),
  route("rent-after-tax-income", "routes/rent-after-tax-income.tsx"),
  route("rent-vs-take-home-pay", "routes/rent-vs-take-home-pay.tsx"),

  // Rent increases (canonical)
  route("rent-increase-calculator", "routes/rent-increase-calculator.tsx"),
  route(
    "rent-increase-percentage-calculator",
    "routes/rent-increase-percentage-calculator.tsx",
  ),
  route(
    "rent-after-increase-calculator",
    "routes/rent-after-increase-calculator.tsx",
  ),

  route(
    "income-required-for-rent-calculator",
    "routes/income-required-for-rent-calculator.tsx",
  ),

  //Answer pages for specific queries
  route(
    "500-per-week-to-monthly-rent",
    "routes/500-per-week-to-monthly-rent.tsx",
  ),
  route("170-per-week-to-monthly-rent", "routes/170-per-week-to-monthly.tsx"),
  route("180-per-week-to-monthly-rent", "routes/180-per-week-to-monthly.tsx"),

  //International variants
  route("weekly-to-monthly-rent-uk", "routes/weekly-to-monthly-rent-uk.tsx"),
  route(
    "weekly-to-monthly-rent-australia",
    "routes/weekly-to-monthly-rent-australia.tsx",
  ),
  route("rent-per-paycheck-us", "routes/rent-per-paycheck-us.tsx"),
  route("rent-per-paycheck-canada", "routes/rent-per-paycheck-canada.tsx"),

  // Rent increases (redirect aliases)
  route("rent-increase", "routes/rent-increase.tsx"),
  route("rent-increase-percentage", "routes/rent-increase-percentage.tsx"),
  route("rent-after-increase", "routes/rent-after-increase.tsx"),

  // Rent vs buy (canonical)
  route("rent-vs-buy-calculator", "routes/rent-vs-buy-calculator.tsx"),

  // Rent vs buy (redirect alias)
  route("rent-vs-buy", "routes/rent-vs-buy.tsx"),

  // Legal / misc
  route("terms-of-service", "routes/terms-of-service.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("cookies", "routes/cookies.tsx"),
  route("contact", "routes/contact.tsx"),
  route("about", "routes/about.tsx"),
  route("sitemap", "routes/sitemap.tsx"),
] satisfies RouteConfig;
