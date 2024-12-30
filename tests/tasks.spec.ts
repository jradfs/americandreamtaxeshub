import { test, expect } from '@playwright/test';

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/tasks');
  });

  test('should display tasks dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should create new task with full details', async ({ page }) => {
    // Click new task button
    await page.getByRole('button', { name: 'New Task' }).click();

    // Fill in task details
    await page.getByLabel('Title').fill('Test Task');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByLabel('Due Date').fill('2024-12-31');
    await page.getByLabel('Status').click();
    await page.getByRole('option', { name: 'In Progress' }).click();
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'High' }).click();

    // Submit form
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify task was created
    await expect(page.getByRole('cell', { name: 'Test Task' })).toBeVisible();
  });

  test('should filter tasks by multiple criteria', async ({ page }) => {
    // Apply status filter
    await page.getByLabel('Status').click();
    await page.getByRole('option', { name: 'In Progress' }).click();

    // Apply priority filter
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'High' }).click();

    // Apply search filter
    await page.getByPlaceholder('Search tasks...').fill('test');

    // Verify filtered results
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should update task status through drag and drop', async ({ page }) => {
    // Get first task
    const task = page.getByRole('row').nth(1);
    const initialStatus = await task.getByRole('cell').nth(2).textContent();

    // Click status dropdown
    await task.getByRole('cell').nth(2).click();
    
    // Select new status
    await page.getByRole('option', { name: 'In Progress' }).click();

    // Verify status changed
    await expect(task.getByRole('cell').nth(2)).not.toHaveText(initialStatus!);
  });

  test('should handle task dependencies', async ({ page }) => {
    // Open first task details
    await page.getByRole('row').nth(1).click();

    // Add dependency
    await page.getByRole('button', { name: 'Add Dependency' }).click();
    await page.getByRole('option').first().click();

    // Save changes
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify dependency added
    await expect(page.getByText('Dependencies')).toBeVisible();
  });

  test('should track time on task', async ({ page }) => {
    // Start timer on first task
    await page.getByRole('button', { name: 'Start Timer' }).first().click();

    // Wait briefly
    await page.waitForTimeout(2000);

    // Stop timer
    await page.getByRole('button', { name: 'Stop Timer' }).first().click();

    // Verify time tracked
    await expect(page.getByText(/Time Spent/)).toBeVisible();
  });

  test('should handle bulk actions', async ({ page }) => {
    // Select multiple tasks
    await page.getByRole('checkbox').nth(1).check();
    await page.getByRole('checkbox').nth(2).check();

    // Open bulk actions menu
    await page.getByRole('button', { name: 'Bulk Actions' }).click();

    // Change status for selected tasks
    await page.getByRole('menuitem', { name: 'Change Status' }).click();
    await page.getByRole('option', { name: 'In Progress' }).click();

    // Verify status updated
    await expect(page.getByRole('cell', { name: 'In Progress' })).toHaveCount(2);
  });

  test('should handle task comments', async ({ page }) => {
    // Open first task details
    await page.getByRole('row').nth(1).click();

    // Add comment
    await page.getByPlaceholder('Add a comment...').fill('Test comment');
    await page.getByRole('button', { name: 'Post' }).click();

    // Verify comment added
    await expect(page.getByText('Test comment')).toBeVisible();
  });
});
