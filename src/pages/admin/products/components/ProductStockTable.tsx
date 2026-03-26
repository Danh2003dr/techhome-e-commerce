import React from 'react';
import type { StockProduct } from '../productStockMock';
import { formatUsd } from '../productStockMock';
import ColorDots from './ColorDots';
import type { StockActionType } from './ProductStockModal';

type ProductStockTableProps = {
  rows: StockProduct[];
  onAction: (p: StockProduct, action: StockActionType) => void;
};

const ProductStockTable: React.FC<ProductStockTableProps> = ({ rows, onAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full text-left">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <th className="py-4 px-4">Image</th>
            <th className="py-4 px-4">Product Name</th>
            <th className="py-4 px-4">Category</th>
            <th className="py-4 px-4">Price</th>
            <th className="py-4 px-4">Piece</th>
            <th className="py-4 px-4">Available Color</th>
            <th className="py-4 px-4 text-right">Stock Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
                No products match your search.
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
                  <div className="inline-flex items-center gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => onAction(row, 'add')}
                      className="h-8 rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center transition-colors text-xs font-semibold"
                      aria-label="Add stock"
                    >
                      +Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction(row, 'remove')}
                      className="h-8 rounded-lg border border-amber-200 bg-amber-50 px-2 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center transition-colors text-xs font-semibold"
                      aria-label="Remove stock"
                    >
                      -Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction(row, 'reservation')}
                      className="h-8 rounded-lg border border-blue-200 bg-blue-50 px-2 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center transition-colors text-xs font-semibold"
                      aria-label="Reserve stock"
                    >
                      Reserve
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction(row, 'sold')}
                      className="h-8 rounded-lg border border-violet-200 bg-violet-50 px-2 text-violet-700 hover:bg-violet-100 inline-flex items-center justify-center transition-colors text-xs font-semibold"
                      aria-label="Mark sold"
                    >
                      Sold
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
