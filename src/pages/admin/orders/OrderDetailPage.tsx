import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const OrderDetailPage: React.FC = () => {
  const params = useParams();
  const orderId = params.orderId;
  const navigate = useNavigate();

  const invoiceHref =
    orderId != null
      ? `/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}`
      : '/admin/orders/invoice';

  const handleDownloadPdf = () => {
    if (orderId == null) return;
    navigate(`/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}&autoprint=1`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Order Detail</h1>
          <p className="text-xs font-semibold text-slate-500">
            Order ID: <span className="font-bold text-slate-700">{orderId ?? '(placeholder)'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orderId != null && (
            <>
              <Link
                to={invoiceHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="material-icons text-[18px]">description</span>
                Generate Invoice
              </Link>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-icons text-[18px]">picture_as_pdf</span>
                Download PDF
              </button>
            </>
          )}
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons text-[18px]">arrow_back</span>
            Back
          </Link>
        </div>
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

