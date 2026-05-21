import { NextResponse } from 'next/server';
import { sampleProducts } from '@/data/sampleProducts';

export async function GET() {
  return NextResponse.json(sampleProducts);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Placeholder logic
  return NextResponse.json({ message: 'Product created', product: body }, { status: 201 });
}
