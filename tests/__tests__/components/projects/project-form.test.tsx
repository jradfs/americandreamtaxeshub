import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { hello } from '@/utils/helloFunction';
import { ProjectForm } from '@/components/projects/project-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs');
jest.mock('sonner');

describe('ProjectForm', () => {
  const mockOnSuccess = jest.fn();
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
  };

  beforeEach(() => {
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('shows validation errors when required fields are missing', async () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/client is required/i)).toBeInTheDocument();
    });
  });

  it('handles template selection and task population', async () => {
    const mockTemplate = {
      id: 'template-1',
      title: 'Test Template',
      description: 'Test Description',
      default_priority: 'medium'
    };
    
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        description: 'Task Description',
        priority: 'medium',
        dependencies: [],
        order_index: 0
      }
    ];

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'template_tasks') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockTasks, error: null })
        };
      }
      return mockSupabase;
    });

    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    // Select template
    fireEvent.click(screen.getByLabelText(/template/i));
    fireEvent.click(screen.getByText(mockTemplate.title));
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockTemplate.title)).toBeInTheDocument();
      expect(screen.getByText(mockTasks[0].title)).toBeInTheDocument();
    });
  });

  it('handles successful project creation', async () => {
    mockSupabase.insert.mockResolvedValueOnce({ data: { id: '123' }, error: null });
    
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Project' } });
    fireEvent.click(screen.getByLabelText(/client/i));
    fireEvent.click(screen.getByText(/select a client/i));
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
