import { Ticket } from '@/types/ticket';

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

// Module-scoped in-memory store for support tickets
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
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
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
    updated_at: new Date().toISOString()
  }
];

/**
 * Maps a database ticket row to the frontend camelCase 'Ticket' type.
 * Incorporates priority defaults based on issue types and matches userId with email.
 */
export function mapDatabaseTicket(row: DatabaseTicketRow): Ticket {
  // Deduce priority dynamically for front-end rendering compatibility
  let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
  if (row.issue_type.toLowerCase().includes('payment') || row.issue_type.toLowerCase().includes('refund')) {
    priority = 'urgent';
  } else if (row.issue_type.toLowerCase().includes('not working') || row.issue_type.toLowerCase().includes('not received')) {
    priority = 'high';
  }

  return {
    id: row.id,
    userId: row.email, // Map email address as unique userId
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Creates a new support ticket.
 * Performs rigorous validations on mandatory input parameters.
 */
export async function createTicket(input: {
  name: string;
  email: string;
  orderId?: string;
  issueType: string;
  subject: string;
  message: string;
}): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Required Field Validations
  if (!input.name || !input.name.trim()) throw new Error('Name is required');
  if (!input.email || !input.email.trim() || !input.email.includes('@')) throw new Error('A valid email address is required');
  if (!input.issueType || !input.issueType.trim()) throw new Error('Issue Type is required');
  if (!input.subject || !input.subject.trim()) throw new Error('Subject is required');
  if (!input.message || !input.message.trim() || input.message.trim().length < 20) {
    throw new Error('Message is required and must be at least 20 characters long');
  }

  const newRow: DatabaseTicketRow = {
    id: `TKT-${Math.floor(100 + Math.random() * 900)}`, // Standardized ticket tracking tag
    name: input.name.trim(),
    email: input.email.trim(),
    order_id: input.orderId?.trim() || null,
    issue_type: input.issueType.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: 'open',
    admin_reply: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  inMemoryTickets.push(newRow);
  return mapDatabaseTicket(newRow);
}

/**
 * Fetches all tickets.
 */
export async function getTickets(): Promise<Ticket[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return inMemoryTickets.map(mapDatabaseTicket);
}

/**
 * Fetches a single ticket by its unique ID.
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const row = inMemoryTickets.find((t) => t.id === id);
  return row ? mapDatabaseTicket(row) : null;
}

/**
 * Updates a ticket status.
 */
export async function updateTicketStatus(
  id: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
): Promise<Ticket | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const row = inMemoryTickets.find((t) => t.id === id);
  if (!row) return null;

  row.status = status;
  row.updated_at = new Date().toISOString();
  return mapDatabaseTicket(row);
}
