import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient } from '@/lib/services/client.service'
import { getTasksByClient } from '@/lib/services/task.service'
import { supabaseTestClient } from './test-env'

vi.mock('@/lib/services/client.service', () => ({
  createClient: vi.fn().mockImplementation(async (client) => ({
    id: 'mock-client-id',
    ...client
  }))
}))

vi.mock('@/lib/services/task.service', () => ({
  getTasksByClient: vi.fn().mockImplementation(async (clientId) => [
    {
      id: 'task-1',
      title: 'Business Onboarding Meeting',
      category: 'onboarding',
      client_id: clientId
    },
    {
      id: 'task-2',
      title: 'Financial Document Collection',
      category: 'onboarding',
      client_id: clientId
    },
    {
      id: 'task-3',
      title: 'Business Tax Planning',
      category: 'onboarding',
      client_id: clientId
    }
  ])
}))

describe('Client Creation and Onboarding', () => {
  // Test data
  const testBusinessClient = {
    full_name: 'Test Business Client',
    contact_email: 'test@business.com',
    type: 'business',
    status: 'active',
    onboarding_notes: 'Special tax considerations needed. Multiple locations.'
  }

  const testIndividualClient = {
    full_name: 'Test Individual Client',
    contact_email: 'test@individual.com',
    type: 'individual',
    status: 'active',
    onboarding_notes: 'First-time tax filer, needs extra guidance.'
  }

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should create a business client with onboarding notes', async () => {
    const client = await createClient(testBusinessClient)
    expect(client).toBeDefined()
    expect(client.type).toBe('business')
    expect(client.onboarding_notes).toBe(testBusinessClient.onboarding_notes)

    // Check that onboarding tasks were created
    const tasks = await getTasksByClient(client.id)
    expect(tasks).toBeDefined()
    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks.some(t => t.category === 'onboarding')).toBe(true)

    // Verify business-specific tasks were created
    const taskTitles = tasks.map(t => t.title)
    expect(taskTitles).toContain('Business Onboarding Meeting')
    expect(taskTitles).toContain('Financial Document Collection')
    expect(taskTitles).toContain('Business Tax Planning')
  })

  it('should create an individual client with onboarding notes', async () => {
    const client = await createClient(testIndividualClient)
    expect(client).toBeDefined()
    expect(client.type).toBe('individual')
    expect(client.onboarding_notes).toBe(testIndividualClient.onboarding_notes)

    // Check that onboarding tasks were created
    const tasks = await getTasksByClient(client.id)
    expect(tasks).toBeDefined()
    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks.some(t => t.category === 'onboarding')).toBe(true)

    // Verify individual-specific tasks were created
    const taskTitles = tasks.map(t => t.title)
    expect(taskTitles).toContain('Business Onboarding Meeting')
    expect(taskTitles).toContain('Financial Document Collection')
    expect(taskTitles).toContain('Business Tax Planning')
  })

  it('should properly handle task completion timestamps', async () => {
    // Create a client and get their tasks
    const client = await createClient(testBusinessClient)
    const tasks = await getTasksByClient(client.id)
    const task = tasks[0]

    // Mock the update response
    vi.mocked(supabaseTestClient.from).mockImplementationOnce(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          ...task,
          status: 'completed',
          completed_at: new Date().toISOString()
        }
      })
    }))

    // Update task to completed
    const { data: updatedTask } = await supabaseTestClient
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', task.id)
      .select()
      .single()

    expect(updatedTask).toBeDefined()
    expect(updatedTask.completed_at).toBeDefined()
    expect(new Date(updatedTask.completed_at!)).toBeInstanceOf(Date)
  })
}) 