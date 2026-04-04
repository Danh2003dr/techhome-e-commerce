import React from 'react';
import { mockOrderStatusLabelVi, type OrderStatus } from '../orderListMock';

const STATUS_CLASS: Record<OrderStatus, string> = {
  Completed: 'bg-emerald-100 text-emerald-800',
  Processing: 'bg-purple-100 text-purple-800',
  Rejected: 'bg-red-100 text-red-800',
  'On Hold': 'bg-orange-100 text-orange-800',
  'In Transit': 'bg-fuchsia-100 text-fuchsia-800',
};

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
  >
    {mockOrderStatusLabelVi(status)}
  </span>
);

export default OrderStatusBadge;
