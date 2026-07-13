import { redirect } from "react-router";

/** Return a permanent server redirect while retaining the request query string. */
export function permanentRedirectPreservingQuery(request: Request, targetPath: string) {
  const requestUrl = new URL(request.url);
  return redirect(`${targetPath}${requestUrl.search}`, { status: 301 });
}
