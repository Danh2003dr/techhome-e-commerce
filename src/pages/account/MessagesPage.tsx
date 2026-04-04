import React, { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSupportChat } from '@/context/SupportChatContext';
import { isApiConfigured } from '@/services/api';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

/**
 * Khách: hướng dẫn dùng khung chat góc phải toàn trang. Mở /messages?product= để kèm gợi ý sản phẩm.
 * Admin/Mod: chuyển /admin/messages.
 */
const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { openSupportChat, setIsOpen } = useSupportChat();
  const apiOn = isApiConfigured();

  const isStaffUser =
    isAuthenticated &&
    ['ADMIN', 'MODERATOR'].includes(String(user?.role ?? '').trim().toUpperCase());

  useEffect(() => {
    const raw = searchParams.get('product');
    if (raw == null || raw.trim() === '') return;
    const pid = parseInt(String(raw), 10);
    if (!Number.isNaN(pid) && pid >= 1) {
      openSupportChat({ productId: pid });
    }
  }, [searchParams, openSupportChat]);

  if (isStaffUser) {
    return <Navigate to="/admin/messages" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full flex-1">
        <AccountSidebar />

        <main className="flex-1 min-w-0 max-w-2xl space-y-6">
          <div>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tài khoản', path: '/profile' },
                { label: 'Hỗ trợ & góp ý' },
              ]}
            />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">Hỗ trợ cửa hàng</h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Khung chat nằm ở <strong className="text-slate-700 dark:text-slate-300">góc phải màn hình</strong> (biểu tượng
              tin nhắn) — mở mọi lúc khi duyệt cửa hàng.
            </p>
          </div>

          {!apiOn && (
            <p className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm px-4 py-3">
              Cấu hình <code className="font-mono text-xs">VITE_API_URL</code> để dùng tin nhắn.
            </p>
          )}

          {apiOn && !isAuthenticated && (
            <p className="text-slate-600 dark:text-slate-400">
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Đăng nhập
              </Link>{' '}
              để chat — sau đó bấm biểu tượng chat góc phải.
            </p>
          )}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-4">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Nếu khung chat đang đóng, bấm nút dưới đây để mở lại.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors"
            >
              <span className="material-icons text-lg">chat</span>
              Mở hộp chat hỗ trợ
            </button>
          </div>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default MessagesPage;
