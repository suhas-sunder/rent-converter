import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";

const publishDirectory = "build/client";
const errors = [];

const read = (file) => readFileSync(file, "utf8");

function applicationPaths() {
  const source = read("app/routes.ts");
  return [
    ...(source.includes('index("routes/home.tsx")') ? ["/"] : []),
    ...[...source.matchAll(/\broute\("([^"]+)"/g)].map(
      (match) => `/${match[1]}`,
    ),
  ];
}

function redirectRules() {
  return read("public/_redirects")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/));
}

function filesUnder(root) {
  if (!existsSync(root)) return [];
  const files = [];
  for (const entry of readdirSync(root)) {
    const full = path.join(root, entry);
    if (statSync(full).isDirectory()) files.push(...filesUnder(full));
    else files.push(full);
  }
  return files;
}

const routes = applicationPaths();
const rules = redirectRules();

if (routes.length !== 60 || new Set(routes).size !== 60) {
  errors.push(`Expected 60 unique renderable routes, found ${routes.length}.`);
}
if (rules.length !== 112 || rules.some((rule) => rule[2] !== "301")) {
  errors.push("Expected exactly 112 static HTTP-301 redirect rules.");
}
if (rules.some((rule) => rule[0] === "/*" || rule[2] === "200")) {
  errors.push("Static redirects must not contain a wildcard SPA rewrite.");
}

for (const route of routes) {
  const relative = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  const htmlPath = path.join(publishDirectory, relative);
  if (!existsSync(htmlPath)) {
    errors.push(`${route}: missing prerendered HTML at ${htmlPath}`);
    continue;
  }
  const html = read(htmlPath);
  const expectedCanonical = `https://www.rentconverter.com${route === "/" ? "" : route}`;
  if (!(html.match(/<title\b/gi) ?? []).length) {
    errors.push(`${route}: prerendered HTML has no title.`);
  }
  if (!(html.match(/<h1\b/gi) ?? []).length) {
    errors.push(`${route}: prerendered HTML has no H1.`);
  }
  if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    errors.push(`${route}: prerendered canonical does not match ${expectedCanonical}.`);
  }
}

for (const required of ["404.html", "_redirects", "index.html", "sitemap.xml"]) {
  if (!existsSync(path.join(publishDirectory, required))) {
    errors.push(`Missing static publish artifact: ${required}`);
  }
}

if (
  existsSync(path.join(publishDirectory, "404.html")) &&
  !/name="robots"\s+content="noindex,follow"/i.test(
    read(path.join(publishDirectory, "404.html")),
  )
) {
  errors.push("The static 404 page must be noindex,follow.");
}

if (existsSync("build/server")) {
  errors.push("build/server exists; the static deployment must not emit a runtime server bundle.");
}

const forbiddenArtifacts = filesUnder("build").filter((file) =>
  /(?:^|[\\/])(?:functions|edge-functions)(?:[\\/]|$)/i.test(file),
);
if (forbiddenArtifacts.length) {
  errors.push(`Serverless or edge artifacts were generated: ${forbiddenArtifacts.join(", ")}`);
}

if (errors.length) {
  console.error("Static build audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Static build audit passed: ${routes.length} prerendered pages, ${rules.length} redirects, a real 404 page, and no runtime server bundle.`,
);
