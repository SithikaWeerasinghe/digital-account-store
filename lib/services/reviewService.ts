import { Review, CreateReviewInput } from '@/types/review';
import { sampleReviews } from '@/data/sampleReviews';

// Database-style review representation
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

// Convert sampleReviews into DatabaseReviewRow format for in-memory tracking
let inMemoryReviews: DatabaseReviewRow[] = sampleReviews.map((r) => ({
  id: r.id,
  order_id: null,
  product_id: r.productId,
  customer_email: r.userId.includes('@') ? r.userId : `${r.userId}@example.com`,
  rating: r.rating,
  comment: r.comment,
  is_approved: true, // Initial mock reviews are pre-approved
  created_at: r.createdAt
}));

/**
 * Maps a database review row to the frontend camelCase 'Review' model.
 * Derives user display name from customer email securely.
 */
export function mapDatabaseReview(row: DatabaseReviewRow): Review {
  // Extract display name from email (e.g., alex.smith@example.com -> Alex Smith)
  const namePart = row.customer_email.split('@')[0] || 'Anonymous';
  const userName = namePart
    .split(/[\._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: row.id,
    productId: row.product_id,
    userId: row.customer_email,
    userName: userName,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    verifiedPurchase: true // Mocked purchases are treated as verified
  };
}

/**
 * Gets all approved reviews.
 */
export async function getApprovedReviews(): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return inMemoryReviews
    .filter((r) => r.is_approved)
    .map(mapDatabaseReview);
}

/**
 * Gets reviews for a specific product.
 * Filters public results strictly to approved entries.
 */
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return inMemoryReviews
    .filter((r) => r.product_id === productId && r.is_approved)
    .map(mapDatabaseReview);
}

/**
 * Creates a new review.
 * Default approved status is false (pending approval).
 */
export async function createReview(input: CreateReviewInput): Promise<Review> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const orderId = input.orderId || input.order_id;
  const productId = input.productId || input.product_id;
  const customerEmail = input.customerEmail || input.customer_email;

  const ratingVal = Number(input.rating);
  if (!productId) throw new Error('Product ID is required');
  if (!customerEmail || !customerEmail.includes('@')) throw new Error('A valid email is required');
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) throw new Error('Rating must be between 1 and 5');
  if (!input.comment || !input.comment.trim()) throw new Error('Comment is required');

  const newRow: DatabaseReviewRow = {
    id: `rev-${Math.random().toString(36).substring(2, 9)}`,
    order_id: orderId || null,
    product_id: productId,
    customer_email: customerEmail.trim(),
    rating: Math.floor(ratingVal),
    comment: input.comment.trim(),
    is_approved: false, // Default is unapproved (requires moderation)
    created_at: new Date().toISOString()
  };

  inMemoryReviews.push(newRow);
  return mapDatabaseReview(newRow);
}

/**
 * Approves a review (Admin function).
 */
export async function approveReview(id: string): Promise<Review | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const row = inMemoryReviews.find((r) => r.id === id);
  if (!row) return null;

  row.is_approved = true;
  return mapDatabaseReview(row);
}
