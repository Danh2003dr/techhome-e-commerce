import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApiProduct } from '@/hooks/useProductApi';
import { getFallbackProductDetailExtras } from '@/services/fallbackAdapters';
import { getStoredReviewsForProduct, addStoredReview } from '@/services/reviewsStore';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatVND, discountPercentFromPrices } from '@/utils';
import Breadcrumbs from '@/components/store/Breadcrumbs';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: apiProduct, loading: apiLoading } = useApiProduct(id);
  const { user, isAuthenticated } = useAuth();
  const product = apiProduct;
  const extras = getFallbackProductDetailExtras(id);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addInstallation, setAddInstallation] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [failedThumbIndices, setFailedThumbIndices] = useState<Set<number>>(() => new Set());
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const storedReviews = useMemo(() => (id ? getStoredReviewsForProduct(id) : []), [id, reviewRefresh]);
  const canReview = useMemo(
    () => Boolean(isAuthenticated && id && user),
    [isAuthenticated, id, user]
  );

  /**
   * Màu / dung lượng: ưu tiên đúng dữ liệu catalog từ API (`colors`, `storageOptions`).
   * Chỉ dùng `variants` khi có (mock/admin local) — không suy ra từ tên sản phẩm.
   */
  const colors = useMemo(() => {
    if (!product) return [];
    const fromVar = product.variants?.map((v) => v.color).filter(Boolean) as string[] | undefined;
    if (fromVar?.length) {
      const uniq = [...new Set(fromVar)];
      return uniq.map((name) => ({ name, hex: '#6b7280' }));
    }
    if (product.colors?.length) return product.colors;
    return [];
  }, [product?.colors, product?.variants]);

  const storageOptions = useMemo(() => {
    if (!product) return [];
    const fromVar = product.variants?.map((v) => v.storage).filter(Boolean) as string[] | undefined;
    if (fromVar?.length) return [...new Set(fromVar)];
    if (product.storageOptions?.length) return product.storageOptions;
    return [];
  }, [product?.storageOptions, product?.variants]);

  const matchedVariant = useMemo(() => {
    if (!product?.variants?.length) return undefined;
    const found = product.variants.find(
      (v) =>
        (!v.color || v.color === selectedColor) && (!v.storage || v.storage === selectedSize)
    );
    return found ?? product.variants[0];
  }, [product, selectedColor, selectedSize]);

  useEffect(() => {
    setFailedThumbIndices(new Set());
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    if (product.variants?.length) {
      const v0 = product.variants[0];
      if (v0.color) setSelectedColor(v0.color);
      else setSelectedColor('');
      if (v0.storage) setSelectedSize(v0.storage);
      else setSelectedSize('');
      return;
    }
    if (product.colors?.length) setSelectedColor(product.colors[0].name);
    else setSelectedColor('');
    if (product.storageOptions?.length) setSelectedSize(product.storageOptions[0]);
    else setSelectedSize('');
  }, [product?.id, product?.colors, product?.storageOptions, product?.variants]);

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center">
        <div className="text-center text-slate-500">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const mainImage = images[selectedImageIndex] ?? images[0];
  const mainImageSrc = failedThumbIndices.has(selectedImageIndex) ? PLACEHOLDER_IMAGE : mainImage;
  const thumbSrc = (idx: number) => (failedThumbIndices.has(idx) ? PLACEHOLDER_IMAGE : (images[idx] ?? ''));

  const renderStars = (rating: number, size = 'text-sm') => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= full || (i === full + 1 && half);
          const icon = i <= full ? 'star' : i === full + 1 && half ? 'star_half' : 'star';
          return (
            <span key={i} className={`material-icons ${filled ? 'text-amber-400' : 'text-slate-300'}`}>{icon}</span>
          );
        })}
      </div>
    );
  };

  // Determine category path for breadcrumbs
  const getCategoryPath = () => {
    const categoryLower = product.category.toLowerCase();
    if (categoryLower.includes('smartphone') || categoryLower.includes('mobile')) return '/search?category=mobile';
    if (categoryLower.includes('tablet')) return '/search?category=tablets';
    if (categoryLower.includes('accessories')) return '/category/accessories';
    if (categoryLower.includes('audio') || categoryLower.includes('headphone')) return '/category/audio';
    return '/search';
  };

  const priceLine =
    matchedVariant?.price != null && matchedVariant.price > 0 ? matchedVariant.price : product.price;
  const oldLine = matchedVariant?.price != null && matchedVariant.price > 0 ? undefined : product.oldPrice;
  const salePct =
    oldLine && product.price < oldLine ? discountPercentFromPrices(oldLine, product.price) : null;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <main className="container mx-auto px-6 py-8">
        <Breadcrumbs
          items={[
            { label: 'Trang chủ', path: '/' },
            { label: 'Catalog', path: '/search' },
            { label: product.category, path: getCategoryPath() },
            ...(extras?.brand ? [{ label: extras.brand, path: '/search' }] : []),
            { label: product.name }
          ]}
          className="mb-8"
        />
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar">
                {images.slice(0, 5).map((img, num) => (
                  <button key={num} type="button" onClick={() => setSelectedImageIndex(num)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-colors ${selectedImageIndex === num ? 'border-2 border-primary' : 'border border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                    <img alt={`Thumbnail ${num + 1}`} src={thumbSrc(num)} className="w-full h-full object-cover" onError={() => setFailedThumbIndices((prev) => new Set(prev).add(num))} />
                  </button>
                ))}
              </div>
              <div className="flex-grow bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center relative group">
                <img alt={product.name} src={mainImageSrc} className="w-full h-auto object-contain p-8" onError={() => setFailedThumbIndices((prev) => new Set(prev).add(selectedImageIndex))} />
                <button type="button" className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/40 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-icons">zoom_in</span></button>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <div className="mb-4">
                {product.tag && <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.tag}</span>}
                <h1 className="text-4xl font-bold mt-2 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mt-4">
                  {renderStars(product.rating)}
                  <span className="text-sm font-medium text-slate-500 underline cursor-pointer">{product.reviews} reviews</span>
                  {(matchedVariant?.sku || product.sku) && (
                    <>
                      <span className="text-sm text-slate-400">|</span>
                      <span className="text-sm text-slate-500">SKU: {matchedVariant?.sku ?? product.sku}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatVND(priceLine)}</span>
                  {oldLine != null && priceLine < oldLine && (
                    <span className="text-lg text-slate-400 line-through">{formatVND(oldLine)}</span>
                  )}
                  {salePct != null && salePct > 0 && !matchedVariant?.price && (
                    <span className="text-sm font-black text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-lg">
                      −{salePct}%
                    </span>
                  )}
                </div>
                <p className={`text-sm font-medium mt-1 ${product.inStock !== false ? 'text-green-600' : 'text-red-600'}`}>{product.inStock !== false ? 'In Stock - Ready to ship' : 'Out of Stock'}</p>
              </div>
              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Màu sắc: <span className="text-slate-500 font-normal">{selectedColor || colors[0]?.name}</span></label>
                  <div className="flex gap-3">
                    {colors.map((color, idx) => (
                      <button
                        key={`${color.name}-${idx}`}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full flex-shrink-0 transition-all ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary ring-offset-white dark:ring-offset-background-dark' : 'ring-1 ring-slate-200 dark:ring-slate-700'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              {storageOptions.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3">Phiên bản / Dung lượng</label>
                  <div className="grid grid-cols-4 gap-2">
                    {storageOptions.map((size) => (
                      <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${selectedSize === size ? 'border-2 border-primary bg-primary/5 text-primary font-bold' : 'border border-slate-200 dark:border-slate-700 hover:border-primary'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  disabled={product.inStock === false}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addItem({
                      productId: String(product.id),
                      name: product.name,
                      price: Number(priceLine),
                      image: Array.isArray(product.images) && product.images[0] ? product.images[0] : (product.image || ''),
                      variant: [matchedVariant?.sku, selectedColor, selectedSize].filter(Boolean).join(' · ') || undefined,
                    });
                    setJustAddedToCart(true);
                    setTimeout(() => setJustAddedToCart(false), 2000);
                  }}
                  className="flex-grow bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10"
                >
                  <span className="material-icons">{justAddedToCart ? 'check_circle' : 'shopping_bag'}</span>
                  {justAddedToCart ? ' Đã thêm vào giỏ' : ' Thêm vào giỏ'}
                </button>
                <button
                  type="button"
                  className={`px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${product && isInWishlist(product.id) ? 'text-red-500' : ''}`}
                  onClick={() =>
                    product &&
                    toggleItem({
                      productId: product.id,
                      name: product.name,
                      image: product.image || '',
                      price: product.price,
                      oldPrice: product.oldPrice,
                      rating: product.rating,
                      reviews: product.reviews ?? 0,
                    })
                  }
                  aria-label={product && isInWishlist(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  <span className="material-icons">{product && isInWishlist(product.id) ? 'favorite' : 'favorite_border'}</span>
                </button>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-start gap-3"><span className="material-icons text-primary">local_shipping</span><div><p className="text-sm font-semibold">Free Express Shipping</p><p className="text-xs text-slate-500">Order within 4 hrs to get it tomorrow</p></div></div>
                <div className="flex items-start gap-3"><span className="material-icons text-primary">verified_user</span><div><p className="text-sm font-semibold">2-Year Official Warranty</p><p className="text-xs text-slate-500">Extend your coverage with TechCare+</p></div></div>
              </div>
            </div>
          </section>
        {(() => {
          const specSectionLabels: Record<string, string> = {
            manHinh: 'Màn hình',
            cameraSau: 'Camera sau',
            cameraTruoc: 'Camera trước',
            viXuLyDoHoa: 'Vi xử lý & đồ họa',
            giaoTiepKetNoi: 'Giao tiếp & kết nối',
            ramLuuTru: 'RAM & Lưu trữ',
            pinSac: 'Pin & Sạc',
            kichThuocTrongLuong: 'Kích thước & Trọng lượng',
            thietKe: 'Thiết kế',
            thongSoKhac: 'Thông số khác',
            gocSieurong: 'Góc siêu rộng',
            telephoto1: 'Tele 5x',
            telephoto2: 'Tele 3x',
          };
          const specRowLabels: Record<string, string> = {
            kichThuocManHinh: 'Kích thước',
            congNgheManHinh: 'Công nghệ',
            doPhanGiai: 'Độ phân giải',
            tinhNangManHinh: 'Tính năng',
            tanSoQuet: 'Tần số quét',
            kieuManHinh: 'Kiểu màn hình',
            cameraChinh: 'Camera chính',
            gocSieuRong: 'Góc siêu rộng',
            telephoto: 'Telephoto',
            quayVideo: 'Quay video',
            tinhNangCamera: 'Tính năng camera',
            cameraTruoc: 'Camera trước',
            quayVideoTruoc: 'Quay video trước',
            tinhNangCameraTruoc: 'Tính năng camera trước',
            chipset: 'Chipset',
            gpu: 'GPU',
            loaiCpu: 'CPU',
            nfc: 'NFC',
            sim: 'SIM',
            mang: 'Mạng',
            gps: 'GPS',
            wifi: 'Wi-Fi',
            bluetooth: 'Bluetooth',
            ram: 'RAM',
            boNhoTrong: 'Bộ nhớ trong',
            pin: 'Pin',
            congNgheSac: 'Công nghệ sạc',
            congSac: 'Cổng sạc',
            kichThuoc: 'Kích thước',
            trongLuong: 'Trọng lượng',
            chatLieuMatLung: 'Chất liệu mặt lưng',
            chatLieuKhungVien: 'Chất liệu khung viền',
            matTruoc: 'Mặt trước',
            khangNuocBui: 'Kháng nước & bụi',
            congNgheTienIch: 'Công nghệ tiện ích',
          };
          function renderSpecValue(v: unknown): React.ReactNode {
            if (v == null) return '—';
            if (Array.isArray(v)) return v.join(', ');
            if (typeof v === 'object') {
              return (
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {Object.entries(v).map(([k, val]) => (
                    <li key={k}>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{specRowLabels[k] || k}:</span>{' '}
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </li>
                  ))}
                </ul>
              );
            }
            return String(v);
          }
          let apiSpecs: Record<string, unknown> | null = null;
          if (product.specifications && typeof product.specifications === 'string') {
            try {
              apiSpecs = JSON.parse(product.specifications) as Record<string, unknown>;
            } catch {
              apiSpecs = null;
            }
          }
          if (apiSpecs && Object.keys(apiSpecs).length > 0) {
            return (
              <section className="mb-20" key="api-specs">
                <h2 className="text-2xl font-bold mb-8">Thông số kỹ thuật</h2>
                <div className="space-y-8">
                  {Object.entries(apiSpecs).map(([key, block]) => {
                    if (key === 'tenSanPham' || block == null) return null;
                    const title = specSectionLabels[key] || key;
                    const isObj = block && typeof block === 'object' && !Array.isArray(block);
                    const rows = isObj ? Object.entries(block as Record<string, unknown>) : [];
                    /** Admin lưu JSON phẳng { "Màn hình": "6.1\"", "Pin": "4000mAh" } — giá trị là primitive, không phải object lồng. */
                    const isFlatPrimitive =
                      !isObj &&
                      !Array.isArray(block) &&
                      (typeof block === 'string' || typeof block === 'number' || typeof block === 'boolean');
                    if (isFlatPrimitive) {
                      return (
                        <div
                          key={key}
                          className={`flex flex-col sm:flex-row sm:gap-4 px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900`}
                        >
                          <dt className="font-semibold text-sm text-slate-700 dark:text-slate-300 min-w-[160px] sm:min-w-[200px]">
                            {title}
                          </dt>
                          <dd className="text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-0 flex-1">{renderSpecValue(block)}</dd>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <h3 className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                          {title}
                        </h3>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                          {rows.map(([rowKey, value], idx) => (
                            <div
                              key={rowKey}
                              className={`flex flex-col sm:flex-row sm:gap-4 px-6 py-4 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'}`}
                            >
                              <dt className="font-semibold text-sm text-slate-700 dark:text-slate-300 min-w-[140px]">{specRowLabels[rowKey] || rowKey}</dt>
                              <dd className="text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-0">{renderSpecValue(value)}</dd>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }
          if (extras && extras.specs.length > 0) {
            return (
              <section className="mb-20" key="mock-specs">
                <h2 className="text-2xl font-bold mb-8">Technical Specifications</h2>
                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {extras.specs.map((spec, idx) => (
                        <tr key={spec.label} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}>
                          <td className="py-4 px-6 font-semibold text-sm w-1/3">{spec.label}</td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          }
          return (
            <section className="mb-20" key="empty-specs">
              <h2 className="text-2xl font-bold mb-8">Thông số kỹ thuật</h2>
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Chưa có dữ liệu thông số kỹ thuật cho sản phẩm này.
              </div>
            </section>
          );
        })()}

        <section className="mb-20 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
          {canReview ? (
            <form
              className="mb-10 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!id || !user || !reviewText.trim()) return;
                addStoredReview({
                  productId: id,
                  userId: String(user.id),
                  authorName: user.name,
                  rating: reviewRating,
                  text: reviewText,
                  photos: [],
                });
                setReviewText('');
                setReviewRefresh((n) => n + 1);
              }}
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Viết đánh giá</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReviewRating(i)}
                    className="text-amber-400"
                    aria-label={`${i} sao`}
                  >
                    <span className="material-icons">{i <= reviewRating ? 'star' : 'star_border'}</span>
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[88px]"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold">
                Gửi đánh giá
              </button>
            </form>
          ) : (
            <div className="mb-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              Vui lòng đăng nhập để viết bình luận.
            </div>
          )}

          {storedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storedReviews.map((r) => (
                <div key={r.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                        {r.initials}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{r.author}</p>
                        <p className="text-[11px] text-slate-500">
                          {r.verified ? 'Đã mua hàng' : ''} • {r.date}
                        </p>
                      </div>
                    </div>
                    {renderStars(r.rating, 'text-xs')}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{r.text}</p>
                  {r.photos && r.photos.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {r.photos.map((ph, i) => (
                        <img key={i} src={ph} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Chưa có bình luận nào cho sản phẩm này.
            </div>
          )}
        </section>

        {extras && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold">{extras.reviewScore}</span>
                  <div>{renderStars(extras.reviewScore, '')}<p className="text-sm text-slate-500 font-medium">Based on {product.reviews} ratings</p></div>
                </div>
              </div>
              {extras.reviewDistribution && (
                <div className="flex-grow max-w-md">
                  <div className="space-y-2">
                    {([5, 4, 3] as const).map((star) => (
                      <div key={star} className="flex items-center gap-4">
                        <span className="text-xs font-medium w-4">{star}</span>
                        <div className="flex-grow bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden"><div className="bg-primary h-full" style={{ width: `${extras.reviewDistribution[star] ?? 0}%` }} /></div>
                        <span className="text-xs text-slate-500 w-10 text-right">{extras.reviewDistribution[star] ?? 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Write a Review</button>
            </div>
            {extras.customerPhotos && extras.customerPhotos.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Customer Photos</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {extras.customerPhotos.map((photo, i) => <img key={i} src={photo} alt="" className="w-32 h-32 rounded-lg object-cover flex-shrink-0" />)}
                  <div className="w-32 h-32 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 flex-shrink-0"><span className="text-sm font-bold">+24 more</span></div>
                </div>
              </div>
            )}
            {extras.reviews && extras.reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {extras.reviews.map((review, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>{review.initials}</div>
                        <div><p className="font-bold">{review.author}</p><p className="text-xs text-slate-500">{review.verified ? 'Verified Buyer' : ''} • {review.date}</p></div>
                      </div>
                      {renderStars(review.rating, 'text-xs')}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {extras && extras.relatedProducts && extras.relatedProducts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <div className="flex gap-2">
                <button type="button" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><span className="material-icons">chevron_left</span></button>
                <button type="button" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><span className="material-icons">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {extras.relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group">
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-4 overflow-hidden relative">
                    <img alt={item.name} src={item.image} className="w-full h-48 object-contain transition-transform group-hover:scale-105" />
                    <button
                      type="button"
                      className={`absolute top-4 right-4 bg-white/80 dark:bg-black/40 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isInWishlist(item.id) ? 'opacity-100 text-red-500' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleItem({
                          productId: item.id,
                          name: item.name,
                          image: item.image || '',
                          price: item.price,
                          rating: 0,
                          reviews: 0,
                        });
                      }}
                      aria-label={isInWishlist(item.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <span className="material-icons text-sm">{isInWishlist(item.id) ? 'favorite' : 'favorite_border'}</span>
                    </button>
                  </div>
                  <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                  <p className="text-slate-500 text-xs mb-2">{item.subtitle}</p>
                  <p className="font-bold text-primary">{formatVND(item.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
