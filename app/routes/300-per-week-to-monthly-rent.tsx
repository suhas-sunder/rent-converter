import type { Route } from "./+types/300-per-week-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-converter");
}

export default function Route300PerWeekToMonthlyRentPage() {
  return null;
}
