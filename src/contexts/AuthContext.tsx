import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../supabase/client';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[AuthProvider] useEffect mount');
    // On mount, check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError(error.message);
          setUser(null);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
        console.log('[AuthProvider] getSession complete', { session });
      } catch (err: any) {
        setAuthError(err.message || 'Session check failed');
        setUser(null);
        console.error('[AuthProvider] getSession error', err);
      } finally {
        setLoading(false);
      }
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((
      _event: string,
      session: { user?: any } | null
    ) => {
      console.log('[AuthProvider] onAuthStateChange', { session });
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('[AuthProvider] user or loading changed', { user, loading });
  }, [user, loading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setAuthError(null);
    console.log('[AuthProvider] login called', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('No user found');
      // Re-fetch session to ensure user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error(sessionError.message);
      if (sessionData.session?.user) {
        setUser({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email || '',
          name: sessionData.session.user.user_metadata?.name,
          avatar: sessionData.session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setAuthError(null);
    console.log('[AuthProvider] logout called');
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Force session refresh to ensure logout everywhere
      await supabase.auth.getSession();
    } catch (err: any) {
      setAuthError(err.message || 'Logout failed');
      setUser(null);
      console.error('[AuthProvider] logout error', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setAuthError(null);
    console.log('[AuthProvider] register called', { email, name });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('[useAuth] called', context);
  return context;
};
