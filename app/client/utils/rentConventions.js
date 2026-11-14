import { parseHousingMoney } from './housingBudget.js';
const SCALE = 1_000_000_000_000n;
/** @typedef {'weekly' | 'monthly'} ConventionDirection */
/** @param {bigint} n @param {bigint} d */
function cents(n, d) { return (n * 100n + d * SCALE / 2n) / (d * SCALE); }
/** Compare equivalent amounts, never payment dates or legal rent obligations.
 * @param {string} raw @param {ConventionDirection} direction
 */
export function compareRentConventions(raw, direction) {
  const parsed = parseHousingMoney(raw, 'Rent amount in GBP');
  if (!parsed.ok) return parsed;
  if (direction !== 'weekly' && direction !== 'monthly') return { ok: false, error: 'Choose weekly or calendar-month rent.' };
  const weekly = direction === 'weekly';
  const budget = cents(parsed.units * (weekly ? 52n : 12n), weekly ? 12n : 52n);
  const daily = cents(parsed.units * (weekly ? 365n : 84n), weekly ? 84n : 365n);
  const difference = budget > daily ? budget - daily : daily - budget;
  return {ok: true, budget, daily, difference, fourWeeks: weekly ? cents(parsed.units * 4n, 1n) : null};
}
