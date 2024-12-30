import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup:  './tests/global-setup',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Record video of failed tests
    video: 'retain-on-failure',
    // Capture screenshot of failed tests
    screenshot: 'only-on-failure',
    storageState: 'playwright/.auth/user.json',
    headless: true,
  },

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
