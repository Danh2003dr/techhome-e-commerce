import React, { useEffect, useMemo, useState } from 'react';
import OrderFilterBar, { type FilterPanel } from './components/OrderFilterBar';
import OrderTable from './components/OrderTable';
import { MOCK_ADMIN_ORDERS, type OrderStatus, type OrderTypeOption } from './orderListMock';
import { datesAvailableForNav, filterOrders, isSameDay } from './orderListUtils';

const PAGE_SIZE = 9;

export type OrderListInitialVariant = {
  openModal: 'date' | 'type' | 'status' | null;
  dateFilter: string | null;
  selectedTypes: string[];
  selectedStatuses: string[];
  draftDate?: string;
  draftTypes?: string[];
  draftStatuses?: string[];
};

const OrderListPage: React.FC<{ initialVariant?: OrderListInitialVariant }> = () => {
  const [openPanel, setOpenPanel] = useState<FilterPanel>(null);
  const [appliedDates, setAppliedDates] = useState<Date[]>([]);
  const [appliedTypes, setAppliedTypes] = useState<Set<OrderTypeOption>>(new Set());
  const [appliedStatuses, setAppliedStatuses] = useState<Set<OrderStatus>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      filterOrders(MOCK_ADMIN_ORDERS, {
        dates: appliedDates,
        types: appliedTypes,
        statuses: appliedStatuses,
      }),
    [appliedDates, appliedTypes, appliedStatuses],
  );

  /** Chỉ đúng 1 ngày đã apply → điều hướng Prev/Next Date thay cho phân trang số trang */
  const dateNavMode = appliedDates.length === 1;

  const navDates = useMemo(
    () => datesAvailableForNav(MOCK_ADMIN_ORDERS, appliedTypes, appliedStatuses),
    [appliedTypes, appliedStatuses],
  );

  const currentDateIdx = useMemo(() => {
    if (!dateNavMode || appliedDates.length !== 1) return -1;
    return navDates.findIndex((d) => isSameDay(d, appliedDates[0]));
  }, [dateNavMode, appliedDates, navDates]);

  const displayedRows = useMemo(() => {
    if (dateNavMode) return filtered;
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, dateNavMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const resetFilters = () => {
    setAppliedDates([]);
    setAppliedTypes(new Set());
    setAppliedStatuses(new Set());
    setPage(1);
    setOpenPanel(null);
  };

  const startIdx = filtered.length === 0 ? 0 : dateNavMode ? 1 : (page - 1) * PAGE_SIZE + 1;
  const endIdx =
    filtered.length === 0 ? 0 : dateNavMode ? filtered.length : Math.min(page * PAGE_SIZE, filtered.length);

  const goPrevDate = () => {
    if (currentDateIdx <= 0) return;
    setAppliedDates([navDates[currentDateIdx - 1]]);
    setPage(1);
  };

  const goNextDate = () => {
    if (currentDateIdx < 0 || currentDateIdx >= navDates.length - 1) return;
    setAppliedDates([navDates[currentDateIdx + 1]]);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">Order Lists</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Quản lý danh sách đơn hàng</p>
      </div>

      <OrderFilterBar
        openPanel={openPanel}
        setOpenPanel={setOpenPanel}
        appliedDates={appliedDates}
        onApplyDates={(d) => {
          setAppliedDates(d);
          setPage(1);
        }}
        appliedTypes={appliedTypes}
        onApplyTypes={(t) => {
          setAppliedTypes(t);
          setPage(1);
        }}
        appliedStatuses={appliedStatuses}
        onApplyStatuses={(s) => {
          setAppliedStatuses(s);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          <OrderTable rows={displayedRows} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">
            {filtered.length === 0
              ? 'Showing 0 of 0'
              : `Showing ${String(startIdx).padStart(2, '0')}-${String(endIdx).padStart(2, '0')} of ${filtered.length}`}
          </p>

          {dateNavMode ? (
            <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentDateIdx <= 0}
                onClick={goPrevDate}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span className="material-icons text-lg">chevron_left</span>
                Prev. Date
              </button>
              <button
                type="button"
                disabled={currentDateIdx < 0 || currentDateIdx >= navDates.length - 1}
                onClick={goNextDate}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next Date
                <span className="material-icons text-lg">chevron_right</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white min-w-[36px] h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <span className="material-icons text-lg">chevron_left</span>
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 bg-white min-w-[36px] h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <span className="material-icons text-lg">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderListPage;
