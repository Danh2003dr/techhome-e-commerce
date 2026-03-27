import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AvatarContextType {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const avatarKey = useMemo(() => {
    if (user?.id != null) return `techhome_avatar_${user.id}`;
    if (user?.email) return `techhome_avatar_${user.email}`;
    // When not authenticated, keep an isolated key.
    return 'techhome_avatar_anon';
  }, [user?.id, user?.email]);

  // Cleanup old shared key from previous buggy version.
  useEffect(() => {
    try {
      localStorage.removeItem('techhome_avatar');
    } catch {
      // ignore
    }
  }, []);

  const [avatarUrl, setAvatarUrlState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(avatarKey);
    } catch {
      return null;
    }
  });

  // Reload cache when switching user.
  useEffect(() => {
    try {
      setAvatarUrlState(localStorage.getItem(avatarKey));
    } catch {
      setAvatarUrlState(null);
    }
  }, [avatarKey]);

  const setAvatarUrl = useCallback(
    (url: string | null) => {
      setAvatarUrlState(url);
      try {
        if (url) localStorage.setItem(avatarKey, url);
        else localStorage.removeItem(avatarKey);
      } catch {
        // ignore
      }
    },
    [avatarKey]
  );

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export function useAvatar(): AvatarContextType {
  const ctx = useContext(AvatarContext);
  if (ctx === undefined) throw new Error('useAvatar must be used within AvatarProvider');
  return ctx;
}
