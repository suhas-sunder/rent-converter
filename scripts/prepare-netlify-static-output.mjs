import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmdirSync,
  unlinkSync,
} from "node:fs";
import path from "node:path";

const publishDirectory = path.resolve("build/client");
const routesSource = readFileSync("app/routes.ts", "utf8");
const routePaths = [...routesSource.matchAll(/\broute\("([^"]+)"/g)].map(
  (match) => match[1],
);

if (routePaths.length !== 59 || new Set(routePaths).size !== 59) {
  throw new Error(
    `Expected 59 unique non-root routes, found ${routePaths.length}.`,
  );
}

for (const routePath of routePaths) {
  const routeDirectory = path.resolve(publishDirectory, routePath);
  const source = path.resolve(routeDirectory, "index.html");
  const destination = path.resolve(publishDirectory, `${routePath}.html`);

  if (
    !routeDirectory.startsWith(`${publishDirectory}${path.sep}`) ||
    !source.startsWith(`${publishDirectory}${path.sep}`) ||
    !destination.startsWith(`${publishDirectory}${path.sep}`)
  ) {
    throw new Error(`Unsafe prerender output path for ${routePath}.`);
  }
  if (!existsSync(source)) {
    throw new Error(`Missing prerendered route document: ${source}`);
  }
  if (existsSync(destination)) {
    throw new Error(`Refusing to overwrite existing static document: ${destination}`);
  }

  renameSync(source, destination);
  const remaining = readdirSync(routeDirectory);
  if (remaining.length) {
    throw new Error(
      `Unexpected files remain in ${routeDirectory}: ${remaining.join(", ")}`,
    );
  }
  rmdirSync(routeDirectory);
}

const spaFallback = path.resolve(publishDirectory, "__spa-fallback.html");
if (existsSync(spaFallback)) {
  unlinkSync(spaFallback);
}

console.log(
  `Prepared ${routePaths.length + 1} flat canonical HTML documents for Netlify and removed the unused SPA fallback.`,
);
