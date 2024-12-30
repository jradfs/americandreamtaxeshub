import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to projects page and wait for it to load
    await page.goto('http://localhost:3000/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('should display projects list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByText('Manage your active projects')).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    // Click new project button
    await page.getByRole('button', { name: 'New Project' }).click();

    // Wait for dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New Project' })).toBeVisible();

    // Fill in project details
    await page.getByLabel('Project Name').fill('Test Project');
    await page.getByLabel('Description').fill('Test Description');
    
    // Select client
    await page.getByRole('combobox', { name: 'Client' }).click();
    await page.getByRole('option').first().click();
    
    // Select template
    await page.getByRole('combobox', { name: 'Template' }).click();
    await page.getByRole('option').first().click();

    // Set status
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'In Progress' }).click();

    // Set due date
    const dueDate = format(new Date('2024-12-31'), 'PP');
    await page.getByRole('button', { name: 'Pick a due date' }).click();
    await page.getByRole('button', { name: dueDate }).click();

    // Submit form
    await page.getByRole('button', { name: 'Create Project' }).click();

    // Verify project was created
    await expect(page.getByText('Test Project')).toBeVisible();
  });

  test('should filter projects', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: 'Filter' }).click();
    
    // Apply status filter
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'In Progress' }).click();
    
    // Apply client filter
    await page.getByRole('combobox', { name: 'Client' }).click();
    await page.getByRole('option').first().click();
    
    // Apply filters
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    
    // Verify filters are applied
    await expect(page.getByText('Filtered Results')).toBeVisible();
  });

  test('should refresh project list', async ({ page }) => {
    await page.getByRole('button', { name: 'Refresh' }).click();
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page.getByRole('progressbar')).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle error states', async ({ page }) => {
    // Simulate error by triggering refresh with failed request
    await page.route('**/api/projects**', (route) => route.fulfill({
      status: 500,
      body: 'Server error'
    }));
    
    await page.getByRole('button', { name: 'Refresh' }).click();
    await expect(page.getByText('Failed to refresh projects')).toBeVisible();
  });

  test('should edit project', async ({ page }) => {
    // Click edit button on first project
    await page.getByRole('button', { name: 'Edit Project' }).first().click();
    
    // Wait for dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Project' })).toBeVisible();

    // Update project details
    await page.getByLabel('Project Name').fill('Updated Project');
    await page.getByLabel('Description').fill('Updated Description');

    // Submit form
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify project was updated
    await expect(page.getByText('Updated Project')).toBeVisible();
  });

  test('should delete project', async ({ page }) => {
    // Create a project to delete
    await test.step('Create project', async () => {
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByLabel('Project Name').fill('Project to Delete');
      await page.getByLabel('Description').fill('This project will be deleted');
      await page.getByRole('combobox', { name: 'Client' }).click();
      await page.getByRole('option').first().click();
      await page.getByRole('combobox', { name: 'Template' }).click();
      await page.getByRole('option').first().click();
      await page.getByRole('button', { name: 'Create Project' }).click();
      await expect(page.getByText('Project to Delete')).toBeVisible();
    });

    // Delete the project
    await test.step('Delete project', async () => {
      await page.getByRole('button', { name: 'Delete Project' }).first().click();
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(page.getByText('Project to Delete')).not.toBeVisible();
    });
  });
});
