import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { getFallbackOrderConfirmation } from '@/services/fallbackAdapters';
import type { OrderDto } from '@/types/api';
import { formatVND } from '@/utils';

function mapOrderDtoToConfirmation(order: OrderDto) {
  return {
    orderId: String(order.id),
    lineItems: order.items.map((item, idx) => ({
      id: `${item.productId}-${idx}`,
      name: item.productName,
      image: item.productImage || 'https://picsum.photos/100/100?random=order-confirmation',
      quantity: item.quantity,
      price: Number(item.priceAtOrder) * Number(item.quantity),
    })),
    subtotal: Number(order.totalPrice),
    shipping: 0,
    tax: 0,
    total: Number(order.totalPrice),
    delivery: {
      estimatedDelivery: 'Đang cập nhật',
      shippingAddress: {
        name: '—',
        street: '—',
        city: '—',
        stateZip: '—',
        country: '—',
      },
    },
    payment: {
      brand: '—',
      last4: '—',
    },
    showInstallationBanner: false,
    installationMessage: '',
  };
}

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const { isAuthenticated } = useAuth();
  const [apiOrder, setApiOrder] = useState<OrderDto | null>(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    if (!orderId || !isApiConfigured() || !isAuthenticated) return;
    getOrder(orderId)
      .then((res) => {
        setApiOrder(res);
        setApiUnavailable(false);
      })
      .catch(() => {
        setApiOrder(null);
        setApiUnavailable(true);
      });
  }, [orderId, isAuthenticated]);

  const order = useMemo(() => {
    if (apiOrder) return mapOrderDtoToConfirmation(apiOrder);
    return getFallbackOrderConfirmation();
  }, [apiOrder]);
  const { delivery, payment } = order;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-background-dark/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-white text-xl">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">TechHome</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/search" className="hover:text-primary transition-colors">Mua sắm</Link>
            <Link to="/search" className="hover:text-primary transition-colors">Hỗ trợ</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">Tài khoản</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <span className="material-icons text-green-600 dark:text-green-400 text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Cảm ơn bạn đã đặt hàng!</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Đơn hàng #{order.orderId}</p>
          <p className="text-slate-500 dark:text-slate-500 mt-2">Email xác nhận đã được gửi đến hộp thư của bạn.</p>
          {orderId && isApiConfigured() && isAuthenticated && apiUnavailable && (
            <p className="text-amber-600 mt-2">Backend chưa có API orders, đang hiển thị dữ liệu mẫu tạm thời.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/orders"
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">local_shipping</span>
            Theo dõi đơn hàng
          </Link>
          <Link
            to="/orders"
            className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-primary/20 hover:border-primary text-primary font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">receipt_long</span>
            Chi tiết đơn hàng
          </Link>
        </div>

        {/* Order Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Special Highlight for AC Orders */}
            {order.showInstallationBanner && (
              <div className="bg-blue-50 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                <div className="flex gap-4">
                  <span className="material-icons text-primary">engineering</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Đã lên lịch lắp đặt</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {order.installationMessage ?? 'Kỹ thuật viên sẽ liên hệ trong 24 giờ để xác nhận lịch lắp đặt.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Tóm tắt đơn hàng</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {order.lineItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-slate-500">{item.description}</p>
                      )}
                      {item.variant && (
                        <p className="text-sm text-slate-500">{item.variant}</p>
                      )}
                      <p className="text-sm text-slate-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatVND(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tạm tính</span>
                  <span>{formatVND(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Vận chuyển</span>
                  <span className="text-green-600 font-medium">{order.shipping === 0 ? 'Miễn phí' : formatVND(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Thuế</span>
                  <span>{formatVND(order.tax)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatVND(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary text-xl">event</span>
                Trạng thái giao hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dự kiến giao</p>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">{delivery.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Giao đến</p>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {delivery.shippingAddress.name}<br />
                    {delivery.shippingAddress.street}<br />
                    {delivery.shippingAddress.city}, {delivery.shippingAddress.stateZip}<br />
                    {delivery.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary text-xl">payment</span>
                Thanh toán
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">{payment.brand}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">
                  {payment.brand} kết thúc bằng {payment.last4}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next? */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Tiếp theo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-primary transition-colors group cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <span className="material-icons text-primary group-hover:text-white">verified_user</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Đăng ký bảo hành</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Gia hạn bảo hành 2 năm với ưu đãi 20% khi đăng ký trong 48 giờ.
              </p>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                Đăng ký bảo hành
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-primary transition-colors group cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <span className="material-icons text-primary group-hover:text-white">mail</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">TechHome Insider</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Đăng ký nhận tin để nhận ưu đãi, cập nhật firmware và mẹo bảo trì.
              </p>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                Tham gia cộng đồng
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Cần trợ giúp?</a>
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Chính sách đổi trả</a>
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Câu hỏi thường gặp</a>
          </div>
          <p>© 2024 TechHome Electronics Inc. Bảo lưu mọi quyền.</p>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
