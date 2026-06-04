import { Order } from '@/types/order';
import { APP_NAME } from '@/lib/constants';

const BRAND_COLOR = '#009ee3';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@apexfled.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexfled.com';

function formatEUR(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount);
}

/** Shared outer wrapper so all emails share the same look. */
function wrap(title: string, innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:28px 32px;text-align:center;">
              <span style="font-size:24px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#ffffff;">
                APEX<span style="color:${BRAND_COLOR};">FLED</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${innerHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                Need help? Contact us at
                <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};text-decoration:none;">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function statusBadge(label: string, color: string, bg: string): string {
  return `<span style="display:inline-block;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${color};background-color:${bg};">${label}</span>`;
}

interface OrderEmailOptions {
  /** Optional digital credentials/delivery content to include in the email. */
  credentials?: string;
}

/**
 * Customer-facing order confirmation email.
 * If `credentials` is provided, a "Your Access Details" section is added.
 */
export function buildOrderConfirmationEmail(order: Order, options: OrderEmailOptions = {}) {
  const invoice = order.invoice_number || order.id;
  const email = order.customer_email || order.userId;
  const productName = order.items?.[0]?.product?.name || order.product_id || 'Digital Product';
  const quantity = order.quantity ?? order.items?.[0]?.quantity ?? 1;
  const method = (order.payment_method || order.paymentMethod || 'card').toUpperCase();
  const paymentStatus = order.payment_status || (order.status === 'completed' ? 'paid' : order.status);
  const deliveryStatus = order.delivery_status || 'pending';
  const paid = paymentStatus === 'paid';

  const paymentBadge = paid
    ? statusBadge('Payment Received', '#047857', '#d1fae5')
    : statusBadge('Pending Payment', '#b45309', '#fef3c7');

  const hasDiscount = !!order.discount_code && (order.discount_amount ?? 0) > 0;
  const discountRows = hasDiscount
    ? `
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Subtotal</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${formatEUR(order.original_amount ?? order.totalAmount)}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#15803d;border-bottom:1px solid #e2e8f0;">Discount (${order.discount_code})</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#15803d;border-bottom:1px solid #e2e8f0;text-align:right;">-${formatEUR(order.discount_amount ?? 0)}</td>
      </tr>`
    : '';

  const credentialsBlock = options.credentials
    ? `
      <div style="margin:24px 0;padding:20px;background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#047857;">🚀 Your Access Details</p>
        <pre style="margin:0;padding:12px;background-color:#ffffff;border:1px solid #d1fae5;border-radius:8px;font-family:'Courier New',monospace;font-size:14px;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${options.credentials}</pre>
      </div>`
    : `
      <div style="margin:24px 0;padding:16px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
        <p style="margin:0;font-size:14px;color:#1e40af;">
          ⏳ Your digital product will be delivered to this email shortly after payment is confirmed.
        </p>
      </div>`;

  const inner = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">Thank you for your order!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi, we've received your order. Here are the details below.
    </p>

    <div style="margin-bottom:8px;">${paymentBadge}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;">Invoice Number</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#0f172a;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:right;font-family:'Courier New',monospace;">${invoice}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Product</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${productName}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Quantity</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${quantity}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Payment Method</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${method}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Payment Status</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:${paid ? '#047857' : '#b45309'};border-bottom:1px solid #e2e8f0;text-align:right;text-transform:uppercase;">${paymentStatus}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Delivery Status</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:${deliveryStatus === 'delivered' ? '#047857' : '#b45309'};border-bottom:1px solid #e2e8f0;text-align:right;text-transform:uppercase;">${deliveryStatus}</td>
      </tr>
      ${discountRows}
      <tr>
        <td style="padding:16px;font-size:14px;font-weight:800;color:#0f172a;background-color:#f8fafc;">Total</td>
        <td style="padding:16px;font-size:20px;font-weight:900;color:${BRAND_COLOR};background-color:#f8fafc;text-align:right;">${formatEUR(order.final_amount ?? order.totalAmount)}</td>
      </tr>
    </table>

    ${credentialsBlock}

    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${SITE_URL}" style="display:inline-block;padding:12px 32px;background-color:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;border-radius:10px;">Visit Store</a>
    </div>

    <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
      Keep this email for your records. If you have any questions about your order, reply to this email or contact our support team.
    </p>`;

  return {
    to: email,
    subject: `Order Confirmation — ${invoice}`,
    html: wrap(`Order Confirmation ${invoice}`, inner),
  };
}

/**
 * Internal notification sent to the store owner/admin when a new order arrives.
 */
export function buildAdminNotificationEmail(order: Order, adminEmail: string) {
  const invoice = order.invoice_number || order.id;
  const email = order.customer_email || order.userId;
  const productName = order.items?.[0]?.product?.name || order.product_id || 'Digital Product';
  const method = (order.payment_method || order.paymentMethod || 'card').toUpperCase();
  const paymentStatus = order.payment_status || (order.status === 'completed' ? 'paid' : order.status);
  const paid = paymentStatus === 'paid';

  const inner = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">🔔 New Order Received</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      A new order has been placed on the store.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;">Invoice</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#0f172a;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:right;font-family:'Courier New',monospace;">${invoice}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Customer</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${email}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Product</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${productName}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Payment Method</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${method}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Payment Status</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:${paid ? '#047857' : '#b45309'};border-bottom:1px solid #e2e8f0;text-align:right;text-transform:uppercase;">${paymentStatus}</td>
      </tr>
      <tr>
        <td style="padding:16px;font-size:14px;font-weight:800;color:#0f172a;background-color:#f8fafc;">Amount</td>
        <td style="padding:16px;font-size:20px;font-weight:900;color:${BRAND_COLOR};background-color:#f8fafc;text-align:right;">${formatEUR(order.totalAmount)}</td>
      </tr>
    </table>

    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${SITE_URL}/admin/orders" style="display:inline-block;padding:12px 32px;background-color:#0f172a;color:#ffffff;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;border-radius:10px;">Open Admin Dashboard</a>
    </div>`;

  return {
    to: adminEmail,
    subject: `New Order — ${invoice} (${formatEUR(order.totalAmount)})`,
    html: wrap(`New Order ${invoice}`, inner),
  };
}

/**
 * Digital delivery email: sends account/license/access details to customer.
 * Shows the delivery content in a prominent green box.
 */
export function buildDeliveryEmail(
  order: Order,
  deliveryContent: string,
  productName?: string
) {
  const invoice = order.invoice_number || order.id;
  const email = order.customer_email || order.userId;
  const productDisplay = productName || order.items?.[0]?.product?.name || 'Digital Product';

  // Selected variant/option and guarantee (shown only when present).
  const optionLabel = order.order_metadata?.product_option?.label;
  const guaranteeLabel = order.order_metadata?.guarantee?.label;

  const optionRow = optionLabel
    ? `
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Product / Plan</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(optionLabel)}</td>
      </tr>`
    : '';
  const guaranteeRow = guaranteeLabel
    ? `
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Warranty</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(guaranteeLabel)}</td>
      </tr>`
    : '';

  const inner = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">✓ Your Digital Access</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Your order has been confirmed and your digital access details are below. Keep this information private and secure.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;">Invoice</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#0f172a;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:right;font-family:'Courier New',monospace;">${invoice}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">Product</td>
        <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;text-align:right;">${productDisplay}</td>
      </tr>
      ${optionRow}
      ${guaranteeRow}
    </table>

    <div style="margin:24px 0;padding:16px;background-color:#f0fdf4;border:2px solid #16a34a;border-radius:12px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">
        Your Access Details
      </p>
      <pre style="margin:0;padding:12px;background-color:#ffffff;border:1px solid #dcfce7;border-radius:8px;font-size:13px;font-family:'Courier New',monospace;color:#0f172a;line-height:1.5;overflow-x:auto;white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(deliveryContent)}</pre>
    </div>

    <div style="margin:24px 0;padding:16px;background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
        <strong>Security Notice:</strong> Keep this information private. Do not share these credentials with anyone. If you believe your access has been compromised, contact support immediately.
      </p>
    </div>

    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${SITE_URL}" style="display:inline-block;padding:12px 32px;background-color:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;border-radius:10px;">Return to Store</a>
    </div>`;

  return {
    to: email,
    subject: `Your Digital Access — ${productDisplay} (${invoice})`,
    html: wrap(`Digital Access ${invoice}`, inner),
  };
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function buildTicketReplyEmail(ticket: any, replyText: string) {
  const ticketIdDisplay = ticket.id.substring(0, 8);
  const inner = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">📩 Ticket Reply Received</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${ticket.name || 'Customer'}, our support team has replied to your support ticket.
    </p>

    <div style="margin:24px 0;padding:20px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Ticket Information</p>
      <span style="font-size:14px;color:#0f172a;"><strong>Ticket ID:</strong> TKT-${ticketIdDisplay.toUpperCase()}</span><br/>
      <span style="font-size:14px;color:#0f172a;"><strong>Subject:</strong> ${ticket.subject}</span><br/>
      <span style="font-size:14px;color:#0f172a;"><strong>Status:</strong> ${ticket.status.toUpperCase()}</span>
    </div>

    <div style="margin:24px 0;padding:20px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1d4ed8;">💬 Support Team Reply</p>
      <div style="font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(replyText)}</div>
    </div>

    <div style="margin:24px 0;padding:20px;background-color:#fafafa;border:1px solid #e5e5e5;border-radius:12px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#737373;">Your Original Message</p>
      <div style="font-size:13px;color:#525252;line-height:1.5;white-space:pre-wrap;">${escapeHtml(ticket.message)}</div>
    </div>

    <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
      Please do not reply directly to this automated email. If you need further help, please submit a new ticket or check your status on our platform.
    </p>`;

  return {
    to: ticket.email || ticket.userId,
    subject: `[Support Ticket #${ticketIdDisplay.toUpperCase()}] Re: ${ticket.subject}`,
    html: wrap(`Support Ticket Reply`, inner),
  };
}
