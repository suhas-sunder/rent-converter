import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual route's parser and rational conversion functions.
const source = readFileSync('app/routes/home.tsx', 'utf8');
const pure = source.slice(source.indexOf('const SCALE ='), source.indexOf('function safeEnvIsDev'));
const { outputText } = ts.transpileModule(pure, { compilerOptions: { target: ts.ScriptTarget.ES2022 } });
const api = vm.runInNewContext(`${outputText}\n({parseMoneyToScaled, convertRational, fromScaledUnits, toScaledUnits, roundScaledToDigits, scaledToDecimalString})`);

test('home rejects unsupported characters instead of silently changing the rent', () => {
  for (const raw of ['1e3', '12abc', '100/2', '1+2', '(100', '100)', '1,2.50', '1.2,50', '12 34', '$1$2']) {
    assert.equal(api.parseMoneyToScaled(raw).ok, false, raw);
  }
});

test('home preserves supported formatted inputs and six-decimal precision', () => {
  assert.equal(api.parseMoneyToScaled('$1,250.').scaled,1250000000n);
  assert.equal(api.parseMoneyToScaled('1.250,').scaled,1250000000n);
  for (const [raw, scaled] of [['1250',1250000000n], ['$1,250.50',1250500000n], ['1.250,50',1250500000n], ['1 250.50',1250500000n], ['1250,50',1250500000n], ['.5',500000n], ['12.',12000000n], ['0.123456',123456n], ['+12',12000000n], ['0',0n]]) {
    assert.equal(api.parseMoneyToScaled(raw).scaled, scaled, raw);
  }
  for (const raw of ['', '-1', '(100)', '1,2', '1,234,56', '1000000001']) {
    assert.equal(api.parseMoneyToScaled(raw).ok, false, raw);
  }
});

test('all 49 period pairs preserve exact round trips and verified display examples', () => {
  const periods = ['hourly','daily','weekly','biweekly','every_4_weeks','monthly','annual'];
  for (const amount of [0n, 1n, 123456n, 500000000n, 1000000000000000n]) {
    const original = api.fromScaledUnits(amount);
    for (const from of periods) for (const to of periods) {
      const converted = api.convertRational(original, from, to);
      const back = api.convertRational(converted, to, from);
      assert.equal(back.n * original.d, original.n * back.d, `${from} -> ${to}`);
    }
  }
  const money = (amount, from, to) => api.scaledToDecimalString(api.roundScaledToDigits(api.toScaledUnits(api.convertRational(api.fromScaledUnits(amount),from,to)),2),2,{fixed:true});
  assert.equal(money(500000000n,'weekly','monthly'),'2172.62');
  assert.equal(money(2000000000n,'every_4_weeks','annual'),'26071.43');
  assert.equal(money(2000000000n,'every_4_weeks','monthly'),'2172.62');
});
