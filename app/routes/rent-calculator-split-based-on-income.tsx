import { redirect } from "react-router";

export function loader() {
  return redirect("/split-rent-based-on-income-calculator", { status: 301 });
}

export default function RentCalculatorSplitBasedOnIncomeRedirect() {
  return null;
}
