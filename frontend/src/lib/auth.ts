// Token management helpers for Sanctum Bearer token auth

const TOKEN_KEY = 'nexa_auth_token';
const USER_KEY  = 'nexa_auth_user';

export const authStorage = {
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clear old mock storage keys
    localStorage.removeItem('nexa_tasks');
    localStorage.removeItem('nexa_user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
