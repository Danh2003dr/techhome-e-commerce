import React from 'react';
import type { StockProduct } from '../productStockMock';
import { formatUsd } from '../productStockMock';
import ColorDots from './ColorDots';

type ProductStockTableProps = {
  rows: StockProduct[];
  onEdit: (p: StockProduct) => void;
  onDelete: (p: StockProduct) => void;
};

const ProductStockTable: React.FC<ProductStockTableProps> = ({ rows, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <th className="py-4 px-4">Ảnh</th>
            <th className="py-4 px-4">Tên sản phẩm</th>
            <th className="py-4 px-4">Danh mục</th>
            <th className="py-4 px-4">Giá</th>
            <th className="py-4 px-4">Số lượng</th>
            <th className="py-4 px-4">Màu có sẵn</th>
            <th className="py-4 px-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
                Không có sản phẩm phù hợp với tìm kiếm.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="text-sm text-slate-900">
                <td className="py-4 px-4">
                  <img
                    src={row.image}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover border border-slate-100 bg-slate-50"
                  />
                </td>
                <td className="py-4 px-4 font-semibold max-w-[200px]">{row.name}</td>
                <td className="py-4 px-4 text-slate-700">{row.category}</td>
                <td className="py-4 px-4 font-medium tabular-nums">{formatUsd(row.price)}</td>
                <td className="py-4 px-4 tabular-nums text-slate-800">{row.piece}</td>
                <td className="py-4 px-4">
                  <ColorDots colors={row.colors} />
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 inline-flex items-center justify-center transition-colors"
                      aria-label="Chỉnh sửa sản phẩm"
                    >
                      <span className="material-icons text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className="w-9 h-9 rounded-lg border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 inline-flex items-center justify-center transition-colors"
                      aria-label="Xóa sản phẩm"
                    >
                      <span className="material-icons text-[18px]">delete_outline</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductStockTable;
