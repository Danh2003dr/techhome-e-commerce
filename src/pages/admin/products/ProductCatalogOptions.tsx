import React from 'react';
import { newEntityId } from '@/services/adminMockStore';

export type CatalogColorRow = { id: string; name: string; hex: string };
export type CatalogStorageRow = { id: string; value: string };

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow';

type Props = {
  colorRows: CatalogColorRow[];
  onColorRowsChange: (rows: CatalogColorRow[]) => void;
  storageRows: CatalogStorageRow[];
  onStorageRowsChange: (rows: CatalogStorageRow[]) => void;
};

export default function ProductCatalogOptions({
  colorRows,
  onColorRowsChange,
  storageRows,
  onStorageRowsChange,
}: Props) {
  const updateColor = (id: string, patch: Partial<CatalogColorRow>) => {
    onColorRowsChange(colorRows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeColor = (id: string) => {
    onColorRowsChange(colorRows.filter((r) => r.id !== id));
  };
  const addColor = () => {
    onColorRowsChange([...colorRows, { id: newEntityId('col'), name: '', hex: '#6b7280' }]);
  };

  const updateStorage = (id: string, value: string) => {
    onStorageRowsChange(storageRows.map((r) => (r.id === id ? { ...r, value } : r)));
  };
  const removeStorage = (id: string) => {
    onStorageRowsChange(storageRows.filter((r) => r.id !== id));
  };
  const addStorage = () => {
    onStorageRowsChange([...storageRows, { id: newEntityId('sto'), value: '' }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900">
          <div className="flex gap-3 min-w-0">
            <span className="material-icons text-primary shrink-0 text-[22px]">palette</span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Màu sắc</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Hiển thị trên trang sản phẩm — mỗi dòng: tên hiển thị + màu (lưu cùng dữ liệu catalog).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addColor}
            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/15 transition-colors"
          >
            <span className="material-icons text-[16px]">add</span>
            Thêm
          </button>
        </div>
        {colorRows.length === 0 ? (
          <button
            type="button"
            onClick={addColor}
            className="w-full py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-b-2xl text-sm text-slate-500 hover:border-primary/40 hover:bg-primary/[0.03] transition-colors"
          >
            Chưa có màu — bấm để thêm (có thể bỏ qua)
          </button>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-800/50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 pl-5">Tên màu</th>
                  <th className="px-4 py-2.5 w-[100px]">Màu</th>
                  <th className="px-4 py-2.5 w-14 pr-5" />
                </tr>
              </thead>
              <tbody>
                {colorRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-2.5 pl-5 align-middle">
                      <input
                        className={inputCls}
                        value={r.name}
                        onChange={(e) => updateColor(r.id, { name: e.target.value })}
                        placeholder="Ví dụ: Đen Titanium"
                      />
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer bg-white dark:bg-slate-800 shrink-0"
                          value={/^#[0-9A-Fa-f]{6}$/.test(r.hex) ? r.hex : '#6b7280'}
                          onChange={(e) => updateColor(r.id, { hex: e.target.value })}
                          title="Chọn màu"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2.5 pr-5 align-middle text-right">
                      <button
                        type="button"
                        onClick={() => removeColor(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        aria-label="Xóa màu"
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

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900">
          <div className="flex gap-3 min-w-0">
            <span className="material-icons text-primary shrink-0 text-[22px]">storage</span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dung lượng / phiên bản</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Các lựa chọn như 128GB, 256GB — hiển thị dạng nút trên cửa hàng.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addStorage}
            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/15 transition-colors"
          >
            <span className="material-icons text-[16px]">add</span>
            Thêm
          </button>
        </div>
        {storageRows.length === 0 ? (
          <button
            type="button"
            onClick={addStorage}
            className="w-full py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-b-2xl text-sm text-slate-500 hover:border-primary/40 hover:bg-primary/[0.03] transition-colors"
          >
            Chưa có dung lượng — bấm để thêm (có thể bỏ qua)
          </button>
        ) : (
          <ul className="p-3 space-y-2">
            {storageRows.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <span className="material-icons text-slate-300 text-lg shrink-0 select-none">fiber_manual_record</span>
                <input
                  className={inputCls + ' flex-1'}
                  value={r.value}
                  onChange={(e) => updateStorage(r.id, e.target.value)}
                  placeholder="Ví dụ: 256GB"
                />
                <button
                  type="button"
                  onClick={() => removeStorage(r.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                  aria-label="Xóa"
                >
                  <span className="material-icons text-xl">close</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
