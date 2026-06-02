import { Product } from '@/types/product';
import { Review, CreateReviewInput } from '@/types/review';
import { Order, CreateOrderInput } from '@/types/order';
import { Ticket, CreateTicketInput } from '@/types/ticket';
import { AdminLoginInput } from '@/types/admin';

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

export async function fetchReviews(): Promise<Review[]> {
  return fetchApi<Review[]>('/api/reviews');
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

