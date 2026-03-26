import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import ProductStockModal, { type StockActionPayload, type StockActionType } from './components/ProductStockModal';
import ProductStockTable from './components/ProductStockTable';
import { type StockProduct } from './productStockMock';
import {
  addInventoryStock,
  getAdminInventories,
  getProduct,
  removeInventoryStock,
  reserveInventoryStock,
  soldInventoryStock,
} from '@/services/backend';
import { ApiError } from '@/services/api';

const PAGE_SIZE = 9;
type InventoryStockProduct = StockProduct & { productId: number };

const ProductStockPage: React.FC = () => {
  const [products, setProducts] = useState<InventoryStockProduct[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryStockProduct | null>(null);
  const [actionType, setActionType] = useState<StockActionType>('add');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadStockRows = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const inventories = await getAdminInventories();
      const rows = await Promise.all(
        inventories.map(async (inv) => {
          try {
            const p = await getProduct(inv.product);
            return {
              id: String(inv.id),
              productId: Number(inv.product),
              name: p.name,
              category: p.categoryName || 'Uncategorized',
              price: Number(p.salePrice ?? p.price ?? 0),
              piece: Number(inv.stock ?? 0),
              colors: (p.colors ?? []).map((c) => c.hex).filter(Boolean),
              image: p.image ?? p.images?.[0] ?? 'https://picsum.photos/seed/placeholder/120/120',
            } as InventoryStockProduct;
          } catch {
            return {
              id: String(inv.id),
              productId: Number(inv.product),
              name: `Product #${inv.product}`,
              category: 'Unknown',
              price: 0,
              piece: Number(inv.stock ?? 0),
              colors: ['#9CA3AF'],
              image: 'https://picsum.photos/seed/placeholder/120/120',
            } as InventoryStockProduct;
          }
        })
      );
      setProducts(rows);
    } catch (e) {
      setProducts([]);
      setLoadError(e instanceof Error ? e.message : 'Khong tai duoc ton kho tu backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStockRows();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return products;
    return products.filter((p) => p.name.toLowerCase().includes(debouncedSearch));
  }, [products, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const openActionModal = (p: StockProduct, action: StockActionType) => {
    setEditingProduct(p as InventoryStockProduct);
    setActionType(action);
    setModalOpen(true);
  };

  const handleStockAction = async (payload: StockActionPayload) => {
    if (!editingProduct) return;
    const quantity = Math.max(1, Number(payload.quantity) || 1);
    setSaving(true);
    try {
      if (payload.actionType === 'add') {
        await addInventoryStock(editingProduct.productId, quantity);
      } else if (payload.actionType === 'remove') {
        await removeInventoryStock(editingProduct.productId, quantity);
      } else if (payload.actionType === 'reservation') {
        const idem = `reserve-${editingProduct.productId}-${Date.now()}`;
        await reserveInventoryStock(editingProduct.productId, quantity, idem);
      } else if (payload.actionType === 'sold') {
        const idem = `sold-${editingProduct.productId}-${Date.now()}`;
        await soldInventoryStock(editingProduct.productId, quantity, idem);
      }
      await loadStockRows();
      setModalOpen(false);
      setEditingProduct(null);
    } catch (e) {
      const message = e instanceof ApiError || e instanceof Error ? e.message : 'Cap nhat ton kho that bai.';
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = filtered.length === 0 ? 0 : Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-6">
      <AdminProductsTabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">Product Stock</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Quản lý tồn kho sản phẩm</p>
          {loading && <p className="text-xs text-slate-500 mt-1">Dang tai du lieu ton kho tu backend...</p>}
          {!loading && loadError && <p className="text-xs text-red-600 mt-1">{loadError}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-72">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search product name"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
          >
            <span className="material-icons text-[18px]">add</span>
            Create Product
          </Link>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          <ProductStockTable rows={pageRows} onAction={openActionModal} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">
            {filtered.length === 0
              ? 'Showing 0 of 0'
              : `Showing ${String(startIdx).padStart(2, '0')}-${String(endIdx).padStart(2, '0')} of ${filtered.length}`}
          </p>
          <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 bg-white min-w-[36px] h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <span className="material-icons text-lg">chevron_left</span>
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 bg-white min-w-[36px] h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <span className="material-icons text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <ProductStockModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        actionType={actionType}
        saving={saving}
        onSave={(payload) => {
          void handleStockAction(payload);
        }}
      />
    </div>
  );
};

export default ProductStockPage;
