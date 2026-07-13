import type { Route } from "./+types/60-pounds-per-night-to-monthly-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/daily-to-monthly-rent-converter");
}

export default function Route60PoundsPerNightToMonthlyRentPage() {
  return null;
}
