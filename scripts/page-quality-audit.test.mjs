import assert from "node:assert/strict";
import test from "node:test";
import { assessPage } from "./page-quality-audit.mjs";

const page = {
  path: "/weekly-to-monthly-rent-converter",
  url: "https://www.rentconverter.com/weekly-to-monthly-rent-converter",
  canonical: "https://www.rentconverter.com/weekly-to-monthly-rent-converter",
  status: 200, redirected: false, title: "Weekly to Monthly Rent Converter",
  h1: "Weekly to Monthly Rent Converter", h1Count: 1, description: "Convert rent.",
  robots: "", schemaTypes: ["WebPage"], visibleWordCount: 30,
  hasHowWorks: true, hasWorkedExample: true, hasLimitations: true,
  fullDirectoryCount: 0, internalLinkCount: 4, first250Specificity: "specific", text: "",
};

test("short useful tools are not penalized and long pages are not accepted automatically", () => {
  const short = assessPage(page);
  const long = assessPage({ ...page, visibleWordCount: 5000, faqCount: 50 });
  assert.deepEqual(short, long);
  assert.deepEqual(short.failures, []);
  assert.equal(short.humanValueStatus, "NOT ASSESSED");
});

test("HTTP, indexability, canonical and malformed schema failures cannot be hidden by content", () => {
  const result = assessPage({ ...page, status: 404, redirected: true, canonical: "https://www.rentconverter.com/", h1Count: 0, robots: "noindex,follow", schemaTypes: ["InvalidJsonLd"], visibleWordCount: 9000 });
  assert.equal(result.structuralStatus, "FAIL");
  assert.equal(result.failures.length, 6);
});

test("similar text and missing heuristic terms request review without asserting low value", () => {
  const result = assessPage({ ...page, nearestSimilarPath: "/pw-to-pcm-calculator", nearestSimilarity: 0.99, hasWorkedExample: false, hasHowWorks: false });
  assert.deepEqual(result.failures, []);
  assert.equal(result.reviewSignals.length, 3);
  assert.equal(result.humanValueStatus, "NOT ASSESSED");
});

test("existing directory and core metadata safeguards remain failures", () => {
  const result = assessPage({ ...page, title: "", fullDirectoryCount: 1 });
  assert.equal(result.failures.length, 2);
  assert.equal(result.structuralStatus, "FAIL");
});
