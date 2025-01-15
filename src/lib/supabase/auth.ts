import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import type { User } from '@supabase/supabase-js';

export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabaseBrowserClient.auth.getUser();
  
  if (error) throw error;
  return user;
};

export const validateUserSession = async () => {
  const user = await getAuthenticatedUser();
  if (!user) return false;
  
  // Check if user has necessary profile data
  const { data: profile, error } = await supabaseBrowserClient
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();
    
  if (error || !profile) return false;
  
  return true;
};

export const getUserRole = async (user: User) => {
  const { data: profile, error } = await supabaseBrowserClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !profile) return null;
  return profile.role;
};

export const refreshUserSession = async () => {
  const { data: { session }, error } = await supabaseBrowserClient.auth.refreshSession();
  
  if (error) throw error;
  return session;
}; 