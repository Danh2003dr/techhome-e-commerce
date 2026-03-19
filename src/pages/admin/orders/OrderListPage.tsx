import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { OrderStatusBadge, type OrderStatus } from '@/components/admin/OrderStatusBadge';

type FilterModal = null | 'date' | 'type' | 'status';

const orderTypeOptions = [
  'Health & Beauty',
  'Book & Stationery',
  'Services & Industry',
  'Fashion & Beauty',
  'Home & Living',
  'Electronics',
  'Mobile & Phone',
  'Accessories',
];

const orderStatusOptions: OrderStatus[] = ['Completed', 'Processing', 'Rejected', 'On Hold', 'In Transit'];
const orderDates = ['14 Feb 2019', '15 Feb 2019', '16 Feb 2019', '17 Feb 2019', '18 Feb 2019'];

export type OrderListInitialVariant = {
  openModal?: FilterModal;
  dateFilter?: string | null;
  selectedTypes?: string[];
  selectedStatuses?: string[];
  draftDate?: string;
  draftTypes?: string[];
  draftStatuses?: string[];
};

type OrderListPageProps = {
  initialVariant?: OrderListInitialVariant;
};

const OrderListPage: React.FC<OrderListPageProps> = ({ initialVariant }) => {
  const [openModal, setOpenModal] = useState<FilterModal>(initialVariant?.openModal ?? null);
  const [dateFilter, setDateFilter] = useState<string | null>(initialVariant?.dateFilter ?? null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    () => new Set(initialVariant?.selectedTypes ?? [])
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    () => new Set(initialVariant?.selectedStatuses ?? [])
  );

  // Draft states for popup "Apply Now"
  const [draftDate, setDraftDate] = useState<string>(() => initialVariant?.draftDate ?? orderDates[0]);
  const [draftTypes, setDraftTypes] = useState<Set<string>>(
    () => new Set(initialVariant?.draftTypes ?? [])
  );
  const [draftStatuses, setDraftStatuses] = useState<Set<string>>(
    () => new Set(initialVariant?.draftStatuses ?? [])
  );

  const selectedTypesLabel = useMemo(() => {
    if (selectedTypes.size === 0) return 'Any';
    return Array.from(selectedTypes).slice(0, 2).join(', ') + (selectedTypes.size > 2 ? ` +${selectedTypes.size - 2}` : '');
  }, [selectedTypes]);

  const selectedStatusesLabel = useMemo(() => {
    if (selectedStatuses.size === 0) return 'Any';
    return Array.from(selectedStatuses).slice(0, 2).join(', ') + (selectedStatuses.size > 2 ? ` +${selectedStatuses.size - 2}` : '');
  }, [selectedStatuses]);

  const openDateModal = () => {
    setDraftDate(dateFilter ?? orderDates[0]);
    setOpenModal('date');
  };

  const openTypeModal = () => {
    setDraftTypes(new Set(selectedTypes));
    setOpenModal('type');
  };

  const openStatusModal = () => {
    setDraftStatuses(new Set(selectedStatuses));
    setOpenModal('status');
  };

  const applyModal = () => {
    if (openModal === 'date') setDateFilter(draftDate);
    if (openModal === 'type') setSelectedTypes(new Set(draftTypes));
    if (openModal === 'status') setSelectedStatuses(new Set(draftStatuses));
    setOpenModal(null);
  };

  const resetAll = () => {
    setDateFilter(null);
    setSelectedTypes(new Set());
    setSelectedStatuses(new Set());
    setOpenModal(null);
  };

  const toggleDraftSet = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Order Lists</h1>
      <section className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-order-filter-title">
            <span className="material-icons" aria-hidden>
              filter_list
            </span>
            <span>Filter By</span>
          </div>

          <button type="button" className="admin-filter-button" onClick={openDateModal}>
            {dateFilter ?? 'Select date'}
          </button>

          <button type="button" className="admin-filter-button" onClick={openTypeModal}>
            <span style={{ fontWeight: 800 }}>Order Type</span>
            <span className="admin-filter-subtle"> {selectedTypesLabel}</span>
          </button>

          <button type="button" className="admin-filter-button" onClick={openStatusModal}>
            <span style={{ fontWeight: 800 }}>Order Status</span>
            <span className="admin-filter-subtle"> {selectedStatusesLabel}</span>
          </button>

          <button className="admin-btn secondary" type="button" onClick={resetAll}>
            Reset Filter
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00001</td>
              <td>Christine Brooks</td>
              <td>089 Kutch Green Apt.</td>
              <td>04 Sep 2019</td>
              <td>Electric</td>
              <td>
                <OrderStatusBadge status="Completed" />
              </td>
              <td>
                <Link to="/admin/orders/00001" className="admin-btn secondary">
                  View
                </Link>
              </td>
            </tr>
            <tr>
              <td>00002</td>
              <td>Rosie Pearson</td>
              <td>979 Immanuel Ferry Suite 526</td>
              <td>28 May 2019</td>
              <td>Book</td>
              <td>
                <OrderStatusBadge status="Processing" />
              </td>
              <td>
                <Link to="/admin/orders/00002" className="admin-btn secondary">
                  View
                </Link>
              </td>
            </tr>
            <tr>
              <td>00003</td>
              <td>Darrel Caldwell</td>
              <td>8587 Frida Ports</td>
              <td>23 Nov 2019</td>
              <td>Medicine</td>
              <td>
                <OrderStatusBadge status="Rejected" />
              </td>
              <td>
                <Link to="/admin/orders/00003" className="admin-btn secondary">
                  View
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Filter popups (UI state only) */}
        {openModal && (
          <div className="admin-modal-backdrop" onMouseDown={() => setOpenModal(null)} role="dialog" aria-modal="true">
            <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>
              {openModal === 'date' && (
                <>
                  <div className="admin-modal-title">Select Order Date</div>
                  <div className="admin-chip-grid">
                    {orderDates.map((d) => {
                      const active = d === draftDate;
                      return (
                        <button
                          key={d}
                          type="button"
                          className={`admin-chip${active ? ' active' : ''}`}
                          onClick={() => setDraftDate(d)}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {openModal === 'type' && (
                <>
                  <div className="admin-modal-title">Select Order Type</div>
                  <div className="admin-chip-grid">
                    {orderTypeOptions.map((t) => {
                      const active = draftTypes.has(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          className={`admin-chip${active ? ' active' : ''}`}
                          onClick={() => setDraftTypes((prev) => toggleDraftSet(prev, t))}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {openModal === 'status' && (
                <>
                  <div className="admin-modal-title">Select Order Status</div>
                  <div className="admin-chip-grid">
                    {orderStatusOptions.map((s) => {
                      const active = draftStatuses.has(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`admin-chip${active ? ' active' : ''}`}
                          onClick={() => setDraftStatuses((prev) => toggleDraftSet(prev, s))}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="admin-modal-actions">
                <button className="admin-btn secondary" type="button" onClick={() => setOpenModal(null)}>
                  Cancel
                </button>
                <button className="admin-btn" type="button" onClick={applyModal}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderListPage;
