import React, { useState } from 'react';
import { useCheckout, type ShippingMethod } from '@/context/CheckoutContext';
import ShippingMethodCard from './ShippingMethodCard';

interface CheckoutStep2Props {
  onNext: () => void;
  onBack: () => void;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    estimatedDays: '5-7 business days',
    description: 'Standard shipping',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 29,
    estimatedDays: '3-5 business days',
    description: 'Faster delivery',
  },
  {
    id: 'express',
    name: 'Express',
    price: 49,
    estimatedDays: '1-2 business days',
    description: 'Fastest delivery',
  },
];

const CheckoutStep2: React.FC<CheckoutStep2Props> = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    checkoutData.shippingMethod?.id || null
  );

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
    const method = shippingMethods.find((m) => m.id === methodId);
    if (method) {
      updateCheckoutData({ shippingMethod: method });
    }
  };

  const handleContinue = () => {
    if (selectedMethodId) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Shipping Method</h2>

      <div className="space-y-4 mb-8">
        {shippingMethods.map((method) => (
          <ShippingMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethodId === method.id}
            onSelect={() => handleSelectMethod(method.id)}
          />
        ))}
      </div>

      <div className="flex justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedMethodId}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep2;

