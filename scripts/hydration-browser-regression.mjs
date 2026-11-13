import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(path.resolve(process.env.RC_BROWSER_QA_DIR || '../rent-converter-acceptance/scripts/browser-qa', 'package.json'));
const { chromium } = require('playwright');
const base = process.env.RC_NOJS_BASE || 'http://127.0.0.1:3028';
const out = path.resolve('ai-issues/evidence/rc028-hydration');
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const report = { browser: browser.version(), at: new Date().toISOString(), base, checks: [] };
try {
  for (const routePath of ['/', '/rent-budget-calculator', '/rent-per-paycheck-calculator', '/rent-schedule-calculator']) {
    const context = await browser.newContext({ viewport: { width: 360, height: 900 } });
    let releaseScripts;
    const gate = new Promise(resolve => { releaseScripts = resolve; });
    await context.route('**/*.js', async route => { await gate; await route.continue(); });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + routePath, { waitUntil: 'commit' });
    await page.locator('main input').first().waitFor({ state: 'attached' });
    assert.equal(await page.locator('main input:not(:disabled), main select:not(:disabled)').count(), 0, `${routePath}: SSR must be disabled before scripts load`);
    assert.ok(await page.locator('main fieldset:disabled').count());
    releaseScripts();
    await page.waitForFunction(() => Boolean(document.querySelector('main input:not(:disabled)')));
    await page.waitForLoadState('networkidle');
    const input = page.locator('main input').first();
    const before = await page.locator('main').innerText();
    if (routePath === '/rent-schedule-calculator') {
      await input.fill('2028-01-31');
      await page.locator('#schedule-term-months').fill('3');
      await page.locator('#schedule-rent').fill('1800.25');
      assert.ok((await page.locator('main').innerText()).includes('2028-02-29'));
      assert.ok((await page.locator('main').innerText()).includes('1,800.25'));
    } else {
      await input.fill('98765');
      assert.notEqual(await page.locator('main').innerText(), before, `${routePath}: hydrated edits must recalculate`);
    }
    if (routePath === '/') {
      await input.fill('1e3');
      assert.equal(await input.getAttribute('aria-invalid'), 'true');
      assert.ok((await page.locator('#rent-amount-status').innerText()).length > 10);
      assert.ok(!(await page.locator('#converted-rent-region').innerText()).includes('2,172.62'));
      await input.fill('500');
      assert.ok((await page.locator('main').innerText()).includes('2,172.62'));
    }
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');
    assert.deepEqual(errors, [], `${routePath}: no hydration/runtime errors`);
    report.checks.push({ path: routePath, preHydrationDisabled: true, postHydrationEditable: true, recalculated: true, menuKeyboardEscape: true, errors });
    await context.close();
  }
  for (const [routePath, amount, expected] of [
    ['/weekly-to-monthly-rent-converter', '700.50', '3,043.84'],
    ['/biweekly-to-weekly-rent-converter', '900.50', '450.25'],
    ['/pcm-to-pw-calculator', '1500.50', '345.32'],
  ]) {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.goto(base + routePath, { waitUntil: 'networkidle' });
    await page.locator('main input').first().fill(amount);
    assert.ok((await page.locator('main').innerText()).includes(expected), `${routePath}: expected ${expected}`);
    report.checks.push({ path: routePath, amount, expected, pass: true });
    await context.close();
  }
  await writeFile(path.join(out, 'results.json'), JSON.stringify(report, null, 2));
  console.log('PASS: four real delayed-hydration/interaction checks and three protected converter regressions.');
} finally { await browser.close(); }
