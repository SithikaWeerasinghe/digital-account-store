import { Review, CreateReviewInput } from '@/types/review';
import { sampleReviews } from '@/data/sampleReviews';
import { supabase } from '@/lib/supabase';

export interface DatabaseReviewRow {
  id: string;
  order_id: string | null;
  product_id: string;
  customer_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

let inMemoryReviews: DatabaseReviewRow[] = sampleReviews.map((r) => ({
  id: r.id,
  order_id: null,
  product_id: r.productId,
  customer_email: r.userId.includes('@') ? r.userId : `${r.userId}@example.com`,
  rating: r.rating,
  comment: r.comment,
  is_approved: true,
  created_at: r.createdAt,
}));

export function mapDatabaseReview(row: DatabaseReviewRow): Review {
  const namePart = row.customer_email.split('@')[0] || 'Anonymous';
  const userName = namePart
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: row.id,
    productId: row.product_id,
    userId: row.customer_email,
    userName,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    verifiedPurchase: true,
  };
}

export async function getApprovedReviews(): Promise<Review[]> {
  if (!supabase) return inMemoryReviews.filter((r) => r.is_approved).map(mapDatabaseReview);
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data) return inMemoryReviews.filter((r) => r.is_approved).map(mapDatabaseReview);
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  if (!supabase) {
    return inMemoryReviews.filter((r) => r.product_id === productId && r.is_approved).map(mapDatabaseReview);
  }
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const orderId = input.orderId || input.order_id;
  const productId = input.productId || input.product_id;
  const customerEmail = input.customerEmail || input.customer_email;

  const ratingVal = Number(input.rating);
  if (!productId) throw new Error('Product ID is required');
  if (!customerEmail || !customerEmail.includes('@')) throw new Error('A valid email is required');
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) throw new Error('Rating must be between 1 and 5');
  if (!input.comment?.trim()) throw new Error('Comment is required');

  const newRow: DatabaseReviewRow = {
    id: `rev-${Math.random().toString(36).substring(2, 9)}`,
    order_id: orderId || null,
    product_id: productId,
    customer_email: customerEmail.trim(),
    rating: Math.floor(ratingVal),
    comment: input.comment.trim(),
    is_approved: false,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase.from('reviews').insert(newRow).select().single();
    if (!error && data) return mapDatabaseReview(data as DatabaseReviewRow);
  }

  inMemoryReviews.push(newRow);
  return mapDatabaseReview(newRow);
}

export async function approveReview(id: string): Promise<Review | null> {
  if (!supabase) {
    const row = inMemoryReviews.find((r) => r.id === id);
    if (!row) return null;
    row.is_approved = true;
    return mapDatabaseReview(row);
  }
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', id)
    .select()
    .single();
  if (error || !data) return null;
  return mapDatabaseReview(data as DatabaseReviewRow);
}
