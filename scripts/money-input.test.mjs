import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

const source = readFileSync('app/client/utils/rentMath.ts', 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
const context = {exports:{}, Intl};
vm.runInNewContext(outputText, context);
const math = context.exports;

test('shared money parser never erases letters, arithmetic, negative notation or broken grouping', () => {
  for (const raw of ['1e3', '100/2', '12abc', '(100)', '1+2', '$1$2', '1,2,3', '1,2.50', '1.2,50', '12 34', '.', ',']) {
    assert.equal(math.parseMoneyToCents(raw).ok, false, raw);
  }
});
test('valid money formats retain cents and rounding', () => {
  assert.equal(math.parseMoneyToCents('+12').cents,1200n);
  assert.equal(math.parseMoneyToCents('$1,250.').cents,125000n);
  assert.equal(math.parseMoneyToCents('1.250,').cents,125000n);
  for (const [raw,cents] of [['0',0n],['1250',125000n],['$1,250.50',125050n],['1.250,50',125050n],['1 250.50',125050n],['1250,50',125050n],['1,250',125000n],['.5',50n],['12.',1200n],['1.005',101n],['999999.999999',100000000n]]) {
    assert.equal(math.parseMoneyToCents(raw).cents,cents,raw);
  }
  for (const raw of ['', '-10']) assert.equal(math.parseMoneyToCents(raw).ok,false);
});
test('protected PCM and all shared conversions retain verified numerical outputs', () => {
  assert.equal(math.monthlyToWeeklyCents(200000n),46027n);
  assert.equal(math.weeklyToMonthlyCents(50000n),217262n);
  assert.equal(math.weeklyToAnnualCents(50000n),2607143n);
  assert.equal(math.fourWeekToMonthlyCents(200000n),217262n);
  assert.equal(math.fortnightlyToMonthlyCents(100000n),217262n);
  for (const currency of math.SUPPORTED_CURRENCIES) {
    assert.ok(math.formatMoney(125050n,currency).length > 0,currency);
  }
});
