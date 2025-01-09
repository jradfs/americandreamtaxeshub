/** @jest-environment jsdom */
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from '../useTasks'
import type { TaskStatus, TaskWithRelations, TaskFormData } from '@/types/tasks'

const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  })),
}

jest.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabaseClient,
}))

// Mock toast
const mockToast = jest.fn()
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTasks', () => {
  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
  })

  it('should fetch tasks with relationships', async () => {
    const mockTasks: TaskWithRelations[] = [
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: 'todo' as TaskStatus,
        priority: null,
        project_id: null,
        assignee_id: null,
        due_date: null,
        start_date: null,
        tax_form_type: null,
        category: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        assigned_team: null,
        dependencies: null,
        parent_task_id: null,
        progress: null,
        recurring_config: null,
        tax_return_id: null,
        template_id: null,
        project: null,
        assignee: null,
        parent_task: null,
        checklist_items: null,
        activity_log_entries: null,
      },
    ]

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: mockTasks, error: null }),
      order: jest.fn().mockReturnThis(),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.tasks).toEqual([])

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.tasks).toEqual(mockTasks)
  })

  it('should filter tasks by project ID when provided', async () => {
    const projectId = '123'
    const mockTasks: TaskWithRelations[] = []

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({ data: mockTasks, error: null }),
    }))

    renderHook(() => useTasks({ projectId }), { wrapper: createWrapper() })

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('tasks')
    expect(mockSupabaseClient.from().eq).toHaveBeenCalledWith('project_id', projectId)
  })

  it('should create a task with optimistic update', async () => {
    const newTask: TaskFormData = {
      title: 'New Task',
      description: '',
      status: 'todo',
      priority: null,
      project_id: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      tax_form_type: null,
      category: null,
      checklist: null,
      activity_log: null,
      recurring_config: null,
    }

    const createdTask: TaskWithRelations = {
      id: '1',
      ...newTask,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      assigned_team: null,
      dependencies: null,
      parent_task_id: null,
      progress: null,
      recurring_config: null,
      tax_return_id: null,
      template_id: null,
      project: null,
      assignee: null,
      parent_task: null,
      checklist_items: null,
      activity_log_entries: null,
    }

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
      order: jest.fn().mockReturnThis(),
    }))

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: createdTask, error: null }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.createTask(newTask)
    })

    expect(result.current.tasks).toContainEqual(expect.objectContaining(newTask))
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Task created successfully.'
    })
  })

  it('should handle create task error', async () => {
    const newTask: TaskFormData = {
      title: 'New Task',
      description: '',
      status: 'todo',
      priority: null,
      project_id: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      tax_form_type: null,
      category: null,
      checklist: null,
      activity_log: null,
      recurring_config: null,
    }

    const error = new Error('Failed to create task')

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
      order: jest.fn().mockReturnThis(),
    }))

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: null, error }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await act(async () => {
      try {
        await result.current.createTask(newTask)
      } catch (e) {
        // Expected error
      }
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to create task. Please try again.',
      variant: 'destructive'
    })
  })

  it('should update a task with optimistic update', async () => {
    const initialTask: TaskWithRelations = {
      id: '1',
      title: 'Task 1',
      description: null,
      status: 'todo' as TaskStatus,
      priority: null,
      project_id: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      tax_form_type: null,
      category: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      assigned_team: null,
      dependencies: null,
      parent_task_id: null,
      progress: null,
      recurring_config: null,
      tax_return_id: null,
      template_id: null,
      project: null,
      assignee: null,
      parent_task: null,
      checklist_items: null,
      activity_log_entries: null,
    }

    const updatedTask = { ...initialTask, status: 'in_progress' as TaskStatus }

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [initialTask], error: null }),
      order: jest.fn().mockReturnThis(),
    }))

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: updatedTask, error: null }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateTask(updatedTask)
    })

    expect(result.current.tasks).toContainEqual(expect.objectContaining(updatedTask))
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Task updated successfully.'
    })
  })

  it('should delete a task with optimistic update', async () => {
    const task: TaskWithRelations = {
      id: '1',
      title: 'Task 1',
      description: null,
      status: 'todo' as TaskStatus,
      priority: null,
      project_id: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      tax_form_type: null,
      category: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      assigned_team: null,
      dependencies: null,
      parent_task_id: null,
      progress: null,
      recurring_config: null,
      tax_return_id: null,
      template_id: null,
      project: null,
      assignee: null,
      parent_task: null,
      checklist_items: null,
      activity_log_entries: null,
    }

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: [task], error: null }),
      order: jest.fn().mockReturnThis(),
    }))

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({ error: null }),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.deleteTask(task.id)
    })

    expect(result.current.tasks).not.toContainEqual(expect.objectContaining(task))
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Task deleted successfully.'
    })
  })

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch tasks')

    mockSupabaseClient.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce({ data: null, error }),
      order: jest.fn().mockReturnThis(),
    }))

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.tasks).toEqual([])
  })
}) 