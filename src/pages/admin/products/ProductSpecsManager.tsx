import React from 'react';
import type { AdminProductSpec } from '@/services/adminMockStore';
import { newEntityId } from '@/services/adminMockStore';

type Props = {
  specs: AdminProductSpec[];
  onChange: (rows: AdminProductSpec[]) => void;
};

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100';

export default function ProductSpecsManager({ specs, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-900 dark:text-white">Thông số (key–value)</div>
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
          className="text-xs font-bold text-primary hover:underline"
        >
          + Thêm dòng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-bold text-slate-600 dark:text-slate-400">
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Giá trị</th>
              <th className="px-4 py-2 w-16" />
            </tr>
          </thead>
          <tbody>
            {specs.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-2">
                  <input
                    className={inputCls}
                    value={r.key}
                    placeholder="VD: Màn hình"
                    onChange={(e) => {
                      const t = e.target.value;
                      onChange(specs.map((x) => (x.id === r.id ? { ...x, key: t } : x)));
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    className={inputCls}
                    value={r.value}
                    placeholder="VD: 6.1 inch"
                    onChange={(e) => {
                      const t = e.target.value;
                      onChange(specs.map((x) => (x.id === r.id ? { ...x, value: t } : x)));
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Xóa"
                    onClick={() => onChange(specs.filter((x) => x.id !== r.id))}
                  >
                    <span className="material-icons text-lg">close</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
