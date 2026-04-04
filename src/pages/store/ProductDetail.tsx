import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSupportChat } from '@/context/SupportChatContext';
import { isApiConfigured } from '@/services/api';
import { useApiProduct } from '@/hooks/useProductApi';
import { getFallbackProductDetailExtras } from '@/services/fallbackAdapters';
import { useCart } from '@/context/CartContext';
import { formatVND, discountPercentFromPrices } from '@/utils';
import { getProductStockDisplay } from '@/utils/stockDisplay';
import Breadcrumbs from '@/components/store/Breadcrumbs';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: apiProduct, loading: apiLoading } = useApiProduct(slug);
  const product = apiProduct;
  const extras = getFallbackProductDetailExtras(product?.id ?? slug);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { openSupportChat } = useSupportChat();
  const apiOn = isApiConfigured();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addInstallation, setAddInstallation] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [failedThumbIndices, setFailedThumbIndices] = useState<Set<number>>(() => new Set());
  const stockDisplay = useMemo(() => (product ? getProductStockDisplay(product) : null), [product]);

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/" className="text-primary hover:underline">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const mainImage = images[selectedImageIndex] ?? images[0];
  const mainImageSrc = failedThumbIndices.has(selectedImageIndex) ? PLACEHOLDER_IMAGE : mainImage;
  const thumbSrc = (idx: number) => (failedThumbIndices.has(idx) ? PLACEHOLDER_IMAGE : (images[idx] ?? ''));

  // Determine category path for breadcrumbs (slug-based category URLs)
  const getCategoryPath = () => {
    const categoryLower = product.category.toLowerCase();
    if (categoryLower.includes('smartphone') || categoryLower.includes('mobile')) return '/category/dien-thoai';
    if (categoryLower.includes('tablet')) return '/category/tablets';
    if (categoryLower.includes('accessories')) return '/category/phu-kien';
    if (categoryLower.includes('audio') || categoryLower.includes('headphone')) return '/category/am-thanh';
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
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 mb-16 lg:items-start">
            <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-5 lg:sticky lg:top-24 lg:self-start">
              <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[min(560px,75vh)] hide-scrollbar sm:shrink-0 sm:w-[4.75rem]">
                {images.slice(0, 5).map((img, num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedImageIndex(num)}
                    className={`w-16 h-16 sm:w-[4.25rem] sm:h-[4.25rem] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-colors ${selectedImageIndex === num ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' : 'border border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                  >
                    <img alt={`Thumbnail ${num + 1}`} src={thumbSrc(num)} className="w-full h-full object-cover" onError={() => setFailedThumbIndices((prev) => new Set(prev).add(num))} />
                  </button>
                ))}
              </div>
              <div className="min-w-0 flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center relative group w-full max-w-[560px] mx-auto h-[min(85vw,420px)] sm:h-[min(72vw,480px)] lg:h-[min(520px,65vh)] min-h-[260px]">
                <img
                  alt={product.name}
                  src={mainImageSrc}
                  className="max-w-full max-h-full w-auto h-auto object-contain p-4 sm:p-6 md:p-8"
                  onError={() => setFailedThumbIndices((prev) => new Set(prev).add(selectedImageIndex))}
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Phóng to ảnh"
                >
                  <span className="material-icons text-slate-700 dark:text-slate-200 text-xl">zoom_in</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="mb-4">
                {product.tag && <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.tag}</span>}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 leading-tight">{product.name}</h1>
                {(matchedVariant?.sku || product.sku) && (
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <span className="text-sm text-slate-500">SKU: {matchedVariant?.sku ?? product.sku}</span>
                  </div>
                )}
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
                {stockDisplay ? (
                  <p className={`text-sm font-medium mt-1 ${stockDisplay.textClass}`}>{stockDisplay.label}</p>
                ) : null}
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
                  disabled={!stockDisplay?.canPurchase}
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
              </div>
              {apiOn && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Sản phẩm lỗi hoặc cần góp ý?</span>
                    <span className="block text-xs mt-0.5">Nhắn trực tiếp cho cửa hàng kèm ngữ cảnh sản phẩm này.</span>
                  </div>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => openSupportChat({ productId: Number(product.id) })}
                      className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 rounded-lg border-2 border-primary/30 text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
                    >
                      <span className="material-icons text-lg">support_agent</span>
                      Báo lỗi &amp; góp ý
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      state={{
                        from: { pathname: '/messages', search: `?product=${encodeURIComponent(String(product.id))}` },
                      }}
                      className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <span className="material-icons text-lg">login</span>
                      Đăng nhập để góp ý
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        {product.description?.trim() ? (
          <section
            className="mb-20 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-900/50"
            aria-labelledby="product-description-heading"
          >
            <h2 id="product-description-heading" className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Mô tả sản phẩm
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {product.description.trim()}
            </p>
          </section>
        ) : null}
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
            /** Gom các key liên tiếp có giá trị primitive vào một card; giữ thứ tự key trong JSON. */
            type SpecSegment =
              | { type: 'flat'; items: [string, unknown][] }
              | { type: 'nested'; key: string; block: unknown };
            const specSegments: SpecSegment[] = [];
            for (const [key, block] of Object.entries(apiSpecs)) {
              if (key === 'tenSanPham' || block == null) continue;
              const isObj = block && typeof block === 'object' && !Array.isArray(block);
              const isFlatPrimitive =
                !isObj &&
                !Array.isArray(block) &&
                (typeof block === 'string' || typeof block === 'number' || typeof block === 'boolean');
              if (isFlatPrimitive) {
                const last = specSegments[specSegments.length - 1];
                if (last?.type === 'flat') {
                  last.items.push([key, block]);
                } else {
                  specSegments.push({ type: 'flat', items: [[key, block]] });
                }
              } else {
                specSegments.push({ type: 'nested', key, block });
              }
            }
            const specRowGridClass =
              'grid grid-cols-1 sm:grid-cols-[minmax(140px,220px)_1fr] gap-x-4 gap-y-1 px-4 py-3 sm:px-6 sm:items-start';
            return (
              <section className="mb-20" key="api-specs">
                <h2 className="text-2xl font-bold mb-4 md:mb-6">Thông số kỹ thuật</h2>
                <div className="space-y-4 md:space-y-5">
                  {specSegments.map((seg, segIdx) => {
                    if (seg.type === 'flat') {
                      return (
                        <div
                          key={`flat-${segIdx}-${seg.items.map(([k]) => k).join('|')}`}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                        >
                          <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {seg.items.map(([key, block], idx) => (
                              <div
                                key={key}
                                className={`${specRowGridClass} ${
                                  idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'
                                }`}
                              >
                                <dt className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                                  {specSectionLabels[key] || key}
                                </dt>
                                <dd className="text-sm text-slate-600 dark:text-slate-400 min-w-0">{renderSpecValue(block)}</dd>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    const { key, block } = seg;
                    const title = specSectionLabels[key] || key;
                    const isObj = block && typeof block === 'object' && !Array.isArray(block);
                    const rows = isObj ? Object.entries(block as Record<string, unknown>) : [];
                    return (
                      <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <h3 className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 sm:px-6 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 text-sm sm:text-base">
                          {title}
                        </h3>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                          {rows.map(([rowKey, value], idx) => (
                            <div
                              key={rowKey}
                              className={`${specRowGridClass} ${
                                idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'
                              }`}
                            >
                              <dt className="font-semibold text-sm text-slate-700 dark:text-slate-300">{specRowLabels[rowKey] || rowKey}</dt>
                              <dd className="text-sm text-slate-600 dark:text-slate-400 min-w-0">{renderSpecValue(value)}</dd>
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

        {extras && extras.relatedProducts && extras.relatedProducts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
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
