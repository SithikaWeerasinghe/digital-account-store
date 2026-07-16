export interface Review {
  id: string;
  productId: string | null;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  isApproved?: boolean;
}

/**
 * SERVICE-INTERNAL review input. The customer email here is SERVER-DERIVED from
 * the order (see POST /api/reviews) — it is never accepted from the browser.
 */
export type CreateReviewInput = {
  orderId?: string;
  order_id?: string;
  productId?: string;
  product_id?: string;
  customerEmail?: string;
  customer_email?: string;
  /** Free-text display name; createReview encodes it alongside the email. */
  displayName?: string;
  rating: number;
  comment: string;
};

/**
 * CLIENT-FACING review input. Deliberately carries NO customer email and no
 * product id: the server resolves both from order_id so neither can be spoofed,
 * and so the public order endpoint never has to hand the email to the browser.
 */
export type SubmitReviewInput = {
  order_id: string;
  rating: number;
  comment: string;
  display_name: string;
};
