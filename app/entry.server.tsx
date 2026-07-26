import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  let renderFailed = false;
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error) {
        renderFailed = true;
        console.error(error);
      },
    },
  );

  await body.allReady;
  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    status: renderFailed ? 500 : responseStatusCode,
    headers: responseHeaders,
  });
}
