import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { banners as fallbackBanners } from '@/data';
import { getAdminBanners } from '@/services/adminMockStore';
import { useApiFeaturedProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils';
import type { TrendingProduct as TrendingProductType } from '@/types';
import { StarRating } from '@/components/common/StarRating';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

function bannerToPath(link: string) {
  if (link.startsWith('/#/')) return link.slice(2);
  if (link.startsWith('#/')) return link.slice(1);
  return link;
}

function TrendingCard({ product, imageError, onImageError }: { product: TrendingProductType; imageError: boolean; onImageError: () => void }) {
  const { addItem } = useCart();
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  const productId = product.productDetailId ?? product.id;
  const imgSrc = imageError || !product.image ? PLACEHOLDER_IMAGE : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        <div className="flex items-center gap-1 mb-3">
          <StarRating variant="home" rating={product.rating} />
          <span className="text-xs text-slate-400 font-medium">({product.reviews.toLocaleString()})</span>
        </div>
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
  const heroBanners = useMemo(() => {
    const b = getAdminBanners();
    return b.length > 0 ? b : fallbackBanners;
  }, []);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroBanner = heroBanners[heroIndex] ?? heroBanners[0];
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
        {/* Hero Banner - Full Width */}
        <section className="mb-10 md:mb-12">
          <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
            {heroBanner && (
              <>
                <img
                  src={heroBanner.image}
                  alt={heroBanner.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center p-6 sm:p-8 md:p-10">
                  <div className="max-w-[320px] md:max-w-md text-white">
                    <span className="inline-block bg-primary text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mb-4">
                      {heroBanner.subtitle}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold mb-3 md:mb-4 leading-tight">{heroBanner.title}</h2>
                    <p className="text-slate-200 mb-5 md:mb-7 font-medium text-sm sm:text-base md:text-lg">
                      Experience lightning-fast performance and crystal clear displays.
                    </p>
                    <Link
                      to={bannerToPath(heroBanner.link) || '/'}
                      className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg text-sm md:text-base"
                    >
                      {heroBanner.linkText}
                    </Link>
                  </div>
                </div>
              </>
            )}
            {heroBanners.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Banner trước"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 z-10"
                  onClick={() => setHeroIndex((i) => (i - 1 + heroBanners.length) % heroBanners.length)}
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                <button
                  type="button"
                  aria-label="Banner sau"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 z-10"
                  onClick={() => setHeroIndex((i) => (i + 1) % heroBanners.length)}
                >
                  <span className="material-icons">chevron_right</span>
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                  {heroBanners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                      onClick={() => setHeroIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Featured Products</h3>
            </div>
            <Link to="/search" className="text-primary font-bold hover:underline flex items-center gap-1">
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
                  // New Arrival: from API show all; from mock use tag / !isBestSeller
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
