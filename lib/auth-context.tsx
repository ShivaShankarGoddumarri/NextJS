'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginForm, RegisterForm } from '@/app/types';
import { authApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkUser();

    // global rejection handler for better debugging
    const unhandled = (e: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', e.reason);
    };
    window.addEventListener('unhandledrejection', unhandled);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('unhandledrejection', unhandled);
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data as User);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (credentials: LoginForm) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      setLoading(true);
      const user = await authApi.register(userData);
      setUser(user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based access hooks
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'admin';
}

export function useIsStaff() {
  const { user } = useAuth();
  return user?.role === 'staff';
}

export function useIsCustomer() {
  const { user } = useAuth();
  return user?.role === 'customer';
}

export function useRequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return { user: null, loading: true };
  }

  if (!user) {
    throw new Error('Authentication required');
  }

  return { user, loading: false };
}

export function useRequireRole(role: 'admin' | 'staff' | 'customer') {
  const { user, loading } = useAuth();

  if (loading) {
    return { user: null, loading: true };
  }

  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== role) {
    throw new Error(`Access denied. Required role: ${role}`);
  }

  return { user, loading: false };
}