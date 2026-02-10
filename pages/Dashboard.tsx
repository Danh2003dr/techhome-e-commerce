import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import { orders } from '../data';

const statusSteps = ['Order Placed', 'Confirmed', 'Technician Assigned', 'Installation Complete'] as const;

const Dashboard: React.FC = () => {
  const activeOrder = orders.find((o) => o.status === 'Shipping');
  const pastOrders = orders.filter((o) => o.status !== 'Shipping');

  return (
    <div className="max-w-7xl mx-auto flex gap-0 lg:gap-8">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-500 mt-1">Manage your recent purchases and track installations.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600">
              <span className="material-icons">notifications</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">JD</div>
          </div>
        </header>

        {activeOrder && (
          <section className="mb-12">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Status</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden">
                      <img src={activeOrder.productImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-600 mb-1 uppercase tracking-widest">In Progress</div>
                      <h3 className="text-xl font-bold text-gray-900">{activeOrder.productName ?? 'Order'}</h3>
                      <p className="text-gray-400 text-sm">Order ID: #{activeOrder.id} • Placed {activeOrder.date}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600">
                      <span className="material-icons">engineering</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned Technician</p>
                      <p className="text-sm font-bold text-gray-900">John Doe • <span className="text-indigo-600">0901234567</span></p>
                    </div>
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                  <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-indigo-600 -translate-y-1/2 rounded-full" />
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, idx) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white z-10 ${
                            idx < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <span className="material-icons text-sm">{idx < 2 ? 'check' : idx === 2 ? 'pending' : 'verified'}</span>
                        </div>
                        <span className={`mt-3 text-[10px] font-bold uppercase text-center ${idx < 3 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-4 flex justify-end">
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                  View Installation Details <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Past Orders</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">
              <span className="material-icons text-sm">filter_list</span> Filter
            </button>
          </div>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">#{order.id}</h4>
                    <p className="text-sm text-gray-500">Ordered: {order.date} • {order.itemsCount} Item(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Total</p>
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Processing'
                        ? 'bg-amber-50 text-amber-600'
                        : order.status === 'Shipping'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {order.status}
                  </span>
                  <button className="text-gray-400 hover:text-indigo-600">
                    <span className="material-icons">more_horiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="px-8 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              Load More Orders
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
