import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/rent-as-percentage-of-income-calculator");
}

export default function RentToIncomeRatioCalculatorRedirect() {
  return null;
}
