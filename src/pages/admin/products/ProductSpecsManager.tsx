import React from 'react';
import type { AdminProductSpec } from '@/services/adminMockStore';
import { newEntityId } from '@/services/adminMockStore';

type Props = {
  specs: AdminProductSpec[];
  onChange: (rows: AdminProductSpec[]) => void;
};

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow';

export default function ProductSpecsManager({ specs, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900">
        <div className="flex gap-3 min-w-0">
          <span className="material-icons text-primary shrink-0 text-[22px]">tune</span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Thông số kỹ thuật</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-xl">
              Cặp tên–giá trị được gộp thành JSON lưu trên sản phẩm. Dùng cho bảng thông số trên trang chi tiết.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...specs,
              {
                id: newEntityId('spec'),
                key: '',
                value: '',
              },
            ])
          }
          className="shrink-0 inline-flex items-center gap-1 self-start rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/15 transition-colors"
        >
          <span className="material-icons text-[16px]">add</span>
          Thêm dòng
        </button>
      </div>
      {specs.length === 0 ? (
        <button
          type="button"
          onClick={() =>
            onChange([{ id: newEntityId('spec'), key: '', value: '' }])
          }
          className="w-full py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 m-3 rounded-xl text-sm text-slate-500 hover:border-primary/40 hover:bg-primary/[0.03] transition-colors"
        >
          Chưa có thông số — bấm để thêm dòng đầu tiên
        </button>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-800/50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 pl-5">Tên thông số</th>
                <th className="px-4 py-2.5">Giá trị</th>
                <th className="px-4 py-2.5 w-14 pr-5" />
              </tr>
            </thead>
            <tbody>
              {specs.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-2.5 pl-5">
                    <input
                      className={inputCls}
                      value={r.key}
                      placeholder="Ví dụ: Màn hình"
                      onChange={(e) => {
                        const t = e.target.value;
                        onChange(specs.map((x) => (x.id === r.id ? { ...x, key: t } : x)));
                      }}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      className={inputCls}
                      value={r.value}
                      placeholder="Ví dụ: 6.1 inch OLED"
                      onChange={(e) => {
                        const t = e.target.value;
                        onChange(specs.map((x) => (x.id === r.id ? { ...x, value: t } : x)));
                      }}
                    />
                  </td>
                  <td className="px-2 py-2.5 pr-5 text-right">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      aria-label="Xóa dòng"
                      onClick={() => onChange(specs.filter((x) => x.id !== r.id))}
                    >
                      <span className="material-icons text-xl">delete_outline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
