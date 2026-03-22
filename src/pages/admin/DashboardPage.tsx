import React from 'react';
import AnalyticsChart from './dashboard/AnalyticsChart';
import CustomerChart from './dashboard/CustomerChart';
import DealsTable from './dashboard/DealsTable';
import FeaturedProduct from './dashboard/FeaturedProduct';
import { dealsRows, kpiStats } from './dashboard/dashboardMockData';
import RevenueChart from './dashboard/RevenueChart';
import SalesChart from './dashboard/SalesChart';
import StatCard from './dashboard/StatCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 text-base max-w-[1600px]">
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance indicators"
      >
        {kpiStats.map((stat) => (
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
