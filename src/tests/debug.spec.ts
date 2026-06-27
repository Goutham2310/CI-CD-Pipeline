import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Debug: Check page structure', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await page.goto('https://steroy-al.bank/en/login');
  await page.waitForLoadState('domcontentloaded');
  
  // Take initial screenshot
  await page.screenshot({ path: 'debug-1-initial.png' });
  
  // Try to find all buttons
  const allButtons = await page.locator('button').all();
  console.log(`Total buttons found: ${allButtons.length}`);
  
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    const isVisible = await allButtons[i].isVisible().catch(() => false);
    console.log(`Button ${i}: "${text}" - Visible: ${isVisible}`);
  }
  
  // Try the specific button locator
  const nextButton = page.locator('button:has-text("Next")');
  const count = await nextButton.count();
  console.log(`Buttons matching 'button:has-text("Next")': ${count}`);
  
  // Try alternative selectors
  const nextAlt1 = page.locator('button', { hasText: 'Next' });
  const countAlt1 = await nextAlt1.count();
  console.log(`Buttons matching 'hasText: Next': ${countAlt1}`);
  
  const nextAlt2 = page.locator('//button[contains(text(), "Next")]');
  const countAlt2 = await nextAlt2.count();
  console.log(`Buttons matching XPath with Next: ${countAlt2}`);
});
