import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useProjectSubmission } from '../useProjectSubmission';
import { ProjectFormValues } from '@/lib/validations/project';

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

describe('useProjectSubmission', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProjectData: ProjectFormValues = {
    creation_type: 'custom',
    name: 'Test Project',
    client_id: 'client-123',
    status: 'not_started',
    priority: 'medium',
    service_type: 'tax_return',
    tax_info: {},
    tasks: [
      {
        title: 'Task 1',
        priority: 'medium',
        dependencies: []
      }
    ]
  };

  it('should successfully create a project', async () => {
    const mockResponse = { id: 'project-123', ...mockProjectData };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useProjectSubmission(mockOnSuccess));

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitProject(mockProjectData);
    });

    expect(submissionResult?.data).toEqual(mockResponse);
    expect(submissionResult?.error).toBeNull();
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expect.objectContaining({
        name: mockProjectData.name,
        client_id: mockProjectData.client_id
      }))
    });
  });

  it('should handle validation errors', async () => {
    const errorMessage = 'Client is required';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage })
    });

    const { result } = renderHook(() => useProjectSubmission(mockOnSuccess));

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitProject({
        ...mockProjectData,
        client_id: '', // Invalid data
      });
    });

    expect(submissionResult?.data).toBeNull();
    expect(submissionResult?.error).toBe(errorMessage);
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProjectSubmission(mockOnSuccess));

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitProject(mockProjectData);
    });

    expect(submissionResult?.data).toBeNull();
    expect(submissionResult?.error).toBe('Failed to create project');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should validate task dependencies', async () => {
    const { result } = renderHook(() => useProjectSubmission(mockOnSuccess));

    const invalidProjectData = {
      ...mockProjectData,
      tasks: [
        {
          title: 'Task 1',
          priority: 'medium',
          dependencies: ['Non-existent Task']
        }
      ]
    };

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitProject(invalidProjectData);
    });

    expect(submissionResult?.data).toBeNull();
    expect(submissionResult?.error).toBe('Invalid task dependencies');
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
