import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-per-paycheck-calculator");
}

export default function RentPerPaycheckUSRedirect() {
  return null;
}
