import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductDto } from '@/types/api';

export type LowStockTableProps = {
  products: ProductDto[];
  threshold: number;
  loading?: boolean;
};

const LowStockTable: React.FC<LowStockTableProps> = ({ products, threshold, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-48 bg-slate-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">Cảnh báo tồn kho</h2>
        <p className="text-sm text-slate-600">
          Không có sản phẩm nào dưới {threshold} đơn vị (theo catalog GET /api/products).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm overflow-x-auto">
      <h2 className="text-base font-bold text-slate-900 mb-1">Sản phẩm tồn thấp (&lt; {threshold})</h2>
      <p className="text-xs text-slate-500 mb-4">Nguồn: trường stock trên catalog — không phải từ đơn hàng.</p>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-2 pr-4 font-medium">Sản phẩm</th>
            <th className="py-2 pr-4 font-medium">Tồn</th>
            <th className="py-2 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={String(p.id)} className="border-b border-slate-50 last:border-0">
              <td className="py-2 pr-4 font-medium text-slate-900 max-w-[240px] truncate">{p.name}</td>
              <td className="py-2 pr-4 tabular-nums text-amber-700 font-semibold">{Number(p.stock)}</td>
              <td className="py-2 text-right">
                <Link
                  to={`/admin/products/${encodeURIComponent(String(p.id))}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Sửa
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;
