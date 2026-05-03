import { redirect } from "react-router";

export function loader() {
  return redirect("/pcm-rent-calculator", { status: 301 });
}

export default function PcmCalculatorRedirect() {
  return null;
}
