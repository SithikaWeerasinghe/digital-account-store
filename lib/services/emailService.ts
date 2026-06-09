import { Order } from '@/types/order';
import { InventoryItem } from '@/types/inventory';
import {
  buildOrderConfirmationEmail,
  buildAdminNotificationEmail,
  buildDeliveryEmail,
  buildTicketReplyEmail,
} from '@/lib/email/templates';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ApexFled <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
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
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.log(`[emailService] RESEND_API_KEY not set — skipping email to ${params.to} ("${params.subject}")`);
    return { success: false, skipped: true };
  }

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
      const message = data?.message || `Resend API error: ${response.status}`;
      console.error('[emailService] Send failed:', message);
      return { success: false, error: message };
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('[emailService] Send error:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to send email' };
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
  return sendEmail(email);
}

/**
 * Sends the internal new-order notification to the store owner, if an
 * ADMIN_NOTIFICATION_EMAIL is configured. No-ops otherwise.
 */
export async function sendAdminNotification(order: Order): Promise<SendEmailResult> {
  if (!ADMIN_EMAIL) {
    return { success: false, skipped: true };
  }
  const email = buildAdminNotificationEmail(order, ADMIN_EMAIL);
  return sendEmail(email);
}

/**
 * Sends delivery email with digital access details to the customer.
 * Called after an inventory item has been assigned to an order.
 */
export async function sendDeliveryEmail(params: {
  order: Order;
  inventoryItem: InventoryItem;
  productName?: string;
  usageInstructions?: string | null;
}): Promise<SendEmailResult> {
  const email = buildDeliveryEmail(
    params.order,
    params.inventoryItem.delivery_content,
    params.productName,
    params.usageInstructions
  );
  return sendEmail(email);
}

/**
 * Sends a ticket reply notification email to the customer.
 */
export async function sendTicketReplyNotification(
  ticket: any,
  replyText: string
): Promise<SendEmailResult> {
  const email = buildTicketReplyEmail(ticket, replyText);
  return sendEmail(email);
}
