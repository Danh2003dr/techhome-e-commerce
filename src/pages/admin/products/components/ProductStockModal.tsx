import React, { useEffect, useState } from 'react';
import type { StockProduct } from '../productStockMock';
import { STOCK_CATEGORY_OPTIONS, STOCK_COLOR_PRESETS } from '../productStockMock';

type ProductStockModalProps = {
  open: boolean;
  onClose: () => void;
  /** null = tạo mới */
  initialProduct: StockProduct | null;
  onSave: (product: StockProduct) => void;
};

type FormState = {
  name: string;
  category: string;
  price: string;
  piece: string;
  colors: string[];
  image: string;
};

const emptyForm = (): FormState => ({
  name: '',
  category: STOCK_CATEGORY_OPTIONS[0],
  price: '',
  piece: '',
  colors: [],
  image: '',
});

const ProductStockModal: React.FC<ProductStockModalProps> = ({
  open,
  onClose,
  initialProduct,
  onSave,
}) => {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        category: initialProduct.category,
        price: String(initialProduct.price),
        piece: String(initialProduct.piece),
        colors: [...initialProduct.colors],
        image: initialProduct.image,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, initialProduct]);

  if (!open) return null;

  const toggleColor = (hex: string) => {
    setForm((f) => {
      const has = f.colors.includes(hex);
      return {
        ...f,
        colors: has ? f.colors.filter((c) => c !== hex) : [...f.colors, hex],
      };
    });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      setForm((f) => ({ ...f, image: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const price = Number.parseFloat(form.price);
    const piece = Number.parseInt(form.piece, 10);
    if (Number.isNaN(price) || price < 0) return;
    if (Number.isNaN(piece) || piece < 0) return;

    const product: StockProduct = {
      id: initialProduct?.id ?? `ps-${Date.now()}`,
      name,
      category: form.category,
      price,
      piece,
      colors: form.colors.length > 0 ? form.colors : [STOCK_COLOR_PRESETS[0].hex],
      image: form.image || 'https://picsum.photos/seed/placeholder/120/120',
    };
    onSave(product);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{initialProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Đóng"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-slate-600">Ảnh (tuỳ chọn)</span>
            <input type="file" accept="image/*" onChange={onFile} className="mt-2 block w-full text-sm text-slate-600" />
            {form.image ? (
              <img src={form.image} alt="" className="mt-2 w-20 h-20 rounded-lg object-cover border border-slate-100" />
            ) : null}
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Tên sản phẩm</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25"
              placeholder="Tên sản phẩm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Danh mục</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25 bg-white"
            >
              {STOCK_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Giá (USD)</span>
              <input
                required
                type="number"
                step="0.01"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="0.00"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Số lượng</span>
              <input
                required
                type="number"
                min={0}
                value={form.piece}
                onChange={(e) => setForm((f) => ({ ...f, piece: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="0"
              />
            </label>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-600 block mb-2">Màu có sẵn</span>
            <div className="flex flex-wrap gap-2">
              {STOCK_COLOR_PRESETS.map(({ hex, label }) => {
                const on = form.colors.includes(hex);
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => toggleColor(hex)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      on ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: hex }} />
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Chọn một hoặc nhiều màu (mặc định dùng màu đầu nếu không chọn).</p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductStockModal;
