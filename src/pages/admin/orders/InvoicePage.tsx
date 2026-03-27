import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminGetOrder } from '@/services/backend';
import type { AdminOrderDto } from '@/types/api';

type InvoiceParty = {
  name: string;
  address: string;
};

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  baseCost: number;
};

type InvoiceData = {
  from: InvoiceParty;
  to: InvoiceParty;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
};

const formatCurrency = (value: number) => `$${value}`;

const InvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const autoprint = searchParams.get('autoprint') === '1';

  const [adminOrder, setAdminOrder] = React.useState<AdminOrderDto | null>(null);
  useEffect(() => {
    if (!orderId) return;
    void adminGetOrder(orderId)
      .then((dto) => setAdminOrder(dto))
      .catch(() => setAdminOrder(null));
  }, [orderId]);

  const invoice: InvoiceData = useMemo(() => {
    if (!adminOrder) {
      return {
        from: { name: 'TechHome', address: 'TechHome Warehouse' },
        to: { name: '—', address: '—' },
        invoiceDate: '—',
        dueDate: '—',
        items: [],
      };
    }

    return {
      from: { name: 'TechHome', address: 'TechHome Warehouse' },
      to: { name: adminOrder.customerName, address: adminOrder.shippingAddressSummary },
      invoiceDate: adminOrder.createdAt ? new Date(adminOrder.createdAt).toLocaleDateString('en-GB') : '—',
      dueDate: '—',
      items: adminOrder.items.map((it, idx) => ({
        id: idx + 1,
        description: it.productName,
        quantity: it.quantity,
        baseCost: it.priceAtOrder,
      })),
    };
  }, [adminOrder]);

  useEffect(() => {
    if (!autoprint) return;
    const t = window.setTimeout(() => {
      window.print();
    }, 400);
    return () => window.clearTimeout(t);
  }, [autoprint]);

  const rows = useMemo(
    () =>
      invoice.items.map((item) => ({
        ...item,
        totalCost: item.quantity * item.baseCost,
      })),
    [invoice.items],
  );

  const totalAmount = useMemo(() => rows.reduce((sum, item) => sum + item.totalCost, 0), [rows]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const sendInvoice = () => {
    // TODO: Replace with API call when backend endpoint is available.
    console.log('Sending invoice...', {
      from: invoice.from,
      to: invoice.to,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      items: rows,
      totalAmount,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[44px] font-semibold tracking-tight text-[#202224]">Hóa đơn</h1>
          {orderId && (
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Mã đơn: <span className="text-slate-800">{orderId}</span>
            </p>
          )}
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 md:p-7 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500">Bên bán :</p>
            <p className="text-base font-semibold text-slate-900">{invoice.from.name}</p>
            <p className="text-sm font-medium text-slate-500">{invoice.from.address}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500">Bên mua :</p>
            <p className="text-base font-semibold text-slate-900">{invoice.to.name}</p>
            <p className="text-sm font-medium text-slate-500">{invoice.to.address}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500">Ngày hóa đơn :</span>
              <span className="font-semibold text-slate-900">{invoice.invoiceDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500">Hạn thanh toán :</span>
              <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100/90">
                <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-l-xl">Serial No.</th>
                <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">STT</th>
                <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Mô tả</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Số lượng</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Đơn giá</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-r-xl">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100">{item.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-800 border-b border-slate-100">{item.description}</td>
                  <td className="px-5 py-4 text-sm text-right text-slate-700 border-b border-slate-100">{item.quantity}</td>
                  <td className="px-5 py-4 text-sm text-right text-slate-700 border-b border-slate-100">{formatCurrency(item.baseCost)}</td>
                  <td className="px-5 py-4 text-sm text-right text-slate-800 font-semibold border-b border-slate-100">
                    {formatCurrency(item.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end">
          <div className="flex items-center gap-4 text-lg">
            <span className="text-slate-700">Tổng</span>
            <span className="font-bold text-slate-900">=</span>
            <span className="font-extrabold text-slate-900">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
            aria-label="In hóa đơn"
          >
            <span className="material-icons text-[20px]">print</span>
          </button>

          <button
            type="button"
            onClick={sendInvoice}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4880FF] text-white font-semibold text-sm px-5 h-11 hover:bg-[#3E73E8] transition-colors"
          >
            Gửi
            <span className="material-icons text-[18px]">send</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default InvoicePage;
