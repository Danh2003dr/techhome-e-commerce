import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils';
import { isApiConfigured, getToken, ApiError } from '@/services/api';
import * as backend from '@/services/backend';
import type { CheckoutQuoteResponse } from '@/types/api';
import { APPLIED_COUPON_STORAGE_KEY } from '@/constants/appliedCouponStorage';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, stockWarningsByItemId, isItemUpdating } = useCart();
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = appliedCoupon.trim();
    if (t) {
      try {
        sessionStorage.setItem(APPLIED_COUPON_STORAGE_KEY, t);
      } catch {
        /* ignore */
      }
    } else {
      try {
        sessionStorage.removeItem(APPLIED_COUPON_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [appliedCoupon]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const localSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    if (appliedCoupon.trim() !== '') {
      payload.couponCode = appliedCoupon.trim();
    }

    backend
      .postCheckoutQuote(payload)
      .then((q) => {
        if (!cancelled) {
          setQuote(q);
          if (appliedCoupon.trim() !== '' && q.coupon) {
            setCouponMsg(`Đã áp dụng mã ${q.coupon.code}.`);
          } else if (appliedCoupon.trim() !== '' && !q.coupon) {
            setCouponMsg(null);
          }
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setQuote(null);
          if (err instanceof ApiError && err.status === 401) {
            setCouponMsg('Vui lòng đăng nhập để áp dụng mã giảm giá.');
            setQuoteError(null);
          } else {
            setQuoteError(
              err instanceof Error ? err.message : 'Không lấy được báo giá từ máy chủ.'
            );
          }
        }
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quoteItems, appliedCoupon]);

  const applyCouponClick = useCallback(() => {
    setCouponMsg(null);
    const code = couponInput.trim();
    if (code !== '' && !getToken()) {
      setCouponMsg('Vui lòng đăng nhập để áp dụng mã giảm giá.');
      return;
    }
    setAppliedCoupon(code);
  }, [couponInput]);

  const clearCoupon = useCallback(() => {
    setCouponInput('');
    setAppliedCoupon('');
    setCouponMsg(null);
  }, []);

  const displayShipping = quote?.shippingFee ?? 0;
  const displaySubtotal = quote != null ? quote.subtotal : localSubtotal;
  const displayTax = quote?.totalTax;
  const displayDiscount = quote != null ? quote.discountTotal : 0;
  const displayTotal = quote != null ? quote.grandTotal : localSubtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Giỏ hàng <span className="text-gray-400 font-normal ml-2">({totalItems} sản phẩm)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-6 items-center border-b border-gray-50 last:border-b-0"
              >
                <div className="col-span-12 md:col-span-6 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/product/${encodeURIComponent(String(item.productId))}`}
                      className="font-bold text-gray-900 text-lg hover:text-indigo-600"
                    >
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-sm text-gray-400">{item.variant}</p>}
                    {stockWarningsByItemId[item.id] && (
                      <p className="mt-2 text-sm text-amber-700">{stockWarningsByItemId[item.id]}</p>
                    )}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-600 flex items-center gap-1"
                      >
                        <span className="material-icons text-sm">delete_outline</span> Xóa
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="font-bold text-gray-900">{formatVND(item.price)}</span>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isItemUpdating(item.id)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isItemUpdating(item.id)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="font-black text-indigo-600">{formatVND(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-8">Tóm tắt đơn hàng</h2>

            <div className="mb-6 pb-6 border-b border-gray-50">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!isApiConfigured()}
                />
                <button
                  type="button"
                  onClick={applyCouponClick}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                  disabled={!isApiConfigured()}
                >
                  Áp dụng
                </button>
              </div>
              {appliedCoupon !== '' && (
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="mt-2 text-xs text-gray-500 hover:text-indigo-600"
                >
                  Bỏ mã
                </button>
              )}
              {couponMsg && <p className="mt-2 text-sm text-emerald-600">{couponMsg}</p>}
            </div>

            {quoteError && (
              <p className="text-sm text-red-600 mb-4" role="alert">
                {quoteError}
              </p>
            )}

            <div className="space-y-4 text-sm text-gray-500 border-b border-gray-50 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-bold text-gray-900">
                  {quoteLoading && isApiConfigured() && quoteItems.length > 0 ? (
                    <span className="text-gray-400">…</span>
                  ) : (
                    formatVND(displaySubtotal)
                  )}
                </span>
              </div>
              {displayDiscount > 0 && quote && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá</span>
                  <span className="font-bold">−{formatVND(displayDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-emerald-600">
                  {displayShipping === 0 ? 'Miễn phí' : formatVND(displayShipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Thuế GTGT (ước tính)</span>
                <span className="font-bold text-gray-900">
                  {quoteLoading && isApiConfigured() && quoteItems.length > 0 ? (
                    <span className="text-gray-400">…</span>
                  ) : displayTax != null ? (
                    formatVND(displayTax)
                  ) : (
                    <span className="text-gray-400 text-xs font-normal">
                      {isApiConfigured() ? '—' : 'Kết nối API để hiển thị'}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-gray-900">Tổng cộng</span>
              <span className="text-3xl font-black text-indigo-600">
                {quoteLoading && isApiConfigured() && quoteItems.length > 0 ? (
                  <span className="text-gray-400 text-xl">…</span>
                ) : (
                  formatVND(displayTotal)
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate('/checkout', { state: { couponCode: appliedCoupon.trim() } })
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
            >
              Thanh toán{' '}
              <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
