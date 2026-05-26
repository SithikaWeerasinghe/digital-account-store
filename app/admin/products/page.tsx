'use client';

import { useState, useEffect } from 'react';
import ProductTable from '@/components/admin/ProductTable';
import { Plus } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <p className="text-text-secondary mt-1">Manage your digital products catalog</p>
        </div>
        <button className="mp-button-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <h3 className="font-bold text-lg mb-1">Error Loading Products</h3>
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <ProductTable products={products} />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary">No products found.</p>
        </div>
      )}
    </div>
  );
}
