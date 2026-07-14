import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (file) => readFileSync(file, "utf8");
const routesSource = read("app/routes.ts");
const registrySource = read("app/client/data/routeRegistry.ts");
const sitemapSource = read("public/sitemap.xml");
const packageJson = JSON.parse(read("package.json"));

const registeredPaths = [
  ...(routesSource.match(/\bindex\("routes\/home\.tsx"\)/g) ?? []).map(() => "/"),
  ...[...routesSource.matchAll(/\broute\("([^"]+)"/g)].map((match) => `/${match[1]}`),
];
const aliases = [...registrySource.matchAll(/\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g)]
  .map((match) => ({ from: match[1], to: match[2] }));
const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

function sourceFiles(root) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const full = path.join(root, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) files.push(...sourceFiles(full));
    else if (/\.(?:js|mjs|ts|tsx|css|html|xml|txt|toml)$/.test(entry)) files.push(full);
  }
  return files;
}

test("route, redirect, and sitemap invariants remain final", () => {
  assert.equal(registeredPaths.length, 172);
  assert.equal(new Set(registeredPaths).size, 172);
  assert.equal(aliases.length, 112);
  assert.equal(new Set(aliases.map(({ from }) => from)).size, 112);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);

  const sourcePaths = new Set(aliases.map(({ from }) => from));
  for (const { from, to } of aliases) {
    assert.notEqual(from, to, `${from} must not redirect to itself`);
    assert.equal(sourcePaths.has(to), false, `${from} must point directly to an HTTP-200 destination`);
    assert.equal(sitemapUrls.includes(`https://www.rentconverter.com${from}`), false, from);
  }
  for (const url of sitemapUrls) {
    assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/);
  }

  const redirectRouteSource = sourceFiles("app/routes").map((file) => read(file)).join("\n");
  assert.equal(
    (redirectRouteSource.match(/return permanentRedirectPreservingQuery/g) ?? []).length,
    112,
    "every redirect route must use the shared query-preserving helper",
  );
  assert.doesNotMatch(redirectRouteSource, /\b(?:throw|return)\s+redirect\(/);
});

test("SSR hosting has no obsolete SPA fallback and keeps low-risk headers", () => {
  assert.equal(existsSync("public/_redirects"), false);
  assert.match(read("react-router.config.ts"), /ssr:\s*true/);
  assert.match(read("vite.config.ts"), /netlifyPlugin\(\)/);
  assert.match(read(".netlify/v1/functions/react-router-server.mjs"), /path:\s*"\/\*"/);
  assert.match(read("app/root.tsx"), /canonicalDocumentPath/);

  const netlify = read("netlify.toml");
  const server = read("server.js");
  for (const header of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "X-Frame-Options",
  ]) {
    assert.match(netlify, new RegExp(header));
    assert.match(server, new RegExp(header));
  }
  assert.match(netlify, /for = "\/assets\/\*"[\s\S]*max-age=31536000, immutable/);
  assert.match(server, /express\.static\("build\/client\/assets", \{ immutable: true, maxAge: "1y" \}\)/);
  assert.doesNotMatch(netlify, /\/index\.html\s+200/);
});

test("source and public assets contain no local filesystem path or live ad provider", () => {
  const files = [...sourceFiles("app"), ...sourceFiles("public")];
  const combined = files.map((file) => read(file)).join("\n");
  assert.doesNotMatch(combined, /[A-Za-z]:\\(?:Users|PROJECTS-and-WORK)\\/i);
  assert.doesNotMatch(combined, /file:\/\/\/(?:Users|home)\//i);
  assert.doesNotMatch(combined, /googlesyndication|pagead2|adsbygoogle|doubleclick\.net/i);
  assert.doesNotMatch(
    combined,
    /"@type"\s*:\s*"(?:Review|Rating|AggregateRating|Product|Offer)"/,
  );
  assert.equal(existsSync("app/client/assets/images/suhas.jpg"), true);
  assert.match(routesSource, /route\("methodology", "routes\/methodology\.tsx"\)/);
});

test("robots, ads, audit, and permanent test registration remain coherent", () => {
  const robots = read("public/robots.txt");
  assert.match(robots, /Sitemap:\s*https:\/\/www\.rentconverter\.com\/sitemap\.xml/);
  const generalRobots = robots.split(/User-agent:\s*\*/i)[1]?.split(/\r?\nUser-agent:/i)[0] ?? "";
  for (const url of sitemapUrls) {
    const routePath = new URL(url).pathname;
    assert.doesNotMatch(generalRobots, new RegExp(`Disallow:\\s*${routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`));
  }

  const ads = read("public/ads.txt").trim();
  assert.match(ads, /^[^,\s]+,\s*[^,\s]+,\s*(?:DIRECT|RESELLER),\s*[a-f0-9]+$/i);
  assert.match(read("scripts/release-audit.mjs"), /__rentconverter_missing_route_audit__/);

  const testFiles = readdirSync("scripts").filter((name) => name.endsWith(".test.mjs"));
  for (const testFile of testFiles) {
    const reference = `scripts/${testFile}`;
    const occurrences = packageJson.scripts.test.split(reference).length - 1;
    assert.equal(occurrences, 1, `${reference} must run exactly once in npm test`);
  }
});
