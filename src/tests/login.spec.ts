import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataManager } from '../utils/TestDataManager';
import { Logger } from '../utils/Logger';

/**
 * Login Test Suite
 * Comprehensive tests for SteroyalBank login functionality
 */

interface LoginCredentials {
  username: string;
  password: string;
  description: string;
}

// Load test data
const loginTestData = TestDataManager.loadTestData<Record<string, LoginCredentials>>('loginTestData');

test.describe('SteroyalBank Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    Logger.info('Starting new test...');
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      Logger.error(`Test failed: ${testInfo.title}`);
      await Logger.takeScreenshot(page, 'failure', testInfo.title);
    }
  });

  // ========== POSITIVE TEST CASES ==========

  test('TC001: Should login successfully with valid credentials', async ({ page }) => {
    Logger.testStart('TC001: Valid Login');
    Logger.step('Verify login page is displayed');
    
    const isDisplayed = await loginPage.isLoginPageDisplayed();
    expect(isDisplayed).toBe(true);
    Logger.step('Login page displayed successfully');

    Logger.step('Get test data for valid credentials');
    const testData = loginTestData['valid_credentials'];
    Logger.debug(`Using credentials: ${testData.username}`);

    Logger.step('Fill login form');
    await loginPage.login(testData.username, testData.password);
    Logger.step('Login form filled and submitted');

    // Wait for navigation or success indicator
    Logger.step('Wait for login to complete');
    try {
      // Try to wait for navigation with a timeout
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {
        // Navigation might not trigger, that's okay
      });
    } catch (error) {
      // Navigation handling
    }
    
    // Give page time to load after navigation
    await page.waitForTimeout(3000);
    
    // Verify successful login (adjust based on actual app behavior)
    Logger.step('Verify login was successful');
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('signin');
    Logger.info('Login successful - URL changed from signin page');

    Logger.testEnd('TC001: Valid Login', 'PASSED');
  });

  test('TC002: Should display error for invalid username', async ({ page }) => {
    Logger.testStart('TC002: Invalid Username');
    
    const testData = loginTestData['invalid_username'];
    Logger.step(`Logging in with invalid username: ${testData.username}`);
    
    await loginPage.login(testData.username, testData.password);
    
    Logger.step('Wait for error message');
    await page.waitForTimeout(2000);
    
    Logger.step('Check if error message is visible');
    const hasError = await loginPage.isErrorMessageVisible();
    expect(hasError).toBe(true);
    
    Logger.step('Get error message text');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    Logger.info(`Error message displayed: ${errorMessage}`);
    
    Logger.testEnd('TC002: Invalid Username', 'PASSED');
  });

  test('TC003: Should display error for invalid password', async ({ page }) => {
    Logger.testStart('TC003: Invalid Password');
    
    const testData = loginTestData['invalid_password'];
    Logger.step(`Logging in with invalid password`);
    
    await loginPage.login(testData.username, testData.password);
    
    Logger.step('Wait for error message');
    await page.waitForTimeout(2000);
    
    Logger.step('Check if error message is visible');
    const hasError = await loginPage.isErrorMessageVisible();
    expect(hasError).toBe(true);
    
    Logger.step('Get error message text');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    Logger.info(`Error message displayed: ${errorMessage}`);
    
    Logger.testEnd('TC003: Invalid Password', 'PASSED');
  });
});