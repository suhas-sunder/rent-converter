import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

// Reuse the pinned, isolated acceptance harness; no production dependencies.
const require = createRequire(process.env.QA_PACKAGE ?? new URL('../../rent-converter-acceptance/scripts/browser-qa/package.json', import.meta.url));
const { chromium } = require('playwright');
const origin = process.env.QA_ORIGIN ?? 'https://6af69b0c73337f2e792caf49--rent-converter.netlify.app';
assert.ok(!['rentconverter.com', 'www.rentconverter.com'].includes(new URL(origin).hostname));
const output = path.resolve(process.env.QA_OUTPUT ?? 'qa-paycheck-baseline');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
try {
  await page.goto(origin + '/rent-per-paycheck-calculator', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reject optional analytics', exact: true }).click();
  await page.getByText('Plan for your next rent due date', { exact: true }).click();
  await page.locator('#deadline-rent').fill('9007199254740991.99');
  await page.locator('#deadline-saved').fill('500');
  await page.locator('#deadline-next-payday').fill('2027-01-08');
  await page.locator('#deadline-due-date').fill('2027-02-01');
  const calculate = page.getByRole('button', { name: 'Calculate deadline plan', exact: true });
  await calculate.click();
  const table = page.locator('table').filter({ has: page.locator('caption', { hasText: 'Reserve schedule' }) });
  const scroller = table.locator('..');
  await calculate.focus();
  await page.keyboard.press('Tab');
  const before = await scroller.evaluate(el => ({ active: document.activeElement === el, tabIndex: el.tabIndex, role: el.getAttribute('role'), label: el.getAttribute('aria-label'), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, scrollLeft: el.scrollLeft, outline: getComputedStyle(el).outline, shadow: getComputedStyle(el).boxShadow }));
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const after = await scroller.evaluate(el => ({ active: document.activeElement === el, scrollLeft: el.scrollLeft }));
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  const farRight = await scroller.evaluate(el => ({ scrollLeft: el.scrollLeft, maximum: el.scrollWidth - el.clientWidth }));
  const pageWidths = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  const rows = await table.locator('tbody tr').allTextContents();
  await scroller.screenshot({ path: path.join(output, 'table-focused.png') });
  await page.screenshot({ path: path.join(output, 'page-360.png'), fullPage: true });
  assert.equal(pageWidths.clientWidth, pageWidths.scrollWidth, 'no page-wide overflow');
  assert.equal(before.active, true, 'Tab from calculate reaches scroll container');
  assert.ok(after.scrollLeft > before.scrollLeft, 'ArrowRight scrolls actual table');
  assert.ok(Math.abs(farRight.scrollLeft - farRight.maximum) <= 1, 'keyboard reaches the last money column');
  assert.ok(rows[1].includes('$9,007,199,254,740,991.99'), 'last saved amount remains exact');
  if (process.env.QA_EXPECT_EXPLICIT === '1') {
    assert.equal(before.tabIndex, 0);
    assert.equal(before.role, 'region');
    assert.equal(before.label, 'Paycheck reserve schedule');
    assert.notEqual(before.shadow, 'none', 'visible keyboard focus indicator');
  }
  const report = { origin, browser: browser.version(), viewport: 360, before, after, farRight, pageWidths, rows };
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
