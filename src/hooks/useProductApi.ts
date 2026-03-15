/**
 * Hooks to load categories and products from backend API.
 * When API is not configured or request fails, return empty data so callers can use mock fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import * as backend from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import {
  mapCategoryDtoToCategory,
  mapProductDtoToTrending,
  mapProductDtoToListing,
  mapProductDtoToProduct,
} from '@/services/productMappers';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';

export function useApiCategories(): { data: Category[]; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isApiConfigured()) return;
    setLoading(true);
    setError(null);
    try {
      const list = await backend.getCategories();
      setData(list.map(mapCategoryDtoToCategory));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
      setData([]);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    setError(null);
    try {
      const list = await backend.getFeaturedProducts();
      setData(list.map(mapProductDtoToTrending));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load featured products');
      setData([]);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    setError(null);
    try {
      const list = await backend.getProducts({ category, q, page, size });
      setData(list.map(mapProductDtoToListing));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
      setData([]);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    setError(null);
    try {
      const dto = await backend.getProduct(id);
      setData(mapProductDtoToProduct(dto));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load product');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
