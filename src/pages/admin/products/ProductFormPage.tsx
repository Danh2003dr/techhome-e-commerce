import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import CategorySearchCombobox from '@/components/admin/CategorySearchCombobox';
import ProductImageUpload from '@/pages/admin/products/ProductImageUpload';
import ProductSpecsManager from '@/pages/admin/products/ProductSpecsManager';
import ProductCatalogOptions from '@/pages/admin/products/ProductCatalogOptions';
import type { CatalogColorRow, CatalogStorageRow } from '@/pages/admin/products/ProductCatalogOptions';
import {
  createAdminCategory,
  createAdminProduct,
  deleteAdminProduct,
  getCategories,
  getProduct,
  updateAdminProduct,
  type AdminProductUpsertPayload,
} from '@/services/backend';
import type { CategoryDto, ProductDto } from '@/types/api';
import { ApiError } from '@/services/api';
import { newEntityId, type AdminProductSpec } from '@/services/adminMockStore';

const inputCls =
  'mt-1.5 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow';

/** Khối form có tiêu đề — dùng chung để nhất quán thị giác */
function FormSection({
  icon,
  title,
  description,
  children,
  className = '',
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/90 to-white dark:from-slate-800/30 dark:to-slate-900">
        <div className="flex gap-3">
          <span className="material-icons text-primary shrink-0 text-[24px]">{icon}</span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
            {description ? (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

type CatalogProductFormState = {
  id: string;
  name: string;
  /** Khớp `category_id` backend — nguồn đáng tin khi lưu. */
  categoryId: number | string | null;
  /** Tên hiển thị (đồng bộ với DTO). */
  category: string;
  price: number;
  stock: number;
  sku: string;
  tag: string;
  featured: boolean;
  description: string;
  images: string[];
  specs: AdminProductSpec[];
  salePrice: number | null;
  colorRows: CatalogColorRow[];
  storageRows: CatalogStorageRow[];
};

function defaultFormState(id: string): CatalogProductFormState {
  return {
    id,
    name: '',
    categoryId: null,
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    tag: '',
    featured: false,
    description: '',
    images: [],
    specs: [],
    salePrice: null,
    colorRows: [],
    storageRows: [],
  };
}

function mapProductDtoToForm(dto: ProductDto): CatalogProductFormState {
  const specs: AdminProductSpec[] = [];
  if (dto.specifications) {
    try {
      const parsed = JSON.parse(dto.specifications) as Record<string, unknown>;
      Object.entries(parsed).forEach(([key, value]) => {
        if (value == null) return;
        if (typeof value === 'object') {
          Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
            specs.push({ id: newEntityId('spec'), key: `${key}.${k}`, value: String(v ?? '') });
          });
        } else {
          specs.push({ id: newEntityId('spec'), key, value: String(value) });
        }
      });
    } catch {
      specs.push({ id: newEntityId('spec'), key: 'specifications', value: dto.specifications });
    }
  }

  const colors = dto.colors ?? [];
  const colorRows: CatalogColorRow[] = colors.map((c) => ({
    id: newEntityId('col'),
    name: c.name,
    hex: c.hex && /^#[0-9A-Fa-f]{6}$/.test(c.hex) ? c.hex : '#6b7280',
  }));

  const storageOpts = dto.storageOptions ?? [];
  const storageRows: CatalogStorageRow[] = storageOpts.map((v) => ({
    id: newEntityId('sto'),
    value: v,
  }));

  return {
    id: String(dto.id),
    name: dto.name,
    categoryId: dto.categoryId ?? null,
    category: dto.categoryName || '',
    price: Number(dto.price ?? 0),
    stock: Number(dto.stock ?? 0),
    sku: dto.sku != null ? String(dto.sku) : '',
    tag: dto.tag != null ? String(dto.tag) : '',
    featured: Boolean(dto.featured),
    description: dto.description ?? '',
    images: dto.images?.length ? dto.images.filter(Boolean) : dto.image ? [dto.image] : [],
    specs,
    salePrice: dto.salePrice ?? null,
    colorRows,
    storageRows,
  };
}

const ProductFormPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [form, setForm] = useState<CatalogProductFormState>(() =>
    productId ? defaultFormState(productId) : defaultFormState(newEntityId('p'))
  );
  /** Chỉ dùng cho lỗi GET sản phẩm/danh mục lúc vào trang — không trộn với lỗi lưu */
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [catModal, setCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  /** `null` = danh mục gốc; số = id danh mục cha (khớp `parent_id` backend). */
  const [newCatParentId, setNewCatParentId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [softDeleting, setSoftDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    getCategories()
      .then((cats) => {
        setCategories(cats);
        if (!productId) {
          setForm((prev) => ({
            ...prev,
            categoryId: cats[0]?.id ?? null,
            category: cats[0]?.name ?? '',
          }));
          return null;
        }
        return getProduct(productId).then((dto) => {
          setForm(mapProductDtoToForm(dto));
        });
      })
      .catch((e) => {
        setFetchError(e instanceof Error ? e.message : 'Không tải được dữ liệu sản phẩm.');
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const mergeCategoryIntoPool = (cat: CategoryDto) => {
    setCategories((prev) => (prev.some((c) => String(c.id) === String(cat.id)) ? prev : [...prev, cat]));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    const missingImg = form.images.length === 0;
    if (missingImg) {
      const ok = window.confirm('Chưa có ảnh. Lưu vẫn tiếp tục?');
      if (!ok) return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (form.categoryId == null) {
        setFormError('Vui lòng chọn danh mục (ô tìm kiếm).');
        return;
      }
      const selectedCategory = categories.find((c) => String(c.id) === String(form.categoryId));
      if (!selectedCategory) {
        setFormError('Danh mục không hợp lệ. Chọn lại trong ô tìm kiếm.');
        return;
      }

      const colorsPayload = form.colorRows
        .map((r) => ({ name: r.name.trim(), hex: r.hex.trim() || '#6b7280' }))
        .filter((c) => c.name.length > 0);

      const storagePayload = Array.from(
        new Set(form.storageRows.map((r) => r.value.trim()).filter(Boolean))
      );

      const specsObject = form.specs.reduce<Record<string, string>>((acc, s) => {
        const key = s.key.trim();
        if (!key) return acc;
        acc[key] = s.value;
        return acc;
      }, {});

      const payload: AdminProductUpsertPayload = {
        name: form.name.trim(),
        categoryId: Number(selectedCategory.id),
        price: Number(form.price) || 0,
        description: form.description || '',
        image: form.images[0] ?? null,
        images: form.images,
        salePrice: form.salePrice ?? null,
        stock: Math.max(0, Number(form.stock) || 0),
        featured: form.featured,
        sku: form.sku.trim() || null,
        tag: form.tag.trim() || null,
        colors: colorsPayload,
        storageOptions: storagePayload,
        specifications: Object.keys(specsObject).length ? JSON.stringify(specsObject) : null,
      };

      if (isEdit && productId) {
        await updateAdminProduct(productId, payload);
      } else {
        await createAdminProduct(payload);
      }
      navigate('/admin/products');
    } catch (e) {
      if (e instanceof ApiError) {
        setFormError(e.message);
      } else {
        setFormError(e instanceof Error ? e.message : 'Lưu sản phẩm thất bại.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!productId) return;
    const ok = window.confirm(
      'Sản phẩm sẽ bị ẩn khỏi cửa hàng (xóa mềm trên backend). Khách không còn thấy sản phẩm; dữ liệu vẫn lưu trong hệ thống. Tiếp tục?',
    );
    if (!ok) return;
    setSoftDeleting(true);
    setFormError(null);
    try {
      await deleteAdminProduct(productId);
      navigate('/admin/products');
    } catch (e) {
      if (e instanceof ApiError) {
        setFormError(e.message);
      } else {
        setFormError(e instanceof Error ? e.message : 'Xóa sản phẩm thất bại.');
      }
    } finally {
      setSoftDeleting(false);
    }
  };

  const openCategoryModal = () => {
    setNewCatName('');
    setNewCatParentId(null);
    setCatModal(true);
  };

  const closeCategoryModal = () => {
    setCatModal(false);
  };

  const addCategoryQuick = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    createAdminCategory({
      name,
      parentId: newCatParentId,
    })
      .then((cat) => {
        mergeCategoryIntoPool(cat);
        setForm((f) => ({ ...f, categoryId: cat.id, category: cat.name }));
        setNewCatName('');
        setNewCatParentId(null);
        setCatModal(false);
      })
      .catch((e) => {
        setFormError(e instanceof Error ? e.message : 'Thêm danh mục thất bại.');
      });
  };

  const newCatParentLabel = useMemo(() => {
    if (newCatParentId == null) return '';
    const c = categories.find((x) => String(x.id) === String(newCatParentId));
    return c?.name ?? '';
  }, [newCatParentId, categories]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <AdminProductsTabs />
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="material-icons text-4xl text-primary/60 animate-pulse">hourglass_empty</span>
          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Đang tải dữ liệu sản phẩm…</p>
        </div>
      </div>
    );
  }

  if (isEdit && fetchError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <AdminProductsTabs />
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/20 p-6">
          <p className="text-red-700 dark:text-red-300 font-semibold">{fetchError}</p>
          <Link to="/admin/products" className="inline-flex items-center gap-1 mt-4 text-primary font-bold text-sm hover:underline">
            <span className="material-icons text-lg">arrow_back</span>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-28 md:pb-10">
      <AdminProductsTabs />

      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isEdit ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
              }`}
            >
              {isEdit ? 'Chỉnh sửa' : 'Tạo mới'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Điền thông tin đồng bộ với API catalog — không cần biến thể SKU phức tạp; màu và dung lượng là danh sách đơn giản lưu trên sản phẩm.
          </p>
        </div>
        <Link
          to="/admin/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <span className="material-icons text-[20px]">arrow_back</span>
          Danh sách
        </Link>
      </header>

      <div className="space-y-6">
        <FormSection
          icon="inventory_2"
          title="Thông tin chung"
          description="Tên hiển thị, danh mục và mô tả ngắn — bắt buộc có tên và danh mục hợp lệ."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block md:col-span-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tên sản phẩm *</span>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ví dụ: iPhone 15 Pro"
              />
            </label>

            <div className="block md:col-span-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Danh mục *</span>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-1">
                Gõ để tìm trên server; mở ô để xem gợi ý nhanh từ danh sách đã tải.
              </p>
              <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <CategorySearchCombobox
                    valueId={form.categoryId}
                    valueLabel={form.category}
                    initialPool={categories}
                    placeholder="Tìm và chọn danh mục…"
                    onSelect={(cat) => {
                      mergeCategoryIntoPool(cat);
                      setForm((f) => ({ ...f, categoryId: cat.id, category: cat.name }));
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={openCategoryModal}
                  className="shrink-0 inline-flex items-center justify-center gap-1 rounded-xl border border-dashed border-primary/50 text-primary px-4 py-2.5 text-xs font-bold hover:bg-primary/5"
                >
                  <span className="material-icons text-[18px]">add</span>
                  Danh mục mới
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 md:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-slate-300 text-primary w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Hiển thị ở mục sản phẩm nổi bật (trang chủ)
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mô tả</span>
              <textarea
                className={`${inputCls} min-h-[108px] resize-y`}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả ngắn cho khách xem…"
              />
            </label>
          </div>
        </FormSection>

        <FormSection
          icon="payments"
          title="Giá & tồn kho"
          description="Giá niêm yết và giá khuyến mãi (nếu có). Tồn kho, SKU và nhãn tùy chọn."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Giá niêm yết (đ) *</span>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.price || ''}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Giá khuyến mãi (đ)</span>
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
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tồn kho *</span>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.stock || ''}
                onChange={(e) => setForm((f) => ({ ...f, stock: Math.max(0, Number(e.target.value) || 0) }))}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mã SKU</span>
              <input
                className={inputCls}
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                placeholder="Tùy chọn"
              />
            </label>
            <label className="block sm:col-span-2 lg:col-span-4">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Nhãn (tag)</span>
              <input
                className={inputCls}
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                placeholder="Ví dụ: Mới, HOT — tùy chọn"
              />
            </label>
          </div>
        </FormSection>

        <FormSection
          icon="photo_library"
          title="Hình ảnh"
          description="Ảnh đầu tiên thường dùng làm ảnh đại diện. Có thể tải nhiều ảnh lên CDN qua bước presign."
        >
          <ProductImageUpload images={form.images} onChange={(urls) => setForm((f) => ({ ...f, images: urls }))} />
        </FormSection>

        <FormSection
          icon="style"
          title="Màu sắc & dung lượng"
          description="Hai danh sách độc lập — khách chọn trên trang chi tiết theo dữ liệu này."
        >
          <ProductCatalogOptions
            colorRows={form.colorRows}
            onColorRowsChange={(colorRows) => setForm((f) => ({ ...f, colorRows }))}
            storageRows={form.storageRows}
            onStorageRowsChange={(storageRows) => setForm((f) => ({ ...f, storageRows }))}
          />
        </FormSection>

        <ProductSpecsManager specs={form.specs} onChange={(specs) => setForm((f) => ({ ...f, specs }))} />

        {isEdit && productId ? (
          <FormSection
            icon="warning"
            title="Xóa khỏi cửa hàng"
            description="Sản phẩm không còn hiển thị cho khách; bản ghi vẫn lưu trên server (xóa mềm)."
          >
            <button
              type="button"
              disabled={saving || softDeleting}
              onClick={handleSoftDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 px-5 py-2.5 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50 transition-colors"
            >
              <span className="material-icons text-[20px]">{softDeleting ? 'hourglass_empty' : 'delete_outline'}</span>
              {softDeleting ? 'Đang xóa…' : 'Xóa mềm — ẩn khỏi cửa hàng'}
            </button>
          </FormSection>
        ) : null}
      </div>

      {formError && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-4 px-1">{formError}</p>
      )}

      {/* Thanh hành động: cố định dưới màn hình nhỏ, inline trên desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:static md:mt-8 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none md:border-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:shadow-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 md:px-0 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="hidden sm:inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Hủy
          </Link>
          <button
            type="button"
            disabled={saving || softDeleting}
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-6 py-3 text-sm font-bold shadow-lg shadow-primary/25 hover:brightness-105 disabled:opacity-60 w-full sm:w-auto min-w-[160px] transition-all"
          >
            <span className="material-icons text-[20px]">{saving ? 'hourglass_empty' : 'save'}</span>
            {saving ? 'Đang lưu…' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      {catModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden onClick={closeCategoryModal} />
          <form
            onSubmit={addCategoryQuick}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm danh mục</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Tên mới sẽ xuất hiện trong danh sách và được chọn cho sản phẩm hiện tại. Chọn danh mục cha bên dưới nếu bạn cần{' '}
              <span className="font-semibold text-slate-600 dark:text-slate-300">danh mục con</span>.
            </p>
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Danh mục cha</span>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-1">Tìm danh mục làm cha — tránh cuộn list dài.</p>
              <CategorySearchCombobox
                valueId={newCatParentId}
                valueLabel={newCatParentLabel}
                initialPool={categories}
                placeholder="Tìm danh mục cha…"
                allowRoot
                onSelectRoot={() => setNewCatParentId(null)}
                onSelect={(cat) => setNewCatParentId(Number(cat.id))}
                dropdownZClass="z-[80]"
              />
            </label>
            <label className="block mt-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tên danh mục mới *</span>
              <input
                autoFocus
                className={inputCls + ' mt-0'}
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ví dụ: Phụ kiện"
              />
            </label>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-105"
              >
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
