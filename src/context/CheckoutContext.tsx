import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { SavedAddress, CartItem } from '@/types';

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'paypal_credit';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export type PaymentMethodType = 'credit_card' | 'paypal' | 'paypal_credit';

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

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCheckout = () => {
    setCheckoutData(defaultCheckoutData);
    setCurrentStep(1);
  };

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

