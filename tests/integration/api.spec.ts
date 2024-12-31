import { test, expect } from '@playwright/test'

test.describe('API Integration Tests', () => {
  test.beforeEach(async ({ request }) => {
    // Clean up test data before each test
    await request.post('/api/test/cleanup')
  })

  test('should create and retrieve a project', async ({ request }) => {
    const project = {
      name: 'Integration Test Project',
      description: 'Test project for API integration',
      status: 'In Progress',
      dueDate: '2024-12-31',
      clientId: '1',
    }

    // Create project
    const createResponse = await request.post('/api/projects', {
      data: project,
    })
    expect(createResponse.ok()).toBeTruthy()
    const createdProject = await createResponse.json()
    expect(createdProject.name).toBe(project.name)

    // Retrieve project
    const getResponse = await request.get(`/api/projects/${createdProject.id}`)
    expect(getResponse.ok()).toBeTruthy()
    const retrievedProject = await getResponse.json()
    expect(retrievedProject).toEqual(createdProject)
  })

  test('should handle project updates', async ({ request }) => {
    // Create test project
    const createResponse = await request.post('/api/projects', {
      data: {
        name: 'Update Test Project',
        description: 'Project to test updates',
        status: 'To Do',
        dueDate: '2024-12-31',
        clientId: '1',
      },
    })
    const project = await createResponse.json()

    // Update project
    const updateResponse = await request.patch(`/api/projects/${project.id}`, {
      data: {
        name: 'Updated Project Name',
        status: 'In Progress',
      },
    })
    expect(updateResponse.ok()).toBeTruthy()
    const updatedProject = await updateResponse.json()
    expect(updatedProject.name).toBe('Updated Project Name')
    expect(updatedProject.status).toBe('In Progress')
  })

  test('should handle project deletion', async ({ request }) => {
    // Create test project
    const createResponse = await request.post('/api/projects', {
      data: {
        name: 'Project to Delete',
        description: 'This project will be deleted',
        status: 'To Do',
        dueDate: '2024-12-31',
        clientId: '1',
      },
    })
    const project = await createResponse.json()

    // Delete project
    const deleteResponse = await request.delete(`/api/projects/${project.id}`)
    expect(deleteResponse.ok()).toBeTruthy()

    // Verify project is deleted
    const getResponse = await request.get(`/api/projects/${project.id}`)
    expect(getResponse.status()).toBe(404)
  })

  test('should handle error cases', async ({ request }) => {
    // Test invalid project creation
    const invalidCreateResponse = await request.post('/api/projects', {
      data: {
        // Missing required fields
        description: 'Invalid project',
      },
    })
    expect(invalidCreateResponse.status()).toBe(400)

    // Test invalid project update
    const invalidUpdateResponse = await request.patch('/api/projects/invalid-id', {
      data: {
        name: 'Invalid Update',
      },
    })
    expect(invalidUpdateResponse.status()).toBe(404)

    // Test invalid project deletion
    const invalidDeleteResponse = await request.delete('/api/projects/invalid-id')
    expect(invalidDeleteResponse.status()).toBe(404)
  })
})
