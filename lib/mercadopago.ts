import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Mercado Pago (Checkout Pro) integration helper.
 *
 * Uses the Mercado Pago REST API directly via fetch — no SDK dependency, same
 * pattern as lib/services/emailService.ts. The MERCADOPAGO_ACCESS_TOKEN is read
 * from the server environment only and is NEVER sent to the browser.
 */

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;
const DEFAULT_CURRENCY = process.env.MERCADOPAGO_CURRENCY || 'ARS';

const MP_API_BASE = 'https://api.mercadopago.com';

/** True when a Mercado Pago access token is configured. */
export function isMercadoPagoConfigured(): boolean {
  return !!ACCESS_TOKEN;
}

export interface PreferenceItemInput {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePreferenceParams {
  /** Primary Supabase order id — used as external_reference and metadata.order_id. */
  orderId: string;
  /** All Supabase order ids in this checkout (multi-item carts create one order per item). */
  orderIds?: string[];
  invoiceNumber?: string;
  customerEmail?: string;
  items: PreferenceItemInput[];
  currency?: string;
  /** Absolute site URL, e.g. https://store.com — used to build back/notification URLs. */
  siteUrl: string;
}

export interface PreferenceResult {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

/**
 * Creates a Checkout Pro preference and returns the redirect URLs.
 * Throws if not configured or if Mercado Pago rejects the request.
 */
export async function createCheckoutPreference(
  params: CreatePreferenceParams
): Promise<PreferenceResult> {
  if (!ACCESS_TOKEN) {
    throw new Error('Mercado Pago is not configured (MERCADOPAGO_ACCESS_TOKEN missing)');
  }

  const siteUrl = params.siteUrl.replace(/\/$/, '');
  const currency = params.currency || DEFAULT_CURRENCY;
  const ref = encodeURIComponent(params.orderId);

  // Our own order_id is appended so the result pages know the order even before
  // the webhook runs. Mercado Pago appends its own params (payment_id, status...).
  const backUrls = {
    success: `${siteUrl}/checkout/success?order_id=${ref}`,
    failure: `${siteUrl}/checkout/failed?order_id=${ref}`,
    pending: `${siteUrl}/checkout/pending?order_id=${ref}`,
  };

  const preferenceBody = {
    items: params.items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      currency_id: currency,
    })),
    payer: params.customerEmail ? { email: params.customerEmail } : undefined,
    back_urls: backUrls,
    auto_return: 'approved',
    external_reference: params.orderId,
    notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    metadata: {
      order_id: params.orderId,
      order_ids: params.orderIds && params.orderIds.length > 0 ? params.orderIds : [params.orderId],
      invoice_number: params.invoiceNumber ?? null,
    },
    statement_descriptor: 'APEXFLED',
    locale: 'en-US',
  };

  const response = await fetch(`${MP_API_BASE}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferenceBody),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || `Mercado Pago API error: ${response.status}`;
    throw new Error(message);
  }

  return {
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  };
}

export interface MercadoPagoPayment {
  id: number | string;
  status: string; // approved | rejected | pending | in_process | cancelled | refunded ...
  status_detail?: string;
  external_reference?: string | null;
  order?: { id?: number | string; type?: string } | null;
  metadata?: Record<string, any> | null;
  transaction_amount?: number;
  payer?: { email?: string } | null;
}

/**
 * Fetches a payment's details from Mercado Pago by id.
 * The webhook only receives the payment id; full status is read here server-side.
 */
export async function getPayment(paymentId: string | number): Promise<MercadoPagoPayment> {
  if (!ACCESS_TOKEN) {
    throw new Error('Mercado Pago is not configured (MERCADOPAGO_ACCESS_TOKEN missing)');
  }

  const response = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || `Mercado Pago payment lookup failed: ${response.status}`;
    throw new Error(message);
  }

  return data as MercadoPagoPayment;
}

/**
 * Maps a Mercado Pago payment status to the store's order payment_status.
 * Returns null for non-final states we don't want to write (keeps order pending).
 */
export function mapPaymentStatus(
  mpStatus: string
): 'paid' | 'failed' | 'refunded' | null {
  switch (mpStatus) {
    case 'approved':
      return 'paid';
    case 'rejected':
    case 'cancelled':
      return 'failed';
    case 'refunded':
    case 'charged_back':
      return 'refunded';
    // pending / in_process / authorized -> leave order pending
    default:
      return null;
  }
}

/**
 * Verifies the Mercado Pago webhook signature (x-signature header).
 *
 * Manifest format per MP docs: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * HMAC-SHA256 with MERCADOPAGO_WEBHOOK_SECRET, compared to the v1 hash.
 *
 * Returns true when no secret is configured (verification skipped — for dev),
 * or when the signature is valid. Returns false only on an explicit mismatch.
 */
export function verifyWebhookSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  if (!WEBHOOK_SECRET) return true; // not enforced until configured
  if (!opts.xSignature || !opts.dataId) return false;

  // Parse "ts=...,v1=..."
  const parts = opts.xSignature.split(',').reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split('=').map((s) => s.trim());
    if (k && v) acc[k] = v;
    return acc;
  }, {});

  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  // data.id is lowercased when alphanumeric, per Mercado Pago documentation.
  const manifest = `id:${opts.dataId.toLowerCase()};request-id:${opts.xRequestId ?? ''};ts:${ts};`;
  const computed = createHmac('sha256', WEBHOOK_SECRET).update(manifest).digest('hex');

  try {
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(v1, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
