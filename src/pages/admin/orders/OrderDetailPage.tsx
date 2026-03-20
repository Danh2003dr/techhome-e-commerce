import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderDetailPage: React.FC = () => {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Order Detail</h1>
          <p className="text-xs font-semibold text-slate-500">
            Order ID: <span className="font-bold text-slate-700">{orderId ?? '(placeholder)'}</span>
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Back
        </Link>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">Order Detail (placeholder)</div>
          <div className="text-xs font-semibold text-slate-500">Sẽ hiển thị items + tổng tiền + status changer + invoice</div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Customer / Shipping</div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Empty section</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Items</div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Empty section</div>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Status / Invoice</div>
            <div className="mt-2 text-xs font-semibold text-slate-500">Status changer + PDF placeholder</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;

