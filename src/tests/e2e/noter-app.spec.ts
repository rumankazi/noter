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

        // Wait for the app to fully load
        const fabButton = page.locator('[data-testid="fab-button"]');
        await expect(fabButton).toBeVisible({ timeout: 10000 });
    }); test('should create, edit, and save a complete note', async () => {
        // Step 1: Click FAB to open create note dialog
        const fabButton = page.locator('[data-testid="fab-button"]');
        await expect(fabButton).toBeVisible();
        await fabButton.click();

        // Step 2: Handle the "Create New Note" dialog
        const titleInput = page.getByPlaceholder('Enter note title...');
        await expect(titleInput).toBeVisible({ timeout: 5000 });

        // Enter a title for the note
        await titleInput.fill('My Test Note');

        // Click the Create button
        const createButton = page.locator('button:has-text("Create")');
        await expect(createButton).toBeEnabled();
        await createButton.click();

        // Step 3: Check if editor appears after note creation
        const editor = page.locator('[data-testid="note-editor"]');
        await expect(editor).toBeVisible({ timeout: 5000 });

        // Step 4: Type content in the note
        const editorTextarea = page.locator('textarea[placeholder*="note"]');
        await expect(editorTextarea).toBeVisible();

        const testContent = 'This is a test note created by E2E test.\n\nIt has multiple lines and should be saved automatically.';
        await editorTextarea.fill(testContent);

        // Step 5: Verify content was typed
        await expect(editorTextarea).toHaveValue(/test note created by E2E test/);

        // Step 6: Wait for auto-save (give it time to save)
        await page.waitForTimeout(3000);

        // Step 7: Verify note appears in sidebar
        const noteInSidebar = page.locator('[data-testid="note-item"]').first();
        await expect(noteInSidebar).toBeVisible({ timeout: 5000 });

        // Step 8: Verify the note title appears in sidebar
        await expect(noteInSidebar).toContainText(/My Test Note/, { timeout: 5000 });
    });

    test('should search for the created note', async () => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="search" i]');
        await expect(searchInput).toBeVisible();

        // Type search query
        await searchInput.fill('test');
        await page.waitForTimeout(1000);

        // Should show filtered results
        const searchResults = page.locator('[data-testid="note-item"]');
        await expect(searchResults.first()).toBeVisible();

        // Verify search found our note
        await expect(searchResults.first()).toContainText(/My Test Note/);

        // Clear search to show all notes again
        await searchInput.fill('');
        await page.waitForTimeout(500);
    });

    test('should be able to select and view the created note', async () => {
        // Click on the note in sidebar to select it
        const noteInSidebar = page.locator('[data-testid="note-item"]').first();
        await expect(noteInSidebar).toBeVisible();
        await noteInSidebar.click();

        // Verify the editor shows the note content
        const editorTextarea = page.locator('textarea[placeholder*="note"]');
        await expect(editorTextarea).toBeVisible();
        await expect(editorTextarea).toHaveValue(/test note created by E2E test/);
        await expect(editorTextarea).toHaveValue(/multiple lines and should be saved/);
    });
});

test.describe('Noter App Stability Tests', () => {
    test('should handle creating multiple notes', async () => {
        const fabButton = page.locator('[data-testid="fab-button"]');

        // Create 3 additional notes with unique content
        for (let i = 1; i <= 3; i++) {
            // Click FAB to open dialog
            await fabButton.click();

            // Fill in title
            const titleInput = page.getByPlaceholder('Enter note title...');
            await expect(titleInput).toBeVisible();
            await titleInput.fill(`Test Note ${i}`);

            // Click Create
            const createButton = page.locator('button:has-text("Create")');
            await createButton.click();

            // Wait for editor to appear and add content
            const editorTextarea = page.locator('textarea[placeholder*="note"]');
            await expect(editorTextarea).toBeVisible();
            await editorTextarea.fill(`This is test note number ${i} with some content.`);
            await page.waitForTimeout(1000); // Wait for auto-save
        }

        // Verify we now have multiple notes in sidebar (original + 3 new ones)
        const allNotes = page.locator('[data-testid="note-item"]');
        await expect(allNotes).toHaveCount(4, { timeout: 5000 });

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
