import React, { useState } from 'react';
import { featuredProducts } from './dashboardMockData';

const FeaturedProduct: React.FC = () => {
  const [index, setIndex] = useState(0);
  const total = featuredProducts.length;
  const current = featuredProducts[index];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + total) % total);
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-full min-h-[280px]">
      <h2 className="text-base font-bold text-slate-900 mb-4">Featured Product</h2>
      <div className="flex flex-1 items-center gap-2 min-h-0">
        <button
          type="button"
          onClick={() => go(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          aria-label="Previous product"
        >
          <span className="material-icons text-[20px]">chevron_left</span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0 gap-3">
          <div className="relative w-full max-w-[220px] aspect-square rounded-xl bg-slate-50 overflow-hidden">
            <img
              src={current.imageUrl}
              alt={current.name}
              className="h-full w-full object-contain p-4"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900 truncate max-w-full">{current.name}</p>
            <p className="mt-1 text-lg font-bold text-primary">${current.priceUsd.toFixed(2)}</p>
          </div>
          <div className="flex gap-1.5" role="tablist" aria-label="Product slides">
            {featuredProducts.map((_, i) => (
              <button
                key={featuredProducts[i].id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          aria-label="Next product"
        >
          <span className="material-icons text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedProduct;
