import React, { useState, useCallback } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { savedAddresses } from '@/data';
import type { SavedAddress } from '@/types';
import AddressCard from './AddressCard';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

const FORM_INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm text-slate-900 dark:text-slate-100';

type AddressType = 'Home' | 'Office' | 'Other';

const defaultForm = {
  addressType: 'Home' as AddressType,
  fullName: '',
  phone: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  isDefault: false,
};

const CheckoutStep1: React.FC<CheckoutStep1Props> = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [addresses, setAddresses] = useState<SavedAddress[]>(savedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    checkoutData.selectedAddress?.id || addresses.find((a) => a.isDefault)?.id || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

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

  const openModal = useCallback(() => {
    setForm(defaultForm);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(defaultForm);
  }, []);

  const handleSubmitAddress = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: form.addressType,
        tagIcon: form.addressType === 'Home' ? 'home' : form.addressType === 'Office' ? 'work' : 'add_location',
        tagPrimary: form.addressType === 'Home',
        name: form.fullName,
        phone: form.phone,
        street: form.street,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country,
        isDefault: form.isDefault,
        addressLines: [
          form.street,
          form.apartment,
          `${form.city}, ${form.state} ${form.zipCode}`,
          form.country,
        ].filter(Boolean),
      };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      updateCheckoutData({ selectedAddress: newAddr });
      closeModal();
    },
    [form, updateCheckoutData, closeModal]
  );

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
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <span className="material-icons">add</span>
          Add New Address
        </button>
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

      {/* Add New Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" aria-hidden onClick={closeModal} />
          <div
            className="relative w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
          >
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
              <div>
                <h2 id="address-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                  Add New Address
                </h2>
                <p className="text-sm text-slate-500 mt-1">Add a new delivery address below.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                aria-label="Close"
              >
                <span className="material-icons text-2xl">close</span>
              </button>
            </div>
            <form id="address-form" onSubmit={handleSubmitAddress} className="px-8 py-6 space-y-5">
              <div className="flex gap-3 pb-2">
                {(['Home', 'Office', 'Other'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, addressType: type }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all ${
                      form.addressType === type
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="material-icons text-[18px]">{type === 'Home' ? 'home' : type === 'Office' ? 'work' : 'add_location'}</span>
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
                  <input
                    className={FORM_INPUT_CLASS}
                    placeholder="e.g. Alex Johnson"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Phone Number</label>
                  <input
                    className={FORM_INPUT_CLASS}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Street Address</label>
                <input
                  className={FORM_INPUT_CLASS}
                  placeholder="House number and street name"
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">
                  Apartment, suite, etc. (Optional)
                </label>
                <input
                  className={FORM_INPUT_CLASS}
                  placeholder="Apartment, suite, unit, etc."
                  type="text"
                  value={form.apartment}
                  onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">City</label>
                  <input
                    className={FORM_INPUT_CLASS}
                    placeholder="City"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">State</label>
                  <input
                    className={FORM_INPUT_CLASS}
                    placeholder="State/Prov"
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Zip Code</label>
                  <input
                    className={FORM_INPUT_CLASS}
                    placeholder="Zip code"
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Country</label>
                <select
                  className={FORM_INPUT_CLASS}
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  required
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="default-addr"
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary dark:bg-slate-800"
                />
                <label htmlFor="default-addr" className="text-sm font-medium text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                  Set as default shipping address
                </label>
              </div>
            </form>
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="address-form"
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutStep1;

