import React, { useEffect, useState } from 'react';
import type { StockProduct } from '../productStockMock';
import { formatUsd } from '../productStockMock';

type ProductStockModalProps = {
  open: boolean;
  onClose: () => void;
  initialProduct: StockProduct | null;
  actionType: StockActionType;
  onSave: (payload: StockActionPayload) => void;
  saving?: boolean;
};

export type StockActionType = 'add' | 'remove' | 'reservation' | 'sold';

export type StockActionPayload = {
  actionType: StockActionType;
  quantity: number;
};

type ActionMeta = { title: string; hint: string; buttonLabel: string };

const ACTION_META: Record<StockActionType, ActionMeta> = {
  add: {
    title: 'Add Stock',
    hint: 'Tang so luong ton kho hien tai.',
    buttonLabel: 'Add',
  },
  remove: {
    title: 'Remove Stock',
    hint: 'Tru bot ton kho hien tai.',
    buttonLabel: 'Remove',
  },
  reservation: {
    title: 'Reserve Stock',
    hint: 'Chuyen stock sang reserved cho quy trinh dat hang.',
    buttonLabel: 'Reserve',
  },
  sold: {
    title: 'Mark as Sold',
    hint: 'Giam reserved va tang soldCount.',
    buttonLabel: 'Mark Sold',
  },
};

const ProductStockModal: React.FC<ProductStockModalProps> = ({
  open,
  onClose,
  initialProduct,
  actionType,
  onSave,
  saving = false,
}) => {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!open) return;
    setQuantity('');
  }, [open, initialProduct, actionType]);

  if (!open || !initialProduct) return null;
  const meta = ACTION_META[actionType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number.parseInt(quantity, 10);
    if (Number.isNaN(q) || q <= 0) return;
    onSave({
      actionType,
      quantity: q,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      onClick={saving ? undefined : onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{meta.title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-50"
            aria-label="Close"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <img
              src={initialProduct.image}
              alt=""
              className="h-14 w-14 rounded-lg object-cover border border-slate-200 bg-white"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{initialProduct.name}</p>
              <p className="text-xs text-slate-500">{initialProduct.category}</p>
              <p className="text-xs font-semibold text-slate-700">
                {formatUsd(initialProduct.price)} | In stock: {initialProduct.piece}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">{meta.hint}</p>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">Quantity</span>
            <input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25"
              placeholder="Nhap so luong"
            />
          </label>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? 'Processing...' : meta.buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductStockModal;
