import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Check, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-gray-50 p-8 flex items-center justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full max-w-md rounded-lg shadow-lg object-cover aspect-video"
          />
        </div>
        
        <div className="p-8 lg:p-12 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="flex items-center gap-1 text-success text-xs font-medium">
                <Check size={14} /> In Stock
              </span>
            ) : (
              <span className="text-danger text-xs font-medium">Out of Stock</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-text-primary mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-1 text-sm">
              <Star size={16} className="fill-secondary text-secondary" />
              <span className="font-bold">{product.rating}</span>
            </div>
            <span className="text-text-muted text-sm">{product.reviewsCount} Reviews</span>
            <div className="flex items-center gap-1 text-success text-sm ml-auto">
              <ShieldCheck size={16} /> Guaranteed
            </div>
          </div>
          
          <div className="mb-6 flex items-end gap-3">
            <span className="text-4xl font-bold text-text-primary">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xl text-text-muted line-through mb-1">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          <p className="text-text-secondary mb-8">{product.description}</p>
          
          <div className="mb-8">
            <h3 className="font-semibold text-text-primary mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-6 flex gap-4">
            <button 
              disabled={!product.inStock}
              className="mp-button-primary flex-1 flex justify-center items-center gap-2 py-3 text-lg"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <Link 
              href={product.inStock ? ROUTES.CHECKOUT : '#'}
              className={`mp-button-secondary flex-1 flex justify-center items-center py-3 text-lg ${!product.inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
