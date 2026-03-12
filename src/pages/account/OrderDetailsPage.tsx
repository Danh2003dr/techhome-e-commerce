import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '@/data';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = orderId ? getOrderDetails(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Order not found.</p>
          <Link to="/dashboard" className="text-primary font-semibold hover:underline">Back to Order History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        {/* Main */}
        <main className="flex-grow space-y-6 min-w-0">
          <div>
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Account', path: '/profile' },
                { label: 'Order History', path: '/dashboard' },
                { label: `#${order.orderId}` },
              ]}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                >
                  <span className="material-icons text-xl">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Order #{order.orderId}</h1>
                  <p className="text-slate-500 mt-0.5">Placed on {order.placedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {order.statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between relative">
              {order.stepperSteps.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className={`flex flex-col items-center gap-3 relative z-10 ${!step.completed && !step.active ? 'opacity-40' : ''}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step.completed
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : step.active
                            ? 'bg-white dark:bg-slate-800 border-2 border-primary text-primary'
                            : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="material-icons text-xl">{step.icon}</span>
                    </div>
                    <span className={`text-[13px] font-bold ${step.active ? 'text-primary' : ''}`}>{step.label}</span>
                    <span className={`text-[11px] ${step.active ? 'text-primary font-medium' : 'text-slate-400'}`}>{step.sublabel}</span>
                  </div>
                  {i < order.stepperSteps.length - 1 && (
                    <div className={`flex-grow h-1 mx-2 -mt-8 ${step.completed ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order Items ({order.lineItems.length})</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.lineItems.map((item) => (
                    <div key={item.name} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center justify-center flex-shrink-0">
                        <img alt={item.name} src={item.image} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item.name}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.specs}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-sm font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Qty: {item.quantity}</span>
                          <span className="text-primary font-bold">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      <button type="button" className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0">
                        Write Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-2xl border border-primary/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary">help_outline</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Need Help with your order?</h4>
                    <p className="text-sm text-slate-500">Track shipments, manage returns or contact support.</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button type="button" className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Contact Support
                  </button>
                  <button type="button" className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <span className="material-icons text-lg">download</span>
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal ({order.lineItems.length} items)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-green-600">{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${order.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                    <span className="font-bold text-lg text-primary">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Shipping Address</h3>
                <div className="flex gap-3">
                  <span className="material-icons text-slate-400 flex-shrink-0">location_on</span>
                  <div className="text-sm text-slate-500">
                    <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress.name}</p>
                    <p className="mt-1">{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.cityStateZip}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Payment Method</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-slate-600 dark:text-slate-400 text-xl">credit_card</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-900 dark:text-white">{order.payment.brand} ending in {order.payment.last4}</p>
                    <p className="text-slate-400">Expires {order.payment.expires}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default OrderDetailsPage;
