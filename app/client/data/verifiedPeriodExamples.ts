import { fourWeekToMonthlyCents, weeklyToAnnualCents, weeklyToMonthlyCents, monthlyToWeeklyCents, fortnightlyToMonthlyCents } from "~/client/utils/rentMath";

// These are comparison amounts, not counts of bills due in a calendar year.
// Keep the input, formula and visible example together; the regression suite
// also checks the independent formulas in the existing route calculators.
export const verifiedPeriodExamples = [
  { id: "weekly-monthly", input: 50000n, result: weeklyToMonthlyCents(50000n), expected: 217262n, route: "/weekly-to-monthly-rent-converter" },
  { id: "weekly-annual", input: 50000n, result: weeklyToAnnualCents(50000n), expected: 2607143n, route: "/weekly-to-annual-rent-converter" },
  { id: "monthly-weekly", input: 200000n, result: monthlyToWeeklyCents(200000n), expected: 46027n, route: "/monthly-to-weekly-rent-converter" },
  { id: "fortnight-monthly", input: 100000n, result: fortnightlyToMonthlyCents(100000n), expected: 217262n, route: "/fortnightly-to-monthly-rent-australia" },
  { id: "four-week-monthly", input: 200000n, result: fourWeekToMonthlyCents(200000n), expected: 217262n, route: "/rent-paid-every-4-weeks-calculator" },
] as const;

export const fourWeekExample = {
  payment: 200000n,
  monthly: fourWeekToMonthlyCents(200000n),
  annual: weeklyToAnnualCents(50000n),
  thirteenPayments: 200000n * 13n,
  daysCovered: 28 * 13,
};
