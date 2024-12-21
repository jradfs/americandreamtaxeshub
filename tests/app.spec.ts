import { test, expect } from '@playwright/test';

test.describe('American Dream Taxes Hub', () => {
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

  test('should show dashboard after login', async ({ page }) => {
    // After our mock login in beforeEach, we should be redirected to the dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check for dashboard components
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should navigate to clients page', async ({ page }) => {
    // Navigate to clients page
    await page.goto('http://localhost:3000/clients');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for client list
    await expect(page.getByRole('heading', { name: /clients/i })).toBeVisible();
  });

  test('should navigate to tasks page', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('http://localhost:3000/tasks');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for task list
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  });

  test('should navigate to templates page', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/templates');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for template list
    await expect(page.getByRole('heading', { name: /templates/i })).toBeVisible();
  });

  test('should open and close client dialog', async ({ page }) => {
    // Navigate to clients page
    await page.goto('http://localhost:3000/clients');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Click the "Add Client" button
    await page.getByRole('button', { name: /add client/i }).click();

    // Check if dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close dialog
    await page.keyboard.press('Escape');

    // Check if dialog is hidden
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should open and close task dialog', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('http://localhost:3000/tasks');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Click the "Add Task" button
    await page.getByRole('button', { name: /add task/i }).click();

    // Check if dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close dialog
    await page.keyboard.press('Escape');

    // Check if dialog is hidden
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');

    // Click the theme toggle button
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Check if theme has changed
    const body = page.locator('body');
    const initialTheme = await body.getAttribute('data-theme');
    
    // Click the theme toggle button
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Check if theme has changed
    const newTheme = await body.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });
});
