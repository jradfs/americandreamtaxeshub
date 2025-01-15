import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientFormSchema } from '@/lib/validations/client';
import { ToastProvider } from '@/components/ui/use-toast';
import { vi } from 'vitest';

// Create a more robust mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockResolvedValue({ data: null, error: null }),
    delete: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
};

// Mock Supabase client
vi.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: () => mockSupabaseClient,
}));

// Helper function to render with form context
export const renderWithForm = (ui: React.ReactElement) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm({
      resolver: zodResolver(clientFormSchema),
      defaultValues: {
        full_name: '',
        company_name: '',
        contact_email: '',
        onboarding_notes: '',
        status: 'pending',
        type: 'individual',
        contact_details: {
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
        },
        tax_info: {
          filing_status: '',
          tax_id: '',
          tax_year: new Date().getFullYear(),
          filing_type: null,
          tax_id_type: null,
          dependents: [],
          previous_returns: []
        }
      }
    });

    return (
      <FormProvider {...form}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </FormProvider>
    );
  };

  return {
    user: userEvent.setup(),
    mockSupabaseClient,
    ...render(ui, {
      wrapper: Wrapper,
    }),
  };
}; 