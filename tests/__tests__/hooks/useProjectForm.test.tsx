import { renderHook, act } from '@testing-library/react';
import { useProjectForm } from '@/hooks/useProjectForm';
import { createClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { projectSchema } from '@/lib/validations/project';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn()
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}));

describe('useProjectForm', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  };

  const mockForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      client_id: '',
      status: 'not_started',
      priority: 'medium',
      service_type: 'uncategorized',
      tasks: []
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should fetch clients on mount', async () => {
    const mockClients = [
      { id: '1', company_name: 'Company A' },
      { id: '2', company_name: 'Company B' }
    ];

    mockSupabase.from.mockReturnValue({
      ...mockSupabase,
      select: jest.fn().mockResolvedValue({ data: mockClients, error: null })
    });

    const { result } = renderHook(() => useProjectForm(mockForm));

    expect(result.current.isLoadingClients).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.isLoadingClients).toBe(false);
  });

  it('should handle client fetch error', async () => {
    const error = new Error('Failed to fetch clients');

    mockSupabase.from.mockReturnValue({
      ...mockSupabase,
      select: jest.fn().mockResolvedValue({ data: null, error })
    });

    renderHook(() => useProjectForm(mockForm));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to load clients');
  });

  it('should handle template selection and validate tasks', async () => {
    const mockTemplate = {
      id: '1',
      name: 'Template A',
      description: 'Test template',
      default_priority: 'high',
      tasks: [
        {
          title: 'Task 1',
          description: 'Test task',
          priority: 'high',
          dependencies: []
        },
        {
          title: 'Invalid Task',
          priority: 'invalid',
          dependencies: []
        }
      ]
    };

    mockSupabase.from.mockReturnValue({
      ...mockSupabase,
      select: jest.fn().mockResolvedValue({ data: mockTemplate, error: null })
    });

    const { result } = renderHook(() => useProjectForm(mockForm));

    await act(async () => {
      await result.current.handleTemplateSelection('1');
    });

    expect(result.current.selectedTemplate).toEqual(mockTemplate);
    expect(mockForm.getValues('name')).toBe(mockTemplate.name);
    expect(mockForm.getValues('description')).toBe(mockTemplate.description);
    expect(mockForm.getValues('priority')).toBe(mockTemplate.default_priority);
    // Should only include valid tasks
    expect(mockForm.getValues('tasks')).toHaveLength(1);
    expect(mockForm.getValues('tasks')[0].title).toBe('Task 1');
  });

  it('should calculate form progress based on service type', async () => {
    const { result } = renderHook(() => useProjectForm(mockForm));

    // Initially all fields are empty
    expect(result.current.formProgress).toBe(0);

    // Fill basic fields
    await act(async () => {
      mockForm.setValue('name', 'Test Project');
      mockForm.setValue('client_id', '1');
      mockForm.setValue('service_type', 'uncategorized');
    });

    // Basic fields filled (3/3)
    expect(result.current.formProgress).toBe(100);

    // Switch to tax returns service
    await act(async () => {
      result.current.handleServiceTypeChange('tax_returns');
    });

    // Basic fields filled (3/5) for tax returns
    expect(result.current.formProgress).toBe(60);

    // Fill tax return fields
    await act(async () => {
      mockForm.setValue('tax_return_id', '1');
      mockForm.setValue('tax_return_status', 'in_progress');
    });

    // All fields filled (5/5) for tax returns
    expect(result.current.formProgress).toBe(100);
  });

  it('should validate task dependencies', () => {
    const { result } = renderHook(() => useProjectForm(mockForm));

    const validTasks = [
      { title: 'Task 1', dependencies: [] },
      { title: 'Task 2', dependencies: ['Task 1'] }
    ];

    const invalidTasks = [
      { title: 'Task 1', dependencies: [] },
      { title: 'Task 2', dependencies: ['Non-existent Task'] }
    ];

    expect(result.current.validateTaskDependencies(validTasks)).toBe(true);
    expect(result.current.validateTaskDependencies(invalidTasks)).toBe(false);
  });

  it('should reset service fields when changing service type', async () => {
    const { result } = renderHook(() => useProjectForm(mockForm));

    // Set tax return fields
    await act(async () => {
      mockForm.setValue('tax_return_id', '1');
      mockForm.setValue('tax_return_status', 'in_progress');
    });

    // Change service type
    await act(async () => {
      result.current.handleServiceTypeChange('accounting');
    });

    // Tax return fields should be reset
    expect(mockForm.getValues('tax_return_id')).toBeUndefined();
    expect(mockForm.getValues('tax_return_status')).toBeUndefined();

    // Set accounting field
    await act(async () => {
      mockForm.setValue('accounting_period', 'monthly');
    });

    // Change service type again
    await act(async () => {
      result.current.handleServiceTypeChange('uncategorized');
    });

    // Accounting field should be reset
    expect(mockForm.getValues('accounting_period')).toBeUndefined();
  });
});
