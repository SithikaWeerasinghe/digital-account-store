import { NextRequest, NextResponse } from 'next/server';
import * as ticketService from '@/lib/services/ticketService';
import { requireAdminAuth } from '@/lib/apiAuth';
import { sendTicketReplyNotification } from '@/lib/services/emailService';

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

export async function PATCH(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, reply, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Ticket ID is required' }, { status: 400 });
    }
    if (!reply || reply.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Reply message is required' }, { status: 400 });
    }

    // 1. Save reply and status in DB
    const updatedTicket = await ticketService.replyToTicket(id, reply.trim(), status);
    if (!updatedTicket) {
      return NextResponse.json({ success: false, message: 'Ticket not found or update failed' }, { status: 404 });
    }

    // 2. Send email to customer
    try {
      await sendTicketReplyNotification(updatedTicket, reply.trim());
    } catch (emailErr: any) {
      console.error('[tickets PATCH] Failed to send notification email:', emailErr?.message || emailErr);
      // We do not fail the API response if only the email fails to send.
    }

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit ticket reply' },
      { status: 500 }
    );
  }
}
