'use client';

import { useState, useEffect } from 'react';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus } from 'lucide-react';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductFormInput,
} from '@/lib/api';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = async (input: ProductFormInput) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, input);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProduct(input);
      setProducts((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      await deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <p className="text-text-secondary mt-1">
            Manage your digital products catalog ({products.length} items)
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="mp-button-primary flex items-center gap-2"
        >
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
        <ProductTable
          products={products}
          onEdit={handleEditClick}
          onDelete={(product) => setDeletingProduct(product)}
        />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary mb-4">No products found.</p>
          <button onClick={handleAddClick} className="mp-button-primary inline-flex items-center gap-2">
            <Plus size={18} /> Add Your First Product
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deletingProduct && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deletingProduct.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          isProcessing={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}
