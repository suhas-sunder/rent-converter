import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// Independent, synthetic Chromium contexts. Off-origin requests are blocked
// except read-only Google Fonts CSS/fonts needed for representative typography.
// Blocking is NOT evidence that the app itself never attempts telemetry.
const configured = JSON.parse(await fs.readFile(process.env.QA_CANDIDATES ?? new URL('./candidates.json', import.meta.url), 'utf8'));
const wanted = process.env.QA_ONLY?.split(',').map(s => s.trim()).filter(Boolean);
const candidates = configured.filter(c => !wanted || wanted.includes(c.id));
assert.ok(candidates.length, 'No candidates selected');
if (wanted) for (const id of wanted) assert.ok(candidates.some(c => c.id === id), `Unknown selected candidate: ${id}`);
const routes = { urgent: '/', w01: '/', w02: '/rent-budget-calculator', w03: '/rent-per-paycheck-calculator', w04: '/rent-schedule-calculator' };
const localOrigin = process.env.QA_ORIGIN;
if (localOrigin) assert.match(localOrigin, /^http:\/\/(?:localhost|127\.0\.0\.1):[0-9]{2,5}$/, 'QA_ORIGIN override is allowed only for an explicit loopback test server');
assert.equal(new Set(candidates.map(c => c.id)).size, candidates.length, 'Duplicate candidate IDs would overwrite evidence');
for (const c of candidates) {
  assert.ok(Object.hasOwn(routes, c.id), 'Unknown candidate ID');
  const u = new URL(c.origin);
  assert.ok(/^https:\/\/[a-f0-9]{24}--rent-converter\.netlify\.app$/.test(c.origin), 'Only exact immutable RentConverter HTTPS preview origins are allowed');
  assert.equal(u.origin, c.origin);
  assert.match(c.sha, /^[a-f0-9]{40}$/);
  assert.equal(c.path, routes[c.id], 'Candidate must name a known representative route');
}
const output = path.resolve(process.env.QA_FOCUSED_OUTPUT ?? process.env.QA_OUTPUT ?? 'artifacts/focused');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { started: new Date().toISOString(), node: process.version, browser: browser.version(), networkMode: 'off-origin requests blocked except Google Fonts GET CSS/font; no production consent acceptance', localAssembly: localOrigin ?? null, candidates: [] };
const widths = [360, 390, 768, 1280, 1440];
const safeError = error => String(error.message ?? error).replace(/https?:\/\/[^\s)]+/g, raw => { try { const u = new URL(raw); return u.origin + u.pathname; } catch { return '[URL]'; } });
async function shot(page, name) {
  // Keep sticky navigation at the document top in full-page evidence. This
  // preserves inner table scroll and focus while avoiding stitched-header noise.
  await page.evaluate(() => window.scrollTo(0, 0));
  return page.screenshot({ path: path.join(output, name + '.png'), fullPage: true, animations: 'disabled' });
}
const seed = id => ({
  rc_analytics_consent_v1: '{invalid',
  ...(id === 'urgent' ? { rc_amount: '1e3', rc_from: 'bad', rc_to: 'bad', rc_currency: 'BAD' } : {}),
  ...(id === 'w01' ? { rc_listing_comparison_v1: '{invalid' } : {}),
  ...(id === 'w02' ? { rc_housing_budget_v1: JSON.stringify({ income: '999999', currency: 'BAD', items: [] }) } : {}),
  ...(id === 'w03' ? { rpc_amount: '1e3', rpc_rentPeriod: 'bad', rpc_payFreq: 'bad', rpc_currency: 'BAD' } : {}),
});

async function contextFor(candidate, mode = 'ordinary') {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York', acceptDownloads: true, serviceWorkers: 'block' });
  const events = [], errors = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const u = new URL(request.url());
    const font = u.protocol === 'https:' && ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(u.hostname)
      && request.method() === 'GET' && ['stylesheet', 'font'].includes(request.resourceType());
    const allowed = u.origin === candidate.origin || font;
    // No paths, queries, bodies, headers, cookies, console dumps or storage dumps.
    events.push({ host: u.hostname, type: request.resourceType(), action: allowed ? 'allow' : 'block' });
    await (allowed ? route.continue() : route.abort('blockedbyclient'));
  });
  await context.addInitScript(({ mode, values, origin }) => {
    if (location.origin !== origin) return;
    if (mode === 'unavailable') {
      Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Synthetic storage unavailable', 'SecurityError'); } });
    } else if (mode === 'corrupt') {
      for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value);
    } else {
      localStorage.setItem('rc_analytics_consent_v1', JSON.stringify({ version: 1, analytics: 'rejected' }));
    }
  }, { mode, values: seed(candidate.id), origin: candidate.origin });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push(safeError(error)));
  return { context, page, events, errors };
}

async function open(page, candidate) {
  const response = await page.goto(candidate.origin + candidate.path, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(new URL(page.url()).origin, candidate.origin);
  const reject = page.getByRole('button', { name: 'Reject optional analytics', exact: true });
  if (await reject.isVisible()) await reject.click();
}

// Parse the downloaded file independently, rather than importing the app's CSV serializer.
function parseCsv(source) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === '"') { if (quoted && source[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && c === ',') { row.push(cell); cell = ''; }
    else if (!quoted && (c === '\r' || c === '\n')) { if (c === '\r' && source[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  assert.equal(quoted, false, 'CSV quote is unclosed');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

async function csvDownload(page, file) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download comparison CSV', exact: true }).click();
  const download = await pending;
  assert.match(download.suggestedFilename(), /\.csv$/);
  const target = path.join(output, file);
  await download.saveAs(target);
  return parseCsv(await fs.readFile(target, 'utf8'));
}

async function housingFixture(page) {
  await page.getByText('Check your take-home housing budget', { exact: true }).click();
  assert.equal(await page.getByLabel('Monthly take-home income', { exact: true }).inputValue(), '', 'Corrupt storage must not restore invalid income');
  for (const [label, value] of [['Monthly take-home income', '4000'], ['Rent', '500'], ['Utilities', '300'], ['Insurance', '120'], ['Monthly non-housing commitments', '1000'], ['Monthly savings target', '500']]) await page.getByLabel(label, { exact: true }).fill(value);
  for (const [label, value] of [['Rent billing period', 'weekly'], ['Utilities billing period', 'quarterly'], ['Insurance billing period', 'annual']]) await page.getByLabel(label, { exact: true }).selectOption(value);
  // This heading exists only when valid inputs yield a result; the exact name
  // of the containing region may change independently, so inspect its section.
  const section = page.locator('section').filter({ has: page.getByText('Check your take-home housing budget', { exact: true }) });
  assert.match(await section.innerText(), /\$2,282\.62/);
  assert.match(await section.innerText(), /\$217\.38/);
  assert.equal(await page.getByLabel('Budget currency', { exact: true }).inputValue(), 'USD');
}

async function deadlineFixture(page) {
  await page.getByText('Plan for your next rent due date', { exact: true }).click();
  await page.getByLabel('Actual rent payment due (USD)', { exact: true }).fill('2000');
  await page.getByLabel('Already saved for this payment (USD)', { exact: true }).fill('500');
}

async function storageCase(page, candidate, mode) {
  await open(page, candidate);
  if (mode === 'unavailable') assert.equal(await page.evaluate(() => {
    try { void window.localStorage; return false; } catch (error) { return error.name === 'SecurityError'; }
  }), true, 'Unavailable-storage fixture must actually throw in this browser');
  if (candidate.id === 'urgent') {
    const amount = page.getByRole('textbox', { name: 'Rent amount', exact: true });
    assert.equal(await amount.inputValue(), '500');
    await amount.fill('700.50');
    assert.match(await page.getByRole('region', { name: 'Converted rent' }).innerText(), /3,043\.84/);
  } else if (candidate.id === 'w01') {
    assert.equal(await page.getByRole('button', { name: 'Load saved comparison', exact: true }).count(), 0);
    await page.locator('#listing-1-name').fill('Synthetic current comparison');
    await page.getByRole('button', { name: 'Save in this browser', exact: true }).click();
    if (mode === 'unavailable') assert.match(await page.locator('body').innerText(), /Could not save/);
    else {
      await page.evaluate(() => localStorage.setItem('rc_listing_comparison_v1', '{invalid'));
      await page.getByRole('button', { name: 'Load saved comparison', exact: true }).click();
      assert.match(await page.locator('body').innerText(), /No valid saved comparison was found/);
      assert.equal(await page.locator('#listing-1-name').inputValue(), 'Synthetic current comparison');
    }
    const rows = await csvDownload(page, `w01-storage-${mode}.csv`);
    assert.equal(rows[1][5], '2272.62');
  } else if (candidate.id === 'w02') {
    await housingFixture(page);
  } else if (candidate.id === 'w03') {
    assert.equal(await page.getByLabel('Pay frequency', { exact: true }).inputValue(), 'biweekly');
    await deadlineFixture(page);
    await page.getByLabel('Next payday', { exact: true }).fill('2027-01-08');
    await page.getByLabel('Rent due date', { exact: true }).fill('2027-02-01');
    await page.getByRole('button', { name: 'Calculate deadline plan', exact: true }).click();
    assert.match(await page.getByRole('region', { name: 'Paycheck deadline plan', exact: true }).innerText(), /1,500\.00 still needed across 2 paydays/);
  }
  await shot(page, `${candidate.id}-storage-${mode}`);
  return { mode, calculationUsable: true, storageScope: 'synthetic context only' };
}

async function listingCase(page, candidate) {
  await open(page, candidate);
  const names = ['X'.repeat(60), '=SUM(1,2)', 'Synthetic "quoted", third listing'];
  await page.getByRole('button', { name: 'Add a listing', exact: true }).click();
  for (let i = 1; i <= 3; i++) await page.locator(`#listing-${i}-name`).fill(names[i - 1]);
  await page.locator('#listing-3-rent').fill('2200');
  assert.match(await page.getByRole('region', { name: 'Listing comparison results', exact: true }).innerText(), /\(tie\)/);
  const geometry = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const size = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert.ok(size.page <= width + 1, `Long listing labels cause page overflow at ${width}`);
    geometry.push(size);
    await shot(page, `w01-long-labels-${width}`);
  }
  const rows = await csvDownload(page, 'w01-long-labels.csv');
  assert.equal(rows.length, 5);
  assert.equal(rows[1][0], names[0]);
  assert.equal(rows[2][0], "'" + names[1], 'Formula-leading CSV names must be neutralized');
  assert.equal(rows[3][0], names[2], 'CSV must preserve comma and escaped quote');
  for (const row of rows.slice(1, 4)) assert.equal(row.length, 9);
  assert.deepEqual(rows[1].slice(5), ['2272.62', '27271.43', '72.62', '871.43']);
  assert.deepEqual(rows[2].slice(5), ['2200.00', '26400.00', '0.00', '0.00']);
  assert.deepEqual(rows[3].slice(5), ['2200.00', '26400.00', '0.00', '0.00']);
  return { geometry, csv: 'w01-long-labels.csv', listings: 3, formulaNeutralized: true };
}

async function paycheckCase(page, candidate) {
  await open(page, candidate); await deadlineFixture(page);
  const vectors = [
    { frequency: 'monthly', next: '2028-01-31', due: '2028-04-01', dates: ['2028-01-31', '2028-02-29', '2028-03-31'], reserves: ['$500.00', '$500.00', '$500.00'] },
    { frequency: 'semimonthly', first: '15', second: '31', next: '2028-02-15', due: '2028-04-01', dates: ['2028-02-15', '2028-02-29', '2028-03-15', '2028-03-31'], reserves: ['$375.00', '$375.00', '$375.00', '$375.00'] },
    { frequency: 'semimonthly', first: '29', second: '31', next: '2027-02-28', due: '2027-04-01', dates: ['2027-02-28', '2027-03-29', '2027-03-31'], reserves: ['$500.00', '$500.00', '$500.00'] },
  ];
  const actual = [];
  for (const vector of vectors) {
    await page.getByLabel('Pay frequency', { exact: true }).selectOption(vector.frequency);
    if (vector.first) {
      await page.getByLabel('Earlier pay day of month (1–31)', { exact: true }).fill(vector.first);
      await page.getByLabel('Later pay day of month (1–31)', { exact: true }).fill(vector.second);
    }
    await page.getByLabel('Next payday', { exact: true }).fill(vector.next);
    await page.getByLabel('Rent due date', { exact: true }).fill(vector.due);
    await page.getByRole('button', { name: 'Calculate deadline plan', exact: true }).click();
    const rows = await page.getByRole('region', { name: 'Paycheck deadline plan', exact: true }).locator('tbody tr').evaluateAll(es => es.map(e => [...e.cells].map(c => c.textContent.trim())));
    assert.deepEqual(rows.map(r => r[0]), vector.dates);
    assert.deepEqual(rows.map(r => r[1]), vector.reserves);
    assert.equal(rows.at(-1)[2], '$2,000.00');
    actual.push({ ...vector, rows });
  }
  await shot(page, 'w03-coincident-month-end');
  await page.getByLabel('Next payday', { exact: true }).fill('2027-02-15');
  await page.getByRole('button', { name: 'Calculate deadline plan', exact: true }).click();
  assert.match(await page.getByRole('alert').innerText(), /Next payday must match/);
  assert.equal(await page.getByRole('region', { name: 'Paycheck deadline plan', exact: true }).locator('tbody tr').count(), 0, 'Invalid dates must remove stale reserves');
  return { vectors: actual, invalidScheduleSuppressesRows: true };
}

async function calendarKeyboardCase(page, candidate) {
  await open(page, candidate); await page.setViewportSize({ width: 360, height: 900 });
  await page.locator('#schedule-start-date').fill('2028-01-31');
  await page.getByLabel('Term in calendar months', { exact: true }).fill('3');
  await page.getByLabel('Rent per payment', { exact: true }).fill('9007199254740991.99');
  const region = page.getByRole('region', { name: 'Rent payment schedule; scroll horizontally to view all columns', exact: true });
  const before = await region.evaluate(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth, scrollLeft: e.scrollLeft }));
  assert.ok(before.scrollWidth > before.width, 'Extreme amount fixture must exercise real inner overflow');
  // Reach the region by actual Tab navigation from the preceding select.
  await page.getByLabel('Payment frequency', { exact: true }).focus();
  await page.keyboard.press('Tab');
  const dueOption = page.getByLabel('Use a due-date anchor from my agreement', {exact:true});
  if (await dueOption.count()) {
    assert.equal(await dueOption.evaluate(e => document.activeElement === e), true, 'W14 due option is keyboard reachable before the table');
    await page.keyboard.press('Tab');
  }
  assert.equal(await region.evaluate(e => document.activeElement === e), true);
  const focus = await region.evaluate(e => ({ visible: e.matches(':focus-visible'), outline: getComputedStyle(e).outlineStyle, shadow: getComputedStyle(e).boxShadow }));
  assert.equal(focus.visible, true);
  assert.ok(focus.shadow !== 'none' || !['none', 'hidden'].includes(focus.outline), 'Focused scroll region must have a visible indicator');
  for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250); // Allow native smooth keyboard scrolling to settle.
  const after = await region.evaluate(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth, scrollLeft: e.scrollLeft }));
  assert.ok(after.scrollLeft > before.scrollLeft, 'ArrowRight must scroll the focused table');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Only table, not page, may overflow');
  assert.match(await region.innerText(), /9,007,199,254,740,991\.99/);
  await shot(page, 'w04-keyboard-scroll-360');
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button', { name: 'Download calendar (.ics)', exact: true }).evaluate(e => e === document.activeElement), true, 'Tab must leave the scroll region');
  return { before, after, focus, noKeyboardTrap: true };
}

try {
  for (const configuredCandidate of candidates) {
    const candidate = localOrigin ? { ...configuredCandidate, origin: localOrigin } : configuredCandidate;
    const result = { ...candidate, ...(localOrigin ? { sha: null, referenceCandidateSha: configuredCandidate.sha, note: 'Local assembled source; reference SHA is not claimed as served commit' } : {}), gates: [] }; report.candidates.push(result);
    const tests = [];
    if (candidate.id !== 'w04') for (const mode of ['corrupt', 'unavailable']) tests.push({ name: `storage-${mode}`, mode, run: page => storageCase(page, candidate, mode) });
    if (candidate.id === 'w01') tests.push({ name: 'long-labels-and-csv', run: page => listingCase(page, candidate) });
    if (candidate.id === 'w03') tests.push({ name: 'payday-calendar-edges', run: page => paycheckCase(page, candidate) });
    if (candidate.id === 'w04') tests.push({ name: 'keyboard-scroll', run: page => calendarKeyboardCase(page, candidate) });
    for (const test of tests) {
      const { context, page, events, errors } = await contextFor(candidate, test.mode);
      const gate = { name: test.name, pass: false };
      result.gates.push(gate);
      try { gate.evidence = await test.run(page); assert.deepEqual(errors, [], 'Unexpected browser page errors'); gate.pass = true; }
      catch (error) { gate.error = safeError(error); await shot(page, `${candidate.id}-${test.name}-failure`).catch(() => {}); }
      finally { gate.pageErrors = errors; gate.network = events; await context.close(); }
      console.log(`${candidate.id}: ${gate.pass ? 'PASS' : 'FAIL'} ${test.name}${gate.error ? ' — ' + gate.error : ''}`);
      await fs.writeFile(path.join(output, 'focused-report.json'), JSON.stringify(report, null, 2));
    }
  }
} finally { await browser.close(); }
report.finished = new Date().toISOString();
await fs.writeFile(path.join(output, 'focused-report.json'), JSON.stringify(report, null, 2));
const failures = report.candidates.flatMap(c => c.gates.filter(g => !g.pass).map(g => c.id + ':' + g.name));
console.log(JSON.stringify({ gates: report.candidates.reduce((n, c) => n + c.gates.length, 0), failures, report: path.join(output, 'focused-report.json') }));
process.exitCode = failures.length ? 1 : 0;
