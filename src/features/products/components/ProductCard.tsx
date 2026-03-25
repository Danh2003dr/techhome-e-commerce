import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatVND, discountPercentFromPrices } from '@/utils';
import type { Product } from '@/types';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const productId = (product as any).productDetailId || product.id;
  const productPath = `/product/${productId}`;
  const imgSrc = imgError || !product.image ? PLACEHOLDER_IMAGE : product.image;
  const inWishlist = isInWishlist(productId);
  const discountPct =
    product.oldPrice && product.price < product.oldPrice
      ? discountPercentFromPrices(product.oldPrice, product.price)
      : null;

  // Support unified badge rendering for both:
  // - API/real DTO: `tag` + `isBestSeller`
  // - mocks: `badge` + `badgeVariant`
  const rawBadgeText: string | null = (product as any).tag ?? (product as any).badge ?? null;
  const rawBadgeVariant: string | null | undefined = (product as any).badgeVariant ?? undefined;
  const hasDiscountBadge = discountPct != null && discountPct > 0;

  const badgeBgClass = (() => {
    if (rawBadgeVariant === 'primary') return 'bg-indigo-600';
    if (rawBadgeVariant === 'red') return 'bg-red-500';

    const t = (rawBadgeText ?? '').toLowerCase();
    if (!t) return 'bg-indigo-600';
    if (t.includes('in stock')) return 'bg-emerald-500';
    if (t.includes('refurbished')) return 'bg-slate-800';
    if (t.includes('save')) return 'bg-red-500';
    if (t.includes('off')) return 'bg-red-500';
    if (t.includes('new arrival')) return 'bg-indigo-600';
    if (t.includes('top rated')) return 'bg-indigo-600';
    if (t.includes('best seller')) return 'bg-indigo-600';
    return 'bg-indigo-600';
  })();

  const badgeTopClass = hasDiscountBadge ? 'top-12' : 'top-3';

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addItem({
        productId,
        name: product.name,
        price: product.price,
        image: product.image || '',
      });
    } catch (_) {}
  };

  return (
    <Link to={productPath} className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-xl flex flex-col block">
      <div className="relative mb-4 aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" onError={() => setImgError(true)} />
        {discountPct != null && discountPct > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full">
            −{discountPct}%
          </span>
        )}
        {product.isBestSeller && (
          <span
            className={`absolute left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
              discountPct != null && discountPct > 0 ? 'top-12' : 'top-3'
            }`}
          >
            Best Seller
          </span>
        )}
        {rawBadgeText && (
          <span
            className={`absolute left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase ${badgeBgClass} ${product.isBestSeller ? 'top-10' : badgeTopClass}`}
          >
            {rawBadgeText}
          </span>
        )}
        <button
          type="button"
          className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full transition-colors z-10 ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          onClick={handleWishlistToggle}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <span className="material-icons text-lg">{inWishlist ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>
      <div className="space-y-2 flex-grow">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{product.category}</p>
        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">{product.name}</h4>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-icons text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>star</span>
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-1">({product.reviews.toLocaleString()})</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col">
          {product.oldPrice && <span className="text-xs line-through text-gray-400">{formatVND(product.oldPrice)}</span>}
          <span className="text-xl font-bold text-gray-900">{formatVND(product.price)}</span>
        </div>
        <button
          type="button"
          className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition-all inline-flex z-20"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleAddToCart}
        >
          <span className="material-icons text-lg">add_shopping_cart</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
