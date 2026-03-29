import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { isApiConfigured } from '@/services/api';
import { getProfile, updateProfile } from '@/services/backend';
import { ApiError } from '@/services/api';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

const TEXTAREA_CLASS =
  'w-full min-h-[140px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm text-slate-900 dark:text-slate-100';

const CheckoutStep1: React.FC<CheckoutStep1Props> = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const { isAuthenticated } = useAuth();
  const [addressText, setAddressText] = useState(() => checkoutData.shippingAddress.trim());
  const [syncToProfile, setSyncToProfile] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiOn = isApiConfigured();

  useEffect(() => {
    const fromCtx = checkoutData.shippingAddress.trim();
    if (fromCtx) {
      setAddressText(fromCtx);
    }
  }, [checkoutData.shippingAddress]);

  useEffect(() => {
    if (!isAuthenticated || !apiOn) return;
    if (checkoutData.shippingAddress.trim()) return;

    setLoadingProfile(true);
    setError(null);
    getProfile()
      .then((p) => {
        const fromProfile = (p.defaultAddress ?? '').trim();
        if (fromProfile) {
          setAddressText((prev) => (prev.trim() !== '' ? prev : fromProfile));
        }
      })
      .catch(() => {
        /* giữ ô trống */
      })
      .finally(() => setLoadingProfile(false));
  }, [isAuthenticated, apiOn, checkoutData.shippingAddress]);

  const handleContinue = useCallback(async () => {
    setError(null);
    const trimmed = addressText.trim();
    if (trimmed.length < 8) {
      setError('Vui lòng nhập địa chỉ giao hàng đầy đủ (ít nhất 8 ký tự).');
      return;
    }
    if (!isAuthenticated || !apiOn) {
      setError('Vui lòng đăng nhập và cấu hình API để tiếp tục thanh toán.');
      return;
    }

    updateCheckoutData({ shippingAddress: trimmed });
    setSaving(true);
    try {
      if (syncToProfile) {
        await updateProfile({ defaultAddress: trimmed });
      }
      onNext();
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Không lưu được hồ sơ.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [addressText, syncToProfile, isAuthenticated, apiOn, updateCheckoutData, onNext]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl border border-amber-200 bg-amber-50/60 dark:bg-amber-900/20 dark:border-amber-800 p-8 text-center">
        <span className="material-icons text-4xl text-amber-600 mb-2">lock</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Đăng nhập để nhập địa chỉ</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6">
          Thanh toán qua hệ thống yêu cầu tài khoản. Vui lòng đăng nhập rồi quay lại giỏ hàng.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (!apiOn) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center text-red-800">
        <p className="font-semibold">Chưa cấu hình VITE_API_URL — không thể tải / lưu địa chỉ qua Profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Địa chỉ giao hàng</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Một địa chỉ duy nhất — lấy từ hồ sơ khi có, và có thể cập nhật lại hồ sơ khi bạn tiếp tục. Địa chỉ sẽ được
        lưu trên đơn hàng khi đặt.
      </p>

      {loadingProfile && (
        <p className="text-sm text-slate-500 mb-4">Đang tải địa chỉ mặc định từ hồ sơ…</p>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Địa chỉ nhận hàng đầy đủ
      </label>
      <textarea
        className={TEXTAREA_CLASS}
        value={addressText}
        onChange={(e) => setAddressText(e.target.value)}
        placeholder="Họ tên người nhận, số điện thoại, số nhà, đường, phường/xã, quận/huyện, tỉnh/thành…"
        disabled={saving}
        autoComplete="street-address"
      />

      <label className="mt-4 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={syncToProfile}
          onChange={(e) => setSyncToProfile(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Cập nhật địa chỉ mặc định trong hồ sơ (PUT /api/profile) khi nhấn Tiếp tục
        </span>
      </label>

      <div className="flex justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={() => void handleContinue()}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Đang lưu…' : 'Tiếp tục'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep1;
