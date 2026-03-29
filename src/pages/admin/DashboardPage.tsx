import React, { useMemo } from 'react';
import DashboardFutureMetricsScaffold from './dashboard/DashboardFutureMetricsScaffold';
import FeaturedProduct from './dashboard/FeaturedProduct';
import LowStockTable from './dashboard/LowStockTable';
import StatCard from './dashboard/StatCard';
import type { DashboardStat } from './dashboard/dashboardTypes';
import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

function formatInt(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n));
}

function StatGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
          <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-full bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

const DashboardPage: React.FC = () => {
  const {
    loading,
    error,
    refetch,
    userCount,
    productCount,
    categoryCount,
    lowStockProductCount,
    totalStockUnits,
    totalSoldFromInventory,
    featuredProducts,
    lowStockProducts,
    lowStockThreshold,
  } = useAdminDashboardMetrics();

  const stats: DashboardStat[] = useMemo(
    () => [
      {
        id: 'users',
        label: 'Người dùng',
        value: formatInt(userCount),
        subtitle: 'GET /api/users (admin)',
        icon: 'person',
        iconWrapClass: 'bg-violet-100 text-violet-700',
      },
      {
        id: 'products',
        label: 'Sản phẩm (catalog)',
        value: formatInt(productCount),
        subtitle: 'GET /api/products — toàn bộ khi không phân trang',
        icon: 'inventory_2',
        iconWrapClass: 'bg-amber-100 text-amber-700',
      },
      {
        id: 'categories',
        label: 'Danh mục',
        value: formatInt(categoryCount),
        subtitle: 'GET /api/categories',
        icon: 'category',
        iconWrapClass: 'bg-sky-100 text-sky-700',
      },
      {
        id: 'low-stock',
        label: 'SKU tồn thấp',
        value: formatInt(lowStockProductCount),
        subtitle: `Số SP có stock < ${lowStockThreshold} (theo catalog)`,
        icon: 'warning',
        iconWrapClass: 'bg-orange-100 text-orange-700',
      },
      {
        id: 'stock-units',
        label: 'Tổng đơn vị tồn',
        value: formatInt(totalStockUnits),
        subtitle: 'Tổng trường stock trên sản phẩm',
        icon: 'warehouse',
        iconWrapClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        id: 'sold-inv',
        label: 'Đã bán (ghi nhận kho)',
        value: formatInt(totalSoldFromInventory),
        subtitle: 'Tổng soldCount từ GET /api/inventories',
        icon: 'point_of_sale',
        iconWrapClass: 'bg-teal-100 text-teal-800',
      },
    ],
    [
      userCount,
      productCount,
      categoryCount,
      lowStockProductCount,
      totalStockUnits,
      totalSoldFromInventory,
      lowStockThreshold,
    ]
  );

  return (
    <div className="space-y-8 text-base max-w-[1600px]">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Số liệu đồng bộ với backend hiện tại; phần doanh thu/đơn hàng toàn hệ thống nằm dưới khung dự phòng.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
        >
          <span className="material-icons text-lg leading-none">refresh</span>
          Làm mới
        </button>
      </header>

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      <section aria-label="Chỉ số từ API catalog, users, inventories">
        {loading ? <StatGridSkeleton /> : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        )}
      </section>

      <section
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        aria-label="Sản phẩm nổi bật và tồn thấp"
      >
        <FeaturedProduct products={featuredProducts} loading={loading} />
        <LowStockTable
          products={lowStockProducts}
          threshold={lowStockThreshold}
          loading={loading}
        />
      </section>

      <DashboardFutureMetricsScaffold />
    </div>
  );
};

export default DashboardPage;
