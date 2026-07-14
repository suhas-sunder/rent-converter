import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-in-advance-australia");
}

export default function BondAndRentInAdvanceAustraliaRedirect() {
  return null;
}
