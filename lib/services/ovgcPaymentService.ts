import { timingSafeEqual } from 'crypto';

/**
 * OVGC Payments (card) integration.
 *
 * Uses OVGC's hosted checkout: we create a payment request server-side and
 * redirect the customer to the returned hosted checkout URL. We NEVER collect
 * raw card details, and an order is only marked paid by a verified webhook.
 *
 * Auth model (per OVGC docs):
 *  - Create payment request: api_key is sent in the JSON BODY.
 *  - Order status check: api_key is sent as the `x-api-key` HEADER.
 *  - Webhook: the signing secret arrives in the payload as `webhook_secret`.
 *
 * Server-side only — OVGC_API_KEY / OVGC_WEBHOOK_SECRET must never reach the browser.
 */

const PROVIDER = (process.env.CARD_PAYMENT_PROVIDER || 'mercadopago').toLowerCase();
const API_KEY = process.env.OVGC_API_KEY?.trim() || undefined;
const WEBHOOK_SECRET = process.env.OVGC_WEBHOOK_SECRET?.trim() || undefined;
const BASE_URL = (process.env.OVGC_BASE_URL?.trim() || 'https://billing.ovgcpayments.com/backend/api').replace(/\/$/, '');
const PAYMENT_ENDPOINT =
  process.env.OVGC_PAYMENT_ENDPOINT?.trim() ||
  'https://billing.ovgcpayments.com/backend/api/payment-request-api';
const SUCCESS_URL = process.env.OVGC_SUCCESS_URL?.trim() || undefined;
const CANCEL_URL = process.env.OVGC_CANCEL_URL?.trim() || undefined;

/** Which provider the "card" method should use ('mercadopago' | 'ovgc'). */
export function getCardPaymentProvider(): string {
  return PROVIDER;
}

/** True when OVGC is the selected card provider. */
export function isOvgcSelected(): boolean {
  return PROVIDER === 'ovgc';
}

/** True when the minimum OVGC credentials are present. */
export function isOvgcConfigured(): boolean {
  return !!API_KEY;
}

export type OvgcCheckoutInput = {
  reference: string; // our checkout reference → OVGC order_uuid (webhook matching)
  /**
   * The REAL internal order id, used only to build the success-page URL. Kept
   * separate from `reference`: the reference is prefixed (and is matched whole
   * against checkout_reference by the webhook), so it is not a valid order id
   * and the success page cannot look an order up with it.
   */
  orderId: string;
  amount: number; // total in major units (e.g. 25.00 = €25.00)
  orderDescription?: string;
  customerEmail?: string;
  firstName?: string;
  lastName?: string;
  siteUrl?: string;
};

export type OvgcCheckoutResult =
  | { ok: true; checkoutUrl: string; providerPaymentId: string }
  | { ok: false; code: 'not_configured' | 'no_checkout_url' | 'api_error'; message: string };

/** Pull the hosted checkout URL from whichever field OVGC returns it in. */
function extractCheckoutUrl(data: any): string | undefined {
  const v = data?.checkout_url || data?.payment_url || data?.redirect_url || data?.url ||
    data?.data?.checkout_url || data?.data?.payment_url || data?.data?.redirect_url || data?.data?.url;
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

/** Pull the transaction/payment id from whichever field OVGC returns it in. */
function extractPaymentId(data: any): string {
  const v =
    data?.transaction_id || data?.payment_id || data?.id ||
    data?.data?.transaction_id || data?.data?.payment_id || data?.data?.id;
  return v != null ? String(v) : '';
}

/**
 * Creates an OVGC hosted-checkout payment request and returns the redirect URL.
 */
export async function createOvgcCheckout(input: OvgcCheckoutInput): Promise<OvgcCheckoutResult> {
  if (!isOvgcConfigured()) {
    return { ok: false, code: 'not_configured', message: 'OVGC is not configured (missing OVGC_API_KEY).' };
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, code: 'api_error', message: 'Invalid order amount' };
  }

  const site = (input.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const baseSuccess = SUCCESS_URL || (site ? `${site}/checkout/success` : '');
  // Carry the REAL internal order id back to the success page (informational
  // only; payment is confirmed by the webhook, not by this redirect). This must
  // NOT be `input.reference` — that value is prefixed ("ovgc_…"), so the success
  // page's GET /api/orders/<id> lookup never matched it and the customer lost
  // the verified-review form. The webhook still matches on `reference`.
  const successUrl = baseSuccess
    ? `${baseSuccess}${baseSuccess.includes('?') ? '&' : '?'}order_id=${encodeURIComponent(input.orderId)}`
    : '';
  const cancelUrl = CANCEL_URL || (site ? `${site}/checkout/cancel` : '');

  const body: Record<string, any> = {
    api_key: API_KEY,
    order_uuid: input.reference,
    total_amount: Number(amount.toFixed(2)),
    email: input.customerEmail || '',
    success_url: successUrl,
    cancel_url: cancelUrl,
  };
  if (input.orderDescription) body.product_title = input.orderDescription.slice(0, 240);
  if (input.firstName) body.first_name = input.firstName;
  if (input.lastName) body.last_name = input.lastName;

  let res: Response;
  try {
    res = await fetch(PAYMENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    console.error('[ovgc] payment request network error:', err?.message || err);
    return { ok: false, code: 'api_error', message: 'OVGC request failed' };
  }

  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    console.error('[ovgc] payment request failed:', res.status, data?.message || data?.error || '');
    return { ok: false, code: 'api_error', message: data?.message || `OVGC API error: ${res.status}` };
  }

  const checkoutUrl = extractCheckoutUrl(data);
  if (!checkoutUrl) {
    console.error('[ovgc] payment request returned no checkout URL:', JSON.stringify(data).slice(0, 500));
    return { ok: false, code: 'no_checkout_url', message: 'OVGC did not return a checkout URL' };
  }

  return { ok: true, checkoutUrl, providerPaymentId: extractPaymentId(data) };
}

/**
 * Verifies a webhook by comparing the `webhook_secret` from the payload to
 * OVGC_WEBHOOK_SECRET (constant-time). Returns false if either is missing.
 */
export function verifyOvgcWebhookSecret(payloadSecret: unknown): boolean {
  if (!WEBHOOK_SECRET) return false;
  if (typeof payloadSecret !== 'string' || payloadSecret.length === 0) return false;
  try {
    const a = Buffer.from(payloadSecret);
    const b = Buffer.from(WEBHOOK_SECRET);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type OvgcMappedStatus = 'paid' | 'failed' | 'pending';

/**
 * Maps an OVGC status string to our order status.
 *   Paid → paid · Declined/Expired → failed · Pending (or unknown) → pending
 */
export function mapOvgcStatus(status: string): OvgcMappedStatus {
  switch ((status || '').trim().toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'success':
    case 'captured':
      return 'paid';
    case 'declined':
    case 'failed':
    case 'expired':
    case 'cancelled':
    case 'canceled':
      return 'failed';
    // 'pending' and anything else → not final
    default:
      return 'pending';
  }
}

/**
 * Optional: fetch the authoritative order status from OVGC (admin verification).
 * Uses the x-api-key header per docs. Not used for delivery decisions.
 */
export async function getOvgcPaymentStatus(transactionId: string): Promise<{ ok: boolean; status?: string; raw?: any; message?: string }> {
  if (!API_KEY) return { ok: false, message: 'OVGC not configured' };
  if (!transactionId) return { ok: false, message: 'Missing transaction id' };
  try {
    const res = await fetch(`${BASE_URL}/order-status/${encodeURIComponent(transactionId)}`, {
      method: 'GET',
      headers: { 'x-api-key': API_KEY },
    });
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: raw?.message || `OVGC status error: ${res.status}`, raw };
    const status = raw?.payment_status || raw?.status || raw?.data?.payment_status || raw?.data?.status;
    return { ok: true, status, raw };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'OVGC status request failed' };
  }
}
