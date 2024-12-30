import { test, expect } from '@playwright/test';

test.describe('American Dream Taxes Hub', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and handle login
    await page.goto('http://localhost:3000/login');
    
    // Wait for the login form to be visible
    await page.waitForSelector('form', { state: 'visible' });
    
    // Fill in the email and password fields
    await page.getByLabel('Email address').fill('jr@adfs.tax');
    await page.getByLabel('Password').fill('Install55!!');

    // Click the sign in button
    await page.getByRole('button', { name: /Sign in/i }).click();

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

    // Check for templates list
    await expect(page.getByRole('heading', { name: /templates/i })).toBeVisible();
  });

  test('should open and close client dialog', async ({ page }) => {
    // Navigate to clients page
    await page.goto('http://localhost:3000/clients');

    // Open new client dialog
    await page.getByRole('button', { name: /new client/i }).click();

    // Check dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close dialog
    await page.getByRole('button', { name: /close/i }).click();

    // Check dialog is not visible
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should open and close task dialog', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('http://localhost:3000/tasks');

    // Open new task dialog
    await page.getByRole('button', { name: /new task/i }).click();

    // Check dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close dialog
    await page.getByRole('button', { name: /close/i }).click();

    // Check dialog is not visible
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Click theme toggle button
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Check if theme was toggled (this depends on your theme implementation)
    // You might need to check for a specific class or attribute
  });
});
