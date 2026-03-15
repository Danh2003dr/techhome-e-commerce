import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categories as mockCategories, banners, trendingProducts as mockTrendingProducts } from '@/data';
import { useApiCategories, useApiFeaturedProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatVND } from '@/utils';
import type { TrendingProduct as TrendingProductType } from '@/types';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const categoryIcons: Record<string, string> = {
  smartphone: 'smartphone',
  tablet: 'tablet',
  ac_unit: 'ac_unit',
  keyboard: 'keyboard',
  headset: 'headphones',
  tv: 'home_max',
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-sm">star_half</span>;
        return <span key={i} className="material-icons text-sm">star_border</span>;
      })}
    </div>
  );
}

function TrendingCard({ product, imageError, onImageError }: { product: TrendingProductType; imageError: boolean; onImageError: () => void }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  const productId = product.productDetailId ?? product.id;
  const imgSrc = imageError || !product.image ? PLACEHOLDER_IMAGE : product.image;
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addItem({ productId, name: product.name, price: product.price, image: product.image || '' });
    } catch (_) {}
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId,
      name: product.name,
      image: product.image || '',
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviews: product.reviews ?? 0,
    });
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
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded z-20">
            BÁN CHẠY
          </span>
        )}
        <button
          type="button"
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 transition-colors z-20"
          onClick={handleWishlistToggle}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <span className={`material-icons text-xl ${inWishlist ? 'text-red-500' : ''}`}>{inWishlist ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>
      <div className="flex-grow">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
        <h4 className="font-bold text-slate-900 dark:text-white mt-1 mb-2 line-clamp-2">{product.name}</h4>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={product.rating} />
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

const PROMO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCW_DKot_SgA4oN0d4oZKWOebmbok17z_1w2ouERo8ChXoK4gX1ZkZLAqhmuaGnQFqNTFWtDJsVEjGLimWvPUyQ4iRwVtZk4vsdtCCeNdwJ-WPNZcWNPa0wZUh1UO4c7yTSKxZJVusT4_MRFglHh0eBZJEBfT1FdUeNAstQWrSsVTJZ6J7W9IIOse8k52nTOk1IIi9AHpZ8l4s6vqNjTTV1XyuWpZIPneqE2gjpCyXrwI4O-jammcoFp7gRY5orxIhDeg_X6sIzExg';

const HomePage: React.FC = () => {
  const [heroBanner, ...smallerBanners] = banners;
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new');
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const { data: apiCategories, loading: categoriesLoading } = useApiCategories();
  const { data: apiFeaturedProducts, loading: featuredLoading } = useApiFeaturedProducts();

  const markImageError = (id: string) => setFailedImageIds((prev) => new Set(prev).add(id));

  const categories = useMemo(
    () => (isApiConfigured() && apiCategories.length > 0 ? apiCategories : mockCategories),
    [apiCategories]
  );
  const trendingProducts = useMemo(
    () => (isApiConfigured() && apiFeaturedProducts.length > 0 ? apiFeaturedProducts : mockTrendingProducts),
    [apiFeaturedProducts]
  );
  const isUsingApiProducts = isApiConfigured() && apiFeaturedProducts.length > 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Banner - Full Width */}
        <section className="mb-12">
          <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[500px] md:h-[600px]">
            <img
              src={heroBanner.image}
              alt={heroBanner.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center p-12">
              <div className="max-w-md text-white">
                <span className="inline-block bg-primary text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mb-4">
                  {heroBanner.subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{heroBanner.title}</h2>
                <p className="text-slate-200 mb-8 font-medium text-lg">
                  Experience lightning-fast performance and crystal clear displays.
                </p>
                <Link
                  to={heroBanner.link}
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  {heroBanner.linkText}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Smaller Banners Section */}
        {smallerBanners.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left: Wide banner */}
              <div className="md:col-span-2">
                <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[300px] md:h-[400px]">
                  <img
                    src={smallerBanners[0].image}
                    alt={smallerBanners[0].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent flex items-center p-8">
                    <div className="max-w-xs text-white">
                      <span className="inline-block bg-emerald-500 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mb-3">
                        {smallerBanners[0].subtitle}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{smallerBanners[0].title}</h3>
                      <Link
                        to={smallerBanners[0].link}
                        className="inline-block bg-white text-slate-900 hover:bg-slate-100 font-bold py-2 px-6 rounded-lg transition-all text-sm"
                      >
                        {smallerBanners[0].linkText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Placeholder for additional smaller banners (can be added later) */}
              <div className="grid grid-cols-1 gap-4">
                {/* Square banner 1 - Placeholder */}
                <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[190px] md:h-[195px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/80 flex items-center justify-center">
                    <p className="text-white text-sm font-semibold">More Products</p>
                  </div>
                </div>
                {/* Square banner 2 - Placeholder */}
                <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[190px] md:h-[195px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/80 flex items-center justify-center">
                    <p className="text-white text-sm font-semibold">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-16">
          <h3 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">Shop by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={
                  cat.slug === 'mobile'
                    ? '/category/mobile'
                    : cat.slug === 'cooling'
                      ? '/category/cooling'
                      : cat.slug === 'accessories'
                        ? '/category/accessories'
                        : cat.slug === 'audio'
                          ? '/category/audio'
                          : cat.slug === 'smart-home'
                            ? '/category/smart-home'
                            : `/search?category=${cat.slug}`
                }
                className="group text-center"
              >
                <div className="w-full aspect-square rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-8 transition-all hover:border-primary hover:shadow-lg mb-4">
                  <span className="material-icons text-5xl text-slate-700 dark:text-slate-300 group-hover:text-primary" aria-hidden>
                    {categoryIcons[cat.icon] || cat.icon}
                  </span>
                </div>
                <p className="font-semibold text-sm group-hover:text-primary font-display" style={{ fontFamily: "inherit" }}>{cat.name}</p>
              </Link>
            ))}
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
                <TrendingCard
                  key={product.id}
                  product={product}
                  imageError={failedImageIds.has(product.id)}
                  onImageError={() => markImageError(product.id)}
                />
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
                <TrendingCard
                  key={product.id}
                  product={product}
                  imageError={failedImageIds.has(product.id)}
                  onImageError={() => markImageError(product.id)}
                />
              ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-900 rounded-2xl overflow-hidden text-white flex flex-col md:flex-row items-center">
          <div className="p-12 md:w-1/2">
            <h3 className="text-3xl font-bold mb-4">Thành viên TechHome Plus tiết kiệm hơn</h3>
            <p className="text-slate-400 mb-8 text-lg">
              Tham gia ngay để nhận ưu đãi hàng tuần, giao hàng ngày hôm sau miễn phí và hỗ trợ kỹ thuật 24/7.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Tham gia ngay
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto self-stretch min-h-[200px]">
            <img src={PROMO_IMAGE} alt="Support team" className="w-full h-full object-cover opacity-60" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
