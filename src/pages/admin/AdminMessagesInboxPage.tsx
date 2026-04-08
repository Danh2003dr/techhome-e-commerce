import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useChatThreadScrollBottom } from '@/hooks/useChatThreadScroll';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isApiConfigured, ApiError } from '@/services/api';
import { getConversations, getMessageThread, getSupportMeta, sendTextMessage } from '@/services/messagesApi';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { ConversationListItemDto, MessageDto, SupportMetaDto } from '@/types/api';
import { formatDate } from '@/utils/formatDate';
import { chatDisplayName, chatFilePublicUrl, chatOtherInMessage } from '@/utils/chatUi';

/**
 * Giao diện quản trị: danh sách toàn bộ khách đã nhắn + luồng trả lời.
 * Khác hẳn trang /messages (khách chỉ chat một kênh hỗ trợ).
 */
const AdminMessagesInboxPage: React.FC = () => {
  const { customerId: customerParam } = useParams<{ customerId?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const myId = user?.id != null ? Number(user.id) : NaN;

  const [meta, setMeta] = useState<SupportMetaDto | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<ConversationListItemDto[]>([]);
  const [thread, setThread] = useState<MessageDto[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [socketTick, setSocketTick] = useState(0);
  const [inboxQuery, setInboxQuery] = useState('');
  const threadRef = useRef<MessageDto[]>([]);
  threadRef.current = thread;
  const prevCustomerThreadRef = useRef<string | null>(null);

  const apiOn = isApiConfigured();
  const customerId = customerParam?.trim() || null;

  const bumpFromSocket = useCallback(() => {
    setSocketTick((t) => t + 1);
  }, []);

  const socketEnabled = apiOn && isAuthenticated && Number.isFinite(myId);
  const { emitNewMess } = useChatSocket(socketEnabled, customerId, bumpFromSocket);

  useEffect(() => {
    if (!apiOn || !isAuthenticated) {
      setMeta(null);
      return;
    }
    getSupportMeta()
      .then((m) => {
        setMeta(m);
        if (!m.isStaff) {
          setMetaError('Tài khoản không có quyền hộp thư admin.');
        } else {
          setMetaError(null);
        }
      })
      .catch((e: unknown) => {
        setMeta(null);
        setMetaError(e instanceof ApiError ? e.message : 'Không tải được cấu hình.');
      });
  }, [apiOn, isAuthenticated]);

  const loadConversations = useCallback(async () => {
    if (!apiOn || !isAuthenticated || !meta?.isStaff) return;
    setListLoading(true);
    setListError(null);
    try {
      const list = await getConversations();
      setConversations(list);
    } catch (e: unknown) {
      setConversations([]);
      setListError(e instanceof ApiError ? e.message : 'Không tải danh sách khách.');
    } finally {
      setListLoading(false);
    }
  }, [apiOn, isAuthenticated, meta?.isStaff]);

  const loadThread = useCallback(async () => {
    if (!apiOn || !isAuthenticated || !customerId || !meta?.isStaff) {
      prevCustomerThreadRef.current = null;
      setThread([]);
      return;
    }
    const sameCustomer = prevCustomerThreadRef.current === customerId;
    prevCustomerThreadRef.current = customerId;
    const quietRefresh = sameCustomer && threadRef.current.length > 0;
    if (!quietRefresh) {
      setThreadLoading(true);
    }
    setSendError(null);
    try {
      const rows = await getMessageThread(customerId);
      setThread(rows);
    } catch (e: unknown) {
      setThread([]);
      setSendError(e instanceof ApiError ? e.message : 'Không tải tin nhắn.');
    } finally {
      setThreadLoading(false);
    }
  }, [apiOn, isAuthenticated, customerId, meta?.isStaff]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations, socketTick]);

  useEffect(() => {
    setThread([]);
    prevCustomerThreadRef.current = null;
  }, [customerId]);

  useEffect(() => {
    void loadThread();
  }, [loadThread, socketTick]);

  const sortedThread = useMemo(() => {
    return [...thread].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [thread]);

  const threadScrollKey = useMemo(() => sortedThread.map((m) => m.id).join(','), [sortedThread]);

  const adminChatScrollRef = useChatThreadScrollBottom(
    threadScrollKey,
    threadLoading,
    Boolean(customerId && sortedThread.length > 0)
  );

  const filteredConversations = useMemo(() => {
    const q = inboxQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((row) => {
      const preview = row.message;
      const other = Number.isFinite(myId) ? chatOtherInMessage(preview, myId) : preview.to;
      const name = chatDisplayName(other).toLowerCase();
      const snippet = (preview.messageContent?.text ?? '').toLowerCase();
      return name.includes(q) || snippet.includes(q);
    });
  }, [conversations, inboxQuery, myId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !draft.trim() || !Number.isFinite(myId)) return;
    const toUserId = parseInt(customerId, 10);
    if (Number.isNaN(toUserId)) return;
    setSending(true);
    setSendError(null);
    try {
      const msg = await sendTextMessage(toUserId, draft.trim());
      setDraft('');
      emitNewMess(Number(msg.from.id), Number(msg.to.id));
      await loadThread();
      await loadConversations();
    } catch (err: unknown) {
      setSendError(err instanceof ApiError ? err.message : 'Gửi thất bại.');
    } finally {
      setSending(false);
    }
  };

  const activeCustomerLabel = useMemo(() => {
    if (!customerId || !Number.isFinite(myId)) return '';
    const last = thread[0];
    if (last) return chatDisplayName(chatOtherInMessage(last, myId));
    return 'Khách hàng';
  }, [customerId, myId, thread]);

  if (!apiOn) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Cấu hình <code className="font-mono text-xs">VITE_API_URL</code> để dùng hộp thư.
      </div>
    );
  }

  if (metaError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
        {metaError}
      </div>
    );
  }

  if (!meta?.isStaff) {
    return <p className="text-slate-500 text-sm">Đang kiểm tra quyền…</p>;
  }

  return (
    <div className="flex flex-col gap-5 h-[min(calc(100vh-7rem),920px)] min-h-[480px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hộp thư khách hàng</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Trả lời tin nhắn; tin kèm sản phẩm có nhãn riêng.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="material-icons text-base text-primary">inbox</span>
          <span>
            {conversations.length} hội thoại
            {filteredConversations.length !== conversations.length
              ? ` · lọc: ${filteredConversations.length}`
              : ''}
          </span>
        </div>
      </div>

      {listError && (
        <p className="text-red-600 text-sm shrink-0" role="alert">
          {listError}
        </p>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        <aside className="lg:col-span-4 flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm min-h-[280px] lg:min-h-0">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/40">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Danh sách</p>
            <input
              type="search"
              value={inboxQuery}
              onChange={(e) => setInboxQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc nội dung…"
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {listLoading && <p className="p-4 text-sm text-slate-500">Đang tải…</p>}
            {!listLoading && filteredConversations.length === 0 && (
              <p className="p-4 text-sm text-slate-500 leading-relaxed">Chưa có hội thoại hoặc không khớp tìm kiếm.</p>
            )}
            {filteredConversations.map((row) => {
              const oid = Number(row.user);
              const preview = row.message;
              const other = Number.isFinite(myId) ? chatOtherInMessage(preview, myId) : preview.to;
              const active = customerId === String(oid);
              const snippet =
                preview.messageContent?.type === 'file'
                  ? '[Tệp]'
                  : (preview.messageContent?.text ?? '').slice(0, 80);
              const fb = preview.contextType === 'PRODUCT_FEEDBACK';
              const initial = chatDisplayName(other).charAt(0).toUpperCase() || '?';
              return (
                <button
                  key={row.user}
                  type="button"
                  onClick={() => navigate(`/admin/messages/${oid}`)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 transition-colors flex gap-3 ${
                    active ? 'bg-primary/8 border-l-[3px] border-l-primary' : 'border-l-[3px] border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0"
                    aria-hidden
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{chatDisplayName(other)}</div>
                    {fb && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                        Sản phẩm
                      </span>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{snippet}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(preview.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="lg:col-span-8 flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[320px] lg:min-h-0 shadow-sm">
          {!customerId && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-slate-500 dark:text-slate-400">
              <span className="material-icons text-6xl text-slate-200 dark:text-slate-700 mb-4">chat_bubble_outline</span>
              <p className="text-base font-medium text-slate-700 dark:text-slate-300">Chọn một cuộc hội thoại</p>
              <p className="text-sm mt-2 max-w-sm">Bấm vào khách ở cột trái để xem tin và trả lời.</p>
            </div>
          )}
          {customerId && (
            <>
              <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center text-lg font-bold shrink-0"
                    aria-hidden
                  >
                    {activeCustomerLabel.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Khách</p>
                    <p className="font-bold text-slate-900 dark:text-white truncate text-lg">{activeCustomerLabel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/messages')}
                  className="shrink-0 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  Đóng
                </button>
              </header>
              <div
                ref={adminChatScrollRef}
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-slate-50/80 dark:bg-slate-950/30"
              >
                {threadLoading && thread.length === 0 && (
                  <p className="text-sm text-slate-500">Đang tải…</p>
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
                          className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-sm ${
                            mine
                              ? 'bg-indigo-600 text-white rounded-br-md shadow-md'
                              : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-md shadow-sm'
                          }`}
                        >
                          {!mine && (
                            <p className="text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wide">Khách</p>
                          )}
                          {mine && (
                            <p className="text-[9px] font-bold uppercase text-indigo-200 mb-1 tracking-wide">Bạn (admin)</p>
                          )}
                          {fb && (
                            <div
                              className={`text-[10px] font-bold uppercase mb-1.5 pb-1 border-b ${
                                mine
                                  ? 'border-white/25 text-amber-100'
                                  : 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              Sản phẩm
                              {m.productNameSnapshot ? ` · ${m.productNameSnapshot}` : ''}
                              {m.productId != null ? ` (#${m.productId})` : ''}
                            </div>
                          )}
                          {content?.type === 'file' ? (
                            <a
                              href={chatFilePublicUrl(content.text)}
                              target="_blank"
                              rel="noreferrer"
                              className={mine ? 'underline' : 'text-indigo-600 dark:text-indigo-400 underline font-medium'}
                            >
                              Tệp đính kèm
                            </a>
                          ) : (
                            <span className="whitespace-pre-wrap break-words">{content?.text}</span>
                          )}
                          <p className={`text-[10px] mt-1.5 opacity-75 ${mine ? 'text-right' : ''}`}>
                            {formatDate(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {sendError && <p className="px-4 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 py-2">{sendError}</p>}
              <form
                onSubmit={handleSend}
                className="p-3 border-t-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Trả lời khách…"
                  className="flex-1 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  Gửi
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminMessagesInboxPage;
