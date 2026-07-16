import { NextRequest, NextResponse } from 'next/server';
import * as reviewService from '@/lib/services/reviewService';
import * as orderService from '@/lib/services/orderService';
import { requireAdminAuth } from '@/lib/apiAuth';

/**
 * GET /api/reviews — split public/admin.
 *
 * `?all=true` returns UNPUBLISHED (pending-moderation) reviews and the isApproved
 * moderation flag, so it is ADMIN-ONLY (401 without a valid bearer token, 403 if
 * the user is not an admin). Every other read is public but returns APPROVED
 * reviews only, mapped through toPublicReview so the storefront never receives
 * moderation fields. No read path exposes a customer email — mapDatabaseReview
 * returns the review id as userId, never the address.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const productId = searchParams.get('productId');
  const all = searchParams.get('all');

  // Gate before any data is read: ?all=true is the only branch that returns
  // unpublished rows and the moderation flag.
  if (all === 'true') {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;
  }

  try {
    if (all === 'true') {
      return NextResponse.json({ success: true, data: await reviewService.getAllReviews() });
    }

    let reviews;
    if (type === 'website') {
      reviews = await reviewService.getWebsiteReviews();
    } else if (productId) {
      reviews = await reviewService.getReviewsByProductId(productId);
    } else {
      reviews = await reviewService.getApprovedReviews();
    }

    // Public: approved rows only (the service filters is_approved), minus the
    // moderation flag.
    return NextResponse.json({ success: true, data: reviews.map(reviewService.toPublicReview) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews — public, but the identity fields are SERVER-DERIVED.
 *
 * The browser sends only { order_id, rating, comment, display_name }. The
 * customer email and product id are resolved here from the order itself, so:
 *  - the public order endpoint never has to return the customer's email;
 *  - a caller cannot spoof someone else's email onto a review;
 *  - a caller cannot aim a review at a product that was never purchased;
 *  - order_id is finally validated to actually exist.
 * Any client-supplied customer_email / product_id is ignored.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderId: string = body?.order_id || body?.orderId || '';
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'A valid order reference is required' },
        { status: 400 }
      );
    }

    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // One review per order. This is the only abuse control that works reliably on
    // serverless (it is backed by the database, not per-instance memory), and it
    // caps how far the endpoint can be driven. It is a check-then-insert, so two
    // simultaneous submissions for the same order could still both land; a UNIQUE
    // index on reviews.order_id would close that, but needs a migration.
    const existing = await reviewService.getReviewByOrderId(order.id);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A review has already been submitted for this order.' },
        { status: 409 }
      );
    }

    const newReview = await reviewService.createReview({
      order_id: order.id,
      product_id: order.product_id || order.items?.[0]?.productId,
      customer_email: order.customer_email || order.userId,
      displayName: body?.display_name || body?.displayName,
      rating: body?.rating,
      comment: body?.comment,
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 400 }
    );
  }
}

/** PATCH /api/reviews — ADMIN ONLY. Approving a review publishes it storefront-wide. */
export async function PATCH(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
    }
    const updatedReview = await reviewService.approveReview(id);
    if (!updatedReview) {
      return NextResponse.json({ success: false, message: 'Review not found or failed to approve' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to approve review' },
      { status: 500 }
    );
  }
}

/** DELETE /api/reviews — ADMIN ONLY. Destructive and irreversible. */
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
    }
    const success = await reviewService.deleteReview(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Review not found or failed to delete' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}

