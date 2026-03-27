import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { SavedAddress, CartItem } from '@/types';

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'paypal_credit' | 'cash_on_delivery';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export type PaymentMethodType = 'credit_card' | 'paypal' | 'paypal_credit' | 'cash_on_delivery';

export interface CheckoutData {
  // Step 1: Shipping Address
  selectedAddress: SavedAddress | null;
  newAddress: Partial<SavedAddress> | null;
  
  // Step 2: Shipping Method
  shippingMethod: ShippingMethod | null;
  
  // Step 3: Payment
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  agreeToTerms: boolean;
  
  // Cart items
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
  selectedAddress: null,
  newAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  couponCode: '',
  agreeToTerms: false,
  items: [],
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(defaultCheckoutData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateCheckoutData = useCallback((data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => (s < 3 ? s + 1 : s));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((s) => (s > 1 ? s - 1 : s));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutData(defaultCheckoutData);
    setCurrentStep(1);
  }, []);

  const value = useMemo(
    () => ({
      checkoutData,
      currentStep,
      setCurrentStep,
      updateCheckoutData,
      nextStep,
      previousStep,
      resetCheckout,
    }),
    [checkoutData, currentStep, updateCheckoutData, nextStep, previousStep, resetCheckout]
  );

  return (
    <CheckoutContext.Provider value={value}>
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

