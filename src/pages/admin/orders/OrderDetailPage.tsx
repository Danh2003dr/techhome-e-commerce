import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import OrderStatusChanger from '@/components/admin/OrderStatusChanger';
import { OrderStatusBadge, type OrderStatus } from '@/components/admin/OrderStatusBadge';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams();
  const statuses = useMemo<OrderStatus[]>(
    () => ['Processing', 'Shipping', 'Completed', 'Rejected'],
    []
  );

  const [status, setStatus] = useState<OrderStatus>('Processing');
  const [isChangerOpen, setIsChangerOpen] = useState(false);

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Order Detail #{orderId}</h1>

      <section className="admin-card">
        <div className="admin-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 800, color: '#2a3448', fontSize: 13 }}>Status</span>
            <OrderStatusBadge status={status} />
          </div>

          <button type="button" className="admin-btn secondary" onClick={() => setIsChangerOpen(true)}>
            Change Status
          </button>

          <Link to={`/admin/orders/${orderId}/invoice`} className="admin-btn secondary">
            Open Invoice
          </Link>

          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              void generateInvoicePDF({ orderId });
            }}
          >
            Print / PDF
          </button>
        </div>

        <div className="admin-invoice-meta">
          <div>
            <div className="admin-invoice-meta-title">Invoice To</div>
            <div className="admin-invoice-meta-value">Christine Brooks</div>
            <div className="admin-invoice-meta-sub">089 Kutch Green Apt.</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Invoice From</div>
            <div className="admin-invoice-meta-value">TechHome E-Commerce</div>
            <div className="admin-invoice-meta-sub">support@techhome.example</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Issue Date</div>
            <div className="admin-invoice-meta-value">04 Sep 2019</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Due Date</div>
            <div className="admin-invoice-meta-value">04 Oct 2019</div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>iPhone X</td>
              <td>4</td>
              <td>$1000</td>
              <td>$4000</td>
            </tr>
            <tr>
              <td>Children Toy</td>
              <td>2</td>
              <td>$20</td>
              <td>$40</td>
            </tr>
          </tbody>
        </table>

        <div className="admin-invoice-summary">
          <div />
          <div />
          <div />
          <div className="admin-invoice-total">
            <div style={{ fontWeight: 800, marginBottom: 6, color: '#2a3448' }}>Total</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>$4040</div>
          </div>
        </div>
      </section>

      <OrderStatusChanger
        isOpen={isChangerOpen}
        currentStatus={status}
        statuses={statuses}
        onClose={() => setIsChangerOpen(false)}
        onApply={(nextStatus) => setStatus(nextStatus)}
      />
    </div>
  );
};

export default OrderDetailPage;
