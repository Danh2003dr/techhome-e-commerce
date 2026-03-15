import React from 'react';
import type { ShippingMethod } from '@/context/CheckoutContext';
import { formatVND } from '@/utils';

interface ShippingMethodCardProps {
  method: ShippingMethod;
  isSelected: boolean;
  onSelect: () => void;
}

const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="mt-1">
            <input
              type="radio"
              checked={isSelected}
              onChange={onSelect}
              className="w-5 h-5 text-primary focus:ring-primary cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {method.name}
            </h3>
            {method.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{method.description}</p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Estimated delivery: {method.estimatedDays}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {method.price === 0 ? 'FREE' : formatVND(method.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethodCard;

