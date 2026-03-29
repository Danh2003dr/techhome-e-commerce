import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApiCategories, useApiProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { findCategoryInGroup, slugGroups } from '@/services/categoryNavigation';
import CategoryPageTemplate from '@/pages/store/category/CategoryPageTemplate';
import { categoryTemplates, type CategoryTemplateKey } from '@/pages/store/category/categoryTemplates';
import { storefrontSortLabelToApiSort } from '@/pages/store/listing/plpSortApi';
import type { ProductListingPagination } from '@/components/store/ProductListingLayout';
import type { Category } from '@/types';

const PAGE_SIZE = 12;
/** Giá trị chip “Tất cả” — rollup theo `category` = id danh mục đang xem (slug trong URL) */
const ALL_PRODUCTS_VALUE = '__all_products__';

function resolveTemplateKeyFromParentSlug(parentSlug: string): CategoryTemplateKey {
  const s = parentSlug.trim().toLowerCase();
  if (slugGroups.mobile.some((x) => x === s)) return 'mobile';
  if (slugGroups.accessories.some((x) => x === s)) return 'accessories';
  if (slugGroups.audio.some((x) => x === s)) return 'audio';
  return 'accessories';
}

function resolveCategoryBySlug(apiCategories: Category[], normalizedSlug: string): Category | undefined {
  if (!normalizedSlug) return undefined;
  const bySlug = apiCategories.find((c) => String(c.slug).trim().toLowerCase() === normalizedSlug);
  if (bySlug) return bySlug;
  const groupKey = (Object.keys(slugGroups) as Array<keyof typeof slugGroups>).find((k) => {
    const group = slugGroups[k] as readonly string[];
    return group.some((x) => x === normalizedSlug);
  });
  if (!groupKey) return undefined;
  return findCategoryInGroup(apiCategories, slugGroups[groupKey]);
}

/** Leo lên gốc nhánh (parent_id rỗng) để chọn template hero/sort */
function rootCategoryForTemplate(apiCategories: Category[], leaf: Category | undefined): Category | undefined {
  let n: Category | undefined = leaf;
  const seen = new Set<string>();
  while (n && n.parentId != null && String(n.parentId).trim() !== '') {
    if (seen.has(String(n.id))) break;
    seen.add(String(n.id));
    n = apiCategories.find((c) => String(c.id) === String(n.parentId));
  }
  return n;
}

function categoryAncestorsChain(apiCategories: Category[], leaf: Category | undefined): Category[] {
  if (!leaf) return [];
  const chain: Category[] = [];
  let n: Category | undefined = leaf;
  const guard = new Set<string>();
  while (n && !guard.has(String(n.id))) {
    guard.add(String(n.id));
    chain.push(n);
    const pid = n.parentId;
    if (pid == null || String(pid).trim() === '') break;
    n = apiCategories.find((c) => String(c.id) === String(pid));
  }
  return chain.reverse();
}

/**
 * Drill-down PLP + URL:
 * - `/category/:slug` — slug = danh mục đang xem; mặc định là “tất cả” trong nhánh này.
 * - `GET /products?category=<id slug hiện tại>&page&size&sort` (rollup một cấp con trên backend).
 * - Có danh mục con: hàng chip = [Tất cả sản phẩm | …con]; “Tất cả” active tại slug hiện tại;
 *   bấm con → `/category/{slug-con}`.
 */
export default function CategoryDynamicPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: apiCategories, loading: categoriesLoading } = useApiCategories();
  const normalizedSlug = slug.trim().toLowerCase();

  const selectedCategory = useMemo(
    () => resolveCategoryBySlug(apiCategories, normalizedSlug),
    [apiCategories, normalizedSlug]
  );

  const rootCategory = useMemo(
    () => rootCategoryForTemplate(apiCategories, selectedCategory),
    [apiCategories, selectedCategory]
  );

  const templateKey = useMemo(() => {
    const anchorSlug = rootCategory?.slug ?? normalizedSlug;
    return resolveTemplateKeyFromParentSlug(anchorSlug) ?? 'accessories';
  }, [normalizedSlug, rootCategory?.slug]);

  const template = categoryTemplates[templateKey];

  const directChildren = useMemo(() => {
    if (!selectedCategory) return [];
    return apiCategories.filter((c) => c.parentId != null && String(c.parentId) === String(selectedCategory.id));
  }, [apiCategories, selectedCategory]);

  const parentCategory = useMemo(() => {
    if (!selectedCategory) return undefined;
    const pid = selectedCategory.parentId;
    if (pid == null || String(pid).trim() === '') return undefined;
    return apiCategories.find((c) => String(c.id) === String(pid));
  }, [selectedCategory, apiCategories]);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(template.defaultSortBy);

  useEffect(() => {
    setSortBy(template.defaultSortBy);
  }, [template.defaultSortBy, template.key]);

  const productsCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined;
    const n = Number(selectedCategory.id);
    return Number.isFinite(n) ? n : undefined;
  }, [selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [productsCategoryId]);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const apiOn = isApiConfigured();
  const plpEnabled = apiOn && productsCategoryId != null;
  const apiSort = storefrontSortLabelToApiSort(sortBy);

  const { data: apiProducts, loading: productsLoading } = useApiProducts({
    category: productsCategoryId,
    page: page - 1,
    size: PAGE_SIZE,
    sort: apiSort,
    enabled: plpEnabled,
  });

  const sortedProducts = useMemo(
    () => apiProducts.map((p) => ({ ...p, category: template.displayName })),
    [apiProducts, template.displayName]
  );

  const subCategoriesOverride = useMemo(() => {
    if (directChildren.length === 0) return [];
    return [
      { label: 'Tất cả sản phẩm', icon: 'apps', value: ALL_PRODUCTS_VALUE },
      ...directChildren.map((c) => ({
        label: c.name,
        icon: c.icon ?? 'category',
        value: String(c.slug),
      })),
    ];
  }, [directChildren]);

  const breadcrumbItems = useMemo(() => {
    const chain = categoryAncestorsChain(apiCategories, selectedCategory);
    if (chain.length === 0) {
      return [
        { label: template.breadcrumbHomeLabel, path: '/' },
        { label: template.breadcrumbIntermediateLabel, path: '/search' },
        { label: template.breadcrumbCurrentLabel },
      ];
    }
    const mid = chain.slice(0, -1).map((c) => ({
      label: c.name,
      path: `/category/${encodeURIComponent(c.slug)}`,
    }));
    const current = chain[chain.length - 1];
    return [
      { label: template.breadcrumbHomeLabel, path: '/' },
      { label: template.breadcrumbIntermediateLabel, path: '/search' },
      ...mid,
      { label: current.name },
    ];
  }, [
    apiCategories,
    selectedCategory,
    template.breadcrumbHomeLabel,
    template.breadcrumbIntermediateLabel,
    template.breadcrumbCurrentLabel,
  ]);

  const pageTitle = selectedCategory?.name ?? template.breadcrumbCurrentLabel;

  const resultSummary = useMemo(() => {
    if (!plpEnabled) return 'Không tải được danh sách sản phẩm.';
    if (sortedProducts.length === 0 && !productsLoading) return 'Không có sản phẩm trên trang này.';
    const start = sortedProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end = (page - 1) * PAGE_SIZE + sortedProducts.length;
    return `Hiển thị ${start}–${end} · Trang ${page}`;
  }, [plpEnabled, sortedProducts.length, page, productsLoading]);

  const pagination: ProductListingPagination = {
    variant: 'unknownTotal',
    page,
    pageSize: PAGE_SIZE,
    itemCount: sortedProducts.length,
    onPageChange: setPage,
  };

  const drillBack =
    parentCategory != null
      ? {
          to: `/category/${encodeURIComponent(parentCategory.slug)}`,
          label: `Quay lại ${parentCategory.name}`,
        }
      : undefined;

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-slate-600">
          Category not supported.{' '}
          <Link to="/" className="text-primary hover:underline">
            Back home
          </Link>
        </p>
      </div>
    );
  }

  if (categoriesLoading && apiCategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-600 dark:text-slate-400">
        Đang tải danh mục…
      </div>
    );
  }

  if (!apiOn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-600 dark:text-slate-400">
        <p>Kết nối API để xem danh mục (cấu hình VITE_API_URL).</p>
        <Link to="/search" className="text-primary hover:underline mt-3 inline-block">
          Mua theo danh mục
        </Link>
      </div>
    );
  }

  if (!categoriesLoading && apiCategories.length > 0 && !selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-slate-600 dark:text-slate-400">
          Không tìm thấy danh mục.{' '}
          <Link to="/search" className="text-primary hover:underline">
            Mua theo danh mục
          </Link>
        </p>
      </div>
    );
  }

  return (
    <CategoryPageTemplate
      template={template}
      products={plpEnabled ? sortedProducts : []}
      breadcrumbItems={breadcrumbItems}
      pageTitle={pageTitle}
      drillBack={drillBack}
      subCategoriesOverride={subCategoriesOverride.length > 0 ? subCategoriesOverride : undefined}
      activeSubValue={directChildren.length > 0 ? ALL_PRODUCTS_VALUE : undefined}
      onSubCategoryChange={(value) => {
        const next = String(value).trim();
        if (!next) return;
        if (next === ALL_PRODUCTS_VALUE) {
          if (!selectedCategory) return;
          navigate(`/category/${encodeURIComponent(selectedCategory.slug)}`, { replace: true });
          return;
        }
        navigate(`/category/${encodeURIComponent(next)}`);
      }}
      sortBy={sortBy}
      onSortChange={setSortBy}
      resultSummary={resultSummary}
      pagination={plpEnabled ? pagination : null}
      loading={plpEnabled && productsLoading}
      emptyMessage={
        plpEnabled ? undefined : apiOn ? 'Không có dữ liệu sản phẩm.' : 'Kết nối API để xem danh sách sản phẩm.'
      }
    />
  );
}
