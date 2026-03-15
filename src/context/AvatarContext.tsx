import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const AVATAR_KEY = 'techhome_avatar';

interface AvatarContextType {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AVATAR_KEY);
    } catch {
      return null;
    }
  });

  const setAvatarUrl = useCallback((url: string | null) => {
    setAvatarUrlState(url);
    try {
      if (url) localStorage.setItem(AVATAR_KEY, url);
      else localStorage.removeItem(AVATAR_KEY);
    } catch {
      // ignore
    }
  }, []);

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
