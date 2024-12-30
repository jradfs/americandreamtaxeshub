import { test, expect } from '@playwright/test';

test.describe('Basic Client Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/clients');
  });

  test('should add new client', async ({ page }) => {
    // Click new client button
    await page.getByRole('button', { name: 'New Client' }).click();

    // Fill basic client details
    await page.getByLabel('Name').fill('Test Client');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone').fill('555-0123');

    // Submit form
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify client was created
    await expect(page.getByText('Test Client')).toBeVisible();
  });

  test('should view client details', async ({ page }) => {
    // Click on existing client
    await page.getByText('Test Client').click();

    // Verify basic information is visible
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByText('555-0123')).toBeVisible();
  });

  test('should edit client', async ({ page }) => {
    // Find and click edit button
    await page.getByText('Test Client').hover();
    await page.getByRole('button', { name: 'Edit' }).click();

    // Update basic information
    await page.getByLabel('Phone').fill('555-9876');

    // Save changes
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify update
    await expect(page.getByText('555-9876')).toBeVisible();
  });
});
