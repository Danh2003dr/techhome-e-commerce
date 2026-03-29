import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductListingLayout, { type ProductListingPagination } from '@/components/store/ProductListingLayout';
import type { CategorySubCategory, CategoryTemplateConfig } from './categoryTemplates';

function splitTitleLines(title: string): string[] {
  return title.split('\n').map((s) => s.trim()).filter(Boolean);
}

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
  const hero = (
    <section className="relative h-64 md:h-80 rounded-xl overflow-hidden group">
      <img
        src={template.hero.heroImageUrl}
        alt={template.displayName}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent flex flex-col justify-center px-8 md:px-16">
        <span className="text-primary font-bold tracking-widest text-sm mb-2">{template.hero.kicker}</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {splitTitleLines(template.hero.title).map((line, idx) => (
            <React.Fragment key={line + idx}>
              {line}
              {idx < splitTitleLines(template.hero.title).length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
        <p className="text-slate-300 max-w-md mb-6 hidden md:block">{template.hero.description}</p>
        <div>
          <Link
            to={template.hero.ctaHref}
            className="inline-block bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20"
          >
            {template.hero.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );

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
      hero={hero}
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
