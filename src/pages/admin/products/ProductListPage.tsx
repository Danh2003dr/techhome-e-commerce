import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminProductsTabs from '@/components/admin/AdminProductsTabs';
import { deleteAdminProduct, getProducts } from '@/services/backend';
import { ApiError, isApiConfigured } from '@/services/api';
import type { ProductDto } from '@/types/api';

const PAGE_SIZE = 10;

type AdminProductCardModel = {
  id: string;
  /** Storefront URL segment; falls back to numeric id */
  slug?: string;
  name: string;
  priceUsd: number;
  /** 0–5 */
  rating: number;
  reviewCount: number;
  images: string[];
};

function mapProductDtoToAdminCardModel(dto: ProductDto): AdminProductCardModel {
  const images = dto.images?.filter(Boolean).length
    ? (dto.images.filter(Boolean) as string[])
    : dto.image
      ? [dto.image]
      : ['https://picsum.photos/400/400'];
  return {
    id: String(dto.id),
    slug: dto.slug,
    name: dto.name,
    priceUsd: Number(dto.salePrice ?? dto.price ?? 0),
    rating: 4,
    reviewCount: 0,
    images,
  };
}

/** Số trang hiển thị dạng 1,2,3,…,10 */
function getPaginationPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 0) return [];
  if (total <= 9) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }
  const pages: (number | 'ellipsis')[] = [];
  pages.push(1);

  let left = Math.max(2, current - 1);
  let right = Math.min(total - 1, current + 1);

  if (current <= 3) {
    left = 2;
    right = 4;
  } else if (current >= total - 2) {
    left = total - 3;
    right = total - 1;
  }

  if (left > 2) pages.push('ellipsis');
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const StarRow: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-icons text-[18px] leading-none ${
            i < full ? 'text-[#FF9500]' : 'text-black/20'
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

const ProductCard: React.FC<{
  product: AdminProductCardModel;
  onSoftDelete: (id: string) => void;
  deletingId: string | null;
}> = ({ product, onSoftDelete, deletingId }) => {
  const deleteBusy = deletingId !== null;
  const thisDeleting = deletingId === product.id;
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const imgs = product.images.length ? product.images : ['https://picsum.photos/400/400'];
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlide((s) => (s + 1) % imgs.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlide((s) => (s - 1 + imgs.length) % imgs.length);
  };

  const goDetail = () =>
    navigate(`/product/${encodeURIComponent(product.slug?.trim() || product.id)}`);

  return (
    <article
      className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col cursor-pointer hover:shadow-[8px_8px_40px_rgba(0,0,0,0.08)] transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goDetail();
        }
      }}
    >
      <div className="relative bg-[#F9F9F9] rounded-t-[14px] min-h-[200px] flex items-center justify-center">
        <img
          src={imgs[slide]}
          alt=""
          className="max-h-[220px] w-auto object-contain px-4 py-6 select-none pointer-events-none"
        />

        {imgs.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#E2EAF8]/50 flex items-center justify-center text-[#626262] hover:bg-[#E2EAF8]/80 transition-colors z-[1]"
            >
              <span className="material-icons text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#E2EAF8]/50 flex items-center justify-center text-[#626262] hover:bg-[#E2EAF8]/80 transition-colors z-[1]"
            >
              <span className="material-icons text-xl">chevron_right</span>
            </button>
          </>
        )}
      </div>

      <div className="px-4 pt-4 pb-5 flex-1 flex flex-col">
        <h2 className="text-[18px] leading-5 font-bold text-[#202224] mb-2 line-clamp-2">{product.name}</h2>
        <p className="text-base font-bold text-[#4880FF] mb-3">{formatUsd(product.priceUsd)}</p>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <StarRow rating={product.rating} />
          <span className="text-sm text-black/40 font-semibold">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex flex-col gap-2 relative z-[1]">
          <Link
            to={`/admin/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-center py-2 rounded-xl bg-[#E2EAF8]/70 text-[#202224] text-sm font-semibold hover:bg-[#E2EAF8] transition-colors"
          >
            Edit Product
          </Link>
          <button
            type="button"
            disabled={deleteBusy}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSoftDelete(product.id);
            }}
            className="w-full text-center py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {thisDeleting ? 'Đang xóa…' : 'Xóa khỏi cửa hàng'}
          </button>
        </div>
      </div>
    </article>
  );
};

const paginationBtnBase =
  'min-w-[36px] h-9 px-2 inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors';
const paginationInactive = `${paginationBtnBase} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`;
const paginationActive = `${paginationBtnBase} border-primary bg-primary text-white font-bold hover:bg-blue-600`;

type PaginationBarProps = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

const PaginationBar: React.FC<PaginationBarProps> = ({ page, totalPages, onPageChange }) => {
  const items = useMemo(() => getPaginationPages(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex w-full justify-center pt-6">
      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang danh sách sản phẩm">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Trang trước"
          className={`${paginationInactive} disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white`}
        >
          <span className="material-icons text-[20px] leading-none">chevron_left</span>
        </button>

        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="min-w-[36px] h-9 inline-flex items-center justify-center text-slate-500 select-none text-sm font-semibold"
              aria-hidden
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Trang ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={item === page ? paginationActive : paginationInactive}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Trang sau"
          className={`${paginationInactive} disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white`}
        >
          <span className="material-icons text-[20px] leading-none">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};

const ProductListPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [apiProducts, setApiProducts] = useState<AdminProductCardModel[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProducts = React.useCallback(() => {
    if (!isApiConfigured()) return;
    setApiLoading(true);
    setApiError(null);
    getProducts({ page: 0, size: 200 })
      .then((list) => {
        setApiProducts(list.map(mapProductDtoToAdminCardModel));
      })
      .catch(() => {
        setApiProducts([]);
        setApiError('Không tải được danh sách sản phẩm từ backend.');
      })
      .finally(() => setApiLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSoftDelete = async (id: string) => {
    if (!isApiConfigured()) return;
    const ok = window.confirm(
      'Sản phẩm sẽ bị ẩn khỏi cửa hàng (xóa mềm trên backend). Khách không còn thấy sản phẩm; dữ liệu vẫn lưu trong hệ thống. Tiếp tục?',
    );
    if (!ok) return;
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteAdminProduct(id);
      loadProducts();
    } catch (e) {
      setDeleteError(
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Không xóa được sản phẩm.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const sourceProducts = useMemo(() => {
    if (!isApiConfigured()) return [];
    return apiProducts;
  }, [apiProducts]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return sourceProducts;
    return sourceProducts.filter((p) => p.name.toLowerCase().includes(debouncedSearch));
  }, [debouncedSearch, sourceProducts]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="space-y-6">
      <AdminProductsTabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">
            Products
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Quản lý danh sách sản phẩm</p>
          {isApiConfigured() && apiLoading && (
            <p className="text-xs text-slate-500 mt-1">Đang tải sản phẩm từ backend...</p>
          )}
          {isApiConfigured() && apiError && !apiLoading && (
            <p className="text-xs text-red-600 mt-1">{apiError}</p>
          )}
          {isApiConfigured() && deleteError && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {deleteError}
            </p>
          )}
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
            Add New
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pageItems.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onSoftDelete={handleSoftDelete}
            deletingId={deletingId}
          />
        ))}
      </div>

      <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default ProductListPage;
