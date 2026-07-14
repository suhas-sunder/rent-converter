// app/routes/rent-calculator.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/how-much-rent-can-i-afford-calculator");
}

export default function RentCalculatorRedirect() {
  return null;
}
