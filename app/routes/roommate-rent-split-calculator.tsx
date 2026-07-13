import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-split-calculator");
}

export default function RoommateRentSplitCalculatorRedirect() {
  return null;
}
