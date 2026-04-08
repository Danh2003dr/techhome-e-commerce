import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiFeaturedProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils';
import type { TrendingProduct as TrendingProductType } from '@/types';
import { productRequiresDetailForAddToCart } from '@/utils/productVariantChoice';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

function TrendingCard({ product, imageError, onImageError }: { product: TrendingProductType; imageError: boolean; onImageError: () => void }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const pathSegment = product.slug?.trim() || product.productDetailId || product.id;
  const to = `/product/${encodeURIComponent(pathSegment)}`;
  const productId = product.productDetailId ?? product.id;
  const imgSrc = imageError || !product.image ? PLACEHOLDER_IMAGE : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productRequiresDetailForAddToCart(product)) {
      navigate(to);
      return;
    }
    try {
      addItem({ productId, name: product.name, price: product.price, image: product.image || '' });
    } catch (_) {}
  };

  return (
    <Link
      to={to}
      className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col group relative z-10"
    >
      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-full transition-transform group-hover:scale-110 object-contain"
          onError={onImageError}
        />
        {product.discountPercent != null && product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded z-20">
            −{product.discountPercent}%
          </span>
        )}
        {product.isBestSeller && (
          <span
            className={`absolute left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded z-20 ${
              product.discountPercent != null && product.discountPercent > 0 ? 'top-10' : 'top-2'
            }`}
          >
            BÁN CHẠY
          </span>
        )}
      </div>
      <div className="flex-grow">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
        <h4 className="font-bold text-slate-900 dark:text-white mt-1 mb-2 line-clamp-2">{product.name}</h4>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="block text-2xl font-black text-slate-900 dark:text-white">
            {formatVND(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatVND(product.oldPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors z-20"
          onClick={handleAddToCart}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="material-icons">add_shopping_cart</span>
        </button>
      </div>
    </Link>
  );
}

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new');
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const { data: apiFeaturedProducts } = useApiFeaturedProducts();

  const markImageError = (id: string) => setFailedImageIds((prev) => new Set(prev).add(id));

  const trendingProducts = useMemo(() => {
    if (!isApiConfigured()) return [];
    return apiFeaturedProducts.slice(0, 12);
  }, [apiFeaturedProducts]);
  const isUsingApiProducts = isApiConfigured();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10 md:mb-12" aria-labelledby="home-intro-heading">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 shadow-sm">
            <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-3">TechHome</p>
            <h1 id="home-intro-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
              Công nghệ cho từng ngày
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-6 text-sm md:text-base leading-relaxed">
              Khám phá điện thoại, phụ kiện và âm thanh — giao nhanh, giá minh bạch.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/category/dien-thoai"
                className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
              >
                Xem điện thoại
                <span className="material-icons text-base">arrow_forward</span>
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-semibold py-2.5 px-5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                Ưu đãi
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Featured Products</h3>
            </div>
            <Link to="/category/dien-thoai" className="text-primary font-bold hover:underline flex items-center gap-1">
              View All <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors ${
                activeTab === 'new'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              New Arrival
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors ${
                activeTab === 'bestseller'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bestseller
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors ${
                activeTab === 'featured'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Featured Products
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts
              .filter((product) => {
                if (activeTab === 'new') {
                  if (isUsingApiProducts) return true;
                  return product.tag === 'New Release' || !product.isBestSeller;
                } else if (activeTab === 'bestseller') {
                  return product.isBestSeller === true;
                } else {
                  return true;
                }
              })
              .map((product) => (
                <React.Fragment key={product.id}>
                  <TrendingCard
                    product={product}
                    imageError={failedImageIds.has(product.id)}
                    onImageError={() => markImageError(product.id)}
                  />
                </React.Fragment>
              ))}
          </div>
        </section>

        {/* Discounts Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Discounts up to -50%</h3>
              <p className="text-slate-500">Limited time offers on selected products</p>
            </div>
            <Link to="/deals" className="text-primary font-bold hover:underline flex items-center gap-1">
              View All <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts
              .filter((product) => product.oldPrice && product.oldPrice > product.price)
              .slice(0, 4)
              .map((product) => (
                <React.Fragment key={product.id}>
                  <TrendingCard
                    product={product}
                    imageError={failedImageIds.has(product.id)}
                    onImageError={() => markImageError(product.id)}
                  />
                </React.Fragment>
              ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default HomePage;
