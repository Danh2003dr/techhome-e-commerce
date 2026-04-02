import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const couponCode = resolveCouponForCheckout(location.state);
    updateCheckoutData({ items: cartItems, couponCode });
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, updateCheckoutData, cartItems, location.state, location.key]);

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
