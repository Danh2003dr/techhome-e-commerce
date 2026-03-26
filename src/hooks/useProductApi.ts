/**
 * Hooks to load categories and products from backend API.
 * When API is not configured or request fails, return empty data so callers can use mock fallback.
 */

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import * as backend from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import {
  mapCategoryDtoToCategory,
  mapProductDtoToTrending,
  mapProductDtoToListing,
  mapProductDtoToProduct,
} from '@/services/productMappers';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';

/** Gom try/catch/finally + set state — giữ nguyên hành vi lỗi/loading như trước. */
async function runApiLoad<T>(
  load: () => Promise<T>,
  ctx: {
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setData: Dispatch<SetStateAction<T>>;
    emptyOnError: T;
    errorLabel: string;
  }
): Promise<void> {
  ctx.setLoading(true);
  ctx.setError(null);
  try {
    ctx.setData(await load());
  } catch (e) {
    ctx.setError(e instanceof Error ? e.message : ctx.errorLabel);
    ctx.setData(ctx.emptyOnError);
  } finally {
    ctx.setLoading(false);
  }
}

export function useApiCategories(): { data: Category[]; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isApiConfigured()) return;
    await runApiLoad(
      async () => (await backend.getCategories()).map(mapCategoryDtoToCategory),
      {
        setLoading,
        setError,
        setData,
        emptyOnError: [],
        errorLabel: 'Failed to load categories',
      }
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiFeaturedProducts(): { data: TrendingProduct[]; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isApiConfigured()) return;
    await runApiLoad(
      async () => (await backend.getFeaturedProducts()).map(mapProductDtoToTrending),
      {
        setLoading,
        setError,
        setData,
        emptyOnError: [],
        errorLabel: 'Failed to load featured products',
      }
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export interface UseApiProductsParams {
  category?: number;
  q?: string;
  page?: number;
  size?: number;
}

export function useApiProducts(params: UseApiProductsParams = {}): {
  data: ListingProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<ListingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { category, q, page = 0, size = 100 } = params;

  const fetchData = useCallback(async () => {
    if (!isApiConfigured()) return;
    await runApiLoad(
      async () => (await backend.getProducts({ category, q, page, size })).map(mapProductDtoToListing),
      {
        setLoading,
        setError,
        setData,
        emptyOnError: [],
        errorLabel: 'Failed to load products',
      }
    );
  }, [category, q, page, size]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiProduct(id: string | undefined): {
  data: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isApiConfigured() || !id) return;
    await runApiLoad(
      async () => mapProductDtoToProduct(await backend.getProduct(id)),
      {
        setLoading,
        setError,
        setData,
        emptyOnError: null,
        errorLabel: 'Failed to load product',
      }
    );
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
