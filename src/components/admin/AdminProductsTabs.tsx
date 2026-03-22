import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Tab navigation: All Products ↔ Stock (same entry as sidebar "Products").
 * Routes unchanged: `/admin/products`, `/admin/products/stock`.
 */
const AdminProductsTabs: React.FC = () => {
  const { pathname } = useLocation();
  const isStock =
    pathname === '/admin/products/stock' || pathname.startsWith('/admin/products/stock/');
  const isAll = pathname.startsWith('/admin/products') && !isStock;

  const tabClass = (active: boolean) =>
    `inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
      active
        ? 'border-primary text-primary bg-blue-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
    }`;

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Products sections">
      <Link to="/admin/products" className={tabClass(isAll)} role="tab" aria-selected={isAll}>
        All Products
      </Link>
      <Link to="/admin/products/stock" className={tabClass(isStock)} role="tab" aria-selected={isStock}>
        Stock
      </Link>
    </div>
  );
};

export default AdminProductsTabs;
