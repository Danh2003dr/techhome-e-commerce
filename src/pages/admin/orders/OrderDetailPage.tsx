import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAdminOrder,
  updateAdminOrderStatus,
  getAdminOrderStatusHistory,
  getAdminOrderShipment,
  upsertAdminOrderShipment,
  getAdminOrderReturns,
  createAdminOrderReturn,
  updateAdminReturnStatus,
} from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type {
  OrderDto,
  AdminOrderStatus,
  OrderStatusHistoryDto,
  ShipmentDto,
  ReturnRequestDto,
} from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi } from '@/utils/orderDisplay';

const NEXT_STATUS_OPTIONS: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPING', 'SHIPPED', 'CANCELLED'],
  SHIPPING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

const SHIPMENT_STATUSES = ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED'] as const;
const RETURN_STATUSES = ['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED', 'CANCELLED'] as const;

function normalizeAdminStatus(status: string): AdminOrderStatus {
  const s = String(status || '').trim().toUpperCase();
  if (
    s === 'PENDING' ||
    s === 'PROCESSING' ||
    s === 'SHIPPING' ||
    s === 'SHIPPED' ||
    s === 'DELIVERED' ||
    s === 'CANCELLED'
  ) {
    return s;
  }
  return 'PENDING';
}

function toIsoInputValue(value?: string | null): string {
  if (!value) return '';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const h = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  return `${y}-${m}-${d}T${h}:${mm}`;
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dto, setDto] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<AdminOrderStatus>('PENDING');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistoryDto[]>([]);
  const [shipment, setShipment] = useState<ShipmentDto | null>(null);
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [shipmentStatus, setShipmentStatus] = useState<string>('PENDING');
  const [shipmentCarrier, setShipmentCarrier] = useState('');
  const [shipmentTracking, setShipmentTracking] = useState('');
  const [shipmentShippedAt, setShipmentShippedAt] = useState('');
  const [shipmentEstimatedAt, setShipmentEstimatedAt] = useState('');
  const [shipmentDeliveredAt, setShipmentDeliveredAt] = useState('');
  const [shipmentNote, setShipmentNote] = useState('');
  const [shipmentSaving, setShipmentSaving] = useState(false);
  const [shipmentNotice, setShipmentNotice] = useState<string | null>(null);
  const [createReturnReason, setCreateReturnReason] = useState('');
  const [createReturnNote, setCreateReturnNote] = useState('');
  const [createReturnProductId, setCreateReturnProductId] = useState('');
  const [createReturnQty, setCreateReturnQty] = useState('1');
  const [returnSaving, setReturnSaving] = useState(false);
  const [returnNotice, setReturnNotice] = useState<string | null>(null);
  const [returnStatusInputs, setReturnStatusInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!orderId || !isApiConfigured() || !isAuthenticated) {
      setDto(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      getAdminOrder(orderId),
      getAdminOrderStatusHistory(orderId),
      getAdminOrderReturns(orderId),
      getAdminOrderShipment(orderId).catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }),
    ])
      .then(([orderRes, historyRes, returnsRes, shipmentRes]) => {
        setDto(orderRes);
        const current = normalizeAdminStatus(orderRes.status);
        const options = NEXT_STATUS_OPTIONS[current];
        setNextStatus(options[0] ?? current);
        setStatusHistory(historyRes);
        setReturns(returnsRes);
        const statusInit: Record<string, string> = {};
        for (const row of returnsRes) {
          statusInit[String(row.id)] = String(row.status || 'REQUESTED').toUpperCase();
        }
        setReturnStatusInputs(statusInit);
        setShipment(shipmentRes);
        if (shipmentRes) {
          setShipmentStatus(String(shipmentRes.status || 'PENDING').toUpperCase());
          setShipmentCarrier(shipmentRes.carrier || '');
          setShipmentTracking(shipmentRes.trackingNumber || '');
          setShipmentShippedAt(toIsoInputValue(shipmentRes.shippedAt || null));
          setShipmentEstimatedAt(toIsoInputValue(shipmentRes.estimatedDeliveryAt || null));
          setShipmentDeliveredAt(toIsoInputValue(shipmentRes.deliveredAt || null));
          setShipmentNote(shipmentRes.note || '');
        } else {
          setShipmentStatus('PENDING');
          setShipmentCarrier('');
          setShipmentTracking('');
          setShipmentShippedAt('');
          setShipmentEstimatedAt('');
          setShipmentDeliveredAt('');
          setShipmentNote('');
        }
      })
      .catch((e: unknown) => {
        setDto(null);
        setError(e instanceof ApiError ? e.message : 'Không tải được đơn.');
      })
      .finally(() => setLoading(false));
  }, [orderId, isAuthenticated]);

  const invoiceHref =
    orderId != null
      ? `/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}`
      : '/admin/orders/invoice';

  const handleDownloadPdf = () => {
    if (orderId == null) return;
    navigate(`/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}&autoprint=1`);
  };

  const handleUpdateStatus = async () => {
    if (!dto || !orderId) return;
    setUpdatingStatus(true);
    setStatusNotice(null);
    try {
      const updated = await updateAdminOrderStatus(orderId, nextStatus);
      setDto(updated);
      const current = normalizeAdminStatus(updated.status);
      const options = NEXT_STATUS_OPTIONS[current];
      setNextStatus(options[0] ?? current);
      setStatusNotice('Cập nhật trạng thái đơn thành công.');
    } catch (e: unknown) {
      setStatusNotice(e instanceof ApiError ? e.message : 'Cập nhật trạng thái thất bại.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveShipment = async () => {
    if (!orderId) return;
    setShipmentSaving(true);
    setShipmentNotice(null);
    try {
      const saved = await upsertAdminOrderShipment(orderId, {
        carrier: shipmentCarrier || null,
        trackingNumber: shipmentTracking || null,
        status: shipmentStatus,
        shippedAt: shipmentShippedAt ? new Date(shipmentShippedAt).toISOString() : null,
        estimatedDeliveryAt: shipmentEstimatedAt ? new Date(shipmentEstimatedAt).toISOString() : null,
        deliveredAt: shipmentDeliveredAt ? new Date(shipmentDeliveredAt).toISOString() : null,
        note: shipmentNote || null,
      });
      setShipment(saved);
      setShipmentNotice('Lưu vận đơn thành công.');
    } catch (e: unknown) {
      setShipmentNotice(e instanceof ApiError ? e.message : 'Lưu vận đơn thất bại.');
    } finally {
      setShipmentSaving(false);
    }
  };

  const handleCreateReturn = async () => {
    if (!orderId) return;
    const productId = Number(createReturnProductId);
    const quantity = Number(createReturnQty);
    if (!Number.isFinite(productId) || !Number.isFinite(quantity) || quantity <= 0) {
      setReturnNotice('Product ID / số lượng return không hợp lệ.');
      return;
    }
    setReturnSaving(true);
    setReturnNotice(null);
    try {
      const created = await createAdminOrderReturn(orderId, {
        reason: createReturnReason || null,
        note: createReturnNote || null,
        items: [{ productId, quantity, reason: createReturnReason || null }],
      });
      const rows = await getAdminOrderReturns(orderId);
      setReturns(rows);
      setReturnStatusInputs((prev) => ({ ...prev, [String(created.id)]: String(created.status || 'REQUESTED').toUpperCase() }));
      setCreateReturnReason('');
      setCreateReturnNote('');
      setCreateReturnProductId('');
      setCreateReturnQty('1');
      setReturnNotice('Tạo yêu cầu trả hàng thành công.');
    } catch (e: unknown) {
      setReturnNotice(e instanceof ApiError ? e.message : 'Tạo yêu cầu trả hàng thất bại.');
    } finally {
      setReturnSaving(false);
    }
  };

  const handleUpdateReturnStatus = async (returnId: number | string) => {
    if (!orderId) return;
    const key = String(returnId);
    const next = (returnStatusInputs[key] || '').toUpperCase();
    if (!next) {
      setReturnNotice('Vui lòng chọn trạng thái return.');
      return;
    }
    setReturnSaving(true);
    setReturnNotice(null);
    try {
      await updateAdminReturnStatus(orderId, returnId, {
        status: next,
      });
      const rows = await getAdminOrderReturns(orderId);
      setReturns(rows);
      setReturnNotice('Cập nhật trạng thái return thành công.');
    } catch (e: unknown) {
      setReturnNotice(e instanceof ApiError ? e.message : 'Cập nhật trạng thái return thất bại.');
    } finally {
      setReturnSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Chi tiết đơn</h1>
          <p className="text-xs font-semibold text-slate-500">
            Mã đơn: <span className="font-bold text-slate-700">{orderId ?? '—'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">Dữ liệu lấy từ API admin orders.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orderId != null && (
            <>
              <Link
                to={invoiceHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="material-icons text-[18px]">description</span>
                Hóa đơn
              </Link>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-icons text-[18px]">print</span>
                In nhanh
              </button>
            </>
          )}
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons text-[18px]">arrow_back</span>
            Quay lại
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {statusNotice && (
        <p className={`text-sm ${statusNotice.includes('thành công') ? 'text-emerald-600' : 'text-red-600'}`}>
          {statusNotice}
        </p>
      )}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">Đơn #{dto.id}</div>
              <div className="text-xs text-slate-500 mt-1">{formatDate(dto.createdAt)}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-primary">{orderStatusLabelVi(dto.status)}</span>
              {NEXT_STATUS_OPTIONS[normalizeAdminStatus(dto.status)].length > 0 && (
                <>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(normalizeAdminStatus(e.target.value))}
                    disabled={updatingStatus}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {NEXT_STATUS_OPTIONS[normalizeAdminStatus(dto.status)].map((s) => (
                      <option key={s} value={s}>
                        {orderStatusLabelVi(s)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void handleUpdateStatus()}
                    disabled={updatingStatus}
                    className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    {updatingStatus ? 'Đang cập nhật…' : 'Cập nhật trạng thái'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-sm font-bold text-slate-900">Sản phẩm</div>
            <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {dto.items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="px-4 py-3 flex justify-between gap-4 text-sm">
                  <span className="text-slate-800">{item.productName}</span>
                  <span className="text-slate-500 shrink-0">
                    {item.quantity} × {formatVND(item.priceAtOrder)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Tổng</span>
              <span className="text-primary">{formatVND(dto.totalPrice)}</span>
            </div>
          </div>
        </section>
      )}

      {!loading && !dto && !error && orderId && isApiConfigured() && isAuthenticated && (
        <p className="text-sm text-slate-500">Không có dữ liệu.</p>
      )}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Lịch sử trạng thái đơn</h2>
          {statusHistory.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có lịch sử trạng thái.</p>
          ) : (
            <div className="space-y-2">
              {statusHistory.map((h) => (
                <div key={String(h.id)} className="text-sm border border-slate-100 rounded-lg px-3 py-2">
                  <div className="font-semibold text-slate-800">
                    {(h.fromStatus ? `${orderStatusLabelVi(h.fromStatus)} -> ` : '') + orderStatusLabelVi(h.toStatus)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(h.createdAt)} | User: {h.changedByUserId ?? '-'} {h.note ? `| ${h.note}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Vận đơn (Shipment)</h2>
          {shipmentNotice && (
            <p className={`text-sm ${shipmentNotice.includes('thành công') ? 'text-emerald-600' : 'text-red-600'}`}>
              {shipmentNotice}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-600">
              Carrier
              <input
                value={shipmentCarrier}
                onChange={(e) => setShipmentCarrier(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Tracking Number
              <input
                value={shipmentTracking}
                onChange={(e) => setShipmentTracking(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Status
              <select
                value={shipmentStatus}
                onChange={(e) => setShipmentStatus(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {SHIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Shipped At
              <input
                type="datetime-local"
                value={shipmentShippedAt}
                onChange={(e) => setShipmentShippedAt(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              ETA
              <input
                type="datetime-local"
                value={shipmentEstimatedAt}
                onChange={(e) => setShipmentEstimatedAt(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Delivered At
              <input
                type="datetime-local"
                value={shipmentDeliveredAt}
                onChange={(e) => setShipmentDeliveredAt(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="text-xs font-semibold text-slate-600 block">
            Note
            <textarea
              value={shipmentNote}
              onChange={(e) => setShipmentNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleSaveShipment()}
            disabled={shipmentSaving}
            className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {shipmentSaving ? 'Đang lưu…' : shipment ? 'Cập nhật vận đơn' : 'Tạo vận đơn'}
          </button>
        </section>
      )}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Returns</h2>
          {returnNotice && (
            <p className={`text-sm ${returnNotice.includes('thành công') ? 'text-emerald-600' : 'text-red-600'}`}>
              {returnNotice}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-600">
              Product ID
              <input
                value={createReturnProductId}
                onChange={(e) => setCreateReturnProductId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="vd: 1"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Quantity
              <input
                value={createReturnQty}
                onChange={(e) => setCreateReturnQty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="vd: 1"
              />
            </label>
          </div>
          <label className="text-xs font-semibold text-slate-600 block">
            Return Reason
            <input
              value={createReturnReason}
              onChange={(e) => setCreateReturnReason(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold text-slate-600 block">
            Note
            <input
              value={createReturnNote}
              onChange={(e) => setCreateReturnNote(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleCreateReturn()}
            disabled={returnSaving}
            className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {returnSaving ? 'Đang tạo…' : 'Tạo yêu cầu return'}
          </button>

          <div className="space-y-2">
            {returns.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có return cho đơn này.</p>
            ) : (
              returns.map((r) => (
                <div key={String(r.id)} className="rounded-lg border border-slate-100 p-3">
                  <div className="text-sm font-semibold text-slate-800">
                    Return #{r.id} - {String(r.status || '')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Requested: {r.requestedAt ? formatDate(r.requestedAt) : '-'} | Items: {Array.isArray(r.items) ? r.items.length : 0}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value={returnStatusInputs[String(r.id)] || String(r.status || 'REQUESTED').toUpperCase()}
                      onChange={(e) =>
                        setReturnStatusInputs((prev) => ({ ...prev, [String(r.id)]: e.target.value.toUpperCase() }))
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {RETURN_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleUpdateReturnStatus(r.id)}
                      disabled={returnSaving}
                      className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 disabled:opacity-60"
                    >
                      Cập nhật return
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default OrderDetailPage;
