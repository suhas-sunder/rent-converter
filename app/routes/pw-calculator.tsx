import { redirect } from "react-router";

export function loader() {
  return redirect("/pw-rent-calculator", { status: 301 });
}

export default function PwCalculatorRedirect() {
  return null;
}
