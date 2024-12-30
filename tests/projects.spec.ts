import { test, expect } from '@playwright/test'

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/projects')
  })

  test('should create a new project', async ({ page }) => {
    // Click new project button
    await page.getByRole('button', { name: 'New Project' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill project form
    await page.getByLabel('Project Name').fill('Test Project')
    await page.getByLabel('Description').fill('Test project description')
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'In Progress' }).click()
    await page.getByLabel('Due Date').fill('2024-12-31')
    
    // Select client
    await page.getByRole('combobox', { name: 'Client' }).click()
    await page.getByRole('option').first().click()
    
    // Select template
    await page.getByRole('combobox', { name: 'Template' }).click()
    await page.getByRole('option').first().click()

    // Submit form
    await page.getByRole('button', { name: 'Create Project' }).click()

    // Verify project was created
    await expect(page.getByText('Test Project')).toBeVisible()
    await expect(page.getByText('Test project description')).toBeVisible()
  })

  test('should edit an existing project', async ({ page }) => {
    // Click edit on first project
    await page.getByRole('button', { name: 'Edit' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Update project details
    await page.getByLabel('Project Name').fill('Updated Project')
    await page.getByLabel('Description').fill('Updated description')
    
    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click()

    // Verify updates
    await expect(page.getByText('Updated Project')).toBeVisible()
    await expect(page.getByText('Updated description')).toBeVisible()
  })

  test('should delete a project', async ({ page }) => {
    const projectName = 'Project to Delete'
    
    // Create project to delete
    await page.getByRole('button', { name: 'New Project' }).click()
    await page.getByLabel('Project Name').fill(projectName)
    await page.getByRole('button', { name: 'Create Project' }).click()
    
    // Verify project exists
    await expect(page.getByText(projectName)).toBeVisible()
    
    // Delete project
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    
    // Verify project was deleted
    await expect(page.getByText(projectName)).not.toBeVisible()
  })

  test('should handle project list refresh error', async ({ page }) => {
    // Mock API error
    await page.route('**/api/projects', route => 
      route.fulfill({ status: 500, body: 'Server error' })
    )
    
    // Try to refresh projects
    await page.getByRole('button', { name: 'Refresh' }).click()
    
    // Verify error message
    await expect(page.getByText('Failed to refresh projects')).toBeVisible()
  })

  test('should filter projects', async ({ page }) => {
    // Open filter menu
    await page.getByRole('button', { name: 'Filter' }).click()
    
    // Apply status filter
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'In Progress' }).click()
    
    // Apply client filter
    await page.getByRole('combobox', { name: 'Client' }).click()
    await page.getByRole('option').first().click()
    
    // Verify filtered results
    await expect(page.getByTestId('project-list')).toBeVisible()
  })
})
