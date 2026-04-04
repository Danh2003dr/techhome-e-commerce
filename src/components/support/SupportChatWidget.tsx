import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatThreadScrollBottom } from '@/hooks/useChatThreadScroll';
import { useAuth } from '@/context/AuthContext';
import { useSupportChat } from '@/context/SupportChatContext';
import { isApiConfigured, ApiError } from '@/services/api';
import { getMessageThread, getSupportMeta, sendTextMessage } from '@/services/messagesApi';
import { getProduct } from '@/services/backend';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { MessageDto, SupportMetaDto } from '@/types/api';
import { formatDate } from '@/utils/formatDate';
import { chatFilePublicUrl } from '@/utils/chatUi';

/**
 * Hộp thoại chat hỗ trợ cố định góc phải (kiểu chatbot / Messenger).
 */
const SupportChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, pendingProductId, clearPendingProduct } = useSupportChat();
  const { isAuthenticated, user } = useAuth();
  const myId = user?.id != null ? Number(user.id) : NaN;

  const [meta, setMeta] = useState<SupportMetaDto | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);

  const [thread, setThread] = useState<MessageDto[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [socketTick, setSocketTick] = useState(0);
  const [attachProductId, setAttachProductId] = useState<number | null>(null);
  const productHintConsumed = useRef(false);
  const threadRef = useRef<MessageDto[]>([]);
  threadRef.current = thread;

  const apiOn = isApiConfigured();
  const peerId = meta?.supportUserId != null ? String(meta.supportUserId) : null;

  const bumpFromSocket = useCallback(() => {
    setSocketTick((t) => t + 1);
  }, []);

  const isStaffUser =
    isAuthenticated && ['ADMIN', 'MODERATOR'].includes(String(user?.role ?? '').trim().toUpperCase());

  const socketEnabled = apiOn && isAuthenticated && Number.isFinite(myId) && isOpen && Boolean(peerId);
  const { emitNewMess } = useChatSocket(socketEnabled, peerId, bumpFromSocket);

  useEffect(() => {
    if (!apiOn || !isAuthenticated) {
      setMeta(null);
      setMetaError(null);
      return;
    }
    setMetaLoading(true);
    setMetaError(null);
    getSupportMeta()
      .then((m) => setMeta(m))
      .catch((e: unknown) => {
        setMeta(null);
        setMetaError(e instanceof ApiError ? e.message : 'Không tải được cấu hình hỗ trợ.');
      })
      .finally(() => setMetaLoading(false));
  }, [apiOn, isAuthenticated]);

  useEffect(() => {
    productHintConsumed.current = false;
  }, [pendingProductId]);

  useEffect(() => {
    if (!isOpen || pendingProductId == null || meta?.isStaff) return;
    const pid = pendingProductId;
    if (productHintConsumed.current) return;
    productHintConsumed.current = true;
    setAttachProductId(pid);
    void (async () => {
      try {
        const p = await getProduct(pid);
        const name = p?.name?.trim() || `Mã ${pid}`;
        setDraft(
          (prev) =>
            prev.trim() ||
            `[Góp ý / báo lỗi sản phẩm]\n${name} (ID: ${pid})\n\nMô tả chi tiết: `
        );
      } catch {
        setDraft(
          (prev) =>
            prev.trim() ||
            `[Góp ý / báo lỗi sản phẩm]\nSản phẩm ID: ${pid}\n\nMô tả chi tiết: `
        );
      }
      clearPendingProduct();
    })();
  }, [isOpen, pendingProductId, meta?.isStaff, clearPendingProduct]);

  const loadThread = useCallback(async () => {
    if (!apiOn || !isAuthenticated || !peerId || !isOpen) {
      if (!isOpen) return;
      setThread([]);
      return;
    }
    const quietRefresh = threadRef.current.length > 0;
    if (!quietRefresh) {
      setThreadLoading(true);
    }
    setSendError(null);
    try {
      const rows = await getMessageThread(peerId);
      setThread(rows);
    } catch (e: unknown) {
      setThread([]);
      setSendError(e instanceof ApiError ? e.message : 'Không tải được tin nhắn.');
    } finally {
      setThreadLoading(false);
    }
  }, [apiOn, isAuthenticated, peerId, isOpen]);

  useEffect(() => {
    setThread([]);
  }, [peerId]);

  useEffect(() => {
    if (isOpen) void loadThread();
  }, [loadThread, socketTick, isOpen]);

  const sortedThread = useMemo(() => {
    return [...thread].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [thread]);

  const threadScrollKey = useMemo(() => sortedThread.map((m) => m.id).join(','), [sortedThread]);

  const chatScrollRef = useChatThreadScrollBottom(
    threadScrollKey,
    threadLoading,
    Boolean(isOpen && peerId && sortedThread.length > 0)
  );

  const supportIdNum = meta?.supportUserId;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !Number.isFinite(myId) || supportIdNum == null) return;
    setSending(true);
    setSendError(null);
    try {
      const productId = attachProductId != null ? attachProductId : undefined;
      const msg = await sendTextMessage(supportIdNum, draft.trim(), productId != null ? { productId } : undefined);
      setDraft('');
      if (attachProductId != null) setAttachProductId(null);
      emitNewMess(Number(msg.from.id), Number(msg.to.id));
      await loadThread();
    } catch (err: unknown) {
      setSendError(err instanceof ApiError ? err.message : 'Gửi không thành công.');
    } finally {
      setSending(false);
    }
  };

  const handleFabClick = () => {
    if (!apiOn) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/messages' } } });
      return;
    }
    if (isStaffUser) {
      navigate('/admin/messages');
      return;
    }
    setIsOpen(true);
  };

  if (!apiOn || isStaffUser) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1000] flex flex-col items-end gap-3 pointer-events-none">
      {/* Panel */}
      {isOpen && (
        <div
          className="pointer-events-auto flex flex-col w-[min(calc(100vw-2rem),380px)] h-[min(calc(100dvh-5.5rem),520px)] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 ring-1 ring-black/5 dark:ring-white/10"
          role="dialog"
          aria-label="Hỗ trợ TechHome"
        >
          {/* Header kiểu Messenger */}
          <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                <span className="material-icons text-white text-xl">support_agent</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">TechHome — Hỗ trợ</p>
                <p className="text-[11px] text-slate-500 truncate">Phản hồi trong giờ làm việc</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0 text-primary">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Thu nhỏ"
              >
                <span className="material-icons text-xl">remove</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Đóng"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/40">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Đăng nhập để chat với cửa hàng.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: { pathname: '/messages' } } })}
                className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-blue-600"
              >
                Đăng nhập
              </button>
            </div>
          )}

          {isAuthenticated && metaLoading && (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500">Đang kết nối…</p>
            </div>
          )}

          {isAuthenticated && metaError && (
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/40">
              <p className="text-xs text-red-600 dark:text-red-400 text-center">{metaError}</p>
            </div>
          )}

          {isAuthenticated && meta && !metaLoading && !metaError && peerId && (
            <>
              {attachProductId != null && (
                <p className="shrink-0 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/25 px-3 py-1.5 border-b border-emerald-100 dark:border-emerald-900/50">
                  Tin tiếp theo kèm ngữ cảnh sản phẩm (ID {attachProductId})
                </p>
              )}

              <div
                ref={chatScrollRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 space-y-2.5 bg-slate-100/90 dark:bg-slate-950/50"
              >
                {threadLoading && thread.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">Đang tải tin nhắn…</p>
                )}
                {!(threadLoading && thread.length === 0) &&
                  sortedThread.map((m) => {
                    const mine = Number.isFinite(myId) && Number(m.from.id) === myId;
                    const content = m.messageContent;
                    const fb =
                      m.contextType === 'PRODUCT_FEEDBACK' &&
                      (m.productNameSnapshot || m.productId != null);
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[88%] rounded-[18px] px-3.5 py-2 text-[13px] leading-snug shadow-sm ${
                            mine
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-600 rounded-bl-sm'
                          }`}
                        >
                          {fb && (
                            <div
                              className={`text-[9px] font-bold uppercase tracking-wide mb-1 pb-1 border-b ${
                                mine ? 'border-white/25 text-white/90' : 'border-amber-200/80 text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              Góp ý sản phẩm
                              {m.productNameSnapshot ? ` · ${m.productNameSnapshot}` : ''}
                              {m.productId != null ? ` (#${m.productId})` : ''}
                            </div>
                          )}
                          {content?.type === 'file' ? (
                            <a
                              href={chatFilePublicUrl(content.text)}
                              target="_blank"
                              rel="noreferrer"
                              className={mine ? 'underline' : 'text-primary underline font-medium'}
                            >
                              Tệp đính kèm
                            </a>
                          ) : (
                            <span className="whitespace-pre-wrap break-words">{content?.text}</span>
                          )}
                          <div className={`text-[10px] mt-1 opacity-70 ${mine ? 'text-right' : ''}`}>
                            {formatDate(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {sendError && (
                <p className="shrink-0 px-3 py-1.5 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30">
                  {sendError}
                </p>
              )}

              <form
                onSubmit={handleSend}
                className="shrink-0 p-2.5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2"
              >
                <div className="flex-1 flex items-center rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 pl-4 pr-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Nhập tin nhắn…"
                    className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
                    disabled={sending}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  aria-label="Gửi"
                >
                  <span className="material-icons text-xl">send</span>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : handleFabClick())}
        className="pointer-events-auto w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/35 hover:bg-blue-600 hover:scale-105 transition-transform flex items-center justify-center ring-4 ring-white dark:ring-slate-900"
        aria-label={isOpen ? 'Đóng chat hỗ trợ' : 'Mở chat hỗ trợ'}
        aria-expanded={isOpen}
      >
        <span className="material-icons text-3xl">{isOpen ? 'close' : 'chat'}</span>
      </button>
    </div>
  );
};

export default SupportChatWidget;
