import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Sau mỗi lần cập nhật luồng tin, cuộn vùng chat xuống cuối (tránh thanh cuộn nhảy lên đầu).
 */
export function useChatThreadScrollBottom(
  threadFingerprint: string,
  threadLoading: boolean,
  enabled: boolean
): RefObject<HTMLDivElement | null> {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!enabled || threadLoading) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [threadFingerprint, threadLoading, enabled]);
  return scrollRef;
}
