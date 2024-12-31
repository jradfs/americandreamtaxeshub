import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectForm } from '../project-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock the supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: {}, error: null })
    })),
    auth: {
      getSession: jest.fn()
    }
  }))
}));

describe('ProjectForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with basic fields', () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByLabelText(/template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/client is required/i)).toBeInTheDocument();
    });
  });

  it('updates form progress as fields are filled', async () => {
    render(<ProjectForm onSuccess={mockOnSuccess} />);
    
    // Initially should show 0% progress
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/client/i), { target: { value: 'client-id' } });
    fireEvent.change(screen.getByLabelText(/service type/i), { target: { value: 'tax_returns' } });
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'medium' } });

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText(/complete/i)).toBeInTheDocument();
    });
  });

  // Add more tests for template selection, task validation, etc.
});
