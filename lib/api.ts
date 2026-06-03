import { Product } from '@/types/product';
import { Review, CreateReviewInput } from '@/types/review';
import { Order, CreateOrderInput } from '@/types/order';
import { Ticket, CreateTicketInput } from '@/types/ticket';
import { AdminLoginInput } from '@/types/admin';
import { PromoBanner, PromoPlacement } from '@/types/promo';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
    });
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }
    
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred.');
  }
}

export async function fetchProducts(): Promise<Product[]> {
  return fetchApi<Product[]>('/api/products');
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return fetchApi<Product>(`/api/products/${slug}`);
}

export async function fetchReviews(params?: { type?: 'website' | 'product'; productId?: string }): Promise<Review[]> {
  let url = '/api/reviews';
  if (params) {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.productId) query.append('productId', params.productId);
    url += `?${query.toString()}`;
  }
  return fetchApi<Review[]>(url);
}

export async function fetchOrders(): Promise<Order[]> {
  return fetchApi<Order[]>('/api/orders');
}

export async function fetchTickets(): Promise<Ticket[]> {
  return fetchApi<Ticket[]>('/api/tickets');
}

export async function createOrder(payload: CreateOrderInput): Promise<any> {
  return fetchApi('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ── Mercado Pago Checkout Pro ──

export type MercadoPagoCheckoutResult = {
  success: boolean;
  code?: string;
  message?: string;
  data?: {
    preference_id: string;
    init_point: string;
    sandbox_init_point?: string;
  };
};

/**
 * Starts a Mercado Pago Checkout Pro session for the given order(s).
 * Does NOT throw on "not configured" — returns the raw response so the
 * checkout page can fall back to the manual/pending flow gracefully.
 */
export async function startMercadoPagoCheckout(payload: {
  order_id: string;
  order_ids?: string[];
}): Promise<MercadoPagoCheckoutResult> {
  try {
    const response = await fetch('/api/checkout/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });
    return (await response.json()) as MercadoPagoCheckoutResult;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start Mercado Pago checkout',
    };
  }
}

// ── Coupons / Discounts ──

export type ApplyDiscountResult = {
  valid: boolean;
  code?: string;
  discount_amount?: number;
  original_amount?: number;
  final_amount?: number;
  message?: string;
};

/**
 * Validates a coupon code against the current cart total.
 * Returns the calculation result; never throws on an invalid coupon
 * (the `valid` flag carries the outcome).
 */
export async function validateCoupon(code: string, cartTotal: number): Promise<ApplyDiscountResult> {
  try {
    const response = await fetch('/api/discounts/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ code, cartTotal }),
    });
    const data = await response.json();
    return (data?.data as ApplyDiscountResult) ?? { valid: false, message: 'Could not validate coupon.' };
  } catch {
    return { valid: false, message: 'Could not validate coupon. Please try again.' };
  }
}

// ── Promo Banners (public) ──

/**
 * Fetches active promo banners for a placement (always includes global banners).
 * Never throws — returns an empty array on any failure so pages never break.
 */
export async function fetchActivePromos(placement: PromoPlacement): Promise<PromoBanner[]> {
  try {
    const response = await fetch(`/api/promos?placement=${encodeURIComponent(placement)}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return (data?.data as PromoBanner[]) ?? [];
  } catch {
    return [];
  }
}

export async function createTicket(payload: CreateTicketInput): Promise<any> {
  return fetchApi('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createReview(payload: CreateReviewInput): Promise<any> {
  return fetchApi('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function adminLogin(payload: AdminLoginInput): Promise<any> {
  return fetchApi('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminProducts(): Promise<Product[]> {
  return fetchApi<Product[]>('/api/products');
}

// ── Admin Product CRUD ──

export type ProductFormInput = {
  name: string;
  category: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string;
  features?: string[];
  inStock?: boolean;
  isInstantDelivery?: boolean;
  variants?: { id: string; label: string; price: number; originalPrice?: number }[] | null;
};

export async function createProduct(payload: ProductFormInput): Promise<Product> {
  return fetchApi<Product>('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: ProductFormInput): Promise<Product> {
  return fetchApi<Product>(`/api/admin/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string): Promise<{ id: string }> {
  return fetchApi<{ id: string }>(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchAdminOrders(): Promise<Order[]> {
  return fetchApi<Order[]>('/api/orders');
}

export async function fetchAdminOrderById(id: string): Promise<Order> {
  return fetchApi<Order>(`/api/admin/orders/${id}`);
}

export type OrderStatusUpdate = {
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status?: 'pending' | 'delivered' | 'failed';
};

export async function updateOrderStatus(id: string, payload: OrderStatusUpdate): Promise<Order> {
  return fetchApi<Order>(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function resendOrderEmail(id: string, credentials?: string): Promise<{ id?: string }> {
  return fetchApi<{ id?: string }>(`/api/admin/orders/${id}/resend-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials }),
  });
}

export async function fetchAdminTickets(): Promise<Ticket[]> {
  return fetchApi<Ticket[]>('/api/tickets');
}

export async function fetchAdminReviews(): Promise<Review[]> {
  return fetchApi<Review[]>('/api/reviews');
}

/**
 * Fetch admin API with Supabase auth token in Authorization header.
 * Call this from client-side admin pages when making requests to admin API routes.
 */
export async function fetchAdminApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    // Import Supabase client dynamically to avoid SSR issues
    const { supabase } = await import('@/lib/supabase');

    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    // Get the current session's access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      throw new Error('No authentication session. Please log in again.');
    }

    // Make the request with the Bearer token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred.');
  }
}

