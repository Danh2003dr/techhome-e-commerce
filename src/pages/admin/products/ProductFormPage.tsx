import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import ProductImageUpload from '@/pages/admin/products/ProductImageUpload';
import ProductSpecsManager from '@/pages/admin/products/ProductSpecsManager';
import ProductVariantsEditor from '@/pages/admin/products/ProductVariantsEditor';
import {
  addAdminCategory,
  getAdminCategories,
  getAdminProductById,
  newEntityId,
  upsertAdminProduct,
  type AdminProduct,
  type AdminProductVariant,
} from '@/services/adminMockStore';

const inputCls =
  'mt-2 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';

function defaultProduct(id: string): AdminProduct {
  const vid = newEntityId('var');
  return {
    id,
    name: '',
    category: 'Mobile',
    price: 0,
    stock: 0,
    featured: false,
    colors: [],
    description: '',
    images: [],
    specs: [],
    salePrice: null,
    variants: [
      {
        id: vid,
        sku: `SKU-${vid.slice(-8)}`,
        stock: 0,
      },
    ],
  };
}

const ProductFormPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState(() => getAdminCategories());
  const [form, setForm] = useState<AdminProduct>(() =>
    productId ? defaultProduct(productId) : defaultProduct(newEntityId('p'))
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [catModal, setCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) {
      setForm(defaultProduct(newEntityId('p')));
      setLoadError(null);
      return;
    }
    const existing = getAdminProductById(productId);
    if (!existing) {
      setLoadError('Không tìm thấy sản phẩm.');
      return;
    }
    setForm(existing);
    setLoadError(null);
  }, [productId]);

  const categoryNames = useMemo(() => {
    const names = categories.map((c) => c.name);
    const set = new Set(names);
    if (form.category && !set.has(form.category)) names.unshift(form.category);
    return names;
  }, [categories, form.category]);

  const totalStock = useMemo(
    () => form.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0),
    [form.variants]
  );

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!form.variants.length || !form.variants.every((v) => v.sku.trim())) {
      alert('Mỗi biến thể cần có SKU.');
      return;
    }
    const missingImg = form.images.length === 0;
    if (missingImg) {
      const ok = window.confirm('Chưa có ảnh. Lưu vẫn tiếp tục?');
      if (!ok) return;
    }
    setSaving(true);
    try {
      const payload: AdminProduct = {
        ...form,
        stock: totalStock,
      };
      upsertAdminProduct(payload);
      navigate('/admin/products');
    } finally {
      setSaving(false);
    }
  };

  const addCategoryQuick = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    addAdminCategory({ name });
    setCategories(getAdminCategories());
    setForm((f) => ({ ...f, category: name }));
    setNewCatName('');
    setCatModal(false);
  };

  if (isEdit && loadError) {
    return (
      <div className="space-y-4">
        <AdminProductsTabs />
        <p className="text-red-600 font-semibold">{loadError}</p>
        <Link to="/admin/products" className="text-primary font-semibold">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminProductsTabs />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isEdit ? 'Sửa sản phẩm' : 'Sản phẩm mới'}
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Biến thể/SKU, nhiều ảnh, giá khuyến mãi, thông số — lưu vào bộ nhớ trình duyệt (demo).
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Back
        </Link>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="text-sm font-bold text-slate-900 dark:text-white">Chi tiết sản phẩm</div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tên *</span>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Tên sản phẩm"
              />
            </label>

            <div className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Danh mục *</span>
              <div className="mt-2 flex gap-2">
                <select
                  className={`${inputCls} flex-1 mt-0`}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {categoryNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setCatModal(true)}
                  className="shrink-0 px-3 py-2 rounded-xl border border-primary text-primary text-xs font-bold hover:bg-primary/5"
                >
                  + Nhanh
                </button>
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Giá niêm yết *</span>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.price || ''}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Giá khuyến mãi</span>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.salePrice ?? ''}
                placeholder="Để trống nếu không giảm"
                onChange={(e) => {
                  const t = e.target.value;
                  setForm((f) => ({
                    ...f,
                    salePrice: t === '' ? null : Number(t),
                  }));
                }}
              />
            </label>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-slate-300 text-primary"
              />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nổi bật (trang chủ)</span>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mô tả</span>
            <textarea
              className={`${inputCls} min-h-[100px]`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Mô tả ngắn..."
            />
          </label>

          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Ảnh sản phẩm</div>
            <ProductImageUpload images={form.images} onChange={(urls) => setForm((f) => ({ ...f, images: urls }))} />
          </div>

          <ProductVariantsEditor
            variants={form.variants}
            basePrice={form.price}
            onChange={(variants: AdminProductVariant[]) => setForm((f) => ({ ...f, variants }))}
          />

          <ProductSpecsManager specs={form.specs} onChange={(specs) => setForm((f) => ({ ...f, specs }))} />

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Tổng tồn (từ biến thể): <strong>{totalStock}</strong>
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
            >
              <span className="material-icons text-[18px]">save</span>
              {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </div>
      </section>

      {catModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" aria-hidden onClick={() => setCatModal(false)} />
          <form
            onSubmit={addCategoryQuick}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Thêm danh mục nhanh</h3>
            <p className="text-xs text-slate-500 mb-4">Tên mới sẽ xuất hiện trong dropdown và được gán cho sản phẩm hiện tại.</p>
            <input
              autoFocus
              className={inputCls}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="VD: Phụ kiện gaming"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setCatModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Hủy
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
                Thêm & chọn
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductFormPage;
