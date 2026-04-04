import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Điều hướng khu vực sản phẩm admin — tồn kho xem/chỉnh trên từng thẻ sản phẩm (ảnh + Edit).
 */
const AdminProductsTabs: React.FC = () => {
  const { pathname } = useLocation();
  const inProducts = pathname.startsWith('/admin/products');

  const tabClass = (active: boolean) =>
    `inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
      active
        ? 'border-primary text-primary bg-blue-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
    }`;

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Mục sản phẩm">
      <Link to="/admin/products" className={tabClass(inProducts)} role="tab" aria-selected={inProducts}>
        Tất cả sản phẩm
      </Link>
    </div>
  );
};

export default AdminProductsTabs;
