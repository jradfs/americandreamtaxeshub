import { test, expect } from '@playwright/test';

test.describe('Basic Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
  });

  test('should create new project', async ({ page }) => {
    // Click new project button
    await page.getByRole('button', { name: 'New Project' }).click();

    // Fill project details
    await page.getByLabel('Name').fill('Test Project');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByLabel('Due Date').fill('2024-12-31');

    // Submit form
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify project was created
    await expect(page.getByText('Test Project')).toBeVisible();
  });

  test('should create project from template', async ({ page }) => {
    // Go to templates page
    await page.goto('http://localhost:3000/templates');
    
    // Create template
    await page.getByRole('button', { name: 'New Template' }).click();
    await page.getByLabel('Name').fill('Basic Template');
    await page.getByLabel('Description').fill('Template Description');
    
    // Add template tasks
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Task Name').fill('Task 1');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Task Name').fill('Task 2');
    
    // Save template
    await page.getByRole('button', { name: 'Save Template' }).click();
    
    // Use template to create project
    await page.goto('http://localhost:3000/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.getByRole('button', { name: 'Use Template' }).click();
    await page.getByText('Basic Template').click();
    
    // Fill project specific details
    await page.getByLabel('Name').fill('Project From Template');
    await page.getByLabel('Due Date').fill('2024-12-31');
    
    // Create project
    await page.getByRole('button', { name: 'Create' }).click();
    
    // Verify project and tasks were created
    await expect(page.getByText('Project From Template')).toBeVisible();
    await page.getByText('Project From Template').click();
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
  });

  test('should manage project tasks', async ({ page }) => {
    // Open project
    await page.getByText('Test Project').click();

    // Add task
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Task Name').fill('New Task');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify task was added
    await expect(page.getByText('New Task')).toBeVisible();

    // Mark task as complete
    await page.getByText('New Task').hover();
    await page.getByRole('checkbox').click();

    // Verify task status
    await expect(page.getByText('Completed')).toBeVisible();
  });
});
