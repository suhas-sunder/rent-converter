import type { Route } from "./+types/190-pounds-per-week-to-pcm";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function Route190PoundsPerWeekToPcmPage() {
  return null;
}
