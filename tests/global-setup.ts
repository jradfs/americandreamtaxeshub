import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Save signed-in state
  await page.goto('http://localhost:3000/login')
  await page.getByLabel('Email address').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('http://localhost:3000/dashboard')
  await page.context().storageState({ path: 'tests/.auth/user.json' })
  await browser.close()
}

export default globalSetup
