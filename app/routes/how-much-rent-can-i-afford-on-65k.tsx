import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/salary-to-rent-calculator");
}

export default function HowMuchRentCanIAffordOn65kRedirect() {
  return null;
}
