import type { Route } from "./+types/500-euros-per-week-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-converter");
}

export default function Route500EurosPerWeekToMonthlyRentPage() {
  return null;
}
