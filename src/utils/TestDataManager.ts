import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Manager
 * Loads and manages test data from JSON files
 */
export class TestDataManager {
  private static readonly DATA_DIR = path.join(process.cwd(), 'data');

  /**
   * Load test data from JSON file
   * @param filename - Name of the JSON file without extension
   * @returns Parsed JSON data
   */
  static loadTestData<T>(filename: string): T {
    const filePath = path.join(this.DATA_DIR, `${filename}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  /**
   * Load specific test case from JSON file
   * @param filename - Name of the JSON file without extension
   * @param testCaseName - Name of the test case key
   * @returns Test case data
   */
  static getTestCase<T>(filename: string, testCaseName: string): T {
    const data = this.loadTestData<Record<string, T>>(filename);
    
    if (!data[testCaseName]) {
      throw new Error(`Test case not found: ${testCaseName} in ${filename}.json`);
    }

    return data[testCaseName];
  }

  /**
   * Get all test cases from a file
   * @param filename - Name of the JSON file without extension
   * @returns Array of all test cases
   */
  static getAllTestCases<T>(filename: string): T[] {
    const data = this.loadTestData<Record<string, T>>(filename);
    return Object.values(data);
  }

  /**
   * Get test case entries with names
   * @param filename - Name of the JSON file without extension
   * @returns Array of [name, data] tuples
   */
  static getTestCasesWithNames<T>(filename: string): Array<[string, T]> {
    const data = this.loadTestData<Record<string, T>>(filename);
    return Object.entries(data);
  }
}
