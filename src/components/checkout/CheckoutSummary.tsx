import React, { useEffect, useMemo, useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { formatVND } from '@/utils';
import { isApiConfigured, ApiError } from '@/services/api';
import * as backend from '@/services/backend';
import type { CheckoutQuoteResponse } from '@/types/api';

const CheckoutSummary: React.FC = () => {
  const { checkoutData } = useCheckout();
  const items = checkoutData.items;
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [couponAuthHint, setCouponAuthHint] = useState<string | null>(null);

  const localSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const quoteItems = useMemo(
    () =>
      items
        .map((i) => ({
          productId: parseInt(String(i.productId), 10),
          quantity: i.quantity,
        }))
        .filter((row) => !Number.isNaN(row.productId) && row.productId > 0),
    [items]
  );

  useEffect(() => {
    if (!isApiConfigured() || quoteItems.length === 0) {
      setQuote(null);
      setQuoteError(null);
      return;
    }

    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError(null);

    const payload: { items: { productId: number; quantity: number }[]; couponCode?: string } = {
      items: quoteItems,
    };
    const code = checkoutData.couponCode?.trim();
    if (code) {
      payload.couponCode = code;
    }

    backend
      .postCheckoutQuote(payload)
      .then((q) => {
        if (!cancelled) {
          setQuote(q);
          setCouponAuthHint(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setQuote(null);
          if (err instanceof ApiError && err.status === 401) {
            setCouponAuthHint('Vui lòng đăng nhập lại; mã giảm giá chỉ áp dụng khi đăng nhập.');
            setQuoteError(null);
          } else {
            setCouponAuthHint(null);
            setQuoteError(err instanceof Error ? err.message : 'Không lấy được báo giá.');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quoteItems, checkoutData.couponCode]);

  const subtotal = quote?.subtotal ?? localSubtotal;
  const discount = quote?.discountTotal ?? 0;
  const shippingFee = quote?.shippingFee ?? 0;
  const total = quote?.grandTotal ?? localSubtotal;
  const quoteBusy = quoteLoading && isApiConfigured() && quoteItems.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tóm tắt đơn hàng</h3>

      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Sản phẩm</h4>
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
                  SL: {item.quantity} × {formatVND(item.price)}
                </p>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {formatVND(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-slate-500 text-center">+{items.length - 3} sản phẩm khác</p>
          )}
        </div>
      </div>

      {checkoutData.shippingAddress.trim() && (
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Địa chỉ giao hàng
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
            {checkoutData.shippingAddress.trim()}
          </p>
        </div>
      )}

      {checkoutData.couponCode.trim() !== '' && (
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Mã giảm giá
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Mã từ giỏ hàng:{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {checkoutData.couponCode.trim()}
            </span>
          </p>
        </div>
      )}

      {couponAuthHint && (
        <p className="text-sm text-amber-700 dark:text-amber-400 mb-4" role="status">
          {couponAuthHint}
        </p>
      )}

      {quoteError && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {quoteError}
        </p>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tạm tính ({totalItems} sản phẩm)</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {quoteBusy ? '…' : formatVND(subtotal)}
          </span>
        </div>
        {discount > 0 && quote && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Giảm giá</span>
            <span className="font-semibold">−{formatVND(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">Miễn phí</span>
            ) : (
              formatVND(shippingFee)
            )}
          </span>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng</span>
          <span className="text-2xl font-black text-primary">
            {quoteBusy ? '…' : formatVND(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
