'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';

export function useUser() {
  const { data: session, status } = useSession();
  const { clearUser } = useAppStore();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return await login(email, password);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = () => {
    signOut({ redirect: false });
    clearUser();
  };

  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const loginWithGithub = () => {
    signIn('github', { callbackUrl: '/' });
  };

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
  };
}
