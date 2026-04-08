import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface SupportChatContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** Mở hộp chat góc màn hình; có thể kèm productId để soạn sẵn tin (nhãn Sản phẩm) */
  openSupportChat: (opts?: { productId?: number }) => void;
  pendingProductId: number | null;
  clearPendingProduct: () => void;
  /** Tin nhắn tiếp theo gửi kèm ngữ cảnh sản phẩm (API productId) — dùng từ /messages hoặc widget */
  composeProductAttachId: number | null;
  setComposeProductAttachId: (id: number | null) => void;
}

const SupportChatContext = createContext<SupportChatContextValue | null>(null);

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [composeProductAttachId, setComposeProductAttachId] = useState<number | null>(null);

  const openSupportChat = useCallback((opts?: { productId?: number }) => {
    if (opts?.productId != null && Number.isFinite(Number(opts.productId))) {
      setPendingProductId(Number(opts.productId));
    }
    setIsOpen(true);
  }, []);

  const clearPendingProduct = useCallback(() => {
    setPendingProductId(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      openSupportChat,
      pendingProductId,
      clearPendingProduct,
      composeProductAttachId,
      setComposeProductAttachId,
    }),
    [isOpen, openSupportChat, pendingProductId, clearPendingProduct, composeProductAttachId]
  );

  return <SupportChatContext.Provider value={value}>{children}</SupportChatContext.Provider>;
}

export function useSupportChat(): SupportChatContextValue {
  const ctx = useContext(SupportChatContext);
  if (!ctx) {
    throw new Error('useSupportChat must be used within SupportChatProvider');
  }
  return ctx;
}
