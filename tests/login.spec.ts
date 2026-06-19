import {test, expect, Locator} from '@playwright/test';

test('should login successfully', async ({page}) => {
  await page.goto('https://www.rbcroyalbank.com/ways-to-bank/online-banking/index.html');
  await expect(page).toHaveTitle(/RBC Royal Bank/);
  const clock: Locator = page.getByAltText('Clock icon');
  await expect(clock).toBeVisible();

  const button: Locator = page.getByRole('button', {name: 'Sign in to R B C Online Banking'});
  await expect(button).toBeVisible();

  This is my change for payments
  another change

});

