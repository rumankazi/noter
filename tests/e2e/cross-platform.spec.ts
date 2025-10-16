import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';
import * as path from 'path';

/**
 * Cross-platform E2E tests for window management and UI behavior
 * Tests window resizing, moving, maximizing, and platform-specific features
 */

let electronApp: any;
let window: any;

test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
        args: [path.join(__dirname, '../../dist/main/main.js')],
        cwd: path.join(__dirname, '../../')
    });

    // Get the main window
    window = await electronApp.firstWindow();
});

test.afterAll(async () => {
    await electronApp?.close();
});

test.describe('Cross-Platform Window Management', () => {

    test('should load the application successfully', async () => {
        // Wait for the app to load
        await window.waitForLoadState('domcontentloaded');

        // Check that the app loads
        await expect(window.locator('h1')).toContainText('Noter');
        await expect(window.locator('h2')).toContainText('Hello World!');
    });

    test('should have correct initial window size', async () => {
        const size = await window.evaluate(() => ({
            width: window.outerWidth,
            height: window.outerHeight
        }));

        // Check initial size is within expected range
        expect(size.width).toBeGreaterThanOrEqual(800);
        expect(size.height).toBeGreaterThanOrEqual(600);
    });

    test('should be resizable', async () => {
        // Get initial size
        const initialSize = await window.evaluate(() => ({
            width: window.outerWidth,
            height: window.outerHeight
        }));

        // Test if window can be resized (this will depend on the platform)
        const isResizable = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            return mainWindow.isResizable();
        });

        expect(isResizable).toBe(true);
    });

    test('should be maximizable', async () => {
        const isMaximizable = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            return mainWindow.isMaximizable();
        });

        expect(isMaximizable).toBe(true);
    });

    test('should be minimizable', async () => {
        const isMinimizable = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            return mainWindow.isMinimizable();
        });

        expect(isMinimizable).toBe(true);
    });

    test('should respect minimum window size', async () => {
        const bounds = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            return mainWindow.getMinimumSize();
        });

        expect(bounds[0]).toBe(800); // minWidth
        expect(bounds[1]).toBe(600); // minHeight
    });

    test('should display platform information correctly', async () => {
        // Wait for platform info to load
        await window.waitForFunction(
            () => !document.querySelector('.info-item span')?.textContent?.includes('Loading'),
            { timeout: 10000 }
        );

        const platformElement = window.locator('.info-item:has-text("Platform:") span');
        const platformText = await platformElement.textContent();

        // Should be one of the supported platforms
        expect(['win32', 'darwin', 'linux']).toContain(platformText);
    });

    test('should have platform-specific CSS classes', async () => {
        // Wait for platform info to load
        await window.waitForFunction(
            () => !document.querySelector('.info-item span')?.textContent?.includes('Loading'),
            { timeout: 10000 }
        );

        const appElement = window.locator('.app');
        const classList = await appElement.getAttribute('class');

        // Should have platform-specific class
        const hasValidPlatformClass = ['macos', 'windows', 'linux'].some(platform =>
            classList?.includes(platform)
        );

        expect(hasValidPlatformClass).toBe(true);
    });

    test('should handle window controls appropriately', async () => {
        const windowControls = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            return {
                closable: mainWindow.isClosable(),
                minimizable: mainWindow.isMinimizable(),
                maximizable: mainWindow.isMaximizable(),
                fullScreenable: mainWindow.isFullScreenable()
            };
        });

        expect(windowControls.closable).toBe(true);
        expect(windowControls.minimizable).toBe(true);
        expect(windowControls.maximizable).toBe(true);
        expect(windowControls.fullScreenable).toBe(true);
    });

    test('should handle app quit functionality', async () => {
        // Test the quit button exists and is clickable
        const quitButton = window.locator('.quit-button');
        await expect(quitButton).toBeVisible();
        await expect(quitButton).toContainText('Quit Application');

        // Note: We don't actually click it as it would close the app
        // In a real test environment, you'd test this in isolation
    });

    test('should display real-time information', async () => {
        // Check that time updates
        const timeElement = window.locator('.info-item:has-text("Current Time:") span');
        const initialTime = await timeElement.textContent();

        // Wait a bit and check if time changed
        await window.waitForTimeout(2000);
        const updatedTime = await timeElement.textContent();

        // Time should have updated (different string)
        expect(updatedTime).not.toBe(initialTime);
        expect(updatedTime).not.toBe('');
        expect(updatedTime).not.toBe('Loading...');
    });
});
