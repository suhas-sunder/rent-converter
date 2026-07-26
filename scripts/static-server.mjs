import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const publishDirectory = resolve(
  process.env.STATIC_PUBLISH_DIR ?? "build/client",
);
const redirectFile = resolve(publishDirectory, "_redirects");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".data": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function readRedirects() {
  if (!existsSync(redirectFile)) return new Map();
  const rules = readFileSync(redirectFile, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/));

  return new Map(
    rules
      .filter((parts) => parts.length >= 3 && parts[2] === "301")
      .map(([from, to]) => [from, to]),
  );
}

const redirects = readRedirects();

function safeFilePath(relativePath) {
  const absolute = resolve(publishDirectory, relativePath);
  const root = `${publishDirectory}${sep}`;
  return absolute === publishDirectory || absolute.startsWith(root)
    ? absolute
    : null;
}

function existingFile(relativePath) {
  const absolute = safeFilePath(relativePath);
  if (!absolute || !existsSync(absolute)) return null;
  return statSync(absolute).isFile() ? absolute : null;
}

function fileForPath(pathname) {
  if (pathname === "/") return existingFile("index.html");

  const relative = pathname.replace(/^\/+/, "");
  if (extname(relative)) return existingFile(relative);

  return (
    existingFile(`${relative}/index.html`) ??
    existingFile(`${relative}.html`)
  );
}

function applyHeaders(response, filePath) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.setHeader("X-Frame-Options", "SAMEORIGIN");
  response.setHeader(
    "Content-Type",
    contentTypes[extname(filePath).toLowerCase()] ??
      "application/octet-stream",
  );
  if (filePath.includes(`${sep}assets${sep}`)) {
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
}

function sendFile(request, response, filePath, status) {
  applyHeaders(response, filePath);
  response.statusCode = status;
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
}

export function createStaticServer() {
  return createServer((request, response) => {
    if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
      response.statusCode = 405;
      response.end("Method Not Allowed");
      return;
    }

    if (request.url.startsWith("//")) {
      const notFound = existingFile("404.html");
      if (notFound) {
        sendFile(request, response, notFound, 404);
      } else {
        response.statusCode = 404;
        response.end("Not Found");
      }
      return;
    }

    const url = new URL(request.url, "http://127.0.0.1");
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.statusCode = 400;
      response.end("Bad Request");
      return;
    }

    if (pathname.includes("//")) {
      const notFound = existingFile("404.html");
      if (notFound) {
        sendFile(request, response, notFound, 404);
      } else {
        response.statusCode = 404;
        response.end("Not Found");
      }
      return;
    }

    const redirectTarget = redirects.get(pathname);
    if (redirectTarget) {
      response.statusCode = 301;
      response.setHeader("Location", `${redirectTarget}${url.search}`);
      response.end();
      return;
    }

    if (pathname.length > 1 && pathname.endsWith("/")) {
      const withoutSlash = pathname.replace(/\/+$/, "");
      if (fileForPath(withoutSlash)) {
        response.statusCode = 301;
        response.setHeader("Location", `${withoutSlash}${url.search}`);
        response.end();
        return;
      }
    }

    const filePath = fileForPath(pathname);
    if (filePath) {
      sendFile(request, response, filePath, 200);
      return;
    }

    const notFound = existingFile("404.html");
    if (notFound) {
      sendFile(request, response, notFound, 404);
      return;
    }

    response.statusCode = 404;
    response.end("Not Found");
  });
}

const invokedDirectly =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  const host = process.env.HOST ?? "127.0.0.1";
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const server = createStaticServer();
  server.listen(port, host, () => {
    console.log(`Static preview serving ${publishDirectory} at http://${host}:${port}`);
  });
}
