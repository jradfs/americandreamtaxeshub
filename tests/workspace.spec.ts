import { test, expect } from '@playwright/test';

test.describe('Workspace Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and handle login
    await page.goto('http://localhost:3000/login');
    
    // Wait for the login button to be visible
    // await page.waitForSelector('button:has-text("Sign in with Google")');
    
    // Fill in the email and password fields
    await page.fill('#signin-email', 'jr@adfs.tax');
    await page.fill('#signin-password', 'Install55!!');

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation to the dashboard
    await page.waitForURL(/.*\/dashboard/);
  });

  test('should navigate to workspace tasks page', async ({ page }) => {
    // Navigate to workspace tasks page
    await page.goto('http://localhost:3000/workspace/tasks');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for task list
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  });

    test('should navigate to workspace projects page', async ({ page }) => {
    // Navigate to workspace projects page
    await page.goto('http://localhost:3000/workspace/projects');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for project list
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
  });
});
