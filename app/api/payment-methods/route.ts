import { NextResponse } from 'next/server';
import * as paymentMethodService from '@/lib/services/paymentMethodService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/payment-methods
 *
 * Public — checkout needs to know which methods are active. Returns method_key,
 * display_name, description, is_active, maintenance_message, sort_order.
 * No secret payment keys are ever exposed.
 */
export async function GET() {
  try {
    const methods = await paymentMethodService.getActivePaymentMethods();
    const data = methods.map((m) => ({
      method_key: m.method_key,
      display_name: m.display_name,
      description: m.description,
      is_active: m.is_active,
      maintenance_message: m.maintenance_message,
      sort_order: m.sort_order,
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    // Never break checkout — fall back to defaults (all active).
    console.error('[api/payment-methods] Failed:', error?.message || error);
    const data = paymentMethodService.DEFAULT_PAYMENT_METHODS.map((m) => ({
      method_key: m.method_key,
      display_name: m.display_name,
      description: m.description,
      is_active: m.is_active,
      maintenance_message: m.maintenance_message,
      sort_order: m.sort_order,
    }));
    return NextResponse.json({ success: true, data });
  }
}
