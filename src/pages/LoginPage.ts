import { Page, Locator } from '@playwright/test';

/**
 * Login Page Object Model
 * Encapsulates all login page interactions and locators
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly nextButton: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly pageTitle: Locator;
  readonly acceptCookiesButton: Locator;
  readonly cookieModal: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Cookie modal locators
    this.cookieModal = page.locator('[class*="cookie"], [id*="cookie"], [class*="consent"], [class*="banner"]').first();
    this.acceptCookiesButton = page.locator(
      'button:has-text("Accept All Cookies"), button:has-text("Accept All"), button:has-text("Accept"), ' +
      'button[aria-label*="Accept"], [class*="accept"][class*="cookie"]'
    ).first();
    
    // Step 1: Username/Client Card field
    this.usernameInput = page.locator(
      'input[placeholder*="Client Card" i], input[placeholder*="Username" i], ' +
      'input[placeholder*="email" i], input[placeholder*="ID" i], input[name="username"], ' +
      '[aria-label*="username" i], [aria-label*="Client Card" i], input[type="text"]:not([id="vendor-search-handler"])'
    ).first();
    
    // Step 2: Password field (appears after clicking Next)
    this.passwordInput = page.locator(
      'input[placeholder*="password" i], input[type="password"], ' +
      '[aria-label*="password" i], input[name="password"], input[id="password"]'
    ).first();
    
    // Next button for multi-step form - use getByRole for better reliability
    // Note: Using getByRole with exact: false for case-insensitive matching
    this.nextButton = page.getByRole('button', { name: /next/i });
    
    // Sign In / Submit button
    this.signInButton = page.locator(
      'button:has-text("Sign In"), button:has-text("LOGIN"), button:has-text("Log In"), ' +
      'button:has-text("Signin"), button:has-text("Submit"), button[aria-label*="sign in" i]'
    ).first();
    
    this.rememberMeCheckbox = page.locator(
      'input[type="checkbox"]'
    ).first();
    
    this.errorMessage = page.getByRole('alert');
    
    this.forgotPasswordLink = page.locator(
      'a:has-text("Recover"), a:has-text("Forgot"), a:has-text("Reset"), a[aria-label*="forgot" i]'
    ).first();
    
    this.pageTitle = page.locator('h1, h2, [class*="title"], [class*="heading"]').first();
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/statics/login-service-ui/index#/full/signin?LANGUAGE=ENGLISH', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Handle cookie consent banner if it appears
    try {
      await this.dismissCookieBanner();
    } catch (error) {
      // Cookie banner may not appear on all loads, so don't fail
    }
  }

  /**
   * Dismiss cookie consent banner immediately when it appears
   */
  async dismissCookieBanner(): Promise<void> {
    try {
      // Approach 1: Try the X/close button first (fastest way to dismiss)
      try {
        const closeBtn = this.page.locator('button[aria-label*="Close"], [class*="close"][class*="cookie"]').first();
        const isVisible = await closeBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          await closeBtn.click({ force: true });
          await this.page.waitForTimeout(300);
          return;
        }
      } catch (e) {
        // Try next approach
      }
      
      // Approach 2: Use the accept all cookies button
      try {
        const acceptBtn = this.page.getByRole('button', { name: /accept all/i });
        const isVisible = await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          await acceptBtn.click({ force: true });
          await this.page.waitForTimeout(300);
          return;
        }
      } catch (e) {
        // Try next approach
      }
      
      // Approach 3: Try clicking by exact text content
      try {
        const acceptBtn = this.page.locator('button:has-text("Accept All Cookies")').first();
        const isVisible = await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          await acceptBtn.click({ force: true });
          await this.page.waitForTimeout(300);
          return;
        }
      } catch (e) {
        // Cookie banner may not be present
      }
    } catch (error) {
      // Cookie banner not present, continue silently
    }
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click on Remember Me checkbox
   */
  async clickRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.click();
  }

  /**
   * Check if Remember Me is selected
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Click Next button in multi-step form
   */
  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Perform login with username and password (multi-step form)
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    // Step 1: Enter username and click Next
    await this.fillUsername(username);
    await this.clickNext();
    
    // Dismiss cookie banner if it appears after Next
    try {
      await this.dismissCookieBanner();
    } catch {
      // Cookie banner may not appear
    }
    
    // Wait for password field to appear
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Step 2: Enter password
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.clickRememberMe();
    }
    
    // Step 3: Click Sign In
    await this.clickSignIn();
    
    // Dismiss cookie banner if it appears after Sign In
    try {
      await this.dismissCookieBanner();
    } catch {
      // Cookie banner may not appear
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      // Add extra wait for error message to appear after login attempt
      await this.page.waitForTimeout(2000);
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if login page is displayed (checks for username input field on initial page)
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    try {
      // Check if username input is visible (initial login page)
      await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get username input value
   */
  async getUsernameValue(): Promise<string | null> {
    return await this.usernameInput.inputValue();
  }

  /**
   * Get password input value
   */
  async getPasswordValue(): Promise<string | null> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Clear all login fields
   */
  async clearFields(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Click Forgot Password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Check if username field is focused
   */
  async isUsernameFocused(): Promise<boolean> {
    return await this.usernameInput.evaluate((el: HTMLElement) => el === document.activeElement);
  }
}
