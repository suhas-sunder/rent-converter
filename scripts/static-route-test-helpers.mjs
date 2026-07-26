import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

export const staticRedirectsSource = readFileSync("public/_redirects", "utf8");

export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function assertStaticRedirect(source, target) {
  const rule = new RegExp(
    `^${escapeRegex(source)}\\s+${escapeRegex(target)}\\s+301\\s*$`,
    "m",
  );
  assert.match(staticRedirectsSource, rule, `${source} -> ${target}`);
  assert.equal(
    existsSync(`app/routes/${source.slice(1)}.tsx`),
    false,
    `${source} must not remain as a request-time route module`,
  );
}

export function assertStaticRedirectConfiguration() {
  const rules = staticRedirectsSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  assert.equal(rules.length, 112);
  assert.ok(rules.every((line) => /\s301$/.test(line)));
  assert.match(staticRedirectsSource, /preserves incoming query parameters/i);
  assert.doesNotMatch(staticRedirectsSource, /^\/\*\s+/m);
  assert.doesNotMatch(staticRedirectsSource, /\s200\s*$/m);
}

export function assertKnownRouteStateCounts(routesSource, registrySource) {
  const renderable =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirects = [
    ...registrySource.matchAll(
      /\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g,
    ),
  ].length;

  assert.equal(renderable, 60);
  assert.equal(redirects, 112);
  assert.equal(renderable + redirects, 172);
}
