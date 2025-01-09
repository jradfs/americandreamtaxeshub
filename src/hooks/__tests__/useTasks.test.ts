import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from '../useTasks'
import { createClient } from '@supabase/supabase-js'

// Mock supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  })),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useTasks', () => {
  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
  })

  it('should fetch tasks', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'todo' as const },
      { id: '2', title: 'Task 2', status: 'in_progress' as const },
    ]

    const mockSupabase = createClient('', '')
    ;(mockSupabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: mockTasks, error: null }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.tasks).toEqual([])

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.tasks).toEqual(mockTasks)
  })

  it('should create a task with optimistic update', async () => {
    const newTask = { 
      title: 'New Task', 
      status: 'todo' as const,
      description: '',
      priority: null,
      project_id: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      tax_form_type: null,
      category: null,
    }
    const createdTask = { id: '1', ...newTask }

    const mockSupabase = createClient('', '')
    ;(mockSupabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
      insert: jest.fn().mockResolvedValueOnce({ data: createdTask, error: null }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper })

    await act(async () => {
      await result.current.createTask(newTask)
    })

    expect(result.current.tasks).toContainEqual(expect.objectContaining(newTask))
  })

  it('should update a task with optimistic update', async () => {
    const initialTask = { id: '1', title: 'Task 1', status: 'todo' }
    const updatedTask = { ...initialTask, status: 'in_progress' }

    ;(supabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [initialTask], error: null }),
      update: jest.fn().mockResolvedValueOnce({ data: updatedTask, error: null }),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateTask(updatedTask)
    })

    expect(result.current.tasks).toContainEqual(expect.objectContaining(updatedTask))
  })

  it('should delete a task with optimistic update', async () => {
    const task = { id: '1', title: 'Task 1', status: 'todo' }

    ;(supabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [task], error: null }),
      delete: jest.fn().mockResolvedValueOnce({ error: null }),
      eq: jest.fn().mockReturnThis(),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.deleteTask(task.id)
    })

    expect(result.current.tasks).not.toContainEqual(expect.objectContaining(task))
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch tasks')

    ;(supabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: null, error }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.tasks).toEqual([])
  })
}) 