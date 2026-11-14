import { calculateCompoundIncrease } from './generatedTools.js';

/** Compare whole years of monthly payments. Year 1 uses the starting rent;
 * the first increase happens after those twelve payments. Round each annual
 * monthly-rent step to cents, using the established compound calculator.
 * @param {bigint} startingRent @param {number} rate @param {number} alternativeRate @param {number} years */
export function compareIncreaseCosts(startingRent, rate, alternativeRate, years) {
  if (typeof startingRent !== 'bigint' || startingRent < 0n || !Number.isInteger(years) || years < 1 || years > 100
      || [rate, alternativeRate].some(n => !Number.isFinite(n) || n < 0 || n > 100)) throw new RangeError('Enter valid rent, rates from 0 to 100, and 1–100 whole years.');
  const primary = calculateCompoundIncrease(startingRent, rate, years);
  const alternative = calculateCompoundIncrease(startingRent, alternativeRate, years);
  const rows = primary.rows.slice(0, years).map((row, index) => ({
    year: index + 1,
    monthly: row.rent,
    alternativeMonthly: alternative.rows[index].rent,
    annual: row.rent * 12n,
    alternativeAnnual: alternative.rows[index].rent * 12n,
    difference: (row.rent - alternative.rows[index].rent) * 12n,
  }));
  const total = rows.reduce((sum, row) => sum + row.annual, 0n);
  const alternativeTotal = rows.reduce((sum, row) => sum + row.alternativeAnnual, 0n);
  return { rows, total, alternativeTotal, difference: total - alternativeTotal,
    finalMonthly: primary.finalRent, alternativeFinalMonthly: alternative.finalRent };
}

/** Values are generated internally; currency is a fixed supported code.
 * @param {ReturnType<typeof compareIncreaseCosts>} result @param {string} currency
 * @param {number} rate @param {number} alternativeRate */
export function increaseComparisonCsv(result, currency, rate, alternativeRate) {
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError('Invalid currency');
  const money = (/** @type {bigint} */ cents) => `${cents < 0n ? '-' : ''}${(cents < 0n ? -cents : cents) / 100n}.${String((cents < 0n ? -cents : cents) % 100n).padStart(2,'0')}`;
  return [
    ['Hypothetical monthly payments; first increase after 12 payments; annual step rounded to cents'],
    ['Currency',currency,'Primary annual percent',String(rate),'Comparison annual percent',String(alternativeRate)],
    ['Payment year','Primary monthly rent','Comparison monthly rent','Primary annual payments','Comparison annual payments','Primary minus comparison'],
    ...result.rows.map(r=>[String(r.year),money(r.monthly),money(r.alternativeMonthly),money(r.annual),money(r.alternativeAnnual),money(r.difference)]),
    ['Total','','',money(result.total),money(result.alternativeTotal),money(result.difference)],
  ].map(row=>row.join(',')).join('\r\n')+'\r\n';
}
