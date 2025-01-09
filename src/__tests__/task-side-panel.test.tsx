import { render, screen, fireEvent } from '@testing-library/react';
import { TaskSidePanel } from '@/components/tasks/task-side-panel';
import { vi } from 'vitest';

describe('TaskSidePanel', () => {
  const mockOnSubmit = vi.fn();
  const defaultTask = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date().toISOString(),
    completed_at: null
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders task details correctly', () => {
    render(<TaskSidePanel task={defaultTask} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in_progress')).toBeInTheDocument();
  });

  it('sets completed_at when status changes to completed', async () => {
    render(<TaskSidePanel task={defaultTask} onSubmit={mockOnSubmit} />);

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    const submitButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        completed_at: expect.any(String)
      })
    );
  });

  it('clears completed_at when status changes from completed', async () => {
    const completedTask = {
      ...defaultTask,
      status: 'completed',
      completed_at: new Date().toISOString()
    };

    render(<TaskSidePanel task={completedTask} onSubmit={mockOnSubmit} />);

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    const submitButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'in_progress',
        completed_at: null
      })
    );
  });
}); 