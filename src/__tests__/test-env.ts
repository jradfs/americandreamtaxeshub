import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { vi } from 'vitest'

export const testEmail = 'jr@adfs.tax'
export const testPassword = 'Install55!!'

// Mock Supabase client
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: testEmail
          }
        }
      },
      error: null
    })
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis()
}

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase
}))

export const supabaseTestClient = createClientComponentClient()

export const setupTestAuth = async () => {
  const { data: { session }, error } = await supabaseTestClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })

  if (error) {
    throw new Error(`Auth setup failed: ${error.message}`)
  }

  return session
}

export const cleanupTestData = async () => {
  // Clean up test clients
  const { data: clients } = await supabaseTestClient
    .from('clients')
    .select('id')
    .or('contact_email.eq.test@business.com,contact_email.eq.test@individual.com')
  
  if (clients && clients.length > 0) {
    const clientIds = clients.map(c => c.id)
    await supabaseTestClient.from('tasks').delete().in('client_id', clientIds)
    await supabaseTestClient.from('clients').delete().in('id', clientIds)
  }
} 