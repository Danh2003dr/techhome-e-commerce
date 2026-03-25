import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';
import { useApiCategories, useApiProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { findCategoryIdByUrlSlug } from '@/services/categoryNavigation';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const categorySlug = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const { data: apiCategories } = useApiCategories();

  const apiCategoryId = useMemo(() => {
    if (!categorySlug) return undefined;
    return findCategoryIdByUrlSlug(apiCategories, categorySlug);
  }, [apiCategories, categorySlug]);

  const { data: apiProducts } = useApiProducts({
    category: apiCategoryId,
    q: query || undefined,
    page: 0,
    size: 100,
  });

  const results = useMemo(() => {
    if (!isApiConfigured()) return [];
    let list = [...apiProducts];
    if (sort === 'newest') {
      list = list.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return list;
  }, [apiProducts, sort]);

  const popularProducts = useMemo(() => {
    if (!isApiConfigured()) return [];
    return [...apiProducts]
      .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      .slice(0, 4);
  }, [apiProducts]);
  const hasResults = results.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          {sort === 'newest' ? (
            <>Hàng mới về</>
          ) : categorySlug ? (
            <>{results.length} sản phẩm trong danh mục</>
          ) : query ? (
            <>{(results.length)} kết quả cho <span className="text-indigo-600 italic">&quot;{query}&quot;</span></>
          ) : (
            'Danh mục sản phẩm'
          )}
        </h1>
        {query && !hasResults && (
          <p className="text-gray-500 mt-2">
            Bạn có thể tìm: <Link to="/search?q=samsung" className="text-indigo-600 font-semibold hover:underline underline-offset-4">Samsung</Link>?
          </p>
        )}
        {sort === 'newest' && (
          <p className="text-gray-500 mt-2">
            Khám phá sản phẩm mới nhất
          </p>
        )}
        {!query && !categorySlug && !sort && (
          <p className="text-gray-500 mt-2">
            Duyệt tất cả danh mục sản phẩm
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Không tìm thấy sản phẩm</h2>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
              Thử kiểm tra chính tả hoặc dùng từ khóa chung hơn để tìm kiếm.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Về trang chủ
              </Link>
              <Link to="/" className="px-8 py-3.5 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:border-indigo-600 transition-all">
                Duyệt danh mục
              </Link>
            </div>
          </div>

          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Sản phẩm phổ biến
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
