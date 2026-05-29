import { Product, ProductVariant } from '@/types/product';
import { sampleProducts } from '@/data/sampleProducts';
import { supabase } from '@/lib/supabase';

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

  const variants: ProductVariant[] | undefined = Array.isArray(dbRow.variants) && dbRow.variants.length > 0
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
  if (!supabase) return sampleProducts;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return sampleProducts;
  return data.map(mapDatabaseProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!supabase) return sampleProducts;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock_count', 0)
    .order('created_at', { ascending: false });
  if (error || !data) return sampleProducts;
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
