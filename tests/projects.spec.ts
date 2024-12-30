import { test, expect } from '@playwright/test';

test.describe('Project Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific project page
    await page.goto('/projects/8c40d585-9b52-443f-8ebc-74c464e7e03');
  });

  test('should load project details', async ({ page }) => {
    // Verify project name is displayed
    await expect(page.getByTestId('project-name')).toBeVisible();
    
    // Verify project description is displayed
    await expect(page.getByTestId('project-description')).toBeVisible();
  });

  test('should display associated tasks', async ({ page }) => {
    // Verify tasks section is visible
    await expect(page.getByTestId('tasks-section')).toBeVisible();
    
    // Verify at least one task is displayed
    await expect(page.getByTestId('task-item').nth(0)).toBeVisible();
  });

  test('should allow editing project details', async ({ page }) => {
    // Click edit button
    await page.getByTestId('edit-project-button').click();
    
    // Verify edit form is visible
    await expect(page.getByTestId('project-edit-form')).toBeVisible();
    
    // Update project name
    await page.getByTestId('project-name-input').fill('Updated Project Name');
    
    // Save changes
    await page.getByTestId('save-project-button').click();
    
    // Verify updated name is displayed
    await expect(page.getByTestId('project-name')).toHaveText('Updated Project Name');
  });
});
