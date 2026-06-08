import { Product, ProductVariant, ProductOption, GuaranteeOption } from '@/types/product';
import { sampleProducts } from '@/data/sampleProducts';
import { supabase, supabaseAdmin } from '@/lib/supabase';
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

  // Product options (variant-based inventory keys). Previously dropped here,
  // which made options invisible on DB-backed products.
  const options: ProductOption[] | undefined =
    Array.isArray(dbRow.options) && dbRow.options.length > 0
      ? dbRow.options.map((o: any) => ({
          id: o.id,
          label: o.label,
          description: o.description ?? undefined,
          price: Number(o.price),
          badge: o.badge ?? undefined,
          is_default: o.is_default ?? undefined,
        }))
      : undefined;

  const guarantee_options: GuaranteeOption[] | undefined =
    Array.isArray(dbRow.guarantee_options) && dbRow.guarantee_options.length > 0
      ? dbRow.guarantee_options.map((g: any) => ({
          id: g.id,
          label: g.label,
          months: Number(g.months),
          total_price: Number(g.total_price),
          monthly_price: Number(g.monthly_price),
          is_default: g.is_default ?? undefined,
          badge: g.badge ?? undefined,
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
    options,
    guarantee_options,
    // Treat as active unless explicitly archived (handles legacy rows w/o column).
    is_active: dbRow.is_active !== false,
  };
}

export async function getProducts(includeInactive = false): Promise<Product[]> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return includeInactive ? sampleProducts : sampleProducts.filter((p) => p.is_active !== false);
  }
  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[productService] getProducts query error:', error.message);
  }
  if (!data || data.length === 0) {
    return includeInactive ? sampleProducts : sampleProducts.filter((p) => p.is_active !== false);
  }

  const mapped = data.map(mapDatabaseProduct);
  // Public callers get active products only; admin passes includeInactive=true.
  return includeInactive ? mapped : mapped.filter((p) => p.is_active !== false);
}

export async function getActiveProducts(): Promise<Product[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return sampleProducts;
  const { data, error } = await client
    .from('products')
    .select('*')
    .gt('stock_count', 0)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return sampleProducts;
  return data.map(mapDatabaseProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = supabaseAdmin || supabase;
  if (!client) return sampleProducts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return sampleProducts.find((p) => p.slug === slug) ?? null;
  const product = mapDatabaseProduct(data);
  // Archived products are not publicly accessible — behave as "not found".
  if (product.is_active === false) return null;
  return product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = supabaseAdmin || supabase;
  if (!client) return sampleProducts.find((p) => p.id === id) ?? null;
  const { data, error } = await client
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

  const client = supabaseAdmin || supabase;
  if (!client) {
    const product = mapDatabaseProduct(row);
    sampleProducts.unshift(product);
    return product;
  }

  const { data, error } = await client.from('products').insert(row).select().single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to create product');
  }
  return mapDatabaseProduct(data);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  validateProductInput(input);

  const row = mapInputToRow(input);
  // Slug is intentionally NOT regenerated on update: product URLs are slug-based,
  // so renaming a product must not change (and break) its existing public URL.

  const client = supabaseAdmin || supabase;
  if (!client) {
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const existingSlug = sampleProducts[index].slug;
    sampleProducts[index] = { ...sampleProducts[index], ...mapDatabaseProduct({ ...row, id, slug: existingSlug }) };
    return sampleProducts[index];
  }

  const { data, error } = await client
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

async function archiveProduct(client: NonNullable<typeof supabase>, id: string): Promise<{ id: string; archived: true }> {
  const { error } = await client.from('products').update({ is_active: false }).eq('id', id);
  if (error) {
    throw new Error(error.message || 'Failed to archive product');
  }
  return { id, archived: true };
}

export async function deleteProduct(id: string): Promise<{ id: string; archived: boolean }> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    sampleProducts.splice(index, 1);
    return { id, archived: false };
  }

  // If any orders reference this product, archive instead of hard-deleting so
  // order history (and the orders_product_id_fkey constraint) is preserved.
  try {
    const { count } = await client
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', id);
    if ((count ?? 0) > 0) {
      return archiveProduct(client, id);
    }
  } catch (err: any) {
    console.error('[productService] Order lookup before delete failed:', err?.message || err);
  }

  const { error } = await client.from('products').delete().eq('id', id);
  if (error) {
    // A foreign-key violation (orders/inventory still reference it) must never
    // surface as a raw DB error — archive instead so nothing is lost.
    console.error('[productService] Hard delete failed, archiving instead:', error.message);
    return archiveProduct(client, id);
  }
  return { id, archived: false };
}
