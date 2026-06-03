import { NextResponse } from 'next/server';
import * as reviewService from '@/lib/services/reviewService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('productId');

    const all = searchParams.get('all');

    let reviews;
    if (all === 'true') {
      reviews = await reviewService.getAllReviews();
    } else if (type === 'website') {
      reviews = await reviewService.getWebsiteReviews();
    } else if (productId) {
      reviews = await reviewService.getReviewsByProductId(productId);
    } else {
      reviews = await reviewService.getApprovedReviews();
    }

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReview = await reviewService.createReview(body);

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
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

export async function DELETE(request: Request) {
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

