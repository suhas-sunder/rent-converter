import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/income-required-for-rent-calculator");
}

export default function Route2xRentCalculatorRedirect() {
  return null;
}
