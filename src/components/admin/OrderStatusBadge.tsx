import React from 'react';

export type OrderStatus =
  | 'Completed'
  | 'Processing'
  | 'Rejected'
  | 'On Hold'
  | 'In Transit'
  | 'Shipping';

const statusToBadgeClass: Record<OrderStatus, string> = {
  Completed: 'completed',
  Processing: 'processing',
  Rejected: 'rejected',
  'On Hold': 'processing',
  'In Transit': 'processing',
  Shipping: 'processing',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const badgeClass = statusToBadgeClass[status] ?? 'processing';
  return <span className={`admin-badge ${badgeClass}`}>{status}</span>;
}

