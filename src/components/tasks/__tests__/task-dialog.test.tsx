import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskDialog } from '../task-dialog'
import type { TaskWithRelations } from '@/types/tasks'

const mockTask: TaskWithRelations = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  project_id: null,
  assignee_id: null,
  due_date: null,
  start_date: null,
  tax_form_type: null,
  category: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  assigned_team: null,
  completed_at: null,
  dependencies: null,
  parent_task_id: null,
  progress: null,
  recurring_config: null,
  tax_return_id: null,
  template_id: null,
}

describe('TaskDialog', () => {
  const mockOnSubmit = jest.fn()
  const mockSetIsOpen = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create task dialog correctly', () => {
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Create Task')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('renders edit task dialog correctly', () => {
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        taskData={mockTask}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockTask.description!)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('submits form with correct data for new task', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSubmit={mockOnSubmit}
      />
    )

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'New Task')
    await user.type(screen.getByRole('textbox', { name: /description/i }), 'New Description')
    
    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
      }))
    })
  })

  it('submits form with correct data for edit task', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        taskData={mockTask}
        onSubmit={mockOnSubmit}
      />
    )

    const titleInput = screen.getByDisplayValue(mockTask.title)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task')
    
    await user.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Task',
        description: mockTask.description,
        status: mockTask.status,
      }))
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSubmit={mockOnSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSubmit={mockOnSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
  })

  it('disables submit button when isSubmitting is true', () => {
    render(
      <TaskDialog
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
}) 