import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/split-rent-based-on-income-calculator");
}

export default function RentCalculatorSplitBasedOnIncomeRedirect() {
  return null;
}
