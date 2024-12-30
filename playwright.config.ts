import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './tests/global-setup',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Record video of failed tests
    video: 'retain-on-failure',
    // Capture screenshot of failed tests
    screenshot: 'only-on-failure',
    storageState: 'playwright/.auth/user.json',
    // Run tests in headless mode by default
    headless: true,
    // Viewport size
    viewport: { width: 1280, height: 720 },
    // Automatically wait for elements
    actionTimeout: 10000,
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Increase timeout for dev server startup
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
