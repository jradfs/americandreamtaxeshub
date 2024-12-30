import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('http://localhost:3000/login');

  // Fill in the email and password fields
  await page.fill('#signin-email', 'jr@adfs.tax');
  await page.fill('#signin-password', 'Install55!!');

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for navigation to the dashboard
  await page.waitForURL(/.*\/dashboard/);
  
  await page.screenshot({ path: 'playwright/login-screenshot.png' });

  // Save the authentication state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();
}

export default globalSetup;
