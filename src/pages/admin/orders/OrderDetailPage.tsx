import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAdminOrder,
  updateAdminOrderStatus,
  getAdminOrderStatusHistory,
} from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { OrderDto, AdminOrderStatus, OrderStatusHistoryDto } from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi, paymentMethodLabelVi, codAwarePaymentStatusVi } from '@/utils/orderDisplay';

/** Khớp ALLOWED_STATUS_TRANSITIONS trên backend — không quay lại trạng thái trước. */
const NEXT_STATUS_OPTIONS: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

function forwardOnlyNextStatuses(current: AdminOrderStatus): AdminOrderStatus[] {
  return NEXT_STATUS_OPTIONS[current].filter((s) => s !== 'CANCELLED');
}

function canCancelOrder(current: AdminOrderStatus): boolean {
  return NEXT_STATUS_OPTIONS[current].includes('CANCELLED');
}

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
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelNote, setCancelNote] = useState('');

  useEffect(() => {
    if (!orderId || !isApiConfigured() || !isAuthenticated) {
      setDto(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([getAdminOrder(orderId), getAdminOrderStatusHistory(orderId)])
      .then(([orderRes, historyRes]) => {
        setDto(orderRes);
        const current = normalizeAdminStatus(orderRes.status);
        const forward = forwardOnlyNextStatuses(current);
        setNextStatus(forward[0] ?? current);
        setShowCancelForm(false);
        setCancelNote('');
        setStatusHistory(historyRes);
      })
      .catch((e: unknown) => {
        setDto(null);
        setError(e instanceof ApiError ? e.message : 'Không tải được đơn.');
      })
      .finally(() => setLoading(false));
  }, [orderId, isAuthenticated]);

  useEffect(() => {
    if (!dto) return;
    const current = normalizeAdminStatus(dto.status);
    const forward = forwardOnlyNextStatuses(current);
    setNextStatus((prev) => (forward.includes(prev) ? prev : forward[0] ?? current));
  }, [dto?.status, dto?.id]);

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
    const current = normalizeAdminStatus(dto.status);
    const forward = forwardOnlyNextStatuses(current);
    if (!forward.includes(nextStatus)) {
      setStatusNotice('Chỉ được chuyển tiếp trong quy trình (không chọn lại trạng thái cũ).');
      return;
    }
    setUpdatingStatus(true);
    setStatusNotice(null);
    try {
      const updated = await updateAdminOrderStatus(orderId, nextStatus);
      setDto(updated);
      const nextCur = normalizeAdminStatus(updated.status);
      const nextForward = forwardOnlyNextStatuses(nextCur);
      setNextStatus(nextForward[0] ?? nextCur);
      setShowCancelForm(false);
      setCancelNote('');
      setStatusNotice('Cập nhật trạng thái đơn thành công.');
    } catch (e: unknown) {
      setStatusNotice(e instanceof ApiError ? e.message : 'Cập nhật trạng thái thất bại.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!dto || !orderId) return;
    const note = cancelNote.trim();
    if (!note) {
      setStatusNotice('Vui lòng nhập lý do hủy đơn.');
      return;
    }
    setUpdatingStatus(true);
    setStatusNotice(null);
    try {
      const updated = await updateAdminOrderStatus(orderId, 'CANCELLED', { note });
      setDto(updated);
      setShowCancelForm(false);
      setCancelNote('');
      setStatusNotice('Đã hủy đơn hàng.');
    } catch (e: unknown) {
      setStatusNotice(e instanceof ApiError ? e.message : 'Hủy đơn thất bại.');
    } finally {
      setUpdatingStatus(false);
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
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <div className="text-right w-full sm:w-auto">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Trạng thái hiện tại</p>
                <p className="text-sm font-semibold text-primary">{orderStatusLabelVi(dto.status)}</p>
              </div>
              {forwardOnlyNextStatuses(normalizeAdminStatus(dto.status)).length > 0 && (
                <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <label className="text-[10px] font-bold uppercase text-slate-500 sr-only sm:not-sr-only sm:inline">
                      Chuyển tiếp sang
                    </label>
                    <select
                      key={normalizeAdminStatus(dto.status)}
                      value={nextStatus}
                      onChange={(e) => setNextStatus(normalizeAdminStatus(e.target.value))}
                      disabled={updatingStatus || showCancelForm}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 min-w-[11rem]"
                      aria-label="Chuyển tiếp sang trạng thái"
                    >
                      {forwardOnlyNextStatuses(normalizeAdminStatus(dto.status)).map((s) => (
                        <option key={s} value={s}>
                          {orderStatusLabelVi(s)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleUpdateStatus()}
                      disabled={updatingStatus || showCancelForm}
                      className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      {updatingStatus ? 'Đang cập nhật…' : 'Cập nhật trạng thái'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-right max-w-[20rem] leading-snug">
                    Danh sách chỉ gồm bước tiếp theo trong quy trình — không thể quay lại trạng thái trước đó.
                  </p>
                </div>
              )}
              {canCancelOrder(normalizeAdminStatus(dto.status)) && !showCancelForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelForm(true);
                    setStatusNotice(null);
                  }}
                  disabled={updatingStatus}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 disabled:opacity-50"
                >
                  Hủy đơn hàng (cần lý do)
                </button>
              )}
              {showCancelForm && canCancelOrder(normalizeAdminStatus(dto.status)) && (
                <div className="w-full max-w-md rounded-xl border border-rose-200 bg-rose-50/80 p-3 space-y-2 text-left">
                  <p className="text-xs font-bold text-rose-800">Xác nhận hủy đơn</p>
                  <textarea
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                    placeholder="Nhập lý do hủy (bắt buộc)…"
                    rows={3}
                    disabled={updatingStatus}
                    className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-slate-800"
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelNote('');
                      }}
                      disabled={updatingStatus}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleConfirmCancel()}
                      disabled={updatingStatus}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                    >
                      {updatingStatus ? 'Đang xử lý…' : 'Xác nhận hủy'}
                    </button>
                  </div>
                </div>
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
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Khách hàng</div>
              <div className="text-sm font-semibold text-slate-900">
                {(dto.userName && String(dto.userName).trim()) || '—'}
              </div>
              {dto.shippingAddress != null && String(dto.shippingAddress).trim() !== '' && (
                <>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-3">Địa chỉ giao</div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{String(dto.shippingAddress).trim()}</div>
                </>
              )}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Thanh toán</div>
              <div className="text-sm text-slate-700">
                Trạng thái:{' '}
                <span className="font-semibold">
                  {codAwarePaymentStatusVi({
                    paymentMethod: dto.paymentMethod,
                    paymentStatus: dto.paymentStatus,
                    orderStatus: dto.status,
                  })}
                </span>
              </div>
              <div className="text-sm text-slate-700">
                Phương thức:{' '}
                <span className="font-semibold">
                  {dto.paymentMethod != null && String(dto.paymentMethod).trim() !== ''
                    ? paymentMethodLabelVi(dto.paymentMethod)
                    : '—'}
                </span>
              </div>
              {dto.paidAt && (
                <div className="text-sm text-slate-700">
                  Thanh toán lúc: <span className="font-semibold">{formatDate(dto.paidAt)}</span>
                </div>
              )}
              {dto.paymentTransactionId && (
                <div className="text-sm text-slate-700">
                  Mã giao dịch: <span className="font-semibold">{dto.paymentTransactionId}</span>
                </div>
              )}
              {dto.paymentFailureReason && (
                <div className="text-sm text-rose-600">
                  Lý do lỗi: <span className="font-semibold">{dto.paymentFailureReason}</span>
                </div>
              )}
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
                    {(h.fromStatus ? `${orderStatusLabelVi(h.fromStatus)} → ` : '') + orderStatusLabelVi(h.toStatus)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(h.createdAt)}
                    {h.changedByUserId != null && h.changedByUserId !== '' ? ' · Cập nhật bởi quản trị' : ''}
                    {h.note ? ` · ${h.note}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default OrderDetailPage;
