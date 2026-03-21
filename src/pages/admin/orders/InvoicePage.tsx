import React, { useMemo } from 'react';

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

const MOCK_INVOICE: InvoiceData = {
  from: {
    name: 'Virginia Walker',
    address: '9694 Krajcik Locks Suite 635',
  },
  to: {
    name: 'Austin Miller',
    address: 'Brookview',
  },
  invoiceDate: '12 Nov 2019',
  dueDate: '25 Dec 2019',
  items: [
    { id: 1, description: 'Children Toy', quantity: 2, baseCost: 20 },
    { id: 2, description: 'Makeup', quantity: 2, baseCost: 50 },
    { id: 3, description: 'Asus Laptop', quantity: 5, baseCost: 100 },
    { id: 4, description: 'Iphone X', quantity: 4, baseCost: 1000 },
  ],
};

const formatCurrency = (value: number) => `$${value}`;

const InvoicePage: React.FC = () => {
  const rows = useMemo(
    () =>
      MOCK_INVOICE.items.map((item) => ({
        ...item,
        totalCost: item.quantity * item.baseCost,
      })),
    [],
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
      from: MOCK_INVOICE.from,
      to: MOCK_INVOICE.to,
      invoiceDate: MOCK_INVOICE.invoiceDate,
      dueDate: MOCK_INVOICE.dueDate,
      items: rows,
      totalAmount,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-[44px] font-semibold tracking-tight text-[#202224]">Invoice</h1>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 md:p-7 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500">Invoice From :</p>
            <p className="text-base font-semibold text-slate-900">{MOCK_INVOICE.from.name}</p>
            <p className="text-sm font-medium text-slate-500">{MOCK_INVOICE.from.address}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500">Invoice To :</p>
            <p className="text-base font-semibold text-slate-900">{MOCK_INVOICE.to.name}</p>
            <p className="text-sm font-medium text-slate-500">{MOCK_INVOICE.to.address}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500">Invoice Date :</span>
              <span className="font-semibold text-slate-900">{MOCK_INVOICE.invoiceDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500">Due Date :</span>
              <span className="font-semibold text-slate-900">{MOCK_INVOICE.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100/90">
                <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-l-xl">Serial No.</th>
                <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Description</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Quantity</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Base Cost</th>
                <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-r-xl">Total Cost</th>
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
            <span className="text-slate-700">Total</span>
            <span className="font-bold text-slate-900">=</span>
            <span className="font-extrabold text-slate-900">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
            aria-label="Print invoice"
          >
            <span className="material-icons text-[20px]">print</span>
          </button>

          <button
            type="button"
            onClick={sendInvoice}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4880FF] text-white font-semibold text-sm px-5 h-11 hover:bg-[#3E73E8] transition-colors"
          >
            Send
            <span className="material-icons text-[18px]">send</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default InvoicePage;
