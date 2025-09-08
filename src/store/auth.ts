/**
 * Authentication Store
 * 
 * Manages user authentication state using Zustand.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account } from '@/domain/data-contracts';
import { authService } from '@/services/registry';

interface AuthState {
  user: Account | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Account, 'name'>>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { account, token } = await authService.signIn(email, password);
          set({ user: account, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign in failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const { account, token } = await authService.signUp(email, password, name);
          set({ user: account, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign up failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
          set({ user: null, token: null, isLoading: false, error: null });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign out failed', 
            isLoading: false 
          });
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({ user, isLoading: false });
          } else {
            set({ user: null, token: null, isLoading: false });
          }
        } catch (error) {
          set({ user: null, token: null, isLoading: false });
        }
      },

      updateProfile: async (updates: Partial<Pick<Account, 'name'>>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(updates);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Profile update failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'bcorp-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);