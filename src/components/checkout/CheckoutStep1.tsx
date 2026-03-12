import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { savedAddresses } from '@/data';
import type { SavedAddress } from '@/types';
import AddressCard from './AddressCard';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

const CheckoutStep1: React.FC<CheckoutStep1Props> = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [addresses] = useState<SavedAddress[]>(savedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    checkoutData.selectedAddress?.id || addresses.find((a) => a.isDefault)?.id || null
  );

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = addresses.find((a) => a.id === addressId);
    if (address) {
      updateCheckoutData({ selectedAddress: address });
    }
  };

  const handleContinue = () => {
    if (selectedAddressId) {
      onNext();
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Shipping Address</h2>

      <div className="space-y-4 mb-8">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={selectedAddressId === address.id}
            onSelect={() => handleSelectAddress(address.id)}
            showActions={false}
          />
        ))}
      </div>

      <div className="mb-8">
        <Link
          to="/addresses"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <span className="material-icons">add</span>
          Add New Address
        </Link>
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
          disabled={!selectedAddressId}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep1;

