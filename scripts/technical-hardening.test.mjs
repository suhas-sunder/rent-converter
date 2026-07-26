import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  assertStaticRedirect,
  assertStaticRedirectConfiguration,
} from "./static-route-test-helpers.mjs";

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
  assert.equal(registeredPaths.length, 60);
  assert.equal(new Set(registeredPaths).size, 60);
  assert.equal(aliases.length, 112);
  assert.equal(new Set(aliases.map(({ from }) => from)).size, 112);
  assert.equal(registeredPaths.length + aliases.length, 172);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);

  const renderablePaths = new Set(registeredPaths);
  const sourcePaths = new Set(aliases.map(({ from }) => from));
  for (const { from, to } of aliases) {
    assert.notEqual(from, to, `${from} must not redirect to itself`);
    assert.equal(sourcePaths.has(to), false, `${from} must point directly to an HTTP-200 destination`);
    assert.equal(renderablePaths.has(from), false, `${from} must not be a React Router page`);
    assert.equal(renderablePaths.has(to), true, `${to} must be a prerendered destination`);
    assert.equal(sitemapUrls.includes(`https://www.rentconverter.com${from}`), false, from);
    assertStaticRedirect(from, to);
  }
  for (const url of sitemapUrls) {
    assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/);
    assert.equal(renderablePaths.has(new URL(url).pathname), true);
  }

  assertStaticRedirectConfiguration();
  const redirectRouteSource = sourceFiles("app/routes").map((file) => read(file)).join("\n");
  assert.doesNotMatch(redirectRouteSource, /permanentRedirectPreservingQuery/);
  assert.doesNotMatch(
    redirectRouteSource,
    /export\s+(?:async\s+function|const)\s+(?:clientLoader|loader|clientAction|action|headers)\b/,
  );
  assert.equal(existsSync("app/utils/redirects.ts"), false);
});

test("static hosting emits no runtime server adapter or SPA fallback and keeps low-risk headers", () => {
  assert.equal(existsSync("public/_redirects"), true);
  assert.match(read("react-router.config.ts"), /ssr:\s*false/);
  assert.match(read("react-router.config.ts"), /prerender:\s*true/);
  assert.doesNotMatch(read("vite.config.ts"), /netlify|ssr:\s*\{/i);
  assert.equal(existsSync(".netlify/v1/functions/react-router-server.mjs"), false);
  assert.equal(existsSync("server.js"), false);
  assert.equal(existsSync("server/app.ts"), false);

  const root = read("app/root.tsx");
  assert.doesNotMatch(root, /canonicalDocumentPath|export (?:async )?function loader|export const loader/);

  for (const dependency of [
    "@netlify/vite-plugin-react-router",
    "@react-router/express",
    "@react-router/node",
    "compression",
    "express",
    "isbot",
    "morgan",
  ]) {
    assert.equal(packageJson.dependencies?.[dependency], undefined, dependency);
    assert.equal(packageJson.devDependencies?.[dependency], undefined, dependency);
  }

  const netlify = read("netlify.toml");
  assert.match(netlify, /command\s*=\s*"npm run build"/);
  assert.match(netlify, /publish\s*=\s*"build\/client"/);
  for (const header of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "X-Frame-Options",
  ]) {
    assert.match(netlify, new RegExp(header));
  }
  assert.match(netlify, /for = "\/assets\/\*"[\s\S]*max-age=31536000, immutable/);
  assert.doesNotMatch(netlify, /\/index\.html\s+200/);
  assert.doesNotMatch(netlify, /from\s*=\s*"\/\*"/);
  assert.match(read("public/404.html"), /<meta name="robots" content="noindex,follow"/);
  assert.doesNotMatch(read("public/_redirects"), /^\/\*\s+/m);
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
