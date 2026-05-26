export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export type CreateReviewInput = {
  orderId?: string;
  order_id?: string;
  productId?: string;
  product_id?: string;
  customerEmail?: string;
  customer_email?: string;
  rating: number;
  comment: string;
};
