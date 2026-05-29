import { Product, ProductVariant } from '@/types/product';
import { sampleProducts } from '@/data/sampleProducts';

/**
 * Maps a database row using snake_case columns from the 'products' table
 * to the frontend camelCase 'Product' model.
 * 
 * Column mapping strategy:
 * - id -> id
 * - name -> name
 * - slug -> slug
 * - category -> category
 * - description -> description (defaults to '')
 * - price -> price (cast to Number)
 * - original_price -> originalPrice (cast to Number if present)
 * - image_url -> imageUrl (defaults to '')
 * - features -> features (defaults to empty array)
 * - stock_count -> inStock (boolean check stock_count > 0)
 * - is_instant_delivery -> isInstantDelivery (defaults to true)
 * - rating -> rating (cast to Number)
 * - reviews_count -> reviewsCount (calculated or set, defaults to 0)
 * - created_at -> createdAt
 * - variants -> variants (array of {id, label, price, original_price?})
 */
export function mapDatabaseProduct(dbRow: any): Product {
  if (!dbRow) {
    throw new Error('Database product row is null or undefined');
  }

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

/**
 * Fetches all products.
 * Falls back to the standard sampleProducts mock data.
 */
export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  return sampleProducts;
}

/**
 * Fetches all active products.
 * Currently filters the mock catalog.
 */
export async function getActiveProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  // In the future, this will run: select * from products where is_active = true
  return sampleProducts;
}

/**
 * Fetches a single product by its unique slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const product = sampleProducts.find((p) => p.slug === slug);
  return product || null;
}

/**
 * Fetches a single product by its unique ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const product = sampleProducts.find((p) => p.id === id);
  return product || null;
}
