import { render, screen, fireEvent } from '@testing-library/react';
import { ClientForm } from '@/components/clients/client-form';
import { vi } from 'vitest';

describe('ClientForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultClient = {
    id: '123',
    name: 'Test Client',
    email: 'test@example.com',
    phone: '123-456-7890',
    service_type: 'individual',
    onboarding_notes: null
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders client form fields correctly', () => {
    render(<ClientForm client={defaultClient} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Client');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('123-456-7890');
    expect(screen.getByLabelText(/service type/i)).toHaveValue('individual');
    expect(screen.getByLabelText(/onboarding notes/i)).toBeInTheDocument();
  });

  it('handles form submission with onboarding notes', async () => {
    render(<ClientForm client={defaultClient} onSubmit={mockOnSubmit} />);

    const onboardingNotesInput = screen.getByLabelText(/onboarding notes/i);
    fireEvent.change(onboardingNotesInput, { target: { value: 'Test onboarding notes' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        onboarding_notes: 'Test onboarding notes'
      })
    );
  });

  it('validates required fields', async () => {
    render(<ClientForm client={null} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/service type is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('updates existing client with onboarding notes', async () => {
    const existingClient = {
      ...defaultClient,
      onboarding_notes: 'Existing notes'
    };

    render(<ClientForm client={existingClient} onSubmit={mockOnSubmit} />);

    const onboardingNotesInput = screen.getByLabelText(/onboarding notes/i);
    expect(onboardingNotesInput).toHaveValue('Existing notes');

    fireEvent.change(onboardingNotesInput, { target: { value: 'Updated notes' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        onboarding_notes: 'Updated notes'
      })
    );
  });
}); 