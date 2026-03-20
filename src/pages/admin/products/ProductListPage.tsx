import React from 'react';
import { Link } from 'react-router-dom';

const ProductListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Products</h1>
          <p className="text-xs font-semibold text-slate-500">Quản lý danh sách sản phẩm</p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          <span className="material-icons text-[18px]">add</span>
          Add New
        </Link>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">Table (placeholder)</div>
          <div className="text-xs font-semibold text-slate-500">Chưa có data / sẽ nối API sau</div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="text-sm">
                  <td colSpan={5} className="py-10 px-3 text-center text-slate-500 font-semibold">
                    No products yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;

