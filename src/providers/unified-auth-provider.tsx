"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import {
  getAuthenticatedUser,
  validateUserSession,
  getUserRole,
  refreshUserSession,
} from "@/lib/supabase/auth";
import type { Database } from "@/types/database.types";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (role: string) => boolean;
  validateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabaseBrowserClient.auth.getUser();
        if (userError) throw userError;

        const { data: sessionData, error: sessionError } = await supabaseBrowserClient.auth.getSession();
        if (sessionError) throw sessionError;

        const session = sessionData?.session;
        if (error) throw error;

        setSession(session);
        setUser(user ?? null);

        if (user) {
          const role = await getUserRole(user);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            const role = await getUserRole(session.user);
            setUserRole(role);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setError(error as Error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabaseBrowserClient.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const session = await refreshUserSession();
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        const role = await getUserRole(session.user);
        setUserRole(role);
      }
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    if (!userRole) return false;
    // Use strict role checking
    const validRoles = {
      admin: ['admin'],
      manager: ['admin', 'manager'],
      user: ['admin', 'manager', 'user']
    };
    return validRoles[role as keyof typeof validRoles]?.includes(userRole) ?? false;
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const isValid = await validateUserSession();
      const currentSession = await supabaseBrowserClient.auth.getSession();

      // Check if session is expired
      if (currentSession.data.session?.expires_at) {
        const expiryTime = new Date(currentSession.data.session.expires_at * 1000);
        if (expiryTime <= new Date()) {
          await signOut();
          return false;
        }
      }

      if (!isValid) {
        await signOut();
      }
      return isValid;
    } catch (error) {
      setError(error as Error);
      await signOut();
      return false;
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
    hasRole,
    validateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
