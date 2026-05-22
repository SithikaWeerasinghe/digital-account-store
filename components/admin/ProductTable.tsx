import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2, MoreVertical } from 'lucide-react';

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-text-secondary font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary line-clamp-1">{product.name}</div>
                    <div className="text-xs text-text-muted">{product.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4">
                  {product.inStock ? (
                    <span className="text-success flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> In Stock</span>
                  ) : (
                    <span className="text-danger flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger"></span> Out of Stock</span>
                  )}
                </td>
                <td className="px-6 py-4">{product.rating} ({product.reviewsCount})</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-text-muted hover:text-primary transition-colors"><Edit size={16} /></button>
                    <button className="p-1.5 text-text-muted hover:text-danger transition-colors"><Trash2 size={16} /></button>
                    <button className="p-1.5 text-text-muted hover:text-text-primary transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
