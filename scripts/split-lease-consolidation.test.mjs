import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

import { calculateEqualCentAllocation } from "../app/client/utils/generatedTools.js";
import { validSavedMoney } from "../app/client/utils/savedState.js";

const redirects = {
  "/roommate-rent-split-calculator": "/rent-split-calculator",
  "/lease-start-and-end-date-calculator": "/lease-date-calculator",
  "/12-month-lease-date-calculator": "/lease-date-calculator",
};

const retained = [
  "/rent-split-calculator",
  "/split-rent-based-on-income-calculator",
  "/rent-split-percentage-calculator",
  "/lease-date-calculator",
  "/rent-due-date-calculator",
  "/rent-schedule-calculator",
  "/prorated-rent-calculator",
  "/prorated-rent-calculator-australia",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split("export const redirectAliases")[0];
const configsSource = readFileSync("app/client/data/generatedRouteConfigs.ts", "utf8");
const generatedPagesSource = readFileSync("app/client/components/generated/GeneratedPages.tsx", "utf8");
const splitSource = readFileSync("app/routes/rent-split-calculator.tsx", "utf8");
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const redirectHelperSource = readFileSync("app/utils/redirects.ts", "utf8");

function escapeRegex(value) {
  return value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
}

function routeModule(path) {
  return readFileSync(`app/routes/${path.slice(1)}.tsx`, "utf8");
}

function allSourceFiles(root) {
  return readdirSync(root).flatMap((name) => {
    const path = `${root}/${name}`;
    return statSync(path).isDirectory() ? allSourceFiles(path) : [path];
  });
}

test("three duplicate routes remain registered as direct query-preserving 301 redirects", () => {
  assert.equal(Object.keys(redirects).length, 3);
  assert.match(redirectHelperSource, /new URL\(request\.url\)/);
  assert.match(redirectHelperSource, /requestUrl\.search/);
  assert.match(redirectHelperSource, /status:\s*301/);

  const redirectSources = new Set(Object.keys(redirects));
  for (const [source, target] of Object.entries(redirects)) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(source.slice(1))}"`), source);
    const moduleSource = routeModule(source);
    assert.match(moduleSource, /permanentRedirectPreservingQuery/);
    assert.match(
      moduleSource,
      new RegExp(`permanentRedirectPreservingQuery\\(request,\\s*"${escapeRegex(target)}"\\)`),
      source,
    );
    assert.doesNotMatch(moduleSource, /export const meta|buildMeta|ToolPage|FAQ|schema|canonical|<h1/i, source);
    assert.equal(redirectSources.has(target), false, `${source} must not chain`);
    assert.notEqual(source, target, `${source} must not loop`);
  }
});

test("registry and discovery data remove retired canonical destinations", () => {
  const discoverySources = [
    canonicalRegistrySource,
    configsSource,
    generatedPagesSource,
    readFileSync("app/routes/home.tsx", "utf8"),
    readFileSync("app/client/components/navigation/NavBar.tsx", "utf8"),
    readFileSync("app/client/components/navigation/AllRentalToolsLinks.tsx", "utf8"),
    readFileSync("app/routes/sitemap.tsx", "utf8"),
  ];

  for (const [source, target] of Object.entries(redirects)) {
    const registryMatches = registrySource.match(
      new RegExp(`\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(target)}"\\s*\\}`, "g"),
    );
    assert.equal(registryMatches?.length, 1, source);
    discoverySources.forEach((content) =>
      assert.doesNotMatch(content, new RegExp(`"${escapeRegex(source)}"`), source),
    );
    assert.doesNotMatch(sitemapSource, new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`), source);
  }
});

test("no active app link points to a retired split or lease route", () => {
  const intentional = new Set([
    "app/routes.ts",
    "app/client/data/routeRegistry.ts",
    ...Object.keys(redirects).map((source) => `app/routes/${source.slice(1)}.tsx`),
  ]);
  const activeFiles = allSourceFiles("app").filter(
    (path) => /\.(?:ts|tsx)$/.test(path) && !intentional.has(path),
  );

  for (const path of activeFiles) {
    const source = readFileSync(path, "utf8");
    for (const retired of Object.keys(redirects)) {
      assert.doesNotMatch(source, new RegExp(escapeRegex(retired)), `${path}: ${retired}`);
    }
  }
});

test("retained split, proration, and date tools stay canonical HTTP-200 routes", () => {
  const canonicalDiscoverySource = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of retained) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`), path);
    assert.match(canonicalDiscoverySource, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.doesNotMatch(routeModule(path), /permanentRedirectPreservingQuery/, path);
  }
  assert.match(splitSource, /https:\/\/www\.rentconverter\.com\/rent-split-calculator/);
  assert.match(configsSource, /path: "\/lease-date-calculator"/);
});

test("main equal split includes validated visible shared costs and safe saved state", () => {
  assert.match(splitSource, /useState<string>\("0"\)/);
  assert.match(splitSource, /id=\{sharedCostsId\}/);
  assert.match(splitSource, /Optional shared monthly costs/);
  assert.match(splitSource, /rc_rpp_shared_costs/);
  assert.match(splitSource, /validSavedMoney\([\s\S]*?rc_rpp_shared_costs[\s\S]*?allowZero:\s*true/);
  assert.match(splitSource, /parsedSharedCosts\.ok/);
  assert.match(splitSource, /annualSharedCostsScaled = sharedMonthlyScaled \* 12n/);
  assert.match(splitSource, /displayedTotalScaled/);
  assert.match(splitSource, /Cent-remainder allocation/);

  assert.equal(validSavedMoney("0", "Shared costs", { allowZero: true }), "0");
  for (const invalid of ["-1", "abc", "12abc", "1e2"]) {
    assert.equal(validSavedMoney(invalid, "Shared costs", { allowZero: true }), undefined, invalid);
  }
});

test("equal split allocation includes entered costs and reconciles to the displayed cent total", () => {
  const rentOnly = calculateEqualCentAllocation(240_000n, 3);
  const withCosts = calculateEqualCentAllocation(255_000n, 3);
  assert.equal(rentOnly.baseShare, 80_000n);
  assert.equal(withCosts.baseShare, 85_000n);

  const uneven = calculateEqualCentAllocation(240_001n, 3);
  assert.equal(uneven.remainderCount, 1);
  assert.equal(
    uneven.higherShare * BigInt(uneven.remainderCount) +
      uneven.baseShare * BigInt(uneven.baseShareCount),
    uneven.totalCents,
  );
});

test("retained split and lease content covers merged capability without unsupported workflows", () => {
  const splitHow = readFileSync("app/client/components/rent-split-calculator/HowItWorks.tsx", "utf8");
  assert.match(splitHow, /shared costs default to zero/i);
  assert.match(splitHow, /one cent more/);
  assert.match(splitHow, /not an objective determination of fairness/);
  assert.match(splitHow, /\/split-rent-based-on-income-calculator/);
  assert.match(splitHow, /\/rent-split-percentage-calculator/);
  assert.doesNotMatch(splitHow, /private bathroom|room-size|lease enforcement/i);

  assert.match(configsSource, /Term in calendar months|whole-number term in calendar months/);
  assert.match(configsSource, /Can I calculate a 12-month lease\?/);
  assert.match(configsSource, /starting June 1 ends May 31 the next year/);
  assert.match(generatedPagesSource, /starting 2025-06-01 ends 2026-05-31/);
  assert.match(generatedPagesSource, /clamped to that target month’s final day/);
  assert.match(generatedPagesSource, /written lease or agreement controls the contractual end date/);
  assert.doesNotMatch(configsSource, /reverse term|notice-date|possession-date|automatic renewal/i);
});

test("retired generated configs and renderer modes are removed", () => {
  for (const path of Object.keys(redirects)) {
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(path)}"`), path);
  }
  assert.doesNotMatch(generatedPagesSource, /EqualSplitTool|"roommate"|"lease-range"|"twelve-month"/);
});

test("visible FAQ content and FAQ schema remain sourced from the same retained arrays", () => {
  assert.equal((splitSource.match(/"@type": "FAQPage"/g) ?? []).length, 1);
  assert.match(splitSource, /mainEntity: faqData\.map/);
  assert.match(splitSource, /faqData\.map\(\(f, i\)/);
  assert.match(generatedPagesSource, /makePageSchemas\(\{ \.\.\.config, calculator: true, faq: config\.faq \}\)/);
  assert.match(generatedPagesSource, /<Faq items=\{config\.faq\} \/>/);
});

test("final route and XML sitemap counts reflect three canonical-to-redirect changes", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [...registrySource.matchAll(/\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g)].length;
  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(registered, 171);
  assert.equal(redirectCount, 105);
  assert.equal(registered - redirectCount, 66);
  assert.equal(sitemapUrls.length, 66);
  assert.equal(new Set(sitemapUrls).size, 66);
  sitemapUrls.forEach((url) => assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/));
});
