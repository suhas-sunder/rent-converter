import type { Route } from "./+types/350-per-week-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-converter");
}

export default function Route350PerWeekToMonthlyRentPage() {
  return null;
}
