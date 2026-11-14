import { parseIncomeMoney } from './generatedIncome.js';
import { parseCalendarDate, differenceInCalendarDays } from './calendarDate.js';
/** @param {bigint} n @param {bigint} d */
function roundRatio(n,d){return (n+d/2n)/d;}
/** A receipt comparison on the explicitly chosen weekly/7 daily basis, not a legal ledger.
 * @param {{weeklyRent:string, firstDay:string, lastDay:string, payment:string}} input
 * @returns {{ok:false,errors:Record<string,string>} | {ok:true,days:number,fullWeeks:number,extraDays:number,expectedCents:bigint,paymentCents:bigint,differenceCents:bigint,fortnightCents:bigint,monthlyCents:bigint,weeklyCents:bigint}}
 */
export function calculateAustraliaCoverage(input){
 const rent=parseIncomeMoney(input.weeklyRent,'Weekly rent');
 const payment=parseIncomeMoney(input.payment,'Rent payment (excluding bond)',{allowZero:true});
 const start=parseCalendarDate(input.firstDay,'First covered day');
 const end=parseCalendarDate(input.lastDay,'Last covered day');
 /** @type {Record<string,string>} */
 const errors={};
 if(!rent.ok)errors.weeklyRent=rent.error;

 if(!payment.ok)errors.payment=payment.error;
 if(!start.ok)errors.firstDay=start.error;
 if(!end.ok)errors.lastDay=end.error;
 if(!rent.ok||!payment.ok||!start.ok||!end.ok||Object.keys(errors).length)return {ok:false,errors};
 const days=differenceInCalendarDays(start.date,end.date)+1;
 if(days<1||days>366)return {ok:false,errors:{lastDay:'Choose a last day on or after the first day, covering no more than 366 days.'}};
 const expectedCents=roundRatio(rent.cents*BigInt(days),7n);
 const paymentCents=payment.cents;
 return {ok:true,days,fullWeeks:Math.floor(days/7),extraDays:days%7,expectedCents,paymentCents,differenceCents:paymentCents-expectedCents,weeklyCents:rent.cents,fortnightCents:rent.cents*2n,monthlyCents:roundRatio(rent.cents*365n,84n)};
}
