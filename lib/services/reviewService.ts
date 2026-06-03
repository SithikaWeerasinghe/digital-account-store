import { Review, CreateReviewInput } from '@/types/review';
import { sampleReviews } from '@/data/sampleReviews';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export interface DatabaseReviewRow {
  id: string;
  order_id: string | null;
  product_id: string | null;
  customer_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

const inMemoryReviews: DatabaseReviewRow[] = sampleReviews.map((r) => ({
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
  let email = row.customer_email || '';
  let userName = 'Anonymous';

  if (email.includes('|')) {
    const parts = email.split('|');
    email = parts[0];
    userName = parts[1];
  } else {
    const namePart = email.split('@')[0] || 'Anonymous';
    userName = namePart
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return {
    id: row.id,
    productId: row.product_id,
    userId: email,
    userName,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    verifiedPurchase: true,
  };
}

export async function getApprovedReviews(): Promise<Review[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return inMemoryReviews.filter((r) => r.is_approved).map(mapDatabaseReview);
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return inMemoryReviews.filter((r) => r.is_approved).map(mapDatabaseReview);
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return inMemoryReviews.filter((r) => r.product_id === productId && r.is_approved).map(mapDatabaseReview);
  }
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    return inMemoryReviews.filter((r) => r.product_id === productId && r.is_approved).map(mapDatabaseReview);
  }
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function getWebsiteReviews(): Promise<Review[]> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return inMemoryReviews.filter((r) => !r.product_id && r.is_approved).map(mapDatabaseReview);
  }
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .is('product_id', null)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    return inMemoryReviews.filter((r) => !r.product_id && r.is_approved).map(mapDatabaseReview);
  }
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const orderId = input.orderId || input.order_id;
  const productId = input.productId || input.product_id;
  const customerEmail = input.customerEmail || input.customer_email;

  const ratingVal = Number(input.rating);
  if (!customerEmail || !customerEmail.includes('@')) throw new Error('A valid email is required');
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) throw new Error('Rating must be between 1 and 5');
  if (!input.comment?.trim()) throw new Error('Comment is required');

  const newRow: DatabaseReviewRow = {
    id: `rev-${Math.random().toString(36).substring(2, 9)}`,
    order_id: orderId || null,
    product_id: productId || null,
    customer_email: customerEmail.trim(),
    rating: Math.floor(ratingVal),
    comment: input.comment.trim(),
    is_approved: true,
    created_at: new Date().toISOString(),
  };

  const client = supabaseAdmin || supabase;
  if (client) {
    const dbRow = {
      order_id: newRow.order_id,
      product_id: newRow.product_id,
      customer_email: newRow.customer_email,
      rating: newRow.rating,
      comment: newRow.comment,
      is_approved: newRow.is_approved,
      created_at: newRow.created_at,
    };
    const { data, error } = await client.from('reviews').insert([dbRow]).select();
    if (error) {
      console.error("Supabase insert error:", error.message, error.details);
      throw new Error(`Database Error: ${error.message}`);
    }
    if (data && data.length > 0) return mapDatabaseReview(data[0] as DatabaseReviewRow);
  }

  inMemoryReviews.push(newRow);
  return mapDatabaseReview(newRow);
}

export async function approveReview(id: string): Promise<Review | null> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    const row = inMemoryReviews.find((r) => r.id === id);
    if (!row) return null;
    row.is_approved = true;
    return mapDatabaseReview(row);
  }
  const { data, error } = await client
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', id)
    .select();
  if (error || !data || data.length === 0) return null;
  return mapDatabaseReview(data[0] as DatabaseReviewRow);
}
