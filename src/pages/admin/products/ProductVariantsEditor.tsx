import React from 'react';
import type { AdminProductVariant } from '@/services/adminMockStore';
import { newEntityId } from '@/services/adminMockStore';

type Props = {
  variants: AdminProductVariant[];
  onChange: (rows: AdminProductVariant[]) => void;
  basePrice: number;
};

const inputCls =
  'w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100';

export default function ProductVariantsEditor({ variants, onChange, basePrice }: Props) {
  const update = (id: string, patch: Partial<AdminProductVariant>) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const remove = (id: string) => {
    if (variants.length <= 1) return;
    onChange(variants.filter((v) => v.id !== id));
  };

  const add = () => {
    onChange([
      ...variants,
      {
        id: newEntityId('var'),
        sku: `SKU-${newEntityId('').slice(-6)}`,
        stock: 0,
        price: undefined,
      },
    ]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Biến thể / SKU</div>
          <div className="text-xs text-slate-500">Mỗi dòng là một SKU (màu, dung lượng, size, tồn kho).</div>
        </div>
        <button
          type="button"
          onClick={add}
          className="text-xs font-bold text-primary hover:underline px-2 py-1"
        >
          + Thêm SKU
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-bold text-slate-600 dark:text-slate-400">
              <th className="px-3 py-2">SKU *</th>
              <th className="px-3 py-2">Màu</th>
              <th className="px-3 py-2">Dung lượng</th>
              <th className="px-3 py-2">Kích cỡ</th>
              <th className="px-3 py-2 w-24">Tồn *</th>
              <th className="px-3 py-2 w-28">Giá (tuỳ chọn)</th>
              <th className="px-3 py-2 w-24"> </th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 align-top">
                  <input
                    className={inputCls}
                    value={v.sku}
                    onChange={(e) => update(v.id, { sku: e.target.value })}
                    placeholder="VD: IP15-BLK-256"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    className={inputCls}
                    value={v.color ?? ''}
                    onChange={(e) => update(v.id, { color: e.target.value || undefined })}
                    placeholder="—"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    className={inputCls}
                    value={v.storage ?? ''}
                    onChange={(e) => update(v.id, { storage: e.target.value || undefined })}
                    placeholder="—"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    className={inputCls}
                    value={v.size ?? ''}
                    onChange={(e) => update(v.id, { size: e.target.value || undefined })}
                    placeholder="—"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={v.stock}
                    onChange={(e) => update(v.id, { stock: Number(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={v.price ?? ''}
                    placeholder={String(basePrice)}
                    onChange={(e) => {
                      const t = e.target.value;
                      update(v.id, { price: t === '' ? undefined : Number(t) });
                    }}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <button
                    type="button"
                    onClick={() => remove(v.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                    disabled={variants.length <= 1}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2 text-[11px] text-slate-500 bg-slate-50/80 dark:bg-slate-800/30">
        Giá biến thể để trống để dùng giá sản phẩm ({basePrice.toLocaleString('vi-VN')}).
      </p>
    </div>
  );
}
