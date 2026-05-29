import { Ticket, CreateTicketInput } from '@/types/ticket';
import { supabase } from '@/lib/supabase';

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

let inMemoryTickets: DatabaseTicketRow[] = [
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

  return {
    id: row.id,
    userId: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

  const newRow: DatabaseTicketRow = {
    id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
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

  if (supabase) {
    const { data, error } = await supabase.from('tickets').insert(newRow).select().single();
    if (!error && data) return mapDatabaseTicket(data as DatabaseTicketRow);
  }

  inMemoryTickets.push(newRow);
  return mapDatabaseTicket(newRow);
}

export async function getTickets(): Promise<Ticket[]> {
  if (!supabase) return inMemoryTickets.map(mapDatabaseTicket);
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return inMemoryTickets.map(mapDatabaseTicket);
  return data.map((row) => mapDatabaseTicket(row as DatabaseTicketRow));
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  if (!supabase) {
    const row = inMemoryTickets.find((t) => t.id === id);
    return row ? mapDatabaseTicket(row) : null;
  }
  const { data, error } = await supabase.from('tickets').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapDatabaseTicket(data as DatabaseTicketRow);
}

export async function updateTicketStatus(
  id: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
): Promise<Ticket | null> {
  if (!supabase) {
    const row = inMemoryTickets.find((t) => t.id === id);
    if (!row) return null;
    row.status = status;
    row.updated_at = new Date().toISOString();
    return mapDatabaseTicket(row);
  }
  const { data, error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error || !data) return null;
  return mapDatabaseTicket(data as DatabaseTicketRow);
}
