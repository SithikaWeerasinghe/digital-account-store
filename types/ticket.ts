/** One message in a ticket's conversation thread. */
export interface TicketReplyEntry {
  sender: 'admin' | 'customer';
  text: string;
  at: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  name?: string;
  issueType?: string;
  /** Latest admin reply text (back-compat). The full thread is in `messages`. */
  adminReply?: string | null;
  /** Ordered conversation thread (all admin replies, oldest first). */
  messages?: TicketReplyEntry[];
  email?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export type CreateTicketInput = {
  name: string;
  email: string;
  orderId?: string;
  order_id?: string;
  issueType?: string;
  issue_type?: string;
  subject: string;
  message: string;
};
