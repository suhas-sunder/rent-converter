import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-australia");
}

export default function AustraliaRentCalculatorRedirect() {
  return null;
}
