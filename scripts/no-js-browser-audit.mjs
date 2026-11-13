import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Reuse the separately pinned browser QA installation; no application dependency.
const require = createRequire(path.resolve(process.env.RC_BROWSER_QA_DIR || '../rent-converter-acceptance/scripts/browser-qa', 'package.json'));
const { chromium } = require('playwright');
const candidates = process.env.RC_NOJS_BASE ? [{ key: 'local', base: process.env.RC_NOJS_BASE, routes: ['/', '/rent-budget-calculator', '/rent-per-paycheck-calculator', '/rent-schedule-calculator'] }] : [
  { key: 'urgent', base: 'https://6af6977a997b1f8cde73e05e--rent-converter.netlify.app', routes: ['/'] },
  { key: 'w01', base: 'https://6af69ad52629bf99da003eb7--rent-converter.netlify.app', routes: ['/'] },
  { key: 'w02', base: 'https://6af69ad656cfa2344539eb98--rent-converter.netlify.app', routes: ['/rent-budget-calculator'] },
  { key: 'w03', base: 'https://6af69b0c73337f2e792caf49--rent-converter.netlify.app', routes: ['/rent-per-paycheck-calculator'] },
  { key: 'w04', base: 'https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app', routes: ['/rent-schedule-calculator'] },
];
const out = path.resolve(process.env.RC_NOJS_OUT || 'ai-issues/evidence/rc028-nojs-before');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = { at: new Date().toISOString(), browser: browser.version(), playwright: require('playwright/package.json').version, node: process.version, javaScriptEnabled: false, pages: [] };
function compactResults() {
  return { ...results, pages: results.pages.map(({ widths, ...record }) => ({
    ...record,
    notice: widths[0].notice,
    widths: widths.map(({ width, scrollWidth, controls, nav }) => ({ width, scrollWidth,
      controls: controls.length, disabled: controls.filter(control => control.disabled).length,
      enabled: controls.filter(control => !control.disabled).map(control => control.id || control.name),
      navHrefs: nav.map(link => link.href),
    })),
  })) };
}
try {
  for (const candidate of candidates) for (const route of candidate.routes) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
    const page = await context.newPage();
    const hosts = new Set(); const errors = [];
    page.on('request', request => hosts.add(new URL(request.url()).hostname));
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(candidate.base + route, { waitUntil: 'networkidle' });
    // Native <details> works without script and must expose any latent editable budget.
    for (const summary of await page.locator('details > summary').all()) if (await summary.isVisible()) await summary.click();
    const name = `${candidate.key}-${route === '/' ? 'home' : route.slice(1)}`;
    const record = { key: candidate.key, url: page.url(), status: response.status(), requestHosts: [], errors, widths: [] };
    for (const width of [360, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(out, `${name}-${width}.png`), fullPage: true });
      await page.screenshot({ path: path.join(out, `${name}-viewport-${width}.png`) });
      record.widths.push(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, notice: [...document.querySelectorAll('noscript')].map(n => n.textContent.trim()), controls: [...document.querySelectorAll('input,select,textarea,button')].filter(n => n.getClientRects().length).map(n => ({ tag: n.tagName, id: n.id, name: n.getAttribute('aria-label') || n.textContent.trim().slice(0, 100), value: n.value, disabled: n.matches(':disabled') })), nav: [...document.querySelectorAll('header a, nav a')].filter(n => n.getClientRects().length).map(n => ({ text: n.textContent.trim(), href: n.getAttribute('href') })) })));
    }
    await page.setViewportSize({ width: 360, height: 900 });
    const editable = page.locator('main input:not(:disabled)').first();
    if (await editable.count()) {
      const before = await page.locator('main').innerText();
      const previous = await editable.inputValue();
      await editable.fill(await editable.getAttribute('type') === 'date' ? '2028-01-31' : '98765');
      record.staleEdit = { id: await editable.getAttribute('id'), previous, valueAfter: await editable.inputValue(), visibleTextUnchanged: before === await page.locator('main').innerText() };
      await page.screenshot({ path: path.join(out, `${name}-edited-360.png`), fullPage: true });
    }
    const menu = page.getByRole('button', { name: 'Open menu', exact: true });
    if (await menu.count()) {
      record.mobileMenu = { disabled: await menu.isDisabled(), before: await menu.getAttribute('aria-expanded') };
      if (!record.mobileMenu.disabled) await menu.click();
      record.mobileMenu.after = await menu.getAttribute('aria-expanded');
    }
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.count()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      record.homeNavigation = { url: page.url(), heading: await page.locator('h1').first().innerText() };
    }
    record.requestHosts = [...hosts];
    if (process.env.RC_NOJS_ASSERT === '1') {
      assert.equal(record.status, 200);
      assert.equal(record.staleEdit, undefined, `${name}: controls must not accept edits without JavaScript`);
      assert.equal(record.mobileMenu.disabled, true);
      assert.equal(record.errors.length, 0);
      for (const state of record.widths) {
        assert.ok(state.notice.some(text => text.includes('JavaScript is off')));
        assert.ok(state.scrollWidth <= state.width, `${name}: document overflow at ${state.width}`);
        assert.ok(state.nav.some(link => link.href === '/sitemap'));
      }
      const fallback = page.getByRole('navigation', { name: 'Navigation without JavaScript' });
      await fallback.getByRole('link', { name: 'All calculators', exact: true }).click();
      await page.waitForLoadState('networkidle');
      assert.ok(page.url().endsWith('/sitemap'), 'Native fallback navigation must reach the sitemap');
      record.fallbackNavigation = { url: page.url(), heading: await page.locator('h1').innerText() };
    }
    results.pages.push(record);
    await context.close();
    await writeFile(path.join(out, 'results.json'), JSON.stringify(compactResults(), null, 2));
    console.log(`${name}: ${record.status}, enabled inputs=${record.widths[0].controls.filter(x => !x.disabled && ['INPUT','SELECT','TEXTAREA'].includes(x.tag)).length}, stale edit=${Boolean(record.staleEdit)}`);
  }
} finally { await browser.close(); }
