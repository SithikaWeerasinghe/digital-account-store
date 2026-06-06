export type PaymentMethodKey = 'card' | 'crypto' | 'manual';

export interface PaymentMethod {
  id: string;
  method_key: PaymentMethodKey;
  display_name: string;
  description: string | null;
  is_active: boolean;
  maintenance_message: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UpdatePaymentMethodInput {
  display_name?: string;
  description?: string | null;
  is_active?: boolean;
  maintenance_message?: string | null;
  sort_order?: number;
}
