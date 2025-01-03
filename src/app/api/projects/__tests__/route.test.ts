import { jest } from '@jest/globals'
import { createMockSupabaseClient } from '@/lib/supabase/__mocks__/supabase'
import { POST } from '../route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase/server')

describe('POST /api/projects', () => {
  const mockUser = { id: 'user123' }
  const mockSupabase = createMockSupabaseClient()

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
  })

  it('creates a new project successfully', async () => {
    const mockProject = {
      name: 'Test Project',
      description: 'Test Description',
      client_id: 'client123',
      service_type: 'tax_return',
      priority: 'high',
      due_date: '2024-12-31',
      tax_info: {
        return_type: '1040',
        tax_year: 2023
      }
    }

    mockSupabase.from('projects').insert.mockResolvedValueOnce({
      data: [{ id: 'project123', ...mockProject }],
      error: null
    })

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify(mockProject)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ id: 'project123', ...mockProject })
    expect(mockSupabase.from('projects').insert).toHaveBeenCalledWith({
      ...mockProject,
      created_by: mockUser.id
    })
  })

  it('returns 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('returns 400 for invalid project data', async () => {
    const invalidProject = {
      // Missing required fields
      name: '',
      client_id: ''
    }

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify(invalidProject)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 500 when database operation fails', async () => {
    mockSupabase.from('projects').insert.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error', details: '', hint: '', code: 'ERROR' }
    })

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Project',
        client_id: 'client123'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
