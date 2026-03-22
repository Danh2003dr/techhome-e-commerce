import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';

const ProductFormPage: React.FC = () => {
  const params = useParams();
  const productId = params.id;
  const isEdit = Boolean(productId);

  return (
    <div className="space-y-4">
      <AdminProductsTabs />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-xs font-semibold text-slate-500">Form trống (sẽ nối CRUD + upload + specs)</p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Back
        </Link>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">Product Form (placeholder)</div>
          <div className="text-xs font-semibold text-slate-500">Không có data hiển thị.</div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold text-slate-600">Name</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Category</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Price</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Stock</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold text-slate-600">Images</span>
              <span className="text-xs font-semibold text-slate-500">Upload (placeholder)</span>
            </div>
            <div className="h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
              <span className="text-xs font-semibold text-slate-500">Drop zone (disabled)</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold text-slate-600">Specs (Key-Value)</span>
              <span className="text-xs font-semibold text-slate-500">Specs manager (placeholder)</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-900">No specs yet</div>
              <div className="text-xs font-semibold text-slate-500">Sẽ thêm/sửa key-value động.</div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled
              className="opacity-60 cursor-not-allowed inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold"
            >
              <span className="material-icons text-[18px]">save</span>
              Save (disabled)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductFormPage;

