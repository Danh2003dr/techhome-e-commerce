import React, { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { formatVND } from '@/utils';
import { tryApplyVoucherCode } from '@/services/voucherApply';

const CheckoutSummary: React.FC = () => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const items = checkoutData.items;
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = checkoutData.appliedVoucher?.discountAmount ?? 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = checkoutData.shippingMethod?.price || 0;
  const taxRate = 0.08;
  const tax = afterDiscount * taxRate;
  const total = afterDiscount + shipping + tax;

  const applyVoucher = () => {
    setVoucherMsg(null);
    const res = tryApplyVoucherCode(voucherInput || checkoutData.couponCode, subtotal);
    if (!res.ok) {
      setVoucherMsg(res.message);
      updateCheckoutData({ appliedVoucher: null });
      return;
    }
    updateCheckoutData({
      couponCode: res.code,
      appliedVoucher: { code: res.code, discountAmount: res.discountAmount },
    });
    setVoucherMsg(`Đã áp dụng mã ${res.code} (−${formatVND(res.discountAmount)}).`);
  };

  const clearVoucher = () => {
    setVoucherInput('');
    setVoucherMsg(null);
    updateCheckoutData({ couponCode: '', appliedVoucher: null });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Summary</h3>

      {/* Selected Products */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Selected Products
        </h4>
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity} × {formatVND(item.price)}
                </p>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {formatVND(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-slate-500 text-center">
              +{items.length - 3} more item(s)
            </p>
          )}
        </div>
      </div>

      {/* Shipment Info */}
      {checkoutData.selectedAddress && checkoutData.shippingMethod && (
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Shipment Info
          </h4>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-medium">Address:</span>
              <p className="mt-1">
                {checkoutData.selectedAddress.addressLines[0]}
                {checkoutData.selectedAddress.addressLines.length > 1 && (
                  <span className="block">
                    {checkoutData.selectedAddress.addressLines.slice(1).join(', ')}
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium">Shipment:</span>
              <p className="mt-1">{checkoutData.shippingMethod.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Voucher */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mã giảm giá</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={voucherInput || checkoutData.couponCode}
            onChange={(e) => {
              setVoucherInput(e.target.value);
              updateCheckoutData({ couponCode: e.target.value, appliedVoucher: null });
            }}
            placeholder="Nhập mã"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
          <button
            type="button"
            onClick={applyVoucher}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold"
          >
            Áp dụng
          </button>
        </div>
        {checkoutData.appliedVoucher && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">Đã áp dụng {checkoutData.appliedVoucher.code}</span>
            <button type="button" className="text-red-600 font-semibold" onClick={clearVoucher}>
              Gỡ
            </button>
          </div>
        )}
        {voucherMsg && <p className="mt-2 text-xs text-slate-500">{voucherMsg}</p>}
      </div>

      {/* Price Info */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatVND(subtotal)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Giảm giá</span>
            <span className="font-semibold">−{formatVND(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formatVND(tax)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Shipping & Handling</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {shipping === 0 ? 'FREE' : formatVND(shipping)}
          </span>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
          <span className="text-2xl font-black text-primary">{formatVND(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;

