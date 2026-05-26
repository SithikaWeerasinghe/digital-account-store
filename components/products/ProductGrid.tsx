import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-gray-200">
        <Package size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-1">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
