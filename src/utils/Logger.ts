import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Logger Utility
 * Provides structured logging for test execution
 */
export class Logger {
  private static readonly LOGS_DIR = path.join(process.cwd(), 'reports', 'logs');
  private static initialized = false;

  private static initialize(): void {
    if (!this.initialized) {
      if (!fs.existsSync(this.LOGS_DIR)) {
        fs.mkdirSync(this.LOGS_DIR, { recursive: true });
      }
      this.initialized = true;
    }
  }

  /**
   * Get formatted timestamp
   */
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Get log file path
   */
  private static getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.LOGS_DIR, `test-${date}.log`);
  }

  /**
   * Write to file
   */
  private static writeToFile(message: string): void {
    this.initialize();
    const logMessage = `[${this.getTimestamp()}] ${message}\n`;
    fs.appendFileSync(this.getLogFilePath(), logMessage);
  }

  /**
   * Info level log
   */
  static info(message: string): void {
    const log = `[INFO] ${message}`;
    console.log(log);
    this.writeToFile(log);
  }

  /**
   * Error level log
   */
  static error(message: string, error?: Error): void {
    const log = `[ERROR] ${message}${error ? ': ' + error.message : ''}`;
    console.error(log);
    this.writeToFile(log);
    if (error?.stack) {
      this.writeToFile(`Stack: ${error.stack}`);
    }
  }

  /**
   * Warning level log
   */
  static warn(message: string): void {
    const log = `[WARN] ${message}`;
    console.warn(log);
    this.writeToFile(log);
  }

  /**
   * Debug level log
   */
  static debug(message: string): void {
    const log = `[DEBUG] ${message}`;
    console.debug(log);
    this.writeToFile(log);
  }

  /**
   * Test case start
   */
  static testStart(testName: string): void {
    const log = `\n${'='.repeat(80)}\n[TEST START] ${testName}\n${'='.repeat(80)}`;
    console.log(log);
    this.writeToFile(log);
  }

  /**
   * Test case end
   */
  static testEnd(testName: string, status: 'PASSED' | 'FAILED'): void {
    const log = `[TEST ${status}] ${testName}\n${'='.repeat(80)}\n`;
    console.log(log);
    this.writeToFile(log);
  }

  /**
   * Step execution log
   */
  static step(stepName: string): void {
    const log = `  → ${stepName}`;
    console.log(log);
    this.writeToFile(log);
  }

  /**
   * Take screenshot with metadata
   */
  static async takeScreenshot(page: Page, name: string, testName: string): Promise<void> {
    const screenshotDir = path.join(process.cwd(), 'reports', 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${name}-${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);
    
    await page.screenshot({ path: filepath });
    this.info(`Screenshot saved: ${filename}`);
  }
}
