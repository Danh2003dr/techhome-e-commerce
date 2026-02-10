
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-xl flex flex-col block">
      <div className="relative mb-4 aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Best Seller
          </span>
        )}
        {product.tag && (
          <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase ${product.tag === 'In Stock' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {product.tag}
          </span>
        )}
      </div>
      <div className="space-y-2 flex-grow">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{product.category}</p>
        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
          {product.name}
        </h4>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-icons text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>star</span>
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-1">({product.reviews.toLocaleString()})</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col">
          {product.oldPrice && <span className="text-xs line-through text-gray-400">${product.oldPrice.toFixed(2)}</span>}
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition-all inline-flex"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-icons text-lg">add_shopping_cart</span>
        </Link>
      </div>
    </Link>
  );
};

export default ProductCard;
