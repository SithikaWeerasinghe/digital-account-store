import { NextResponse } from 'next/server';
import { sampleReviews } from '@/data/sampleReviews';

export async function GET() {
  return NextResponse.json(sampleReviews);
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Review created' }, { status: 201 });
}
