import { signIn, signUp, signOut, getSession, requireAuth, requireRole, getCurrentUser } from '@/lib/auth';
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient';

jest.mock('@/lib/supabaseBrowserClient', () => ({
  supabaseBrowserClient: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call signInWithPassword with correct parameters', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    await signIn(email, password);
    expect(supabaseBrowserClient.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
  });

  it('should call signUp with correct parameters', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    await signUp(email, password);
    expect(supabaseBrowserClient.auth.signUp).toHaveBeenCalledWith({ email, password });
  });

  it('should call signOut', async () => {
    await signOut();
    expect(supabaseBrowserClient.auth.signOut).toHaveBeenCalled();
  });

  it('should call getSession', async () => {
    await getSession();
    expect(supabaseBrowserClient.auth.getSession).toHaveBeenCalled();
  });

  it('should call requireAuth', async () => {
    const mockSession = { user: { id: 'test-user-id' } };
    (supabaseBrowserClient.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });
    const session = await requireAuth();
    expect(session).toEqual(mockSession);
  });

  it('should call requireRole', async () => {
    const mockSession = { user: { id: 'test-user-id', app_metadata: { role: 'admin' } } };
    (supabaseBrowserClient.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });
    const session = await requireRole('admin');
    expect(session).toEqual(mockSession);
  });

  it('should call getCurrentUser', async () => {
    const mockSession = { user: { id: 'test-user-id', app_metadata: { role: 'admin' } } };
    (supabaseBrowserClient.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });
    const user = await getCurrentUser();
    expect(user).toEqual(mockSession.user);
  });
});