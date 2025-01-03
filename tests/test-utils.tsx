import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import SupabaseProvider from '@/lib/supabase/supabase-provider';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/database.types';

const mockSupabaseClient: Partial<SupabaseClient<Database>> = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
  match: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn().mockResolvedValue({ data: { path: 'test.pdf' }, error: null }),
    getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/test.pdf' } }),
  },
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
  }
} as unknown as SupabaseClient<Database>;

function render(ui: React.ReactElement, { ...options } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SupabaseProvider supabaseClient={mockSupabaseClient}>
        {children}
      </SupabaseProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render, mockSupabaseClient };
