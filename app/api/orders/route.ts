import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { requireAdminAuth } from '@/lib/apiAuth';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';

/**
 * GET /api/orders — ADMIN ONLY.
 *
 * Returns every order (customer emails, invoice numbers, totals, payment state)
 * and reads through the service-role client, which bypasses Row-Level Security.
 * It must therefore never be reachable without an admin bearer token: an
 * unauthenticated caller previously received the entire order table.
 * Unauthorized requests get 401 (no token / bad token) or 403 (not an admin).
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const orders = await orderService.getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders — PUBLIC by design.
 *
 * Checkout must create orders before the customer has any session, so this stays
 * unauthenticated. Behaviour is unchanged: all authoritative validation (product
 * lookup, exact product+option+guarantee stock gate, coupon re-validation,
 * payment-method maintenance gate) remains server-side in orderService.createOrder(),
 * so a direct POST still cannot bypass it.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create new order using order service layer
    const newOrder = await orderService.createOrder(body);

    // Fire confirmation + admin notification emails (best-effort, never blocks
    // or fails the order if email is not yet configured).
    try {
      await Promise.all([
        sendOrderConfirmation(newOrder),
        sendAdminNotification(newOrder),
      ]);
    } catch (emailErr) {
      console.error('[orders] Email dispatch failed (order still created):', emailErr);
    }

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    // Differentiate between validation errors (400) and unexpected errors (500)
    const validationErrors = [
      'A valid customer email is required',
      'Product ID is required',
      'Quantity must be at least 1',
      'Amount must be greater than 0',
      'Payment method must be card, crypto, or manual',
      'Product not found'
    ];
    
    const isMaintenanceError =
      typeof error.message === 'string' && error.message.includes('temporarily unavailable');
    // Out-of-stock at order creation → 409 Conflict (stock changed / insufficient).
    const isStockError =
      typeof error.message === 'string' && error.message.includes('Please update your cart');
    // Cart references a removed/hidden product → a clear, actionable 400.
    const isUnavailableProduct =
      typeof error.message === 'string' && error.message.includes('no longer available');
    const isValidationError =
      validationErrors.includes(error.message) || isMaintenanceError || isUnavailableProduct;
    const status = isStockError ? 409 : isValidationError ? 400 : 500;

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process checkout order' },
      { status }
    );
  }
}
