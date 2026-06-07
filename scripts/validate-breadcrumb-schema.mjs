import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";

const SITE_URL = "https://www.rentconverter.com";
const LOCAL_HOST = "127.0.0.1";

function readText(path) {
  return readFileSync(path, "utf8");
}

function unique(values) {
  return Array.from(new Set(values));
}

function routePathsFromRoutesFile() {
  const source = readText("app/routes.ts");
  return [
    "/",
    ...Array.from(source.matchAll(/route\("([^"]+)"/g), (match) => `/${match[1]}`),
  ];
}

function routePathsFromSitemap() {
  try {
    const source = readText("public/sitemap.xml");
    return Array.from(
      source.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g),
      (match) => match[1] || "/",
    );
  } catch {
    return [];
  }
}

function getRoutePaths() {
  return unique([...routePathsFromRoutesFile(), ...routePathsFromSitemap()]).sort((a, b) =>
    a.localeCompare(b),
  );
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, LOCAL_HOST, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not allocate a local port.")));
        return;
      }
      const { port } = address;
      server.close(() => resolve(port));
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, processRef) {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    if (processRef.exitCode !== null) {
      throw new Error(`Production server exited early with code ${processRef.exitCode}.`);
    }
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      await wait(250);
    }
  }
  throw new Error(`Timed out waiting for ${baseUrl}.`);
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function extractJsonLdScripts(html) {
  const scripts = [];
  const pattern =
    /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    scripts.push(decodeHtmlEntities(match[1].trim()));
  }
  return scripts;
}

function canonicalFromHtml(html, path) {
  const canonicalMatch =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);

  return canonicalMatch
    ? decodeHtmlEntities(canonicalMatch[1])
    : `${SITE_URL}${path === "/" ? "" : path}`;
}

function robotsFromHtml(html) {
  const robotsMatch = html.match(
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
  );
  return robotsMatch ? decodeHtmlEntities(robotsMatch[1]).toLowerCase() : "";
}

function typeIncludes(schema, typeName) {
  const type = schema?.["@type"];
  if (Array.isArray(type)) return type.includes(typeName);
  return type === typeName;
}

function excerpt(value) {
  const text = JSON.stringify(value);
  return text.length > 500 ? `${text.slice(0, 500)}...` : text;
}

function collectBreadcrumbLists(value, location = "direct") {
  const found = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      found.push(...collectBreadcrumbLists(item, `array item ${index}`));
    });
    return found;
  }

  if (!value || typeof value !== "object") return found;

  if (typeIncludes(value, "BreadcrumbList")) {
    found.push({ schema: value, location });
  }

  if (Array.isArray(value["@graph"])) {
    value["@graph"].forEach((item, index) => {
      found.push(...collectBreadcrumbLists(item, `@graph item ${index}`));
    });
  }

  return found;
}

function isAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateBreadcrumbList(schema, canonicalUrl) {
  const failures = [];

  if (schema["@context"] !== "https://schema.org") {
    failures.push('"@context" is missing or not https://schema.org');
  }

  if (!Array.isArray(schema.itemListElement)) {
    failures.push('"itemListElement" is missing, null, malformed, or not an array');
    return failures;
  }

  if (schema.itemListElement.length === 0) {
    failures.push('"itemListElement" is an empty array');
    return failures;
  }

  const positions = new Set();
  schema.itemListElement.forEach((item, index) => {
    const label = `itemListElement[${index}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      failures.push(`${label} is not an object`);
      return;
    }
    if (item["@type"] !== "ListItem") {
      failures.push(`${label} is missing "@type": "ListItem"`);
    }
    if (!Number.isInteger(item.position)) {
      failures.push(`${label} is missing an integer "position"`);
    } else {
      if (positions.has(item.position)) {
        failures.push(`${label} duplicates position ${item.position}`);
      }
      positions.add(item.position);
      if (item.position !== index + 1) {
        failures.push(`${label} position should be ${index + 1}`);
      }
    }
    if (typeof item.name !== "string" || item.name.trim() === "") {
      failures.push(`${label} is missing a non-empty string "name"`);
    }
    if (typeof item.item !== "string" || item.item.trim() === "") {
      failures.push(`${label} is missing a non-empty string "item"`);
    } else if (!isAbsoluteUrl(item.item)) {
      failures.push(`${label} item URL is not absolute`);
    }
    if (item.item === `${SITE_URL}/`) {
      failures.push(`${label} uses trailing slash homepage URL`);
    }
  });

  const first = schema.itemListElement[0];
  if (first?.name !== "Home") {
    failures.push('first breadcrumb item name is not "Home"');
  }
  if (first?.item !== SITE_URL) {
    failures.push(`first breadcrumb item is not ${SITE_URL}`);
  }

  const last = schema.itemListElement[schema.itemListElement.length - 1];
  if (last?.item !== canonicalUrl) {
    failures.push(`last breadcrumb item does not match canonical URL ${canonicalUrl}`);
  }

  return failures;
}

async function validateRoute(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });

  if (response.status >= 300 && response.status < 400) {
    return {
      path,
      status: response.status,
      redirected: true,
      scriptsParsed: 0,
      breadcrumbsFound: 0,
      invalidBreadcrumbsFound: 0,
      failures: [],
    };
  }

  const html = await response.text();
  const scripts = extractJsonLdScripts(html);
  const canonicalUrl = canonicalFromHtml(html, path);
  const robots = robotsFromHtml(html);
  const indexable = response.status === 200 && !robots.includes("noindex");
  const failures = [];
  let breadcrumbsFound = 0;
  let invalidBreadcrumbsFound = 0;

  scripts.forEach((scriptText, scriptIndex) => {
    let parsed;
    try {
      parsed = JSON.parse(scriptText);
    } catch (error) {
      failures.push({
        path,
        scriptIndex,
        location: "script root",
        reason: `JSON-LD is not valid JSON: ${error.message}`,
        excerpt: scriptText.slice(0, 500),
      });
      return;
    }

    const breadcrumbs = collectBreadcrumbLists(parsed);
    breadcrumbsFound += breadcrumbs.length;

    breadcrumbs.forEach(({ schema, location }) => {
      const schemaFailures = validateBreadcrumbList(schema, canonicalUrl);
      if (schemaFailures.length > 0) invalidBreadcrumbsFound += 1;
      schemaFailures.forEach((reason) => {
        failures.push({
          path,
          scriptIndex,
          location,
          reason,
          excerpt: excerpt(schema),
        });
      });
    });
  });

  if (path === "/" && breadcrumbsFound > 0) {
    failures.push({
      path,
      scriptIndex: null,
      location: "page",
      reason: "homepage should not render BreadcrumbList schema",
      excerpt: "",
    });
  }

  if (path !== "/" && indexable && breadcrumbsFound !== 1) {
    failures.push({
      path,
      scriptIndex: null,
      location: "page",
      reason: `indexable non-home 200 page should render exactly one BreadcrumbList, found ${breadcrumbsFound}`,
      excerpt: "",
    });
  }

  return {
    path,
    status: response.status,
    redirected: false,
    indexable,
    scriptsParsed: scripts.length,
    breadcrumbsFound,
    invalidBreadcrumbsFound,
    failures,
  };
}

async function main() {
  const paths = getRoutePaths();
  const port = await getFreePort();
  const baseUrl = `http://${LOCAL_HOST}:${port}`;
  const server = spawn("node", ["server.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let stdout = "";
  let stderr = "";
  server.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, server);

    const results = [];
    for (const path of paths) {
      results.push(await validateRoute(baseUrl, path));
    }

    const failures = results.flatMap((result) => result.failures);
    const summary = {
      routeEntriesChecked: results.length,
      rendered200RoutesChecked: results.filter((result) => result.status === 200).length,
      redirectsSkipped: results.filter((result) => result.redirected).length,
      jsonLdScriptsParsed: results.reduce((sum, result) => sum + result.scriptsParsed, 0),
      breadcrumbListObjectsFound: results.reduce(
        (sum, result) => sum + result.breadcrumbsFound,
        0,
      ),
      invalidBreadcrumbListObjectsFound: results.reduce(
        (sum, result) => sum + result.invalidBreadcrumbsFound,
        0,
      ),
      totalFailures: failures.length,
    };

    console.log(JSON.stringify({ summary, failures }, null, 2));

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          serverStdout: stdout,
          serverStderr: stderr,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

await main();
