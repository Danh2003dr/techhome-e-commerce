import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/types';

/** Giữ cho `ShippingMethodCard` / `CheckoutStep2` (không còn trong luồng chính). */
export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}

/** Chỉ COD — đồng bộ với backend (paymentMethod: COD). */
export interface PaymentMethod {
  type: 'cod';
}

export interface AppliedVoucherInfo {
  code: string;
  discountAmount: number;
}

export interface CheckoutData {
  /** Địa chỉ giao hàng đầy đủ (một chuỗi) — đồng bộ snapshot khi đặt hàng. */
  shippingAddress: string;

  /** @deprecated Không còn bước chọn; giữ cho file cũ CheckoutStep2. */
  shippingMethod?: ShippingMethod | null;

  paymentMethod: PaymentMethod | null;
  /** Mã giảm giá gửi lên backend (POST /checkout/quote, POST /orders). */
  couponCode: string;
  /** @deprecated Dùng couponCode + báo giá server; giữ tương thích cũ. */
  appliedVoucher: AppliedVoucherInfo | null;
  agreeToTerms: boolean;

  items: CartItem[];
}

interface CheckoutContextType {
  checkoutData: CheckoutData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCheckout: () => void;
}

const defaultCheckoutData: CheckoutData = {
  shippingAddress: '',
  shippingMethod: null,
  paymentMethod: null,
  couponCode: '',
  appliedVoucher: null,
  agreeToTerms: false,
  items: [],
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(defaultCheckoutData);
  /** 1 = địa chỉ, 2 = thanh toán (không còn bước chọn vận chuyển). */
  const [currentStep, setCurrentStep] = useState(1);

  const updateCheckoutData = useCallback((data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const resetCheckout = useCallback(() => {
    setCheckoutData(defaultCheckoutData);
    setCurrentStep(1);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        currentStep,
        setCurrentStep,
        updateCheckoutData,
        nextStep,
        previousStep,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};
