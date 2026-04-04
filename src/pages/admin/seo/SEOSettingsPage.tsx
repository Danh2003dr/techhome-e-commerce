import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Trang cài đặt admin: chỉ hiển thị giá trị thật (DOM hiện tại + biến env build), không có form mock.
 */
const SEOSettingsPage: React.FC = () => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    setDocumentTitle(document.title?.trim() || '');
    const el = document.querySelector('meta[name="description"]');
    setMetaDescription(el?.getAttribute('content')?.trim() || '');
  }, []);

  const envTitle = (import.meta.env.VITE_SITE_TITLE as string | undefined)?.trim() || '';
  const envDescription = (import.meta.env.VITE_SITE_DESCRIPTION as string | undefined)?.trim() || '';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Cài đặt &amp; thương hiệu</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Dữ liệu đọc từ trang đang mở và từ biến môi trường lúc build — không dùng dữ liệu giả trong giao diện.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Về bảng điều khiển
        </Link>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Trên trình duyệt (thực tế)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Giá trị lấy khi bạn mở trang này — phản ánh <span className="font-mono">index.html</span> và tiêu đề route hiện tại.
          </p>
        </div>
        <dl className="p-6 space-y-4">
          <div>
            <dt className="text-xs font-bold text-slate-500 uppercase tracking-wide">document.title</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white break-words">
              {documentTitle || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500 uppercase tracking-wide">meta name=&quot;description&quot;</dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
              {metaDescription || '—'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Biến môi trường (build)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tùy chọn trong <span className="font-mono">.env</span> — cần build lại sau khi sửa.
          </p>
        </div>
        <dl className="p-6 space-y-4">
          <div>
            <dt className="text-xs font-bold text-slate-500 uppercase tracking-wide">VITE_SITE_TITLE</dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">{envTitle || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500 uppercase tracking-wide">VITE_SITE_DESCRIPTION</dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{envDescription || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/40 px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Chỉnh nội dung SEO</p>
        <p className="leading-relaxed">
          Sửa <span className="font-mono text-xs">&lt;title&gt;</span>, <span className="font-mono text-xs">meta description</span> và thẻ{' '}
          <span className="font-mono text-xs">og:*</span> trong <span className="font-mono text-xs">index.html</span>, hoặc cấu hình qua pipeline
          deploy. Không lưu SEO giả trong localStorage trên trang này.
        </p>
      </section>
    </div>
  );
};

export default SEOSettingsPage;
