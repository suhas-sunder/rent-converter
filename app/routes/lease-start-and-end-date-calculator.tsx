import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/lease-date-calculator");
}

export default function LeaseStartAndEndDateCalculatorRedirect() {
  return null;
}
