import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import CheckoutStep1 from '@/components/checkout/CheckoutStep1';
import CheckoutStep3 from '@/components/checkout/CheckoutStep3';
import { APPLIED_COUPON_STORAGE_KEY } from '@/constants/appliedCouponStorage';

function resolveCouponForCheckout(
  locationState: unknown
): string {
  if (
    locationState != null &&
    typeof locationState === 'object' &&
    'couponCode' in locationState
  ) {
    const raw = (locationState as { couponCode?: unknown }).couponCode;
    return raw != null ? String(raw).trim() : '';
  }
  try {
    return (sessionStorage.getItem(APPLIED_COUPON_STORAGE_KEY) ?? '').trim();
  } catch {
    return '';
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems } = useCart();
  const { currentStep, nextStep, previousStep, updateCheckoutData } = useCheckout();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentStep]);

  useEffect(() => {
    const couponCode = resolveCouponForCheckout(location.state);
    updateCheckoutData({ items: cartItems, couponCode });
    // Không gọi navigate('/cart') khi giỏ rỗng — luôn đua race với navigate('/orders') sau đặt hàng.
    // Bước 1 + giỏ trống: hiển thị thông báo inline (vào /checkout tay hoặc giỏ vừa xóa hết).
  }, [updateCheckoutData, cartItems, location.state, location.key]);

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={currentStep} />
        <div className="max-w-lg mx-auto mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-12 text-center shadow-sm">
          <span className="material-icons text-5xl text-slate-400 mb-4 block">shopping_cart</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chưa có sản phẩm để thanh toán</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
            Giỏ hàng đang trống. Thêm hàng rồi quay lại thanh toán, hoặc về trang chủ tiếp tục mua sắm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-colors"
            >
              <span className="material-icons text-lg">shopping_bag</span>
              Về giỏ hàng
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/cart');
    } else {
      previousStep();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <CheckoutStepper currentStep={currentStep} />

      {currentStep === 1 && <CheckoutStep1 onNext={handleNext} onBack={handleBack} />}
      {currentStep === 2 && <CheckoutStep3 onBack={handleBack} />}
    </div>
  );
};

export default CheckoutPage;
