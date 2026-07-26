import { readFileSync, writeFileSync } from "node:fs";

const registryPath = "app/client/data/routeRegistry.ts";
const outputPath = "public/_redirects";
const checkOnly = process.argv.includes("--check");

function readAliases() {
  const source = readFileSync(registryPath, "utf8");
  return [
    ...source.matchAll(
      /\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g,
    ),
  ].map((match) => ({ from: match[1], to: match[2] }));
}

function readRenderablePaths() {
  const source = readFileSync("app/routes.ts", "utf8");
  return new Set([
    ...(source.includes('index("routes/home.tsx")') ? ["/"] : []),
    ...[...source.matchAll(/\broute\("([^"]+)"/g)].map(
      (match) => `/${match[1]}`,
    ),
  ]);
}

function renderRedirects(aliases) {
  const width = Math.max(...aliases.map(({ from }) => from.length)) + 2;
  const rules = aliases.map(
    ({ from, to }) => `${from.padEnd(width)} ${to}  301`,
  );
  return [
    "# Generated from app/client/data/routeRegistry.ts.",
    "# Netlify preserves incoming query parameters on these 301 redirects.",
    "# Run `npm run validate:redirects` to verify this file is current.",
    "",
    ...rules,
    "",
  ].join("\n");
}

const aliases = readAliases();
const renderablePaths = readRenderablePaths();
const sources = new Set(aliases.map(({ from }) => from));

if (aliases.length !== 112 || sources.size !== 112) {
  throw new Error(
    `Expected 112 unique redirect aliases, found ${aliases.length} entries and ${sources.size} unique sources.`,
  );
}

for (const { from, to } of aliases) {
  if (from === to) {
    throw new Error(`Redirect source and destination must differ: ${from}`);
  }
  if (sources.has(to)) {
    throw new Error(`Redirect must point directly to a canonical page: ${from} -> ${to}`);
  }
  if (!renderablePaths.has(to)) {
    throw new Error(`Redirect target is not a renderable route: ${from} -> ${to}`);
  }
}

const expected = renderRedirects(aliases);

if (checkOnly) {
  const current = readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n");
  if (current !== expected) {
    throw new Error(
      `${outputPath} is out of date. Run \`node scripts/generate-netlify-redirects.mjs\`.`,
    );
  }
  console.log(`Verified ${aliases.length} static Netlify redirects.`);
} else {
  writeFileSync(outputPath, expected, "utf8");
  console.log(`Generated ${aliases.length} static Netlify redirects.`);
}
