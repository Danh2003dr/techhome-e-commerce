import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApiCategories, useApiProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { findCategoryInGroup, slugGroups } from '@/services/categoryNavigation';
import CategoryPageTemplate from '@/pages/store/category/CategoryPageTemplate';
import { categoryTemplates, type CategoryTemplateKey } from '@/pages/store/category/categoryTemplates';

function resolveTemplateKeyFromParentSlug(parentSlug: string): CategoryTemplateKey {
  const s = parentSlug.trim().toLowerCase();
  if (slugGroups.mobile.some((x) => x === s)) return 'mobile';
  if (slugGroups.accessories.some((x) => x === s)) return 'accessories';
  if (slugGroups.audio.some((x) => x === s)) return 'audio';
  return 'accessories';
}

export default function CategoryDynamicPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: apiCategories } = useApiCategories();
  const normalizedSlug = slug.trim().toLowerCase();

  const selectedCategory = useMemo(() => {
    if (!normalizedSlug) return undefined;
    return apiCategories.find((c) => String(c.slug).trim().toLowerCase() === normalizedSlug);
  }, [apiCategories, normalizedSlug]);

  const parentCategory = useMemo(() => {
    if (selectedCategory) {
      const pid = selectedCategory.parentId != null ? selectedCategory.parentId : selectedCategory.id;
      return apiCategories.find((c) => String(c.id) === String(pid));
    }
    // Fallback for older DB / when selected slug doesn't exist in categories list
    const groupKey = (Object.keys(slugGroups) as Array<keyof typeof slugGroups>).find((k) => {
      const group = slugGroups[k] as readonly string[];
      return group.some((x) => x === normalizedSlug);
    });
    if (!groupKey) return undefined;
    return findCategoryInGroup(apiCategories, slugGroups[groupKey]);
  }, [apiCategories, normalizedSlug, selectedCategory]);

  const templateKey = useMemo(() => {
    const parentSlug = parentCategory?.slug ?? normalizedSlug;
    return resolveTemplateKeyFromParentSlug(parentSlug) ?? 'accessories';
  }, [normalizedSlug, parentCategory?.slug]);

  const template = categoryTemplates[templateKey];
  const ALL_PRODUCTS_VALUE = '__all_products__';
  const templateHasAllProducts = template.subCategories.some((s) => s.label === 'All Products');

  const childrenCategories = useMemo(() => {
    if (!parentCategory) return [];
    return apiCategories.filter((c) => c.parentId != null && String(c.parentId) === String(parentCategory.id));
  }, [apiCategories, parentCategory]);

  const [activeSubValue, setActiveSubValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Initialize active sub when data loads.
    if (childrenCategories.length > 0) {
      if (selectedCategory && selectedCategory.parentId != null) {
        setActiveSubValue(String(selectedCategory.slug));
      } else {
        if (templateHasAllProducts) setActiveSubValue(ALL_PRODUCTS_VALUE);
        else setActiveSubValue(childrenCategories[0]?.slug ? String(childrenCategories[0].slug) : undefined);
      }
      return;
    }

    // No children: let template handle fallback sub selection.
    setActiveSubValue(undefined);
  }, [childrenCategories, selectedCategory]);

  const activeSubCategory = useMemo(() => {
    if (!activeSubValue || activeSubValue === ALL_PRODUCTS_VALUE) return undefined;
    return childrenCategories.find((c) => String(c.slug) === activeSubValue);
  }, [activeSubValue, childrenCategories]);

  const productsCategoryId = useMemo(() => {
    // Priority:
    // 1) selected child category (activeSubCategory)
    // 2) selected category itself (when it is top-level and no children exist yet)
    // 3) parent category
    const rawId =
      activeSubValue === ALL_PRODUCTS_VALUE
        ? parentCategory?.id
        : activeSubCategory
          ? activeSubCategory.id
          : selectedCategory?.id ?? parentCategory?.id;
    const idNum = rawId != null ? Number(rawId) : undefined;
    return Number.isFinite(idNum as number) ? (idNum as number) : undefined;
  }, [ALL_PRODUCTS_VALUE, activeSubCategory, activeSubValue, parentCategory?.id, selectedCategory?.id]);

  const { data: apiProducts } = useApiProducts({
    category: productsCategoryId,
    page: 0,
    size: 100,
  });

  const storefrontProducts =
    isApiConfigured() && productsCategoryId != null ? apiProducts : [];

  const subCategoriesOverride = useMemo(() => {
    if (childrenCategories.length === 0) return [];
    const mapped = childrenCategories.map((c) => ({
      label: c.name,
      icon: c.icon,
      value: String(c.slug),
    }));
    if (!templateHasAllProducts) return mapped;
    return [{ label: 'All Products', icon: 'apps', value: ALL_PRODUCTS_VALUE }, ...mapped];
  }, [childrenCategories]);

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

  return (
    <CategoryPageTemplate
      template={template}
      products={storefrontProducts}
      subCategoriesOverride={subCategoriesOverride}
      activeSubValue={activeSubValue}
      onSubCategoryChange={(v) => {
        const next = String(v).trim();
        if (!next) return setActiveSubValue(next);
        const nextLower = next.toLowerCase();
        const isAll = next === ALL_PRODUCTS_VALUE;
        const targetSlug = isAll ? String(parentCategory?.slug ?? '') : nextLower;
        if (targetSlug && normalizedSlug !== targetSlug.toLowerCase()) {
          navigate(`/category/${encodeURIComponent(targetSlug)}`);
        }
        setActiveSubValue(next);
      }}
    />
  );
}

