import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { isApiConfigured } from '@/services/api';
import { getProfile, updateProfile } from '@/services/backend';
import { ApiError } from '@/services/api';
import type { SavedAddressDto } from '@/types/api';
import {
  emptySavedAddressForm,
  validateSavedAddressForm,
  composeSavedAddressLine,
  savedAddressDtoToForm,
} from '@/utils/savedAddressForm';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

const TEXTAREA_CLASS =
  'w-full min-h-[140px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm text-slate-900 dark:text-slate-100';

const INPUT_ROW =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-primary';

const LABEL_CLS = 'block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1';

function hasStructuredFields(a: SavedAddressDto): boolean {
  return !!(a.recipientName?.trim() || a.street?.trim() || a.province?.trim());
}

const CheckoutStep1: React.FC<CheckoutStep1Props> = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const { isAuthenticated } = useAuth();
  const [addressText, setAddressText] = useState(() => checkoutData.shippingAddress.trim());
  const [structuredMode, setStructuredMode] = useState(false);
  const [addrForm, setAddrForm] = useState(() => emptySavedAddressForm());
  const [syncToProfile, setSyncToProfile] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressDto[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState('');

  const apiOn = isApiConfigured();

  useEffect(() => {
    const fromCtx = checkoutData.shippingAddress.trim();
    if (fromCtx) {
      setAddressText(fromCtx);
    }
  }, [checkoutData.shippingAddress]);

  useEffect(() => {
    if (!structuredMode) return;
    const composed = composeSavedAddressLine(addrForm).trim();
    if (composed.length > 0) {
      setAddressText(composed);
    }
  }, [addrForm, structuredMode]);

  useEffect(() => {
    if (!isAuthenticated || !apiOn) return;
    if (checkoutData.shippingAddress.trim()) return;

    setLoadingProfile(true);
    setError(null);
    getProfile()
      .then((p) => {
        const list = Array.isArray(p.savedAddresses) ? p.savedAddresses : [];
        setSavedAddresses(list);
        const fromProfile = (p.defaultAddress ?? '').trim();
        if (fromProfile) {
          setAddressText((prev) => (prev.trim() !== '' ? prev : fromProfile));
          const match = list.find((a) => a.line.trim() === fromProfile);
          if (match) {
            setSelectedSavedId(match.id);
            if (hasStructuredFields(match)) {
              setStructuredMode(true);
              setAddrForm(savedAddressDtoToForm(match));
            }
          }
        }
      })
      .catch(() => {
        /* giữ ô trống */
      })
      .finally(() => setLoadingProfile(false));
  }, [isAuthenticated, apiOn, checkoutData.shippingAddress]);

  const handleContinue = useCallback(async () => {
    setError(null);
    let trimmed = addressText.trim();
    if (structuredMode) {
      const v = validateSavedAddressForm(addrForm);
      if (v) {
        setError(v);
        return;
      }
      trimmed = composeSavedAddressLine(addrForm).trim();
      setAddressText(trimmed);
    }
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
  }, [
    addressText,
    structuredMode,
    addrForm,
    syncToProfile,
    isAuthenticated,
    apiOn,
    updateCheckoutData,
    onNext,
  ]);

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
        <p className="font-semibold">Chưa cấu hình kết nối máy chủ — không thể tải hoặc lưu địa chỉ từ hồ sơ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Địa chỉ giao hàng</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
        Chọn từ sổ địa chỉ đã lưu trong{' '}
        <Link to="/profile" className="text-primary font-semibold hover:underline">
          hồ sơ
        </Link>
        , điền theo form chi tiết, hoặc nhập một khối trong ô bên dưới. Nội dung cuối cùng sẽ ghi trên đơn hàng.
      </p>

      {loadingProfile && (
        <p className="text-sm text-slate-500 mb-4">Đang tải địa chỉ mặc định từ hồ sơ…</p>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {savedAddresses.length > 0 && (
        <div className="mb-5">
          <label
            htmlFor="checkout-saved-address"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            Chọn địa chỉ đã lưu
          </label>
          <select
            id="checkout-saved-address"
            value={selectedSavedId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedSavedId(id);
              const found = savedAddresses.find((a) => a.id === id);
              if (found) {
                if (hasStructuredFields(found)) {
                  setStructuredMode(true);
                  setAddrForm(savedAddressDtoToForm(found));
                  setAddressText(composeSavedAddressLine(savedAddressDtoToForm(found)));
                } else {
                  setStructuredMode(false);
                  setAddrForm(emptySavedAddressForm());
                  setAddressText(found.line);
                }
              }
            }}
            disabled={saving}
            className="w-full max-w-xl px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">— Chọn hoặc nhập bên dưới —</option>
            {savedAddresses.map((a) => (
              <option key={a.id} value={a.id}>
                {(a.label || 'Địa chỉ').trim()}
                {a.line.length > 36 ? ` — ${a.line.slice(0, 36)}…` : ` — ${a.line}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={structuredMode}
            onChange={(e) => {
              const on = e.target.checked;
              setStructuredMode(on);
              if (!on) {
                setAddrForm(emptySavedAddressForm());
              }
            }}
            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          Điền theo form đầy đủ (họ tên, SĐT, đường, quận, tỉnh…)
        </label>
      </div>

      {structuredMode && (
        <div className="mb-5 space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ship-name" className={LABEL_CLS}>
                Họ và tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                id="ship-name"
                type="text"
                autoComplete="name"
                value={addrForm.recipientName}
                onChange={(e) => setAddrForm((f) => ({ ...f, recipientName: e.target.value }))}
                disabled={saving}
                className={INPUT_ROW}
              />
            </div>
            <div>
              <label htmlFor="ship-phone" className={LABEL_CLS}>
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="ship-phone"
                type="tel"
                autoComplete="tel"
                value={addrForm.recipientPhone}
                onChange={(e) => setAddrForm((f) => ({ ...f, recipientPhone: e.target.value }))}
                disabled={saving}
                className={INPUT_ROW}
              />
            </div>
          </div>
          <div>
            <label htmlFor="ship-street" className={LABEL_CLS}>
              Số nhà, tên đường <span className="text-red-500">*</span>
            </label>
            <input
              id="ship-street"
              type="text"
              autoComplete="street-address"
              value={addrForm.street}
              onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
              disabled={saving}
              className={INPUT_ROW}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ship-ward" className={LABEL_CLS}>
                Phường / xã <span className="text-slate-500 font-normal">(tuỳ chọn)</span>
              </label>
              <input
                id="ship-ward"
                type="text"
                value={addrForm.ward}
                onChange={(e) => setAddrForm((f) => ({ ...f, ward: e.target.value }))}
                disabled={saving}
                className={INPUT_ROW}
              />
            </div>
            <div>
              <label htmlFor="ship-district" className={LABEL_CLS}>
                Quận / huyện <span className="text-red-500">*</span>
              </label>
              <input
                id="ship-district"
                type="text"
                value={addrForm.district}
                onChange={(e) => setAddrForm((f) => ({ ...f, district: e.target.value }))}
                disabled={saving}
                className={INPUT_ROW}
              />
            </div>
            <div>
              <label htmlFor="ship-province" className={LABEL_CLS}>
                Tỉnh / thành phố <span className="text-red-500">*</span>
              </label>
              <input
                id="ship-province"
                type="text"
                value={addrForm.province}
                onChange={(e) => setAddrForm((f) => ({ ...f, province: e.target.value }))}
                disabled={saving}
                className={INPUT_ROW}
              />
            </div>
          </div>
          <div>
            <label htmlFor="ship-note" className={LABEL_CLS}>
              Ghi chú <span className="text-slate-500 font-normal">(tuỳ chọn)</span>
            </label>
            <textarea
              id="ship-note"
              value={addrForm.note}
              onChange={(e) => setAddrForm((f) => ({ ...f, note: e.target.value }))}
              disabled={saving}
              rows={2}
              className={INPUT_ROW}
            />
          </div>
        </div>
      )}

      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        {structuredMode ? 'Nội dung gửi kèm đơn (xem trước — có thể chỉnh tay nếu cần)' : 'Địa chỉ nhận hàng đầy đủ'}
      </label>
      <textarea
        className={TEXTAREA_CLASS}
        value={addressText}
        onChange={(e) => {
          const v = e.target.value;
          setAddressText(v);
          if (selectedSavedId) {
            const picked = savedAddresses.find((a) => a.id === selectedSavedId);
            if (picked && v.trim() !== picked.line.trim()) {
              setSelectedSavedId('');
            }
          }
          if (structuredMode) {
            const composed = composeSavedAddressLine(addrForm).trim();
            if (v.trim() !== composed) {
              setStructuredMode(false);
              setAddrForm(emptySavedAddressForm());
            }
          }
        }}
        placeholder="Họ tên người nhận, số điện thoại, số nhà, đường, phường/xã, quận/huyện, tỉnh/thành…"
        disabled={saving}
        autoComplete="street-address"
      />
      {structuredMode && (
        <p className="text-xs text-slate-500 mt-1">
          Ô trên đồng bộ từ form; nếu bạn sửa khác bản ghép từ form, hệ thống sẽ chuyển sang nhập tự do.
        </p>
      )}

      <label className="mt-4 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={syncToProfile}
          onChange={(e) => setSyncToProfile(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Cập nhật địa chỉ mặc định trong hồ sơ khi nhấn Tiếp tục
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
