import { NextResponse } from 'next/server';
import * as reviewService from '@/lib/services/reviewService';

export async function GET() {
  try {
    const reviews = await reviewService.getApprovedReviews();
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
    const { orderId, productId, customerEmail, rating, comment } = body;

    const newReview = await reviewService.createReview({
      orderId,
      productId,
      customerEmail,
      rating: Number(rating),
      comment
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 400 }
    );
  }
}

