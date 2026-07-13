import type { Route } from "./+types/450-per-week-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-converter");
}

export default function Route450PerWeekToMonthlyRentPage() {
  return null;
}
