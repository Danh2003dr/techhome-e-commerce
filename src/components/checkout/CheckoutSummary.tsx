import React from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { formatVND } from '@/utils';

const CheckoutSummary: React.FC = () => {
  const { checkoutData } = useCheckout();
  const { items, shippingMethod } = checkoutData;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingMethod?.price || 0;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tóm tắt</h3>

      {/* Selected Products */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Sản phẩm đã chọn</h4>
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  SL: {item.quantity} × {formatVND(item.price)}
                </p>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {formatVND(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-slate-500 text-center">
              +{items.length - 3} more item(s)
            </p>
          )}
        </div>
      </div>

      {/* Shipment Info */}
      {checkoutData.selectedAddress && checkoutData.shippingMethod && (
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Thông tin vận chuyển
            </h4>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-medium">Địa chỉ:</span>
              <p className="mt-1">
                {checkoutData.selectedAddress.addressLines[0]}
                {checkoutData.selectedAddress.addressLines.length > 1 && (
                  <span className="block">
                    {checkoutData.selectedAddress.addressLines.slice(1).join(', ')}
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium">Vận chuyển:</span>
              <p className="mt-1">{checkoutData.shippingMethod.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price Info */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tạm tính</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatVND(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Thuế ước tính</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formatVND(tax)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {shipping === 0 ? 'MIỄN PHÍ' : formatVND(shipping)}
          </span>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng</span>
          <span className="text-2xl font-black text-primary">{formatVND(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;

