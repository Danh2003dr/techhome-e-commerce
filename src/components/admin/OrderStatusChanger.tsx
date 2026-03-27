import React, { useEffect, useMemo, useState } from 'react';

import type { OrderStatus } from './OrderStatusBadge';

type OrderStatusChangerProps = {
  isOpen: boolean;
  currentStatus: OrderStatus;
  statuses: OrderStatus[];
  onClose: () => void;
  onApply: (nextStatus: OrderStatus) => void;
};

export default function OrderStatusChanger({
  isOpen,
  currentStatus,
  statuses,
  onClose,
  onApply,
}: OrderStatusChangerProps) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);

  useEffect(() => {
    if (isOpen) setSelected(currentStatus);
  }, [isOpen, currentStatus]);

  const title = useMemo(() => 'Chọn trạng thái đơn', []);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="admin-modal-title">{title}</div>

        <div className="admin-chip-grid">
          {statuses.map((s) => {
            const active = s === selected;
            return (
              <button
                key={s}
                type="button"
                className={`admin-chip${active ? ' active' : ''}`}
                onClick={() => setSelected(s)}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="admin-modal-actions">
          <button className="admin-btn secondary" type="button" onClick={onClose}>
            Hủy
          </button>
          <button
            className="admin-btn"
            type="button"
            onClick={() => {
              onApply(selected);
              onClose();
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}

