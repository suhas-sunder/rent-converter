import assert from 'node:assert/strict';
const text = page => page.locator('body').innerText();
export async function setup(page, id) {
  if (id === 'urgent' || id === 'w01') await page.getByRole('textbox', {name:'Rent amount',exact:true}).fill('500');
  if (id === 'w01') {
    await page.getByRole('button', {name:'Add a listing',exact:true}).click();
    await page.locator('#listing-3-name').fill('Third listing — utilities included');
    await page.locator('#listing-3-rent').fill('2250');
    assert.match(await text(page), /2,272\.62/);
  }
  if (id === 'w02') {
    await page.getByText('Check your take-home housing budget', {exact:true}).click();
    for (const [name,value] of [['Monthly take-home income','4000'],['Rent','500'],['Utilities','300'],['Insurance','120'],['Monthly non-housing commitments','1000'],['Monthly savings target','500']]) await page.getByLabel(name,{exact:true}).fill(value);
    for (const [name,value] of [['Rent billing period','Weekly'],['Utilities billing period','Every 3 months'],['Insurance billing period','Yearly']]) await page.getByLabel(name,{exact:true}).selectOption({label:value});
    assert.match(await text(page), /2,282\.62/);
    assert.match(await text(page), /217\.38/);
  }
  if (id === 'w03') {
    await page.getByText('Plan for your next rent due date',{exact:true}).click();
    await page.getByLabel('Already saved for this payment (USD)',{exact:true}).fill('500');
    await page.getByLabel('Next payday',{exact:true}).fill('2027-01-08');
    await page.getByLabel('Rent due date',{exact:true}).fill('2027-02-01');
    await page.getByRole('button',{name:'Calculate deadline plan',exact:true}).click();
    assert.match(await text(page), /1,500\.00 still needed across 2 paydays/);
  }
  if (id === 'w04') {
    await page.locator('#schedule-start-date').fill('2028-01-31');
    await page.getByLabel('Term in calendar months',{exact:true}).fill('3');
    await page.getByLabel('Rent per payment',{exact:true}).fill('1800.25');
    await page.getByRole('button',{name:'Download calendar (.ics)',exact:true}).waitFor();
    assert.match(await text(page), /2028-02-29/);
  }
}
