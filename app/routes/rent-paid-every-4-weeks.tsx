// app/routes/rent-calculator.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-paid-every-4-weeks-calculator");
}

export default function RentCalculatorRedirect() {
  return null;
}
