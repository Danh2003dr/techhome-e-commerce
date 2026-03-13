import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductDetailExtras } from '@/data';
import Breadcrumbs from '@/components/store/Breadcrumbs';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const extras = id ? getProductDetailExtras(id) : null;

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addInstallation, setAddInstallation] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.colors?.length) setSelectedColor(product.colors[0].name);
      if (product.storageOptions?.length) setSelectedSize(product.storageOptions[1] ?? product.storageOptions[0]);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const colors = product.colors ?? [];
  const storageOptions = product.storageOptions ?? [];
  const mainImage = images[selectedImageIndex] ?? images[0];

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

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <main className="container mx-auto px-6 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
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
                    <img alt={`Thumbnail ${num + 1}`} src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-grow bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center relative group">
                <img alt={product.name} src={mainImage} className="w-full h-auto object-contain p-8" />
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
                  {product.sku && <><span className="text-sm text-slate-400">|</span><span className="text-sm text-slate-500">SKU: {product.sku}</span></>}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                  {product.oldPrice && <span className="text-lg text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>}
                </div>
                <p className={`text-sm font-medium mt-1 ${product.inStock !== false ? 'text-green-600' : 'text-red-600'}`}>{product.inStock !== false ? 'In Stock - Ready to ship' : 'Out of Stock'}</p>
              </div>
              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Color: <span className="text-slate-500 font-normal">{selectedColor || colors[0]?.name}</span></label>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button key={color.name} type="button" onClick={() => setSelectedColor(color.name)} className={`w-8 h-8 rounded-full flex-shrink-0 transition-all ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary ring-offset-white dark:ring-offset-background-dark' : 'ring-1 ring-slate-200 dark:ring-slate-700'}`} style={{ backgroundColor: color.hex }} />
                    ))}
                  </div>
                </div>
              )}
              {storageOptions.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3">Storage Capacity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {storageOptions.map((size) => (
                      <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${selectedSize === size ? 'border-2 border-primary bg-primary/5 text-primary font-bold' : 'border border-slate-200 dark:border-slate-700 hover:border-primary'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 mb-8">
                <button type="button" disabled={product.inStock === false} className="flex-grow bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"><span className="material-icons">shopping_bag</span> Add to Cart</button>
                <button type="button" className="px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-icons">favorite_border</span></button>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-start gap-3"><span className="material-icons text-primary">local_shipping</span><div><p className="text-sm font-semibold">Free Express Shipping</p><p className="text-xs text-slate-500">Order within 4 hrs to get it tomorrow</p></div></div>
                <div className="flex items-start gap-3"><span className="material-icons text-primary">verified_user</span><div><p className="text-sm font-semibold">2-Year Official Warranty</p><p className="text-xs text-slate-500">Extend your coverage with TechCare+</p></div></div>
              </div>
            </div>
          </section>
        {extras && extras.specs.length > 0 && (
          <section className="mb-20">
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
        )}
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
                    <button type="button" className="absolute top-4 right-4 bg-white/80 dark:bg-black/40 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><span className="material-icons text-sm">favorite_border</span></button>
                  </div>
                  <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                  <p className="text-slate-500 text-xs mb-2">{item.subtitle}</p>
                  <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
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
