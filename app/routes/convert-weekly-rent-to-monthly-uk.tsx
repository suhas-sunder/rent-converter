import type { Route } from "./+types/convert-weekly-rent-to-monthly-uk";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function ConvertWeeklyRentToMonthlyUkRedirect() {
  return null;
}
