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

// ── Payment methods (maintenance system) ──

export type PublicPaymentMethod = {
  method_key: 'card' | 'crypto' | 'manual';
  display_name: string;
  description: string | null;
  is_active: boolean;
  maintenance_message: string | null;
  sort_order: number;
};

/**
 * Public: fetch payment methods + active/maintenance state for checkout.
 * Never throws — returns an empty list on failure (checkout treats that as
 * "no maintenance info" and keeps the existing methods usable).
 */
export async function fetchPaymentMethods(): Promise<PublicPaymentMethod[]> {
  try {
    const response = await fetch('/api/payment-methods', { cache: 'no-store' });
    const data = await response.json();
    if (data?.success && Array.isArray(data.data)) return data.data as PublicPaymentMethod[];
  } catch {
    // ignore — fall through to empty list
  }
  return [];
}

// ── Manual crypto payment ──

export type CryptoWalletInfo = { id: string; coin: string; network: string; address: string };
export type CryptoConfigResult = { wallets: CryptoWalletInfo[]; supportNote: string; enabled: boolean };

/**
 * Fetches the store's configured crypto receiving wallets + support note.
 * Never throws — returns an empty/disabled config on failure so the crypto
 * instructions page always renders.
 */
export async function fetchCryptoConfig(): Promise<CryptoConfigResult> {
  try {
    const response = await fetch('/api/crypto/config', { cache: 'no-store' });
    const data = await response.json();
    if (data?.success && data.data) return data.data as CryptoConfigResult;
  } catch {
    // ignore — fall through to empty config
  }
  return { wallets: [], supportNote: '', enabled: false };
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

// ── OVGC (card) — provider switch ──

export type OvgcCheckoutResult = {
  success: boolean;
  code?: string; // provider_disabled | method_unavailable | not_configured | not_implemented | error
  message?: string;
  data?: { checkout_url: string; checkout_reference: string };
};

/**
 * Attempts an OVGC card checkout. Returns the raw response so the checkout page
 * can decide: redirect on success, fall back to Mercado Pago when OVGC is not
 * the active provider (provider_disabled), or show a safe "unavailable" message.
 */
export async function startOvgcCheckout(payload: {
  order_id: string;
  order_ids?: string[];
}): Promise<OvgcCheckoutResult> {
  try {
    const response = await fetch('/api/checkout/ovgc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });
    return (await response.json()) as OvgcCheckoutResult;
  } catch (error) {
    return {
      success: false,
      code: 'error',
      message: error instanceof Error ? error.message : 'Failed to start card checkout',
    };
  }
}

// ── NOWPayments (automatic crypto) ──

export type NowPaymentsCheckoutResult = {
  success: boolean;
  code?: string;
  message?: string;
  data?: {
    invoice_id: string;
    invoice_url: string;
    checkout_reference: string;
  };
};

/**
 * Starts a NOWPayments crypto checkout for the given order(s).
 * Does NOT throw on "not configured" — returns the raw response so the checkout
 * page can fall back to the manual crypto flow gracefully.
 */
export async function startNowPaymentsCheckout(payload: {
  order_id: string;
  order_ids?: string[];
}): Promise<NowPaymentsCheckoutResult> {
  try {
    const response = await fetch('/api/checkout/nowpayments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });
    return (await response.json()) as NowPaymentsCheckoutResult;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start crypto checkout',
    };
  }
}

// ── Categories ──

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Public: active categories for the storefront. Never throws (returns []). */
export async function fetchCategories(): Promise<CategoryDTO[]> {
  try {
    const response = await fetch('/api/categories', { cache: 'no-store' });
    const data = await response.json();
    if (data?.success && Array.isArray(data.data)) return data.data as CategoryDTO[];
  } catch {
    /* ignore */
  }
  return [];
}

/** Admin: all categories (incl. inactive). */
export async function fetchAdminCategories(): Promise<CategoryDTO[]> {
  return fetchAdminApi<CategoryDTO[]>('/api/admin/categories');
}

export type CategoryInput = {
  name?: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export async function createCategory(payload: CategoryInput): Promise<CategoryDTO> {
  return fetchAdminApi<CategoryDTO>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: string, payload: CategoryInput): Promise<CategoryDTO> {
  return fetchAdminApi<CategoryDTO>(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** Admin: delete a category. Throws with a friendly message if products use it. */
export async function deleteCategory(id: string): Promise<{ id: string }> {
  return fetchAdminApi<{ id: string }>(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  });
}

// ── Admin payment test tools (dev only) ──

/** Whether the admin payment test tools are enabled (server flag). Never throws. */
export async function fetchTestToolsEnabled(): Promise<boolean> {
  try {
    const result = await fetchAdminApi<{ paymentTestTools: boolean }>('/api/admin/test-tools');
    return !!result?.paymentTestTools;
  } catch {
    return false;
  }
}

/**
 * Admin-only: simulate a confirmed NOWPayments payment for a pending order.
 * Sends the Supabase Bearer token via fetchAdminApi. Throws on failure (incl.
 * delivery failure) so the caller can surface the message.
 */
export async function simulateNowPaymentsPaid(orderId: string): Promise<Order> {
  return fetchAdminApi<Order>(`/api/admin/orders/${orderId}/simulate-nowpayments-paid`, {
    method: 'POST',
  });
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

// ── Variant Inventory Stock Count (public) ──

export type InventoryCountResult = {
  product_id: string | null;
  product_option_id: string | null;
  available_count: number;
};

/**
 * Fetches the available stock count for a product (optionally scoped to a
 * selected option). Never throws — returns 0 on any failure so the product
 * page stays usable and falls back to the product's own inStock flag.
 */
export async function fetchInventoryCount(
  productId: string,
  productOptionId?: string
): Promise<InventoryCountResult> {
  try {
    const params = new URLSearchParams({ product_id: productId });
    if (productOptionId) params.append('product_option_id', productOptionId);
    const response = await fetch(`/api/inventory/count?${params.toString()}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return (
      (data?.data as InventoryCountResult) ?? {
        product_id: productId,
        product_option_id: productOptionId ?? null,
        available_count: 0,
      }
    );
  } catch {
    return { product_id: productId, product_option_id: productOptionId ?? null, available_count: 0 };
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
  // Admin needs archived products too, so they can be viewed/managed.
  return fetchApi<Product[]>('/api/products?all=true');
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
  usageInstructions?: string | null;
  guaranteeOptions?: { id: string; label: string; months: number; total_price: number; monthly_price: number; badge?: string }[] | null;
};

export async function createProduct(payload: ProductFormInput): Promise<Product> {
  return fetchApi<Product>('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: ProductFormInput): Promise<Product> {
  // Admin route — must send the Supabase Bearer token via fetchAdminApi.
  return fetchAdminApi<Product>(`/api/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(
  id: string
): Promise<{ id: string; archived: boolean; message?: string }> {
  // Admin route — must send the Supabase Bearer token via fetchAdminApi.
  return fetchAdminApi<{ id: string; archived: boolean; message?: string }>(
    `/api/admin/products/${id}`,
    { method: 'DELETE' }
  );
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

export async function replyToTicket(
  id: string,
  reply: string,
  status?: 'open' | 'in_progress' | 'resolved' | 'closed'
): Promise<Ticket> {
  return fetchAdminApi<Ticket>('/api/tickets', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, reply, status }),
  });
}

export async function fetchAdminTickets(): Promise<Ticket[]> {
  return fetchApi<Ticket[]>('/api/tickets');
}

export async function fetchAdminReviews(): Promise<Review[]> {
  return fetchApi<Review[]>('/api/reviews?all=true');
}

export async function approveAdminReview(id: string): Promise<any> {
  return fetchApi('/api/reviews', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

export async function deleteAdminReview(id: string): Promise<any> {
  return fetchApi(`/api/reviews?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
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

