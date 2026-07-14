import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

import { calculateRequiredIncome } from "../app/client/utils/generatedIncome.js";

const redirects = {
  "/rent-to-income-ratio-calculator": "/rent-as-percentage-of-income-calculator",
  "/2x-rent-calculator": "/income-required-for-rent-calculator",
  "/2-5x-rent-calculator": "/income-required-for-rent-calculator",
  "/3x-rent-calculator": "/income-required-for-rent-calculator",
};

const retained = [
  "/rent-as-percentage-of-income-calculator",
  "/income-required-for-rent-calculator",
];

const deferred = [
  "/how-much-rent-can-i-afford-calculator",
  "/salary-to-rent-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",
  "/hourly-pay-to-rent-calculator",
  "/rent-budget-calculator",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split("export const redirectAliases")[0];
const configsSource = readFileSync("app/client/data/generatedRouteConfigs.ts", "utf8");
const generatedPagesSource = readFileSync("app/client/components/generated/GeneratedPages.tsx", "utf8");
const ratioSource = readFileSync("app/routes/rent-as-percentage-of-income-calculator.tsx", "utf8");
const requiredSource = readFileSync("app/routes/income-required-for-rent-calculator.tsx", "utf8");
const ratioHowSource = readFileSync("app/client/components/rent-as-percentage-of-income-calculator/HowItWorks.tsx", "utf8");
const requiredHowSource = readFileSync("app/client/components/income-required-for-rent-calculator/HowItWorks.tsx", "utf8");
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

test("four generated income variants remain registered as direct query-preserving 301 redirects", () => {
  assert.equal(Object.keys(redirects).length, 4);
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
    assert.doesNotMatch(moduleSource, /export const meta|buildMeta|IncomeToolPage|FAQ|schema|canonical|<h1/i, source);
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

test("no active app link points to a retired ratio or fixed-multiplier route", () => {
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

test("retained and deferred income routes remain canonical HTTP-200 destinations", () => {
  const canonicalDiscoverySource = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of [...retained, ...deferred]) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`), path);
    assert.match(canonicalDiscoverySource, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.doesNotMatch(routeModule(path), /permanentRedirectPreservingQuery/, path);
  }
  assert.match(ratioSource, /https:\/\/www\.rentconverter\.com\/rent-as-percentage-of-income-calculator/);
  assert.match(requiredSource, /const SITE_URL = "https:\/\/www\.rentconverter\.com"/);
  assert.match(requiredSource, /const PAGE_PATH = "\/income-required-for-rent-calculator"/);
});

test("retained ratio calculator normalizes independent periods before division", () => {
  assert.match(ratioSource, /value=\{rentPeriod\}/);
  assert.match(ratioSource, /value=\{incomePeriod\}/);
  assert.match(ratioSource, /convertScaled\([\s\S]*?rentPeriod,[\s\S]*?"annual"/);
  assert.match(ratioSource, /convertScaled\([\s\S]*?incomePeriod,[\s\S]*?"annual"/);
  assert.match(ratioSource, /percentFromRatio\(annualRent, annualIncome/);
  assert.match(ratioSource, /Income must be greater than 0/);
  assert.match(ratioSource, /\/\[a-z\]\/i\.test\(s0\)/);
  assert.match(ratioHowSource, /rent percentage = rent ÷ income × 100/);
  assert.match(ratioHowSource, /\$1,500 monthly rent ÷ \$5,000 monthly income × 100 = 30%/);
  assert.match(ratioHowSource, /higher percentage means more of the entered income/i);
  assert.match(ratioHowSource, /not a financial suitability decision/i);
  assert.match(ratioHowSource, /Gross income, take-home income, and after-tax estimates are different inputs/);
});

test("retained multiplier calculator keeps presets, custom input, and both calculation directions", () => {
  for (const value of ["2", "2.5", "3", "custom"]) {
    assert.match(requiredSource, new RegExp(`<option value="${escapeRegex(value)}">`), value);
  }
  assert.match(requiredSource, /Required monthly gross income/);
  assert.match(requiredSource, /mulScaledByScaled\(rentMonthlyScaled, m\)/);
  assert.match(requiredSource, /divScaledByScaled\(incomeMonthlyScaled, m\)/);
  assert.match(requiredSource, /Reverse mode: income to max rent/);
  assert.match(requiredSource, /\/\[a-z\]\/i\.test\(s0\)/);
  assert.match(requiredHowSource, /Required income = rent × selected multiplier/);
  assert.match(requiredHowSource, /Maximum rent = income ÷ selected multiplier/);
  assert.match(requiredHowSource, /\$1,500 monthly rent × 2 = \$3,000/);
  assert.match(requiredHowSource, /\$1,500 monthly rent × 2\.5 = \$3,750/);
  assert.match(requiredHowSource, /\$1,500 monthly rent × 3 = \$4,500/);
  assert.match(requiredHowSource, /does not determine application approval/);

  assert.deepEqual(calculateRequiredIncome(150_000n, 2), {
    monthlyRent: 150_000n,
    requiredMonthlyIncome: 300_000n,
    requiredAnnualIncome: 3_600_000n,
  });
  assert.equal(calculateRequiredIncome(150_000n, 2.5).requiredMonthlyIncome, 375_000n);
  assert.equal(calculateRequiredIncome(150_000n, 3).requiredMonthlyIncome, 450_000n);
  assert.equal(450_000n / 3n, 150_000n);
});

test("retired generated configs, helper branches, and renderer modes are removed", () => {
  for (const path of Object.keys(redirects)) {
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(path)}"`), path);
  }
  assert.doesNotMatch(generatedPagesSource, /RatioIncomeTool|MultiplierIncomeTool|"ratio"|"multiplier"/);
  for (const mode of ["salary", "hourly", "budget"]) {
    assert.match(generatedPagesSource, new RegExp(`"${escapeRegex(mode)}"`), mode);
  }
  assert.match(generatedPagesSource, /export function IncomeToolPage/);
});

test("visible FAQ content and FAQ schema remain sourced from the same retained arrays", () => {
  for (const source of [ratioSource, requiredSource]) {
    assert.equal((source.match(/"@type": "FAQPage"/g) ?? []).length, 1);
    assert.match(source, /mainEntity: faqData\.map/);
    assert.match(source, /faqData\.map\(\(f, i\)/);
  }
});

test("final route and XML sitemap counts reflect four canonical-to-redirect changes", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [...registrySource.matchAll(/\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g)].length;
  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(registered, 172);
  assert.equal(redirectCount, 112);
  assert.equal(registered - redirectCount, 60);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
  sitemapUrls.forEach((url) => assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/));
});
