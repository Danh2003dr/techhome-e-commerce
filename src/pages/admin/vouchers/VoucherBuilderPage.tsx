import React, { useCallback, useEffect, useState } from 'react';
import * as backend from '@/services/backend';
import { isApiConfigured, getToken, ApiError } from '@/services/api';
import type { CouponAdminDto, CouponDiscountTypeUi } from '@/types/api';

const inputCls =
  'mt-1 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';

export default function VoucherBuilderPage() {
  const [list, setList] = useState<CouponAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<CouponDiscountTypeUi>('percent');
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 16);
  });

  const reload = useCallback(async () => {
    if (!isApiConfigured() || !getToken()) {
      setList([]);
      setLoading(false);
      setError('Cầu hình API và đăng nhập tài khoản ADMIN để quản lý voucher.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await backend.getAdminCoupons({ page: 1, size: 100 });
      setList(res.items);
    } catch (e) {
      const msg =
        e instanceof ApiError && e.status === 403
          ? 'Bạn không có quyền ADMIN hoặc phiên đăng nhập hết hạn.'
          : e instanceof Error
            ? e.message
            : 'Không tải được danh sách voucher.';
      setError(msg);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!code.trim()) return;
    if (!getToken()) {
      setFormError('Vui lòng đăng nhập ADMIN.');
      return;
    }
    setSubmitting(true);
    try {
      await backend.createAdminCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        value: Number(value) || 0,
        maxUses: Number(maxUses) || 0,
        expiresAt: new Date(expiresAt).toISOString(),
        active: true,
      });
      setCode('');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Tạo voucher thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!getToken()) return;
    setError(null);
    try {
      await backend.deactivateAdminCoupon(id);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể vô hiệu hóa voucher.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Voucher</h1>
        <p className="text-xs text-slate-500">
          Tạo mã giảm giá (% hoặc số tiền), hạn dùng, giới hạn lượt — lưu trên server (MongoDB), đồng bộ với checkout.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
      >
        {formError && (
          <p className="md:col-span-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {formError}
          </p>
        )}
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 md:col-span-2">
          Mã
          <input className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: SAVE20" />
        </label>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
          Loại
          <select
            className={inputCls}
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as CouponDiscountTypeUi)}
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
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-60"
          >
            {submitting ? 'Đang tạo…' : 'Tạo voucher'}
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
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={7}>
                  Đang tải…
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={7}>
                  Chưa có voucher hoặc chưa tải được.
                </td>
              </tr>
            ) : (
              list.map((v) => {
                const limit = v.usageLimit ?? v.maxUses;
                const limitLabel = limit != null && limit > 0 ? limit : '∞';
                const expiryIso = v.validTo ?? v.expiresAt;
                return (
                  <tr key={v.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-mono font-bold">
                      {v.code}
                      {!v.active && (
                        <span className="ml-2 text-xs font-normal text-slate-400">(đã tắt)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{v.discountType === 'percent' ? '%' : 'VND'}</td>
                    <td className="px-4 py-3">{v.value}</td>
                    <td className="px-4 py-3 text-xs">
                      {expiryIso ? new Date(expiryIso).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {v.usedCount} / {limitLabel}
                    </td>
                    <td className="px-4 py-3 text-xs">{v.active ? 'Hoạt động' : 'Tắt'}</td>
                    <td className="px-4 py-3">
                      {v.active ? (
                        <button
                          type="button"
                          className="text-red-600 font-semibold text-xs"
                          onClick={() => handleDeactivate(v.id)}
                        >
                          Vô hiệu
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
