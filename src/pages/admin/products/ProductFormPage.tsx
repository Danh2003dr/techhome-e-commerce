import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import * as backend from '@/services/backend';
import { generateProductInfo, isAiConfigured } from '@/services/gemini';
import type { CategoryDto } from '@/types/api';

interface FormData {
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  categoryId: string;
  featured: boolean;
}

const EMPTY: FormData = {
  name: '',
  description: '',
  image: '',
  price: '',
  stock: '',
  categoryId: '',
  featured: false,
};

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI generate
  const [aiOpen, setAiOpen] = useState(false);
  const [aiKeyword, setAiKeyword] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  // Load categories
  useEffect(() => {
    backend.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Load product if editing
  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const dto = await backend.getProduct(id);
      setForm({
        name: dto.name,
        description: dto.description ?? '',
        image: dto.image ?? '',
        price: String(dto.price),
        stock: String(dto.stock),
        categoryId: String(dto.categoryId),
        featured: dto.featured,
      });
    } catch {
      setError('Không tải được sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ chấp nhận file ảnh (jpg, png, webp...)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File quá lớn (tối đa 10MB)');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const url = await backend.uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const openAiModal = () => {
    setAiKeyword(form.name || '');
    setAiError(null);
    setAiOpen(true);
    setTimeout(() => aiInputRef.current?.focus(), 50);
  };

  const handleAiGenerate = async () => {
    if (!aiKeyword.trim()) { setAiError('Vui lòng nhập tên hoặc từ khóa sản phẩm'); return; }
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await generateProductInfo(aiKeyword.trim());

      // Map categoryHint → categoryId nếu tìm được
      const matchedCat = categories.find((c) =>
        c.name.toLowerCase().includes(result.categoryHint.toLowerCase()) ||
        result.categoryHint.toLowerCase().includes(c.name.toLowerCase())
      );

      setForm((prev) => ({
        ...prev,
        name: result.name,
        description: result.description,
        price: result.suggestedPrice > 0 ? String(result.suggestedPrice) : prev.price,
        categoryId: matchedCat ? String(matchedCat.id) : prev.categoryId,
      }));
      setAiOpen(false);
      setAiKeyword('');
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'AI gặp lỗi, vui lòng thử lại');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const price = Math.round(parseFloat(form.price));
    const stock = parseInt(form.stock, 10);
    const categoryId = parseInt(form.categoryId, 10);

    if (!form.name.trim()) return setError('Vui lòng nhập tên sản phẩm.');
    if (isNaN(price) || price <= 0) return setError('Giá không hợp lệ.');
    if (isNaN(stock) || stock < 0) return setError('Số lượng không hợp lệ.');
    if (isNaN(categoryId)) return setError('Vui lòng chọn danh mục.');

    setSaving(true);
    try {
      const basePayload = {
        name: form.name.trim(),
        price,
        stock,
        categoryId,
        featured: form.featured,
        ...(form.description ? { description: form.description } : {}),
        ...(form.image ? { image: form.image } : {}),
      };

      if (isEdit && id) {
        await backend.adminUpdateProduct(id, basePayload);
      } else {
        await backend.adminCreateProduct(basePayload);
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err: unknown) {
      console.error('[ProductForm] save error:', err);
      let msg = 'Lưu thất bại.';
      if (err && typeof err === 'object') {
        const e = err as { status?: number; message?: string; body?: { message?: string; [k: string]: unknown } };
        if (e.body?.message) {
          msg = `${e.body.message}`;
        } else if (e.message) {
          msg = e.message;
        }
        if (e.status) msg = `[${e.status}] ${msg}`;
        // log full body for debugging
        if (e.body) console.error('[ProductForm] server body:', JSON.stringify(e.body));
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <AdminProductsTabs />
        <div className="flex justify-center py-20">
          <span className="material-icons animate-spin text-4xl text-primary">refresh</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminProductsTabs />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            {isEdit ? `ID: ${id}` : 'Điền thông tin và lưu'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAiConfigured() && (
            <button
              type="button"
              onClick={openAiModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold hover:from-violet-600 hover:to-purple-700 transition-all shadow-sm shadow-purple-200"
            >
              <span className="material-icons text-[18px]">auto_awesome</span>
              Tạo bằng AI
            </button>
          )}
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons text-[18px]">arrow_back</span>
            Quay lại
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <span className="material-icons text-[18px]">error_outline</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <span className="material-icons text-[18px]">check_circle</span>
          Lưu thành công! Đang chuyển trang...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="text-sm font-bold text-slate-900">Thông tin sản phẩm</div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: iPhone 15 Pro Max 256GB"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={handleChange}
                placeholder="VD: 29990000"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="VD: 100"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Hình ảnh sản phẩm</label>

              {/* Drop zone */}
              <div
                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-primary bg-blue-50'
                    : 'border-slate-200 hover:border-primary hover:bg-slate-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }}
                />

                {uploading ? (
                  <>
                    <span className="material-icons animate-spin text-3xl text-primary">refresh</span>
                    <p className="text-sm text-slate-500 font-medium">Đang tải lên...</p>
                  </>
                ) : form.image ? (
                  <div className="flex items-center gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={form.image}
                      alt="preview"
                      className="h-24 w-24 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/96x96?text=?'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{form.image}</p>
                      <p className="text-xs text-slate-400 mt-1">Click vùng này để chọn ảnh khác</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setForm((p) => ({ ...p, image: '' })); }}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Xóa ảnh"
                    >
                      <span className="material-icons text-[20px]">delete</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-icons text-4xl text-slate-300">add_photo_alternate</span>
                    <p className="text-sm font-semibold text-slate-600">Kéo thả ảnh vào đây hoặc <span className="text-primary">click để chọn</span></p>
                    <p className="text-xs text-slate-400">JPG, PNG, WebP · Tối đa 10MB</p>
                  </>
                )}
              </div>

              {/* URL fallback input */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-400 flex-shrink-0">hoặc dán URL:</span>
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {uploadError && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="material-icons text-[14px]">error_outline</span>
                  {uploadError}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Mô tả
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả chi tiết sản phẩm..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Featured */}
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Sản phẩm nổi bật (featured)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="material-icons animate-spin text-[18px]">refresh</span>
              ) : (
                <span className="material-icons text-[18px]">save</span>
              )}
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </section>
      </form>

      {/* AI Generate Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <span className="material-icons text-2xl">auto_awesome</span>
                <div>
                  <h3 className="font-bold text-base">Tạo sản phẩm bằng AI</h3>
                  <p className="text-violet-200 text-xs">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <span className="material-icons text-[22px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Nhập tên hoặc từ khóa sản phẩm. AI sẽ tự động điền <strong>tên, mô tả, giá đề xuất</strong> và chọn <strong>danh mục</strong> phù hợp.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Tên / Từ khóa sản phẩm
                </label>
                <input
                  ref={aiInputRef}
                  value={aiKeyword}
                  onChange={(e) => setAiKeyword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !aiLoading) handleAiGenerate(); }}
                  placeholder="VD: iPhone 16 Pro Max 256GB, Tai nghe Sony WH-1000XM5..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              {aiError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <span className="material-icons text-[18px] flex-shrink-0 mt-0.5">error_outline</span>
                  {aiError}
                </div>
              )}

              {/* Examples */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Gợi ý nhanh</p>
                <div className="flex flex-wrap gap-2">
                  {['iPhone 16 Pro', 'Samsung Galaxy S25', 'AirPods Pro 2', 'iPad Pro M4', 'Sony WH-1000XM5', 'MacBook Air M3'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAiKeyword(s)}
                      className="px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading || !aiKeyword.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-violet-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <span className="material-icons text-[16px] animate-spin">refresh</span>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <span className="material-icons text-[16px]">auto_awesome</span>
                    Tạo ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormPage;
