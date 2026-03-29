import { useCallback, useEffect, useState } from 'react';
import {
  getAdminUsers,
  getCategories,
  getProducts,
  getFeaturedProducts,
  getAdminInventories,
} from '@/services/backend';
import type { ProductDto } from '@/types/api';

const LOW_STOCK_THRESHOLD = 5;

export type AdminDashboardMetricsState = {
  loading: boolean;
  error: string | null;
  userCount: number;
  productCount: number;
  categoryCount: number;
  lowStockProductCount: number;
  totalStockUnits: number;
  totalSoldFromInventory: number;
  featuredProducts: ProductDto[];
  lowStockProducts: ProductDto[];
  lowStockThreshold: number;
  refetch: () => void;
};

function sum<T>(arr: T[], pick: (x: T) => number): number {
  return arr.reduce((acc, x) => acc + pick(x), 0);
}

export function useAdminDashboardMetrics(): AdminDashboardMetricsState {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [lowStockProductCount, setLowStockProductCount] = useState(0);
  const [totalStockUnits, setTotalStockUnits] = useState(0);
  const [totalSoldFromInventory, setTotalSoldFromInventory] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<ProductDto[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductDto[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, categories, products, featured, inventories] = await Promise.all([
        getAdminUsers(),
        getCategories(),
        getProducts({}),
        getFeaturedProducts(),
        getAdminInventories(),
      ]);

      const low = products.filter((p) => Number(p.stock) < LOW_STOCK_THRESHOLD);
      setUserCount(users.length);
      setCategoryCount(categories.length);
      setProductCount(products.length);
      setLowStockProductCount(low.length);
      setTotalStockUnits(sum(products, (p) => Math.max(0, Number(p.stock) || 0)));
      setTotalSoldFromInventory(sum(inventories, (i) => Math.max(0, Number(i.soldCount) || 0)));
      setFeaturedProducts(featured);
      setLowStockProducts(low.slice(0, 12));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Không tải được dữ liệu dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    loading,
    error,
    userCount,
    productCount,
    categoryCount,
    lowStockProductCount,
    totalStockUnits,
    totalSoldFromInventory,
    featuredProducts,
    lowStockProducts,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    refetch: load,
  };
}
