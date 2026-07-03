import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2, Star } from 'lucide-react';
import ProductImage from '@/components/ui/ProductImage';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Edit Product action visibility. RESTORED (visible). Set to `false` to hide the
// Edit button again without removing any edit logic (ProductForm / updateProduct).
const SHOW_EDIT_PRODUCT = true;

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] tracking-widest uppercase border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4.5">Product Details</th>
              <th className="px-6 py-4.5">Category</th>
              <th className="px-6 py-4.5">Price</th>
              <th className="px-6 py-4.5">Stock State</th>
              <th className="px-6 py-4.5">Rating Metrics</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {products.map((product) => (
              <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${product.is_active === false ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-150 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                    <ProductImage src={product.imageUrl} productName={product.name} category={product.category} compact />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 flex items-center gap-2">
                      {product.name}
                      {product.is_active === false && (
                        <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase">
                          Archived
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {product.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#fff159]/15 text-amber-700 border border-[#fff159]/25 px-2.5 py-0.5 rounded-lg text-[9px] font-black font-mono tracking-widest uppercase">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-black text-slate-800">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4">
                  {product.inStock ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/50 px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                      IN STOCK
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-250/50 px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 
                      OUT OF STOCK
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-250/50 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-700">
                      <Star size={10} className="fill-[#fff159] text-amber-500" />
                      {product.rating.toFixed(1)}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">({product.reviewsCount} logs)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit Product button — hidden when SHOW_EDIT_PRODUCT is false. */}
                    {SHOW_EDIT_PRODUCT && (
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-slate-700 transition-all duration-200 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-rose-500/30 text-slate-400 hover:text-rose-600 transition-all duration-200 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
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
