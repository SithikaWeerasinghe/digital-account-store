import { createHmac, timingSafeEqual } from 'crypto';

/**
 * NOWPayments (automatic crypto) integration helper.
 *
 * Uses the NOWPayments REST API directly via fetch — no SDK. The API key and IPN
 * secret are read from the server environment only and are NEVER sent to the
 * browser. We use the Invoice API so the customer is redirected to a hosted
 * NOWPayments page where they can pay with any supported cryptocurrency.
 */

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
const PRICE_CURRENCY = (process.env.NOWPAYMENTS_PRICE_CURRENCY || 'eur').toLowerCase();
const PAY_CURRENCY = process.env.NOWPAYMENTS_PAY_CURRENCY?.trim() || undefined;
const SUCCESS_URL = process.env.NOWPAYMENTS_SUCCESS_URL?.trim() || undefined;
const CANCEL_URL = process.env.NOWPAYMENTS_CANCEL_URL?.trim() || undefined;
const IPN_CALLBACK_URL = process.env.NOWPAYMENTS_IPN_CALLBACK_URL?.trim() || undefined;

const NP_API_BASE = 'https://api.nowpayments.io/v1';

/** True when a NOWPayments API key is configured (enables automatic crypto). */
export function isNowPaymentsConfigured(): boolean {
  return !!API_KEY;
}

export interface CreateNowPaymentsInput {
  /** Shared checkout reference; sent to NOWPayments as order_id and echoed in the IPN. */
  reference: string;
  /** Price amount in the price currency (EUR by default). */
  amount: number;
  orderDescription?: string;
  customerEmail?: string;
  /** Absolute site URL used to build success/cancel/IPN URLs when envs are unset. */
  siteUrl?: string;
  priceCurrency?: string;
  payCurrency?: string;
}

export interface NowPaymentsInvoice {
  id: string;
  invoice_url: string;
}

/**
 * Creates a NOWPayments invoice and returns its hosted payment URL.
 * Throws if not configured or if NOWPayments rejects the request.
 */
export async function createNowPaymentsPayment(
  input: CreateNowPaymentsInput
): Promise<NowPaymentsInvoice> {
  if (!API_KEY) {
    throw new Error('NOWPayments is not configured (NOWPAYMENTS_API_KEY missing)');
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid order amount');
  }

  const site = (input.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const successUrl = SUCCESS_URL || (site ? `${site}/checkout/success` : undefined);
  const cancelUrl = CANCEL_URL || (site ? `${site}/checkout/cancel` : undefined);
  const ipnUrl = IPN_CALLBACK_URL || (site ? `${site}/api/webhooks/nowpayments` : undefined);

  const body: Record<string, any> = {
    price_amount: Number(amount.toFixed(2)),
    price_currency: (input.priceCurrency || PRICE_CURRENCY).toLowerCase(),
    order_id: input.reference,
    order_description: (input.orderDescription || `Order ${input.reference}`).slice(0, 240),
  };
  if (ipnUrl) body.ipn_callback_url = ipnUrl;
  if (successUrl) body.success_url = successUrl;
  if (cancelUrl) body.cancel_url = cancelUrl;
  // Pay currency is optional: when unset, the customer chooses the coin on the
  // NOWPayments page (accept-all-crypto behaviour).
  const payCur = input.payCurrency || PAY_CURRENCY;
  if (payCur) body.pay_currency = payCur.toLowerCase();

  const res = await fetch(`${NP_API_BASE}/invoice`, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok || !data?.id || !data?.invoice_url) {
    throw new Error(data?.message || `NOWPayments API error: ${res.status}`);
  }

  return { id: String(data.id), invoice_url: String(data.invoice_url) };
}

/** Recursively sorts object keys so the signature manifest is deterministic. */
function sortDeep(value: any): any {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, any>>((acc, k) => {
        acc[k] = sortDeep(value[k]);
        return acc;
      }, {});
  }
  return value;
}

/**
 * Verifies the NOWPayments IPN signature (x-nowpayments-sig header).
 * NOWPayments signs the HMAC-SHA512 of the JSON body with keys sorted
 * alphabetically, using the IPN secret.
 *
 * Returns true when no IPN secret is configured (verification skipped — dev),
 * or when the signature matches. Returns false only on an explicit mismatch.
 */
export function verifyNowPaymentsSignature(rawBody: string, signature: string | null): boolean {
  if (!IPN_SECRET) return true; // not enforced until configured
  if (!signature) return false;

  let parsed: any;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }

  const sortedString = JSON.stringify(sortDeep(parsed));
  const computed = createHmac('sha512', IPN_SECRET).update(sortedString).digest('hex');

  try {
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(signature, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type NowPaymentsMappedStatus = 'paid' | 'failed' | 'refunded' | 'pending';

/**
 * Maps a NOWPayments payment_status to the store's order status.
 * Only `finished` and `confirmed` are treated as paid (safe to deliver).
 * `partially_paid`, `sending`, `confirming`, `waiting` stay pending.
 */
export function mapNowPaymentsStatus(status: string): NowPaymentsMappedStatus {
  switch ((status || '').toLowerCase()) {
    case 'finished':
    case 'confirmed':
      return 'paid';
    case 'failed':
    case 'expired':
      return 'failed';
    case 'refunded':
      return 'refunded';
    // waiting | confirming | sending | partially_paid → not final / not safe
    default:
      return 'pending';
  }
}
