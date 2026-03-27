import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { ApiError } from '@/services/api';
import { useCart } from '@/context/CartContext';
import PaymentTabs, { type PaymentMethodType } from './PaymentTabs';
import CreditCardForm from './CreditCardForm';
import CheckoutSummary from './CheckoutSummary';

interface CheckoutStep3Props {
  onBack: () => void;
}

const CheckoutStep3: React.FC<CheckoutStep3Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const { checkoutData, updateCheckoutData } = useCheckout();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
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

    const { items } = checkoutData;
    const useBackend = isApiConfigured() && isAuthenticated && items.length > 0;
    const normalizedItems = items.map((i) => ({
      productId: Number(i.productId),
      quantity: Number(i.quantity),
      price: Number(i.price),
    }));
    const totalPrice = normalizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (useBackend) {
      const { selectedAddress } = checkoutData;
      const shippingAddressId = selectedAddress ? Number(selectedAddress.id) : undefined;
      if (selectedAddress && shippingAddressId != null && Number.isNaN(shippingAddressId)) {
        setOrderError('Địa chỉ giao hàng không hợp lệ. Vui lòng chọn lại địa chỉ.');
        return;
      }

      const validItems = normalizedItems.every(
        (i) =>
          Number.isFinite(i.productId) &&
          i.productId > 0 &&
          Number.isFinite(i.quantity) &&
          i.quantity >= 1 &&
          Number.isFinite(i.price) &&
          i.price >= 0,
      );
      if (!validItems) {
        setOrderError('Giỏ hàng đang có dữ liệu không hợp lệ để tạo đơn. Vui lòng thêm lại sản phẩm từ danh sách.');
        return;
      }

      setPlacing(true);
      try {
        const order = await createOrder({
          totalPrice,
          paymentMethod,
          shippingAddressId: shippingAddressId ?? null,
          subtotal: totalPrice,
          discountAmount: 0,
          shippingCost: checkoutData.shippingMethod?.price ?? 0,
          items: normalizedItems,
        });
        // Payment simulate thành công => xóa giỏ
        clearCart();
        navigate('/order-confirmation', { state: { orderId: order.id, fromApi: true } });
      } catch (err) {
        setOrderError(err instanceof ApiError ? err.message : 'Failed to create order.');
        if (err instanceof ApiError && err.status === 401) {
          setOrderError('Please sign in to place an order.');
        }
      } finally {
        setPlacing(false);
      }
    } else {
      navigate('/order-confirmation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Details */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Thanh toán</h2>

        <PaymentTabs selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />

        {paymentMethod === 'credit_card' && (
          <CreditCardForm onCardDataChange={setCardData} />
        )}

        {paymentMethod === 'paypal' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bạn sẽ được chuyển sang PayPal để hoàn tất thanh toán
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Tiếp tục với PayPal
            </button>
          </div>
        )}

        {paymentMethod === 'paypal_credit' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bạn sẽ được chuyển sang PayPal Credit để hoàn tất thanh toán
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Tiếp tục với PayPal Credit
            </button>
          </div>
        )}

        {paymentMethod === 'cash_on_delivery' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Thanh toán khi nhận hàng. Vui lòng chuẩn bị tiền mặt để thanh toán.
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Sau khi bạn nhận hàng thành công, hệ thống sẽ ghi nhận thanh toán.
            </div>
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
              Tôi đồng ý với{' '}
              <a href="#" className="text-primary hover:underline">
                Điều khoản & Điều kiện
              </a>{' '}
              và{' '}
              <a href="#" className="text-primary hover:underline">
                Chính sách bảo mật
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
            Quay lại
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:pointer-events-none"
          >
            {placing ? 'Đang đặt hàng...' : 'Đặt hàng'}
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

