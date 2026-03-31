import { useCallback, useEffect, useState } from 'react';
import {
  getAdminUsers,
  getCategories,
  getProducts,
  getFeaturedProducts,
  getAdminInventories,
  getAdminDashboardSummary,
} from '@/services/backend';
import type { ProductDto, AdminDashboardRecentOrderDto } from '@/types/api';

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
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: AdminDashboardRecentOrderDto[];
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
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [recentOrders, setRecentOrders] = useState<AdminDashboardRecentOrderDto[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductDto[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductDto[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, categories, products, featured, inventories, summary] = await Promise.all([
        getAdminUsers(),
        getCategories(),
        getProducts({}),
        getFeaturedProducts(),
        getAdminInventories(),
        getAdminDashboardSummary(),
      ]);

      const low = products.filter((p) => Number(p.stock) < LOW_STOCK_THRESHOLD);
      setUserCount(users.length);
      setCategoryCount(categories.length);
      setProductCount(products.length);
      setLowStockProductCount(low.length);
      setTotalStockUnits(sum(products, (p) => Math.max(0, Number(p.stock) || 0)));
      setTotalSoldFromInventory(sum(inventories, (i) => Math.max(0, Number(i.soldCount) || 0)));
      setTotalOrders(Math.max(0, Number(summary.totalOrders) || 0));
      setTotalRevenue(Math.max(0, Number(summary.totalRevenue) || 0));
      setOrdersByStatus(summary.ordersByStatus || {});
      setRecentOrders(Array.isArray(summary.recentOrders) ? summary.recentOrders : []);
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
    totalOrders,
    totalRevenue,
    ordersByStatus,
    recentOrders,
    featuredProducts,
    lowStockProducts,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    refetch: load,
  };
}
