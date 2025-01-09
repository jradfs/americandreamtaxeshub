import { test, expect } from '@playwright/test'

test.describe('Task Management System', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment and authenticate
    await page.goto('/tasks')
    // Add authentication steps here if needed
  })

  test('should display task list and pagination', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-list"]')

    // Check if tasks are displayed
    const tasks = await page.$$('[data-testid="task-item"]')
    expect(tasks.length).toBeGreaterThan(0)

    // Check pagination if there are multiple pages
    const pagination = await page.$('[data-testid="pagination"]')
    if (pagination) {
      // Click next page
      await page.click('[data-testid="next-page"]')
      // Wait for new tasks to load
      await page.waitForSelector('[data-testid="task-list"]')
      // Verify page change
      const currentPage = await page.$eval('[data-testid="current-page"]', el => el.textContent)
      expect(currentPage).toBe('2')
    }
  })

  test('should create a new task', async ({ page }) => {
    // Click create task button
    await page.click('[data-testid="create-task"]')

    // Fill out task form
    await page.fill('[data-testid="task-title"]', 'Test Task')
    await page.fill('[data-testid="task-description"]', 'Test Description')
    await page.selectOption('[data-testid="task-priority"]', 'high')
    await page.selectOption('[data-testid="task-status"]', 'todo')

    // Submit form
    await page.click('[data-testid="submit-task"]')

    // Wait for success message
    await page.waitForSelector('[data-testid="toast-success"]')

    // Verify task was created
    const taskTitle = await page.textContent('[data-testid="task-item"]:first-child [data-testid="task-title"]')
    expect(taskTitle).toBe('Test Task')
  })

  test('should update an existing task', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]')

    // Click edit button on first task
    await page.click('[data-testid="task-item"]:first-child [data-testid="edit-task"]')

    // Update task details
    await page.fill('[data-testid="task-title"]', 'Updated Task')
    await page.selectOption('[data-testid="task-status"]', 'in_progress')

    // Submit form
    await page.click('[data-testid="submit-task"]')

    // Wait for success message
    await page.waitForSelector('[data-testid="toast-success"]')

    // Verify task was updated
    const taskTitle = await page.textContent('[data-testid="task-item"]:first-child [data-testid="task-title"]')
    expect(taskTitle).toBe('Updated Task')
  })

  test('should delete a task', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]')

    // Get initial task count
    const initialTasks = await page.$$('[data-testid="task-item"]')
    const initialCount = initialTasks.length

    // Click delete button on first task
    await page.click('[data-testid="task-item"]:first-child [data-testid="delete-task"]')

    // Confirm deletion
    await page.click('[data-testid="confirm-delete"]')

    // Wait for success message
    await page.waitForSelector('[data-testid="toast-success"]')

    // Verify task was deleted
    const remainingTasks = await page.$$('[data-testid="task-item"]')
    expect(remainingTasks.length).toBe(initialCount - 1)
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate network error by disabling network
    await page.route('**/api/tasks/**', route => route.abort())

    // Try to create a task
    await page.click('[data-testid="create-task"]')
    await page.fill('[data-testid="task-title"]', 'Test Task')
    await page.click('[data-testid="submit-task"]')

    // Verify error message is displayed
    await page.waitForSelector('[data-testid="toast-error"]')
    const errorMessage = await page.textContent('[data-testid="toast-error"]')
    expect(errorMessage).toContain('Failed to create task')
  })

  test('should toggle task details', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]')

    // Click show details button
    await page.click('[data-testid="show-details"]')

    // Verify details are displayed
    const details = await page.$('[data-testid="task-details"]')
    expect(details).toBeTruthy()

    // Click hide details button
    await page.click('[data-testid="show-details"]')

    // Verify details are hidden
    const hiddenDetails = await page.$('[data-testid="task-details"]')
    expect(hiddenDetails).toBeFalsy()
  })
}) 