import type { Route } from "./+types/per-calendar-month-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/what-does-pcm-mean-rent");
}

export default function PerCalendarMonthRentRedirect() {
  return null;
}
