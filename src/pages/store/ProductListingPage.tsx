import React, { useEffect, useMemo, useState } from 'react';
import ProductListingLayout from '@/components/store/ProductListingLayout';
import { useApiProducts } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { storefrontSortLabelToApiSort } from '@/pages/store/listing/plpSortApi';

const PAGE_SIZE = 12;

const DEALS_SORT_OPTIONS = [
  { value: 'Popularity', label: 'Popularity' },
  { value: 'Price: Low to High', label: 'Price: Low to High' },
  { value: 'Price: High to Low', label: 'Price: High to Low' },
  { value: 'Customer Rating', label: 'Customer Rating' },
  { value: 'Newest First', label: 'Newest First' },
];

const ProductListingPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('Popularity');
  const [page, setPage] = useState(1);

  const apiOn = isApiConfigured();
  const apiSort = storefrontSortLabelToApiSort(sortBy);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const { data: apiProducts, loading } = useApiProducts({
    page: page - 1,
    size: PAGE_SIZE,
    sort: apiSort,
    enabled: apiOn,
  });

  const sortedProducts = useMemo(
    () => apiProducts.map((p) => ({ ...p, category: 'Ưu đãi' })),
    [apiProducts]
  );

  const resultSummary = useMemo(() => {
    if (!apiOn) return 'Chưa cấu hình kết nối máy chủ.';
    if (sortedProducts.length === 0 && !loading) return 'Không có sản phẩm trên trang này.';
    const start = sortedProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end = (page - 1) * PAGE_SIZE + sortedProducts.length;
    return `Hiển thị ${start}–${end} · Trang ${page}`;
  }, [apiOn, sortedProducts.length, page, loading]);

  const pagination = {
    variant: 'unknownTotal' as const,
    page,
    pageSize: PAGE_SIZE,
    itemCount: sortedProducts.length,
    onPageChange: setPage,
  };

  return (
    <ProductListingLayout
      breadcrumbItems={[
        { label: 'Trang chủ', path: '/' },
        { label: 'Mua theo danh mục', path: '/search' },
        { label: 'Ưu đãi' },
      ]}
      title="Top Deals"
      sortOptions={DEALS_SORT_OPTIONS}
      sortBy={sortBy}
      onSortChange={setSortBy}
      resultSummary={resultSummary}
      products={sortedProducts}
      pagination={apiOn ? pagination : null}
      loading={apiOn && loading}
      emptyMessage={apiOn ? undefined : 'Kết nối API để xem danh sách sản phẩm.'}
    />
  );
};

export default ProductListingPage;
