import { renderHook, act } from '@testing-library/react'
import { useProjects } from '../useProjects'
import { ProjectWithRelations } from '@/types/projects'
import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn()
}))

interface MockSupabaseClient {
  from: jest.Mock;
  select: jest.Mock;
  in: jest.Mock;
  eq: jest.Mock;
  or: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  order: jest.Mock;
  range: jest.Mock;
  single: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
}

describe('useProjects', () => {
  const mockSupabase = {
    from: jest.fn(() => mockSupabase),
    select: jest.fn(() => mockSupabase),
    in: jest.fn(() => mockSupabase),
    eq: jest.fn(() => mockSupabase),
    or: jest.fn(() => mockSupabase),
    gte: jest.fn(() => mockSupabase),
    lte: jest.fn(() => mockSupabase),
    order: jest.fn(() => mockSupabase),
    range: jest.fn(() => mockSupabase),
    single: jest.fn(() => mockSupabase),
    insert: jest.fn(() => mockSupabase),
    update: jest.fn(() => mockSupabase),
    delete: jest.fn(() => mockSupabase)
  } as MockSupabaseClient

  const mockProjects: Partial<ProjectWithRelations>[] = [
    {
      id: '1',
      name: 'Project 1',
      client_id: 'client1',
      status: 'in_progress',
      service_type: 'tax_return',
      tax_return_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Project 2',
      client_id: 'client2',
      status: 'not_started',
      service_type: 'accounting',
      tax_return_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const mockTaxReturns: Database['public']['Tables']['tax_returns']['Row'][] = [
    {
      id: 1,
      tax_year: 2024,
      filing_type: '1040',
      status: 'in_progress',
      client_id: 'client1',
      created_at: new Date().toISOString(),
      updated_at: null,
      assigned_to: null,
      due_date: null,
      extension_date: null,
      filed_date: null,
      notes: null
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('fetches projects successfully', async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: mockProjects,
      error: null,
      count: mockProjects.length
    })

    mockSupabase.select.mockResolvedValueOnce({
      data: mockTaxReturns,
      error: null
    })

    const { result } = renderHook(() => useProjects({}))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.projects).toHaveLength(mockProjects.length)
    expect(result.current.loading).toBe(false)
    expect(result.current.totalCount).toBe(mockProjects.length)
    expect(result.current.projects[0].tax_return).toEqual(mockTaxReturns[0])
  })

  it('handles fetch error', async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to fetch projects'),
      count: null
    })

    const { result } = renderHook(() => useProjects({}))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.projects).toEqual([])
  })

  it('filters projects by status', async () => {
    const filteredProjects = mockProjects.filter(p => p.status === 'in_progress')
    mockSupabase.select.mockResolvedValueOnce({
      data: filteredProjects,
      error: null,
      count: filteredProjects.length
    })

    mockSupabase.select.mockResolvedValueOnce({
      data: mockTaxReturns,
      error: null
    })

    const { result } = renderHook(() => useProjects({ status: ['in_progress'] }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.projects).toHaveLength(1)
    expect(result.current.projects[0].status).toBe('in_progress')
  })

  it('filters projects by service type', async () => {
    const filteredProjects = mockProjects.filter(p => p.service_type === 'tax_return')
    mockSupabase.select.mockResolvedValueOnce({
      data: filteredProjects,
      error: null,
      count: filteredProjects.length
    })

    mockSupabase.select.mockResolvedValueOnce({
      data: mockTaxReturns,
      error: null
    })

    const { result } = renderHook(() => useProjects({ serviceType: ['tax_return'] }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.projects).toHaveLength(1)
    expect(result.current.projects[0].service_type).toBe('tax_return')
    expect(result.current.projects[0].tax_return).toEqual(mockTaxReturns[0])
  })
})
