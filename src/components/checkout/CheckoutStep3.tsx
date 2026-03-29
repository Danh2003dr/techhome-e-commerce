import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, setCart } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { ApiError } from '@/services/api';
import { recordPurchasedProducts } from '@/services/purchasesStore';
import PaymentTabs, { type PaymentMethodType } from './PaymentTabs';
import CreditCardForm from './CreditCardForm';
import CheckoutSummary from './CheckoutSummary';

interface CheckoutStep3Props {
  onBack: () => void;
}

const CheckoutStep3: React.FC<CheckoutStep3Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData, resetCheckout } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'credit_card') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!cardData.cardHolder || cardData.cardHolder.length < 3) {
        newErrors.cardHolder = 'Please enter card holder name';
      }
      if (!cardData.expiryDate || cardData.expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter expiration date';
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        newErrors.cvv = 'Please enter CVV';
      }
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setOrderError(null);
    updateCheckoutData({
      paymentMethod: {
        type: paymentMethod,
        ...(paymentMethod === 'credit_card' && {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardHolder: cardData.cardHolder,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
        }),
      },
      agreeToTerms: true,
    });

    const useBackend = isApiConfigured() && isAuthenticated && checkoutData.items.length > 0;
    const items = checkoutData.items;

    if (!useBackend) {
      setOrderError('Vui lòng đăng nhập và cấu hình API (VITE_API_URL) để đặt hàng. Chỉ lưu đơn qua backend.');
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
      if (user?.id != null) {
        recordPurchasedProducts(
          String(user.id),
          items.map((i) => String(i.productId))
        );
      }
      try {
        await setCart([]);
      } catch {
        /* giỏ server có thể lỗi mạng — đơn vẫn đã tạo */
      }
      resetCheckout();
      navigate(`/order-confirmation/${encodeURIComponent(String(order.id))}`);
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
      {/* Payment Details */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Payment</h2>

        <PaymentTabs selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />

        {paymentMethod === 'credit_card' && (
          <CreditCardForm onCardDataChange={setCardData} />
        )}

        {paymentMethod === 'paypal' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You will be redirected to PayPal to complete your payment
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Continue with PayPal
            </button>
          </div>
        )}

        {paymentMethod === 'paypal_credit' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You will be redirected to PayPal Credit to complete your payment
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Continue with PayPal Credit
            </button>
          </div>
        )}

        {orderError && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {orderError}
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:pointer-events-none"
          >
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1">
        <CheckoutSummary />
      </div>
    </div>
  );
};

export default CheckoutStep3;

