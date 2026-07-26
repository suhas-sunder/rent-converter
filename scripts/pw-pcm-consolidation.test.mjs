import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  assertKnownRouteStateCounts,
  assertStaticRedirect,
  assertStaticRedirectConfiguration,
} from "./static-route-test-helpers.mjs";

const redirects = {
  "/pcm-rent-calculator": "/pw-to-pcm-calculator",
  "/weekly-to-monthly-rent-uk": "/pw-to-pcm-calculator",
  "/convert-weekly-rent-to-monthly-uk": "/pw-to-pcm-calculator",
  "/weekly-to-monthly-rent-formula-uk": "/pw-to-pcm-calculator",
  "/pw-rent-calculator": "/pcm-to-pw-calculator",
  "/4-weekly-to-monthly-rent-uk": "/rent-paid-every-4-weeks-calculator",
  "/pcm-vs-pw-rent": "/what-does-pcm-mean-rent",
  "/per-calendar-month-rent": "/what-does-pcm-mean-rent",
  "/per-calendar-month-rent-uk": "/what-does-pcm-mean-rent",
};

const retargetedAliases = {
  "/pcm-calculator": "/pw-to-pcm-calculator",
  "/rent-pcm-calculator": "/pw-to-pcm-calculator",
  "/pw-calculator": "/pcm-to-pw-calculator",
};

const retained = [
  "/pw-to-pcm-calculator",
  "/pcm-to-pw-calculator",
  "/what-does-pcm-mean-rent",
  "/what-does-pw-mean-rent",
  "/rent-paid-every-4-weeks-calculator",
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
const fourWeekSource = readFileSync(
  "app/routes/rent-paid-every-4-weeks-calculator.tsx",
  "utf8",
);

function escapeRegex(value) {
  return value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
}

test("nine historical PW and PCM routes are direct query-preserving redirects", () => {
  assert.equal(Object.keys(redirects).length, 9);
  assertStaticRedirectConfiguration();

  for (const [source, target] of Object.entries(redirects)) {
    const slug = source.slice(1);
    assert.doesNotMatch(
      routesSource,
      new RegExp(`route\\("${escapeRegex(slug)}"`),
      source,
    );
    assertStaticRedirect(source, target);
  }
});

test("three legacy aliases point directly to surviving destinations", () => {
  const allSources = new Set([
    ...Object.keys(redirects),
    ...Object.keys(retargetedAliases),
  ]);

  for (const [source, target] of Object.entries(retargetedAliases)) {
    assertStaticRedirect(source, target);
    assert.equal(allSources.has(target), false, `${source} must not chain`);
  }
});

test("registry contains one direct mapping and no retired canonical destination", () => {
  for (const [source, target] of Object.entries({
    ...redirects,
    ...retargetedAliases,
  })) {
    const matches = registrySource.match(
      new RegExp(
        `\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(target)}"\\s*\\}`,
        "g",
      ),
    );
    assert.equal(matches?.length, 1, source);
    assert.doesNotMatch(
      canonicalRegistrySource,
      new RegExp(`"${escapeRegex(source)}"`),
      source,
    );
  }

  assert.doesNotMatch(registrySource, /UK rent tools|ukSection/);
});

test("retired routes are absent from XML sitemap and generated content", () => {
  for (const source of Object.keys(redirects)) {
    assert.doesNotMatch(
      sitemapSource,
      new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`),
      source,
    );
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(source)}"`), source);
    assert.doesNotMatch(generatedPagesSource, new RegExp(`"${escapeRegex(source)}"`), source);
  }

  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
});

test("five retained destinations stay canonical and carry the merged task content", () => {
  for (const path of retained) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`));
    assert.match(canonicalRegistrySource, new RegExp(`"${escapeRegex(path)}"`), path);
  }

  assert.match(configsSource, /PW means per week and PCM means per calendar month/);
  assert.match(configsSource, /GBP 190 per week is about GBP 825\.60 PCM/);
  assert.match(configsSource, /monthly rent x 12 x 7 \/ 365/);
  assert.match(configsSource, /GBP 1,200 PCM is about GBP 276\.16 PW/);
  assert.match(configsSource, /Which calculator to use/);
  assert.match(configsSource, /rent-paid-every-4-weeks-calculator/);
  assert.match(fourWeekSource, /Four-weekly/);
  assert.match(fourWeekSource, /13 periods cover 364 days/);
  assert.match(fourWeekSource, /GBP remains available/);
});

test("visible generated FAQs and FAQ schema use the same retained arrays", () => {
  assert.match(
    generatedPagesSource,
    /makePageSchemas\(\{ \.\.\.config, calculator: true, faq: config\.faq \}\)/,
  );
  assert.match(generatedPagesSource, /<Faq items=\{config\.faq\} \/>/);
  assert.match(
    generatedPagesSource,
    /makePageSchemas\(\{ \.\.\.config, faq: config\.faq \}\)/,
  );
  assert.match(generatedPagesSource, /<Faq items=\{config\.faq \?\? \[\]\} \/>/);
});

test("route totals include the methodology page alongside later redirects", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [
    ...registrySource.matchAll(
      /\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g,
    ),
  ].length;

  assert.equal(registered, 60);
  assert.equal(redirectCount, 112);
  assertKnownRouteStateCounts(routesSource, registrySource);
});
