import { Product } from './product';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  // Database-style/snake_case compatibility
  invoice_number?: string;
  customer_email?: string;
  product_id?: string;
  quantity?: number;
  amount?: number;
  payment_method?: 'card' | 'crypto' | 'manual';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status?: 'pending' | 'delivered' | 'failed';
  created_at?: string;
  // Coupon / discount fields (null/undefined when no coupon was used)
  discount_code?: string | null;
  discount_amount?: number;
  original_amount?: number | null;
  final_amount?: number | null;
  // Stripe integration fields (DEPRECATED — Stripe is no longer used)
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  paid_at?: string | null;
  // Mercado Pago integration fields (ACTIVE gateway)
  mercadopago_preference_id?: string | null;
  mercadopago_payment_id?: string | null;
  mercadopago_merchant_order_id?: string | null;
  mercadopago_status?: string | null;
  // Product options and guarantee metadata
  order_metadata?: {
    product_option?: {
      id: string;
      label: string;
      price?: number;
    };
    guarantee?: {
      id: string;
      label: string;
      months?: number;
      total_price?: number;
      monthly_price?: number;
    };
    [key: string]: unknown;
  } | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  price: number;
  quantity: number;
}

export type CreateOrderInput = {
  customerEmail?: string;
  customer_email?: string;
  productId?: string;
  product_id?: string;
  quantity?: number;
  amount?: number;
  paymentMethod?: 'card' | 'crypto' | 'manual';
  payment_method?: 'card' | 'crypto' | 'manual';
  // Product option and guarantee selection
  selectedOptionId?: string;
  selectedOptionLabel?: string;
  selectedOptionPrice?: number;
  selectedGuaranteeId?: string;
  selectedGuaranteeLabel?: string;
  selectedGuaranteeMonths?: number;
  selectedGuaranteeTotalPrice?: number;
  selectedGuaranteeMonthlyPrice?: number;
  // Coupon / discount (computed per-order share, passed from checkout)
  discountCode?: string | null;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  /** When true, this order's creation increments the coupon's used_count (set on first order of a checkout only). */
  incrementCoupon?: boolean;
};
