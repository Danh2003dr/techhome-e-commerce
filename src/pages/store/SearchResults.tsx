import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';
import { searchProducts, getPopularProducts, getProductsByCategorySlug } from '@/data';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const categorySlug = searchParams.get('category') || '';

  const results = useMemo(() => {
    if (categorySlug) return getProductsByCategorySlug(categorySlug);
    if (query) return searchProducts(query);
    return [];
  }, [query, categorySlug]);
  const popularProducts = getPopularProducts(4);
  const hasResults = results.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {categorySlug ? (
            <>{results.length} product{results.length !== 1 ? 's' : ''} in category</>
          ) : query ? (
            <>{(results.length)} result{results.length !== 1 ? 's' : ''} for <span className="text-indigo-600 italic">&quot;{query}&quot;</span></>
          ) : (
            'Search products'
          )}
        </h1>
        {query && !hasResults && (
          <p className="text-gray-500 mt-2">
            Did you mean: <Link to="/search?q=samsung" className="text-indigo-600 font-semibold hover:underline underline-offset-4">Samsung</Link>?
          </p>
        )}
      </div>

      {hasResults ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-indigo-50 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="material-icons text-gray-400 text-6xl">smart_toy</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
                <span className="material-icons text-indigo-600 text-4xl">search_off</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Sorry, we couldn&apos;t find that item</h2>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
              Try checking your spelling or using more general terms to find what you&apos;re looking for.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Go to Homepage
              </Link>
              <Link to="/" className="px-8 py-3.5 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:border-indigo-600 transition-all">
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Popular Products You Might Like
                <span className="material-icons text-indigo-600">trending_up</span>
              </h3>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-full border border-gray-200 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
                  <span className="material-icons">chevron_left</span>
                </button>
                <button className="p-2.5 rounded-full border border-gray-200 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
