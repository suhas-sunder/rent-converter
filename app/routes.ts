import { route, index, type RouteConfig } from "@react-router/dev/routes";

export default [
  // Home
  index("routes/home.tsx"),

  // Rent converter hub
  route("rent-converter", "routes/rent-converter.tsx"),

  // Frequency converters
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

  // Rent calculators
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

  // Affordability and income
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

  // Rent increases
  route("rent-increase-calculator", "routes/rent-increase-calculator.tsx"),
  route(
    "rent-increase-percentage-calculator",
    "routes/rent-increase-percentage-calculator.tsx",
  ),
  route(
    "rent-after-increase-calculator",
    "routes/rent-after-increase-calculator.tsx",
  ),

  // Rent vs buy
  route("rent-vs-buy-calculator", "routes/rent-vs-buy-calculator.tsx"),
] satisfies RouteConfig;
