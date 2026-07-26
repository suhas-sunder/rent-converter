import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_VERSION,
  createAnalyticsController,
  parseAnalyticsConsent,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "../app/client/utils/analyticsConsent.js";

const text = (path) => readFileSync(path, "utf8");
const routeSource = text("app/routes.ts");
const registrySource = text("app/client/data/routeRegistry.ts");
const sitemapXml = text("public/sitemap.xml");
const footerSource = text("app/client/components/navigation/Footer.tsx");
const providerSource = text("app/provider.tsx");

const expectedIndexable = [
  "/privacy-policy",
  "/terms-of-service",
  "/cookies",
  "/sitemap",
];

function sitemapPaths() {
  return [...sitemapXml.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1] || "/",
  );
}

function routePaths() {
  return [
    "/",
    ...[...routeSource.matchAll(/route\("([^"]+)"/g)].map((match) => `/${match[1]}`),
  ];
}

function redirectPaths() {
  return [...registrySource.matchAll(/\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g)].map(
    (match) => match[1],
  );
}

test("legal and utility routes remain registered, indexable, and present in the XML sitemap", () => {
  const routes = routePaths();
  const redirects = redirectPaths();
  const sitemap = sitemapPaths();

  assert.equal(routes.length, 60);
  assert.equal(redirects.length, 112);
  assert.equal(routes.length + redirects.length, 172);
  assert.equal(sitemap.length, 60);
  assert.equal(new Set(sitemap).size, sitemap.length);

  for (const path of expectedIndexable) {
    assert.ok(routes.includes(path), `${path} remains registered`);
    assert.ok(!redirects.includes(path), `${path} is not a redirect`);
    assert.ok(sitemap.includes(path), `${path} remains in the XML sitemap`);
  }

  for (const path of ["/about", "/contact"]) {
    assert.ok(sitemap.includes(path), `${path} remains indexable in XML sitemap`);
  }

  assert.doesNotMatch(registrySource, /noindexRouteEntries|indexableRouteEntries|noindexPaths|indexablePaths/);
});

test("all public routes remain indexable and legal pages keep self-canonical non-application metadata", () => {
  const seoSource = text("app/client/utils/seo.tsx");
  assert.match(seoSource, /name: "robots", content: "index,follow"/);
  assert.doesNotMatch(seoSource, /noindex/i);

  const noindexFiles = new Set();
  for (const name of readdirSync("app/routes")) {
    if (!name.endsWith(".tsx")) continue;
    const source = text(join("app/routes", name));
    if (/indexable:\s*false|makeRobotsMeta\(false\)|noindex,follow/.test(source)) {
      noindexFiles.add(`/${name.replace(/\.tsx$/, "")}`);
    }
  }
  assert.deepEqual([...noindexFiles], []);

  for (const path of ["privacy-policy", "terms-of-service", "cookies"]) {
    const source = text(`app/routes/${path}.tsx`);
    assert.match(source, new RegExp(`path: "\\/${path}"`));
    assert.doesNotMatch(source, /WebApplication/);
  }
  assert.match(text("app/routes/sitemap.tsx"), /rel: "canonical", href: SITEMAP_URL/);
  assert.doesNotMatch(text("app/routes/sitemap.tsx"), /WebApplication/);

  for (const path of ["about", "contact"]) {
    const source = text(`app/routes/${path}.tsx`);
    assert.doesNotMatch(source, /noindex|indexable:\s*false/i);
  }
});

test("legal and utility routes remain accessible without nofollow or sitemap self-listing", () => {
  for (const path of expectedIndexable) {
    assert.match(footerSource, new RegExp(`to:\\s*["']${path.replaceAll("/", "\\/")}["']`));
  }
  assert.doesNotMatch(footerSource, /rel=["']nofollow["']/i);
  assert.match(footerSource, /Analytics preferences/);

  const sitemapSectionsSource = registrySource.slice(
    registrySource.indexOf("export const sitemapSections"),
    registrySource.indexOf("export const canonicalRouteEntries"),
  );
  for (const path of ["/privacy-policy", "/terms-of-service", "/cookies"]) {
    assert.match(sitemapSectionsSource, new RegExp(path.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(sitemapSectionsSource, /item\("\/sitemap"/);
});

test("consent parser is versioned and fail-closed", () => {
  assert.equal(ANALYTICS_CONSENT_VERSION, 1);
  assert.equal(ANALYTICS_CONSENT_STORAGE_KEY, "rc_analytics_consent_v1");
  assert.equal(parseAnalyticsConsent(null), null);
  assert.equal(parseAnalyticsConsent("not json"), null);
  assert.equal(parseAnalyticsConsent('{"version":0,"analytics":"accepted"}'), null);
  assert.equal(parseAnalyticsConsent('{"version":1,"analytics":"other"}'), null);
  assert.equal(parseAnalyticsConsent('{"version":1,"analytics":"accepted"}'), "accepted");
  assert.equal(parseAnalyticsConsent('{"version":1,"analytics":"rejected"}'), "rejected");
});

test("consent storage handles unavailable storage and never writes without storage", () => {
  const writes = [];
  const storage = {
    getItem: () => JSON.stringify({ version: 1, analytics: "accepted" }),
    setItem: (key, value) => writes.push([key, value]),
  };
  assert.equal(readAnalyticsConsent(storage), "accepted");
  assert.equal(writeAnalyticsConsent("rejected", storage), true);
  assert.deepEqual(writes, [
    [ANALYTICS_CONSENT_STORAGE_KEY, '{"version":1,"analytics":"rejected"}'],
  ]);
  assert.equal(readAnalyticsConsent({ getItem: () => { throw new Error("blocked"); }, setItem() {} }), null);
  assert.equal(writeAnalyticsConsent("accepted", { getItem: () => null, setItem: () => { throw new Error("blocked"); } }), false);
  assert.equal(readAnalyticsConsent(null), null);
  assert.equal(writeAnalyticsConsent("accepted", null), false);
});

function fakeClient(initiallyOptedOut = false) {
  const calls = [];
  let optedOut = initiallyOptedOut;
  return {
    calls,
    client: {
      init(token, config) {
        calls.push(["init", token, config]);
      },
      has_opted_out_capturing() {
        return optedOut;
      },
      opt_in_capturing(options) {
        optedOut = false;
        calls.push(["opt_in", options]);
      },
      opt_out_capturing() {
        optedOut = true;
        calls.push(["opt_out"]);
      },
      reset(resetDeviceId) {
        optedOut = false;
        calls.push(["reset", resetDeviceId]);
      },
      stopSessionRecording() {
        calls.push(["stop_recording"]);
      },
    },
  };
}

test("analytics stays unloaded until accepted and initializes only once", async () => {
  const fake = fakeClient();
  let loads = 0;
  const controller = createAnalyticsController(
    async () => {
      loads += 1;
      return { default: fake.client };
    },
    { token: "public-token", config: { capture_pageview: "history_change" } },
  );

  controller.disable();
  assert.equal(loads, 0);
  assert.equal(controller.isInitialized(), false);

  await Promise.all([controller.enable(), controller.enable(), controller.enable()]);
  assert.equal(loads, 1);
  assert.equal(fake.calls.filter(([name]) => name === "init").length, 1);
  assert.equal(controller.isInitialized(), true);
});

test("withdrawal opts out, resets analytics, and reacceptance does not reinitialize", async () => {
  const fake = fakeClient();
  let loads = 0;
  const controller = createAnalyticsController(
    async () => {
      loads += 1;
      return { default: fake.client };
    },
    { token: "public-token", config: {} },
  );

  await controller.enable();
  controller.disable();
  assert.deepEqual(
    fake.calls.slice(-4).map(([name]) => name),
    ["opt_out", "stop_recording", "reset", "opt_out"],
  );
  assert.deepEqual(fake.calls.find(([name]) => name === "reset"), ["reset", true]);

  await controller.enable();
  assert.equal(loads, 1);
  assert.equal(fake.calls.filter(([name]) => name === "init").length, 1);
  assert.equal(fake.calls.filter(([name]) => name === "opt_in").length, 1);
});

test("a newly loaded client honors acceptance after a persisted PostHog opt-out", async () => {
  const fake = fakeClient(true);
  const controller = createAnalyticsController(
    async () => ({ default: fake.client }),
    { token: "public-token", config: {} },
  );

  await controller.enable();
  assert.deepEqual(
    fake.calls.map(([name]) => name),
    ["init", "opt_in"],
  );
  assert.deepEqual(fake.calls[1], ["opt_in", { captureEventName: false }]);
});

test("withdrawal during a pending import prevents initialization", async () => {
  const fake = fakeClient();
  let resolveLoad;
  const loaded = new Promise((resolve) => {
    resolveLoad = resolve;
  });
  const controller = createAnalyticsController(
    () => loaded,
    { token: "public-token", config: {} },
  );

  const pending = controller.enable();
  controller.disable();
  resolveLoad({ default: fake.client });
  assert.equal(await pending, null);
  assert.equal(fake.calls.length, 0);
  assert.equal(controller.isInitialized(), false);
});

test("analytics and storage errors do not escape into the application", async () => {
  const loadingFailure = createAnalyticsController(
    async () => { throw new Error("network failure"); },
    { token: "public-token", config: {} },
  );
  assert.equal(await loadingFailure.enable(), null);

  const brokenClient = {
    init() { throw new Error("init failure"); },
    reset() { throw new Error("reset failure"); },
    opt_out_capturing() { throw new Error("opt-out failure"); },
  };
  const initFailure = createAnalyticsController(
    async () => ({ default: brokenClient }),
    { token: "public-token", config: {} },
  );
  assert.equal(await initFailure.enable(), null);
  assert.doesNotThrow(() => initFailure.disable());
});

test("provider uses a consent-only dynamic PostHog path and privacy-minimizing options", () => {
  assert.match(providerSource, /async \(\) => import\("posthog-js"\)/);
  assert.doesNotMatch(providerSource, /import posthog from/);
  assert.match(providerSource, /autocapture:\s*false/);
  assert.match(providerSource, /capture_pageview:\s*"history_change"/);
  assert.match(providerSource, /capture_pageleave:\s*false/);
  assert.match(providerSource, /request_batching:\s*false/);
  assert.match(providerSource, /disable_session_recording:\s*true/);
  assert.match(providerSource, /person_profiles:\s*"never"/);
  assert.match(providerSource, /persistence:\s*"localStorage"/);
  assert.match(providerSource, /capture_exceptions:\s*false/);
  assert.match(providerSource, /advanced_disable_flags:\s*true/);
  assert.match(providerSource, /role="region"/);
  assert.match(providerSource, /aria-labelledby="analytics-preferences-title"/);
  assert.match(providerSource, /flex flex-col/);
  assert.match(providerSource, /sm:flex-row/);
  assert.match(providerSource, /print:hidden/);
  assert.match(footerSource, /Analytics preferences/);
  assert.match(footerSource, /print:hidden/);
});

test("legal copy reflects the implemented product and contact path", () => {
  const terms = text("app/routes/terms-of-service.tsx");
  const privacy = text("app/routes/privacy-policy.tsx");
  const cookies = text("app/routes/cookies.tsx");
  const contact = text("app/routes/contact.tsx");

  assert.doesNotMatch(terms, /create (?:a|your) account|register(?:ing)? an account|your account|subscription fees|purchase products|product reviews|post comments|social features|user-uploaded content/i);
  assert.doesNotMatch(terms, /governing law|arbitration/i);
  assert.match(terms, /not\s+presented as attorney-reviewed/i);
  assert.match(terms, /does not currently load advertising scripts/i);
  assert.match(terms, /free browser-based rental calculators/i);
  assert.match(terms, /does not provide legal, tax, accounting, investment, tenancy/i);
  assert.match(terms, /Verify important decisions with the written agreement/i);

  assert.match(privacy, /processed in your browser/i);
  assert.match(privacy, /does not submit those values/i);
  assert.match(privacy, /localStorage/i);
  assert.match(privacy, /not initialized until/i);
  assert.match(privacy, /contact page does not contain a web form/i);
  assert.match(privacy, /does not currently load advertising scripts/i);

  assert.match(cookies, /cookie persistence is disabled/i);
  assert.match(cookies, /Rejecting analytics does not disable calculators/i);
  assert.match(cookies, /does not currently load advertising scripts/i);

  assert.match(contact, /href="mailto:hello@rentconverter\.com"/);
  assert.match(contact, /does not submit a web form/i);
  assert.doesNotMatch(contact, /<form|data-netlify|fetch\(/i);
});
