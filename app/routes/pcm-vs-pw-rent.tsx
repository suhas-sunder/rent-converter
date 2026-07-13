import type { Route } from "./+types/pcm-vs-pw-rent";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/what-does-pcm-mean-rent");
}

export default function PcmVsPwRentRedirect() {
  return null;
}
