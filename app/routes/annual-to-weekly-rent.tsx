// app/routes/rent-calculator.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/annual-to-weekly-rent-converter");
}

export default function RentCalculatorRedirect() {
  return null;
}
