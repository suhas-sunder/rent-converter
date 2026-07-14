import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function PerWeekToPcmRedirect() {
  return null;
}
