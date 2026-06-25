import { Ticket, CreateTicketInput, TicketReplyEntry } from '@/types/ticket';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * The conversation thread is stored in the existing `admin_reply` TEXT column as
 * a JSON array of {sender,text,at}, so EVERY admin reply is preserved instead of
 * overwriting the previous one (no DB migration needed). Legacy tickets whose
 * `admin_reply` is plain text are read as a single admin message.
 */
function parseThread(rawAdminReply: string | null, fallbackAt: string): TicketReplyEntry[] {
  if (!rawAdminReply || !rawAdminReply.trim()) return [];
  try {
    const parsed = JSON.parse(rawAdminReply);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((m) => m && typeof m.text === 'string' && m.text.length > 0)
        .map((m) => ({
          sender: m.sender === 'customer' ? 'customer' : 'admin',
          text: String(m.text),
          at: typeof m.at === 'string' && m.at ? m.at : fallbackAt,
        }));
    }
  } catch {
    /* not JSON → a legacy single plain-text reply */
  }
  return [{ sender: 'admin', text: rawAdminReply, at: fallbackAt }];
}

export interface DatabaseTicketRow {
  id: string;
  name: string;
  email: string;
  order_id: string | null;
  issue_type: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

const inMemoryTickets: DatabaseTicketRow[] = [
  {
    id: 'TKT-001',
    name: 'John Doe',
    email: 'john@example.com',
    order_id: 'ord-123',
    issue_type: 'Product not working',
    subject: 'Product key not working',
    message: 'I purchased the office productivity pack but the activation serial number returns an error when submitting. Please help.',
    status: 'open',
    admin_reply: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'TKT-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    order_id: null,
    issue_type: 'General question',
    subject: 'How to activate streaming account?',
    message: 'Can you please guide me on how to register my dedicated profile on multiple streaming devices?',
    status: 'in_progress',
    admin_reply: 'Our team is reviewing this case.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function mapDatabaseTicket(row: DatabaseTicketRow): Ticket {
  let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
  if (row.issue_type.toLowerCase().includes('payment') || row.issue_type.toLowerCase().includes('refund')) priority = 'urgent';
  else if (row.issue_type.toLowerCase().includes('not working') || row.issue_type.toLowerCase().includes('not received')) priority = 'high';

  const messages = parseThread(row.admin_reply, row.updated_at);
  const latestAdminReply = [...messages].reverse().find((m) => m.sender === 'admin')?.text ?? null;

  return {
    id: row.id,
    userId: row.email,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    issueType: row.issue_type,
    adminReply: latestAdminReply,
    messages,
  };
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const orderId = input.orderId || input.order_id;
  const issueType = input.issueType || input.issue_type;

  if (!input.name?.trim()) throw new Error('Name is required');
  if (!input.email?.trim() || !input.email.includes('@')) throw new Error('A valid email address is required');
  if (!issueType?.trim()) throw new Error('Issue Type is required');
  if (!input.subject?.trim()) throw new Error('Subject is required');
  if (!input.message?.trim() || input.message.trim().length < 20) throw new Error('Message must be at least 20 characters');

  const ticketId = crypto.randomUUID();

  const client = supabaseAdmin || supabase;
  if (client) {
    let dbOrderId: string | null = null;
    if (orderId?.trim()) {
      // If it is a valid UUID, use it directly
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId.trim())) {
        dbOrderId = orderId.trim();
      } else {
        // Try searching orders by invoice_number (e.g. ORD-12345)
        const { data: orderData } = await client
          .from('orders')
          .select('id')
          .eq('invoice_number', orderId.trim())
          .maybeSingle();
        if (orderData) {
          dbOrderId = orderData.id;
        }
      }
    }

    const dbRow = {
      id: ticketId,
      name: input.name.trim(),
      email: input.email.trim(),
      order_id: dbOrderId,
      issue_type: issueType.trim(),
      subject: input.subject.trim(),
      message: input.message.trim(),
      status: 'open',
      admin_reply: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client.from('tickets').insert([dbRow]).select();
    if (error) {
      console.error("Supabase ticket insert error:", error.message, error.details);
      throw new Error(`Database Error: ${error.message}`);
    }
    if (data && data.length > 0) {
      return mapDatabaseTicket(data[0] as DatabaseTicketRow);
    }
  }

  // Fallback to in-memory store
  const newRow: DatabaseTicketRow = {
    id: ticketId,
    name: input.name.trim(),
    email: input.email.trim(),
    order_id: orderId?.trim() || null,
    issue_type: issueType.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: 'open',
    admin_reply: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inMemoryTickets.push(newRow);
  return mapDatabaseTicket(newRow);
}

export async function getTickets(): Promise<Ticket[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return inMemoryTickets.map(mapDatabaseTicket);
  const { data, error } = await client
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return inMemoryTickets.map(mapDatabaseTicket);
  return data.map((row) => mapDatabaseTicket(row as DatabaseTicketRow));
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    const row = inMemoryTickets.find((t) => t.id === id);
    return row ? mapDatabaseTicket(row) : null;
  }
  const { data, error } = await client.from('tickets').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return mapDatabaseTicket(data as DatabaseTicketRow);
}

export async function updateTicketStatus(
  id: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
): Promise<Ticket | null> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    const row = inMemoryTickets.find((t) => t.id === id);
    if (!row) return null;
    row.status = status;
    row.updated_at = new Date().toISOString();
    return mapDatabaseTicket(row);
  }
  const { data, error } = await client
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error || !data || data.length === 0) return null;
  return mapDatabaseTicket(data[0] as DatabaseTicketRow);
}

export async function replyToTicket(
  id: string,
  replyText: string,
  status?: 'open' | 'in_progress' | 'resolved' | 'closed'
): Promise<Ticket | null> {
  const client = supabaseAdmin || supabase;
  const now = new Date().toISOString();
  const newEntry: TicketReplyEntry = { sender: 'admin', text: replyText, at: now };

  // In-memory: append to the existing thread instead of overwriting it.
  if (!client) {
    const row = inMemoryTickets.find((t) => t.id === id);
    if (!row) return null;
    const thread = [...parseThread(row.admin_reply, row.updated_at), newEntry];
    row.admin_reply = JSON.stringify(thread);
    if (status) row.status = status;
    row.updated_at = now;
    return mapDatabaseTicket(row);
  }

  // DB: read the current thread first, append the new reply, then persist —
  // so earlier replies are never lost (the whole conversation is kept).
  const { data: existing, error: fetchErr } = await client
    .from('tickets')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (fetchErr || !existing) {
    console.error('Supabase ticket reply lookup error:', fetchErr?.message);
    return null;
  }
  const existingRow = existing as DatabaseTicketRow;
  const thread = [...parseThread(existingRow.admin_reply, existingRow.updated_at), newEntry];

  const updateData: any = {
    admin_reply: JSON.stringify(thread),
    updated_at: now,
  };
  if (status) updateData.status = status;

  const { data, error } = await client
    .from('tickets')
    .update(updateData)
    .eq('id', id)
    .select();
  if (error || !data || data.length === 0) {
    console.error('Supabase ticket reply error:', error?.message);
    return null;
  }
  return mapDatabaseTicket(data[0] as DatabaseTicketRow);
}
