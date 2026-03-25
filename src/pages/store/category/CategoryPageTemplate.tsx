import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';
import type { CategoryFilterSection, CategorySubCategory, CategoryTemplateConfig } from './categoryTemplates';

const PAGE_SIZE = 12;

function toNumberMaybe(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(String(v));
  return Number.isFinite(n) ? n : null;
}

function splitTitleLines(title: string): string[] {
  return title.split('\n').map((s) => s.trim()).filter(Boolean);
}

function sortProducts(products: any[], sortBy: string): any[] {
  const indexed = products.map((p, i) => ({ p, i }));

  indexed.sort((a, b) => {
    const ap = toNumberMaybe(a.p?.price) ?? 0;
    const bp = toNumberMaybe(b.p?.price) ?? 0;
    if (sortBy === 'Price: Low to High') return ap - bp;
    if (sortBy === 'Price: High to Low') return bp - ap;
    if (sortBy === 'Most Popular') {
      const ar = toNumberMaybe(a.p?.rating) ?? 0;
      const br = toNumberMaybe(b.p?.rating) ?? 0;
      if (br !== ar) return br - ar;
      return a.i - b.i;
    }

    // Newest Arrivals: try numeric id desc; fall back to stable order.
    if (sortBy === 'Newest Arrivals') {
      const aid = toNumberMaybe(a.p?.id);
      const bid = toNumberMaybe(b.p?.id);
      if (aid != null && bid != null && aid !== bid) return bid - aid;
    }

    return a.i - b.i;
  });

  return indexed.map((x) => x.p);
}

function FilterSectionView({
  section,
  filterValues,
  setFilterValue,
  index,
}: {
  section: CategoryFilterSection;
  filterValues: Record<string, string | null>;
  setFilterValue: (id: string, value: string | null) => void;
  index: number;
}) {
  const isFirst = index === 0;

  if (section.type === 'checkbox') {
    return (
      <div className={`${isFirst ? '': 'pt-6 border-t border-slate-200 dark:border-slate-800'}`}>
        <h3
          className={
            isFirst
              ? 'font-bold text-lg mb-4 flex items-center justify-between'
              : 'font-bold text-lg mb-4'
          }
        >
          <span>{section.title}</span>
          {isFirst && <span className="material-icons text-slate-400">expand_more</span>}
        </h3>
        <div className="space-y-3">
          {section.options.map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={opt.defaultChecked ?? false}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span
                className={`text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors ${
                  opt.defaultChecked ? 'font-medium' : ''
                }`}
              >
                {opt.label}
              </span>
              {opt.rightText && <span className="text-xs text-slate-400 ml-auto">{opt.rightText}</span>}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'swatches') {
    return (
      <div className={`${isFirst ? '' : 'pt-6 border-t border-slate-200 dark:border-slate-800'}`}>
        <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
          <span>{section.title}</span>
          {isFirst && <span className="material-icons text-slate-400">expand_more</span>}
        </h3>
        <div className="flex flex-wrap gap-3">
          {section.swatches.map((c, i) => (
            <button key={i} type="button" className={`w-8 h-8 rounded-full ${c.bgClass} ${c.ringClass ?? ''}`} />
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'range') {
    return (
      <div className={`${isFirst ? '' : 'pt-6 border-t border-slate-200 dark:border-slate-800'}`}>
        <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
          <span>{section.title}</span>
          {isFirst && <span className="material-icons text-slate-400">expand_more</span>}
        </h3>
        <div className="space-y-4">
          <input
            type="range"
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            min={0}
            max={100}
            defaultValue={50}
          />
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{section.minLabel}</span>
            <span>{section.maxLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === 'toggle') {
    const value = filterValues[section.id] ?? section.initialValue ?? null;
    return (
      <div className={`${isFirst ? '' : 'pt-6 border-t border-slate-200 dark:border-slate-800'}`}>
        <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
          <span>{section.title}</span>
          {isFirst && <span className="material-icons text-slate-400">expand_more</span>}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {section.options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setFilterValue(section.id, active ? null : opt)}
                className={`px-2 py-2 text-xs rounded transition-all ${
                  active
                    ? 'border border-primary text-primary bg-primary/5 font-bold'
                    : 'border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // radio
  const value = filterValues[section.id] ?? section.initialValue ?? null;
  return (
    <div className={`${isFirst ? '' : 'pt-6 border-t border-slate-200 dark:border-slate-800'}`}>
      <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
        <span>{section.title}</span>
        {isFirst && <span className="material-icons text-slate-400">expand_more</span>}
      </h3>
      <div className="space-y-3">
        {section.options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name={section.id}
              checked={value === opt}
              onChange={() => setFilterValue(section.id, opt)}
              className="text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300"
            />
            <span className="text-sm group-hover:text-primary">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPageTemplate({
  template,
  products,
  subCategoriesOverride,
  activeSubValue,
  onSubCategoryChange,
}: {
  template: CategoryTemplateConfig;
  products: any[];
  subCategoriesOverride?: CategorySubCategory[];
  /** Controlled active sub-category value */
  activeSubValue?: string;
  /** Controlled callback when user clicks a sub-category */
  onSubCategoryChange?: (value: string) => void;
}) {
  const effectiveSubCategories = subCategoriesOverride ?? template.subCategories;
  const firstSubValue =
    effectiveSubCategories[0]?.value ?? effectiveSubCategories[0]?.label ?? template.subCategories[0]?.label ?? '';

  const isControlled = activeSubValue !== undefined && typeof onSubCategoryChange === 'function';
  const [internalActiveSubValue, setInternalActiveSubValue] = useState<string>(firstSubValue);

  useEffect(() => {
    if (!isControlled) {
      setInternalActiveSubValue(firstSubValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstSubValue, isControlled]);

  const activeSub = isControlled ? (activeSubValue as string) : internalActiveSubValue;
  const [sortBy, setSortBy] = useState(template.defaultSortBy);
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string | null>>({});

  const setFilterValue = (id: string, value: string | null) => {
    setFilterValues((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    setSortBy(template.defaultSortBy);
    setPage(1);

    // Initialize toggle/radio selections.
    const initial: Record<string, string | null> = {};
    for (const section of template.filters) {
      if ((section.type === 'toggle' || section.type === 'radio') && section.initialValue !== undefined) {
        initial[section.id] = section.initialValue ?? null;
      }
    }
    setFilterValues(initial);
  }, [template]);

  const normalizedProducts = useMemo(() => {
    return products.map((p) => ({
      category: (p as any).category ?? template.displayName,
      ...p,
    }));
  }, [products, template.displayName]);

  const sortedProducts = useMemo(() => sortProducts(normalizedProducts, sortBy), [normalizedProducts, sortBy]);

  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    // Keep UX predictable: changing sort brings user to first page.
    setPage(1);
  }, [sortBy]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalProducts);
  const visibleProducts = sortedProducts.slice(startIndex, endIndex);

  const showingStart = totalProducts === 0 ? 0 : startIndex + 1;
  const showingEnd = totalProducts === 0 ? 0 : endIndex;

  const firstPages = Math.min(3, totalPages);
  const showEllipsis = totalPages > 3;
  const lastPage = totalPages;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-primary">
          {template.breadcrumbHomeLabel}
        </Link>
        <span className="material-icons text-xs">chevron_right</span>
        <Link to="/search" className="hover:text-primary">
          {template.breadcrumbIntermediateLabel}
        </Link>
        <span className="material-icons text-xs">chevron_right</span>
        <span className="text-primary font-medium">{template.breadcrumbCurrentLabel}</span>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-10 group">
        <img
          src={template.hero.heroImageUrl}
          alt={template.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent flex flex-col justify-center px-8 md:px-16">
          <span className="text-primary font-bold tracking-widest text-sm mb-2">{template.hero.kicker}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {splitTitleLines(template.hero.title).map((line, idx) => (
              <React.Fragment key={line + idx}>
                {line}
                {idx < splitTitleLines(template.hero.title).length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
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

      {/* Sub-Category Icons Bar */}
      {effectiveSubCategories.length > 0 && (
        <section
          className="mb-12 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center gap-4 min-w-max">
            {effectiveSubCategories.map((sub) => {
              const subValue = sub.value ?? sub.label;
              const isActive = activeSub === subValue;
              return (
                <button
                  key={subValue}
                  type="button"
                  onClick={() => {
                    if (isControlled) onSubCategoryChange?.(subValue);
                    else setInternalActiveSubValue(subValue);
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl w-40 shadow-sm transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-2 border-primary'
                      : 'bg-white dark:bg-slate-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="material-icons">{sub.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-center">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {template.filters.map((section, idx) => (
            <FilterSectionView
              key={section.id}
              section={section}
              filterValues={filterValues}
              setFilterValue={setFilterValue}
              index={idx}
            />
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <p className="text-slate-500 font-medium">
              Showing {showingStart}-{showingEnd} of {totalProducts} products
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
              >
                {template.sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">chevron_left</span>
            </button>

            {Array.from({ length: firstPages }).map((_, idx) => {
              const n = idx + 1;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
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

            {showEllipsis && <span className="px-2">...</span>}

            <button
              type="button"
              onClick={() => setPage(lastPage)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                page === lastPage
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lastPage}
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

