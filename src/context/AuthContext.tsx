import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getToken, getStoredUser, clearToken } from '@/services/api';
import * as backend from '@/services/backend';
import type { AuthUserDto, AuthRequest, RegisterRequest } from '@/types/api';
import { ApiError } from '@/services/api';

export interface AuthState {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthContextType extends AuthState {
  login: (body: AuthRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(stored);
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(async (body: AuthRequest) => {
    const res = await backend.login(body);
    setUser(res.user);
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    const res = await backend.register(body);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    backend.logout();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isInitialized,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
