import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
  });

  test('should display task list', async ({ page }) => {
    // Verify tasks section is visible
    await expect(page.getByTestId('tasks-section')).toBeVisible();
    
    // Verify at least one task is displayed
    await expect(page.getByTestId('task-item').nth(0)).toBeVisible();
  });

  test('should allow creating a new task', async ({ page }) => {
    // Click create task button
    await page.getByTestId('create-task-button').click();
    
    // Verify create form is visible
    await expect(page.getByTestId('task-create-form')).toBeVisible();
    
    // Fill in task details
    await page.getByTestId('task-name-input').fill('New Task');
    await page.getByTestId('task-description-input').fill('Task Description');
    
    // Save task
    await page.getByTestId('save-task-button').click();
    
    // Verify new task is displayed
    await expect(page.getByText('New Task')).toBeVisible();
  });

  test('should allow marking task as complete', async ({ page }) => {
    // Click complete button on first task
    await page.getByTestId('complete-task-button').nth(0).click();
    
    // Verify task is marked as complete
    await expect(page.getByTestId('task-status').nth(0)).toHaveText('Complete');
  });

  test('should allow editing a task', async ({ page }) => {
    // Click edit button on first task
    await page.getByTestId('edit-task-button').nth(0).click();
    
    // Verify edit form is visible
    await expect(page.getByTestId('task-edit-form')).toBeVisible();
    
    // Update task details
    await page.getByTestId('task-name-input').fill('Updated Task');
    await page.getByTestId('task-description-input').fill('Updated Description');
    
    // Save changes
    await page.getByTestId('save-task-button').click();
    
    // Verify task is updated
    await expect(page.getByText('Updated Task')).toBeVisible();
    await expect(page.getByText('Updated Description')).toBeVisible();
  });

  test('should allow deleting a task', async ({ page }) => {
    // Get initial task count
    const initialTaskCount = await page.getByTestId('task-item').count();
    
    // Click delete button on first task
    await page.getByTestId('delete-task-button').nth(0).click();
    
    // Confirm deletion
    await page.getByTestId('confirm-delete-button').click();
    
    // Verify task is removed
    await expect(page.getByTestId('task-item')).toHaveCount(initialTaskCount - 1);
  });

  test('should filter tasks by status', async ({ page }) => {
    // Filter by complete tasks
    await page.getByTestId('filter-complete').click();
    await expect(page.getByTestId('task-status').nth(0)).toHaveText('Complete');
    
    // Filter by incomplete tasks
    await page.getByTestId('filter-incomplete').click();
    await expect(page.getByTestId('task-status').nth(0)).toHaveText('Incomplete');
  });

  test('should sort tasks by due date', async ({ page }) => {
    // Sort by due date ascending
    await page.getByTestId('sort-due-date-asc').click();
    const firstDateText = await page.getByTestId('task-due-date').nth(0).textContent();
    const secondDateText = await page.getByTestId('task-due-date').nth(1).textContent();
    
    if (firstDateText && secondDateText) {
      const firstDate = new Date(firstDateText);
      const secondDate = new Date(secondDateText);
      expect(firstDate <= secondDate).toBeTruthy();
    } else {
      throw new Error('Task due dates not found');
    }
    
    // Sort by due date descending
    await page.getByTestId('sort-due-date-desc').click();
    const firstDateDescText = await page.getByTestId('task-due-date').nth(0).textContent();
    const secondDateDescText = await page.getByTestId('task-due-date').nth(1).textContent();
    
    if (firstDateDescText && secondDateDescText) {
      const firstDateDesc = new Date(firstDateDescText);
      const secondDateDesc = new Date(secondDateDescText);
      expect(firstDateDesc >= secondDateDesc).toBeTruthy();
    } else {
      throw new Error('Task due dates not found');
    }
  });

  test('should sort tasks by priority', async ({ page }) => {
    // Sort by priority ascending
    await page.getByTestId('sort-priority-asc').click();
    const firstPriorityText = await page.getByTestId('task-priority').nth(0).textContent();
    const secondPriorityText = await page.getByTestId('task-priority').nth(1).textContent();
    
    if (firstPriorityText && secondPriorityText) {
      const firstPriority = Number(firstPriorityText);
      const secondPriority = Number(secondPriorityText);
      expect(firstPriority <= secondPriority).toBeTruthy();
    } else {
      throw new Error('Task priorities not found');
    }
    
    // Sort by priority descending
    await page.getByTestId('sort-priority-desc').click();
    const firstPriorityDescText = await page.getByTestId('task-priority').nth(0).textContent();
    const secondPriorityDescText = await page.getByTestId('task-priority').nth(1).textContent();
    
    if (firstPriorityDescText && secondPriorityDescText) {
      const firstPriorityDesc = Number(firstPriorityDescText);
      const secondPriorityDesc = Number(secondPriorityDescText);
      expect(firstPriorityDesc >= secondPriorityDesc).toBeTruthy();
    } else {
      throw new Error('Task priorities not found');
    }
  });

  test('should handle invalid task creation', async ({ page }) => {
    // Click create task button
    await page.getByTestId('create-task-button').click();
    
    // Try to save without required fields
    await page.getByTestId('save-task-button').click();
    
    // Verify error messages
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Description is required')).toBeVisible();
  });

  test('should handle task update failure', async ({ page }) => {
    // Click edit button on first task
    await page.getByTestId('edit-task-button').nth(0).click();
    
    // Clear required fields
    await page.getByTestId('task-name-input').fill('');
    await page.getByTestId('task-description-input').fill('');
    
    // Try to save invalid data
    await page.getByTestId('save-task-button').click();
    
    // Verify error messages
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Description is required')).toBeVisible();
  });
});
