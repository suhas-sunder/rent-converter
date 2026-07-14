// app/routes/rent-calculator.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-due-date-calculator");
}

export default function RentCalculatorRedirect() {
  return null;
}
