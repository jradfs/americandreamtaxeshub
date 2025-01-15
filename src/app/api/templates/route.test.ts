import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { GET } from './route'
import { createMockSupabaseClient } from '@/lib/supabase/__mocks__/supabase'

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

describe('GET /api/templates', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return templates', async () => {
    const mockTemplates = [{ id: 1, name: 'Template 1' }]
    mockSupabase.from('templates').select.mockResolvedValue({ data: mockTemplates, error: null })

    const request = new NextRequest('http://localhost:3000/api/templates')
    const response = await GET(request)
    const data = await response.json()

    expect(data).toEqual(mockTemplates)
    expect(mockSupabase.from).toHaveBeenCalledWith('templates')
    expect(mockSupabase.from('templates').select).toHaveBeenCalled()
  })

  it('should handle errors', async () => {
    const mockError = new Error('Database error')
    mockSupabase.from('templates').select.mockRejectedValue(mockError)

    const request = new NextRequest('http://localhost:3000/api/templates')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to fetch templates' })
  })
})
