import { Product, ProductVariant } from '@/types/product';
import { sampleProducts } from '@/data/sampleProducts';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export function mapDatabaseProduct(dbRow: any): Product {
  if (!dbRow) throw new Error('Database product row is null or undefined');

  const variants: ProductVariant[] | undefined =
    Array.isArray(dbRow.variants) && dbRow.variants.length > 0
      ? dbRow.variants.map((v: any) => ({
          id: v.id,
          label: v.label,
          price: Number(v.price),
          originalPrice: v.original_price ? Number(v.original_price) : undefined,
        }))
      : undefined;


  return {
    id: dbRow.id,
    name: dbRow.name,
    slug: dbRow.slug,
    category: dbRow.category,
    description: dbRow.description || '',
    price: Number(dbRow.price),
    originalPrice: dbRow.original_price ? Number(dbRow.original_price) : undefined,
    imageUrl: dbRow.image_url || '',
    features: Array.isArray(dbRow.features) ? dbRow.features : [],
    inStock: dbRow.stock_count !== undefined ? Number(dbRow.stock_count) > 0 : true,
    isInstantDelivery: dbRow.is_instant_delivery !== undefined ? Boolean(dbRow.is_instant_delivery) : true,
    rating: dbRow.rating !== undefined ? Number(dbRow.rating) : 0,
    reviewsCount: dbRow.reviews_count !== undefined ? Number(dbRow.reviews_count) : 0,
    createdAt: dbRow.created_at || new Date().toISOString(),
    variants,
  };
}

export async function getProducts(): Promise<Product[]> {
  console.log('DEBUG: getProducts called. Supabase client initialized:', !!supabase);
  if (!supabase) {
    console.log('DEBUG: Supabase is null, using local sampleProducts');
    return sampleProducts;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('DEBUG: Supabase query error:', error);
  }
  if (!data || data.length === 0) {
    console.log('DEBUG: Supabase returned empty data, using local sampleProducts');
    return sampleProducts;
  }
  
  console.log(`DEBUG: Supabase returned ${data.length} products successfully.`);
  return data.map(mapDatabaseProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!supabase) return sampleProducts;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock_count', 0)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return sampleProducts;
  return data.map(mapDatabaseProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return sampleProducts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return sampleProducts.find((p) => p.slug === slug) ?? null;
  return mapDatabaseProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) return sampleProducts.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return sampleProducts.find((p) => p.id === id) ?? null;
  return mapDatabaseProduct(data);
}

// ============================================================
// ADMIN CRUD OPERATIONS
// ============================================================

export interface ProductInput {
  name: string;
  category: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string;
  features?: string[];
  inStock?: boolean;
  isInstantDelivery?: boolean;
  variants?: ProductVariant[] | null;
}

/**
 * Maps a camelCase ProductInput into snake_case DB columns.
 * Variant originalPrice is stored as original_price inside the JSONB.
 */
function mapInputToRow(input: ProductInput): Record<string, any> {
  const row: Record<string, any> = {
    name: input.name,
    category: input.category,
    description: input.description ?? '',
    price: Number(input.price),
    original_price: input.originalPrice ? Number(input.originalPrice) : null,
    image_url: input.imageUrl ?? '',
    features: Array.isArray(input.features) ? input.features : [],
    is_instant_delivery: input.isInstantDelivery ?? true,
  };

  if (input.inStock !== undefined) {
    row.stock_count = input.inStock ? 20 : 0;
  }

  if (input.variants !== undefined) {
    row.variants =
      input.variants && input.variants.length > 0
        ? input.variants.map((v) => ({
            id: v.id,
            label: v.label,
            price: Number(v.price),
            original_price: v.originalPrice ? Number(v.originalPrice) : undefined,
          }))
        : null;
  }

  return row;
}

function validateProductInput(input: ProductInput) {
  if (!input.name?.trim()) throw new Error('Product name is required');
  if (!input.category?.trim()) throw new Error('Category is required');
  if (input.price === undefined || isNaN(Number(input.price)) || Number(input.price) < 0) {
    throw new Error('A valid price is required');
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  validateProductInput(input);

  const baseSlug = slugify(input.name);
  const row = {
    id: `prod-${Math.random().toString(36).substring(2, 11)}`,
    slug: baseSlug || `product-${Date.now()}`,
    rating: 0,
    reviews_count: 0,
    stock_count: input.inStock === false ? 0 : 20,
    created_at: new Date().toISOString(),
    ...mapInputToRow(input),
  };

  if (!supabase) {
    const product = mapDatabaseProduct(row);
    sampleProducts.unshift(product);
    return product;
  }

  const { data, error } = await supabase.from('products').insert(row).select().single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to create product');
  }
  return mapDatabaseProduct(data);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  validateProductInput(input);

  const row = mapInputToRow(input);
  // Regenerate slug from the (possibly updated) name
  row.slug = slugify(input.name) || `product-${Date.now()}`;

  if (!supabase) {
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    sampleProducts[index] = { ...sampleProducts[index], ...mapDatabaseProduct({ ...row, id }) };
    return sampleProducts[index];
  }

  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to update product');
  }
  return mapDatabaseProduct(data);
}

export async function deleteProduct(id: string): Promise<{ id: string }> {
  if (!supabase) {
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    sampleProducts.splice(index, 1);
    return { id };
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw new Error(error.message || 'Failed to delete product');
  }
  return { id };
}
