import React from 'react';
import { Link } from 'react-router-dom';
import { orderConfirmationSample } from '../data';

const OrderConfirmationPage: React.FC = () => {
  const order = orderConfirmationSample;
  const { delivery, payment } = order;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-background-dark/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-white text-xl">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">TechHome</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/search" className="hover:text-primary transition-colors">Shop</Link>
            <Link to="/search" className="hover:text-primary transition-colors">Support</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">My Account</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <span className="material-icons text-green-600 dark:text-green-400 text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Thank You for Your Order!</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Order #{order.orderId}</p>
          <p className="text-slate-500 dark:text-slate-500 mt-2">A confirmation email has been sent to your inbox.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">local_shipping</span>
            Track Order
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-primary/20 hover:border-primary text-primary font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">receipt_long</span>
            Order Details
          </Link>
        </div>

        {/* Order Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Special Highlight for AC Orders */}
            {order.showInstallationBanner && (
              <div className="bg-blue-50 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                <div className="flex gap-4">
                  <span className="material-icons text-primary">engineering</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Installation Scheduled</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {order.installationMessage ?? 'Our certified technician will contact you within 24 hours to confirm the installation schedule.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Order Summary</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {order.lineItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-slate-500">{item.description}</p>
                      )}
                      {item.variant && (
                        <p className="text-sm text-slate-500">{item.variant}</p>
                      )}
                      <p className="text-sm text-slate-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax</span>
                  <span>${order.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary text-xl">event</span>
                Delivery Status
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">{delivery.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shipping To</p>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {delivery.shippingAddress.name}<br />
                    {delivery.shippingAddress.street}<br />
                    {delivery.shippingAddress.city}, {delivery.shippingAddress.stateZip}<br />
                    {delivery.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary text-xl">payment</span>
                Payment
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">{payment.brand}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">
                  {payment.brand} ending in {payment.last4}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next? */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">What&apos;s Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-primary transition-colors group cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <span className="material-icons text-primary group-hover:text-white">verified_user</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Register Warranty</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Extend your peace of mind. Sign up for our 2-year extended protection plan within 48 hours for a 20% discount.
              </p>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                Secure your products
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-primary transition-colors group cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <span className="material-icons text-primary group-hover:text-white">mail</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">TechHome Insider</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Join our newsletter to receive exclusive tech deals, firmware updates, and maintenance tips for your new gear.
              </p>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                Join the community
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Need Help?</a>
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Return Policy</a>
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">FAQs</a>
          </div>
          <p>© 2024 TechHome Electronics Inc. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
