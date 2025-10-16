import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';
import * as path from 'path';

/**
 * E2E test for the Hello World Electron application
 * Verifies that the cross-platform desktop app loads and displays correctly
 */

let electronApp: any;
let window: any;

test.beforeAll(async () => {
  // Launch Electron app
  electronApp = await electron.launch({
    args: [path.join(__dirname, '../../dist/main/main.js')],
    cwd: path.join(__dirname, '../../'),
  });

  // Get the main window
  window = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp?.close();
});

test.describe('Noter Hello World App', () => {
  test('should display the main application', async () => {
    // Wait for the app to load
    await window.waitForLoadState('domcontentloaded');

    // Check that the main title is visible
    await expect(window.locator('h1')).toContainText('Noter');

    // Check that the welcome message is displayed
    await expect(window.locator('h2')).toContainText('Hello World!');

    // Check that app info is loaded
    await expect(window.locator('.info-grid')).toBeVisible();

    // Wait for version to load (should not be "Loading..." after a short time)
    await window.waitForFunction(
      () =>
        !document
          .querySelector('.info-item span')
          ?.textContent?.includes('Loading'),
      { timeout: 5000 }
    );
  });

  test('should display platform information', async () => {
    // Wait for platform info to load
    await window.waitForFunction(
      () =>
        !document
          .querySelector('.info-item span')
          ?.textContent?.includes('Loading'),
      { timeout: 5000 }
    );

    // Check that platform info is displayed
    const platformElement = window
      .locator('text=Platform:')
      .locator('..')
      .locator('span');
    await expect(platformElement).not.toContainText('Loading');
    await expect(platformElement).not.toContainText('Error');
  });

  test('should display version information', async () => {
    // Wait for version info to load
    await window.waitForFunction(
      () =>
        !document
          .querySelector('.info-item span')
          ?.textContent?.includes('Loading'),
      { timeout: 5000 }
    );

    // Check that version info is displayed
    const versionElement = window
      .locator('text=Version:')
      .locator('..')
      .locator('span');
    await expect(versionElement).not.toContainText('Loading');
    await expect(versionElement).not.toContainText('Error');
  });

  test('should update current time', async () => {
    // Get initial time
    const timeElement = window
      .locator('text=Current Time:')
      .locator('..')
      .locator('span');
    const initialTime = await timeElement.textContent();

    // Wait for time to update (should happen within 2 seconds)
    await window.waitForFunction(
      (initial: string) => {
        const infoItems = document.querySelectorAll('.info-item');
        const timeItem = Array.from(infoItems).find(item =>
          item.textContent?.includes('Current Time:')
        );
        const timeSpan = timeItem?.querySelector('span');
        return (
          timeSpan?.textContent !== initial && timeSpan?.textContent !== ''
        );
      },
      initialTime,
      { timeout: 3000 }
    );
  });

  test('should display feature list', async () => {
    // Check that feature list is visible
    await expect(window.locator('.feature-list')).toBeVisible();
    await expect(window.locator('.feature-list h3')).toContainText(
      'Coming Soon'
    );

    // Check that features are listed
    await expect(window.locator('.feature-list li')).toHaveCount(6);
  });
});
