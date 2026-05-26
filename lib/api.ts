import { Product } from '@/types/product';
import { Review, CreateReviewInput } from '@/types/review';
import { CreateOrderInput } from '@/types/order';
import { CreateTicketInput } from '@/types/ticket';
import { AdminLoginInput } from '@/types/admin';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
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
