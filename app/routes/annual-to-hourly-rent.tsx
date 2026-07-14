// app/routes/rent-calculator.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/annual-to-hourly-rent-converter");
}

export default function RentCalculatorRedirect() {
  return null;
}
