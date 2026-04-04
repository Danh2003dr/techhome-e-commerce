import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductDto } from '@/types/api';
import { formatVND } from '@/utils';

function effectivePrice(p: ProductDto): number {
  const price = Number(p.price) || 0;
  const sale = p.salePrice != null ? Number(p.salePrice) : null;
  if (sale != null && sale > 0 && sale < price) return sale;
  return price;
}

export type FeaturedProductProps = {
  products: ProductDto[];
  loading?: boolean;
};

const FeaturedProduct: React.FC<FeaturedProductProps> = ({ products, loading }) => {
  const [index, setIndex] = useState(0);
  const total = products.length;
  const current = total > 0 ? products[index % total] : null;

  useEffect(() => {
    setIndex(0);
  }, [products]);

  const go = (delta: number) => {
    if (total <= 0) return;
    setIndex((i) => (i + delta + total) % total);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col min-h-[280px] animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="flex-1 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-center min-h-[220px] text-center">
        <h2 className="text-base font-bold text-slate-900 mb-2">Sản phẩm nổi bật</h2>
        <p className="text-sm text-slate-600 mb-4">
          Chưa có sản phẩm được đánh dấu featured trong catalog. Gắn cờ featured khi sửa sản phẩm.
        </p>
        <Link
          to="/admin/products"
          className="inline-flex justify-center text-sm font-semibold text-primary hover:underline"
        >
          Đi tới quản lý sản phẩm
        </Link>
      </div>
    );
  }

  const img = current.image || (current.images && current.images[0]) || '';

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-full min-h-[280px]">
      <h2 className="text-base font-bold text-slate-900 mb-4">Sản phẩm nổi bật</h2>
      <div className="flex flex-1 items-center gap-2 min-h-0">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={total <= 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Sản phẩm trước"
        >
          <span className="material-icons text-[20px]">chevron_left</span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0 gap-3">
          <div className="relative w-full max-w-[220px] aspect-square rounded-xl bg-slate-50 overflow-hidden">
            {img ? (
              <img src={img} alt={current.name} className="h-full w-full object-contain p-4" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">Không có ảnh</div>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 truncate max-w-full">{current.name}</p>
            <p className="mt-1 text-lg font-bold text-primary">{formatVND(effectivePrice(current))}</p>
          </div>
          {total > 1 && (
            <div className="flex gap-1.5" role="tablist" aria-label="Chọn sản phẩm nổi bật">
              {products.map((p, i) => (
                <button
                  key={String(p.id)}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300'
                  }`}
                  aria-label={`Xem slide ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={total <= 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Sản phẩm sau"
        >
          <span className="material-icons text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedProduct;
