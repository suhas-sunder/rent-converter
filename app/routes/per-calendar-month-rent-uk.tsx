import type { Route } from "./+types/per-calendar-month-rent-uk";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/what-does-pcm-mean-rent");
}

export default function PerCalendarMonthRentUkRedirect() {
  return null;
}
