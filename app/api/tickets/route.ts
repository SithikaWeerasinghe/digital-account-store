import { NextResponse } from 'next/server';
import * as ticketService from '@/lib/services/ticketService';

export async function GET() {
  try {
    const tickets = await ticketService.getTickets();
    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newTicket = await ticketService.createTicket(body);

    return NextResponse.json({ success: true, data: newTicket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit support ticket' },
      { status: 400 }
    );
  }
}
