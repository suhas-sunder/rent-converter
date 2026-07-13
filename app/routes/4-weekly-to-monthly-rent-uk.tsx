import type { Route } from "./+types/4-weekly-to-monthly-rent-uk";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/rent-paid-every-4-weeks-calculator");
}

export default function Route4WeeklyToMonthlyRentUkRedirect() {
  return null;
}
