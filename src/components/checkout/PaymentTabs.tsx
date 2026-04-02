import React from 'react';

export type PaymentMethodType = 'credit_card' | 'paypal' | 'paypal_credit';

interface PaymentTabsProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ selectedMethod, onSelectMethod }) => {
  const tabs = [
    { id: 'credit_card' as PaymentMethodType, label: 'Credit Card' },
    { id: 'paypal' as PaymentMethodType, label: 'MoMo (QR/App)' },
    { id: 'paypal_credit' as PaymentMethodType, label: 'MoMo (Redirect)' },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectMethod(tab.id)}
          className={`pb-3 px-4 font-semibold text-sm transition-colors ${
            selectedMethod === tab.id
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PaymentTabs;

