import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';
import { useApiProducts, useApiFeaturedProducts, useApiCategories } from '@/hooks/useProductApi';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const categorySlug = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  const { data: categories } = useApiCategories();
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const match = categories.find((c) => c.slug === categorySlug);
      setCategoryId(match ? Number(match.id) : undefined);
    } else {
      setCategoryId(undefined);
    }
  }, [categorySlug, categories]);

  const { data: rawResults, loading } = useApiProducts({
    q: query || undefined,
    category: categoryId,
    size: 200,
  });

  const { data: featuredProducts } = useApiFeaturedProducts();

  const results = sort === 'newest'
    ? [...rawResults].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    : rawResults;

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
            <>{results.length} kết quả cho <span className="text-indigo-600 italic">&quot;{query}&quot;</span></>
          ) : (
            'Danh mục sản phẩm'
          )}
        </h1>
        {query && !hasResults && !loading && (
          <p className="text-gray-500 mt-2">
            Bạn có thể tìm: <Link to="/search?q=samsung" className="text-indigo-600 font-semibold hover:underline underline-offset-4">Samsung</Link>?
          </p>
        )}
        {sort === 'newest' && (
          <p className="text-gray-500 mt-2">Khám phá sản phẩm mới nhất</p>
        )}
        {!query && !categorySlug && !sort && (
          <p className="text-gray-500 mt-2">Duyệt tất cả danh mục sản phẩm</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <span className="material-icons animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : hasResults ? (
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
            </div>
          </div>

          {featuredProducts.length > 0 && (
            <div className="mt-24">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
                Sản phẩm nổi bật
                <span className="material-icons text-indigo-600">trending_up</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
