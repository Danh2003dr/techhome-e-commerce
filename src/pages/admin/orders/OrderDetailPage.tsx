import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrderStatus } from '@/services/backend';
import type { AdminOrderDto, UpdateAdminOrderStatusRequest } from '@/types/api';
import { OrderStatusBadge as UiOrderStatusBadge, type OrderStatus } from '@/components/admin/OrderStatusBadge';
import OrderStatusChanger from '@/components/admin/OrderStatusChanger';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const invoiceHref =
    orderId != null
      ? `/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}`
      : '/admin/orders/invoice';

  const handleDownloadPdf = () => {
    if (orderId == null) return;
    navigate(`/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}&autoprint=1`);
  };

  const [order, setOrder] = useState<AdminOrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [changerOpen, setChangerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusOptionsForChanger: OrderStatus[] = useMemo(
    () => ['Completed', 'Processing', 'Rejected', 'On Hold', 'In Transit', 'Shipping'],
    [],
  );

  const mapBackendStatusToAdminStatus = (statusRaw: string): OrderStatus => {
    const s = String(statusRaw ?? '').trim().toLowerCase();
    if (s === 'cancelled' || s === 'canceled' || s === 'reject') return 'Rejected';
    if (s === 'paid') return 'Completed';
    if (s === 'pending' || s === 'processing') return 'Processing';
    if (s === 'shipped' || s === 'shipping' || s === 'delivered') return 'In Transit';
    return 'Processing';
  };

  const mapAdminStatusToBackendStatus = (adminStatus: OrderStatus): string => {
    switch (adminStatus) {
      case 'Completed':
        return 'paid';
      case 'Processing':
        return 'pending';
      case 'Rejected':
        return 'cancelled';
      case 'On Hold':
        return 'pending';
      case 'In Transit':
        return 'shipped';
      case 'Shipping':
        return 'shipping';
      default:
        return 'pending';
    }
  };

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    adminGetOrder(orderId)
      .then((dto) => setOrder(dto))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const currentStatus: OrderStatus = mapBackendStatusToAdminStatus(order?.status ?? 'pending');

  const items = order?.items ?? [];
  const customerName = order?.customerName ?? '—';
  const address = order?.shippingAddressSummary ?? '—';
  const orderDate = order?.createdAt ? new Date(order.createdAt) : null;
  const typeLabel = 'Order';

  const totalCost = useMemo(() => {
    if (order?.totalPrice != null) return Number(order.totalPrice);
    return items.reduce((sum, i) => sum + i.quantity * i.priceAtOrder, 0);
  }, [items, order?.totalPrice]);

  const handleApplyStatus = async (nextStatus: OrderStatus) => {
    if (!orderId) return;
    try {
      setUpdating(true);
      const backendStatus = mapAdminStatusToBackendStatus(nextStatus);
      const body: UpdateAdminOrderStatusRequest = { status: backendStatus };
      const updated = await adminUpdateOrderStatus(orderId, body);
      setOrder(updated);
      setChangerOpen(false);
    } catch {
      // keep modal open; user can retry
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Chi tiết đơn hàng</h1>
          <p className="text-xs font-semibold text-slate-500">
            Mã đơn: <span className="font-bold text-slate-700">{orderId ?? '(placeholder)'}</span>
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
                Tạo hóa đơn
              </Link>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-icons text-[18px]">picture_as_pdf</span>
                Tải PDF
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

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">Chi tiết đơn hàng</div>
          <div className="text-xs font-semibold text-slate-500">Hiển thị khách hàng + sản phẩm + trạng thái</div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Khách hàng / Địa chỉ giao hàng</div>
            <div className="mt-2 space-y-2 text-xs font-semibold text-slate-500">
              <div>
                Khách hàng: <span className="font-bold text-slate-700">{customerName}</span>
              </div>
              <div>
                Địa chỉ: <span className="font-bold text-slate-700">{address}</span>
              </div>
              <div>
                Loại đơn: <span className="font-bold text-slate-700">{typeLabel}</span>
              </div>
              <div>
                Ngày đặt:{' '}
                <span className="font-bold text-slate-700">{orderDate ? orderDate.toLocaleDateString('en-GB') : '—'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Sản phẩm</div>
            {loading ? (
              <div className="mt-2 text-xs font-semibold text-slate-500">Đang tải...</div>
            ) : items.length === 0 ? (
              <div className="mt-2 text-xs font-semibold text-slate-500">Không có sản phẩm nào.</div>
            ) : (
              <div className="mt-2">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-xs">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="py-2 px-2">Sản phẩm</th>
                        <th className="py-2 px-2 text-right">SL</th>
                        <th className="py-2 px-2 text-right">Đơn giá</th>
                        <th className="py-2 px-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => {
                        const lineTotal = it.lineTotal ?? it.quantity * it.priceAtOrder;
                        return (
                          <tr key={it.productId != null ? String(it.productId) : String(idx)} className="border-t border-slate-100">
                            <td className="py-2 px-2 font-medium text-slate-800">{it.productName}</td>
                            <td className="py-2 px-2 text-right text-slate-700">{it.quantity}</td>
                            <td className="py-2 px-2 text-right text-slate-700">${it.priceAtOrder}</td>
                            <td className="py-2 px-2 text-right text-slate-900 font-bold">${lineTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Tổng: <span className="font-extrabold text-slate-900">${totalCost}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Trạng thái / Hóa đơn</div>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <UiOrderStatusBadge status={currentStatus} />
                <button
                  type="button"
                  onClick={() => setChangerOpen(true)}
                  disabled={updating}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-icons text-[16px]">edit</span>
                Đổi trạng thái
                </button>
              </div>

              <div className="flex items-center gap-2">
                {orderId != null && (
                  <Link
                    to={invoiceHref}
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span className="material-icons text-[16px]">receipt_long</span>
                    Xem hóa đơn
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderStatusChanger
        isOpen={changerOpen}
        currentStatus={currentStatus}
        statuses={statusOptionsForChanger}
        onClose={() => setChangerOpen(false)}
        onApply={(next) => void handleApplyStatus(next)}
      />
    </div>
  );
};

export default OrderDetailPage;

