import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import * as productService from '@/lib/services/productService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Try fetching by UUID ID first, then by invoice number
    let order = await orderService.getOrderById(id);
    if (!order) {
      order = await orderService.getOrderByInvoiceNumber(id);
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Find the product ID. Fall back to items list if root product_id is null.
    const productId = order.product_id || (order.items && order.items[0]?.productId);
    const product = productId ? await productService.getProductById(productId) : null;

    // Return non-sensitive details only
    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        invoiceNumber: order.invoice_number,
        customerEmail: order.customer_email || order.userId,
        productId: productId || null,
        productName: product ? product.name : 'Digital Purchase',
        amount: order.amount || order.totalAmount,
        paymentStatus: order.payment_status || order.status,
        deliveryStatus: order.delivery_status || 'pending',
        createdAt: order.createdAt || order.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
