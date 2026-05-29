export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  features: string[];
  inStock: boolean;
  isInstantDelivery: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  variants?: ProductVariant[];
}
