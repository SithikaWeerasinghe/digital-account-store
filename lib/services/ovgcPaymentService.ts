/**
 * OVGC Payments (card) — SCAFFOLD ONLY.
 *
 * This is an intentionally INCOMPLETE placeholder. It wires up configuration,
 * the provider switch, and safe fallbacks so the rest of the app can be built
 * around OVGC, but it never creates a real payment session and never marks an
 * order paid. The real API calls are left as clearly-marked TODOs to be filled
 * in once OVGC provides official API documentation + credentials.
 *
 * Hard rules (do not violate when completing this):
 *  - Server-side only. Never expose OVGC_API_KEY / OVGC_WEBHOOK_SECRET to the browser.
 *  - Use OVGC's HOSTED checkout (redirect) only. NEVER collect raw card details.
 *  - Never mark an order paid without a verified OVGC webhook signature.
 *
 * See docs/ovgc-integration-requirements.md for exactly what is still needed.
 */

const PROVIDER = (process.env.CARD_PAYMENT_PROVIDER || 'mercadopago').toLowerCase();
const API_KEY = process.env.OVGC_API_KEY?.trim() || undefined;
const WEBHOOK_SECRET = process.env.OVGC_WEBHOOK_SECRET?.trim() || undefined;
const BASE_URL = process.env.OVGC_BASE_URL?.trim() || undefined;
const SUCCESS_URL = process.env.OVGC_SUCCESS_URL?.trim() || undefined;
const CANCEL_URL = process.env.OVGC_CANCEL_URL?.trim() || undefined;
const CURRENCY = (process.env.OVGC_CURRENCY || 'EUR').toUpperCase();

/** Which provider the "card" method should use ('mercadopago' | 'ovgc'). */
export function getCardPaymentProvider(): string {
  return PROVIDER;
}

/** True when OVGC is the selected card provider. */
export function isOvgcSelected(): boolean {
  return PROVIDER === 'ovgc';
}

/**
 * True when the minimum OVGC credentials are present. Note: even when this is
 * true the integration is still NOT implemented (createOvgcCheckout is a TODO),
 * so checkout will report "not_implemented" until the real API is wired in.
 */
export function isOvgcConfigured(): boolean {
  return !!(API_KEY && BASE_URL);
}

export type OvgcCheckoutInput = {
  reference: string; // shared checkout reference (our order_id)
  amount: number; // price amount in OVGC_CURRENCY
  orderDescription?: string;
  customerEmail?: string;
  siteUrl?: string;
};

export type OvgcCheckoutResult =
  | { ok: true; checkoutUrl: string; providerPaymentId: string }
  | { ok: false; code: 'not_configured' | 'not_implemented'; message: string };

/**
 * Create a hosted OVGC checkout session and return its redirect URL.
 *
 * SCAFFOLD: returns not_configured / not_implemented. It MUST NOT fake a
 * successful session. Fill in the TODOs once OVGC docs are available.
 */
export async function createOvgcCheckout(
  _input: OvgcCheckoutInput
): Promise<OvgcCheckoutResult> {
  if (!isOvgcConfigured()) {
    return {
      ok: false,
      code: 'not_configured',
      message: 'OVGC is not configured (missing OVGC_API_KEY / OVGC_BASE_URL).',
    };
  }

  // TODO(OVGC): Implement the real hosted-checkout call once docs are provided.
  //   - Endpoint:        `${BASE_URL}` + <create-checkout path>  (TODO: exact path)
  //   - Method:          POST (TODO: confirm)
  //   - Auth header:     TODO: e.g. `Authorization: Bearer ${API_KEY}` OR `x-api-key: ${API_KEY}`
  //   - Request body:    TODO: amount, currency (CURRENCY), reference (_input.reference),
  //                      customer email, success_url (SUCCESS_URL), cancel_url (CANCEL_URL),
  //                      webhook/callback url (OVGC_WEBHOOK_URL).
  //   - Response:        TODO: extract hosted-page redirect URL + provider payment/session id.
  //   Then: return { ok: true, checkoutUrl: <redirect>, providerPaymentId: <id> };
  //
  // Until then, do NOT create a broken session and do NOT fake success:
  return {
    ok: false,
    code: 'not_implemented',
    message: 'OVGC card payments are not implemented yet.',
  };
}

/**
 * Verify an OVGC webhook/IPN signature.
 *
 * SCAFFOLD: always returns false (cannot verify without the official signature
 * scheme). This guarantees no order is ever marked paid from an unverified
 * payload. Implement once OVGC documents the header name + algorithm.
 */
export function verifyOvgcSignature(_rawBody: string, _signature: string | null): boolean {
  if (!WEBHOOK_SECRET) return false;

  // TODO(OVGC): Implement signature verification per OVGC docs, e.g.:
  //   - header name:  TODO (e.g. 'x-ovgc-signature')
  //   - algorithm:    TODO (e.g. HMAC-SHA256 over the raw body, hex/base64)
  //   - compare with timingSafeEqual against OVGC_WEBHOOK_SECRET.
  // Returning false until implemented is intentional and safe.
  return false;
}

export type OvgcMappedStatus = 'paid' | 'failed' | 'refunded' | 'pending';

/**
 * Map an OVGC payment status to our order status.
 *
 * SCAFFOLD: returns 'pending' for everything so nothing is ever treated as paid
 * until the real status values are known. (TODO: map OVGC's paid/failed/expired.)
 */
export function mapOvgcStatus(_status: string): OvgcMappedStatus {
  // TODO(OVGC): map real values, e.g.
  //   'completed' | 'paid' | 'success' -> 'paid'
  //   'failed' | 'declined' | 'expired' | 'cancelled' -> 'failed'
  //   'refunded' -> 'refunded'
  //   else -> 'pending'
  return 'pending';
}
