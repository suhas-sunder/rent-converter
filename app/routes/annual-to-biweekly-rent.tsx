// app/routes/rent-calculator.tsx
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/annual-to-biweekly-rent-converter", { status: 301 });
};

export default function RentCalculatorRedirect() {
  return null;
}
