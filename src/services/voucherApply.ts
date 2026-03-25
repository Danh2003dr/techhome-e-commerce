import { getAdminVouchers } from '@/services/adminMockStore';

export type VoucherApplyResult =
  | { ok: true; discountAmount: number; code: string }
  | { ok: false; message: string };

export function tryApplyVoucherCode(rawCode: string, subtotal: number): VoucherApplyResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, message: 'Nhập mã giảm giá.' };
  if (!(subtotal > 0)) return { ok: false, message: 'Giỏ hàng trống.' };

  const v = getAdminVouchers().find((x) => x.active && x.code.toUpperCase() === code);
  if (!v) return { ok: false, message: 'Mã không hợp lệ.' };
  if (!v.expiresAt || new Date(v.expiresAt) < new Date()) return { ok: false, message: 'Mã đã hết hạn.' };
  if (v.usedCount >= v.maxUses) return { ok: false, message: 'Mã đã hết lượt sử dụng.' };

  let discountAmount = 0;
  if (v.discountType === 'percent') {
    const pct = Math.min(100, Math.max(0, v.value));
    discountAmount = Math.floor((subtotal * pct) / 100);
  } else {
    discountAmount = Math.min(Math.max(0, v.value), subtotal);
  }

  return { ok: true, discountAmount, code: v.code };
}
