import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";
import {
  assertKnownRouteStateCounts,
  assertStaticRedirect,
  assertStaticRedirectConfiguration,
} from "./static-route-test-helpers.mjs";

const redirects = {
  "/australia-rent-calculator": "/weekly-to-monthly-rent-australia",
  "/weekly-to-monthly-rent-melbourne": "/weekly-to-monthly-rent-australia",
  "/weekly-to-monthly-rent-sydney": "/weekly-to-monthly-rent-australia",
  "/rent-per-paycheck-us": "/rent-per-paycheck-calculator",
  "/rent-per-paycheck-canada": "/rent-per-paycheck-calculator",
};

const retained = [
  "/weekly-to-monthly-rent-australia",
  "/rent-per-paycheck-calculator",
];

const genuineAustraliaRoutes = [
  "/fortnightly-to-monthly-rent-australia",
  "/weekly-to-fortnightly-rent-australia",
  "/prorated-rent-calculator-australia",
  "/rent-in-advance-australia",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split(
  "export const redirectAliases",
)[0];
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const configsSource = readFileSync(
  "app/client/data/generatedRouteConfigs.ts",
  "utf8",
);
const generatedPagesSource = readFileSync(
  "app/client/components/generated/GeneratedPages.tsx",
  "utf8",
);
const homeSource = readFileSync("app/routes/home.tsx", "utf8");
const navSource = readFileSync(
  "app/client/components/navigation/NavBar.tsx",
  "utf8",
);
const directorySource = readFileSync(
  "app/client/components/navigation/AllRentalToolsLinks.tsx",
  "utf8",
);
const htmlSitemapSource = readFileSync("app/routes/sitemap.tsx", "utf8");

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

test("five country and city clones are static direct query-preserving 301 redirects", () => {
  assert.equal(Object.keys(redirects).length, 5);
  const retiredSources = new Set(Object.keys(redirects));

  assertStaticRedirectConfiguration();

  for (const [source, target] of Object.entries(redirects)) {
    assert.doesNotMatch(routesSource, new RegExp(`route\\("${escapeRegex(source.slice(1))}"`), source);
    assertStaticRedirect(source, target);

    const registryMatches = registrySource.match(
      new RegExp(
        `\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(target)}"\\s*\\}`,
        "g",
      ),
    );
    assert.equal(registryMatches?.length, 1, source);
    assert.equal(retiredSources.has(target), false, `${source} must not chain`);
    assert.notEqual(source, target, `${source} must not loop`);
  }
});

test("retired routes are absent from canonical discovery and rendered navigation data", () => {
  const discoverySources = [
    canonicalRegistrySource,
    configsSource,
    generatedPagesSource,
    homeSource,
    navSource,
    directorySource,
    htmlSitemapSource,
  ];

  for (const source of Object.keys(redirects)) {
    const pattern = new RegExp(`"${escapeRegex(source)}"`);
    discoverySources.forEach((content) => assert.doesNotMatch(content, pattern, source));
    assert.doesNotMatch(
      sitemapSource,
      new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`),
      source,
    );
  }

  assert.doesNotMatch(configsSource, /Melbourne rent calculator|Sydney rent calculator/);
  assert.doesNotMatch(generatedPagesSource, /config\.path\.includes\("melbourne"\)|config\.path\.includes\("sydney"\)/);
});

test("no active app link points to a retired route", () => {
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

test("retained calculators and genuine Australia routes remain canonical HTTP-200 routes", () => {
  const canonicalDiscoverySource = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of [...retained, ...genuineAustraliaRoutes]) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`), path);
    assert.match(canonicalDiscoverySource, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.doesNotMatch(routeModule(path), /permanentRedirectPreservingQuery/, path);
  }

  const australiaSource = routeModule("/weekly-to-monthly-rent-australia");
  const paycheckSource = routeModule("/rent-per-paycheck-calculator");
  assert.match(
    australiaSource,
    /https:\/\/www\.rentconverter\.com\/weekly-to-monthly-rent-australia/,
  );
  assert.match(
    paycheckSource,
    /https:\/\/www\.rentconverter\.com\/rent-per-paycheck-calculator/,
  );
});

test("retained content covers merged formulas, currencies, scope, and exclusions", () => {
  const australiaSource = routeModule("/weekly-to-monthly-rent-australia");
  const australiaFaq = readFileSync(
    "app/client/components/weekly-to-monthly-rent-australia/FAQ.tsx",
    "utf8",
  );
  const paycheckSource = routeModule("/rent-per-paycheck-calculator");

  assert.match(australiaSource, /weekly rent ×/);
  assert.match(australiaSource, /365 ÷ 7 ÷ 12/);
  assert.match(australiaSource, /AUD is selected by default/);
  assert.match(australiaFaq, /same across Australian cities/);
  assert.match(australiaFaq, /market rent data/);
  assert.match(australiaFaq, /bond requirements/);
  assert.match(australiaFaq, /rent-increase limits/);

  assert.match(paycheckSource, /selected period/);
  assert.match(paycheckSource, /USD and CAD are both supported/);
  assert.match(paycheckSource, /weekly = 52/);
  assert.match(paycheckSource, /biweekly = 26/);
  assert.match(paycheckSource, /semimonthly = 24/);
  assert.match(paycheckSource, /monthly = 12/);
  assert.match(paycheckSource, /payroll deductions/);
  assert.match(paycheckSource, /tax withholding/);
  assert.match(paycheckSource, /paycheck dates/);
  assert.match(paycheckSource, /legal affordability/);
});

test("visible FAQs and FAQ schema share one data array on each retained route", () => {
  const australiaRoute = routeModule("/weekly-to-monthly-rent-australia");
  const australiaFaq = readFileSync(
    "app/client/components/weekly-to-monthly-rent-australia/FAQ.tsx",
    "utf8",
  );
  const paycheckSource = routeModule("/rent-per-paycheck-calculator");

  assert.doesNotMatch(australiaRoute, /"@type": "FAQPage"/);
  assert.equal((australiaFaq.match(/"@type": "FAQPage"/g) ?? []).length, 1);
  assert.match(australiaFaq, /mainEntity: faqData\.map/);
  assert.match(australiaFaq, /faqData\.map\(\(f, i\)/);

  assert.equal((paycheckSource.match(/"@type": "FAQPage"/g) ?? []).length, 1);
  assert.match(paycheckSource, /mainEntity: faqData\.map/);
  assert.match(paycheckSource, /faqData\.map\(\(f, i\)/);
});

test("clone-only paycheck components were removed", () => {
  for (const country of ["us", "canada"]) {
    for (const component of ["FAQ.tsx", "HowItWorks.tsx", "ToolFit.tsx"]) {
      assert.equal(
        existsSync(`app/client/components/rent-per-paycheck-${country}/${component}`),
        false,
        `${country} ${component}`,
      );
    }
  }
});

test("final route and XML sitemap counts reflect five canonical-to-redirect changes", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [
    ...registrySource.matchAll(
      /\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g,
    ),
  ].length;
  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );

  assert.equal(registered, 60);
  assert.equal(redirectCount, 112);
  assertKnownRouteStateCounts(routesSource, registrySource);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
  sitemapUrls.forEach((url) =>
    assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/),
  );
});
