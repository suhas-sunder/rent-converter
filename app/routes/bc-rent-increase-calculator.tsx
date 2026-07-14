import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-increase-calculator");
}

export default function BcRentIncreaseCalculatorRedirect() {
  return null;
}
