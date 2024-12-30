import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Create auth directory if it doesn't exist
  const authDir = path.join(process.cwd(), 'playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  try {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');

    // Wait for the login form to be visible and interactable
    await page.waitForSelector('form', { state: 'visible', timeout: 10000 });

    // Fill in the email and password fields using label text
    await page.getByLabel('Email address').fill('jr@adfs.tax');
    await page.getByLabel('Password').fill('Install55!!');

    // Click the sign in button
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Wait for navigation and verify we're logged in
    await Promise.race([
      page.waitForURL(/.*\/dashboard/, { timeout: 10000 }),
      page.waitForSelector('text=Failed to sign in', { timeout: 10000 })
        .then(() => {
          throw new Error('Login failed - incorrect credentials or server error');
        })
    ]);

    // Take a screenshot for debugging
    await page.screenshot({ 
      path: path.join(authDir, 'login-success.png'),
      fullPage: true 
    });

    // Save the authentication state
    await page.context().storageState({ 
      path: path.join(authDir, 'user.json')
    });

    console.log('✓ Authentication successful');
  } catch (error) {
    console.error('Global setup failed:', error);
    
    // Take a screenshot of the failure state
    await page.screenshot({ 
      path: path.join(authDir, 'login-failure.png'),
      fullPage: true 
    });
    
    // Log the current URL and page content for debugging
    console.error('Current URL:', page.url());
    console.error('Page content:', await page.content());
    
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
