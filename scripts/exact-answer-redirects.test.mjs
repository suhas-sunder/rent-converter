import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  assertKnownRouteStateCounts,
  assertStaticRedirect,
  assertStaticRedirectConfiguration,
} from "./static-route-test-helpers.mjs";

const exactAnswerRedirects = {
  "/150-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/160-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/170-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/180-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/200-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/220-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/230-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/250-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/300-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/320-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/350-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/370-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/400-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/450-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/500-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/550-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/600-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/650-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/750-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/500-euros-per-week-to-monthly-rent": "/weekly-to-monthly-rent-converter",
  "/190-pounds-per-week-to-pcm": "/pw-to-pcm-calculator",
  "/60-pounds-per-night-to-monthly-rent": "/daily-to-monthly-rent-converter",
};

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const generatedPagesSource = readFileSync(
  "app/client/components/generated/GeneratedPages.tsx",
  "utf8",
);
const generatedConfigsSource = readFileSync(
  "app/client/data/generatedRouteConfigs.ts",
  "utf8",
);
test("all exact-answer historical routes remain static direct permanent redirects", () => {
  assert.equal(Object.keys(exactAnswerRedirects).length, 22);

  for (const [source, target] of Object.entries(exactAnswerRedirects)) {
    assert.doesNotMatch(routesSource, new RegExp(`route\\("${source.slice(1)}"`), source);
    assertStaticRedirect(source, target);

    const escapedSource = source.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
    const escapedTarget = target.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
    const registryMatches = registrySource.match(
      new RegExp(
        `\\{\\s*from:\\s*"${escapedSource}",\\s*to:\\s*"${escapedTarget}"\\s*\\}`,
        "g",
      ),
    );
    assert.equal(registryMatches?.length, 1, source);
  }
});

test("the static Netlify redirect file uses HTTP 301 and preserves queries", () => {
  assertStaticRedirectConfiguration();
});

test("exact-answer sources are absent from sitemap and canonical discovery systems", () => {
  for (const source of Object.keys(exactAnswerRedirects)) {
    assert.doesNotMatch(sitemapSource, new RegExp(`<loc>[^<]*${source}</loc>`), source);
  }

  assert.equal((sitemapSource.match(/<loc>/g) ?? []).length, 60);
  assert.doesNotMatch(registrySource, /Exact answer pages|answerSection|weeklyAnswerPageConfigs/);
  assert.doesNotMatch(generatedConfigsSource, /weeklyAnswerPageConfigs|weeklyAnswerAmounts|answerConfig\(/);
  assert.doesNotMatch(generatedPagesSource, /WeeklyAnswerPage|exactAnswerAmounts|nearbyWeeklyAnswerLinks|exactAnswerCopy/);
});

test("redirect destinations remain registered canonical routes", () => {
  for (const target of new Set(Object.values(exactAnswerRedirects))) {
    const slug = target.slice(1);
    assert.match(routesSource, new RegExp(`route\\("${slug}"`), target);
    assert.match(registrySource, new RegExp(`item\\("${target}"|path:\\s*"${target}"`), target);
  }
});

test("inactive exact-answer component directories were removed", () => {
  for (const amount of [170, 180, 500]) {
    for (const component of ["FAQ.tsx", "HowItWorks.tsx", "ToolFit.tsx"]) {
      assert.equal(
        existsSync(
          `app/client/components/${amount}-per-week-to-monthly-rent/${component}`,
        ),
        false,
        `${amount} ${component}`,
      );
    }
  }
});

test("route status totals preserve the exact-answer redirects after later consolidation batches", () => {
  assertKnownRouteStateCounts(routesSource, registrySource);
});
