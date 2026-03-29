import React, { useMemo } from 'react';
import ProductListingLayout, { type ProductListingPagination } from '@/components/store/ProductListingLayout';
import type { CategorySubCategory, CategoryTemplateConfig } from './categoryTemplates';

export type CategoryPageTemplateProps = {
  template: CategoryTemplateConfig;
  products: unknown[];
  breadcrumbItems: { label: string; path?: string }[];
  pageTitle: string;
  drillBack?: { to: string; label: string };
  listingSurface?: 'plp' | 'hub';
  hubActions?: React.ReactNode;
  aboveProductListing?: React.ReactNode;
  subCategoriesOverride?: CategorySubCategory[];
  activeSubValue?: string;
  onSubCategoryChange?: (value: string) => void;
  /** Optional — maps to API `q` when provided */
  categorySearch?: {
    value: string;
    onChange: (v: string) => void;
    onApply: () => void;
  };
  sortBy: string;
  onSortChange: (v: string) => void;
  resultSummary: string;
  pagination: ProductListingPagination | null;
  loading?: boolean;
  emptyMessage?: string;
};

export default function CategoryPageTemplate({
  template,
  products,
  breadcrumbItems,
  pageTitle,
  drillBack,
  listingSurface = 'plp',
  hubActions,
  aboveProductListing,
  subCategoriesOverride,
  activeSubValue,
  onSubCategoryChange,
  categorySearch,
  sortBy,
  onSortChange,
  resultSummary,
  pagination,
  loading,
  emptyMessage,
}: CategoryPageTemplateProps) {
  const listingChips = useMemo(() => {
    const list = subCategoriesOverride ?? [];
    return list.map((sub) => ({
      label: sub.label,
      icon: sub.icon,
      value: sub.value ?? sub.label,
    }));
  }, [subCategoriesOverride]);

  return (
    <ProductListingLayout
      breadcrumbItems={breadcrumbItems}
      title={pageTitle}
      drillBack={drillBack}
      listingSurface={listingSurface}
      hubActions={hubActions}
      aboveProductListing={aboveProductListing}
      subCategories={listingChips.length > 0 ? listingChips : undefined}
      activeSubValue={activeSubValue}
      onSubCategorySelect={onSubCategoryChange}
      categorySearch={categorySearch}
      sortOptions={template.sortOptions}
      sortBy={sortBy}
      onSortChange={onSortChange}
      resultSummary={resultSummary}
      products={products}
      pagination={pagination}
      loading={loading}
      emptyMessage={emptyMessage}
    />
  );
}
