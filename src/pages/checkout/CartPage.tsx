import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping: number = 0;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Giỏ hàng <span className="text-gray-400 font-normal ml-2">({totalItems} sản phẩm)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-6 items-center border-b border-gray-50 last:border-b-0"
              >
                <div className="col-span-12 md:col-span-6 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <Link to={`/product/${item.productId}`} className="font-bold text-gray-900 text-lg hover:text-indigo-600">
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-sm text-gray-400">{item.variant}</p>}
                    <div className="mt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-600 flex items-center gap-1"
                      >
                        <span className="material-icons text-sm">delete_outline</span> Xóa
                      </button>
                      <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-indigo-600 flex items-center gap-1">
                        <span className="material-icons text-sm">bookmark_border</span> Để mua sau
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="font-bold text-gray-900">{formatVND(item.price)}</span>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-500"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-500"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="font-black text-indigo-600">{formatVND(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-8">Tóm tắt đơn hàng</h2>
            
            {/* Coupon Code Input */}
            <div className="mb-6 pb-6 border-b border-gray-50">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors">
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-500 border-b border-gray-50 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-bold text-gray-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span className="font-bold text-emerald-600">{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế (ước tính)</span>
                <span className="font-bold text-gray-900">{formatVND(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-gray-900">Tổng cộng</span>
              <span className="text-3xl font-black text-indigo-600">{formatVND(total)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
            >
              Thanh toán <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
