import React, { useEffect, useState } from 'react';
import AnalyticsChart from './dashboard/AnalyticsChart';
import CustomerChart from './dashboard/CustomerChart';
import DealsTable from './dashboard/DealsTable';
import FeaturedProduct from './dashboard/FeaturedProduct';
import { dealsRows } from './dashboard/dashboardMockData';
import RevenueChart from './dashboard/RevenueChart';
import SalesChart from './dashboard/SalesChart';
import StatCard from './dashboard/StatCard';
import type { KpiStat } from './dashboard/dashboardMockData';
import * as backend from '@/services/backend';

const STAT_TEMPLATES: Omit<KpiStat, 'value' | 'trendLabel' | 'trend'>[] = [
  { id: 'products',   label: 'Sản phẩm',   icon: 'inventory_2',  iconWrapClass: 'bg-amber-100 text-amber-700' },
  { id: 'users',      label: 'Người dùng',  icon: 'person',       iconWrapClass: 'bg-violet-100 text-violet-700' },
  { id: 'orders',     label: 'Đơn hàng',   icon: 'receipt_long', iconWrapClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'categories', label: 'Danh mục',   icon: 'category',     iconWrapClass: 'bg-blue-100 text-blue-700' },
];

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<KpiStat[]>(
    STAT_TEMPLATES.map((t) => ({ ...t, value: '—', trendLabel: 'Đang tải...', trend: 'up' as const }))
  );

  useEffect(() => {
    backend.adminGetStats()
      .then((data) => {
        setStats([
          { ...STAT_TEMPLATES[0], value: data.totalProducts.toLocaleString('vi-VN'),   trendLabel: 'Tổng sản phẩm trong kho', trend: 'up' },
          { ...STAT_TEMPLATES[1], value: data.totalUsers.toLocaleString('vi-VN'),      trendLabel: 'Tổng tài khoản đã đăng ký', trend: 'up' },
          { ...STAT_TEMPLATES[2], value: data.totalOrders.toLocaleString('vi-VN'),     trendLabel: 'Tổng đơn hàng đã đặt', trend: 'up' },
          { ...STAT_TEMPLATES[3], value: data.totalCategories.toLocaleString('vi-VN'), trendLabel: 'Tổng danh mục sản phẩm', trend: 'up' },
        ]);
      })
      .catch(() => {/* giữ trạng thái loading nếu lỗi */});
  }, []);

  return (
    <div className="space-y-6 text-base max-w-[1600px]">
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance indicators"
      >
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="space-y-6" aria-label="Charts">
        <SalesChart />
        <RevenueChart />
      </section>

      <section
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        aria-label="Customers, featured product, and analytics"
      >
        <CustomerChart />
        <FeaturedProduct />
        <AnalyticsChart />
      </section>

      <section aria-label="Recent deals">
        <DealsTable rows={dealsRows} />
      </section>
    </div>
  );
};

export default DashboardPage;
