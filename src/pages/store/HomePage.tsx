import React from 'react';
import { Link } from 'react-router-dom';
import { categories, banners, trendingProducts } from '@/data';
import type { TrendingProduct as TrendingProductType } from '@/types';

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

function TrendingCard({ product }: { product: TrendingProductType }) {
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col group">
      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full transition-transform group-hover:scale-110 object-contain"
        />
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
            BEST SELLER
          </span>
        )}
        <Link
          to={to}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-icons text-xl">favorite_border</span>
        </Link>
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
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              ${product.oldPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <Link
          to={to}
          className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-icons">add_shopping_cart</span>
        </Link>
      </div>
    </div>
  );
}

const PROMO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCW_DKot_SgA4oN0d4oZKWOebmbok17z_1w2ouERo8ChXoK4gX1ZkZLAqhmuaGnQFqNTFWtDJsVEjGLimWvPUyQ4iRwVtZk4vsdtCCeNdwJ-WPNZcWNPa0wZUh1UO4c7yTSKxZJVusT4_MRFglHh0eBZJEBfT1FdUeNAstQWrSsVTJZ6J7W9IIOse8k52nTOk1IIi9AHpZ8l4s6vqNjTTV1XyuWpZIPneqE2gjpCyXrwI4O-jammcoFp7gRY5orxIhDeg_X6sIzExg';

const HomePage: React.FC = () => {
  const [leftBanner, rightBanner] = banners;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] mb-12">
          <div className="relative group rounded-xl overflow-hidden bg-slate-200">
            <img
              src={leftBanner.image}
              alt={leftBanner.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center p-12">
              <div className="max-w-xs text-white">
                <span className="inline-block bg-primary text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mb-4">
                  {leftBanner.subtitle}
                </span>
                <h2 className="text-4xl font-bold mb-4 leading-tight">{leftBanner.title}</h2>
                <p className="text-slate-200 mb-8 font-medium">
                  Experience lightning-fast performance and crystal clear displays.
                </p>
                <Link
                  to={leftBanner.link}
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  {leftBanner.linkText}
                </Link>
              </div>
            </div>
          </div>
          <div className="relative group rounded-xl overflow-hidden bg-slate-200">
            <img
              src={rightBanner.image}
              alt={rightBanner.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center p-12">
              <div className="max-w-xs text-white">
                <span className="inline-block bg-emerald-500 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded mb-4">
                  {rightBanner.subtitle}
                </span>
                <h2 className="text-4xl font-bold mb-4 leading-tight">{rightBanner.title}</h2>
                <p className="text-slate-200 mb-8 font-medium">
                  Smart AC units that learn your schedule and save energy.
                </p>
                <Link
                  to={rightBanner.link}
                  className="inline-block bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  {rightBanner.linkText}
                </Link>
              </div>
            </div>
          </div>
        </section>

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
                  <span className="material-icons text-5xl text-slate-700 dark:text-slate-300 group-hover:text-primary">
                    {categoryIcons[cat.icon] || cat.icon}
                  </span>
                </div>
                <p className="font-semibold text-sm group-hover:text-primary">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trending Now</h3>
              <p className="text-slate-500">The most popular tech this week.</p>
            </div>
            <Link to="/search" className="text-primary font-bold hover:underline flex items-center gap-1">
              View All <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <TrendingCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-900 rounded-2xl overflow-hidden text-white flex flex-col md:flex-row items-center">
          <div className="p-12 md:w-1/2">
            <h3 className="text-3xl font-bold mb-4">TechHome Plus Members Save More</h3>
            <p className="text-slate-400 mb-8 text-lg">
              Join today for exclusive access to weekly deals, free next-day delivery, and 24/7 technical support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Join Now
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Learn More
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
