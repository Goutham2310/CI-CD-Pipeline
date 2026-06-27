/**
 * Test Configuration
 * Centralized configuration for all tests
 */

export const testConfig = {
  // URLs
  baseURL: process.env.BASE_URL || 'https://secure.steroyalbank.com',
  loginUrl: '/statics/login-service-ui/index#/full/signin?LANGUAGE=ENGLISH',

  // Timeouts (in milliseconds)
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT || '30000'),
  elementTimeout: parseInt(process.env.ELEMENT_TIMEOUT || '5000'),
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '10000'),

  // Credentials
  validUsername: process.env.VALID_USERNAME || 'test.user@example.com',
  validPassword: process.env.VALID_PASSWORD || 'SecurePassword123!',

  // Browser
  headless: process.env.HEADLESS !== 'false',
  debug: process.env.DEBUG === 'true',

  // Environment
  ci: process.env.CI === 'true',
  environment: process.env.ENVIRONMENT || 'local',

  // Reporting
  screenshotsOnFailure: process.env.REPORT_SCREENSHOTS !== 'false',
  videosOnFailure: process.env.REPORT_VIDEOS !== 'false',
  traceOnFailure: process.env.REPORT_TRACE !== 'false',

  // Retry
  maxRetries: parseInt(process.env.MAX_RETRIES || '0'),
  ciMaxRetries: parseInt(process.env.CI_MAX_RETRIES || '2'),

  // Test Data
  testDataDir: './data',
  reportsDir: './reports',
  logsDir: './reports/logs',
  screenshotsDir: './reports/screenshots',

  // Locator Strategies
  locators: {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    signIn: 'button:has-text("Sign In")',
    rememberMe: 'input[type="checkbox"]',
    errorMessage: '.alert-danger, [class*="error"]',
  },
};

export default testConfig;
