# SteroyalBank Automation Suite

Professional Playwright + TypeScript automation framework for SteroyalBank login testing with enterprise-grade practices.

## 🎯 Features

✅ **Page Object Model (POM)** - Reusable and maintainable page objects  
✅ **JSON Test Data** - Externalized test data management  
✅ **TypeScript** - Full type safety and IntelliSense support  
✅ **Comprehensive Logging** - Structured logging with file persistence  
✅ **Parallel Execution** - Run tests across multiple browsers  
✅ **Report Generation** - HTML, JSON, and JUnit reports  
✅ **Screenshot & Video** - Failure capture for debugging  
✅ **Scalable Architecture** - Easy to extend and maintain  

## 📁 Project Structure

```
├── src/
│   ├── pages/              # Page Object Models
│   │   └── LoginPage.ts    # Login page interactions
│   ├── tests/              # Test specifications
│   │   └── login.spec.ts   # Login test suite
│   └── utils/              # Utilities
│       ├── Logger.ts       # Logging utility
│       └── TestDataManager.ts
├── data/                   # Test data
│   └── loginTestData.json  # Login test cases
├── reports/                # Test reports
│   ├── html/              # HTML reports
│   ├── screenshots/       # Failure screenshots
│   └── logs/              # Test logs
├── config/                # Configuration files
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run debug mode
npm run test:debug

# Run only login tests
npm run test:login

# Generate HTML report
npm run test:report
```

### 3. View Reports

Reports are automatically generated in:
- **HTML Report**: `reports/html/index.html`
- **Test Screenshots**: `reports/screenshots/`
- **Test Logs**: `reports/logs/`

## 📝 Test Data Management

Test data is stored in JSON format for easy management and reusability.

### Using Test Data

```typescript
import { TestDataManager } from '../utils/TestDataManager';

// Load specific test case
const testData = TestDataManager.getTestCase('loginTestData', 'valid_credentials');

// Get all test cases
const allCases = TestDataManager.getAllTestCases('loginTestData');

// Get test cases with names
const casesWithNames = TestDataManager.getTestCasesWithNames('loginTestData');
```

### Adding New Test Cases

Edit `data/loginTestData.json`:

```json
{
  "new_test_case": {
    "username": "user@example.com",
    "password": "Password123!",
    "description": "Description of the test case"
  }
}
```

## 🧪 Test Cases

### Login Tests (10 Test Cases)

| ID | Test Case | Status |
|---|---|---|
| TC001 | Valid credentials login | ✅ |
| TC002 | Invalid username error | ✅ |
| TC003 | Invalid password error | ✅ |
| TC004 | Empty credentials validation | ✅ |
| TC005 | Remember Me functionality | ✅ |
| TC006 | Username field interaction | ✅ |
| TC007 | Password field clear | ✅ |
| TC008 | Special characters handling | ✅ |
| TC009 | Case sensitivity | ✅ |
| TC010 | Whitespace handling | ✅ |

### Parametrized Tests

All test data entries are automatically parametrized for comprehensive coverage.

## 📋 Page Object Model - LoginPage

```typescript
await loginPage.goto();                              // Navigate to login
await loginPage.login(username, password);           // Login action
await loginPage.fillUsername(username);              // Fill username
await loginPage.fillPassword(password);              // Fill password
await loginPage.clickRememberMe();                   // Check Remember Me
await loginPage.clickSignIn();                       // Submit form
const error = await loginPage.getErrorMessage();     // Get error text
const visible = await loginPage.isErrorMessageVisible();
const displayed = await loginPage.isLoginPageDisplayed();
```

## 🔍 Logging

The Logger utility provides structured logging:

```typescript
import { Logger } from '../utils/Logger';

Logger.info('Test information');
Logger.error('Error message', error);
Logger.warn('Warning message');
Logger.debug('Debug information');
Logger.step('Test step');
Logger.testStart('Test Name');
Logger.testEnd('Test Name', 'PASSED');
await Logger.takeScreenshot(page, 'name', 'testName');
```

## 🛠️ Adding New Pages

1. Create a new page file in `src/pages/`

```typescript
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeText = page.locator('h1');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }
}
```

2. Use it in your tests:

```typescript
import { DashboardPage } from '../pages/DashboardPage';

const dashboard = new DashboardPage(page);
await dashboard.goto();
```

## 🧪 Adding New Tests

1. Create a new test file in `src/tests/`
2. Follow the structure of `login.spec.ts`
3. Use existing utilities and page objects

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../utils/Logger';

test('My test case', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  Logger.step('Step 1');
  // Your test code
});
```

## 🔧 Configuration

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Browser settings
- Timeouts
- Retry logic
- Reporter options
- Device configurations

### Test Data

Modify `data/loginTestData.json` to add or update test cases.

## 📊 Reports

### HTML Report
```bash
npm run test:report
```

Opens interactive HTML report with:
- Test summary
- Pass/fail details
- Screenshots
- Execution duration

### JSON Report
Located at `reports/results.json` - for CI/CD integration

### JUnit Report
Located at `reports/junit.xml` - for Jenkins/Azure DevOps

## 🔐 Environment Variables

Create `.env` file:

```env
# Configuration
HEADLESS=true
DEBUG=false
CI=false
```

## 💡 Best Practices

✅ Use Page Object Model for all page interactions  
✅ Store test data in JSON files  
✅ Use meaningful test names  
✅ Add logging for debugging  
✅ Take screenshots on failure  
✅ Keep tests independent  
✅ Use descriptive assertions  
✅ Clean up after tests  

## 🚨 Troubleshooting

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify element locators

### Elements not found
- Update locators in page objects
- Check for dynamic element loading
- Use `waitFor()` where needed

### Login fails
- Verify credentials in `loginTestData.json`
- Check application login flow
- Review browser console for errors

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Run `npm run lint` before committing

## 📄 License

ISC

---

**Last Updated**: 2024  
**Framework Version**: 1.0.0  
**Target URL**: https://secure.steroyalbank.com
