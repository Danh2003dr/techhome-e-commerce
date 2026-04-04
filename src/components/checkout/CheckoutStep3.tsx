import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { ApiError } from '@/services/api';
import { recordPurchasedProducts } from '@/services/purchasesStore';
import CheckoutSummary from './CheckoutSummary';
import { APPLIED_COUPON_STORAGE_KEY } from '@/constants/appliedCouponStorage';

interface CheckoutStep3Props {
  onBack: () => void;
}

const CheckoutStep3: React.FC<CheckoutStep3Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData, resetCheckout } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const { clearCart } = useCart();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!agreeToTerms) {
      newErrors.terms = 'Bạn cần đồng ý với điều khoản và chính sách.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setOrderError(null);
    updateCheckoutData({
      paymentMethod: { type: 'cod' },
      agreeToTerms: true,
    });

    const useBackend = isApiConfigured() && isAuthenticated && checkoutData.items.length > 0;
    const items = checkoutData.items;

    if (!useBackend) {
      setOrderError('Vui lòng đăng nhập và cấu hình kết nối máy chủ để đặt hàng.');
      return;
    }

    const productIdsValid = items.every((i) => !Number.isNaN(Number(i.productId)));
    if (!productIdsValid) {
      setOrderError('Giỏ có sản phẩm không đặt được qua API (mã sản phẩm không hợp lệ). Hãy thêm hàng từ danh mục.');
      return;
    }

    const shipTo = checkoutData.shippingAddress.trim();
    if (!shipTo) {
      setOrderError('Thiếu địa chỉ giao hàng — vui lòng quay lại bước 1.');
      return;
    }

    setPlacing(true);
    try {
      const coupon = checkoutData.couponCode?.trim();
      const order = await createOrder({
        totalPrice: 0,
        shippingAddress: shipTo,
        couponCode: coupon || undefined,
        items: items.map((i) => ({
          productId: Number(i.productId),
          quantity: i.quantity,
          price: i.price,
        })),
      });
      const orderIdRaw = order?.id ?? (order as { _id?: string | number })?._id;
      const orderIdStr =
        orderIdRaw !== undefined && orderIdRaw !== null && String(orderIdRaw).trim() !== ''
          ? String(orderIdRaw).trim()
          : '';
      if (user?.id != null) {
        recordPurchasedProducts(
          String(user.id),
          items.map((i) => String(i.productId))
        );
      }
      try {
        await clearCart();
      } catch {
        /* giỏ server có thể lỗi mạng — đơn vẫn đã tạo */
      }
      try {
        sessionStorage.removeItem(APPLIED_COUPON_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      const ordersUrl = orderIdStr ? `/orders?placed=${encodeURIComponent(orderIdStr)}` : '/orders';
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      navigate(ordersUrl, { replace: true });
      resetCheckout();
    } catch (err) {
      setOrderError(err instanceof ApiError ? err.message : 'Không tạo được đơn hàng.');
      if (err instanceof ApiError && err.status === 401) {
        setOrderError('Phiên đăng nhập hết hạn — vui lòng đăng nhập lại.');
      }
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Thanh toán</h2>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Thanh toán khi nhận hàng (COD)
          </h3>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Đơn hàng được ghi nhận với hình thức COD. Bạn thanh toán bằng tiền mặt khi nhận hàng — vui lòng chuẩn bị đúng
            số tiền theo tổng đơn (hoặc theo hướng dẫn của shipper).
          </p>
        </div>

        {orderError && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {orderError}
          </div>
        )}

        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Tôi đồng ý với{' '}
              <a href="#" className="text-primary hover:underline">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-primary hover:underline">
                Chính sách bảo mật
              </a>
              .
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms}</p>}
        </div>

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
            onClick={handlePlaceOrder}
            disabled={placing}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:pointer-events-none"
          >
            {placing ? 'Đang đặt hàng…' : 'Đặt hàng'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <CheckoutSummary />
      </div>
    </div>
  );
};

export default CheckoutStep3;
