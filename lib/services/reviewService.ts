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

// Demo/fallback fixtures, only used when Supabase is unconfigured or returns no
// rows. They carry a sentinel order_id so they still render as verified once
// verifiedPurchase is derived from order_id (below) — they are display data and
// never inserted into the database.
const inMemoryReviews: DatabaseReviewRow[] = sampleReviews.map((r) => ({
  id: r.id,
  order_id: `sample-${r.id}`,
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
    // NEVER expose the customer's email here. GET /api/reviews serves mapped
    // reviews to every visitor, so returning the email published it in bulk for
    // any row stored without the "email|name" pipe (blank name + all historical
    // rows). No UI reads review.userId — only review.userName is rendered.
    userId: row.id,
    userName,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    // Derived, not hardcoded. POST /api/reviews now resolves order_id against the
    // orders table before a review is created, so for every review written after
    // that change a non-null order_id means a real order was verified.
    // Caveat: rows created BEFORE that change carry an unvalidated, client-supplied
    // order_id, so their badge reflects "an order id was supplied", not "an order
    // was checked". Nothing here exposes the order or the customer either way.
    verifiedPurchase: !!row.order_id,
    isApproved: row.is_approved,
  };
}

/**
 * Public-facing review shape. Deliberately drops the moderation flag; the mapper
 * above already guarantees no customer email is present. Used for every
 * unauthenticated read so the storefront can never receive admin-only fields.
 */
export function toPublicReview(review: Review): Omit<Review, 'isApproved'> {
  const { isApproved, ...safe } = review;
  void isApproved;
  return safe;
}

/** One review per order — used to reject duplicate submissions. */
export async function getReviewByOrderId(orderId: string): Promise<Review | null> {
  if (!orderId) return null;
  const client = supabaseAdmin || supabase;
  if (!client) {
    const row = inMemoryReviews.find((r) => r.order_id === orderId);
    return row ? mapDatabaseReview(row) : null;
  }
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('order_id', orderId)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return mapDatabaseReview(data[0] as DatabaseReviewRow);
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

  // The customer_email column overloads two fields as "email|displayName".
  // mapDatabaseReview owns the decode (above), so the encode belongs here beside
  // it rather than in a route handler. '|' is stripped from the name because the
  // decode keeps only parts[1] — a name containing a pipe would silently truncate.
  const displayName = (input.displayName || '').replace(/\|/g, ' ').trim().slice(0, 60);
  const storedEmail = displayName
    ? `${customerEmail.trim()}|${displayName}`
    : customerEmail.trim();

  const newRow: DatabaseReviewRow = {
    id: `rev-${Math.random().toString(36).substring(2, 9)}`,
    order_id: orderId || null,
    product_id: productId || null,
    customer_email: storedEmail,
    rating: Math.floor(ratingVal),
    comment: input.comment.trim(),
    is_approved: false,
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

export async function getAllReviews(): Promise<Review[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return inMemoryReviews.map(mapDatabaseReview);
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return inMemoryReviews.map(mapDatabaseReview);
  return data.map((row) => mapDatabaseReview(row as DatabaseReviewRow));
}

export async function deleteReview(id: string): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    const index = inMemoryReviews.findIndex((r) => r.id === id);
    if (index === -1) return false;
    inMemoryReviews.splice(index, 1);
    return true;
  }
  const { error } = await client.from('reviews').delete().eq('id', id);
  return !error;
}
