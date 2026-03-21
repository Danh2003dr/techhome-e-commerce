import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 20;

/** Mock data — thay bằng API khi có backend */
type AdminProductCardModel = {
  id: string;
  name: string;
  priceUsd: number;
  /** 0–5 */
  rating: number;
  reviewCount: number;
  images: string[];
  initialFavorite?: boolean;
};

const BASE_MOCK_TEMPLATES: Omit<AdminProductCardModel, 'id' | 'name' | 'reviewCount' | 'priceUsd'>[] = [
  {
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: true,
  },
  {
    rating: 4,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: false,
  },
  {
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: false,
  },
  {
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: true,
  },
  {
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: false,
  },
  {
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1589492477829-5e65395b96cc?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop&auto=format',
    ],
    initialFavorite: false,
  },
];

const PRODUCT_NAME_PREFIXES = [
  'Apple Watch Series 4',
  'Air-Max-270',
  'Minimal Chair Tool',
  'Wireless Earbuds Pro',
  'Desk Lamp Minimal',
  'Smart Speaker Mini',
];

/** ~45 bản ghi demo để thử phân trang (thay bằng tổng từ API) */
const MOCK_PRODUCTS: AdminProductCardModel[] = Array.from({ length: 45 }, (_, i) => {
  const t = BASE_MOCK_TEMPLATES[i % BASE_MOCK_TEMPLATES.length];
  const nameBase = PRODUCT_NAME_PREFIXES[i % PRODUCT_NAME_PREFIXES.length];
  return {
    ...t,
    id: String(i + 1),
    name: `${nameBase} #${i + 1}`,
    priceUsd: 45 + (i % 12) * 10 + (i % 3) * 5,
    reviewCount: 60 + i * 3,
  };
});

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

const ProductCard: React.FC<{ product: AdminProductCardModel }> = ({ product }) => {
  const [slide, setSlide] = useState(0);
  const [favorite, setFavorite] = useState(!!product.initialFavorite);
  const imgs = product.images.length ? product.images : ['https://picsum.photos/400/400'];
  const next = () => setSlide((s) => (s + 1) % imgs.length);
  const prev = () => setSlide((s) => (s - 1 + imgs.length) % imgs.length);

  return (
    <article
      className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#E2EAF8]/50 flex items-center justify-center text-[#626262] hover:bg-[#E2EAF8]/80 transition-colors"
            >
              <span className="material-icons text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#E2EAF8]/50 flex items-center justify-center text-[#626262] hover:bg-[#E2EAF8]/80 transition-colors"
            >
              <span className="material-icons text-xl">chevron_right</span>
            </button>
          </>
        )}
      </div>

      <div className="px-4 pt-4 pb-5 flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => setFavorite((f) => !f)}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shadow-sm hover:bg-slate-100 transition-colors"
          >
            <span className="material-icons text-[22px] text-[#F93C65]">
              {favorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>

        <h2 className="text-[18px] leading-5 font-bold text-[#202224] pr-12 mb-2 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-base font-bold text-[#4880FF] mb-3">{formatUsd(product.priceUsd)}</p>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <StarRow rating={product.rating} />
          <span className="text-sm text-black/40 font-semibold">({product.reviewCount})</span>
        </div>

        <Link
          to={`/admin/products/${product.id}`}
          className="mt-auto w-full text-center py-2 rounded-xl bg-[#E2EAF8]/70 text-[#202224] text-sm font-semibold hover:bg-[#E2EAF8] transition-colors"
        >
          Edit Product
        </Link>
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
  const totalPages = Math.max(1, Math.ceil(MOCK_PRODUCTS.length / PAGE_SIZE));
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return MOCK_PRODUCTS.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">
            Products
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Quản lý danh sách sản phẩm</p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
        >
          <span className="material-icons text-[18px]">add</span>
          Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pageItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default ProductListPage;
