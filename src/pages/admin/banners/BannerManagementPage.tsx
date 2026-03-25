import React, { useEffect, useState } from 'react';
import type { Banner } from '@/types';
import { getAdminBanners, saveAdminBanners, newEntityId } from '@/services/adminMockStore';

const inputCls =
  'mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';

export default function BannerManagementPage() {
  const [rows, setRows] = useState<Banner[]>([]);

  useEffect(() => {
    setRows(getAdminBanners());
  }, []);

  const persist = (next: Banner[]) => {
    saveAdminBanners(next);
    setRows(next);
  };

  const addRow = () => {
    persist([
      ...rows,
      {
        id: newEntityId('ban'),
        title: 'Tiêu đề',
        subtitle: 'Nhãn',
        image: 'https://picsum.photos/seed/banner/1200/400',
        link: '/',
        linkText: 'Xem thêm',
        theme: 'primary',
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Banner trang chủ</h1>
          <p className="text-xs text-slate-500">Chỉnh slider/hero — lưu trong trình duyệt (demo).</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold"
        >
          + Thêm slide
        </button>
      </div>

      <div className="space-y-6">
        {rows.map((b, idx) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500">Slide {idx + 1}</div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Tiêu đề
                <input
                  className={inputCls}
                  value={b.title}
                  onChange={(e) => {
                    const t = e.target.value;
                    persist(rows.map((x) => (x.id === b.id ? { ...x, title: t } : x)));
                  }}
                />
              </label>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Nhãn phụ
                <input
                  className={inputCls}
                  value={b.subtitle}
                  onChange={(e) => {
                    const t = e.target.value;
                    persist(rows.map((x) => (x.id === b.id ? { ...x, subtitle: t } : x)));
                  }}
                />
              </label>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                URL ảnh
                <input
                  className={inputCls}
                  value={b.image}
                  onChange={(e) => {
                    const t = e.target.value;
                    persist(rows.map((x) => (x.id === b.id ? { ...x, image: t } : x)));
                  }}
                />
              </label>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Link đích (path, ví dụ /category/mobile)
                <input
                  className={inputCls}
                  value={b.link}
                  onChange={(e) => {
                    const t = e.target.value;
                    persist(rows.map((x) => (x.id === b.id ? { ...x, link: t } : x)));
                  }}
                />
              </label>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Text nút
                <input
                  className={inputCls}
                  value={b.linkText}
                  onChange={(e) => {
                    const t = e.target.value;
                    persist(rows.map((x) => (x.id === b.id ? { ...x, linkText: t } : x)));
                  }}
                />
              </label>
              <button
                type="button"
                className="text-sm font-bold text-red-600"
                onClick={() => persist(rows.filter((x) => x.id !== b.id))}
              >
                Xóa slide
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 min-h-[200px]">
              <img src={b.image} alt="" className="w-full h-48 object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
