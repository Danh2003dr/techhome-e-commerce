import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import * as backend from '@/services/backend';
import type { ProductDto } from '@/types/api';

const PAGE_SIZE = 20;

const formatVnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

function getPaginationPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 0) return [];
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  let left = Math.max(2, current - 1);
  let right = Math.min(total - 1, current + 1);
  if (current <= 3) { left = 2; right = 4; }
  else if (current >= total - 2) { left = total - 3; right = total - 1; }
  if (left > 2) pages.push('ellipsis');
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

const paginationBtnBase = 'min-w-[36px] h-9 px-2 inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors';
const paginationInactive = `${paginationBtnBase} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`;
const paginationActive = `${paginationBtnBase} border-primary bg-primary text-white font-bold hover:bg-blue-600`;

const ProductCard: React.FC<{ product: ProductDto; onDelete: (id: number) => void }> = ({ product, onDelete }) => {
  const img = product.image || 'https://placehold.co/400x400?text=No+Image';

  return (
    <article className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="relative bg-[#F9F9F9] rounded-t-[14px] min-h-[200px] flex items-center justify-center">
        <img
          src={img}
          alt={product.name}
          className="max-h-[220px] w-auto object-contain px-4 py-6 select-none pointer-events-none"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image'; }}
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            Nổi bật
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            Hết hàng
          </span>
        )}
      </div>

      <div className="px-4 pt-4 pb-5 flex-1 flex flex-col">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {product.categoryName}
        </p>
        <h2 className="text-[16px] leading-5 font-bold text-[#202224] mb-2 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-base font-bold text-[#4880FF] mb-1">{formatVnd(product.price)}</p>
        <p className="text-xs text-slate-400 mb-4">Kho: {product.stock} sản phẩm</p>

        <div className="mt-auto flex gap-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="flex-1 text-center py-2 rounded-xl bg-[#E2EAF8]/70 text-[#202224] text-sm font-semibold hover:bg-[#E2EAF8] transition-colors"
          >
            Chỉnh sửa
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors"
            aria-label="Xóa sản phẩm"
          >
            <span className="material-icons text-[18px] leading-none">delete</span>
          </button>
        </div>
      </div>
    </article>
  );
};

const PaginationBar: React.FC<{ page: number; totalPages: number; onPageChange: (p: number) => void }> = ({
  page, totalPages, onPageChange,
}) => {
  const items = useMemo(() => getPaginationPages(page, totalPages), [page, totalPages]);
  if (totalPages <= 1) return null;
  return (
    <div className="flex w-full justify-center pt-6">
      <nav className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
          className={`${paginationInactive} disabled:opacity-40 disabled:pointer-events-none`}>
          <span className="material-icons text-[20px] leading-none">chevron_left</span>
        </button>
        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`e-${idx}`} className="min-w-[36px] h-9 inline-flex items-center justify-center text-slate-500 text-sm font-semibold">...</span>
          ) : (
            <button key={item} type="button" onClick={() => onPageChange(item)}
              className={item === page ? paginationActive : paginationInactive}>
              {item}
            </button>
          )
        )}
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
          className={`${paginationInactive} disabled:opacity-40 disabled:pointer-events-none`}>
          <span className="material-icons text-[20px] leading-none">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await backend.adminGetProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  const handleDeleteClick = (id: number) => setDeleteConfirm(id);

  const handleDeleteConfirm = async () => {
    if (deleteConfirm == null) return;
    try {
      await backend.adminDeleteProduct(deleteConfirm);
      setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminProductsTabs />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">
            Sản phẩm
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {loading ? 'Đang tải…' : `${products.length} sản phẩm`}
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
        >
          <span className="material-icons text-[18px]">add</span>
          Thêm mới
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <span className="material-icons text-[20px]">error_outline</span>
          {error}
          <button onClick={fetchProducts} className="ml-auto text-red-600 underline font-semibold">Thử lại</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden animate-pulse">
              <div className="bg-slate-100 h-[220px]" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className="text-center py-20 text-slate-400">
          <span className="material-icons text-5xl mb-3 block">inventory_2</span>
          <p className="font-semibold">Chưa có sản phẩm nào</p>
          <Link to="/admin/products/new" className="mt-4 inline-block text-primary underline text-sm font-semibold">
            Thêm sản phẩm đầu tiên
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} onDelete={handleDeleteClick} />
            ))}
          </div>
          <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-slate-500 text-sm mb-6">
              Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
