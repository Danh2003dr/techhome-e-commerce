import React, { useEffect, useMemo, useState } from 'react';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import ProductStockModal from './components/ProductStockModal';
import ProductStockTable from './components/ProductStockTable';
import { INITIAL_STOCK_PRODUCTS, type StockProduct } from './productStockMock';

const PAGE_SIZE = 9;

const ProductStockPage: React.FC = () => {
  const [products, setProducts] = useState<StockProduct[]>(() => [...INITIAL_STOCK_PRODUCTS]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockProduct | null>(null);

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

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (p: StockProduct) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSave = (p: StockProduct) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    } else {
      setProducts((prev) => [...prev, p]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (p: StockProduct) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
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
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
          >
            <span className="material-icons text-[18px]">add</span>
            Add Product
          </button>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          <ProductStockTable rows={pageRows} onEdit={openEdit} onDelete={handleDelete} />
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
          setModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductStockPage;
