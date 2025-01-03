import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicInfoForm } from '../basic-info-form';
import { useForm } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';

// Mock the form hook
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

describe('BasicInfoForm', () => {
  const mockClients = [
    {
      id: 'client1',
      type: 'business',
      company_name: 'Test Company',
      status: 'active'
    },
    {
      id: 'client2',
      type: 'individual',
      full_name: 'John Doe',
      status: 'active'
    }
  ];

  const mockTemplates = [
    {
      id: 'template1',
      name: 'Tax Return Template',
      tasks: []
    }
  ];

  const mockForm = {
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
    },
    setValue: jest.fn(),
    watch: jest.fn(),
  };

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue(mockForm);
  });

  it('renders project name input', () => {
    render(
      <BasicInfoForm
        form={mockForm as any}
        clients={mockClients as any}
        templates={mockTemplates as any}
      />
    );
    expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument();
  });

  it('renders client selection dropdown', () => {
    render(
      <BasicInfoForm
        form={mockForm as any}
        clients={mockClients as any}
        templates={mockTemplates as any}
      />
    );
    expect(screen.getByText(/Select a client/i)).toBeInTheDocument();
  });

  it('groups clients by type', () => {
    render(
      <BasicInfoForm
        form={mockForm as any}
        clients={mockClients as any}
        templates={mockTemplates as any}
      />
    );
    expect(screen.getByText('Business Clients')).toBeInTheDocument();
    expect(screen.getByText('Individual Clients')).toBeInTheDocument();
  });

  it('displays template selection when templates are provided', () => {
    render(
      <BasicInfoForm
        form={mockForm as any}
        clients={mockClients as any}
        templates={mockTemplates as any}
      />
    );
    expect(screen.getByText(/Project Template/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a template/i)).toBeInTheDocument();
  });

  it('shows loading state for templates when templatesLoading is true', () => {
    render(
      <BasicInfoForm
        form={mockForm as any}
        clients={mockClients as any}
        templates={mockTemplates as any}
        templatesLoading={true}
      />
    );
    expect(screen.getByText(/Loading templates/i)).toBeInTheDocument();
  });
});
