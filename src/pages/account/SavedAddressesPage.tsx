import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { savedAddresses } from '@/data';
import type { SavedAddress } from '@/types';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const FORM_INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm text-slate-900 dark:text-slate-100';

type AddressType = 'Home' | 'Office' | 'Other';

function getAddressTypeFromLabel(label: string): AddressType {
  if (label === 'Home') return 'Home';
  if (label === 'Office') return 'Office';
  return 'Other';
}

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

function formFromAddress(addr: SavedAddress | null) {
  if (!addr) return defaultForm;
  return {
    addressType: getAddressTypeFromLabel(addr.label),
    fullName: addr.name,
    phone: addr.phone,
    street: addr.street ?? '',
    apartment: addr.apartment ?? '',
    city: addr.city ?? '',
    state: addr.state ?? '',
    zipCode: addr.zipCode ?? '',
    country: addr.country ?? 'United States',
    isDefault: addr.isDefault ?? false,
  };
}

const SavedAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => savedAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [form, setForm] = useState(formFromAddress(null));
  const [addressToDelete, setAddressToDelete] = useState<SavedAddress | null>(null);

  const openEdit = useCallback((addr: SavedAddress) => {
    setEditingAddress(addr);
    setForm(formFromAddress(addr));
    setModalOpen(true);
  }, []);

  const openAdd = useCallback(() => {
    setEditingAddress(null);
    setForm(defaultForm);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingAddress(null);
  }, []);

  const openDelete = useCallback((addr: SavedAddress) => {
    setAddressToDelete(addr);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setAddressToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (addressToDelete) {
      setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete.id));
      setAddressToDelete(null);
    }
  }, [addressToDelete]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === editingAddress.id
              ? {
                  ...a,
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
                }
              : a
          )
        );
      } else {
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
      }
      closeModal();
    },
    [editingAddress, form, closeModal]
  );

  const isEdit = editingAddress != null;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tài khoản', path: '/profile' },
                { label: 'Sổ địa chỉ' },
              ]}
            />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sổ địa chỉ</h1>
            <p className="text-slate-500 mt-1.5">Quản lý địa chỉ giao hàng để thanh toán nhanh hơn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <button
              type="button"
              onClick={openAdd}
              className="group flex flex-col items-center justify-center gap-4 h-full min-h-[220px] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-icons text-2xl font-bold">add</span>
              </div>
              <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary">Thêm địa chỉ mới</span>
            </button>

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      addr.tagPrimary ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="material-icons text-xs">{addr.tagIcon}</span>
                    {addr.label}
                  </span>
                </div>
                <div className="space-y-4 pr-20">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{addr.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{addr.phone}</p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {addr.addressLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < addr.addressLines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button type="button" onClick={() => openEdit(addr)} className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline transition-all">
                    <span className="material-icons text-lg">edit</span>
                    Sửa
                  </button>
                  <button type="button" onClick={() => openDelete(addr)} className="flex items-center gap-1.5 text-red-500 text-sm font-bold hover:underline transition-all">
                    <span className="material-icons text-lg">delete</span>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-primary text-3xl">local_shipping</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Cần nhiều địa chỉ giao hàng?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                Bạn có thể lưu tối đa 10 địa chỉ. Nhiều địa chỉ giúp gửi quà cho người thân hoặc nhận hàng tại cơ quan dễ dàng hơn.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Edit / Add Address Modal */}
      {modalOpen && (
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
                  {isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isEdit ? 'Cập nhật thông tin giao hàng bên dưới.' : 'Thêm địa chỉ giao hàng mới bên dưới.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                aria-label="Đóng"
              >
                <span className="material-icons text-2xl">close</span>
              </button>
            </div>
            <form id="address-form" onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
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
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 ml-1">Country</label>
                <select
                  className={FORM_INPUT_CLASS}
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
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
                {isEdit ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {addressToDelete && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" aria-hidden onClick={closeDeleteModal} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-address-title">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <span className="material-icons text-2xl">delete_forever</span>
                  </div>
                  <div>
                    <h2 id="delete-address-title" className="text-xl font-bold text-slate-900 dark:text-white">Xóa địa chỉ?</h2>
                    <p className="text-sm text-slate-500">This action cannot be undone.</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address to remove</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                      <span className="material-icons text-[12px]">{addressToDelete.tagIcon}</span>
                      {addressToDelete.label.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{addressToDelete.name}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    {[addressToDelete.street, addressToDelete.apartment].filter(Boolean).join(', ') ||
                      [addressToDelete.addressLines[0], addressToDelete.addressLines[1]].filter(Boolean).join(', ')}
                    {(addressToDelete.street || addressToDelete.apartment || addressToDelete.addressLines[0]) && <br />}
                    {addressToDelete.city && addressToDelete.state && addressToDelete.zipCode
                      ? `${addressToDelete.city}, ${addressToDelete.state} ${addressToDelete.zipCode}`
                      : (addressToDelete.addressLines[2] ?? '')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all"
                  >
                    Xóa địa chỉ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <AccountFooter />
    </div>
  );
};

export default SavedAddressesPage;
