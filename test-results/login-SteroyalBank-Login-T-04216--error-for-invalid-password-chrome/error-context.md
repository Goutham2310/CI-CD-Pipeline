# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> SteroyalBank Login Tests >> TC003: Should display error for invalid password
- Location: src\tests\login.spec.ts:100:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active]:
  - generic:
    - generic:
      - generic:
        - generic [ref=e2]:
          - paragraph [ref=e3]:
            - generic "RBC Logo" [ref=e4]:
              - img "RBC" [ref=e5]
          - heading "Secure Sign-In" [level=1] [ref=e10]
          - heading "RBC Online Banking" [level=2] [ref=e11]
        - main [ref=e13]:
          - generic [ref=e15]:
            - generic [ref=e17]:
              - paragraph [ref=e18]:
                - generic "Session Expired Icon" [ref=e19]:
                  - img "warning" [ref=e20]
              - heading "Your request was blocked for security reasons" [level=3] [ref=e22]
              - paragraph [ref=e23]: "[SDC5178:BD:2]"
              - heading "Please contact the RBC Advice Centre so that we can help." [level=2] [ref=e24]:
                - text: Please contact the RBC Advice Centre
                - text: so that we can help.
              - heading "Give us a call at" [level=5] [ref=e25]
              - heading "1-800-769-2555" [level=2] [ref=e26]:
                - link "1-800-769-2555" [ref=e27] [cursor=pointer]:
                  - /url: tel:18007692555
            - generic [ref=e31]:
              - generic [ref=e33]:
                - text: Back to Secure Sign-In
                - generic [ref=e38] [cursor=pointer]:
                  - text: Other Online Services
                  - img [ref=e40]
              - contentinfo [ref=e42]:
                - generic [ref=e43]:
                  - generic [ref=e44]:
                    - generic [ref=e46]: RBC Online Banking is provided by Royal Bank of Canada.
                    - generic [ref=e47]: Royal Bank of Canada Website, © 1995-2026
                    - generic [ref=e48]:
                      - generic [ref=e49] [cursor=pointer]:
                        - text: Legal
                        - img [ref=e51]
                        - generic [ref=e52]: Opens in a new Tab
                      - generic [ref=e53] [cursor=pointer]:
                        - text: Accessibility
                        - img [ref=e55]
                        - generic [ref=e56]: Opens in a new Tab
                      - generic [ref=e57] [cursor=pointer]:
                        - text: Privacy & Security
                        - img [ref=e59]
                        - generic [ref=e60]: Opens in a new Tab
                  - generic [ref=e62] [cursor=pointer]: Advertising & Cookies
  - form
```

# Test source

```ts
  13  |   password: string;
  14  |   description: string;
  15  | }
  16  | 
  17  | // Load test data
  18  | const loginTestData = TestDataManager.loadTestData<Record<string, LoginCredentials>>('loginTestData');
  19  | 
  20  | test.describe('SteroyalBank Login Tests', () => {
  21  |   let loginPage: LoginPage;
  22  | 
  23  |   test.beforeEach(async ({ page }) => {
  24  |     Logger.info('Starting new test...');
  25  |     loginPage = new LoginPage(page);
  26  |     await loginPage.goto();
  27  |   });
  28  | 
  29  |   test.afterEach(async ({ page }, testInfo) => {
  30  |     if (testInfo.status !== 'passed') {
  31  |       Logger.error(`Test failed: ${testInfo.title}`);
  32  |       await Logger.takeScreenshot(page, 'failure', testInfo.title);
  33  |     }
  34  |   });
  35  | 
  36  |   // ========== POSITIVE TEST CASES ==========
  37  | 
  38  |   test('TC001: Should login successfully with valid credentials', async ({ page }) => {
  39  |     Logger.testStart('TC001: Valid Login');
  40  |     Logger.step('Verify login page is displayed');
  41  |     
  42  |     const isDisplayed = await loginPage.isLoginPageDisplayed();
  43  |     expect(isDisplayed).toBe(true);
  44  |     Logger.step('Login page displayed successfully');
  45  | 
  46  |     Logger.step('Get test data for valid credentials');
  47  |     const testData = loginTestData['valid_credentials'];
  48  |     Logger.debug(`Using credentials: ${testData.username}`);
  49  | 
  50  |     Logger.step('Fill login form');
  51  |     await loginPage.login(testData.username, testData.password);
  52  |     Logger.step('Login form filled and submitted');
  53  | 
  54  |     // Wait for navigation or success indicator
  55  |     Logger.step('Wait for login to complete');
  56  |     try {
  57  |       // Try to wait for navigation with a timeout
  58  |       await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {
  59  |         // Navigation might not trigger, that's okay
  60  |       });
  61  |     } catch (error) {
  62  |       // Navigation handling
  63  |     }
  64  |     
  65  |     // Give page time to load after navigation
  66  |     await page.waitForTimeout(3000);
  67  |     
  68  |     // Verify successful login (adjust based on actual app behavior)
  69  |     Logger.step('Verify login was successful');
  70  |     const currentUrl = page.url();
  71  |     expect(currentUrl).not.toContain('signin');
  72  |     Logger.info('Login successful - URL changed from signin page');
  73  | 
  74  |     Logger.testEnd('TC001: Valid Login', 'PASSED');
  75  |   });
  76  | 
  77  |   test('TC002: Should display error for invalid username', async ({ page }) => {
  78  |     Logger.testStart('TC002: Invalid Username');
  79  |     
  80  |     const testData = loginTestData['invalid_username'];
  81  |     Logger.step(`Logging in with invalid username: ${testData.username}`);
  82  |     
  83  |     await loginPage.login(testData.username, testData.password);
  84  |     
  85  |     Logger.step('Wait for error message');
  86  |     await page.waitForTimeout(2000);
  87  |     
  88  |     Logger.step('Check if error message is visible');
  89  |     const hasError = await loginPage.isErrorMessageVisible();
  90  |     expect(hasError).toBe(true);
  91  |     
  92  |     Logger.step('Get error message text');
  93  |     const errorMessage = await loginPage.getErrorMessage();
  94  |     expect(errorMessage).toBeTruthy();
  95  |     Logger.info(`Error message displayed: ${errorMessage}`);
  96  |     
  97  |     Logger.testEnd('TC002: Invalid Username', 'PASSED');
  98  |   });
  99  | 
  100 |   test('TC003: Should display error for invalid password', async ({ page }) => {
  101 |     Logger.testStart('TC003: Invalid Password');
  102 |     
  103 |     const testData = loginTestData['invalid_password'];
  104 |     Logger.step(`Logging in with invalid password`);
  105 |     
  106 |     await loginPage.login(testData.username, testData.password);
  107 |     
  108 |     Logger.step('Wait for error message');
  109 |     await page.waitForTimeout(2000);
  110 |     
  111 |     Logger.step('Check if error message is visible');
  112 |     const hasError = await loginPage.isErrorMessageVisible();
> 113 |     expect(hasError).toBe(true);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  114 |     
  115 |     Logger.step('Get error message text');
  116 |     const errorMessage = await loginPage.getErrorMessage();
  117 |     expect(errorMessage).toBeTruthy();
  118 |     Logger.info(`Error message displayed: ${errorMessage}`);
  119 |     
  120 |     Logger.testEnd('TC003: Invalid Password', 'PASSED');
  121 |   });
  122 | });
```