import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Tickets endpoint placeholder' });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Ticket created' }, { status: 201 });
}
