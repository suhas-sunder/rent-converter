import type { Route } from "./+types/250-per-week-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/weekly-to-monthly-rent-converter");
}

export default function Route250PerWeekToMonthlyRentPage() {
  return null;
}
