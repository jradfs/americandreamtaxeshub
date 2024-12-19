import { test, expect } from '@playwright/test';

test('login and navigate to dashboard', async ({ page }) => {
  // Navigate to the login page
  await page.goto('http://localhost:3001/login');

  // Fill in the email and password fields
  console.log('Filling email field');
  await page.fill('#signin-email', 'jr@adfs.tax');
  console.log('Filling password field');
  await page.fill('#signin-password', 'Install55!!');

  // Click the login button
  console.log('Clicking login button');
  await page.click('button[type="submit"]');

  // Wait for navigation to the dashboard
  console.log('Waiting for navigation to dashboard');
  await page.waitForTimeout(1000);
  await page.waitForURL('http://localhost:3001/dashboard');

  // Assert that the dashboard is loaded
  console.log('Asserting dashboard URL and title');
  await expect(page).toHaveURL('http://localhost:3001/dashboard');
  await expect(page).toHaveTitle(/Dashboard/);
});
