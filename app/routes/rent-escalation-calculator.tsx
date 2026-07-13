import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/compound-rent-increase-calculator");
}

export default function RentEscalationCalculatorRedirect() {
  return null;
}
