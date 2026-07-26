import fs from "node:fs";

const SITE_ORIGIN = "https://www.rentconverter.com";
const localOrigin = process.env.AUDIT_ORIGIN ?? "http://127.0.0.1:3000";
const utilityPagePaths = new Set([
  "/privacy-policy",
  "/terms-of-service",
  "/cookies",
  "/sitemap",
]);
const fail = [];
const warn = [];
const fetched = new Map();

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function localUrl(path) {
  return `${localOrigin}${path === "/" ? "" : path}`;
}

function htmlLocToPath(loc) {
  const url = new URL(loc);
  return normalizePath(url.pathname);
}

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1];
}

function visibleBreadcrumbNavCount(html) {
  const navs = html.match(/<nav\b[^>]*aria-label=["']Breadcrumb["'][^>]*>/gi) ?? [];
  return navs.filter((tag) => !/\bhidden\b/i.test(tag)).length;
}

function topVisibleBreadcrumb(html) {
  const firstH1 = html.search(/<h1\b/i);
  if (firstH1 < 0) return false;
  const navMatch = /<nav\b[^>]*aria-label=["']Breadcrumb["'][^>]*>/i.exec(html);
  if (!navMatch) return false;
  if (/\bhidden\b/i.test(navMatch[0])) return false;
  return navMatch.index < firstH1;
}

function extractJsonLd(html) {
  const scripts = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const schemas = [];
  for (const script of scripts) {
    const raw = decodeHtml(script[1].trim());
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else if (parsed) schemas.push(parsed);
    } catch (error) {
      fail.push(`Invalid JSON-LD could not be parsed: ${error.message}`);
    }
  }
  return schemas;
}

function schemaTypes(schemas) {
  return schemas.flatMap((schema) => {
    const type = schema?.["@type"];
    return Array.isArray(type) ? type : type ? [type] : [];
  });
}

function extractInternalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .map((href) => normalizePath(href.split("#")[0].split("?")[0]))
    .filter(Boolean);
}

function extractSocialImageUrls(html) {
  return [
    ...html.matchAll(
      /<meta\b[^>]*(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*>/gi,
    ),
  ]
    .map((match) => extractAttr(match[0], "content"))
    .filter(Boolean);
}

async function get(path, options = {}) {
  const key = `${options.redirect ?? "follow"}:${path}`;
  if (fetched.has(key)) return fetched.get(key);
  const response = await fetch(localUrl(path), options);
  const text = await response.text().catch(() => "");
  const result = { response, text };
  fetched.set(key, result);
  return result;
}

function readSitemapPaths() {
  const xml = fs.readFileSync("public/sitemap.xml", "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    htmlLocToPath(match[1]),
  );
}

function readRedirectAliases() {
  const registry = fs.readFileSync("app/client/data/routeRegistry.ts", "utf8");
  return [
    ...registry.matchAll(/\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g),
  ].map((match) => ({
    from: normalizePath(match[1]),
    to: normalizePath(match[2]),
  }));
}

function readRoutePaths() {
  const routes = fs.readFileSync("app/routes.ts", "utf8");
  const paths = [...routes.matchAll(/route\("([^"]+)"/g)].map((match) =>
    normalizePath(`/${match[1]}`),
  );
  if (/index\("routes\/home\.tsx"\)/.test(routes)) paths.unshift("/");
  return paths;
}

function expectSingle(path, label, count) {
  if (count !== 1) fail.push(`${path}: expected exactly one ${label}, found ${count}`);
}

async function auditPage(path) {
  const { response, text: html } = await get(path);
  if (response.status !== 200) {
    fail.push(`${path}: expected 200, got ${response.status}`);
    return [];
  }
  if (/The requested page could not be found|Oops!|An unexpected error occurred/i.test(html)) {
    fail.push(`${path}: page returned 200 with error-like content`);
  }

  expectSingle(path, "title", (html.match(/<title\b/gi) ?? []).length);

  const descriptions =
    html.match(/<meta\b[^>]*name=["']description["'][^>]*>/gi) ?? [];
  expectSingle(path, "meta description", descriptions.length);

  const canonicals = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi) ?? [];
  expectSingle(path, "canonical", canonicals.length);
  const canonicalHref = canonicals[0] ? extractAttr(canonicals[0], "href") : undefined;
  const expectedCanonical = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
  if (canonicalHref && canonicalHref !== expectedCanonical) {
    fail.push(`${path}: canonical ${canonicalHref} does not match ${expectedCanonical}`);
  }

  const robots = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/gi) ?? [];
  const robotsContent = robots.map((tag) => extractAttr(tag, "content") ?? "");
  const hasNoindex = robotsContent.some((content) => /(?:^|,)\s*noindex\s*(?:,|$)/i.test(content));
  if (hasNoindex) {
    fail.push(`${path}: indexable page unexpectedly has a noindex directive`);
  }

  expectSingle(path, "H1", (html.match(/<h1\b/gi) ?? []).length);

  const schemas = extractJsonLd(html);
  const types = schemaTypes(schemas);
  if (utilityPagePaths.has(path) && types.includes("WebApplication")) {
    fail.push(`${path}: utility/legal page must not emit WebApplication schema`);
  }
  const faqSchemaCount = types.filter((type) => type === "FAQPage").length;
  const breadcrumbSchemaCount = types.filter((type) => type === "BreadcrumbList").length;
  if (faqSchemaCount > 1) fail.push(`${path}: duplicate FAQPage schema (${faqSchemaCount})`);
  if (breadcrumbSchemaCount > 1) {
    fail.push(`${path}: duplicate BreadcrumbList schema (${breadcrumbSchemaCount})`);
  }

  const visibleFaqCount = (html.match(/Frequently Asked Questions/gi) ?? []).length;
  if (visibleFaqCount > 1) {
    fail.push(`${path}: duplicate visible FAQ headings (${visibleFaqCount})`);
  }
  if (faqSchemaCount && visibleFaqCount === 0) {
    fail.push(`${path}: FAQPage schema exists without a visible FAQ heading`);
  }

  const breadcrumbNavs = visibleBreadcrumbNavCount(html);
  if (breadcrumbNavs > 1) {
    fail.push(`${path}: duplicate visible breadcrumb UI (${breadcrumbNavs})`);
  }
  if (topVisibleBreadcrumb(html)) {
    fail.push(`${path}: visible breadcrumb appears before the H1`);
  }

  const fullDirectoryCount = (html.match(/id=["']all-tools["']/gi) ?? []).length;
  if (path !== "/" && fullDirectoryCount > 0) {
    fail.push(`${path}: full all-tools directory should not render outside the home page`);
  }

  for (const schema of schemas.filter((item) => item?.["@type"] === "BreadcrumbList")) {
    for (const item of schema.itemListElement ?? []) {
      if (item.item && !String(item.item).startsWith(SITE_ORIGIN)) {
        fail.push(`${path}: breadcrumb item is not absolute: ${item.item}`);
      }
    }
  }

  if (/<img\b[^>]*loading=["']lazy["'][^>]*class=["'][^"']*(h-\d+|w-\d+)/i.test(html)) {
    warn.push(`${path}: lazy image found; verify it is not the LCP asset`);
  }

  for (const imageUrl of extractSocialImageUrls(html)) {
    let parsed;
    try {
      parsed = new URL(imageUrl, SITE_ORIGIN);
    } catch {
      fail.push(`${path}: social image URL is invalid: ${imageUrl}`);
      continue;
    }

    if (parsed.origin !== SITE_ORIGIN) continue;

    const assetPath = normalizePath(parsed.pathname);
    const { response: assetResponse } = await get(assetPath);
    if (assetResponse.status !== 200) {
      fail.push(
        `${path}: social image ${assetPath} returned ${assetResponse.status}`,
      );
    }
  }

  return extractInternalLinks(html);
}

async function main() {
  const sitemapPaths = readSitemapPaths();
  const sitemapSet = new Set(sitemapPaths);
  const routePaths = readRoutePaths();
  const redirectAliases = readRedirectAliases();
  const redirectAliasSet = new Set(redirectAliases.map((entry) => entry.from));

  if (sitemapPaths.length !== sitemapSet.size) {
    fail.push("XML sitemap contains duplicate URLs");
  }

  const sitemapXml = fs.readFileSync("public/sitemap.xml", "utf8");
  for (const match of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    if (url.origin !== SITE_ORIGIN || url.protocol !== "https:") {
      fail.push(`XML sitemap URL is not on the canonical HTTPS www host: ${match[1]}`);
    }
  }

  for (const path of sitemapPaths) {
    if (!routePaths.includes(path)) {
      fail.push(`${path}: XML sitemap URL has no route`);
    }
  }

  for (const path of routePaths) {
    if (!sitemapSet.has(path) && !redirectAliasSet.has(path)) {
      warn.push(`${path}: route is not in XML sitemap or redirect alias registry`);
    }
  }

  const http200Paths = sitemapPaths;
  const stateSummary = {
    registered: routePaths.length + redirectAliases.length,
    renderableRoutes: routePaths.length,
    http200: http200Paths.length,
    indexableHttp200: sitemapPaths.length,
    noindexHttp200: 0,
    redirects: redirectAliases.length,
  };

  if (stateSummary.registered !== 172) fail.push(`expected 172 registered routes, found ${stateSummary.registered}`);
  if (stateSummary.renderableRoutes !== 60) fail.push(`expected 60 renderable application routes, found ${stateSummary.renderableRoutes}`);
  if (stateSummary.http200 !== 60) fail.push(`expected 60 HTTP-200 routes, found ${stateSummary.http200}`);
  if (stateSummary.indexableHttp200 !== 60) fail.push(`expected 60 indexable HTTP-200 routes, found ${stateSummary.indexableHttp200}`);
  if (stateSummary.noindexHttp200 !== 0) fail.push(`expected 0 noindex HTTP-200 routes, found ${stateSummary.noindexHttp200}`);
  if (stateSummary.redirects !== 112) fail.push(`expected 112 redirects, found ${stateSummary.redirects}`);
  if (stateSummary.registered !== stateSummary.http200 + stateSummary.redirects) {
    fail.push("registered route count does not equal HTTP-200 plus redirect states");
  }

  const links = new Set();
  for (const path of http200Paths) {
    const pageLinks = await auditPage(path);
    pageLinks.forEach((link) => links.add(link));
  }

  for (const link of links) {
    if (redirectAliasSet.has(link)) {
      fail.push(`${link}: active internal link points to a redirect source`);
    }
    const { response } = await get(link, { redirect: "manual" });
    if (response.status !== 200) {
      fail.push(`${link}: internal link must resolve directly with HTTP 200, got ${response.status}`);
    }
  }

  for (const alias of redirectAliases) {
    const { response } = await get(alias.from, { redirect: "manual" });
    if (![301, 308].includes(response.status)) {
      fail.push(`${alias.from}: expected permanent redirect to ${alias.to}, got ${response.status}`);
      continue;
    }
    const location = normalizePath(response.headers.get("location") ?? "");
    if (location !== alias.to) {
      fail.push(`${alias.from}: redirects to ${location || "(missing)"}, expected ${alias.to}`);
    }

    const query = "?ref=example&campaign=one";
    const { response: queryResponse } = await get(`${alias.from}${query}`, {
      redirect: "manual",
    });
    const queryLocation = queryResponse.headers.get("location");
    if (queryResponse.status !== 301 || !queryLocation) {
      fail.push(`${alias.from}: query-string redirect did not return HTTP 301`);
    } else {
      const parsedLocation = new URL(queryLocation, localOrigin);
      if (normalizePath(parsedLocation.pathname) !== alias.to || parsedLocation.search !== query) {
        fail.push(
          `${alias.from}: query-string redirect produced ${queryLocation}, expected ${alias.to}${query}`,
        );
      }
    }
  }

  const canonicalVariants = [
    {
      from: "/weekly-to-monthly-rent-converter/?ref=example",
      to: "/weekly-to-monthly-rent-converter?ref=example",
    },
  ];
  for (const variant of canonicalVariants) {
    const { response } = await get(variant.from, { redirect: "manual" });
    if (response.status !== 301 || response.headers.get("location") !== variant.to) {
      fail.push(
        `${variant.from}: expected canonical-path redirect to ${variant.to}, got ${response.status} ${response.headers.get("location") ?? ""}`,
      );
    }
  }

  const missingPath = "/__rentconverter_missing_route_audit__";
  const { response: missingResponse, text: missingHtml } = await get(missingPath, {
    redirect: "manual",
  });
  if (missingResponse.status !== 404) {
    fail.push(`${missingPath}: expected a real HTTP 404, got ${missingResponse.status}`);
  }
  if (!/Page not found|The requested page could not be found/i.test(missingHtml)) {
    fail.push(`${missingPath}: 404 response is missing the expected static message`);
  }

  console.log(
    `Audited ${stateSummary.http200} indexable HTTP-200 routes, ${stateSummary.redirects} redirects, and ${links.size} unique internal links.`,
  );
  if (warn.length) {
    console.log("\nWarnings:");
    warn.forEach((item) => console.log(`- ${item}`));
  }
  if (fail.length) {
    console.error("\nFailures:");
    fail.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log("Release audit passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
