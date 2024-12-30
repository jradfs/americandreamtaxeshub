import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/projects')
    
    // Create a test project if needed
    const projectExists = await page.getByText('Test Project').isVisible()
    if (!projectExists) {
      await page.getByRole('button', { name: 'New Project' }).click()
      await page.getByLabel('Project Name').fill('Test Project')
      await page.getByRole('button', { name: 'Create Project' }).click()
    }
  })

  test('should create a new task', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Add new task
    await page.getByRole('button', { name: 'Add Task' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    
    // Fill task details
    await page.getByLabel('Task Name').fill('Test Task')
    await page.getByLabel('Description').fill('Test task description')
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'To Do' }).click()
    await page.getByLabel('Due Date').fill('2024-12-31')
    
    // Assign task
    await page.getByRole('combobox', { name: 'Assignee' }).click()
    await page.getByRole('option').first().click()
    
    // Create task
    await page.getByRole('button', { name: 'Create Task' }).click()
    
    // Verify task was created
    await expect(page.getByText('Test Task')).toBeVisible()
    await expect(page.getByText('Test task description')).toBeVisible()
  })

  test('should update task status', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Find task and update status
    await page.getByRole('checkbox', { name: 'Test Task' }).click()
    
    // Verify status update
    await expect(page.getByTestId('task-status')).toContainText('Done')
  })

  test('should edit task details', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Open task edit dialog
    await page.getByRole('button', { name: 'Edit Task' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    
    // Update task details
    await page.getByLabel('Task Name').fill('Updated Task')
    await page.getByLabel('Description').fill('Updated description')
    
    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click()
    
    // Verify updates
    await expect(page.getByText('Updated Task')).toBeVisible()
    await expect(page.getByText('Updated description')).toBeVisible()
  })

  test('should delete a task', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Create task to delete if needed
    const taskExists = await page.getByText('Task to Delete').isVisible()
    if (!taskExists) {
      await page.getByRole('button', { name: 'Add Task' }).click()
      await page.getByLabel('Task Name').fill('Task to Delete')
      await page.getByRole('button', { name: 'Create Task' }).click()
    }
    
    // Delete task
    await page.getByRole('button', { name: 'Delete Task' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    
    // Verify task was deleted
    await expect(page.getByText('Task to Delete')).not.toBeVisible()
  })

  test('should handle task dependencies', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Create dependent tasks
    await page.getByRole('button', { name: 'Add Task' }).click()
    await page.getByLabel('Task Name').fill('Parent Task')
    await page.getByRole('button', { name: 'Create Task' }).click()
    
    await page.getByRole('button', { name: 'Add Task' }).click()
    await page.getByLabel('Task Name').fill('Child Task')
    
    // Set dependency
    await page.getByRole('combobox', { name: 'Dependencies' }).click()
    await page.getByRole('option', { name: 'Parent Task' }).click()
    await page.getByRole('button', { name: 'Create Task' }).click()
    
    // Verify dependency
    await expect(page.getByTestId('dependency-indicator')).toBeVisible()
  })

  test('should filter tasks', async ({ page }) => {
    // Open project details
    await page.getByText('Test Project').click()
    
    // Open filter menu
    await page.getByRole('button', { name: 'Filter Tasks' }).click()
    
    // Apply status filter
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'In Progress' }).click()
    
    // Apply assignee filter
    await page.getByRole('combobox', { name: 'Assignee' }).click()
    await page.getByRole('option').first().click()
    
    // Verify filtered results
    await expect(page.getByTestId('task-list')).toBeVisible()
  })
})
