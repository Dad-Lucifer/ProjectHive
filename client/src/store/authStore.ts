import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface AuthState {
  token: string | null;
  currentUser: User | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setCurrentUser: (user: User) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      currentUser: null,
      isLoading: typeof window !== 'undefined' && !!localStorage.getItem('auth-storage'),
      setToken: (token) => set({ token }),
      setCurrentUser: (user) => set({ currentUser: user }),
      login: (token, user) => set({ token, currentUser: user, isLoading: false }),
      logout: () => set({ token: null, currentUser: null, isLoading: false }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
