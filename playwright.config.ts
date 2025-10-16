import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Electron apps should run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker for Electron
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'electron',
      testDir: './tests/e2e',
    },
  ],
  // Electron-specific configuration
  // No browsers needed - Electron uses embedded Chromium
  // Set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 to skip browser downloads
});
