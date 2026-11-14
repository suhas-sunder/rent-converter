import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {generateRecurrenceDates, parseCalendarDate} from '../app/client/utils/calendarDate.js';

const read = file => fs.readFileSync(file, 'utf8');
function compile(file, dependencies = {}) {
  const module = {exports: {}};
  const js = ts.transpileModule(read(file), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(js, {exports:module.exports,module,require:key=>{assert.ok(key in dependencies,key);return dependencies[key];}});
  return module.exports;
}
const math = compile('app/client/utils/rentMath.ts');
const examples = compile('app/client/data/verifiedPeriodExamples.ts', {'~/client/utils/rentMath':math});

test('visible example registry agrees with fixed independently calculated cents', () => {
  for (const example of examples.verifiedPeriodExamples) {
    assert.equal(example.result, example.expected, example.id);
    assert.ok(read('public/sitemap.xml').includes(example.route), example.route);
  }
  assert.equal(examples.fourWeekExample.annual, 2607143n);
  assert.equal(examples.fourWeekExample.monthly, 217262n);
  assert.equal(examples.fourWeekExample.thirteenPayments, 2600000n);
  assert.equal(examples.fourWeekExample.daysCovered, 364);
});

test('example equivalents agree with the separate actual home rational engine', () => {
  const source = read('app/routes/home.tsx');
  const pure = source.slice(source.indexOf('const SCALE ='),source.indexOf('function safeEnvIsDev'));
  const js=ts.transpileModule(pure,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
  const api=vm.runInNewContext(js+'\n({convertRational,fromScaledUnits,toScaledUnits,roundScaledToDigits,scaledToDecimalString})');
  for(const [from,to,amount,want] of [['weekly','monthly',500000000n,'2172.62'],['weekly','annual',500000000n,'26071.43'],['monthly','weekly',2000000000n,'460.27'],['biweekly','monthly',1000000000n,'2172.62'],['every_4_weeks','monthly',2000000000n,'2172.62']]){
    const actual=api.scaledToDecimalString(api.roundScaledToDigits(api.toScaledUnits(api.convertRational(api.fromScaledUnits(amount),from,to)),2),2,{fixed:true});
    assert.equal(actual,want,from+' to '+to);
  }
});

test('calendar year counts are not fractional rate equivalents or always thirteen', () => {
  const date=s=>parseCalendarDate(s).date;
  assert.equal(generateRecurrenceDates(date('2027-01-01'),date('2028-01-01'),'every-4-weeks').length,14);
  assert.equal(generateRecurrenceDates(date('2027-01-02'),date('2028-01-01'),'every-4-weeks').length,13);
});

test('four-week supporting copy uses verified output and labels the 364-day distinction', () => {
  const source=read('app/client/components/rent-paid-every-4-weeks-calculator/HowItWorks.tsx');
  assert.match(source,/fourWeekExample\.monthly/);
  assert.doesNotMatch(source,/\$26,000 per year|creates 13 payments per year|4 weekly to monthly calculator, 28 day billing/);
  assert.match(source,/\/rent-schedule-calculator/);
  assert.match(read('app/routes/methodology.tsx'),/verifiedPeriodExamples\.map/);
});

