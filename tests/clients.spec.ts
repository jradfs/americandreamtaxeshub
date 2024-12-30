import { test, expect } from '@playwright/test';

test.describe('Client Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific client page
    await page.goto('/clients/f33d3f90-7632-42c8-9da1-ecdc39444c47');
  });

  test('should load client details', async ({ page }) => {
    // Verify client name is displayed
    await expect(page.getByTestId('client-name')).toBeVisible();
    
    // Verify client email is displayed
    await expect(page.getByTestId('client-email')).toBeVisible();
  });

  test('should display associated projects', async ({ page }) => {
    // Verify projects section is visible
    await expect(page.getByTestId('projects-section')).toBeVisible();
    
    // Verify at least one project is displayed
    await expect(page.getByTestId('project-item').nth(0)).toBeVisible();
  });

  test('should allow editing client details', async ({ page }) => {
    // Click edit button
    await page.getByTestId('edit-client-button').click();
    
    // Verify edit form is visible
    await expect(page.getByTestId('client-edit-form')).toBeVisible();
    
    // Update client name
    await page.getByTestId('client-name-input').fill('Updated Client Name');
    
    // Save changes
    await page.getByTestId('save-client-button').click();
    
    // Verify updated name is displayed
    await expect(page.getByTestId('client-name')).toHaveText('Updated Client Name');
  });
});
