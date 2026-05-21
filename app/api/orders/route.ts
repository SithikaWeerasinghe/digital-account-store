import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Orders endpoint placeholder' });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Order created' }, { status: 201 });
}
