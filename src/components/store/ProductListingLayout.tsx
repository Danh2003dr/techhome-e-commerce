import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/store/Breadcrumbs';
import ProductCard from '@/features/products/components/ProductCard';
import type { Product } from '@/types';

export type BreadcrumbNavItem = { label: string; path?: string };

export type ListingSubCategoryChip = {
  label: string;
  icon: string;
  value: string;
};

export type ProductListingPagination =
  | {
      variant: 'exact';
      page: number;
      totalPages: number;
      onPageChange: (page: number) => void;
    }
  | {
      variant: 'unknownTotal';
      page: number;
      pageSize: number;
      itemCount: number;
      onPageChange: (page: number) => void;
    };

export type CategorySearchFieldProps = {
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
  placeholder?: string;
};

export type ProductListingLayoutProps = {
  breadcrumbItems: BreadcrumbNavItem[];
  title: string;
  /** Drill-down: quay lại danh mục cha */
  drillBack?: { to: string; label: string };
  /**
   * `hub` = chỉ chọn nhánh (ẩn sort + lưới SP); `plp` = danh sách sản phẩm đầy đủ.
   * Mặc định `plp` để các trang khác không đổi hành vi.
   */
  listingSurface?: 'plp' | 'hub';
  /** Vùng tùy chọn dưới hàng chip (vd. link “Xem tất cả ?all=1”) */
  hubActions?: React.ReactNode;
  /** Chỉ PLP: nội dung phía trên khối sort + lưới (vd. gỡ `?all=1`) */
  aboveProductListing?: React.ReactNode;
  subCategories?: ListingSubCategoryChip[];
  activeSubValue?: string;
  onSubCategorySelect?: (value: string) => void;
  categorySearch?: CategorySearchFieldProps;
  sortOptions: { value: string; label: string }[];
  sortBy: string;
  onSortChange: (value: string) => void;
  /** Short note under the sort control (e.g. server vs client behavior). */
  sortScopeNote?: string;
  resultSummary: string;
  products: unknown[];
  /** null = hide pager (e.g. listing disabled) */
  pagination: ProductListingPagination | null;
  loading?: boolean;
  emptyMessage?: string;
};

const DEFAULT_SORT_NOTE =
  'Thứ tự hiển thị do server áp dụng trên toàn bộ kết quả lọc (theo từng trang phân trang).';

function PaginationBar({ pagination }: { pagination: ProductListingPagination }) {
  if (pagination.variant === 'exact') {
    const { page, totalPages, onPageChange } = pagination;
    const firstPages = Math.min(3, totalPages);
    const showEllipsis = totalPages > 3;
    const lastPage = totalPages;

    return (
      <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-icons">chevron_left</span>
        </button>

        {Array.from({ length: firstPages }).map((_, idx) => {
          const n = idx + 1;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                page === n
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {n}
            </button>
          );
        })}

        {showEllipsis && <span className="px-2 text-slate-400">...</span>}

        {totalPages > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(lastPage)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
              page === lastPage
                ? 'bg-primary text-white'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {lastPage}
          </button>
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    );
  }

  const { page, pageSize, itemCount, onPageChange } = pagination;
  const canPrev = page > 1;
  const canNext = itemCount === pageSize && itemCount > 0;

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-[5rem] text-center">Trang {page}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      {!canNext && itemCount > 0 && (
        <span className="text-xs text-slate-500">Đã đến trang cuối (theo kết quả API).</span>
      )}
    </div>
  );
}

const ProductListingLayout: React.FC<ProductListingLayoutProps> = ({
  breadcrumbItems,
  title,
  drillBack,
  listingSurface = 'plp',
  hubActions,
  aboveProductListing,
  subCategories = [],
  activeSubValue,
  onSubCategorySelect,
  categorySearch,
  sortOptions,
  sortBy,
  onSortChange,
  sortScopeNote = DEFAULT_SORT_NOTE,
  resultSummary,
  products,
  pagination,
  loading,
  emptyMessage = 'Không có sản phẩm phù hợp.',
}) => {
  const isHub = listingSurface === 'hub';
  const showSubCategoryRow =
    subCategories.length > 0 &&
    onSubCategorySelect &&
    (isHub || activeSubValue !== undefined);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </header>

      {drillBack && (
        <div className="mb-4">
          <Link
            to={drillBack.to}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/90 hover:underline"
          >
            <span className="material-icons text-lg leading-none">arrow_back</span>
            {drillBack.label}
          </Link>
        </div>
      )}

      {showSubCategoryRow && (
        <section
          className="mb-8 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center gap-3 min-w-max">
            {subCategories.map((sub) => {
              const subValue = sub.value;
              const isActive = !isHub && activeSubValue === subValue;
              return (
                <button
                  key={subValue}
                  type="button"
                  onClick={() => onSubCategorySelect!(subValue)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl w-36 shadow-sm transition-all flex-shrink-0 border-2 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-primary'
                      : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="material-icons text-xl">{sub.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {isHub && hubActions ? <div className="mb-8">{hubActions}</div> : null}

      {categorySearch && (
        <form
          className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            categorySearch.onApply();
          }}
        >
          <div className="flex-1 min-w-0">
            <label htmlFor="plp-category-q" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Tìm trong danh mục
            </label>
            <input
              id="plp-category-q"
              type="search"
              value={categorySearch.value}
              onChange={(e) => categorySearch.onChange(e.target.value)}
              placeholder={categorySearch.placeholder ?? 'Nhập tên sản phẩm…'}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-primary text-white text-sm font-semibold px-5 py-2 hover:bg-primary/90 transition-colors"
          >
            Tìm
          </button>
        </form>
      )}

      {!isHub && (
        <>
          {aboveProductListing ? <div className="mb-4">{aboveProductListing}</div> : null}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{resultSummary}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">{sortScopeNote}</p>
            </div>
            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex items-center gap-2">
                <label htmlFor="plp-sort" className="text-sm text-slate-500 whitespace-nowrap">
                  Sắp xếp:
                </label>
                <select
                  id="plp-sort"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 focus:ring-primary focus:border-primary min-w-[11rem]"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500 py-12 text-center">Đang tải sản phẩm…</p>
          ) : products.length === 0 ? (
            <p className="text-slate-500 py-12 text-center">{emptyMessage}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={String((product as { id: unknown }).id)} product={product as Product} />
                ))}
              </div>
              {pagination && <PaginationBar pagination={pagination} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListingLayout;
