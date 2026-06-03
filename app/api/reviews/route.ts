import { NextResponse } from 'next/server';
import * as reviewService from '@/lib/services/reviewService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('productId');

    let reviews;
    if (type === 'website') {
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

