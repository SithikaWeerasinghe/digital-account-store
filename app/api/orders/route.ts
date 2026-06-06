import { NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';

export async function GET() {
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
    const isValidationError = validationErrors.includes(error.message) || isMaintenanceError;
    const status = isValidationError ? 400 : 500;

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process checkout order' },
      { status }
    );
  }
}
