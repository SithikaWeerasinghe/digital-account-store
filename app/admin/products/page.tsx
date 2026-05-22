import { sampleProducts } from '@/data/sampleProducts';
import ProductTable from '@/components/admin/ProductTable';
import { Plus } from 'lucide-react';

export default function AdminProductsPage() {
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
      
      <ProductTable products={sampleProducts} />
    </div>
  );
}
