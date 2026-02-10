import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { savedAddresses, cartItems } from '../data';
import type { SavedAddress } from '../types';

const FORM_INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm text-slate-900 dark:text-slate-100';

type AddressType = 'Home' | 'Office' | 'Other';

function getAddressTypeFromLabel(label: string): AddressType {
  if (label === 'Home') return 'Home';
  if (label === 'Office') return 'Office';
  return 'Other';
}

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cYFm0td7RC_stH8Qi9Zli0kI97ANPxkaKBqH7Dpm9qrgD6yQZ_QyPuFCuZL8oZv9yKDQCXntTxkGra1tJSdZLcK9T4Ao5Jx8NGXu3B7vHeIBusDizdPs-M-L9NtEx8Q3-B35Lzccf0oydmf7oqlwxY7Q-frZsy_qMsJ9hcpwekTMVKA4gQM_j9aRAowsjprmoUT1mGLEVzMdo5osiRGqXscAM8mpGOZaZ98tPeI36i-W8EPRWnl2ja9FHYK34aEovOW2NpWT7zM';

const SIDEBAR_LINKS = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/dashboard' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];

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
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <span className="material-icons text-white text-2xl">devices</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Tech<span className="text-primary">Home</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Link to="/search" className="hover:text-primary transition-colors">Shop</Link>
              <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
              <Link to="/search" className="hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search tech..." type="text" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cart" className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-icons">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <Link to="/profile" className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <img alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={PROFILE_IMAGE} />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">Alex Johnson</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Premium</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1.5">
            {SIDEBAR_LINKS.map((item) => {
              const isActive = item.path === '/addresses';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md group'
                  }`}
                >
                  <span className={`material-icons text-[22px] ${isActive ? '' : 'group-hover:text-primary'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold transition-all">
              <span className="material-icons text-[22px]">logout</span>
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <span className="text-primary">Saved Addresses</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Addresses</h1>
            <p className="text-slate-500 mt-1.5">Manage your shipping addresses for a faster checkout experience.</p>
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
              <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary">Add New Address</span>
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
                    Edit
                  </button>
                  <button type="button" onClick={() => openDelete(addr)} className="flex items-center gap-1.5 text-red-500 text-sm font-bold hover:underline transition-all">
                    <span className="material-icons text-lg">delete</span>
                    Delete
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
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Need multiple shipping locations?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                You can save up to 10 different addresses. Having multiple addresses saved makes it easy to send gifts to friends and family or receive orders at work.
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
                  {isEdit ? 'Edit Address' : 'Add New Address'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isEdit ? 'Update your delivery information below.' : 'Add a new delivery address below.'}
                </p>
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
                    <h2 id="delete-address-title" className="text-xl font-bold text-slate-900 dark:text-white">Delete Address?</h2>
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
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all"
                  >
                    Delete Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-20 py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <span className="material-icons text-white text-xl">devices</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Tech<span className="text-primary">Home</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Your one-stop destination for premium electronics and smart home solutions. We provide high-quality gadgets for modern living.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Newsletter</h4>
            <p className="text-[14px] text-slate-500 mb-5 leading-relaxed">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary" placeholder="Email address" type="email" />
              <button type="submit" className="bg-primary text-white px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">© 2024 TechHome E-commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">leaderboard</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">share</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">rss_feed</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SavedAddressesPage;
