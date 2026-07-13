import type { Route } from "./+types/weekly-to-monthly-rent-uk";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function WeeklyToMonthlyRentUkRedirect() {
  return null;
}
