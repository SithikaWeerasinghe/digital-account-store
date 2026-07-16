import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import * as productService from '@/lib/services/productService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders/[id] — PUBLIC, but deliberately minimal.
 *
 * The checkout success page runs straight after an off-site payment redirect and
 * has no session, so this cannot be admin-gated. Two invariants keep it safe:
 *
 *  1. KEYED ON ORDER ID ONLY. The invoice-number fallback is gone: invoice
 *     numbers are INV-<date>-<1000..9999> (orderService.generateInvoiceNumber),
 *     i.e. only 9000 combinations per day, so they were trivially enumerable.
 *  2. NO PII IN THE RESPONSE. This is the primary control, not id secrecy —
 *     order ids are currently generated with Math.random(), so they are NOT a
 *     cryptographic secret. Even a successful guess must yield nothing worth
 *     stealing: no customer email, no amount, no payment/delivery state, no
 *     invoice number, no delivery credentials, no order metadata.
 *
 * The success page only needs these three fields (it renders the product name
 * and submits a review keyed on the order id); the review's customer email is
 * derived server-side in POST /api/reviews, never returned to the browser.
 */
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

    // Order id only — never an invoice number (see invariant 1 above).
    const order = await orderService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Find the product ID. Fall back to items list if root product_id is null.
    const productId = order.product_id || (order.items && order.items[0]?.productId);
    const product = productId ? await productService.getProductById(productId) : null;

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        productId: productId || null,
        productName: product ? product.name : 'Digital Purchase',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
