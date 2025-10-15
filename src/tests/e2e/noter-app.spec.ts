import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
        args: ['dist/main/main/main.js'],
        timeout: 30000
    });

    // Get first window
    page = await electronApp.firstWindow();

    // Wait for the app to load
    await page.waitForLoadState('domcontentloaded');
});

test.afterAll(async () => {
    await electronApp.close();
});

test.describe('Noter App E2E Tests', () => {
    test('should launch and show main window', async () => {
        // Check if the app window exists
        expect(page).toBeTruthy();

        // Check app title
        await expect(page).toHaveTitle(/Noter/);
    });

    test('should create a new note', async () => {
        // Wait for the floating action button
        const fabButton = page.locator('[data-testid="fab-button"]');
        await expect(fabButton).toBeVisible({ timeout: 10000 });

        // Click to create new note
        await fabButton.click();

        // Check if editor appears
        const editor = page.locator('[data-testid="note-editor"]');
        await expect(editor).toBeVisible();
    });

    test('should type content in note editor', async () => {
        // Find the editor textarea
        const editorTextarea = page.locator('textarea[placeholder*="note"]');

        if (await editorTextarea.isVisible()) {
            // Type some content
            await editorTextarea.fill('# Test Note\n\nThis is a test note created by E2E test.');

            // Verify content was typed
            await expect(editorTextarea).toHaveValue(/Test Note/);
        }
    });

    test('should show notes in sidebar', async () => {
        // Wait a bit for auto-save
        await page.waitForTimeout(3000);

        // Check if note appears in sidebar
        const noteInSidebar = page.locator('[data-testid="note-item"]').first();

        // The note should be visible
        await expect(noteInSidebar).toBeVisible();
    });

    test('should search for notes', async () => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="search" i]');

        if (await searchInput.isVisible()) {
            // Type search query
            await searchInput.fill('test');

            // Should show filtered results
            await page.waitForTimeout(1000);
            const searchResults = page.locator('[data-testid="note-item"]');
            await expect(searchResults.first()).toBeVisible();
        }
    });
});

test.describe('Noter App Stability Tests', () => {
    test('should handle rapid note creation', async () => {
        const fabButton = page.locator('[data-testid="fab-button"]');

        // Create multiple notes quickly
        for (let i = 0; i < 3; i++) {
            await fabButton.click();
            await page.waitForTimeout(500);
        }

        // App should still be responsive
        await expect(fabButton).toBeVisible();
    });

    test('should handle app resize', async () => {
        // Resize window
        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(500);

        // App should still be functional
        const fabButton = page.locator('[data-testid="fab-button"]');
        await expect(fabButton).toBeVisible();

        // Resize back
        await page.setViewportSize({ width: 1200, height: 800 });
    });
});
