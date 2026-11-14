/** @typedef {{ok:false,error:string}|{ok:true,newSavingsCents:bigint,availableCents:bigint,shortfallCents:bigint,surplusCents:bigint}} AverageCheckResult */
/**
 * Check a repeatable, cent-rounded saving amount against one actual bill.
 * Paydays come from the existing deadline planner, not a presumed annual count.
 * @param {{rentCents: bigint, savedCents: bigint, reserveCents: bigint, paydayCount: number}} input
 * @returns {AverageCheckResult}
 */
export function checkPaycheckAverage(input) {
  if (input.rentCents < 0n || input.savedCents < 0n || input.reserveCents < 0n || !Number.isInteger(input.paydayCount) || input.paydayCount < 0 || input.paydayCount > 54) {
    return { ok: false, error: "Use nonnegative amounts and a valid payday count." };
  }
  const newSavingsCents = input.reserveCents * BigInt(input.paydayCount);
  const availableCents = input.savedCents + newSavingsCents;
  const shortfallCents = input.rentCents > availableCents ? input.rentCents - availableCents : 0n;
  const surplusCents = availableCents > input.rentCents ? availableCents - input.rentCents : 0n;
  return { ok: true, newSavingsCents, availableCents, shortfallCents, surplusCents };
}
