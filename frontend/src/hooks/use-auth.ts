import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: authStorage.isAuthenticated(), // Only load if token exists
    isAuthenticated: authStorage.isAuthenticated(),
  });

  // Fetch user from server on mount if token is present
  useEffect(() => {
    if (!authStorage.isAuthenticated()) return;

    api.getCurrentUser()
      .then((user) => {
        setState({ user, isLoading: false, isAuthenticated: !!user });
      })
      .catch(() => {
        authStorage.clearToken();
        setState({ user: null, isLoading: false, isAuthenticated: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await api.login(email, password);
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const user = await api.register(name, email, password, passwordConfirmation);
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return { ...state, login, register, logout };
}
