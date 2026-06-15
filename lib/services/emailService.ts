import { Order } from '@/types/order';
import { InventoryItem } from '@/types/inventory';
import {
  buildOrderConfirmationEmail,
  buildAdminNotificationEmail,
  buildDeliveryEmail,
  buildTicketReplyEmail,
  buildTicketConfirmationEmail,
  buildTicketAdminNotificationEmail,
  buildAdminDeliveryEmail,
} from '@/lib/email/templates';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Accept either naming so env vars work whether set as RESEND_FROM_EMAIL/FROM_EMAIL
// or ADMIN_NOTIFICATION_EMAIL/ADMIN_EMAIL.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'ApexFled <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
// Where customer support ticket notifications go. SUPPORT_EMAIL takes priority,
// then falls back to the admin address. No fake default — if neither is set,
// the admin ticket email is safely skipped (and logged).
const SUPPORT_NOTIFY_EMAIL = process.env.SUPPORT_EMAIL || ADMIN_EMAIL;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/** Context for safe structured logging — never includes keys or email bodies. */
interface EmailMeta {
  type?: string;
  reference?: string;
}

function orderRef(order: { invoice_number?: string; id?: string }): string {
  return order.invoice_number || order.id || 'unknown';
}

export interface SendEmailResult {
  success: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

/** True when a Resend API key is configured. */
export function isEmailConfigured(): boolean {
  return !!RESEND_API_KEY;
}

/**
 * Low-level send via the Resend REST API.
 * Uses fetch (no SDK dependency). When no key is configured it logs and
 * returns { skipped: true } so callers never crash in dev / pre-launch.
 */
export async function sendEmail(params: SendEmailParams, meta: EmailMeta = {}): Promise<SendEmailResult> {
  const type = meta.type || 'email';
  const refSuffix = meta.reference ? ` for ${meta.reference}` : '';

  if (!RESEND_API_KEY) {
    console.warn(`[email] skipped ${type} to ${params.to}${refSuffix} — RESEND_API_KEY not set`);
    return { success: false, skipped: true };
  }

  console.log(`[email] sending ${type} to ${params.to}${refSuffix}`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.message || data?.error || `Resend API error: ${response.status}`;
      console.error(`[email] failed ${type} to ${params.to}${refSuffix}: ${message}`);
      return { success: false, error: message };
    }

    console.log(`[email] sent ${type} to ${params.to}${refSuffix} (id ${data?.id || 'n/a'})`);
    return { success: true, id: data?.id };
  } catch (error: any) {
    const message = error?.message || 'Failed to send email';
    console.error(`[email] failed ${type} to ${params.to}${refSuffix}: ${message}`);
    return { success: false, error: message };
  }
}

/**
 * Sends the customer order confirmation. Optionally includes digital
 * credentials/delivery content.
 */
export async function sendOrderConfirmation(
  order: Order,
  credentials?: string
): Promise<SendEmailResult> {
  const email = buildOrderConfirmationEmail(order, { credentials });
  return sendEmail(email, { type: 'customer_order_confirmation', reference: orderRef(order) });
}

/**
 * Sends the internal new-order notification to the store owner, if an
 * ADMIN_NOTIFICATION_EMAIL / ADMIN_EMAIL is configured. No-ops otherwise.
 */
export async function sendAdminNotification(order: Order): Promise<SendEmailResult> {
  if (!ADMIN_EMAIL) {
    console.warn(`[email] skipped admin_new_order for ${orderRef(order)} — ADMIN_EMAIL not set`);
    return { success: false, skipped: true };
  }
  const email = buildAdminNotificationEmail(order, ADMIN_EMAIL);
  return sendEmail(email, { type: 'admin_new_order', reference: orderRef(order) });
}

/**
 * Sends delivery email with digital access details to the customer.
 * Called after inventory item(s) have been assigned to an order. When several
 * items are delivered for a multi-quantity order, pass the combined credentials
 * via `deliveryContent`.
 */
export async function sendDeliveryEmail(params: {
  order: Order;
  inventoryItem: InventoryItem;
  productName?: string;
  usageInstructions?: string | null;
  /** Combined delivery content (e.g. several accounts). Falls back to the item's own. */
  deliveryContent?: string;
}): Promise<SendEmailResult> {
  const content = params.deliveryContent ?? params.inventoryItem.delivery_content;
  const email = buildDeliveryEmail(
    params.order,
    content,
    params.productName,
    params.usageInstructions
  );
  return sendEmail(email, { type: 'customer_delivery', reference: orderRef(params.order) });
}

/**
 * Notifies the admin of a delivery outcome (success / failed / short inventory),
 * so failed auto-deliveries can be handled manually. No-ops if no admin address.
 */
export async function sendAdminDeliveryNotification(
  order: Order,
  info: { ok: boolean; deliveredCount?: number; requestedCount?: number; reason?: string }
): Promise<SendEmailResult> {
  if (!ADMIN_EMAIL) {
    console.warn(`[email] skipped admin_delivery for ${orderRef(order)} — ADMIN_EMAIL not set`);
    return { success: false, skipped: true };
  }
  const email = buildAdminDeliveryEmail(order, ADMIN_EMAIL, info);
  return sendEmail(email, {
    type: info.ok ? 'admin_delivery_success' : 'admin_delivery_failed',
    reference: orderRef(order),
  });
}

/**
 * Customer confirmation email sent when a support ticket is created.
 */
export async function sendTicketConfirmation(ticket: any): Promise<SendEmailResult> {
  const recipient = ticket?.email || ticket?.userId;
  if (!recipient) {
    console.warn('[email] skipped customer_ticket_confirmation — ticket has no email');
    return { success: false, skipped: true };
  }
  const email = buildTicketConfirmationEmail(ticket);
  return sendEmail(email, {
    type: 'customer_ticket_confirmation',
    reference: `TKT-${String(ticket?.id || '').substring(0, 8).toUpperCase()}`,
  });
}

/**
 * Admin/support notification email sent when a support ticket is created.
 * Routed to SUPPORT_EMAIL if set, otherwise ADMIN_EMAIL.
 */
export async function sendTicketAdminNotification(ticket: any): Promise<SendEmailResult> {
  const ref = `TKT-${String(ticket?.id || '').substring(0, 8).toUpperCase()}`;
  if (!SUPPORT_NOTIFY_EMAIL) {
    console.warn(`[email] skipped admin_ticket_notification for ${ref} — neither SUPPORT_EMAIL nor ADMIN_EMAIL set`);
    return { success: false, skipped: true };
  }
  const email = buildTicketAdminNotificationEmail(ticket, SUPPORT_NOTIFY_EMAIL);
  return sendEmail(email, { type: 'admin_ticket_notification', reference: ref });
}

/**
 * Sends a ticket reply notification email to the customer.
 */
export async function sendTicketReplyNotification(
  ticket: any,
  replyText: string
): Promise<SendEmailResult> {
  const email = buildTicketReplyEmail(ticket, replyText);
  return sendEmail(email, {
    type: 'customer_ticket_reply',
    reference: `TKT-${String(ticket?.id || '').substring(0, 8).toUpperCase()}`,
  });
}
