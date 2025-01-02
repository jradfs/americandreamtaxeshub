import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from '@/components/projects/project-form';
import { useProjectForm } from '@/hooks/useProjectForm';
import { useProjectSubmission } from '@/hooks/useProjectSubmission';
import { useTaskValidation } from '@/hooks/useTaskValidation';
import { toast } from 'sonner';

// Mock hooks
jest.mock('@/hooks/useProjectForm');
jest.mock('@/hooks/useProjectSubmission');
jest.mock('@/hooks/useTaskValidation');
jest.mock('sonner');

describe('ProjectForm', () => {
  const mockOnSuccess = jest.fn();
  const mockSubmitProject = jest.fn();
  const mockValidateTaskDependencies = jest.fn();
  const mockAddTask = jest.fn();
  const mockRemoveTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockReorderTasks = jest.fn();
  const mockHandleServiceTypeChange = jest.fn();
  const mockHandleTeamMemberChange = jest.fn();

  const mockFormData = {
    clients: [
      { id: '1', name: 'Test Company' }
    ],
    teamMembers: [
      { id: '1', name: 'Test User', role: 'Manager' }
    ],
    taxReturns: [
      { id: '1', name: '2023 Tax Return' }
    ],
    formProgress: 0,
    selectedTemplate: null,
    templateTasks: [],
    isLoading: false,
    handleTemplateChange: jest.fn(),
    handleServiceTypeChange: mockHandleServiceTypeChange,
    handleTeamMemberChange: mockHandleTeamMemberChange,
    addTask: mockAddTask,
    removeTask: mockRemoveTask,
    updateTask: mockUpdateTask,
    reorderTasks: mockReorderTasks,
    getTaskValidationError: jest.fn(),
    taskDependencyErrors: {},
    validateServiceSpecificFields: jest.fn(() => true),
    getTeamMemberOptions: () => [
      { value: '1', label: 'Test User', description: 'Manager' }
    ],
    getTaxReturnOptions: () => [
      { value: '1', label: '2023 Tax Return' }
    ],
    form: {
      watch: jest.fn(),
      setValue: jest.fn(),
      handleSubmit: jest.fn(),
      control: {},
      getValues: jest.fn()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProjectForm as jest.Mock).mockReturnValue(mockFormData);
    (useProjectSubmission as jest.Mock).mockReturnValue({
      isLoading: false,
      submitProject: mockSubmitProject
    });
    (useTaskValidation as jest.Mock).mockReturnValue({
      taskDependencyErrors: [],
      validateTaskDependencies: mockValidateTaskDependencies
    });
  });

  it('renders all form sections', () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Service Details')).toBeInTheDocument();
    expect(screen.getByText('Timeline & Team')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    mockValidateTaskDependencies.mockReturnValue(true);
    const user = userEvent.setup();

    render(<ProjectForm onSuccess={mockOnSuccess} />);

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'Test Project');
    await user.selectOptions(screen.getByLabelText(/client/i), '1');
    await user.selectOptions(screen.getByLabelText(/service type/i), 'tax_return');

    // Submit form
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(mockSubmitProject).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Project',
      client_id: '1',
      service_type: 'tax_return'
    }));
  });

  it('shows validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<ProjectForm onSuccess={mockOnSuccess} />);

    // Submit without filling required fields
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/client is required/i)).toBeInTheDocument();
  });

  it('handles template selection', async () => {
    const user = userEvent.setup();
    const mockTemplate = {
      id: '1',
      title: 'Test Template',
      description: 'Test Description',
      default_priority: 'high'
    };

    render(<ProjectForm onSuccess={mockOnSuccess} />);

    // Select template
    await user.selectOptions(screen.getByLabelText(/template/i), mockTemplate.id);

    expect(mockFormData.handleTemplateChange).toHaveBeenCalledWith(mockTemplate.id);
  });

  it('shows service-specific fields based on service type', async () => {
    const user = userEvent.setup();

    render(<ProjectForm onSuccess={mockOnSuccess} />);

    // Select tax return service
    await user.selectOptions(screen.getByLabelText(/service type/i), 'tax_return');
    expect(screen.getByLabelText(/tax return/i)).toBeInTheDocument();

    // Select accounting service
    await user.selectOptions(screen.getByLabelText(/service type/i), 'accounting');
    expect(screen.getByLabelText(/accounting period/i)).toBeInTheDocument();
  });

  describe('Task Management', () => {
    it('adds a new task', async () => {
      const user = userEvent.setup();
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        dependencies: [],
        assigned_to: '1'
      };

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Open task dialog
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Fill task form
      await user.type(screen.getByLabelText(/title/i), newTask.title);
      await user.type(screen.getByLabelText(/description/i), newTask.description);
      await user.selectOptions(screen.getByLabelText(/priority/i), newTask.priority);
      await user.selectOptions(screen.getByLabelText(/assigned to/i), newTask.assigned_to);

      // Submit task
      await user.click(screen.getByRole('button', { name: /add task/i }));

      expect(mockAddTask).toHaveBeenCalledWith(newTask);
    });

    it('removes a task', async () => {
      const user = userEvent.setup();
      mockFormData.form.watch.mockReturnValue([
        { title: 'Test Task', description: 'Test Description' }
      ]);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Click remove button
      await user.click(screen.getByRole('button', { name: /remove/i }));

      expect(mockRemoveTask).toHaveBeenCalledWith('Test Task');
    });

    it('reorders tasks via drag and drop', async () => {
      mockFormData.form.watch.mockReturnValue([
        { title: 'Task 1', description: 'Description 1' },
        { title: 'Task 2', description: 'Description 2' }
      ]);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Simulate drag and drop
      fireEvent.dragStart(screen.getByText('Task 1'));
      fireEvent.dragOver(screen.getByText('Task 2'));
      fireEvent.drop(screen.getByText('Task 2'));

      expect(mockReorderTasks).toHaveBeenCalledWith(0, 1);
    });

    it('validates task dependencies before submission', async () => {
      const user = userEvent.setup();
      mockValidateTaskDependencies.mockReturnValue(false);
      mockFormData.form.watch.mockReturnValue([
        { title: 'Task 1', dependencies: ['Task 2'] }
      ]);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Submit form
      await user.click(screen.getByRole('button', { name: /create project/i }));

      expect(toast.error).toHaveBeenCalledWith('Please fix task dependency errors');
      expect(mockSubmitProject).not.toHaveBeenCalled();
    });
  });

  describe('Team Member Management', () => {
    it('handles team member selection', async () => {
      const user = userEvent.setup();

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Select team member
      await user.click(screen.getByLabelText(/team members/i));
      await user.click(screen.getByText('Test User'));

      expect(mockHandleTeamMemberChange).toHaveBeenCalledWith(['1']);
    });

    it('validates team member assignments in tasks', async () => {
      const user = userEvent.setup();
      mockFormData.form.watch.mockReturnValue([
        { title: 'Task 1', assigned_to: 'invalid_id' }
      ]);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Submit form
      await user.click(screen.getByRole('button', { name: /create project/i }));

      expect(screen.getByText(/invalid team member assignment/i)).toBeInTheDocument();
    });
  });

  describe('Service Type Management', () => {
    it('confirms service type change with existing tasks', async () => {
      const user = userEvent.setup();
      mockFormData.form.watch.mockReturnValue([{ title: 'Existing Task' }]);
      window.confirm = jest.fn(() => true);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Change service type
      await user.selectOptions(screen.getByLabelText(/service type/i), 'accounting');

      expect(window.confirm).toHaveBeenCalled();
      expect(mockHandleServiceTypeChange).toHaveBeenCalledWith('accounting');
    });

    it('validates service-specific fields before submission', async () => {
      const user = userEvent.setup();
      mockFormData.validateServiceSpecificFields.mockReturnValue(false);

      render(<ProjectForm onSuccess={mockOnSuccess} />);

      // Submit form
      await user.click(screen.getByRole('button', { name: /create project/i }));

      expect(toast.error).toHaveBeenCalledWith('Please fill in all required fields for the selected service type');
      expect(mockSubmitProject).not.toHaveBeenCalled();
    });
  });

  it('shows progress for each tab', () => {
    mockFormData.form.watch.mockImplementation((field) => {
      switch (field) {
        case 'name':
          return 'Test Project';
        case 'service_type':
          return 'tax_return';
        case 'team_members':
          return ['1'];
        default:
          return undefined;
      }
    });

    render(<ProjectForm onSuccess={mockOnSuccess} />);

    // Check progress bars
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(4); // Overall + 3 tabs
  });
});
