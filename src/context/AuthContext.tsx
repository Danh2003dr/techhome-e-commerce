import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getToken, getStoredUser, clearToken } from '@/services/api';
import * as backend from '@/services/backend';
import type { AuthUserDto, AuthRequest, RegisterRequest, AuthResponse } from '@/types/api';
import { ApiError } from '@/services/api';
import { useAvatar } from '@/context/AvatarContext';

export interface AuthState {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthContextType extends AuthState {
  login: (body: AuthRequest) => Promise<AuthResponse>;
  register: (body: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAvatarUrl } = useAvatar();
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(stored);
      // Chỉ đồng bộ avatar khi có URL trong techhome_user — tránh ghi đè techhome_avatar
      // bằng null từ lần login cũ (avatar cập nhật ở Hồ sơ nhưng chưa merge vào user).
      if (stored.avatarUrl) {
        setAvatarUrl(stored.avatarUrl);
      }
    }
    setIsInitialized(true);
  }, [setAvatarUrl]);

  const login = useCallback(async (body: AuthRequest) => {
    const res = await backend.login(body);
    setUser(res.user);
    setAvatarUrl(res.user.avatarUrl ?? null);
    return res;
  }, [setAvatarUrl]);

  const register = useCallback(async (body: RegisterRequest) => {
    const res = await backend.register(body);
    setUser(res.user);
    setAvatarUrl(res.user.avatarUrl ?? null);
    return res;
  }, [setAvatarUrl]);

  const logout = useCallback(() => {
    void backend.logout();
    setUser(null);
    setAvatarUrl(null);
  }, [setAvatarUrl]);

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
