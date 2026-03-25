import React, { useEffect, useState } from 'react';
import {
  addAdminVoucher,
  deleteAdminVoucher,
  getAdminVouchers,
  type AdminVoucher,
  type VoucherDiscountType,
} from '@/services/adminMockStore';

const inputCls =
  'mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';

export default function VoucherBuilderPage() {
  const [list, setList] = useState<AdminVoucher[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<VoucherDiscountType>('percent');
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 16);
  });

  const reload = () => setList(getAdminVouchers());

  useEffect(() => {
    reload();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    addAdminVoucher({
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(value) || 0,
      maxUses: Number(maxUses) || 0,
      expiresAt: new Date(expiresAt).toISOString(),
      active: true,
    });
    setCode('');
    reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Voucher</h1>
        <p className="text-xs text-slate-500">Tạo mã giảm giá (% hoặc số tiền), hạn dùng, giới hạn lượt — lưu local (demo).</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
      >
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 md:col-span-2">
          Mã
          <input className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: SAVE20" />
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
          Loại
          <select
            className={inputCls}
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as VoucherDiscountType)}
          >
            <option value="percent">Phần trăm (%)</option>
            <option value="fixed">Số tiền cố định</option>
          </select>
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
          Giá trị {discountType === 'percent' ? '(%)' : '(VND)'}
          <input
            type="number"
            min={0}
            className={inputCls}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
          Hết hạn
          <input
            type="datetime-local"
            className={inputCls}
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
          Giới hạn lượt dùng
          <input
            type="number"
            min={1}
            className={inputCls}
            value={maxUses}
            onChange={(e) => setMaxUses(Number(e.target.value))}
          />
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm">
            Tạo voucher
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-left text-xs font-bold text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Giá trị</th>
              <th className="px-4 py-3">Hết hạn</th>
              <th className="px-4 py-3">Đã dùng / Max</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-mono font-bold">{v.code}</td>
                <td className="px-4 py-3">{v.discountType === 'percent' ? '%' : 'VND'}</td>
                <td className="px-4 py-3">{v.value}</td>
                <td className="px-4 py-3 text-xs">{new Date(v.expiresAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {v.usedCount} / {v.maxUses}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-red-600 font-semibold text-xs"
                    onClick={() => {
                      deleteAdminVoucher(v.id);
                      reload();
                    }}
                  >
                    Xóa
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
